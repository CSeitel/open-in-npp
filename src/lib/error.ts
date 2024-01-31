/*
*/
  import { type TFSError
         , type TNodeFSErrorCodes
         } from '../types/error.d';
//====================================================================

export function expect   ( ü_eX:any, ü_code:TNodeFSErrorCodes             ):void
export function expect<T>( ü_eX:any, ü_code:TNodeFSErrorCodes, ü_value :T ):     T
export function expect<T>( ü_eX:any, ü_code:TNodeFSErrorCodes, ü_value?:T ):void|T {
    if (   typeof( ü_eX ) === 'object'
      &&           ü_eX   !== null
      &&           ü_eX instanceof Error
      && 'code' in ü_eX
      &&           ü_eX.code === ü_code
       ) {
      return ü_value;
    }
    throw ü_eX;
}

//====================================================================
/*
*/