/*
*/
//====================================================================

export function expect<C extends string          >(   eX:any,   code:C             ):void
export function expect<C extends string,T extends any       >(   eX:any,   code:C, ü_value :T ):     T
export function expect<C extends string,T        >( ü_eX:any, ü_code:C, ü_value?:T ):void|T {
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