/*
*/
  import * as    Mocha from 'mocha';
  import * as ßß_path  from 'path';
  import * as ßß_glob  from 'glob';
//------------------------------------------------------------------------------
export default class TestRuntime {
    static readonly developerTrace :false|typeof console.log = console.log;
}
  const ß_trc = TestRuntime.developerTrace;
//------------------------------------------------------------------------------
//const ß_what = '**/**.spec.js';
  const ß_what    = '**/a.spec.js';
  const ß_timeout = 1000 * 99;
//==============================================================================

export async function run():Promise<void> {
    if(ß_trc){ß_trc( `--extensionTestsPath="${ __filename }"` );}
    const ü_specs = await ß_whenSpecsFound();
    const ü_done  = await ß_whenSpecsRun( ü_specs );
}

//==============================================================================

async function ß_whenSpecsFound():Promise<string[]> {
  //
    const ö_where = ßß_path.join( __dirname, '.' );
    if(ß_trc){ß_trc( `Collecting Specs: "${ ß_what }" @ "${ ö_where }"` );}
  //
    return new Promise( (ü_resolve,ü_reject) => {
      ßß_glob( ß_what
        , { cwd: ö_where }
        , (ü_eX,ü_files) => {
          if ( ü_eX != null ) { ü_reject ( ü_eX                                                     ); }
          else                { ü_resolve( ü_files.map( ü_file => ßß_path.join( ö_where, ü_file ) ) ); }
        })
    });
}

async function ß_whenSpecsRun( ü_specs:string[] ):Promise<void> {
  //
    const ü_opts:Mocha.MochaOptions =
      { ui     : 'tdd'
      , timeout: ß_timeout
      };
    const ü_mocha = new Mocha( ü_opts );
          ü_mocha.useColors( true );
    for ( const ü_spec of ü_specs ) { ü_mocha.addFile( ü_spec ); }
  //
    return new Promise( (ü_resolve,ü_reject) => {
      try {
        ü_mocha.run( ü_errorCount => {
          if ( ü_errorCount === 0 ) { ü_resolve(); }
          else                      { ü_reject( new Error( `${ ü_errorCount } tests failed.` ) ); }
        });
      } catch ( ü_eX ) {
        ü_reject( ü_eX );
      }
    });
}

//==============================================================================
/*
*/