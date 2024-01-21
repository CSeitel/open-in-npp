/*
*/
  import * as ßß_path from 'path';
  import { runTests as whenVscTestsRun } from '@vscode/test-electron';
//------------------------------------------------------------------------------
  main();
//==============================================================================

async function main():Promise<void> {
  //
    const ü_opts =
      { extensionDevelopmentPath: ßß_path.join( __dirname, '../../../' ) // the extension to load
      , extensionTestsPath      : ßß_path.join( __dirname, './index'   ) // the tests     to execute
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