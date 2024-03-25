/*
*/
  import { type MochaOptions
         , type Runner
         } from 'mocha';
//--------------------------------------------------------------------
  import * as ß_glob  from 'glob' ;
  import * as   ß_Mocha from 'mocha';
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
        ß_what    = 'dbg.spec.js';
  const ß_timeout = 99;
//====================================================================

export async function run():Promise<void> {
    if(ß_trc){ß_trc( `--extensionTestsPath="${ __filename }"` );}
    const ü_specs = await ß_whenSpecsFound();
    const ü_done  = await ß_whenSpecsRun( ü_specs );
}

//====================================================================

async function ß_whenSpecsFound():Promise<string[]> {
  //
    if(ß_trc){ß_trc( `Collecting Specs: "${ ß_what }" @ "${ ß_specsRoot }"` );}
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
    const ü_mocha = new ß_Mocha( ü_opts );
        //ü_mocha.useColors( true );
  //
    for ( const ü_spec of ü_specs ) { ü_mocha.addFile( ü_spec ); }
  //
    return ß_whenRun( ü_mocha )();
}

//====================================================================

function ß_whenRun( ö_mocha:globalThis.Mocha ):()=>Promise<number> {
    return ö_whenRun;
function ö_whenRun():Promise<number> {
           const ü_prms = createPromise<number>();
    ö_mocha.run( ü_prms.resolve );
          return ü_prms.promise;
}
}

//====================================================================
/*
    try {
        ö_mocha.run( ü_errorCount => {
          if ( ü_errorCount === 0 ) { ü_prms.resolve( ü_errorCount ); }
          else                      { ü_prms.reject( new Error( `${ ü_errorCount } tests failed.` ) ); }
        });
    } catch ( ü_eX ) {
        ü_prms.reject( ü_eX );
    }
*/