/*
*/
  import { type TAnyFunctionSingleArg
         , type TAsyncFunctionSingleArg
         , type TOrderedPairs
         , type TOrderedPairsRO
         } from '../types/generic.d';
  import { type TTestResult
         , type TTestSummary
         , type TTestOptions
         , type TTestContext
         , type TAsyncTestFunction
         , type TTestSuites
         , type TSeveralTestSuites
         , type TSingleTestSuite
         , type TSeveralTests
         , type TSingleTest
         } from '../types/lib.testUtil.d';
  import { CEResultSymbol
         , CECheckIcon
         , CEEmptyStringSymbol
         } from '../constants/testUtil';
//--------------------------------------------------------------------
  import { join
         } from 'path';
  import { ß_trc
         , ß_RuntimeContext
         , ß_writeStdOut
         } from '../runtime/context';
  import { toOrderedPair
         } from './arrayUtil';
  import { forEach
         } from './objectUtil';
  import { shortenText
         } from './textUtil';
  import { echoAsString
         } from './jsonUtil';
//--------------------------------------------------------------------
  const       nonePrefix = CEResultSymbol.none       + ' ';
  const successfulPrefix = CEResultSymbol.successful + ' ';
  const    failingPrefix = CEResultSymbol.failing    + ' ';
  const successPrefix    = CEResultSymbol.success    + ' ';
  const    failurePrefix = CEResultSymbol.failure    + ' ';
//--------------------------------------------------------------------
  type TManMsg = string|undefined
  type TOptMsg = string
//const ß_escape = escapeFF( CRgXp.specialChars );
  const CSeriesOfTests = [] as TTestResult[];
//--------------------------------------------------------------------
  const LCHeader =
    { should    : (ü_msg   :TManMsg               )=> successPrefix+`Should have happened: ${ ü_msg||CEEmptyStringSymbol }`
    , shouldNot : (ü_msg   :TManMsg               )=> failurePrefix+`Should not have happened: ${ ü_msg||CEEmptyStringSymbol }`
    , noError   : (ü_msg   :TManMsg,ü_err  :string)=> failurePrefix+`For \`\`${ ü_msg||CEEmptyStringSymbol }\`\` an exception has occurred: ${ ü_err }`
    , never     : (ü_msg   :TManMsg               )=> failurePrefix+`Shouldn't have been reached: ${ ü_msg||CEEmptyStringSymbol }`
    , REJECTED_0: (ü_msg   :TManMsg,ü_val  :string)=> `No rejection for \`\`${ ü_msg||CEEmptyStringSymbol }\`\` due to result: ${ ü_val }`
    , REJECTED_1: (ü_msg   :TManMsg,ü_err  :string)=> `Rejection for '${ ü_msg||CEEmptyStringSymbol }' due to '${ ü_err }'`
    , TEST_0    : (ü_test  :string                )=>       nonePrefix+` Result of "${ ü_test }": Test contains no checks.`
    , TEST_OK   : (ü_test  :string ,ü_all  :number)=> successfulPrefix+` Result of "${ ü_test }": ${ ü_all    } checks have been passed successfully.`
    , TEST_ERR  : (ü_test  :string ,ü_all  :number                      //
                  ,ü_failed:number ,ü_ratio:number)=> failingPrefix   +` Result of "${ ü_test }": ${ ü_failed } (out of ${ ü_all }) checks have failed. Success-ratio: ${  ü_ratio }%`
                //
    , SUM_S_OK   : (ü_suite :string,ü_all  :number)=> successfulPrefix+`Result of "${ ü_suite }": ${ ü_all    } tests have been passed successfully.`
    , SUM_S_ERR  : (ü_suite :string,ü_all  :number
                   ,ü_failed:number,ü_ratio:number)=> failingPrefix   +`Result of "${ ü_suite }": ${ ü_failed } (out of ${ ü_all }) tests have failed. Success-ratio: ${  ü_ratio }%`
    , SUM_ALL_OK : (ü_all   :number               )=> successfulPrefix+`Overall test result: ${ ü_all    } tests have been passed successfully.`
    , SUM_ALL_ERR: (ü_all   :number
                   ,ü_failed:number,ü_ratio:number)=> failingPrefix   +`Overall test result: ${ ü_failed } (out of ${ ü_all }) tests have failed. Success-ratio: ${  ü_ratio }%`
                //
    , cond_s1   : (ü_msg   :TManMsg,ü_icon :string
                  ,ü_both  :string                )=> successPrefix+`${ ü_icon } ${ ü_both } for ${ ü_msg||CEEmptyStringSymbol }`
    , cond_f1   : (ü_msg   :TManMsg,ü_icon :string
                  ,ü_both  :string                )=> failurePrefix+`${ ü_icon } ${ ü_both } for ${ ü_msg||CEEmptyStringSymbol }`
    , cond_s2   : (ü_msg   :TManMsg,ü_icon :string
                  ,ü_act   :string ,ü_exp  :string)=> successPrefix+`${ ü_act } ${ ü_icon } ${ ü_exp } for ${ ü_msg||CEEmptyStringSymbol }`
    , cond_f2   : (ü_msg   :TManMsg,ü_icon :string
                  ,ü_act   :string ,ü_exp  :string)=> failurePrefix+`${ ü_act } ${ ü_icon } ${ ü_exp } for ${ ü_msg||CEEmptyStringSymbol }`
    };
//====================================================================
  const ß_defaultOpts:TTestOptions =
           { resourceDirName: join( __dirname, '../../' )
           , withMocha: typeof( suite ) !== 'undefined'
                     && typeof( test  ) !== 'undefined'
           , summaryOnly: false
           };
  let ß_testContext:TTestContext// = null as any as TTestOptions;
//====================================================================

function ß_echo( ü_oref:any, ü_length:number ):string {
    return shortenText( echoAsString( ü_oref ), ü_length );
}
function ß_sum( ü_sum:TTestSummary ):[number,number,number] {
    return [ ü_sum.all
           , ü_sum.failed
           , Math.round( ( 1 - ü_sum.failed / ü_sum.all ) * 100 )
           ];
}

//====================================================================

function ß_expandSingleTestSuite( ü_suite:TSingleTestSuite ):void {
    const ö_tests = ü_suite[1];
             suite( ü_suite[0], ö_expandTests );
  //
function ö_expandTests():void {
    ö_tests.forEach( ä_expandTest );
  //
function ä_expandTest( ö_test:TSingleTest ):void {
    const ö_testSummary = testSummary.bind( null, ö_test[0], true );
    test( ö_test[0], ö_whenTested );
  //
function ö_whenTested(){
    let ü_whenDone:PromiseLike<void>
    try {
        ü_whenDone = ö_test[1]();
    } catch ( ü_eX ) {
        ü_whenDone = Promise.reject( ü_eX );
    }
    return ü_whenDone.then( undefined, testNoError ).then(  ö_testSummary  );
}
}
}
}

function ß_filterSuites( ü_suites:TTestSuites, ü_singleTest?:TAsyncTestFunction ):TSeveralTestSuites {
    if ( ü_singleTest !== undefined ) {
        return [['Single TestSuite',[['Single Test',ü_singleTest!]]]];
    }
  //
    const ö_suites:TSeveralTestSuites = [];
    ü_suites.forEach(function( ü_suite ){
        if ( ü_suite[2] ) { return; }
        const ö_tests   = ü_suite[1];
        const ö_isArray = Array.isArray( ö_tests );
        const ö_suite:TSeveralTests = [];
        forEach( ö_tests as Record<string,TAsyncTestFunction>, function( ü_test, ü_name ){
            if ( ö_isArray ) { ü_name += '-'+ ü_test.name; }
            ö_suite.push([ ü_name, ü_test ]);
        });
        if ( ö_suite.length ) { ö_suites.push([ ü_suite[0], ö_suite ]); }
    });
    return ö_suites;
}

//====================================================================

export function testSrc( ...ü_segs:string[] ):string {
    return join( ß_testContext.resourceDirName, ...ü_segs );
}

export function whenAllTestsRun( ü_testSuites:TTestSuites, ü_opts?:Partial<TTestOptions> ):Promise<TTestSummary> {
  //
    ß_testContext = ü_opts === undefined
                  ?                    ß_defaultOpts           as TTestContext
                  : Object.assign( {}, ß_defaultOpts, ü_opts ) as TTestContext
                  ;
    ß_testContext.write = ß_writeStdOut;
  //
    const ü_suites = ß_filterSuites( ü_testSuites, ß_testContext.singleTest );
  //
    if ( ß_testContext.withMocha ) {
        ü_suites.forEach( ß_expandSingleTestSuite );
        return Promise.resolve({ all:-1, failed:-1 });
    }
  //
    const     ö_allSuitesSum:TTestSummary = { all:0, failed:0 };
      let ö_whenAllSuites = Promise.resolve();
    ü_suites.forEach( ö_appendSuite );
  //
    return ö_whenAllSuites.then( ö_afterAllSuites );
  //
function ö_appendSuite( üü_suite:TSingleTestSuite ):void {
    ö_whenAllSuites = ö_whenAllSuites.then( ä_whenSingleSuite );
  //
function ä_whenSingleSuite():PromiseLike<void> {
        ß_trc&& ß_trc( `TestSuite: ${ üü_suite[0] }` );
    return ß_whenSingleSuite( üü_suite[1] ).then( öö_afterSingleSuite );
  //
function öö_afterSingleSuite( ü_singleSuiteSum:TTestSummary ):void {
    ö_allSuitesSum.all    += ü_singleSuiteSum.all    ;
    ö_allSuitesSum.failed += ü_singleSuiteSum.failed ;
    ß_testContext.write(                             ü_singleSuiteSum.failed > 0
        ? LCHeader.SUM_S_ERR( üü_suite[0], ... ß_sum( ü_singleSuiteSum )   )
        : LCHeader.SUM_S_OK ( üü_suite[0],            ü_singleSuiteSum.all )
    );
        //? `TestSuite: ${ üü_suite[0] } ${ ü_singleSuiteSum.all }` : ''
}
}
}
  //
function ö_afterAllSuites():TTestSummary {
    ß_testContext.write(               ö_allSuitesSum.failed > 0
        ? LCHeader.SUM_ALL_ERR( ... ß_sum( ö_allSuitesSum )   )
        : LCHeader.SUM_ALL_OK (            ö_allSuitesSum.all )
        );
    if ( ! ß_testContext.withMocha ) {
        ß_trc&& ß_trc( ö_allSuitesSum, 'Test-Summary-Exit' );
      //process.exitCode = ü_sum.failed  ;
        process.exit     ( ö_allSuitesSum.failed );
    }
    return ö_allSuitesSum;
}
function ö_rejected( ü_reason:any ):never {
    throw ü_reason;
}
}

//--------------------------------------------------------------------

function ß_whenSingleSuite( ü_tests:TSeveralTests ):Promise<TTestSummary> {
  //
    const      ö_singleSuiteSum:TTestSummary = { all:0, failed:0 };
       let ö_whenSingleSuite = Promise.resolve();
           ü_tests.forEach( ö_appendTest ); 
    return ö_whenSingleSuite.then(function(){
        return ö_singleSuiteSum;
    });
  //
function ö_appendTest( ä_test:TSingleTest ):void {
    ö_whenSingleSuite = ö_whenSingleSuite.then( ä_whenSingleTest ); // single suite = several single tests
  //
function ä_whenSingleTest():PromiseLike<void> {
  //
    let ü_whenSingleTest:PromiseLike<void>
    try {
        ü_whenSingleTest = ä_test[1]();
    } catch ( ü_eX ) {
        ü_whenSingleTest = Promise.reject( ü_eX );
    }
  //
    return ü_whenSingleTest.then( undefined, testNoError )
                           .then( öö_afterSingleTest );
function öö_afterSingleTest():void {
   const ü_testsSum = testSummary( ä_test[0] );
    if ( ü_testsSum.failed > 0 ) { ö_singleSuiteSum.failed ++ ; }
                                   ö_singleSuiteSum.all    ++ ;
}
}
}
}

//====================================================================

export function testSummary( ü_testName:string, ü_throw?:boolean ):TTestSummary {
    const ü_results = CSeriesOfTests;
    const ü_all     = ü_results.length;
    const ü_success = ü_results.filter( ü_test => ü_test.startsWith( CEResultSymbol.success ) );
    const ü_output  = ß_testContext.summaryOnly
                    ? []
                    : CSeriesOfTests.slice(0)
                    ;
                      CSeriesOfTests.length = 0;
  //
      let ü_head:string
      let ü_throwErrorText = '';
    const ü_sum:TTestSummary =
      { all   : ü_all
      , failed: 0
      }
    if ( ü_all === 0 ) {
        ü_head = LCHeader.TEST_0( ü_testName );
    } else {
        const ü_ok      = ü_success.length;
        if ( ü_all > ü_ok ) {
                                               ü_sum.failed = ü_all - ü_ok;
                 ü_head = LCHeader.TEST_ERR( ü_testName, ü_all, ü_sum.failed, Math.round( ü_ok / ü_all * 100 ) );
            if ( ü_throw ) { ü_throwErrorText = ü_head; }
        } else { ü_head = LCHeader.TEST_OK ( ü_testName, ü_all );
        }
    }
  //
                                         ü_output.unshift( ü_head );
    if ( ! ß_testContext.summaryOnly ) { ü_output.push   ( ''     ); }
                              const ü_crlf = ß_RuntimeContext.lineSep;
    ß_testContext.write(  ü_output.join( ü_crlf )  );
  //
    if ( ü_throwErrorText.length > 0 ) { throw new Error( ü_throwErrorText ); }
    return ü_sum;
}

//====================================================================

export function testShould   (               ü_message ?:TOptMsg ):true  { CSeriesOfTests.push(  LCHeader.should   ( ü_message ) ); return true ; }
//port function testShouldNot(               ü_message ?:TOptMsg ):false { CSeriesOfTests.push(  LCHeader.shouldNot( ü_message ) ); return false; }
export function testNever    (               ü_message ?:TOptMsg ):false { CSeriesOfTests.push(  LCHeader.never    ( ü_message ) ); return false; }
export function testNoError  ( ü_reason:any, ü_message ?:TOptMsg ):false {
    CSeriesOfTests.push(  LCHeader.noError( ü_message, ß_echo( ü_reason, 256 ) )  );
    return false;
}

export function testRejected<T=any>( ü_whenDone:PromiseLike<T>, ö_message?:TOptMsg, ü_expectError?:( ü_reason:any )=>boolean ):PromiseLike<boolean> {
    const ö_xErr =                                                    ü_expectError === undefined
                 ? function( ü_reason:any ) {                  return                ü_reason instanceof Error;   }
                 : function( ü_reason:any ) { try            { return ü_expectError( ü_reason )               ; }
                                              catch ( ü_eX ) { return false                                   ; } }
                 ;
    return ü_whenDone.then( ö_onFulfilled, ö_onRejected );
function ö_onFulfilled( ü_value:T ):boolean {
    return        testNever  ( LCHeader.REJECTED_0( ö_message, ß_echo( ''+ü_value ,  50 ) ) );
}
function ö_onRejected( ü_reason:any ):boolean {
    let ü_ok = false;
    try {
      ü_ok = ö_xErr( ü_reason );
    } finally {}
    return ü_ok ? testShould ( LCHeader.REJECTED_1( ö_message, ß_echo( ü_reason, 256 ) ) )
                : testNoError( ü_reason, ö_message )
                ;
}
}

export function testEqual   <T=any>( ü_act:unknown, ü_exp:T, ü_message?:TOptMsg ):boolean { return ß_testCondition<T>( ü_act === ü_exp, CECheckIcon.   equal, ü_act, ü_exp, ü_message ); }
export function testNotEqual<T=any>( ü_act:unknown, ü_exp:T, ü_message?:TOptMsg ):boolean { return ß_testCondition<T>( ü_act !== ü_exp, CECheckIcon.notEqual, ü_act, ü_exp, ü_message ); }

function ß_testCondition<T=any>( ü_cond:boolean, ü_icon:CECheckIcon, ü_act:unknown, ü_exp:T, ü_message:TManMsg ):boolean {
    switch ( ü_icon ) {
      case CECheckIcon.equal   :
          CSeriesOfTests.push(  ü_cond ? LCHeader.cond_s1( ü_message, ü_icon, ß_echo( ü_act, 50 )  )
                                       : LCHeader.cond_f2( ü_message, ü_icon, ß_echo( ü_act, 50 ) //
                                                                            , ß_echo( ü_exp, 50 )  )
                             ); break;
      case CECheckIcon.notEqual:
          CSeriesOfTests.push( !ü_cond ? LCHeader.cond_f1( ü_message, ü_icon, ß_echo( ü_act, 50 )  )
                                       : LCHeader.cond_s2( ü_message, ü_icon, ß_echo( ü_act, 50 ) //
                                                                            , ß_echo( ü_exp, 50 )  )
                             ); break;
    }
    return ü_cond;
}

//====================================================================
  type TExpectErrorArr<Tx,Ty> = ( x:Tx, reason:any, x_y:[Tx,Ty]    )=>Ty
  type TExpectErrorMap<Tx,Ty> = ( x:Tx, reason:any,   y:        Ty )=>Ty
  type TExpectErrorAll<Tx,Ty> = ( x:Tx, reason:any, mix:[Tx,Ty]|Ty )=>Ty

export function testFunction<Tx,Ty>(   fref:TAnyFunctionSingleArg<Ty,Tx>,   expData:Map<Tx,Ty>                       ,   expectError?:TExpectErrorMap<Tx,Ty> ):boolean
export function testFunction<Tx,Ty>(   fref:TAnyFunctionSingleArg<Ty,Tx>,   expData:           TOrderedPairsRO<Tx,Ty>,   expectError?:TExpectErrorArr<Tx,Ty> ):boolean
export function testFunction<Tx,Ty>( ö_fref:TAnyFunctionSingleArg<Ty,Tx>, ö_expData:Map<Tx,Ty>|TOrderedPairsRO<Tx,Ty>, ö_expectError?:TExpectErrorAll<Tx,Ty> ):boolean {
  //
     let ö_isMap = false;
    if ( ö_expData instanceof Map )
       { ö_expData = toOrderedPair( ö_expData );
         ö_isMap = true; }
  //
    const ö_name = ö_fref.name;
    let ö_overall = true;
    ö_expData.forEach(function( ü_x_y, ü_indx ){
        const ü_count = `${ ö_name }-${ ü_indx }(${ ß_echo( ü_x_y[0], 50 ) })`;
        let ü_act_y:Ty
        try {
                ü_act_y = ö_fref( ü_x_y[0] );
        } catch ( ü_eX ) {
            if ( typeof( ö_expectError ) === 'function' ) {
              try {
                ü_act_y = ö_isMap ? ö_expectError( ü_x_y[0], ü_eX, ü_x_y[1] )
                                  : ö_expectError( ü_x_y[0], ü_eX, ü_x_y    )
                                  ;
              } catch ( ü_eX_user ) {
                ö_overall = testNoError( ü_eX, ü_count );
                return;
              }
            } else {
                ö_overall = testNoError( ü_eX, ü_count );
                return;
            }
        }
        testEqual( ü_act_y, ü_x_y[1], ü_count )||( ö_overall = false );
    });
    return ö_overall;
}

//====================================================================

export function whenAsyncFunctionTested<Tx,Ty>(   aFref:TAsyncFunctionSingleArg<Ty,Tx>,   expData:Map<Tx,Ty>                     , ö_expectError?:TExpectErrorMap<Tx,Ty> ):PromiseLike<boolean>
export function whenAsyncFunctionTested<Tx,Ty>(   aFref:TAsyncFunctionSingleArg<Ty,Tx>,   expData:           TOrderedPairs<Tx,Ty>, ö_expectError?:TExpectErrorArr<Tx,Ty> ):PromiseLike<boolean>
export function whenAsyncFunctionTested<Tx,Ty>( ö_aFref:TAsyncFunctionSingleArg<Ty,Tx>, ö_expData:Map<Tx,Ty>|TOrderedPairs<Tx,Ty>, ö_expectError?:TExpectErrorAll<Tx,Ty> ):PromiseLike<boolean> {
    const ö_name = ö_aFref.name;
      let ö_errCount = 0;
  //
     let ö_isMap = false;
    if ( ö_expData instanceof Map )
       { ö_expData = toOrderedPair( ö_expData );
         ö_isMap = true; }
  //
      let ö_whenDone = Promise.resolve();
    ö_expData.forEach(
function( ä_x_y, ä_indx ){
        const ä_count = `${ ö_name }-${ ä_indx }(${ ß_echo( ä_x_y[0], 50 )  })`;
        const ä_x     = ä_x_y[0];
        const ä_exp_y = ä_x_y[1];
             let ü_whenDone = ö_whenDone.then( function(){  return ö_aFref( ä_x );  });
    if ( typeof( ö_expectError ) === 'function' )
               { ü_whenDone = ü_whenDone.then( undefined, ä_expectError ); }
    ö_whenDone = ü_whenDone.then( ä_fulfilled, ä_rejected );
  //
function ä_expectError( ü_reason:any ):Ty {
    return ö_isMap ? ö_expectError!( ä_x, ü_reason, ä_exp_y )
                   : ö_expectError!( ä_x, ü_reason, ä_x_y   )
                   ;
}
function ä_fulfilled( ü_act_Y:Ty ):void {
    testEqual( ü_act_Y, ä_exp_y, ä_count )||( ö_errCount ++ );
}
function ä_rejected( ü_reason:any ):void {
    ö_errCount ++ ;
    testNoError( ü_reason, ä_count );
}
}
    );
    return ö_whenDone.then( ()=> ö_errCount === 0 );
}

//====================================================================
/*
*/