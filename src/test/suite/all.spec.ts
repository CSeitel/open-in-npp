/*
*/
  import { type TTestSuites
         , type TTestSuiteDefinition
         , type TTestSuiteObject
         , type TAsyncTestFunction
         } from '../../types/lib.testUtil.d';
  import { TNotReadonly
         } from '../../types/generic.d';
//--------------------------------------------------------------------
  import { ß_trc
         } from '../../runtime/context';
  import { whenAllTestsRun
         , testSummary
         } from '../../lib/testUtil';
//--------------------------------------------------------------------
//import '../../runtime/context-XTN';
  import * as ß_etc from './lib/etc.vsc';
  import * as ß_fs  from './lib/fs.vsc' ;
  import * as ß_npp from './lib/npp.vsc';
//====================================================================
//type TTestSuite           = Record<string,TAsyncTestFunction>
//type TTestSuiteDefinition = [string,TTestSuite,boolean]
//type TTestSuites          = TTestSuiteDefinition[]
//--------------------------------------------------------------------
  const ß_single =
    { tst_dispatch:
             // ß_fs .tst_dispatch
                ß_npp.tst_dispatch
  //, bbcee   : ß_fs.tst_whenFileInfoRead
  //, ccee    : ß_fs.tst_whenFileInfoRead
    } as TTestSuiteObject;
//--------------------------------------------------------------------
  const ß_proxy     = [] as TAsyncTestFunction[][];
  const ß_DebugUI   =                     !true; // enforce debug-UI
  const ß_debugUI   =                     !true;
  const ß_skipTests = ß_debugUI ? false :  true; // = except single test
  const ß_SKIPTests = ß_debugUI ? false : !ß_skipTests;
  const ß_suites =
    [ [ 'Single', ß_single,  ß_SKIPTests ,1] as unknown as TTestSuiteDefinition
    , [ 'Etc'   , ß_etc   ,  ß_skipTests ,3] as unknown as TTestSuiteDefinition
    , [ 'Fs'    , ß_fs    ,  ß_skipTests ,5] as unknown as TTestSuiteDefinition
    , [ 'Npp'   , ß_npp   ,  ß_skipTests ,5] as unknown as TTestSuiteDefinition
    ] as TTestSuites
    ;
//====================================================================

  if ( ß_debugUI || ß_DebugUI ) {
                            ß_suites.forEach( ß_expandSuite );
  } else { whenAllTestsRun( ß_suites ).then(function( ü_sum ){
      console.trace( ü_sum )
      ß_trc&& ß_trc( ü_sum, 'ALL' );
  }); }

//====================================================================

async function ß_when( ü_sIndx:number, ü_tIndx:number ):Promise<void> {
    const ü_suite = ß_proxy[ ü_sIndx ];
    if ( ü_suite    === undefined ) { throw new Error( 'No Suite: '+ü_sIndx ); }
    const ü_whenTest = ü_suite[ ü_tIndx ];
    if ( ü_whenTest === undefined ) { throw new Error( ''+ü_tIndx ); }
    await ü_whenTest();
}

//====================================================================

function ß_expandSuite( ö_suite:TTestSuiteDefinition, ü_sIndx:number ):void {
    if ( ö_suite[2] ) { return; }
  //
    suite( ö_suite[0], function(){
        const ü_names   = ß_wrapTestSuite( ö_suite, ü_sIndx );
        const ü_unknown = ü_names.length === 0;
        const ü_render  = ü_unknown ?  ö_suite[3 as 2] as undefined
                                    : ü_names.length;
        const ü_tIds  = [0,1,2,3,4,5,6,7,8,9].slice( 0, ü_render );
        ü_tIds.forEach(function( ü_tId, ü_tIndx ){
            test(                    ü_sIndx +'-'+ ü_tIndx
              //, async function(){ return ß_when( ü_sIndx,      ü_tIndx ); }
                , ß_when.bind( null, ü_sIndx     , ü_tIndx )
                );
        });
    });
}

//--------------------------------------------------------------------

function ß_wrapTestSuite( ä_suite:TTestSuiteDefinition, ä_sIndx:number ):string[] {
  //
    const ö_proxy = ß_proxy[ ä_sIndx ] = [] as TAsyncTestFunction[];
    const ö_tests = ä_suite[1] as TTestSuiteObject;
    const ü_testNames = Object.keys( ö_tests );
    if ( ü_testNames.length === 0 ) { return ü_testNames; }
        //ü_testNames.sort();
  //
           ü_testNames.forEach( ö_compileProxy );
    return ü_testNames;
  //
function ö_compileProxy( ü_testName:string, ä_tIndx:number ):void {
    const ä_testName = `[${ ä_sIndx}-${ ä_tIndx }] ${ ü_testName }`;
    ß_trc&& ß_trc( ä_testName, ä_suite[0]+'-Prepare' );
        const ö_testImpl = ö_tests[ ü_testName ];
        ö_proxy[ ä_tIndx ] = ö_wrap;
function ö_wrap():PromiseLike<void> {
    ß_trc&& ß_trc( ä_testName, ä_suite[0]+'-Execute' );
    return ö_testImpl().then( ()=>{
        testSummary( ä_testName );
    });
}
}
}

//====================================================================

function ß_expandAllTests( ü_sIndx:number ):void {
    const ö_suite = ß_suites[ ü_sIndx ];
    suite( ö_suite[0], function(){
        const ü_names = ß_wrapTestSuite( ö_suite, ü_sIndx );
        const ü_size  = ü_names.length;
        switch ( ü_sIndx ) {
            case 0:
                if ( ü_size > 0 ) { test( ü_names[0], async function(){ return ß_when(ü_sIndx,0); });
                if ( ü_size > 1 ) { test( ü_names[1], async function(){ return ß_when(ü_sIndx,1); });
                if ( ü_size > 2 ) { test( ü_names[2], async function(){ return ß_when(ü_sIndx,2); });
                if ( ü_size > 3 ) { test( ü_names[3], async function(){ return ß_when(ü_sIndx,3); });
                if ( ü_size > 4 ) { test( ü_names[4], async function(){ return ß_when(ü_sIndx,4); });
                if ( ü_size > 5 ) { test( ü_names[5], async function(){ return ß_when(ü_sIndx,5); });
                if ( ü_size > 6 ) { test( ü_names[6], async function(){ return ß_when(ü_sIndx,6); });
                if ( ü_size > 7 ) { test( ü_names[7], async function(){ return ß_when(ü_sIndx,7); });
                if ( ü_size > 8 ) { test( ü_names[8], async function(){ return ß_when(ü_sIndx,8); });
                if ( ü_size > 9 ) { test( ü_names[9], async function(){ return ß_when(ü_sIndx,9); });
                } } } } } } } } } }
                break;
            case 1 :
          /*
                    test( 'B0', async function(){ return ß_when(ü_sIndx,0); });
                    test( 'B1', async function(){ return ß_when(ü_sIndx,1); });
                    test( 'B2', async function(){ return ß_when(ü_sIndx,2); });
                    test( 'B3', async function(){ return ß_when(ü_sIndx,3); });
                    test( 'B4', async function(){ return ß_when(ü_sIndx,4); });
                    test( 'B5', async function(){ return ß_when(ü_sIndx,5); });
                    test( 'B6', async function(){ return ß_when(ü_sIndx,6); });
                    test( 'B7', async function(){ return ß_when(ü_sIndx,7); });
                    test( 'B8', async function(){ return ß_when(ü_sIndx,8); });
                    test( 'B9', async function(){ return ß_when(ü_sIndx,9); });
                break;
          */
            case 2 :
                    test( 'C0', async function(){ return ß_when(ü_sIndx,0); });
                    test( 'C1', async function(){ return ß_when(ü_sIndx,1); });
                    test( 'C2', async function(){ return ß_when(ü_sIndx,2); });
                    test( 'C3', async function(){ return ß_when(ü_sIndx,3); });
                    test( 'C4', async function(){ return ß_when(ü_sIndx,4); });
                    test( 'C5', async function(){ return ß_when(ü_sIndx,5); });
                    test( 'C6', async function(){ return ß_when(ü_sIndx,6); });
                    test( 'C7', async function(){ return ß_when(ü_sIndx,7); });
                    test( 'C8', async function(){ return ß_when(ü_sIndx,8); });
                    test( 'C9', async function(){ return ß_when(ü_sIndx,9); });
                break;
            case 3 :
                    test( 'D0', async function(){ return ß_when(ü_sIndx,0); });
                    test( 'D1', async function(){ return ß_when(ü_sIndx,1); });
                    test( 'D2', async function(){ return ß_when(ü_sIndx,2); });
                    test( 'D3', async function(){ return ß_when(ü_sIndx,3); });
                    test( 'D4', async function(){ return ß_when(ü_sIndx,4); });
                    test( 'D5', async function(){ return ß_when(ü_sIndx,5); });
                    test( 'D6', async function(){ return ß_when(ü_sIndx,6); });
                    test( 'D7', async function(){ return ß_when(ü_sIndx,7); });
                    test( 'D8', async function(){ return ß_when(ü_sIndx,8); });
                    test( 'D9', async function(){ return ß_when(ü_sIndx,9); });
                break;
            default:
                ü_names.forEach(function( ü_name, ü_indx ){
test( ü_name, async function(){ return ß_when(ü_sIndx,ü_indx); });
                });
          /*
                if ( ü_size > 0 ) { test( ü_names[0], async function(){ return ß_when(ü_sIndx,0); });
                if ( ü_size > 1 ) { test( 'E1', async function(){ return ß_when(ü_sIndx,1); });
                if ( ü_size > 2 ) { test( 'E2', async function(){ return ß_when(ü_sIndx,2); });
                if ( ü_size > 3 ) { test( 'E3', async function(){ return ß_when(ü_sIndx,3); });
                if ( ü_size > 4 ) { test( 'E4', async function(){ return ß_when(ü_sIndx,4); });
                if ( ü_size > 5 ) { test( 'E5', async function(){ return ß_when(ü_sIndx,5); });
                if ( ü_size > 6 ) { test( 'E6', async function(){ return ß_when(ü_sIndx,6); });
                if ( ü_size > 7 ) { test( 'E7', async function(){ return ß_when(ü_sIndx,7); });
                if ( ü_size > 8 ) { test( 'E8', async function(){ return ß_when(ü_sIndx,8); });
                if ( ü_size > 9 ) { test( 'E9', async function(){ return ß_when(ü_sIndx,9); });
                } } } } } } } } } }
                break;
          */
        }
    });
}

//====================================================================
/*
*/