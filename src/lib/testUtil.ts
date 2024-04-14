/*
*/
  import { type TTestResult
         , type TResultArray
         , type TAsyncTestFunction
         , type TTestSuite
         } from '../types/lib.testUtil.d';
//--------------------------------------------------------------------
  import { join
         } from 'path';
  import { inspect
         } from 'util';
  import { ß_writeStdOut
         } from '../runtime/context';
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
  export const CWithMocha = typeof( suite ) !== 'undefined';
  export const CTestDirName = join( __dirname, '../../.vscode-temp' );
  const CSeriesOfTests = [] as TTestResult[];
  let ß_errorCount = 0;
  //process.stdout.write.bind( process.stdout );
//====================================================================

export function testSrc( ...ü_segs:string[] ):string {
    return join( CTestDirName, ...ü_segs );
}

export function identity<T>( ü_x:T ):T {
    return ü_x;
}

export function echo( ü_oref:any, ü_length:number ):string {
    return shortenText( inspect( ü_oref ), ü_length );
}

//====================================================================

export async function whenAllTestsRun( ü_suites:[string,TTestSuite,boolean|undefined][] ):Promise<number> {
    while ( ü_suites.length > 0 ) {
        const ü_suite = ü_suites.shift()!;
        await whenTestSuite( ... ü_suite );
    }
  //
    return suiteSummary();
}

export function suiteSummary():number {
    const ü_rc = ß_errorCount;
                 ß_errorCount = 0;
    if ( ! CWithMocha ) {
        ß_writeStdOut( `Overall result: ${ ü_rc } failed tests` );
        process.exit( ü_rc );
    }
    return ü_rc;
}

 async function whenTestSuite( ü_title:string, ö_tests:Record<string,TAsyncTestFunction>|TAsyncTestFunction[], ü_skip = false ):Promise<number> {
    if ( ü_skip ) { return 0; }
  //
    const ü_chain = [ Promise.resolve(0) ];
    const ü_isArray = Array.isArray( ö_tests );
    const ö_testApi  = CWithMocha ? test
                                  : ß_testChain( ü_chain );
    if ( CWithMocha ) {
        suite( ü_title, ü_isArray ? ö_suiteArray
                                  : ö_suiteRecord );
        return 0;
    } else {
    }
  //
    ß_writeStdOut( ü_title );
    if ( ü_isArray ) { ö_suiteArray (); }
    else             { ö_suiteRecord(); }
  //
    const ü_rc = await ü_chain[0];
    ß_errorCount += ü_rc;
    return ü_rc;
  //
function ö_suiteArray():void {
    for ( const ü_testImpl of ö_tests as TAsyncTestFunction[] ) {
        ö_testApi( ü_testImpl.name, ü_testImpl );
    }
}
function ö_suiteRecord():void {
    for ( const ü_testName in ö_tests ) {
        ö_testApi( ü_testName, ( ö_tests as Record<string,TAsyncTestFunction> )[ ü_testName ] );
    }
}
}

function ß_testChain( ö_chain:Promise<number>[] ) {
 return function ö_testChain( ü_title:string, ü_impl:TAsyncTestFunction ):void {
    ö_chain[0] = ö_chain[0].then(function( ö_rc ){
        ß_writeStdOut( ü_title );
        return ü_impl().then( function(){ return ö_rc; }
                            , function( ü_err ){
            ß_writeStdOut( echo( ü_err, 300 ) );
            return ö_rc + 1;
        }
                            )
    });
 };
}

//====================================================================

export function testSummary( ü_series?:string ):void {
  //
    const ü_results = CSeriesOfTests;
    const ü_crlf = '\r\n';
    const ü_success = ü_results.filter( ü_test=>{ return ü_test.startsWith( successSymbol ); } )
    const ü_all = ü_results.length;
    const ü_ok  = ü_success.length;
    const ü_ratio = Math.round( ü_ok / ü_all * 100 );
  //
    const ü_head = ü_series === undefined ? ''
                                          : ü_series + ': ';
    ü_results.unshift(  `${ ü_head }Success-rate: ${ ü_ok }/${ ü_all } = ${ ü_ratio }%` );
    const ü_echo = ü_results.join( ü_crlf ) + ü_crlf;
  //
    CSeriesOfTests.length = 0;
    ß_writeStdOut( ü_echo );
    if ( ü_ok === ü_all ) {  }
    else                  { throw new Error( `${ ü_all - ü_ok } Failures` ); }
}

export function testFailed<T=any>( ü_reason:any, ü_message?:string ):false {
                                                         const ü_echo = 'Exception caught: '+ echo( ü_reason, 200 );
    CSeriesOfTests.push( failurePrefix
                       + ( ü_message === undefined ?               ü_echo
                                                 : ü_message +' '+ ü_echo ) );
    return false;
}

export function testEqual   <T=any>( ü_act:unknown, ü_exp:T, ü_message?:string ):boolean { return testCondition<T>( ü_act === ü_exp, notEqual, ü_act, ü_exp, ü_message ); }
export function testNotEqual<T=any>( ü_act:unknown, ü_exp:T, ü_message?:string ):boolean { return testCondition<T>( ü_act !== ü_exp, '='     , ü_act, ü_exp, ü_message ); }

export function testCondition<T=any>( ü_cond:boolean, ü_icon:string, ü_act:unknown, ü_exp:T, ü_message?:string ):boolean {
    const ü_echo = ü_cond
                 ? successPrefix + `${ echo( ü_exp, 50 ) }`
                 : failurePrefix + `${ echo( ü_exp, 50 ) } ${ ü_icon } ${ echo( ü_act, 50 ) }`
                 ;
    CSeriesOfTests.push( ü_message ? ü_echo +' '+ ü_message
                                   : ü_echo );
    return ü_cond;
}

//====================================================================

export async function whenAsyncFunctionTested<Tx,Ty,Tz>( ö_aFref  : (x:Tx)=>Promise<Ty>
                                                 , ö_expData:          Map<Tx,Ty|Tz>
                                                            | TResultArray<Tx,Ty|Tz>
                                                 , ö_expectError?:(x:Tx,reason:any)=>boolean
                                                 ):Promise<boolean> {
  //
    if (!( ö_expData instanceof Map )) { ö_expData = new Map( ö_expData ); }
    const ü_keys = Array.from( ö_expData.keys() );
  //
    const ü_done = await Promise.allSettled( ü_keys.map(function( ü_x ){
        return ö_aFref( ü_x );
      }) );
  //
    let ü_all:boolean = true;
    ü_keys.forEach(function( ü_x, ü_indx ){
        const ü_count = `[${ ü_indx }] ${ echo( ü_x, 50 ) }`;
        const ü_act_y = ü_done[ ü_indx ];
        const ü_exp_y = (ö_expData as Map<Tx,Ty>).get( ü_x );
        if ( ü_act_y.status === 'fulfilled' ) {
                    testEqual( ü_act_y.value, ü_exp_y, ü_count )||( ü_all = false );
        } else {
            if ( ö_expectError !== undefined ) {
                try {
                  if ( ö_expectError( ü_x, ü_act_y.reason ) === true ) {
                    testEqual( ü_exp_y, ü_exp_y, ü_count )||( ü_all = false );
                    return;
                  }
                } catch ( ü_eX ) {
                }
            }
            testFailed( ü_act_y.reason, ü_count )||( ü_all = false );
        }
    });
  //
    return ü_all;
}

//====================================================================

export function testFunction<Tx,Ty,Tz>( ö_fref   :        (x:Tx)=>Ty
                                      , ö_expData:         Map<Tx,Ty|Tz>
                                                 |TResultArray<Tx,Ty|Tz>
                                      ):boolean {
  //
    if (!( ö_expData instanceof Map )) { ö_expData = new Map( ö_expData ); }
    const ü_keys = Array.from( ö_expData.keys() );
  //
    let ü_all:boolean = true;
    ü_keys.forEach(function( ü_x, ü_indx ){
        try {
          const ü_act_y =                          ö_fref( ü_x );
          const ü_exp_y = ( ö_expData as Map<Tx,Ty> ).get( ü_x );
          testEqual( ü_act_y, ü_exp_y )||( ü_all = false );
        } catch ( ü_eX ) {
            CSeriesOfTests.push(  failurePrefix +'Function threw: '+ echo( ü_eX, 200 )  );
            ü_all = false;
        }
    });
    return ü_all;
}

//====================================================================
/*
*/