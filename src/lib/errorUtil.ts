/*
*/
  import { type IUiXMessage
         , type IEnhancedUiXMessage
         , type TUiXMessageType
         , type TUiXMessageTemplate
         , type TTextTemplate
         , type IExpandUiXMessageVars
         , type tc
         } from '../types/lib.errorUtil.d';
  import { CEUiXMessageType
         , CEUiXText
         } from '../constants/error';
//--------------------------------------------------------------------
  import { ß_RuntimeContext
         , ß_stringify
         } from '../runtime/context';
  import { isDirectInstanceOf
         } from '../lib/objectUtil';
  import { expandTemplateString
         , indentLines
         } from '../lib/textUtil';
//====================================================================
  type TErrorCodes<C extends string> = C|readonly C[]

export function hasErrorCode<C extends string>( ü_code:TErrorCodes<C>, ü_eX:any ):boolean {
    //&&   typeof( ü_eX ) === 'object'
    //&&           ü_eX   !== null
    if (               ü_eX instanceof Error
      && typeof( ( ü_eX as tc<C> ).code ) === 'string' ) {
      return Array.isArray( ü_code )
                          ? ü_code.includes( (<tc> ü_eX).code )
                          : ü_code ===       (<tc> ü_eX).code
                          ;
    }
      return false;
}

export function createErrorWithCode<C extends string>( ü_code:C, ü_message?:string ):tc<C> {
     const ü_eX = new Error( ü_message ) as tc<C>;
           ü_eX.code = ü_code;
    return ü_eX;
}

export function expectErrorCode<C extends string              >(   code:TErrorCodes<C>,   eX:any,            ):void
export function expectErrorCode<C extends string,T extends any>(   code:TErrorCodes<C>,   eX:any,   value :T ):     T
export function expectErrorCode<C extends string,T extends any>(   code:TErrorCodes<C>,   eX:any,   value :T ):     T
export function expectErrorCode<C extends string,T            >( ü_code:TErrorCodes<C>, ü_eX:any, ü_value?:T ):void|T {
    if ( hasErrorCode( ü_code, ü_eX ) ) { return ü_value; }
    throw ü_eX;
}

//====================================================================

export function toErrorMessage( ü_eX:any ):string {
    if ( ü_eX instanceof Error ) {
        return ü_eX.message;
    }
    return ''+ü_eX;
}

export function stringifyUpToSuper( ü_oref:any, ü_class:Function = Error ):string {
  //
    const ü_stack = [] as any[];
    let ü_cursor:any = ü_oref;
    do {
        const ü_prot = Object.getPrototypeOf( ü_cursor );
        if ( ü_prot === ü_class.prototype ) {
            const ü_constructor  = ü_cursor.constructor ;
                            delete ü_cursor.constructor ;//= function Redefined(){};
            Object.setPrototypeOf( ü_cursor, {}     );
            const ü_text = ß_stringify( ü_oref );
            Object.setPrototypeOf( ü_cursor, ü_prot );
                                   ü_cursor.constructor = ü_constructor;
            return ü_text;
        }
        if ( ü_stack.includes( ü_prot ) ) { break; }
             ü_stack.push    ( ü_prot );
              ü_cursor = ü_prot;
    } while ( ü_cursor !== null );
  //
    return ß_stringify( ü_oref );
}

export function extractPureCallStack( ü_eX:Error, ü_header = CEUiXText.callStack ):string {
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
    const ü_reasonSep = [ '', CEUiXText.reason + ü_colon
                        , '', ''
                        ];
    const ü_summary = [] as string[];
    const ü_reasons = ErrorWithUixMessage.getReasonsStack( ü_eX );
    const ü_finalEx = ü_reasons.finalReason;
  //
    ü_summary.push( CEUiXText.errorOccurred + ü_colon
                  , indentLines( ü_context, ü_indent_1 ) );
    ü_summary.push( ... ü_reasonSep );
  //
    const ü_lastIndx = ü_finalEx === undefined
                     ? ü_reasons.length -1
                     :                  -1;
    ü_reasons.forEach(function( ü_reason, ü_indx ){
        const ü_stack = extractPureCallStack( ü_reason );
                            ü_summary.push( ü_reason.name     + ü_colon
                                                              , ü_indent_1 + ü_reason.text    );
        ü_reason.context && ü_summary.push( CEUiXText.context + ü_colon
                                          , indentLines( ü_reason.context, ü_indent_1 ) );
        if ( isDirectInstanceOf( ü_reason, ErrorWithUixMessage ) ) {
        } else {
            const ü_core = indentLines( stringifyUpToSuper( ü_reason, ErrorWithUixMessage ), ü_indent_1 );
                            ü_summary.push( CEUiXText.data    + ü_colon
                                                              , ü_indent_1 + ü_core );
        }
        ü_stack          && ü_summary.push( ü_stack );
        if ( ü_lastIndx !== ü_indx )
                          { ü_summary.push( ... ü_reasonSep ); }
    });
  //
    if ( ü_finalEx !== undefined ) {
        ü_summary.push( ü_finalEx.name + ü_colon
                      ,                  ü_indent_1 + ü_finalEx.message );
        const ü_stack = extractPureCallStack( ü_finalEx );
        if ( ü_stack ) {
          /*
                 let ü_core = format( ü_finalEx );
            ü_core = ü_core.replace( ü_finalEx.stack!, '' )
                           .replace( /^[^\{]*\{\r?\n?/, '' )
                           .replace( /\r?\n\}$/ , '' )
                           ;
          */
               const ü_core = indentLines( stringifyUpToSuper( ü_finalEx ), ü_indent_1 );
                            ü_summary.push( CEUiXText.context + ü_colon
                                                              , ü_core );
                            ü_summary.push( ü_stack );
        } else {
        }
    }
  //
    return ü_summary.join( ß_RuntimeContext.lineSep );
}

//====================================================================

export function expandTemplate(   msgTmpl:string               ,   vars:string[] ):string
export function expandTemplate(   msgTmpl:IExpandUiXMessageVars,   vars:any   [] ):string
export function expandTemplate( ü_msgTmpl:TUiXMessageTemplate  , ü_vars:any   [] ):string {
    return               typeof( ü_msgTmpl ) === 'string'
         ? expandTemplateString( ü_msgTmpl            , ü_vars )
         :                       ü_msgTmpl.apply( null, ü_vars )
         ;
}

//====================================================================

export class UiXMessage implements IUiXMessage {
               type:TUiXMessageType
      readonly text:string
constructor(   msgTmpl:IExpandUiXMessageVars, ...  vars:any   [] )
constructor(   msgTmpl:TTextTemplate        , ...  vars:string[] )
constructor( ü_msgTmpl:TUiXMessageTemplate  , ...ü_vars:any   [] ){
    this.type = CEUiXMessageType.info;
    this.text = expandTemplate( ü_msgTmpl as IExpandUiXMessageVars, ü_vars );
}
asWarning():this   { this.type = CEUiXMessageType.warning; return this; }
asError  ():this   { this.type = CEUiXMessageType.error  ; return this; }
toString ():string {                                       return this.text; }

}

//--------------------------------------------------------------------
type TReasons = ErrorWithUixMessage[] & { finalReason?:Error }

export class ErrorWithUixMessage<R=any,C=any> extends Error implements IEnhancedUiXMessage<R> {
                      type    :TUiXMessageType = CEUiXMessageType.error;
            readonly  text    :string
                      context?:string
                      reason ?:R
constructor(   msgTmpl:IExpandUiXMessageVars, ...  vars:any   [] );
constructor(   msgTmpl:TTextTemplate        , ...  vars:string[] );
constructor( ü_msgTmpl:TUiXMessageTemplate  , ...ü_vars:any   [] ){
  //super( typeof( _message ) === 'string' ? _message : _message.name );
    super();
  //reduceErrorStack( this );
  //
    this.name    = 'Error-with-Message';
    this.message =
    this.text    = expandTemplate( ü_msgTmpl as IExpandUiXMessageVars, ü_vars );
  //
}
asWarning():this   { this.type = CEUiXMessageType.warning; return this; }
asInfo   ():this   { this.type = CEUiXMessageType.info   ; return this; }
toString ():string {                                       return this.text; }

setContext( ü_context:C ):this { this.context = ß_stringify( ü_context ); return this; }
setReason ( ü_reason :R ):this { this.reason  =              ü_reason   ; return this; }

static getReasonsStack( ü_reason:any ):TReasons {
    const ü_stack = [] as TReasons;
  //
    if ( ü_reason instanceof ErrorWithUixMessage ) {
        do {
            ü_stack.push( ü_reason );
            ü_reason = ü_reason.reason;
        } while ( ü_reason instanceof ErrorWithUixMessage
               && ! ü_stack.includes( ü_reason )
                );
        if ( ü_reason === undefined ) { return ü_stack; }
  //         ü_stack.finalReason = ü_cursor;
  //} else {
    }
  //
    ü_stack.finalReason = ü_reason instanceof Error
                        ? ü_reason
                        : new TypeError( expandTemplateString( CEUiXText.isNotTypeError, ß_stringify( ü_reason ) ) );

    return ü_stack;
}

}

//====================================================================
/*
*/