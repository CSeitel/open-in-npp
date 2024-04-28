/*
*/
  import { type TAnyFunctionSingleArg
         , type TOrderedPairs
         } from '../types/generic.d';
  import { type TCreateOrderedPair
         } from '../types/lib.arrayUtil.d';
//====================================================================

export function includes<T>( ü_list:T[], ö_item:T ):number {
    return ü_list.findIndex( ü_item => ü_item === ö_item );
}

//====================================================================

export function putFirst<T,P extends keyof T>(   list:T[],   item:  T[P],   prop :P ):number
export function putFirst<T,P extends keyof T>(   list:T[],   item:T                 ):number
export function putFirst<T,P extends keyof T>( ü_list:T[], ö_item:T|T[P], ö_prop?:P ):number {
    const ü_indx = ö_prop === undefined
                 ? ü_list.findIndex( ü_item => ü_item           === ö_item )
                 : ü_list.findIndex( ü_item => ü_item[ ö_prop ] === ö_item )
                 ;
    if ( ü_indx > 0 ) { putFirstIndex( ü_list, ü_indx ); }
    return ü_indx;
}

export function putLast<T,P extends keyof T>(   list:T[],   item:  T[P],   prop :P ):number
export function putLast<T,P extends keyof T>(   list:T[],   item:T                 ):number
export function putLast<T,P extends keyof T>( ü_list:T[], ö_item:T|T[P], ö_prop?:P ):number {
    const ü_indx = ö_prop === undefined
                 ? ü_list.findIndex( ü_item => ü_item           === ö_item )
                 : ü_list.findIndex( ü_item => ü_item[ ö_prop ] === ö_item )
                 ;
    const ü_more = ü_indx + 1;
    if ( ü_more > 0
      && ü_more < ü_list.length ) { putLastIndex( ü_list, ü_indx ); }
    return ü_indx;
}

export function putFirstIndex<T>( ü_list:T[], ü_indx:number ):void {
    if ( ü_indx > 0
      && ü_indx < ü_list.length ) {
        ü_list.unshift( ü_list.splice( ü_indx, 1 )[0] );
    }
}

export function putLastIndex<T>( ü_list:T[], ü_indx:number ):void {
    if ( ü_indx < ü_list.length - 1 ) {
        ü_list.push( ü_list.splice( ü_indx, 1 )[0] );
    }
}

//====================================================================

export function straightenArray<T>( ü_mixed: (T|readonly T[])[] ):T[] {
    const ü_done = [] as T[];
    ü_mixed.forEach( ü_elem => {
        if ( Array.isArray( ü_elem ) ) {  ü_done.push( ... ü_elem      );  }
        else                           {  ü_done.push(     ü_elem as T );  }
    });
    return ü_done;
}

//====================================================================

export function projection<U,V>(   row:(U|V)[],  colX1:number, colX2:number ):[U,V]
export function projection<T>  (   row:T[], ...  colXs:number[] ):T[]
export function projection<T>  ( ü_row:T[], ...ü_colXs:number[] ):T[] {
    return ü_colXs.map( ü_colX => ü_row[ ü_colX ] );
}

//type 
export function pickDuplet<U,V,W=any>( ü_indx:number, ü_jndx:number ):((row:(U|V|W)[])=>[U,V]) {
  //const ü_01 = ü_data.map( ü_row => projection<string,boolean|null>( ü_row, 0, 1 ) );
    return function( ü_row:(U|V|W)[] ):[U,V] {
        return [ ü_row[ ü_indx ] as U
               , ü_row[ ü_jndx ] as V
               ];
      };
}

//====================================================================

export function toOrderedPair<Tx,Ty>( ü_data:Map<Tx,Ty> ):TOrderedPairs<Tx,Ty> {
    const ö_arry = [] as TOrderedPairs<Tx,Ty>;
    ü_data.forEach(function( ü_y, ü_x ){
        ö_arry.push([ ü_x, ü_y ]);
    });
    return ö_arry;
}

//====================================================================

export function createArray   (   length:number                                                ):number[]
export function createArray<T>(   length:number,   createItem :TAnyFunctionSingleArg<T,number> ):         T[]
export function createArray<T>( ü_length:number, ü_createItem?:TAnyFunctionSingleArg<T,number> ):number[]|T[] {
    const ü_done = [] as (number|T)[];
      let ü_indx = 0;
    if ( ü_createItem === undefined )
         do { ü_done.push(               ü_indx   ); } while ( ++ ü_indx < ü_length );
    else do { ü_done.push( ü_createItem( ü_indx ) ); } while ( ++ ü_indx < ü_length );
    return ü_done as number[]|T[];
}

export function createOrderedPairs<Tx,Ty>( ü_count:number, createX:TAnyFunctionSingleArg<Tx,number>, createY:TCreateOrderedPair<Tx,Ty> ):TOrderedPairs<Tx,Ty> {
    return createArray( ü_count, function( ü_indx ){
                    const ü_x = createX( ü_indx );
        return [          ü_x
               , createY( ü_x, ü_indx ) ];
      });
}

//====================================================================
/*
*/