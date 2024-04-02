/*
*/
//====================================================================

export function isDirectInstanceOf( ü_oref:object, ü_class:Function ):boolean {
    return Object.getPrototypeOf( ü_oref ) === ü_class.prototype;
  /*
    do {
        ü_oref = Object.getPrototypeOf( ü_oref );
        if ( ü_oref instanceof ü_parent ) { return true; }
    } while ( ü_oref != null );
    return false;
  */
}

//====================================================================
/*
*/