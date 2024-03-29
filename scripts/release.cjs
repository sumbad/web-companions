const { execSync, spawn } = require('child_process');

// Bootstrap packages
console.log(`> npx lerna bootstrap`);
execSync('npx lerna bootstrap', { stdio: 'inherit', shell: true });

try {
  // Testing and building packages before publish
  const changedPackages = JSON.parse(execSync('npx lerna changed --include-merged-tags --json', { encoding: 'utf8' }));
  const packagesScope = changedPackages.map((p) => `--scope="${p.name}"`).join(' ');
  const testPackagesCmd = `npx lerna exec --stream ${packagesScope} "npm test --if-present && npm run build --if-present"`;
  console.log(`> ${testPackagesCmd}`);
  execSync(testPackagesCmd, { stdio: 'inherit', shell: true });
} catch (error) {
  console.warn(`Error: ${error.message}\n`);
}

// Publish packages
const branchName = execSync('git symbolic-ref --short HEAD', { encoding: 'utf8' }).trim();

const cmd =
  branchName === 'master'
    ? process.argv.slice(2).length > 0
      ? `npx lerna publish --include-merged-tags --conventional-graduate ${process.argv.slice(2).join(' ')}`
      : `npx lerna publish --include-merged-tags --conventional-graduate`
    : `npx lerna publish --include-merged-tags --no-changelog --dist-tag next --conventional-prerelease --preid ${branchName.replace(
        '/',
        '-'
      )} --no-push ${process.argv.slice(2).join(' ')}`;
console.log(`> ${cmd}`);
spawn(cmd, { stdio: 'inherit', shell: true });


// Publish only certain packages
// npx lerna publish --include-merged-tags --conventional-graduate @web-companions/fc,@web-companions/react-adapter
// or
// npm run release -- @web-companions/fc,@web-companions/react-adapter
//
// Commit message with both ! and BREAKING CHANGE footer for major updates
// https://www.conventionalcommits.org/en/v1.0.0/#commit-message-with-both--and-breaking-change-footer

// Publishing:
// 1) npx lerna version
// 2) npx lerna publish from-package
// 3) git checkout master
// 4) npx lerna version --force-publish=@web-companions/fc,@web-companions/h
// 5) npx lerna publish from-package
