/*
*/
  import { type IUiXMessage
         , type TUiXMessageType
         , type TUiXMessageTemplate
         , type IExpandUiXMessageVars
         } from '../types/lib.errorUtil.d';
  import { CEUiXMessageType
         } from '../constants/error';
//--------------------------------------------------------------------
  import { format
         } from 'util';
  import { ß_stringify
         } from '../runtime/context';
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

export class UiXMessage<C=any> implements IUiXMessage<unknown> {
            readonly  type    :TUiXMessageType = CEUiXMessageType.info;
            readonly  text    :string
    private          _context?:C
constructor(   msgTmpl:string               , ...  vars:string[] );
constructor(   msgTmpl:IExpandUiXMessageVars, ...  vars:any   [] );
constructor( ü_msgTmpl:TUiXMessageTemplate  , ...ü_vars:any   [] ){
    this.text    =               typeof( ü_msgTmpl ) === 'string'
                 ? expandTemplateString( ü_msgTmpl            , ü_vars )
                 :                       ü_msgTmpl.apply( null, ü_vars )
                 ;
}
setContext( ü_context:C ):this { this._context = ü_context; return this; }

toString():string { return this.text; }

}

export class ErrorMessage<R=any,C=any> extends Error implements IUiXMessage<R> {
            readonly  type    :TUiXMessageType = CEUiXMessageType.error;
            readonly  text    :string
                      reason ?:R
                     _context?:C
constructor(   msgTmpl:string               , ...  vars:string[] );
constructor(   msgTmpl:IExpandUiXMessageVars, ...  vars:any   [] );
constructor( ü_msgTmpl:TUiXMessageTemplate  , ...ü_vars:any   [] ){
  //super( typeof( _message ) === 'string' ? _message : _message.name );
    super();
  //
    this.name    = 'ErrorWithMessage';
    this.message =
    this.text    =               typeof( ü_msgTmpl ) === 'string'
                 ? expandTemplateString( ü_msgTmpl            , ü_vars )
                 :                       ü_msgTmpl.apply( null, ü_vars )
                 ;
}
setReason ( ü_reason :R ):this { this.reason   = ü_reason ; return this; }
setContext( ü_context:C ):this { this._context = ü_context; return this; }
toString():string { return this.text; }

get context():string {
    return ß_stringify( this._context );
}

}

//====================================================================
/*
*/