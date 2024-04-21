/*
*/
  import { TAsyncFunctionSingleArg
         } from '../../types/generic.d';
  import { TTDDSuite
         , TTDDTest
         , TTestSuite
         , TAsyncTestFunction
         } from '../../types/lib.testUtil.d';
//--------------------------------------------------------------------
  import '../../runtime/context-XTN';
  import { run } from './xtnRunVscTestsMochaLike';
  import { whenAllTestsRun
         , more as more_
         , expandTestSuite
         , testSummary
         } from '../../lib/testUtil';
//import { whenAllTestsExecuted } from './all.spec';
//====================================================================
  const ß_debugUI = !true;

suite( 'Debug', ()=>{
    if ( ! ß_debugUI ) { return; }
    test( 'Single', async ()=>{
        await run()
      //testImpl();
    });
});
  
  //ß_more( suite, test );
    if ( ! ß_debugUI ) {
        ß_expandTestSuite( 'More',{abc:async ()=>{}}, suite, test );
    }
//====================================================================

async function main():Promise<void> {
    await run();
}

function ß_expandTestSuite( ü_title    :string
                               , ö_tests    :TTestSuite
                               , ü_tddSuite :TTDDSuite = suite
                               , ü_tddTest  :TTDDTest  = test ):void {
    ü_tddSuite( ü_title, Array.isArray( ö_tests ) ? ö_suiteArray
                                                  : ö_suiteRecord );
  //
function ö_suiteArray():void {
    for ( const ö_testImpl of ö_tests as TAsyncTestFunction[] ) {
        ü_tddTest( ö_testImpl.name
                 , function(){ return ö_testImpl().then( testSummary as any ); }
                 );
    }
}
function ö_suiteRecord():void {
    for ( const ü_testName in ö_tests ) {
                                const ö_testImpl = ( ö_tests as Record<string,TAsyncTestFunction> )[ ü_testName ];
        ü_tddTest( ü_testName
                 , function(){ return ö_testImpl().then( testSummary as any ); }
                 );
    }
}
}

//====================================================================
/*
*/