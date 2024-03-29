Object.defineProperty(exports, "__esModule", { value: true });
var file_system_access_1 = require("./file-system-access");
var profiling_1 = require("../profiling");
var fileAccess;
function getFileAccess() {
    if (!fileAccess) {
        fileAccess = new file_system_access_1.FileSystemAccess();
    }
    return fileAccess;
}
var platform;
function ensurePlatform() {
    if (!platform) {
        platform = require("../platform");
    }
}
function createFile(info) {
    var file = new File();
    file._path = info.path;
    file._name = info.name;
    file._extension = info.extension;
    return file;
}
function createFolder(info) {
    var documents = knownFolders.documents();
    if (info.path === documents.path) {
        return documents;
    }
    var temp = knownFolders.temp();
    if (info.path === temp.path) {
        return temp;
    }
    var folder = new Folder();
    folder._path = info.path;
    folder._name = info.name;
    return folder;
}
var FileSystemEntity = (function () {
    function FileSystemEntity() {
    }
    Object.defineProperty(FileSystemEntity.prototype, "parent", {
        get: function () {
            var onError = function (error) {
                throw error;
            };
            var folderInfo = getFileAccess().getParent(this.path, onError);
            if (!folderInfo) {
                return undefined;
            }
            return createFolder(folderInfo);
        },
        enumerable: true,
        configurable: true
    });
    FileSystemEntity.prototype.remove = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var hasError = false;
            var localError = function (error) {
                hasError = true;
                reject(error);
            };
            _this.removeSync(localError);
            if (!hasError) {
                resolve();
            }
        });
    };
    FileSystemEntity.prototype.removeSync = function (onError) {
        if (this._isKnown) {
            if (onError) {
                onError({ message: "Cannot delete known folder." });
            }
            return;
        }
        var fileAccess = getFileAccess();
        if (this instanceof File) {
            fileAccess.deleteFile(this.path, onError);
        }
        else if (this instanceof Folder) {
            fileAccess.deleteFolder(this.path, onError);
        }
    };
    FileSystemEntity.prototype.rename = function (newName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var hasError = false;
            var localError = function (error) {
                hasError = true;
                reject(error);
            };
            _this.renameSync(newName, localError);
            if (!hasError) {
                resolve();
            }
        });
    };
    FileSystemEntity.prototype.renameSync = function (newName, onError) {
        if (this._isKnown) {
            if (onError) {
                onError(new Error("Cannot rename known folder."));
            }
            return;
        }
        var parentFolder = this.parent;
        if (!parentFolder) {
            if (onError) {
                onError(new Error("No parent folder."));
            }
            return;
        }
        var fileAccess = getFileAccess();
        var path = parentFolder.path;
        var newPath = fileAccess.joinPath(path, newName);
        var localError = function (error) {
            if (onError) {
                onError(error);
            }
            return null;
        };
        fileAccess.rename(this.path, newPath, localError);
        this._path = newPath;
        this._name = newName;
        if (this instanceof File) {
            this._extension = fileAccess.getFileExtension(newPath);
        }
    };
    Object.defineProperty(FileSystemEntity.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileSystemEntity.prototype, "path", {
        get: function () {
            return this._path;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileSystemEntity.prototype, "lastModified", {
        get: function () {
            var value = this._lastModified;
            if (!this._lastModified) {
                value = this._lastModified = getFileAccess().getLastModified(this.path);
            }
            return value;
        },
        enumerable: true,
        configurable: true
    });
    return FileSystemEntity;
}());
exports.FileSystemEntity = FileSystemEntity;
var File = (function (_super) {
    __extends(File, _super);
    function File() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    File.fromPath = function (path) {
        var onError = function (error) {
            throw error;
        };
        var fileInfo = getFileAccess().getFile(path, onError);
        if (!fileInfo) {
            return undefined;
        }
        return createFile(fileInfo);
    };
    File.exists = function (path) {
        return getFileAccess().fileExists(path);
    };
    Object.defineProperty(File.prototype, "extension", {
        get: function () {
            return this._extension;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(File.prototype, "isLocked", {
        get: function () {
            return !!this._locked;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(File.prototype, "size", {
        get: function () {
            return getFileAccess().getFileSize(this.path);
        },
        enumerable: true,
        configurable: true
    });
    File.prototype.read = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _this.checkAccess();
            }
            catch (ex) {
                reject(ex);
                return;
            }
            _this._locked = true;
            getFileAccess().readAsync(_this.path).then(function (result) {
                resolve(result);
                _this._locked = false;
            }, function (error) {
                reject(error);
                _this._locked = false;
            });
        });
    };
    File.prototype.readSync = function (onError) {
        this.checkAccess();
        this._locked = true;
        var that = this;
        var localError = function (error) {
            that._locked = false;
            if (onError) {
                onError(error);
            }
        };
        var content = getFileAccess().readSync(this.path, localError);
        this._locked = false;
        return content;
    };
    File.prototype.write = function (content) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _this.checkAccess();
            }
            catch (ex) {
                reject(ex);
                return;
            }
            _this._locked = true;
            getFileAccess().writeAsync(_this.path, content).then(function () {
                resolve();
                _this._locked = false;
            }, function (error) {
                reject(error);
                _this._locked = false;
            });
        });
    };
    File.prototype.writeSync = function (content, onError) {
        this.checkAccess();
        try {
            this._locked = true;
            var that_1 = this;
            var localError = function (error) {
                that_1._locked = false;
                if (onError) {
                    onError(error);
                }
            };
            getFileAccess().writeSync(this.path, content, localError);
        }
        finally {
            this._locked = false;
        }
    };
    File.prototype.readText = function (encoding) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _this.checkAccess();
            }
            catch (ex) {
                reject(ex);
                return;
            }
            _this._locked = true;
            getFileAccess().readTextAsync(_this.path, encoding).then(function (result) {
                resolve(result);
                _this._locked = false;
            }, function (error) {
                reject(error);
                _this._locked = false;
            });
        });
    };
    File.prototype.readTextSync = function (onError, encoding) {
        this.checkAccess();
        this._locked = true;
        var that = this;
        var localError = function (error) {
            that._locked = false;
            if (onError) {
                onError(error);
            }
        };
        var content = getFileAccess().readTextSync(this.path, localError, encoding);
        this._locked = false;
        return content;
    };
    File.prototype.writeText = function (content, encoding) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _this.checkAccess();
            }
            catch (ex) {
                reject(ex);
                return;
            }
            _this._locked = true;
            getFileAccess().writeTextAsync(_this.path, content, encoding).then(function () {
                resolve();
                _this._locked = false;
            }, function (error) {
                reject(error);
                _this._locked = false;
            });
        });
    };
    File.prototype.writeTextSync = function (content, onError, encoding) {
        this.checkAccess();
        try {
            this._locked = true;
            var that_2 = this;
            var localError = function (error) {
                that_2._locked = false;
                if (onError) {
                    onError(error);
                }
            };
            getFileAccess().writeTextSync(this.path, content, localError, encoding);
        }
        finally {
            this._locked = false;
        }
    };
    File.prototype.checkAccess = function () {
        if (this.isLocked) {
            throw new Error("Cannot access a locked file.");
        }
    };
    __decorate([
        profiling_1.profile
    ], File.prototype, "readTextSync", null);
    return File;
}(FileSystemEntity));
exports.File = File;
var Folder = (function (_super) {
    __extends(Folder, _super);
    function Folder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Folder.fromPath = function (path) {
        var onError = function (error) {
            throw error;
        };
        var folderInfo = getFileAccess().getFolder(path, onError);
        if (!folderInfo) {
            return undefined;
        }
        return createFolder(folderInfo);
    };
    Folder.exists = function (path) {
        return getFileAccess().folderExists(path);
    };
    Folder.prototype.contains = function (name) {
        var fileAccess = getFileAccess();
        var path = fileAccess.joinPath(this.path, name);
        if (fileAccess.fileExists(path)) {
            return true;
        }
        return fileAccess.folderExists(path);
    };
    Folder.prototype.clear = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var hasError = false;
            var onError = function (error) {
                hasError = true;
                reject(error);
            };
            _this.clearSync(onError);
            if (!hasError) {
                resolve();
            }
        });
    };
    Folder.prototype.clearSync = function (onError) {
        getFileAccess().emptyFolder(this.path, onError);
    };
    Object.defineProperty(Folder.prototype, "isKnown", {
        get: function () {
            return this._isKnown;
        },
        enumerable: true,
        configurable: true
    });
    Folder.prototype.getFile = function (name) {
        var fileAccess = getFileAccess();
        var path = fileAccess.joinPath(this.path, name);
        var onError = function (error) {
            throw error;
        };
        var fileInfo = fileAccess.getFile(path, onError);
        if (!fileInfo) {
            return undefined;
        }
        return createFile(fileInfo);
    };
    Folder.prototype.getFolder = function (name) {
        var fileAccess = getFileAccess();
        var path = fileAccess.joinPath(this.path, name);
        var onError = function (error) {
            throw error;
        };
        var folderInfo = fileAccess.getFolder(path, onError);
        if (!folderInfo) {
            return undefined;
        }
        return createFolder(folderInfo);
    };
    Folder.prototype.getEntities = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var hasError = false;
            var localError = function (error) {
                hasError = true;
                reject(error);
            };
            var entities = _this.getEntitiesSync(localError);
            if (!hasError) {
                resolve(entities);
            }
        });
    };
    Folder.prototype.getEntitiesSync = function (onError) {
        var fileInfos = getFileAccess().getEntities(this.path, onError);
        if (!fileInfos) {
            return null;
        }
        var entities = new Array();
        for (var i = 0; i < fileInfos.length; i++) {
            if (fileInfos[i].extension) {
                entities.push(createFile(fileInfos[i]));
            }
            else {
                entities.push(createFolder(fileInfos[i]));
            }
        }
        return entities;
    };
    Folder.prototype.eachEntity = function (onEntity) {
        if (!onEntity) {
            return;
        }
        var onSuccess = function (fileInfo) {
            var entity;
            if (fileInfo.extension) {
                entity = createFile(fileInfo);
            }
            else {
                entity = createFolder(fileInfo);
            }
            return onEntity(entity);
        };
        var onError = function (error) {
            throw error;
        };
        getFileAccess().eachEntity(this.path, onSuccess, onError);
    };
    return Folder;
}(FileSystemEntity));
exports.Folder = Folder;
var knownFolders;
(function (knownFolders) {
    var _documents;
    var _temp;
    var _app;
    function documents() {
        if (!_documents) {
            var path_1 = getFileAccess().getDocumentsFolderPath();
            _documents = new Folder();
            _documents._path = path_1;
            _documents._isKnown = true;
        }
        return _documents;
    }
    knownFolders.documents = documents;
    function temp() {
        if (!_temp) {
            var path_2 = getFileAccess().getTempFolderPath();
            _temp = new Folder();
            _temp._path = path_2;
            _temp._isKnown = true;
        }
        return _temp;
    }
    knownFolders.temp = temp;
    function currentApp() {
        if (!_app) {
            var path_3 = getFileAccess().getCurrentAppPath();
            _app = new Folder();
            _app._path = path_3;
            _app._isKnown = true;
        }
        return _app;
    }
    knownFolders.currentApp = currentApp;
    var ios;
    (function (ios) {
        function _checkPlatform(knownFolderName) {
            ensurePlatform();
            if (!platform.isIOS) {
                throw new Error("The \"" + knownFolderName + "\" known folder is available on iOS only!");
            }
        }
        var _library;
        function library() {
            _checkPlatform("library");
            if (!_library) {
                var existingFolderInfo = getExistingFolderInfo(5);
                if (existingFolderInfo) {
                    _library = existingFolderInfo.folder;
                    _library._path = existingFolderInfo.path;
                    _library._isKnown = true;
                }
            }
            return _library;
        }
        ios.library = library;
        var _developer;
        function developer() {
            _checkPlatform("developer");
            if (!_developer) {
                var existingFolderInfo = getExistingFolderInfo(6);
                if (existingFolderInfo) {
                    _developer = existingFolderInfo.folder;
                    _developer._path = existingFolderInfo.path;
                    _developer._isKnown = true;
                }
            }
            return _developer;
        }
        ios.developer = developer;
        var _desktop;
        function desktop() {
            _checkPlatform("desktop");
            if (!_desktop) {
                var existingFolderInfo = getExistingFolderInfo(12);
                if (existingFolderInfo) {
                    _desktop = existingFolderInfo.folder;
                    _desktop._path = existingFolderInfo.path;
                    _desktop._isKnown = true;
                }
            }
            return _desktop;
        }
        ios.desktop = desktop;
        var _downloads;
        function downloads() {
            _checkPlatform("downloads");
            if (!_downloads) {
                var existingFolderInfo = getExistingFolderInfo(15);
                if (existingFolderInfo) {
                    _downloads = existingFolderInfo.folder;
                    _downloads._path = existingFolderInfo.path;
                    _downloads._isKnown = true;
                }
            }
            return _downloads;
        }
        ios.downloads = downloads;
        var _movies;
        function movies() {
            _checkPlatform("movies");
            if (!_movies) {
                var existingFolderInfo = getExistingFolderInfo(17);
                if (existingFolderInfo) {
                    _movies = existingFolderInfo.folder;
                    _movies._path = existingFolderInfo.path;
                    _movies._isKnown = true;
                }
            }
            return _movies;
        }
        ios.movies = movies;
        var _music;
        function music() {
            _checkPlatform("music");
            if (!_music) {
                var existingFolderInfo = getExistingFolderInfo(18);
                if (existingFolderInfo) {
                    _music = existingFolderInfo.folder;
                    _music._path = existingFolderInfo.path;
                    _music._isKnown = true;
                }
            }
            return _music;
        }
        ios.music = music;
        var _pictures;
        function pictures() {
            _checkPlatform("pictures");
            if (!_pictures) {
                var existingFolderInfo = getExistingFolderInfo(19);
                if (existingFolderInfo) {
                    _pictures = existingFolderInfo.folder;
                    _pictures._path = existingFolderInfo.path;
                    _pictures._isKnown = true;
                }
            }
            return _pictures;
        }
        ios.pictures = pictures;
        var _sharedPublic;
        function sharedPublic() {
            _checkPlatform("sharedPublic");
            if (!_sharedPublic) {
                var existingFolderInfo = getExistingFolderInfo(21);
                if (existingFolderInfo) {
                    _sharedPublic = existingFolderInfo.folder;
                    _sharedPublic._path = existingFolderInfo.path;
                    _sharedPublic._isKnown = true;
                }
            }
            return _sharedPublic;
        }
        ios.sharedPublic = sharedPublic;
        function getExistingFolderInfo(pathDirectory) {
            var fileAccess = getFileAccess();
            var folderPath = fileAccess.getKnownPath(pathDirectory);
            var folderInfo = fileAccess.getExistingFolder(folderPath);
            if (folderInfo) {
                return {
                    folder: createFolder(folderInfo),
                    path: folderPath
                };
            }
            return undefined;
        }
    })(ios = knownFolders.ios || (knownFolders.ios = {}));
})(knownFolders = exports.knownFolders || (exports.knownFolders = {}));
var path;
(function (path_4) {
    function normalize(path) {
        return getFileAccess().normalizePath(path);
    }
    path_4.normalize = normalize;
    function join() {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        var fileAccess = getFileAccess();
        return fileAccess.joinPaths(paths);
    }
    path_4.join = join;
    path_4.separator = getFileAccess().getPathSeparator();
})(path = exports.path || (exports.path = {}));
//# sourceMappingURL=file-system.js.map