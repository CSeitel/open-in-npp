/*
*/
  import { type TAnyFunctionSingleArg
         , type TAsyncFunctionSingleArg
         , type TOrderedPairs
         , type TOrderedPairsRO
         } from '../types/generic.d';
  import { type TTestResult
         , type TTestSummary
         , type TAsyncTestFunction
         , type TTestSuites
         , type TTestSuiteDefinition
         } from '../types/lib.testUtil.d';
//--------------------------------------------------------------------
  import { join
         } from 'path';
  import { ß_trc
         , ß_RuntimeContext
         , ß_writeStdOut
         , ß_stringify
         } from '../runtime/context';
  import { toOrderedPair
         } from './arrayUtil';
  import { forEach
         } from './objectUtil';
  import { shortenText
         } from './textUtil';
//--------------------------------------------------------------------
  export const successSymbol     = String.fromCharCode( 0x2705 ); // 0x221a
  export const failureSymbol     = String.fromCharCode( 0x274c );
         const okSymbol          = String.fromCharCode( 0x2714 );
         const undefinedSymbol   = String.fromCharCode( 0xfffd )+' ';
         const emptyStringSymboL = '\u2036\u2033';//String.fromCharCode( 0xff02 );
         const emptyStringSymbOl = '\u2035\u2032';//String.fromCharCode( 0xff02 );
         const emptyStringSymbol = '\u201e\u2033';//String.fromCharCode( 0xff02 );

         const ß_whiteSquare = String.fromCharCode( 0x25a1 );
         const ß_pilcrow     = String.fromCharCode( 0x00ba );
         const latinEpigraphicLetterReversedP = String.fromCharCode(0xa7fc);
//--------------------------------------------------------------------
  export const enum CECheckIcon {
      notEqual = '≠' //String.fromCharCode( 0x2260 );
    ,    equal = '='
  }
//--------------------------------------------------------------------
         const successPrefix = successSymbol + ' ';
         const failurePrefix = failureSymbol + ' ';
         const      okPrefix =      okSymbol + ' ';
//--------------------------------------------------------------------
  export const CWithMocha = typeof( suite ) !== 'undefined'
                         && typeof( test  ) !== 'undefined';
  export const CTestDirName = join( __dirname, '../../.vscode-temp' );
//--------------------------------------------------------------------
//const ß_escape = escapeFF( CRgXp.specialChars );
  const CSeriesOfTests = [] as TTestResult[];
  const LCHeader =
    { should    : (ü_msg   :string               )=> successPrefix+`Should have happened: ${ ü_msg }`
    , shouldNot : (ü_msg   :string               )=> failurePrefix+`Should not have happened: ${ ü_msg }`
    , noError   : (ü_msg   :string,ü_err  :string)=> failurePrefix+`For \`\`${ ü_msg }\`\` an exception has occurred: ${ ü_err }`
    , never     : (ü_msg   :string               )=> failurePrefix+`Shouldn't have been reached: ${ ü_msg }`
    , REJECTED_0: (ü_msg   :string,ü_val  :string)=> `No rejection for \`\`${ ü_msg }\`\` due to result: ${ ü_val }`
    , REJECTED_1: (ü_msg   :string,ü_err  :string)=> `Rejection for '${ ü_msg }' due to '${ ü_err }'`
    , TEST_0    : (ü_test  :string               )=>      okPrefix+`Result of "${ ü_test }": Test contains no checks.`
    , TEST_OK   : (ü_test  :string,ü_all  :number)=>      okPrefix+`Result of "${ ü_test }": ${ ü_all    } checks have been passed successfully.`
    , TEST_ERR  : (ü_test  :string,ü_all  :number
                  ,ü_failed:number,ü_ratio:number)=> failurePrefix+`Result of "${ ü_test }": ${ ü_failed } (out of ${ ü_all }) checks have failed. Success-ratio: ${  ü_ratio }%`
    , SUM_OK    : (ü_all   :number               )=>      okPrefix+`Overall test result: ${ ü_all    } tests have been passed successfully.`
    , SUM_ERR   : (ü_all   :number
                  ,ü_failed:number,ü_ratio:number)=> failurePrefix+`Overall test result: ${ ü_failed } (out of ${ ü_all }) tests have failed. Success-ratio: ${  ü_ratio }%`
    , cond_s1   : (ü_msg   :string,ü_icon :string
                  ,ü_both  :string               )=> successPrefix+`${ ü_icon } ${ ü_both } for ${ ü_msg }`
    , cond_f1   : (ü_msg   :string,ü_icon :string
                  ,ü_both  :string               )=> failurePrefix+`${ ü_icon } ${ ü_both } for ${ ü_msg }`
    , cond_s2   : (ü_msg   :string,ü_icon :string
                  ,ü_act   :string,ü_exp  :string)=> successPrefix+`${ ü_act } ${ ü_icon } ${ ü_exp } for ${ ü_msg }`
    , cond_f2   : (ü_msg   :string,ü_icon :string
                  ,ü_act   :string,ü_exp  :string)=> failurePrefix+`${ ü_act } ${ ü_icon } ${ ü_exp } for ${ ü_msg }`
    };
//====================================================================

function ß_echo( ü_oref:any, ü_length:number ):string {
    const ü_json = JSON.stringify( ß_stringify( ü_oref ) );
    return shortenText( ü_json.slice( 1, ü_json.length-1 ), ü_length );
}

export function testSrc( ...ü_segs:string[] ):string {
    return join( CTestDirName, ...ü_segs );
}

//====================================================================

export function expandTestSuite( ü_suite:TTestSuiteDefinition ):void {
               if ( ü_suite[2] ) { return; }
    const ö_tests = ü_suite[1];
             suite( ü_suite[0], ö_expandTests );
  //
function ö_expandTests():void {
    if ( Array.isArray( ö_tests ) ) { ö_tests.forEach(          ä_expandTest ); }
    else                            {         forEach( ö_tests, ä_expandTest ); }
  //
function ä_expandTest( ö_testImpl:TAsyncTestFunction, ö_testName:string|number ):void {
    if ( typeof( ö_testName ) === 'number' )
               { ö_testName = ö_testImpl.name; }
    const ö_testSummary = testSummary.bind( null, ö_testName as string, true );
    test( ö_testName, ö_whenTested );
  //
function ö_whenTested(){
    let ü_whenDone:PromiseLike<void>
    try {
        ü_whenDone = ö_testImpl();
    } catch ( ü_eX ) {
        ü_whenDone = Promise.reject( ü_eX );
    }
    return ü_whenDone.then( undefined, testNoError ).then(  ö_testSummary  );
}
}
}
}

//====================================================================

export function whenAllTestsRun( ü_suites:TTestSuites ):PromiseLike<TTestSummary> {
  //
    if ( CWithMocha ) {
        ü_suites.forEach( expandTestSuite );
        return Promise.resolve({ all:-1, failed:-1 });
    }
  //
    let ö_whenDone = Promise.resolve({ all:0, failed:0 });
    ü_suites.forEach(function( ü_suite ){
        if ( ü_suite[2] ) { return; }
        ö_whenDone = ö_whenDone.then(function( ü_errCount ){
            return ß_whenTestSuite( ü_errCount, ü_suite[0], ü_suite[1] );
        });
    });
  //
    return ö_whenDone.then(function( ü_sum ){
        ß_writeStdOut( ü_sum.failed > 0 ? LCHeader.SUM_ERR( ü_sum.all, ü_sum.failed, Math.round( ( 1 - ü_sum.failed / ü_sum.all ) * 100 ) )
                                        : LCHeader.SUM_OK ( ü_sum.all )
                                        );
      //process.exitCode = ü_sum.failed  ;
      //process.exit     ( ü_sum.failed );
                    return ü_sum;
    });
}

function ß_whenTestSuite( ü_sum:TTestSummary, ü_title:string, ü_tests:Record<string,TAsyncTestFunction>|TAsyncTestFunction[] ):PromiseLike<TTestSummary> {
  //
    ß_writeStdOut( `Suite: ${ ü_title }` );
    let ö_whenDone = Promise.resolve( ü_sum );
    if ( Array.isArray( ü_tests ) ) { ü_tests.forEach(          ö_addWhenTested ); }
    else                            {         forEach( ü_tests, ö_addWhenTested ); }
  //
             return ö_whenDone;
  //
function ö_addWhenTested( ä_testImpl:TAsyncTestFunction, ä_testName:string|number ):void {
    if ( typeof( ä_testName ) === 'number' ) { ä_testName = ä_testImpl.name; }
    ö_whenDone = ö_whenDone.then( ä_whenTested );
  //
function ä_whenTested( ö_sum:TTestSummary ):PromiseLike<TTestSummary> {
    ö_sum.all ++ ;
    let ü_whenDone:PromiseLike<void>
    try {
        ü_whenDone = ä_testImpl();
    } catch ( ü_eX ) {
        ü_whenDone = Promise.reject( ü_eX );
    }
    return ü_whenDone.then( undefined, testNoError )
                     .then(
      function(){
           const ü_sum = testSummary( ä_testName as string );
            if ( ü_sum.failed > 0 )
               { ö_sum.failed ++ ; }
          return ö_sum;
      }
    );
  /*).then( undefined
    , function( ü_err ){
          testFailed( ü_err, '' );
          ß_writeStdOut( ß_echo( ü_err, 300 ) );
                 ö_sum.failed ++ ;
          return ö_sum;
      }
*/
}
}
  //
}

//--------------------------------------------------------------------

export function testSummary( ü_testName:string, ü_throw?:boolean ):TTestSummary {
    const ü_crlf    = ß_RuntimeContext.lineSep;
    const ü_results = CSeriesOfTests.slice(0);
                      CSeriesOfTests.length = 0;
      let ü_head:string
      let ü_throwErrorText = '';
    const ü_all     = ü_results.length;
    const ü_sum:TTestSummary =
      { all   : ü_all
      , failed: 0
      }
    if ( ü_all === 0 ) {
        ü_head = LCHeader.TEST_0( ü_testName );
    } else {
        const ü_success = ü_results.filter( ü_test => ü_test.startsWith( successSymbol ) );
        const ü_ok      = ü_success.length;
        if ( ü_all > ü_ok ) {
                                               ü_sum.failed = ü_all - ü_ok;
                 ü_head = LCHeader.TEST_ERR( ü_testName, ü_all, ü_sum.failed, Math.round( ü_ok / ü_all * 100 ) );
            if ( ü_throw ) { ü_throwErrorText = ü_head; }
        } else { ü_head = LCHeader.TEST_OK ( ü_testName, ü_all );
        }
    }
  //
                    ü_results.unshift( ü_head );
                    ü_results.push   ( ''     );
    ß_writeStdOut(  ü_results.join( ü_crlf )  );
  //
    if ( ü_throwErrorText.length > 0 ) { throw new Error( ü_throwErrorText ); }
    return ü_sum;
}

//====================================================================

export function testShould   ( ü_message = undefinedSymbol ):true  { CSeriesOfTests.push(  LCHeader.should   ( ü_message ) ); return true ; }
//port function testShouldNot( ü_message = undefinedSymbol ):false { CSeriesOfTests.push(  LCHeader.shouldNot( ü_message ) ); return false; }
export function testNever    ( ü_message = undefinedSymbol ):false { CSeriesOfTests.push(  LCHeader.never    ( ü_message ) ); return false; }
export function testNoError( ü_reason:any, ü_message = undefinedSymbol ):false {
    CSeriesOfTests.push(  LCHeader.noError( ü_message, ß_echo( ü_reason, 256 ) )  );
    return false;
}

export function testRejected<T=any>( ü_whenDone:PromiseLike<T>, ö_message = undefinedSymbol, ü_expectError?:( ü_reason:any )=>boolean ):PromiseLike<boolean> {
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

export function testEqual   <T=any>( ü_act:unknown, ü_exp:T, ü_message = undefinedSymbol ):boolean { return ß_testCondition<T>( ü_act === ü_exp, CECheckIcon.   equal, ü_act, ü_exp, ü_message ); }
export function testNotEqual<T=any>( ü_act:unknown, ü_exp:T, ü_message = undefinedSymbol ):boolean { return ß_testCondition<T>( ü_act !== ü_exp, CECheckIcon.notEqual, ü_act, ü_exp, ü_message ); }

function ß_testCondition<T=any>( ü_cond:boolean, ü_icon:CECheckIcon, ü_act:unknown, ü_exp:T, ü_message = undefinedSymbol ):boolean {
    switch ( ü_icon ) {
      case CECheckIcon.equal   :
          CSeriesOfTests.push(  ü_cond ? LCHeader.cond_s1( ü_message, ü_icon, ß_echo( ü_act, 50 ) || emptyStringSymbol )
                                       : LCHeader.cond_f2( ü_message, ü_icon, ß_echo( ü_act, 50 ) || emptyStringSymbol
                                                                            , ß_echo( ü_exp, 50 ) || emptyStringSymbol )
                             ); break;
      case CECheckIcon.notEqual:
          CSeriesOfTests.push( !ü_cond ? LCHeader.cond_f1( ü_message, ü_icon, ß_echo( ü_act, 50 ) || emptyStringSymbol )
                                       : LCHeader.cond_s2( ü_message, ü_icon, ß_echo( ü_act, 50 ) || emptyStringSymbol
                                                                            , ß_echo( ü_exp, 50 ) || emptyStringSymbol )
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
        const ä_count = `${ ö_name }-${ ä_indx }(${ ß_echo( ä_x_y[0], 50 ) || emptyStringSymbOl })`;
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