  const {readFileSync: read, writeFileSync: write} = require('fs'),
  p = 'package.json',
  pkg = read(p).toString()
  ver = process.argv.splice(2).join(' ');
  u = pkg.replace(/("@nativescript\/core": ")(?:.+)(")/g, `$1${ver}$2`);
  console.log(u)
  write(p, u);
