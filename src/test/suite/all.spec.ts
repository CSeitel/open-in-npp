/*
*/
  import { TTDDSuite
         , TTDDTest
         , TTestSuites as TTestSuitesCore
         , TAsyncTestFunction
         } from '../../types/lib.testUtil.d';
  import { TNotReadonly
         } from '../../types/generic.d';
//--------------------------------------------------------------------
  import '../../runtime/context-XTN';
  import { whenAllTestsRun
         , testSummary
         } from '../../lib/testUtil';
//--------------------------------------------------------------------
  import * as ß_etc from './lib/etc.vsc';
  import * as ß_fs  from './lib/fs.vsc' ;
  import * as ß_any from './lib/a.npp';
//====================================================================
  type TTestSuite           = Record<string,TAsyncTestFunction>
  type TTestSuiteDefinition = [string,TTestSuite,boolean,number]
  type TTestSuites          = TTestSuiteDefinition[]
//--------------------------------------------------------------------
  const ß_single =
    { dispatch: ß_fs.tst_dispatch
    , bbcee   : ß_fs.tst_whenFileInfoRead
  //, ccee    : ß_fs.tst_whenFileInfoRead
    } as TTestSuite;
//--------------------------------------------------------------------
  const ß_proxy     = [] as TAsyncTestFunction[][];
  const ß_debugUI   =                     !true;
  const ß_skipTests = ß_debugUI ? false :  true; // = except single test
  const ß_SKIPTests = ß_debugUI ? false : !ß_skipTests;
  const ß_suites =
    [ [ 'Single', ß_single,  ß_SKIPTests, 3 ]
    , [ 'Etc'   , ß_etc   ,  ß_skipTests, 3 ]
    , [ 'Fs'    , ß_fs    ,  ß_skipTests, 4 ]
    , [ 'Npp'   , ß_any   ,  ß_skipTests    ]
    ] as TTestSuites
    ;
//====================================================================

  if ( ß_debugUI ) {
                            ß_suites.forEach( ß_expandSuite );
  } else { whenAllTestsRun( ß_suites as unknown as TTestSuitesCore ); }

//====================================================================

function ß_wrapTestSuite( ü_suite:TTestSuiteDefinition, ü_sIndx:number ):string[] {
        if ( ü_suite[2] ) { return []; }
    const ö_proxy = ß_proxy[ ü_sIndx ] = [] as TAsyncTestFunction[];
    const ö_tests = ü_suite[1];
    const ü_testKeys = ( Object.keys( ö_tests ) as (keyof typeof ö_tests)[] ).sort();
    ü_testKeys.forEach(function( ü_testName, ü_tIndx ){
        const ö_testImpl = ö_tests[ ü_testName ];
        ö_proxy[ ü_tIndx ] = ö_wrap;
function ö_wrap():PromiseLike<void> {
    return ö_testImpl().then( testSummary as any );
}
    });
    return ü_testKeys;
}

//--------------------------------------------------------------------

async function ß_when( ü_suite:number, ü_test:number ){
    const ü_whenTest = ß_proxy[ ü_suite ][ ü_test ];
    if ( ü_whenTest === undefined ) { throw new Error( ''+ü_test ) }
    await ü_whenTest();
}

//====================================================================

function ß_expandSuite( ö_suite:TTestSuiteDefinition, ü_sIndx:number ):void {
  //const ö_suite = ß_suites[ ü_sIndx ];
    suite( ö_suite[0], function(){
        const ü_names_ = ß_wrapTestSuite( ö_suite, ü_sIndx );
        const ü_names = [0,1,2,3,4,5,6,7,8,9].slice(0,ö_suite[3]);
        ü_names.forEach(function( ü_name, ü_tIndx ) {
            test(                                  ü_sIndx +'-'+ ü_tIndx
                , async function(){ return ß_when( ü_sIndx,      ü_tIndx ); } );
        });
    });
/*
*/
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