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
  const ß_single = 
                  { dispatch:ß_fs.tst_dispatch
                  , abcee:ß_fs.tst_whenFileInfoRead
                //ß_wrap( ß_fs.tst_dispatch )
                      } as TTestSuite
                      ß_single.ahhh = async ()=>{}
  const ß_etc_ = Object.assign( {a:()=>{}}, ß_single );
  const ß_debugUI   =                      true;
  const ß_skipTests = ß_debugUI ? false : !true; // = except single test
    let ß_wrapCount = 0;
  const ü_suites = (
    [ [ 'Aingle', ß_localizeTeststSuite( ß_single
                    ),  ß_skipTests ]
    , [ 'Etc'   , ß_localizeTeststSuite(ß_etc_ ),  ß_skipTests ]
    , [ 'Fs'    , ß_localizeTeststSuite( ß_fs ) ,  ß_skipTests ]
    ] as TTestSuites ).filter( ü_suite => !ü_suite[2] ).slice(0);
 //.map( ß_localizeTeststSuite )
   ;
//--------------------------------------------------------------------

  if ( ß_debugUI ) {        
                          //ü_suites.forEach( ß_localizeTeststSuite );
                            ü_suites.forEach( ß_expandTestSuite     );
                                            //ß_expandTestSuite( 'rTTuAbc', [ß_wrap( ß_etc.tst_ )] )
                                            //ß_expandTestSuite( ü_suites[0][0],  [ß_wrap(ß_etc.tst_) ] )
  } else { whenAllTestsRun( ü_suites ); }

//====================================================================

function ß_wrap( ö_testImpl:TAsyncTestFunction ):TAsyncTestFunction {
    switch ( ß_wrapCount ++ ) {
        case 0 : return function ö_wrapper_0():PromiseLike<void> { return ö_testImpl().then( testSummary as any ); }
        case 1 : return function ö_wrapper_1():PromiseLike<void> { return ö_testImpl().then( testSummary as any ); }
        default: return function ö_wrapper_N():PromiseLike<void> { return ö_testImpl().then( testSummary as any ); }
    }
}

//====================================================================

function ß_localizeTeststSuite( ö_tests    :TTestSuite ):TTestSuite {
      /*
    if ( Array.isArray( ö_tests ) ) {
        const ü_impl = ö_tests[0] = ß_wrap( ö_tests[0] );
        ( ö_tests as any as Record<string,TAsyncTestFunction> ).tst  = ü_impl;

    }
        const ä_tests = {} as Record<string,TAsyncTestFunction>;
        ö_tests.forEach(function( ü_test ){ ä_tests[ ü_test.name ] = ß_wrap( ü_test ); });
        Object.assign( ü_suite[1] , ä_tests )
      */
  //const ö_tests = Object.create( ü_suite[1] );
    for ( const ü_testName in ö_tests ) {
            ö_tests[ ü_testName ] = ß_wrap( ö_tests[ ü_testName ] );
    }
    return ö_tests;
}

//--------------------------------------------------------------------

function ß_expandTestSuite( ü_suite:TTestSuiteDefinition ):void {
  //const ö_tests = Object.create( ü_suite[1] );
    const ö_tests =                        ü_suite[1]  ;
  //const ö_tests = ß_localizeTeststSuite( ü_suite[1] );
      /*
                          const ä_tests = {} as Record<string,TAsyncTestFunction>
    for ( const ü_testName in ö_tests ) {
            ä_tests[ ü_testName ] = ß_wrap( ö_tests[ ü_testName ] );
    }
        Object.assign( ö_tests, ä_tests );
          //( ö_tests[0].name as TNotReadonly<string>) = ü_name;
        ä_tests[ ü_name ] = ü_impl;
      //ö_tests.forEach( ü_test => { ü_tests[ ü_test.name ] = ß_wrap( ü_test ); } );
      //ö_tests = ü_tests
        const ü_name = ö_tests[0].name;
        const ü_impl = ö_tests[0] = ß_wrap( ö_tests[0] );
        ( ä_tests as any as Record<string,TAsyncTestFunction> ).tst  = ü_impl;
      //

    } else {
        ö_tests.tst = ß_wrap( ö_tests.tst )
      */
  //
      //ö_tests = {aa: async ()=>{} }
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