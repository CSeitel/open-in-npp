/*
*/
//====================================================================

export function putFirst<T,P extends keyof T>( ü_list:T[], ö_item:T|T[P], ü_prop?:P ):number {
    const ü_indx = ü_prop === undefined
                 ? ü_list.findIndex( ü_item => ü_item           === ö_item )
                 : ü_list.findIndex( ü_item => ü_item[ ü_prop ] === ö_item )
                 ;
    if ( ü_indx > 0 ) {
      putFirstIndex( ü_list, ü_indx );
    }
    return ü_indx;
}

export function putFirstIndex<T>( ü_list:T[], ü_indx:number ):void {
    if ( ü_indx > 0 ) {
      ü_list.unshift( ü_list.splice( ü_indx, 1 )[0] );
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


//====================================================================
/*
export function forEach<T>( ü_oref:T[]|Record<PropertyKey,T> ):void {
}
*/