/*
*/
  import { type TAssert
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

//====================================================================

export function echo( ü_oref:any, ü_length:number ):string {
    return shortenText( inspect( ü_oref ), ü_length );
}

export function testSummary( ü_results:readonly string[], ü_equals:TAssert ):void {
    const ü_crlf = '\r\n';
    const ü_success = ü_results.filter( ü_test=>{ return ü_test.startsWith( successSymbol ); } )
    ü_equals( ü_success.length, ü_results.length, `Error-Count ${ ü_success.length % ü_results.length }`+ü_crlf+ ü_results.join(ü_crlf) )
}

export function testEquals<T>( ü_act:unknown, ü_exp:T ):string {
    return ü_act === ü_exp
         ? successSymbol + ` ${ echo( ü_exp, 50 ) }`
         : failureSymbol + ` ${ echo( ü_exp, 50 ) } ${ notEqual } ${ echo( ü_act , 50 ) }`
         ;
}
