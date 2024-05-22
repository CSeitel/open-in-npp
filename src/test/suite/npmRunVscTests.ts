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
    const ß_file = './xtnRunVscTestsMocha';
  //    ß_trc&& ß_trc( process.argv, 'Cli-Arguments' );
    const ü_fileName = process.argv[2] ?? ß_file;
  //
    const ü_opts =
      { extensionDevelopmentPath: join( __dirname, '../../../' ) // the extension to load
      , extensionTestsPath      : join( __dirname, ü_fileName  ) // the tests     to execute
      };
  //
    try {

        ß_trc&& ß_trc( ü_opts, 'ExtensionTest-Options' );
        const ü_rc = await whenVscTestsRun( ü_opts );
        ß_trc&& ß_trc( `rc=${ ü_rc }`, 'ExtensionTest-ExitCode' );
        process.exit( ü_rc );

    } catch ( ü_eX ) {
        ß_trc&& ß_trc( typeof( ü_eX ), 'Cli-Arguments' );
        ß_err( ü_eX, 'ExtensionTestWrapper-Exception' );
        process.exit( ß_RuntimeContext.fatalExitCode );
    }
}

//==============================================================================
/*
*/