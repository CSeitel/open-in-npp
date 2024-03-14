/*
*/
//--------------------------------------------------------------------
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
    const ü_rgXp = /%([^%]+)%/g;
    return ü_path.replace( ü_rgXp, ö_win32 );
//
function ö_win32( ü_original:string, ü_name:string ):string {
    const ü_resolved = process.env[ ü_name ];
    return ü_resolved === undefined
         ? ü_original
         : ü_resolved
         ;
}
//
}
//--------------------------------------------------------------------


	//args?: Array<string | number | boolean> | Record<string, any>;
export function expandTemplateString(   tmpl:string, ...   vars:Array<string>                              ):string;
export function expandTemplateString(   tmpl:string,       vars:             Record<string|number,string>  ):string;
export function expandTemplateString( ü_tmpl:string, ... ü_vars:Array<string|Record<string|number,string>> ):string {
    const ü_rgXp = /\$\{([^}]+)\}/gi;
    const ü_oref = typeof( ü_vars[0] ) === 'object'
                 ?         ü_vars[0] as            Record<string|number,string>
                 :         ü_vars    as unknown as Record<string|number,string>
                 ;
    return ü_tmpl.replace( ü_rgXp
                         , function( ü_all, ü_mKey ) { 
                             return ü_oref[ ü_mKey.trim() ] ?? ü_mKey ;
                         }
                       //, function(_, a) { return a.split('.').reduce((b, c) => b?.[c], ü_vars ); }
                         );
}

//====================================================================

export function wrapDoubleQuotes( ...ö_args:string[] ):string[] {
           ö_args.forEach(function( ü_arg, ü_indx ){
           ö_args[ ü_indx ] = `"${ ü_arg }"`;
           });
    return ö_args;
}

//====================================================================
/*
*/