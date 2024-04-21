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
  type TTestSuiteDefinition = [string,TTestSuite,boolean,TTestSuite]
  type TTestSuites          = TTestSuiteDefinition[]
//--------------------------------------------------------------------
    const ß_store:Record<number,TTestSuite> =
    { 0: { 0: ö_when, 1: ö_when, 2: ö_when, 3: ö_when, 4: ö_when, 5: ö_when, 6: ö_when, 7: ö_when, 8: ö_when, 9: ö_when }
    , 1: { 0: ö_when, 1: ö_when, 2: ö_when, 3: ö_when, 4: ö_when, 5: ö_when, 6: ö_when, 7: ö_when, 8: ö_when, 9: ö_when }
    , 2: { 0: ö_when, 1: ö_when, 2: ö_when, 3: ö_when, 4: ö_when, 5: ö_when, 6: ö_when, 7: ö_when, 8: ö_when}
    };
  const ß_store_0:TTestSuite = { 0: ö_when, 1: ö_when, 2: ö_when, 3: ö_when, 4: ö_when, 5: ö_when, 6: ö_when, 7: ö_when, 8: ö_when, 9: ö_when };
  const ß_store_1:TTestSuite = { 0: ö_when, 1: ö_when, 2: ö_when, 3: ö_when, 4: ö_when, 5: ö_when, 6: ö_when, 7: ö_when, 8: ö_when, 9: ö_when };
  const ß_store_2:TTestSuite = { 0: ö_when, 1: ö_when, 2: ö_when, 3: ö_when, 4: ö_when, 5: ö_when, 6: ö_when, 7: ö_when, 8: ö_when };
//--------------------------------------------------------------------
  const ß_single = { dispatch: ß_fs.tst_dispatch
                   , abcee   : ß_fs.tst_whenFileInfoRead
                   , bcee   : ß_fs.tst_whenFileInfoRead
                   } as TTestSuite;
//--------------------------------------------------------------------
  const ß_debugUI   =                      true;
  const ß_skipTests = ß_debugUI ? false : !true; // = except single test
  const ü_suites = (
    [ [ 'Single',  ß_etc   ,  ß_skipTests, ß_store_0 ]
    , [ 'Etc'   ,  ß_fs    ,  ß_skipTests, ß_store_1 ]
    , [ 'Fs'    ,  ß_fs    ,  ß_skipTests, ß_store_2 ]
    ] as TTestSuites
    ).filter( ü_suite => !ü_suite[2] )
 // .slice(0)
   ;
//--------------------------------------------------------------------

  if ( ß_debugUI ) {        
                            ü_suites.forEach( ß_expandTestSuite );
  } else { whenAllTestsRun( ü_suites as any ); }

//====================================================================

async function ö_when(){
}

function ß_wrap_( ö_tests:TTestSuite, ü_store:TTestSuite ):TTestSuite {
    const ü_testKeys = ( Object.keys( ü_store ) as (keyof typeof ü_store )[] ).sort();
    for ( const ü_testName in ö_tests ) {
        const ü_testKey = ü_testKeys.shift();
        if ( ü_testKey === undefined ) { continue; }
        ü_store[ ü_testKey ] = ö_wrap( ö_tests[ ü_testName ] );
    }
  //
        const ü_testKey = ü_testKeys.shift()!;
    delete ü_store[ ü_testKey ]
  //ü_testKeys.forEach(function( ü_mKey ){  delete ü_store[ parseInt( ü_mKey ) ];  });
  //
    return ü_store;
function ö_wrap( ö_testImpl:TAsyncTestFunction ):TAsyncTestFunction {
    return ö_wrap;
function ö_wrap():PromiseLike<void> {
    return ö_testImpl().then( testSummary as any ); }
}
}

//====================================================================

function ß_expandTestSuite( ü_suite:TTestSuiteDefinition ):void {
  /*
    const ö_mKey = ß_mKeys.shift()!;
    let ü_store = ß_store[ ö_mKey as any ];
    switch ( parseInt( ö_mKey ) ) {
        case 0: ü_store = ß_store_0; break;
        case 1: ü_store = ß_store_1; break;
        case 2: ü_store = ß_store_2; break;
    }
  */
    const ö_tests = ß_wrap_( ü_suite[1], ü_suite[3] );
    suite( ü_suite[0], ö_suiteRecord );
  //
function ö_suiteRecord():void {
    for ( const ü_testName in ö_tests ) {
        test(          ü_testName
            , ö_tests[ ü_testName ]
            );
    }
}
}

//====================================================================
/*
*/