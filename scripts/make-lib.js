'use strict';

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const terser = require('terser');

const PATHS = {
  lib: './lib',
};

// minify files
const jsFiles = glob.sync(path.join(PATHS.lib, '**/*.js'));

const options = {
  warnings: true,
  mangle: false,
};

jsFiles.forEach(async (filePath) => {
  const fileName = filePath.split('/').pop();
  const fileMapName = `${fileName}.map`;
  const fileMapPath = `${filePath}.map`;

  const result = await terser.minify(
    { [filePath]: fs.readFileSync(filePath, 'utf8') },
    {
      ...options,
      sourceMap: {
        // filename: fileName,
        content: fs.readFileSync(fileMapPath, 'utf8'),
        url: fileMapName,
      },
    }
  );

  fs.writeFileSync(filePath, result.code, 'utf8');
  fs.writeFileSync(fileMapPath, result.map, 'utf8');
});

// add package.json file to lib folder
let pkg = require('../package.json');

delete pkg.devDependencies;
pkg.private = false;
pkg.scripts = { prepublishOnly: 'cd .. && npm run build' };

fs.writeJsonSync(path.join(PATHS.lib, 'package.json'), pkg, { spaces: 2 });

fs.copySync('README.md', path.join(PATHS.lib, 'README.md'));
fs.copySync('LICENSE', path.join(PATHS.lib, 'LICENSE'));
