/*
*/
  import { ß_trc
         } from '../runtime/context';
//====================================================================
  const ß_specialChars = /["\\\x00-\x1f\x7f-\x9f]/g;
  const    json_escape = /[\x00-\x1f"\\\x7f-\x9f]/g;
//--------------------------------------------------------------------
  const CRecursionRef = {indx:0};
  const ß_refs = [] as any   [];
  const ß_posn = [] as number[];
  const ß_hits = [] as number[];
    let ß_frmt = true;
    let ß_indx:number
//--------------------------------------------------------------------
//====================================================================

export function ß_stringify( ü_data:any, ü_asJSON = false ):string|void {
  //
    if ( ü_data === undefined ) { return undefined; }
  //
    ß_refs.length = 0;
    ß_posn.length = 0;
    ß_hits.length = 0;
    ß_frmt = ! ü_asJSON;
    ß_indx = -1;
    let ü_done = ß_stringify_I( ü_data );
  //
    let ü_offset = 0;
    ß_hits.forEach(function(ü_hit){
        const ü_def = `<Ref *${ ü_hit }>`;
        const ü_at  = ß_posn[ ü_hit ] + ü_offset;
                                        ü_offset += ü_def.length;
        ü_done = ü_done.slice( 0, ü_at )
               + ü_def
               + ü_done.slice( ü_at )
               ;
    });
    ß_trc &&ß_trc( ü_done );
  //
    return ü_done;
}

function ß_stringify_I( ü_data:any ):string {
  //
    switch ( typeof( ü_data ) ) {
      case 'undefined':        CRecursionRef.indx = -1;     throw CRecursionRef;
      case 'boolean'  :
      case 'number'   :                                    return                 ü_data.toString();
      case 'string'   :                                    return ß_toJSONString( ü_data );
      case 'object'   : if ( ü_data === null           ) { return 'null';                            }
                   else if ( ü_data instanceof Boolean                                              //
                          || ü_data instanceof Number  ) { return                 ü_data.toString(); }
                   else if ( ü_data instanceof String  ) { return ß_toJSONString( ü_data );          }
                   else if ( ü_data instanceof Date    ) { return ß_toISOString ( ü_data );          }
                   else if ( (CRecursionRef.indx = ß_refs.indexOf( ü_data )) > -1 ) { throw CRecursionRef; }
                   else {    ß_refs.push( ü_data );
                             ß_posn.push( ++ ß_indx );
                        const ü_done =  Array.isArray( ü_data ) ? ß_fromArray ( ü_data )
                                                                : ß_fromObject( ü_data )
                                                                ;
                      //ß_refs.pop()
                        return ü_done;
                            
                   }
      case 'function' :
    }
  //
    return ü_data.toString();
}

//====================================================================

function ß_fromObject( ü_data:object ):string {
      const ü_list = [];
        let ü_mKey ;
    for ( ü_mKey in ü_data ) {
      if ( ! ü_data.hasOwnProperty( ü_mKey ) ) { continue; }
      const ü_start = ß_toJSONString( ü_mKey, ß_frmt )
                    + ':';
      ß_indx += ü_start.length;
      let ü_json:string
      var ü_eX;
      try {
                ü_json = ß_stringify_I(  ü_data[ ü_mKey as keyof typeof ü_data ]  );
        
      } catch ( ü_eX ) {
        if ( ü_eX === CRecursionRef ) {
          if ( CRecursionRef.indx < 0 ) { // skip undefined
              ß_indx -= ü_start.length;
              continue;
          }
          ü_json = `[ *${ CRecursionRef.indx }]`;
          ß_hits.push( CRecursionRef.indx );
        //continue;
        } else {
          throw ü_eX;
        }
      }
      ü_list.push( ü_start
                 + ü_json
                 );
      ß_indx += ü_json.length + 1;
    }
    if ( ü_list.length > 0 ) { ß_indx += 0; }
    else                     { ß_indx += 2; }
    return `{${ ü_list.join(',') }}`;
}

//--------------------------------------------------------------------

function ß_fromArray( ü_arry:any[] ):string {
      const ü_list = [];
      const ü_lngt = ü_arry.length
        let ü_indx = 0;
    while ( ü_indx < ü_lngt ) {
             const ü_json = ß_stringify_I( ü_arry[ ü_indx ++ ] );
      ü_list.push( ü_json === undefined ? 'null'
                                        : ü_json );
    }
    return `[${ ü_list.join(',') }]`;
}

//====================================================================

function ß_toJSONString( ü_text:string|String, ü_simple ?:false   ):string
function ß_toJSONString( ü_text:string       , ü_simple  :boolean ):string
function ß_toJSONString( ü_text:string|String, ü_simple = false   ):string {
    if ( ü_simple && ! ß_specialChars.test( ü_text as string ) ) {
        return ü_text as string;
    } else {
        return `"${ ü_text.replace( ß_specialChars, ß_escapeChar ) }"`;
    }
}

//--------------------------------------------------------------------

function ß_escapeChar( ü_char:string ):string {
  const ü_code = ü_char.charCodeAt( 0 );
  switch ( ü_code ) {
      case 0x08: return '\\b' ; // backspace
      case 0x09: return '\\t' ; // horizontal tab
      case 0x0a: return '\\n' ; // new line
      case 0x0b: return '\\v' ; //   vertical tab
      case 0x0c: return '\\f' ; // formfeed
      case 0x0d: return '\\r' ; // carriage return
      case 0x22: return '\\"' ;
      case 0x5c: return '\\\\';
  }
// '\\\$&'
  switch ( ü_char ) {
    case '"' : return '\\"' ;
    case '\\': return '\\\\';
    case '\n': return '\\n' ; // new line
    case '\r': return '\\r' ; // carriage return
    case '\t': return '\\t' ; // horizontal tab
    case '\v': return '\\v' ; //   vertical tab
    case '\b': return '\\b' ; // backspace
    case '\f': return '\\f' ; // formfeed
  }
//
  return ( ü_code < 16
         ? '\\u000'
         : '\\u00'
         )
         + ü_code.toString( 16 );
}

//====================================================================

function ß_toISOString( ü_date:Date ):string {
  //
    const ü_year    = ü_date.getUTCFullYear    ();
    const ü_month   = ü_date.getUTCMonth       () + 1;
    const ü_day     = ü_date.getUTCDate        ();
    const ü_hours   = ü_date.getUTCHours       ();
    const ü_minutes = ü_date.getUTCMinutes     ();
    const ü_seconds = ü_date.getUTCSeconds     ();
    const ü_mSecs   = ü_date.getUTCMilliseconds();
  //
    return                            '"'   + ü_year
         + ( ü_month   <  10 ? '-0' : '-' ) + ü_month
         + ( ü_day     <  10 ? '-0' : '-' ) + ü_day
         + ( ü_hours   <  10 ? 'T0' : 'T' ) + ü_hours
         + ( ü_minutes <  10 ? ':0' : ':' ) + ü_minutes
         + ( ü_seconds <  10 ? ':0' : ':' ) + ü_seconds
         + ( ü_mSecs   < 100 ?
             ü_mSecs   <  10 ? '.00'
                             : '.0' : '.' ) + ü_mSecs
         +                            'Z"'
         ;
}

//====================================================================
/*
*/