/*
*/
//====================================================================

export function putFirst<T,P extends keyof T>( ü_list:T[], ö_item:T|T[P], ü_prop?:P ):number {
    const ü_indx = ü_prop === undefined
                 ? ü_list.findIndex( ü_item => ü_item           === ö_item )
                 : ü_list.findIndex( ü_item => ü_item[ ü_prop ] === ö_item )
                 ;
    if ( ü_indx > 0 ) {
      ü_list.unshift( ü_list.splice( ü_indx, 1 )[0] );
    }
    return ü_indx;
}

export function putFirstIndex<T>( ü_list:T[], ü_indx:number ):void {
    if ( ü_indx > 0 ) {
      const ü_item = ü_list.splice( ü_indx, 1 )[0];
                     ü_list.unshift( ü_item );
    }
}

/*
*/