/*
*/
  import { type TAssert
         , type TTestResult
         , type TResultArray
         , type TAnyFunction
         , type TAsyncTestFunction
         , type TArgMap
         , type TArgumentsInfo
         } from '../types/lib.testUtil.d';
//--------------------------------------------------------------------
  import { join
         } from 'path';
  import { inspect
         } from 'util';
  import { shortenText
         } from './textUtil';
  import { straightenArray
         } from './arrayUtil';
//--------------------------------------------------------------------
  export const CTestDirName = join( __dirname, '../../.vscode-temp' );
  const CSeriesOfTests = [] as TTestResult[];
  const CSuiteOfTests  = [] as Promise<void>[];
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

export function testSuite( ü_name:string, ü_tests:Record<string,TAsyncTestFunction>|TAsyncTestFunction[], ü_skip = false ):void {
    const ü_withMocha = typeof( suite ) !== 'undefined';
  //
    const ü_suiteApi = ü_withMocha ? suite
                                   : function(title:string,impl:()=>void){ console.log( title ); impl(); }
                                   ;
    const ü_testApi  = ü_withMocha ? test
                                   : function(title:string,impl:()=>Promise<void>){ console.log( title ); CSuiteOfTests.push( impl() ); }
                                   ;
  //
    const ü_suite = ü_skip
                  ? ()=>{}
                  : Array.isArray( ü_tests )
                  ? function(){              ü_tests  .forEach(function( ü_testImpl ){  ü_testApi( ü_testImpl.name, ü_testImpl            );  }) }
                  : function(){ Object.keys( ü_tests ).forEach(function( ü_testName ){  ü_testApi( ü_testName     , ü_tests[ ü_testName ] );  }) }
                  ;
  //
    ü_suiteApi( ü_name, ü_suite );
}

export async function whenTestSuite():Promise<void> {
    const ü_done = await Promise.allSettled( CSuiteOfTests )as PromiseRejectedResult[];
    ü_done.filter(function( ü_prms ){ return ü_prms.status === 'rejected' })
          .forEach(function( ü_prms ){ console.error( ü_prms.reason ); })
    CSeriesOfTests.length = 0;
}

export function testToggle( ü_testImpl:TAsyncTestFunction, ü_disable = false ):TAsyncTestFunction {
    return ü_disable ? async ()=>{}
                     : ü_testImpl
                     ;
}

//====================================================================

export function bind<T>( ö_fref:TAnyFunction<T>, ö_map:TArgumentsInfo, ...ö_baseArgs:readonly any[] ):TAnyFunction<T> {
    return ö_bound;
//
function ö_bound( ...ü_realArgs:any[] ):T {
  //
    const ü_args = ö_map.realFirst === true ? ü_realArgs.concat( ö_baseArgs )
                                            : ö_baseArgs.concat( ü_realArgs );
    if ( ö_map.arrangeBound !== undefined ) { ö_map.arrangeBound.forEach(function( ü_new, ü_old ){ ü_args[ ü_new ] = ö_baseArgs[ ü_old ]; }); }
    if ( ö_map.arrangeReal  !== undefined ) { ö_map.arrangeReal .forEach(function( ü_new, ü_old ){ ü_args[ ü_new ] = ü_realArgs[ ü_old ]; }); }
  //
    if ( ö_map.refine !== undefined ) {
        for ( const ü_indx in ö_map.refine ) {
            ü_args[ ü_indx ] = ö_map.refine[ ü_indx ]( ü_args[ ü_indx ] );
        }
    }
  //
    return ö_fref.apply( ö_map.that, ü_args );
}
}

//====================================================================
  type TR = TTestResult|readonly TTestResult[]

export function testSummary( ü_assertEqual:TAssert, ü_series?:string ):string {
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
    const ü_echo = ü_results.join( ü_crlf );// + ü_crlf;
  //
    CSeriesOfTests.length = 0;
    ü_assertEqual( ü_ok, ü_all, ü_echo );
    return ü_echo;
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

export async function testAsyncFunction<Tx,Ty,Tz>( ö_aFref  : (x:Tx)=>Promise<Ty>
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