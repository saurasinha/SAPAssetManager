var fs = require('fs');
var path = require('path');

function walkSync(dir, cbFunc) {
  fs.readdirSync(dir).forEach(fileName => {
    const filePath = path.join(dir, fileName);

    if (fs.statSync(filePath).isDirectory()) {
      walkSync(filePath, cbFunc);
    } else {
      cbFunc(filePath, fileName);
    }
  });
}

module.exports = function (hookArgs) {
  const platformsDir = hookArgs.projectData.platformsDir;
  const projectDir = hookArgs.projectData.projectDir;

  const androidPath = path.join(platformsDir, 'android', 'app', 'src');
  if (fs.existsSync(androidPath)) {
    const releasePath = path.join(androidPath, 'release');
    const debugPath = path.join(androidPath, 'debug');
    const mergeAndroidPath = path.join(projectDir, 'app', 'App_Resources_Merge', 'Android', 'src', 'main');
    if (fs.existsSync(mergeAndroidPath)) {
      walkSync(mergeAndroidPath, (filePath, fileName) => {
        if (fileName === '.DS_Store') {
          return;
        }

        console.log(`merging ${filePath}`);

        let skipped = true;

        const releaseXmlFolderPath = path.join(releasePath, path.relative(mergeAndroidPath, path.dirname(filePath)));
        const releaseXmlPath = path.join(releaseXmlFolderPath, fileName);
        if (!fs.existsSync(releaseXmlPath)) { // not patch
          let sContents = fs.readFileSync(filePath, 'utf8');

          const debugXmlFolderPath = path.join(debugPath, path.relative(mergeAndroidPath, path.dirname(filePath)));
          const debugXmlPath = path.join(debugXmlFolderPath, fileName);
          if (!fs.existsSync(debugXmlFolderPath)) {
            fs.mkdirSync(debugXmlFolderPath, { recursive: true });
          }
          fs.writeFileSync(debugXmlPath, sContents, 'utf8');

          if (!fs.existsSync(releaseXmlFolderPath)) {
            fs.mkdirSync(releaseXmlFolderPath, { recursive: true });
          }
          fs.writeFileSync(releaseXmlPath, sContents, 'utf8');

          console.log('done');
        }

        if (skipped) {
          console.log('skipped');
        }
      });
    }
  }
};
