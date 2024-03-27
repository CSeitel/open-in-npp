/*
*/
//--------------------------------------------------------------------
  import { ß_RuntimeContext
         , ß_trc
         } from '../runtime/context';
//====================================================================

export class BufferedMap<K,T> extends Map<K,T> {

constructor(
    private readonly _getIt   :(ü_id:K)=>T
  , private readonly _thisArg?:any
){
    super();
}

get( ü_id:K ):T {
    if ( this.has( ü_id ) ) { return super.get( ü_id )!; }
                   const ü_value = this._getIt.call( this._thisArg, ü_id );
         this.set( ü_id, ü_value );
                  return ü_value;
}

}

//====================================================================
/*
*/