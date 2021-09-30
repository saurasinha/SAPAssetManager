#!/usr/bin/env node

const fs = require('fs');
const Jimp = require("jimp");
const isValid = require('is-valid-path');
const path = require('path');
const program = require('commander');

if (require.main === module) {
  program
  .version('1.0.0')
  .option('-i, --icon <file-path>', 'Base icon (at least 1024x1024)')
  .option('-a, --appIconSet <dir-path>', 'Path to AppIcon.appiconset/ dir (...App_Resources/iOS/Assets.xcassets/AppIcon.appiconset)')
  .parse(process.argv);
  invoke(program);
}
exports.invoke = invoke;

function invoke(appIconsParams) {
  let icon = appIconsParams.icon;
  if (!icon || !isValid(icon) || !fs.statSync(icon).isFile()) {
    console.error(`Invalid icon file: ${icon}`);
    program.outputHelp();
    process.exit(1);
  }
  let appIconSet = appIconsParams.appIconSet;
  if (!appIconSet || !isValid(appIconSet) || !fs.statSync(appIconSet).isDirectory()) {
    console.error(`Invalid project dir: ${appIconSet}`);
    program.outputHelp();
    process.exit(1);
  }

  const iosFormats = {
    'iphone': [
      {
        // iPhone notification iOS 7-11
        size: 20,
        scales: [2, 3]
      }, {
        // iPhone spotlight iOS 5-6
        // iPhone settings iOS 5-11
        size: 29,
        scales: [1, 2, 3]
      }, {
        // iPhone spotlight iOS 7-11
        size: 40,
        scales: [2, 3]
      }, {
        // iPhone app iOS 5-6
        size: 57,
        scales: [1, 2]
      }, {
        // iPhone app iOS 7-11
        size: 60,
        scales: [2, 3]
      }
    ],
    'ipad': [
      {
        // iPad notifications iOS 7-11
        size: 20,
        scales: [1, 2]
      }, {
        // iPad settings iOS 7-11
        size: 29,
        scales: [1, 2]
      }, {
        // iPad spotlight iOS 7-11
        size: 40,
        scales: [1, 2]
      }, {
        // iPad spotlight iOS 5-6
        size: 50,
        scales: [1, 2]
      }, {
        // iPad app iOS 5-6
        size: 72,
        scales: [1, 2]
      }, {
        // iPad app iOS 7-11
        size: 76,
        scales: [1, 2]
      }, {
        // iPad Pro app iOS 9-11
        size: 83.5,
        scales: [2]
      }
    ],
    'ios-marketing': [
      {
        // App Store
        size: 1024,
        scales: [1]
      }
    ]
  };

  let promises = [];

  let contents = {
    "images": [],
    "info" : {
      "version" : 1,
      "author" : "xcode"
    }
  };

  for (const idiom in iosFormats) {
    if (iosFormats.hasOwnProperty(idiom)) {
      const formats = iosFormats[idiom];
      formats.forEach(format => {
        format.scales.forEach(scale => {
          promises.push(resize(icon, format.size, scale, appIconSet));
          contents.images.push({
            size: `${format.size}x${format.size}`,
            idiom,
            filename: fileName(format.size, scale),
            scale: `${scale}x`
          });
        });
      });
    }
  }

  return Promise.all(promises).then(() => {
    let json = JSON.stringify(contents, null, '  ');
    fs.writeFileSync(path.join(appIconSet, 'Contents.json'), json, 'utf8');
  }).catch(err => {
    console.log(err);
    console.error(err);
    process.exit(1);
  });
}



function fileName(size, scale) {
  let name = `icon-${size}`;
  if (scale && scale > 1) {
    name += `@${scale}x`;
  }
  name += '.png';
  return name;
}

function resize(file, size, scale, appIconSet) {
  scale = scale || 1;
  let output = fileName(size, scale);
  return Jimp.read(file).then(icon => {
    return new Promise((resolve, reject) => {
      icon.resize(size * scale, size * scale)
      .deflateLevel(0)
      .write(path.join(appIconSet, output), resolve);
    });
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}