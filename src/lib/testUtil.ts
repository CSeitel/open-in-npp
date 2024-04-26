/*
*/
  import { TAnyFunctionWithoutArg
         , TAsyncFunctionWithoutArg
         , TAnyFunctionSingleArg
         , TAsyncFunctionSingleArg
         } from '../types/generic.d';
  import { type TTestResult
         , type TAsyncTestFunction
         , type TTestSuites
         , type TTestSuiteDefinition
         , type TTestSuite
         , type TTDDSuite
         , type TTDDTest
         } from '../types/lib.testUtil.d';
  import { type TOrderedPairArray
         } from '../types/lib.arrayUtil.d';
//--------------------------------------------------------------------
  import { join
         } from 'path';
  import { ß_trc
         , ß_RuntimeContext
         , ß_writeStdOut
         , ß_stringify
         } from '../runtime/context';
  import { shortenText
         } from './textUtil';
  import { toOrderedPairArray
         } from './arrayUtil';
  import { forEach
         } from './objectUtil';
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
  const CSeriesOfTests = [] as TTestResult[];
  //process.stdout.write.bind( process.stdout );
//====================================================================
function ß_echo( ü_oref:any, ü_length:number ):string {
    return shortenText( ß_stringify( ü_oref ), ü_length ).replace( /[\n\r\t]/g, escape );
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
        , function(){ return ü_testImpl().then(  testSummary.bind( null, ü_testName as string )  ); }
        );
}
}
}

//====================================================================

export async function whenAllTestsRun( ü_suites:TTestSuites ):Promise<void> {
  //
    if ( CWithMocha ) {
        ü_suites.forEach( expandTestSuite );
        return;
    }
  //
    let ö_whenDone = Promise.resolve( 0 );
    ü_suites.forEach(function( ü_suite ){
        if ( ü_suite[2] ) { return; }
        ö_whenDone = ö_whenDone.then(function( ü_rc ){
            return ß_whenTestSuite( ü_rc, ü_suite[0], ü_suite[1] );
        });
    });
  //
    const ü_rc = await ö_whenDone;
    ß_writeStdOut( `Overall result: ${ ü_rc } failed tests` );
    process.exit( ü_rc );
}

function ß_whenTestSuite( ü_rc:number, ü_title:string, ü_tests:Record<string,TAsyncTestFunction>|TAsyncTestFunction[] ):PromiseLike<number> {
  //
    ß_writeStdOut( `Suite: ${ ü_title }` );
    let ö_whenDone = Promise.resolve( ü_rc );
    if ( Array.isArray( ü_tests ) ) { ü_tests.forEach(          ö_addWhenTested ); }
    else                            {         forEach( ü_tests, ö_addWhenTested ); }
  //
  //          const ü_rc = await ö_whenDone;
  //ß_errorCount += ü_rc;
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

export function testFailed<T=any>( ü_reason:any, ü_message?:string ):false {
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
  type TExpectError<Tx,Ty> = ( x:[Tx,Ty], reason:any )=>Ty

export function testFunction<Tx,Ty>( ö_fref   :TAnyFunctionSingleArg<Ty,Tx>
                                   , ö_expData:                  Map<Tx,Ty>
                                              |    TOrderedPairArray<Tx,Ty>
                                   , ö_expectError?:    TExpectError<Tx,Ty>
                                   ):boolean {
  //
    if ( ö_expData instanceof Map )
       { ö_expData = toOrderedPairArray( ö_expData ); }
  //
    let ö_overall = true;
    ö_expData.forEach(function( ü_x_y, ü_indx ){
        const ü_count = `@${ ü_indx }: "${ ß_echo( ü_x_y, 50 ) }"`;
        try {
                 const ü_act_y = ö_fref( ü_x_y[0] );
            testEqual( ü_act_y ,         ü_x_y[1] , ü_count )||( ö_overall = false );
        } catch ( ü_eX ) {
            CSeriesOfTests.push(  failurePrefix +'Function threw: '+ ß_echo( ü_eX, 200 )  );
            ö_overall = false;
        }
    });
    return ö_overall;
}

//====================================================================

export async function whenAsyncFunctionTested<Tx,Ty>( ö_aFref  :TAsyncFunctionSingleArg<Ty,Tx>
                                                    , ö_expData:                    Map<Tx,Ty>
                                                               |      TOrderedPairArray<Tx,Ty>
                                                    , ö_expectError?:(x:Tx,reason:any,y:Ty)=>Ty
                                                    ):Promise<boolean> {
  //
    if ( ö_expData instanceof Map )
       { ö_expData = toOrderedPairArray( ö_expData ); }
  //
    const ü_allWhenY = ö_expData.map(function( ü_x_y ){
        try {
            return ö_aFref( ü_x_y[0] );
        } catch ( ü_eX ) {
            return Promise.reject( ü_eX );
        }
    });
  //
    const ö_allY = await Promise.allSettled( ü_allWhenY );
  //
    let ü_all:boolean = true;
    ö_expData.forEach(function( ü_x_y, ü_indx ){
        const ü_count = `[${ ü_indx }] ${ ß_echo( ü_x_y, 50 ) }`;
        const ü_exp_y = ü_x_y[1];
        const ü_act_y = ö_allY[ ü_indx ];
        if ( ü_act_y.status === 'fulfilled' ) {
                    testEqual( ü_act_y.value, ü_exp_y, ü_count )||( ü_all = false );
            return;
        }
        if ( typeof( ö_expectError ) === 'function' ) {
                try {
                                  const ü_act_y_value = ö_expectError( ü_x_y[0], ü_act_y.reason, ü_exp_y );
                    testEqual( ü_exp_y, ü_act_y_value, ü_count )||( ü_all = false );
                    return;
                  /*
                  */
                } catch ( ü_eX ) {
                }
        }
            testFailed( ü_act_y.reason, ü_count )||( ü_all = false );
    });
  //
    return ü_all;
}

//====================================================================
/*
*/