/*
*/
  import { type TAnyFunction
         } from '../types/generic';
  import { type TProcessingInfo
         , type TIndexMapping
         } from '../types/lib.functionUtil.d';
//====================================================================

export function      nullOperation():        void  {}
export function asyncNullOperation():Promise<void> { return Promise.resolve(); }

export function identityMap<Tx>( ü_x:Tx ):Tx {
    return ü_x;
}

//====================================================================

export function bindAppending<Ty>( ö_fref:TAnyFunction<Ty>, ...ö_baseArgs:readonly any[] ):TAnyFunction<Ty> {
    return ö_bound;
//
function ö_bound( ...ü_realArgs:any[] ):Ty {
    return ö_fref.apply( null, ü_realArgs.concat( ö_baseArgs ) );
}
}

//--------------------------------------------------------------------

export function bindArguments<Ty,Tz=Ty>( ö_fref:TAnyFunction<Ty>, ö_todo:TProcessingInfo<Ty,Tz>, ...ö_baseArgs:readonly any[] ):TAnyFunction<Tz> {
    const ö_baseMap = ö_todo.arrangeBound === undefined ? {} : ö_todo.arrangeBound ;
    const ö_realMap = ö_todo.arrangeReal  === undefined ? {} : ö_todo.arrangeReal  ;
    return ö_bound;
//
function ö_bound( ...ü_realArgs:any[] ):Tz {
  //
    const ü_args = ö_todo.realFirst === true ? ü_realArgs.concat( ö_baseArgs )
                                             : ö_baseArgs.concat( ü_realArgs );
  //
    for ( const ü_old in ö_baseMap ) { ü_args[ ö_baseMap[ ü_old ] ] = ö_baseArgs[ ü_old ]; }
    for ( const ü_old in ö_realMap ) { ü_args[ ö_realMap[ ü_old ] ] = ü_realArgs[ ü_old ]; }
  //
    if ( ö_todo.prepare !== undefined ) {
        for ( const ü_indx in ö_todo.prepare ) {
            ü_args[ ü_indx ] = ö_todo.prepare[ ü_indx ]( ü_args[ ü_indx ] );
        }
    }
  //
    const ü_done = ö_fref.apply( ö_todo.that, ü_args );
    return ö_todo.refine === undefined ? ü_done as unknown as Tz
                                       : ö_todo.refine( ü_done );
}
}

//====================================================================
/*
*/