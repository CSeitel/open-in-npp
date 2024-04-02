/*
*/
  import { type IUiXMessage
         , type TUiXMessageType
         , type TUiXMessageTemplate
         , type IExpandUiXMessageVars
         } from '../types/lib.errorUtil.d';
  import { CEUiXMessageType
         , CEUiXText
         } from '../constants/error';
//--------------------------------------------------------------------
  import { format
         } from 'util';
  import { ß_RuntimeContext
         , ß_stringify
         } from '../runtime/context';
  import { extendArray
         } from '../lib/arrayUtil';
  import { isDirectInstanceOf
         } from '../lib/objectUtil';
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

export function toErrorMessage( ü_eX:any ):string {
    if ( ü_eX instanceof Error ) {
        return ü_eX.message;
    }
    return ''+ü_eX;
}

export function extractPureCallStack( ü_eX:Error, ü_header = 'Call Stack' ):string|void {
    if ( ü_eX.stack === undefined ) { return ''; }
      //
        const ü_oldHeader = Error.prototype.toString.bind( ü_eX )();
        const ü_newHeader = ü_header + ( ü_eX.message.length > 0 ? ':'
                                                                 : '' );
        const ü_old = ü_eX.stack;
        const ü_new = ü_old.replace( ü_oldHeader, ü_newHeader );
      //
      //if ( ü_new !== ü_old ) { ü_eX.stack = ü_new; }
    return ü_new;
}

export function summarizeError( ü_eX:any, ü_context:string ):string {
    const ü_indent_1 = '\t';
    const ü_colon    = ':';
    const ü_summary = extendArray( [] as string[] );
    const ü_reasons = ErrorMessage.getReasonsStack( ü_eX );
    const ü_finalEx = ü_reasons.finalReason;
  //
    ü_summary.push( 'An exception occurred in the following situation:'
                  , ü_indent_1 + ü_context
                  , ''
                  , 'The following information about the issue has been provided:'
                  , ''
                  , ''
                  );
  //
    const ü_lastIndx = ü_finalEx === undefined
                     ? ü_reasons.length -1
                     :                  -1;
    ü_reasons.forEach(function( ü_reason, ü_indx ){
        const ü_stack = extractPureCallStack( ü_reason );
        ü_summary.push( ü_reason.name
                      , ü_indent_1 + ü_reason.text );
        ü_summary.pushItems( ü_stack );
        ü_summary.push( 'Context:'
                      , ü_indent_1 + ( ü_reason.context ?? '' )
                    );
        if ( isDirectInstanceOf( ü_reason, ErrorMessage ) ) {
        } else {
        const ü_core = Object.assign( {}, ü_reason ) as any;
        delete ü_core.name    ;
        delete ü_core.message ;
        delete ü_core.type    ;
        delete ü_core.text    ;
      //delete ü_core.stack   ;
        delete ü_core.context ;
        delete ü_core.reason  ;
        ü_summary.push( format( ü_core ) );


        }
        if ( ü_lastIndx !== ü_indx ) {
            ü_summary.push( 'Reason:'
                          , ü_indent_1 + 'Additional Info below'
                          , ''
                          , ''
                          );
        }
    });
  //
    if ( ü_finalEx !== undefined ) {
        const ü_stack = ü_finalEx.stack;
            let ü_all = format( ü_finalEx );
        if ( ü_stack !== undefined ) {
            ü_all = ü_all.replace( ü_stack, '' )
                         .replace( /^[^\{]*\{/, 'Object:' )
                         .replace( /\r?\n\}$/ , ''        )
                         ;
        }
        ü_summary.pushItems( ü_finalEx.name + ü_colon
                      , ü_finalEx.message
                      , extractPureCallStack( ü_finalEx )
                      , ü_all
                      );
    }
  //
    return ü_summary.join( ß_RuntimeContext.lineSep );
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
type TReasons = ErrorMessage[] & { finalReason?:Error }
export class ErrorMessage<R=any,C=any> extends Error implements IUiXMessage<R> {
            readonly  type    :TUiXMessageType = CEUiXMessageType.error;
            readonly  text    :string
                      context?:string
                      reason ?:R
                     _context?:C
constructor(   msgTmpl:string               , ...  vars:string[] );
constructor(   msgTmpl:IExpandUiXMessageVars, ...  vars:any   [] );
constructor( ü_msgTmpl:TUiXMessageTemplate  , ...ü_vars:any   [] ){
  //super( typeof( _message ) === 'string' ? _message : _message.name );
    super();
  //reduceErrorStack( this );
  //
    this.name    = 'ErrorWithMessage';
    this.message =
    this.text    =               typeof( ü_msgTmpl ) === 'string'
                 ? expandTemplateString( ü_msgTmpl            , ü_vars )
                 :                       ü_msgTmpl.apply( null, ü_vars )
                 ;
  //
}
setReason ( ü_reason :R ):this { this.reason   = ü_reason ; return this; }
setContext( ü_context:C ):this { this._context = ü_context;
                                 this.context  = ß_stringify( ü_context ); return this; }
toString():string { return this.text; }

static getReasonsStack( ü_reason:any ):TReasons {
    const ü_stack = [] as TReasons;
  //
    if ( ü_reason instanceof ErrorMessage ) {
        do {
            ü_stack.push( ü_reason );
            ü_reason = ü_reason.reason;
        } while ( ü_reason instanceof ErrorMessage
               && ! ü_stack.includes( ü_reason )
                );
        if ( ü_reason === undefined ) { return ü_stack; }
  //         ü_stack.finalReason = ü_cursor;
  //} else {
    }
             ü_stack.finalReason = ü_reason instanceof Error
                                 ? ü_reason
                                 : new TypeError( expandTemplateString( CEUiXText.isNotTypeError, format( ü_reason ) ) );

    return ü_stack;
}

}

//====================================================================
/*
*/