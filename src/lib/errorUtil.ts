/*
*/
  import { type IMessage
         } from '../types/lib.errorUtil.d';
//====================================================================

export function expect<C extends string              >(   eX:any,   code:C                 ):void
export function expect<C extends string,T extends any>(   eX:any,   code:C    ,   value :T ):     T
export function expect<C extends string,T extends any>(   eX:any,   code:C|C[], ü_value :T ):     T
export function expect<C extends string,T            >( ü_eX:any, ü_code:C|C[], ü_value?:T ):void|T {
    type tc = Error & { code:C }
    if (   typeof( ü_eX ) === 'object'
      &&           ü_eX   !== null
      &&           ü_eX instanceof Error
      && typeof( (<tc> ü_eX).code ) === 'string' ) {
      if ( Array.isArray( ü_code ) ) { if ( ü_code.includes( (<tc> ü_eX).code )          ) { return ü_value; } }
      else                           { if (                  (<tc> ü_eX).code === ü_code ) { return ü_value; } }
    }
    throw ü_eX;
}

//====================================================================

export class ErrorMessage extends Error implements IMessage {
             readonly  type      :'w'|'e' = 'e';
             readonly  variables :string[]
constructor(
                     ü_message   :string
  ,              ... ü_vars      :string[] ){
    super( ü_message );
    this.variables = ü_vars;
}

get text():string {
    return this.toString();
}

toString():string {
    return this.message +' '+ this.variables.join(' ');
}

}

export class InfoMessage implements IMessage {
             readonly  type      :'i'|'w' = 'i';
    public   readonly  variables :string[]
constructor(
    public            message    :string
  ,              ... ü_vars      :string[] ){
    this.variables = ü_vars;
}

get text():string {
    return this.toString();
}

toString():string {
    return this.message +' '+ this.variables.join(' ');
}

}

//====================================================================
/*
*/