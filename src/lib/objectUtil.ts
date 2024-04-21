/*
*/
  import { type TAnyObject
         } from '../types/lib.objectUtil.d';
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

export function forEach<T extends TAnyObject>(                                                ü_oref:T
                                             , ü_forEach :( ü_value:T[keyof T],ü_mKey:keyof T,ü_oref:T )=>void
                                             , ü_that   ?:any                                      ):T {
      let ü_mKey:keyof T
    for ( ü_mKey in ü_oref ) {
      ü_forEach.call( ü_that
                    , ü_oref[ ü_mKey ]
                    ,         ü_mKey
                    , ü_oref
                    );
    }
    return ü_oref;
}

export function map<T extends TAnyObject,U>(                                              ü_oref:T
                                           , ü_map   :( ü_value:T[keyof T],ü_mKey:keyof T,ü_oref:T )=>U
                                           , ü_that ?:any                                          ):Record<keyof T,U> {
    const ö_done = {} as Record<keyof T,U>;
      let ü_mKey:keyof T
    for ( ü_mKey in ü_oref ) {
      ö_done[ ü_mKey ] = ü_map.call( ü_that
                                   , ü_oref[ ü_mKey ]
                                   ,         ü_mKey
                                   , ü_oref
                                   );
    }
    return ö_done;
}

//====================================================================

export function pickProperty<T,P extends keyof T>( ü_oref:T, ü_mKey:P ):T[P] {
  //( ü_oref as Object ).hasOwnProperty
    return ü_oref[ ü_mKey ];
}

//====================================================================
/*
*/