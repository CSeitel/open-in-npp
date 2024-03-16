/*
*/
  import { type IMessage
         , type IXpandMessageVars
         } from '../types/lib.errorUtil.d';
  import { expandTemplateString
         } from '../lib/textUtil';
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

export class ErrorMessage<T=any> extends Error implements IMessage<T> {
             readonly  type      :'w'|'e' = 'e';
             readonly  variables :string[]
                       reason   ?:T
constructor(
    private  readonly _message   :string|IXpandMessageVars
  ,              ... ü_vars      :string[] ){
  //super( typeof( _message ) === 'string' ? _message : _message.name );
    super();
    this.variables = ü_vars;
  //
    this.name    = 'ErrorWithMessage';
    this.message = typeof( _message ) === 'string'
         ? expandTemplateString(      _message            , this.variables )
         :                            _message.apply( null, this.variables )
         ;
}

get text():string {
    return this.toString();
}

setReason( ü_reason:T ):this {
    this.reason = ü_reason;
    return this;
}

toString_():string {
    return typeof( this._message ) === 'string'
         ? expandTemplateString( this._message            , this.variables )
         :                       this._message.apply( null, this.variables )
         ;
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