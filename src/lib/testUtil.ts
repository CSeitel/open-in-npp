/*
*/
  import { type TAssert
         , type TTestResult
         , type TResultArray
         , type TAnyFunction
         , type TArgMap
         , type TArgumentsInfo
         } from '../types/lib.testUtil.d';
//--------------------------------------------------------------------
  import { inspect
         } from 'util';
  import { shortenText
         } from './textUtil';
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

export function testSuite( ü_name:string, ü_tests:(()=>any)[] ):void {
    suite( ü_name, function(){
        ü_tests.forEach(function( ü_testImpl ){
            test( ü_testImpl.name, ü_testImpl );
        });
    });
}

export function echo( ü_oref:any, ü_length:number ):string {
    return shortenText( inspect( ü_oref ), ü_length );
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
    return ö_fref.apply( ö_map.that, ü_args );
}
}

//====================================================================
  type TR = readonly TTestResult[]

export function testSummary(      result: TR      , ü_equals:TAssert ):void
export function testSummary(      result: TR, b:TR, ü_equals:TAssert ):void
export function testSummary( ...ü_result_:(TR|TAssert)[]             ):void {
    const ü_equals:TAssert = ü_result_.pop  () as TAssert;
      let ü_results        = ü_result_.shift() as TR;
  //const ü_args = Array.prototype.slice.call( arguments, 1, -1 ) as TR;
          ü_results =  ü_results.concat( ...ü_result_ as TR[] );
  //
    const ü_crlf = '\r\n';
    const ü_success = ü_results.filter( ü_test=>{ return ü_test.startsWith( successSymbol ); } )
    const ü_all = ü_results.length;
    const ü_ok  = ü_success.length;
    const ü_ratio = Math.round( ü_ok / ü_all * 100 );

    ü_equals( ü_ok, ü_all, `Success-rate: ${ ü_ok }/${ ü_all } = ${ ü_ratio }%`+ü_crlf+ ü_results.join(ü_crlf) );
}

export function testEquals<T=any>( ü_act:unknown, ü_exp:T, ü_message?:string ):TTestResult {
    const ü_test = ü_act === ü_exp
                 ? successPrefix + `${ echo( ü_exp, 50 ) }`
                 : failurePrefix + `${ echo( ü_exp, 50 ) } ${ notEqual } ${ echo( ü_act, 50 ) }`
                 ;
    return ü_message ? ü_test +' '+ ü_message
                     : ü_test ;
}

//====================================================================

export async function testAsyncFunction<Tx,Ty>( ö_aFref  :(x:Tx)=>Promise<Ty>
                                              , ö_expData:          Map<Tx,Ty>
                                                         | TResultArray<Tx,Ty>
                                              ):Promise<TTestResult[]> {
  //
    if (!( ö_expData instanceof Map )) { ö_expData = new Map( ö_expData ); }
    const ü_keys = Array.from( ö_expData.keys() );
  //
    const ü_done = await Promise.allSettled( ü_keys.map(function( ü_x ){
        return ö_aFref( ü_x );
      }) );
  //
    const ü_tests:TTestResult[] = [];
    ü_keys.map(function( ü_x, ü_indx ){
        const ü_act_y = ü_done[ ü_indx ];
        if ( ü_act_y.status === 'fulfilled' ) {
            const ü_exp_y = (ö_expData as Map<Tx,Ty>).get( ü_x );
            ü_tests.push(  testEquals( ü_act_y.value, ü_exp_y, `(${ ü_indx }) ${ echo( ü_x, 50 ) }` )  );
        } else {
            ü_tests.push(  failurePrefix +'Function threw: '+ echo( ü_act_y.reason, 200 )  );
        }
    });
  //
    return ü_tests;
}

//====================================================================

export function testFunction<Tx,Ty>( ö_fref   :         (x:Tx)=>Ty
                                         , ö_expData:          Map<Tx,Ty>
                                                    | TResultArray<Tx,Ty>
                                         ):TTestResult[] {
  //
    if (!( ö_expData instanceof Map )) { ö_expData = new Map( ö_expData ); }
    const ü_keys = Array.from( ö_expData.keys() );
  //
    return ü_keys.map(function( ü_x, ü_indx ){
        try {
          const ü_act_y =                          ö_fref( ü_x );
          const ü_exp_y = ( ö_expData as Map<Tx,Ty> ).get( ü_x );
          return testEquals( ü_act_y, ü_exp_y );
        } catch ( ü_eX ) {
          return failurePrefix +'Function threw: '+ echo( ü_eX, 100 );
        }
    });
}

//====================================================================
/*
*/