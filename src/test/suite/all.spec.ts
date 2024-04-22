/*
*/
  import { TTDDSuite
         , TTDDTest
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
//====================================================================
  type TTestSuite           = Record<string,TAsyncTestFunction>
  type TTestSuiteDefinition = [string,TTestSuite,boolean]
  type TTestSuites          = TTestSuiteDefinition[]
//--------------------------------------------------------------------
  const ß_single = { adispatch: ß_fs.tst_dispatch
                   , bbcee   : ß_fs.tst_whenFileInfoRead
                   , ccee   : ß_fs.tst_whenFileInfoRead
                   } as TTestSuite;
//--------------------------------------------------------------------
  const ß_proxy     = [] as TAsyncTestFunction[][];
  const ß_debugUI   =                      true;
  const ß_skipTests =  true; // = except single test
  const ß_suites = (
    [ [ 'Single',  ß_single,  ß_debugUI ? false :
                             !ß_skipTests ]
    , [ 'Etc'   ,  ß_etc   ,  ß_skipTests ]
    , [ 'Fs'    ,  ß_fs    ,  ß_skipTests ]
    ] as TTestSuites
  //).filter( ü_suite => !ü_suite[2] )
    ;
//====================================================================

  if ( ß_debugUI ) {
      ß_expandAllTests( 0 );
      ß_expandAllTests( 1 );
      ß_expandAllTests( 2 );

                          //ü_suites.forEach( ß_expandTestSuite );
  } else { whenAllTestsRun( ß_suites as any ); }

//====================================================================

function ß_expandAllTests( ü_sIndx:number ):void {
    const ö_suite = ß_suites[ ü_sIndx ];
    suite( ''+ü_sIndx, function(){
        if ( ö_suite[2] ) { return; }
           ß_expandTestSuite( ö_suite, ü_sIndx );
        test( '0', async function(){ return ß_when(ü_sIndx,0); });
        test( '1', async function(){ return ß_when(ü_sIndx,1); });
        test( '2', async function(){ return ß_when(ü_sIndx,2); });
        test( '3', async function(){ return ß_when(ü_sIndx,3); });
        test( '4', async function(){ return ß_when(ü_sIndx,4); });
    });
}

//--------------------------------------------------------------------

function ß_expandTestSuite( ü_suite:TTestSuiteDefinition, ü_indx:number ):void {
    const ö_proxy = ß_proxy[ ü_indx ] = [] as TAsyncTestFunction[];
    const ö_tests = ü_suite[1];
    const ü_testKeys = ( Object.keys( ö_tests ) as (keyof typeof ö_tests)[] ).sort();
    ü_testKeys.forEach(function( ü_testName, ü_indx ){
        const ö_testImpl = ö_tests[ ü_testName ];
        ö_proxy[ ü_indx ] = ö_wrap;
function ö_wrap():PromiseLike<void> {
    return ö_testImpl().then( testSummary as any );
}
    });
}

//====================================================================

async function ß_when( ü_suite:number, ü_test:number ){
    const ü_whenTest = ß_proxy[ ü_suite ][ ü_test ];
    if ( ü_whenTest === undefined ) { throw new Error( ''+ü_test ) }
    await ü_whenTest();
}

//====================================================================
/*
*/