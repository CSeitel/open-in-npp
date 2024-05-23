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
  import { failureSymbol
         , successSymbol
         } from '../../constants/test';
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
        if ( ü_rc > 0 )
             { ß_trc&& ß_trc( failureSymbol, 'ExtensionTest-Result'    ); } // Never ?
        else { ß_trc&& ß_trc( successSymbol, 'ExtensionTest-Result'    ); }

    } catch ( ü_eX ) {
        if ( ü_eX === 'Failed' )
             { ß_trc&& ß_trc( failureSymbol, 'ExtensionTest-Result'    ); }
        else {         ß_err( ü_eX         , 'ExtensionTest-Exception' ); }
        
        process.exit( ß_RuntimeContext.fatalExitCode );
    }
}

//==============================================================================
/*
*/