/*
*/
  import { type TAssert
         , type TTestResult
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

export function echo( ü_oref:any, ü_length:number ):string {
    return shortenText( inspect( ü_oref ), ü_length );
}

export function testSummary( ü_results:readonly TTestResult[], ü_equals:TAssert):void {
    const ü_crlf = '\r\n';
    const ü_success = ü_results.filter( ü_test=>{ return ü_test.startsWith( successSymbol ); } )
    const ü_all = ü_results.length;
    const ü_ok  = ü_success.length;
    const ü_ratio = Math.round( ü_ok / ü_all * 100 );

    ü_equals( ü_ok, ü_all, `Success-rate: ${ ü_ok }/${ ü_all } = ${ ü_ratio }%`+ü_crlf+ ü_results.join(ü_crlf) )
}

export function testEquals<T=any>( ü_act:unknown, ü_exp:T, ü_message?:string ):TTestResult {
    return ü_act === ü_exp
         ? successPrefix + ( ü_message || `${ echo( ü_exp, 50 ) }`                                      )
         : failurePrefix + ( ü_message || `${ echo( ü_exp, 50 ) } ${ notEqual } ${ echo( ü_act, 50 ) }` )
         ;
}


export async function testAsyncFunction<Tx extends string|number,Ty>( ö_aFref  :(x:Tx)=>Promise<Ty>
                                                                    , ö_expData:Record<Tx,Ty>
                                                                               |   Map<Tx,Ty>
                                                                               |      [Tx,Ty][]
                                                                                ):Promise<TTestResult[]> {
    const ü_tests:TTestResult[] = [];
  //
    if ( Array.isArray( ö_expData ) ) { ö_expData = new Map( ö_expData ); }
    const ö_isMap = ö_expData instanceof Map;
  //
    const ü_keys = ö_isMap ? Array.from( (ö_expData as Map<Tx,Ty>).keys() )
                           : Object.keys( ö_expData );
    const ü_done = await Promise.allSettled( ü_keys.map(function( ü_x ){
        return ö_aFref( ü_x as Tx );
      }) );
  //
    ü_keys.map(function( ü_x, ü_indx ){
        const ü_act_y = ü_done[ ü_indx ];
        if ( ü_act_y.status === 'fulfilled' ) {
            const ü_exp_y = ö_isMap ? (ö_expData as Map   <Tx,Ty>).get( ü_x as Tx )
                                    : (ö_expData as Record<Tx,Ty>)    [ ü_x as Tx ];
            ü_tests.push(  testEquals( ü_act_y.value, ü_exp_y )  );
        } else {
            ü_tests.push(  failurePrefix +'Function threw: '+ echo( ü_act_y.reason, 100 )  );
        }
    });
  //
    /*
      let ü_mark :string
      let ü_act_y:string|Ty
      var ü_eX;
      try {
                             ü_act_y = ö_f( ü_x as Tx );
        ü_mark = ü_exp_y === ü_act_y
               ? successSymbol
               : failureSymbol
               ;
        if ( true && ü_mark === failureSymbol ) { //if(ß_trc){ß_trc( failureSymbol + ` "debug"` );}
        }
      } catch ( ü_eX ) {
          ü_act_y = ''+ü_eX;
        if ( ü_onError === undefined ) {
          ü_mark = failureSymbol;
        } else {
          ü_mark = ü_onError( ü_eX as Error, ü_exp_y, ü_x as Tx )
                 ? successSymbol
                 : failureSymbol
                 ;
        //if ( ü_mark === failureSymbol ) { ü_act_y = ''; }
        }
      }

      ü_tests.push(   `${ ü_mark } ${ ü_x } => ${ ü_exp_y }`
                  + ( ü_mark === failureSymbol
                    ? ` ${ notEqual } ${ ü_act_y }`
                    : `` )
                  );
    ü_tests.sort( (ü_a:string,ü_b:string) => ü_a.slice(1) <= ü_b.slice(1) ? 1 : -1
                );
    */
  //
  //
    return ü_tests;
}
