/*
*/
  import { type TOutputEncoder
         } from '../types/generic.d';
  import { CRgXp
         } from '../constants/text';
//--------------------------------------------------------------------
  import { ß_RuntimeContext
         } from '../runtime/context';
//====================================================================

export function escapeFF( ö_rgXp:RegExp = CRgXp.js_escape ):TOutputEncoder {
    return ö_encoder;
function ö_encoder( ü_text:string ):string {
    return ü_text.replace( ö_rgXp, ß_escapeFF );
}
}

function ß_escapeFF( ü_hit:string ):string {
    const ü_hex = ü_hit.charCodeAt(0).toString(16);
    return ( ü_hex.length === 1 ? '%0' : '%' )
         + ü_hex.toUpperCase();
}

//====================================================================

export function shortenText( ü_path:string, ü_length:number ):string {
    if ( ü_path.length <= ü_length ) { return ü_path; }
  //const ü_tooMuch = 3 + ü_path.length - ü_length;
    const ü_tooMuch   = ü_length - 5;
    const ü_remainder = ü_tooMuch % 2;
    const ü_even      = ( ü_tooMuch - ü_remainder ) / 2;
    return ü_path.slice( 0      , ü_even +ü_remainder )
         + ' ... '
         + ü_path.slice( -ü_even, ü_path.length       )
         ;
}

//====================================================================

export function expandEnvVariables( ü_path:string ):string {
  //
    return ü_path.replace( CRgXp.env_win32, ö_env_win32 );
}
function ö_env_win32( ü_original:string, ü_name:string ):string {
    return process.env[ ü_name ] ?? ü_original;
}

//--------------------------------------------------------------------
  type TVarsObject = Record<string|number,string>
	//args?: Array<string | number | boolean> | Record<string, any>;
export function expandTemplateString(   tmpl:string,       vars:                      TVarsObject    ):string
export function expandTemplateString(   tmpl:string,       vars:        Array<string>                ):string
export function expandTemplateString(   tmpl:string, ...   vars: string                           [] ):string
export function expandTemplateString( ü_tmpl:string, ... ü_vars:(string|Array<string>|TVarsObject)[] ):string {
    if ( ü_vars.length === 0 ) { return ü_tmpl; }
  //
             const isNoSpread = typeof( ü_vars[0] ) === 'object'
    const ü_oref = isNoSpread         ? ü_vars[0] as            Record<string|number,string>
                                      : ü_vars    as unknown as Record<string|number,string>
                                      ;
    if ( isNoSpread && Array.isArray( ü_oref )
                    &&                ü_oref.length === 0 ) { return ü_tmpl; }
  //
    return ü_tmpl.replace( CRgXp.lx_template
                         , function( ü_all, ü_mKey ) { 
                             return ü_oref[ ü_mKey.trim() ] ?? ü_all ;
                         }
                       //, function(_, a) { return a.split('.').reduce((b, c) => b?.[c], ü_vars ); }
                         );
}

//====================================================================

export function wrapDoubleQuotes( ü_arg0:string ):string {
    return `"${ ü_arg0 }"`;
}

//====================================================================

export function indentLines( ü_lines:string, ü_indent = '\t' ):string {
    return ü_indent + ü_lines.replace( CRgXp.crlf, ß_RuntimeContext.lineSep
         + ü_indent );
}

//====================================================================
/*
*/