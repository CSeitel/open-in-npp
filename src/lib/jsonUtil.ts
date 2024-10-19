/*
*/
  import { ß_trc
         } from '../runtime/context';
//====================================================================
  const ß_specialChars = /["\\\x00-\x1f\x7f-\x9f]/g;
  const    json_escape = /[\x00-\x1f"\\\x7f-\x9f]/g;
//--------------------------------------------------------------------
  /*
  const ß_allRefs = [] as any   [];
  const ß_posn = [] as number[];
  const ß_hits  = [] as number[];
    let ß_frmt = true;
    let ß_indx:number
  */
//--------------------------------------------------------------------
//====================================================================

class AsText {
    private static readonly _RecursionHit = {text:''};
    private readonly _allRefs   = [] as any   [];
    private readonly _allPosn   = [] as number[];
    private readonly _hitRefs   = [] as any   [];
    private readonly _hitPosn   = [] as number[];
    private          ß_posIndx  = -1;
    private readonly _skipQuotes = true as boolean;
                      outputString:string|void = undefined;
constructor(
    public  readonly  inputData :any
  , private readonly _likeJSON  :boolean
  , private readonly _expanded  = false
){
    if ( this._likeJSON ) {
         this._skipQuotes = false; // always quote
         this._expanded   = true;
    //
      if (         inputData   === undefined
        || typeof( inputData ) === 'function'
         ) { return; }
    }
  //
    let ö_text = this._stringifyDataItem( inputData );
  //
    let ö_offset = 0;
    this._hitPosn.forEach(function(ü_posn,ü_hitIndx){
        const ü_def = `<*${ ü_hitIndx+1 }>`;
        const ü_at  = ü_posn + ö_offset;
                               ö_offset += ü_def.length;
        ö_text = ö_text.slice( 0, ü_at )
               + ü_def
               + ö_text.slice(    ü_at )
               ;
    });
    ß_trc &&ß_trc( ö_text );
  //
    this.outputString = ö_text;
}

private _stringifyDataItem( ü_data:any ):string {
    let ü_refIndx = -1;
    let ü_hitIndx = -1;
    let ü_isFunc  = false;
  //
    switch ( typeof( ü_data ) ) {
      case 'undefined':                                    return 'undefined';
      case 'boolean'  :
      case 'number'   :                                    return                 ü_data.toString();
      case 'string'   :                                    return ß_toJSONString( ü_data );
      case 'function' : ü_isFunc = true;
      case 'object'   :
             if ( ü_data === null           ) { return 'null';                            }
        else if ( ü_data instanceof Boolean                                              //
               || ü_data instanceof Number  ) { return                 ü_data.toString(); }
        else if ( ü_data instanceof String  ) { return ß_toJSONString( ü_data );          }
        else if ( ü_data instanceof Date    ) { return ß_toISOString ( ü_data );          }
        else if ( (ü_refIndx = this._allRefs.indexOf( ü_data )) > -1 )
            {
                if ( this._likeJSON ) { throw new TypeError( 'Converting circular structure to JSON' ); }
                     ü_hitIndx = 1 +   this._hitRefs.indexOf( ü_data );
                if ( ü_hitIndx < 1 ) { 
                                   this._hitPosn.push   ( this._allPosn[ ü_refIndx ] );
                                   this._hitRefs.push   ( ü_data );
                 ü_hitIndx =       this._hitRefs.length; }
                      AsText._RecursionHit.text = `(#${ ü_hitIndx })`;
                throw AsText._RecursionHit;
            } else {
                      this._allRefs.push( ü_data );
                      this._allPosn.push( ++ this.ß_posIndx );
                      const ü_done = ü_isFunc                ? this._echoFunction( ü_data )
                                   : Array.isArray( ü_data ) ? this._echoArray   ( ü_data )
                                                             : this._echoObject  ( ü_data )
                                                             ;
                if ( this._expanded ) {
                    this._allRefs.pop();
                    this._allPosn.pop();
                }
                      this.ß_posIndx -= ü_done.length;
                return ü_done;
            }
            break;
      default:
    }
  //
    return ü_data.toString();
}

private _echoFunction( ü_data:Function ):string {
    return ü_data.toString().slice(0,20);
}

private _echoObject( ü_data:object ):string {
    const ü_list = [] as string[];
      let ü_mKey ;
    for ( ü_mKey in ü_data ) {
      if ( ! ü_data.hasOwnProperty( ü_mKey ) ) { continue; }
      const ü_item = ü_data[ ü_mKey as keyof typeof ü_data ];
      if ( this._likeJSON
        && (         ü_item   === undefined
          || typeof( ü_item ) === 'function' )
      ) { continue; } // skip undefined
    //
      const ü_start = ß_toJSONString( ü_mKey, this._skipQuotes )
                    + ':';
      this.ß_posIndx += ü_start.length;
    //
      let ü_text:string
      var ü_eX;
      try {
          ü_text = this._stringifyDataItem( ü_item );
      } catch ( ü_eX ) {
           if ( ü_eX !== AsText._RecursionHit ) { throw ü_eX; }
                ü_text = AsText._RecursionHit.text;
      }
      ü_list.push( ü_start + ü_text );
      this.ß_posIndx += ü_text.length + 1;
    //
    }
  //
    if ( ü_list.length > 0 ) { this.ß_posIndx += 0; }
    else                     { this.ß_posIndx += 2; }
    return `{${ ü_list.join(',') }}`;
}

//--------------------------------------------------------------------

private _echoArray( ü_arry:any[] ):string {
      const ü_list = [] as string[];
      const ü_lngt = ü_arry.length;
        let ü_indx = 0;
    while ( ü_indx < ü_lngt ) {
      const ü_item = ü_arry[ ü_indx ++ ];
    //
      let ü_text:string
      var ü_eX;
      try {
          ü_text = this._likeJSON
                && (         ü_item   === undefined
                  || typeof( ü_item ) === 'function' )
                 ? 'null'
                 : this._stringifyDataItem( ü_item )
                 ;
      } catch ( ü_eX ) {
           if ( ü_eX !== AsText._RecursionHit ) { throw ü_eX; }
                ü_text = AsText._RecursionHit.text;
      }
      ü_list.push( ü_text );
      this.ß_posIndx += ü_text.length + 1;
    //
    }
  //
    if ( ü_list.length > 0 ) { this.ß_posIndx += 0; }
    else                     { this.ß_posIndx += 2; }
    return `[${ ü_list.join(',') }]`;
}


}
//====================================================================

export function echoAsJSON( ü_data:any ):string|void {
    return new AsText( ü_data, true ).outputString;
}

export function echoAsString( ü_data:any, ü_expanded = false ):string {
    return new AsText( ü_data, false, ü_expanded ).outputString!;
}

//====================================================================

function ß_toJSONString(   text:string|String,   allowSimple?:false   ):string
function ß_toJSONString(   text:string       ,   allowSimple :boolean ):string
function ß_toJSONString( ü_text:string|String, ü_allowSimple = false  ):string {
    if ( ü_allowSimple && ! ß_specialChars.test( ü_text as string ) ) {
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
    //case 0x0b: return '\\v' ; //   vertical tab
      case 0x0c: return '\\f' ; // formfeed
      case 0x0d: return '\\r' ; // carriage return
      case 0x22: return '\\"' ; // double quote
      case 0x5c: return '\\\\'; // backslash
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