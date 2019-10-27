/*
C:\zzz_Dev\node_modules\open-in-npp\src\test\runTest.ts
C:\zzz_Dev\node_modules\open-in-npp\out\test\runTest.js
*/
import * as ßß_path from 'path';
import { runTests  } from 'vscode-test';

main();

async function main() {
  try {
// The folder containing the Extension Manifest package.json
// Passed to `--extensionDevelopmentPath`
    const extensionDevelopmentPath = ßß_path.resolve( __dirname, '../../'        ); // out/test
    const extensionTestsPath       = ßß_path.resolve( __dirname, './suite/index' ); // out/test
// The path to test runner, Passed to --extensionTestsPath

    await runTests( { extensionDevelopmentPath, extensionTestsPath } );

  } catch (err) {
    console.error('Failed to run tests');
    process.exit(1);
  }
}