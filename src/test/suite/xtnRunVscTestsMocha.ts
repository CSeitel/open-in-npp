/*
*/
  import { type MochaOptions
         } from 'mocha';
  import { type TTestSummary
         } from '../../types/lib.testUtil.d';
//--------------------------------------------------------------------
  import * as ß_glob  from 'glob' ;
  import * as ß_Mocha from 'mocha';
  import { join
         } from 'path';
  import { promisify
         } from 'util';
  import { ß_trc
         } from '../../runtime/context';
  import { createPromise
         } from '../../lib/asyncUtil';
//--------------------------------------------------------------------
  const ß_specsRoot = join( __dirname, '.' );
    let ß_what    = '**/**.spec.js';
        ß_what    = 'all.spec.js';
  const ß_timeout = 99;
//====================================================================

export async function run():Promise<void> {
  // externalApi
    ß_trc&& ß_trc( __filename, 'Mocha-Wrapper' );
    const ü_specs  = await ß_whenSpecsFound();
    const ü_failed = await ß_whenSpecsRun( ü_specs );
    if ( ü_failed > 0 ) {
             ß_trc&& ß_trc( `Overall test result: ${ ü_failed } tests have failed.`       , 'Mocha-Done' );
    } else { ß_trc&& ß_trc( 'Overall test result: All tests have been passed successfully', 'Mocha-Done' );
    }
    process.exit( ü_failed );
}

//====================================================================

async function ß_whenSpecsFound():Promise<string[]> {
  //
    ß_trc&& ß_trc( `Collecting Specs: "${ ß_what }" @ "${ ß_specsRoot }"`, 'Mocha-Glob' );
  //
    return ( await promisify( ß_glob )( ß_what, { cwd: ß_specsRoot } )
           ).map( ü_file => join( ß_specsRoot, ü_file ) );
}

//====================================================================

async function ß_whenSpecsRun( ü_specs:string[] ):Promise<number> {
  //
    const ü_opts:MochaOptions =
      { ui     : 'tdd'
      , timeout: ß_timeout * 1000
      };
  //
    const ü_mocha = new ß_Mocha( ü_opts );
        //ü_mocha.useColors( true );
    for ( const ü_spec of ü_specs ) { ü_mocha.addFile( ü_spec ); }
    const ü_whenAllTestsRun = ß_promisifyMochaRun( ü_mocha );
  //
    return ü_whenAllTestsRun();
}

//--------------------------------------------------------------------

function ß_promisifyMochaRun( ö_mocha:globalThis.Mocha ):()=>Promise<number> {
    return ö_whenErrorCount;
function ö_whenErrorCount():Promise<number> {
           const ä_prms = createPromise<number>();
    ö_mocha.run( ä_onDone );
          return ä_prms.promise;
function ä_onDone( ü_errorCount:number ):void {
    ä_prms.resolve( ü_errorCount );
}
}
}

//====================================================================
/*
*/