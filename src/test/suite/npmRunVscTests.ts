/*
https://code.visualstudio.com/api/working-with-extensions/testing-extension
*/
  import { join
         } from 'path';
  import { runTests as whenVscTestsRun
         } from '@vscode/test-electron';
  import { ß_trc
         , ß_err
         , ß_RuntimeContext
         } from '../../runtime/context';
//--------------------------------------------------------------------
  main();
//====================================================================

async function main():Promise<void> {
  //
    const ü_opts =
      { extensionDevelopmentPath: join( __dirname, '../../../'       ) // the extension to load
      , extensionTestsPath      : join( __dirname, './vscTestsIndex' ) // the tests     to execute
      };
  //
    try {

        ß_trc&& ß_trc( ü_opts, 'ExtensionTest-Options' );
        const ü_rc = await whenVscTestsRun( ü_opts );
        ß_trc&& ß_trc( `rc=${ ü_rc }`, 'ExtensionTest-ExitCode' );
        process.exit( ü_rc );

    } catch ( ü_eX ) {
        ß_err( ü_eX, 'ExtensionTest-FatalError' );
        process.exit( ß_RuntimeContext.fatalExitCode );
    }
}

//==============================================================================
/*
*/