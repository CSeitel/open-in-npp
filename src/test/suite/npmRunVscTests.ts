/*
https://code.visualstudio.com/api/working-with-extensions/testing-extension
*/
  import { join
         } from 'path';
  import { runTests as whenVscTestsRun
         } from '@vscode/test-electron';
  import {
         } from './vscTestsIndex';
//--------------------------------------------------------------------
  main();
//==============================================================================

async function main():Promise<void> {
  //
    const ü_opts =
      { extensionDevelopmentPath: join( __dirname, '../../../'       ) // the extension to load
      , extensionTestsPath      : join( __dirname, './vscTestsIndex' ) // the tests     to execute
      };
    console.log( ü_opts.extensionTestsPath );
  //
    try {

      const ü_count = await whenVscTestsRun( ü_opts );
      console.log( `${ ü_count }` );

    } catch ( ü_eX ) {
      console.error( `Failed to run tests ${ ü_eX }` );
      process.exit(1);
    }
}

//==============================================================================
/*
*/