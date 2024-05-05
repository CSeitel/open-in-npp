/*
*/
  import { type TAnyFunctionSingleArg
         , type TAsyncFunctionSingleArg
         , type TOrderedPairs
         , type TOrderedPairsRO
         } from '../types/generic.d';
  import { type TTestResult
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
  export const successSymbol = String.fromCharCode( 0x2705 ); // 0x221a
  export const failureSymbol = String.fromCharCode( 0x274c );
         const notEqual      = String.fromCharCode( 0x2260 );
         const ß_whiteSquare = String.fromCharCode( 0x25a1 );
         const ß_pilcrow     = String.fromCharCode( 0x00ba );
         const latinEpigraphicLetterReversedP = String.fromCharCode(0xa7fc);
//--------------------------------------------------------------------
         const successPrefix = successSymbol + ' ';
         const failurePrefix = failureSymbol + ' ';
//--------------------------------------------------------------------
  export const CWithMocha = typeof( suite ) !== 'undefined'
                         && typeof( test  ) !== 'undefined';
  export const CTestDirName = join( __dirname, '../../.vscode-temp' );
//--------------------------------------------------------------------
//const ß_escape = escapeFF( CRgXp.specialChars );
  const CSeriesOfTests = [] as TTestResult[];
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
function ä_expandTest( ü_testImpl:TAsyncTestFunction, ü_testName:string|number ):void {
    if ( typeof( ü_testName ) === 'number' ) { ü_testName = ü_testImpl.name; }
    test( ü_testName
        , function(){  return ü_testImpl().then(  testSummary.bind( null, ü_testName as string )  );  }
        );
}
}
}

//====================================================================

export function whenAllTestsRun( ü_suites:TTestSuites ):PromiseLike<number> {
  //
    if ( CWithMocha ) {
        ü_suites.forEach( expandTestSuite );
        return Promise.resolve( -1 );
    }
  //
    let ö_whenDone = Promise.resolve( 0 );
    ü_suites.forEach(function( ü_suite ){
        if ( ü_suite[2] ) { return; }
        ö_whenDone = ö_whenDone.then(function( ü_errCount ){
            return ß_whenTestSuite( ü_errCount, ü_suite[0], ü_suite[1] );
        });
    });
  //
    return ö_whenDone.then(function( ü_errCount ){
        ß_writeStdOut( ü_errCount > 0 ? `Overall result: ${ ü_errCount } tests have failed.`
                                      : 'Overall result: All tests have been passed successfully.' );
        process.exitCode = ü_errCount;
        process.exit( ü_errCount );
        return ü_errCount;
    });
}

function ß_whenTestSuite( ü_rc:number, ü_title:string, ü_tests:Record<string,TAsyncTestFunction>|TAsyncTestFunction[] ):PromiseLike<number> {
  //
    ß_writeStdOut( `Suite: ${ ü_title }` );
    let ö_whenDone = Promise.resolve( ü_rc );
    if ( Array.isArray( ü_tests ) ) { ü_tests.forEach(          ö_addWhenTested ); }
    else                            {         forEach( ü_tests, ö_addWhenTested ); }
  //
             return ö_whenDone;
  //
function ö_addWhenTested( ä_testImpl:TAsyncTestFunction, ä_testName:string|number ):void {
    if ( typeof( ä_testName ) === 'number' ) { ä_testName = ä_testImpl.name; }
    ö_whenDone = ö_whenDone.then( ä_whenTested );
  //
function ä_whenTested( ü_rc:number ):PromiseLike<number> {
    return ä_testImpl().then(function(){
        try {
            testSummary( ä_testName as string );
        } catch ( ü_eX ) {
            ü_rc ++ ;
        }
            return ü_rc;
                     }).then( function(){ return ü_rc; }
                            , function( ü_err ){
            ß_writeStdOut( ß_echo( ü_err, 300 ) );
            return ü_rc + 1;
        });
}
}
  //
}

//--------------------------------------------------------------------

export function testSummary_( ü_series?:string ):void {
    ß_trc&& ß_trc( 'testSummary_' );
  //testSummary();
}
export function testSummary( ü_testName:string ):void {
    const ü_crlf    = ß_RuntimeContext.lineSep;
    const ü_results = CSeriesOfTests.slice(0);
                      CSeriesOfTests.length = 0;
    const ü_all     = ü_results.length;
      let ü_failed  = '';
    if ( ü_all === 0 ) {
        ü_results.unshift( `${ ü_testName }: No checks` );
    } else {
        const ü_success = ü_results.filter( ü_test => ü_test.startsWith( successSymbol ) );
        const ü_ok  = ü_success.length;
        const ü_ratio = Math.round( ü_ok / ü_all * 100 );
        if ( ü_ok < ü_all ) { ü_failed = `${ ü_all - ü_ok } Failures`; }
        ü_results.unshift( `${ ü_testName }: Success-rate: ${ ü_ok }/${ ü_all } = ${ ü_ratio }%` );
    }
  //
    ß_writeStdOut(  ü_results.join( ü_crlf ) + ü_crlf  );
    if ( ü_failed.length > 0 ) { throw new Error( ü_failed ); }
}

//====================================================================

export function testNever( ü_message?:string ):false {
    
    CSeriesOfTests.push( failurePrefix
                       + ( ü_message ? ü_message +' '
                                     :            '' )
                       + 'should not be reached' );
    return false;
}
export function testFailed( ü_reason:any, ü_message?:string ):false {
                                                             const ü_echo = 'Exception caught: '+ ß_echo( ü_reason, 200 );
    CSeriesOfTests.push( failurePrefix
                       + ( ü_message === undefined ?               ü_echo
                                                 : ü_message +' '+ ü_echo ) );
    return false;
}

export function testEqual   <T=any>( ü_act:unknown, ü_exp:T, ü_message?:string ):boolean { return testCondition<T>( ü_act === ü_exp, notEqual, ü_act, ü_exp, ü_message ); }
export function testNotEqual<T=any>( ü_act:unknown, ü_exp:T, ü_message?:string ):boolean { return testCondition<T>( ü_act !== ü_exp, '='     , ü_act, ü_exp, ü_message ); }

export function testCondition<T=any>( ü_cond:boolean, ü_icon:string, ü_act:unknown, ü_exp:T, ü_message?:string ):boolean {
    const ü_echo = ü_cond
                 ? successPrefix + `${ ß_echo( ü_exp, 50 ) }`
                 : failurePrefix + `${ ß_echo( ü_exp, 50 ) } ${ ü_icon } ${ ß_echo( ü_act, 50 ) }`
                 ;
    CSeriesOfTests.push( ü_message ? ü_echo +' '+ ü_message
                                   : ü_echo );
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
                ö_overall = testFailed( ü_eX, ü_count );
                return;
              }
            } else {
                ö_overall = testFailed( ü_eX, ü_count );
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
      let ö_overall = 0;
  //
     let ö_isMap = false;
    if ( ö_expData instanceof Map )
       { ö_expData = toOrderedPair( ö_expData );
         ö_isMap = true; }
  //
      let ö_whenDone = Promise.resolve();
    const ü_all_whenY = ö_expData.map(function( ä_x_y, ä_indx ){
        const ä_count = `${ ö_name }-${ ä_indx }(${ ß_echo( ä_x_y[0], 50 ) })`;
        const ä_x     = ä_x_y[0];
        const ä_exp_y = ä_x_y[1];
           let ü_whenDone = ö_whenDone.then( function(){  return ö_aFref( ä_x );  });
        if ( typeof( ö_expectError ) === 'function' )
             { ü_whenDone = ü_whenDone.then( undefined  , ä_expectError ); }
        return ö_whenDone = ü_whenDone.then( ä_fulfilled, ä_rejected    );
  //
function ä_expectError( ü_reason:any ):Ty {
    return ö_isMap ? ö_expectError!( ä_x, ü_reason, ä_exp_y )
                   : ö_expectError!( ä_x, ü_reason, ä_x_y   )
                   ;
}
function ä_fulfilled( ü_act_Y:Ty ):void {
    testEqual( ü_act_Y, ä_exp_y, ä_count )||( ö_overall ++ );
}
function ä_rejected( ü_reason:any ):void {
    ö_overall ++ ;
    testFailed( ü_reason, ä_count );
}
    });
    return ö_whenDone.then( ()=> ö_overall === 0 );
}

/*
    const ü_failed = {} as Record<number,any>;
    const ö_last = ö_expData.length -1;
    //let ö_all_Y:PromiseSettledResult<Awaited<Ty>>[] = [];
            try {
                return Promise.resolve( ü_x_y[0] ).then(  ö_aFref );
              //return ö_aFref( ü_x_y[0] );
            } catch ( ü_eX ) {
                return Promise.reject( ü_eX );
            }
    forEach( ü_failed, function( ü_reason, ü_mKey ){ ö_all_Y[ ü_mKey] = { status:'rejected' , reason:  ü_reason }; });
  //
     const ö_all_Y = await Promise.allSettled( ü_all_whenY );
  //
    ö_expData.forEach(function( ü_x_y, ü_indx ){
        const ü_count = `${ ö_name }-${ ü_indx }(${ ß_echo( ü_x_y[0], 50 ) })`;
        const ü_exp_y = ü_x_y[1];
        const ü_act_Y = ö_all_Y[ ü_indx ];
        let ü_act_y:Ty
        if ( ü_act_Y.status === 'fulfilled' ) {
            ü_act_y = ü_act_Y.value;
        } else {
            if ( typeof( ö_expectError ) === 'function' ) {
              try {
                ü_act_y = ö_isMap ? ö_expectError( ü_x_y[0], ü_act_Y.reason, ü_exp_y )
                                  : ö_expectError( ü_x_y[0], ü_act_Y.reason, ü_x_y   )
                                  ;
              } catch ( ü_eX_user ) {
                ö_overall = testFailed( ü_act_Y.reason, ü_count );
                return;
              }
            } else {
                ö_overall = testFailed( ü_act_Y.reason, ü_count );
                return;
            }
        }
        testEqual( ü_act_y, ü_exp_y, ü_count )||( ö_overall = false );
    });
  //
    return ö_overall;
*/

//====================================================================
/*
*/