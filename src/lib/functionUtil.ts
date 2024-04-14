/*
*/
  import { type TAnyFunction
         } from '../types/generic';
  import { type TArgumentsInfo
         , type TIndexMapping
         } from '../types/lib.functionUtil.d';
//====================================================================

export function ß_( ü_indexMap?:TIndexMapping ):Record<number,number> {
    /*
    const ü_map = {} as Record<number,number>;
    const ö_baseMap =  undefined === ö_map.arrangeBound
                    ? []
                    : Array.isArray( ö_map.arrangeBound )
                    ?                ö_map.arrangeBound
                    : Object.keys  ( ö_map.arrangeBound ).map( parseInt )
                    ;
    */
    return {};
}

export function bindArguments<Ty,Tz=Ty>( ö_fref:TAnyFunction<Ty>, ö_map:TArgumentsInfo<Ty,Tz>, ...ö_baseArgs:readonly any[] ):TAnyFunction<Tz> {
    const ö_baseMap = ö_map.arrangeBound === undefined ? {} : ö_map.arrangeBound ;
    const ö_realMap = ö_map.arrangeReal  === undefined ? {} : ö_map.arrangeReal  ;
    return ö_bound;
//
function ö_bound( ...ü_realArgs:any[] ):Tz {
  //
    const ü_args = ö_map.realFirst === true ? ü_realArgs.concat( ö_baseArgs )
                                            : ö_baseArgs.concat( ü_realArgs );
  //
    for ( const ü_old in ö_baseMap ) { ü_args[ ö_baseMap[ ü_old ] ] = ö_baseArgs[ ü_old ]; }
    for ( const ü_old in ö_realMap ) { ü_args[ ö_realMap[ ü_old ] ] = ü_realArgs[ ü_old ]; }
    // ö_baseMap.forEach(function( ü_new, ü_old ){ ü_args[ ü_new ] = ö_baseArgs[ ü_old ]; });
    //if ( ö_map.arrangeReal  !== undefined ) { ö_map.arrangeReal .forEach(function( ü_new, ü_old ){ ü_args[ ü_new ] = ü_realArgs[ ü_old ]; }); }
  //
    if ( ö_map.refine !== undefined ) {
        for ( const ü_indx in ö_map.refine ) {
            ü_args[ ü_indx ] = ö_map.refine[ ü_indx ]( ü_args[ ü_indx ] );
        }
    }
  //
    const ü_done = ö_fref.apply( ö_map.that, ü_args );
    return ö_map.finalize === undefined ? ü_done as unknown as Tz
                                        : ö_map.finalize( ü_done );
}
}

//====================================================================
/*
*/