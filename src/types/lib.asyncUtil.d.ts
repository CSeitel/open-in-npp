/*
*/
//--------------------------------------------------------------------
  export type TTimer       = ()=>number
  export type TPromiseSettled<T> = ( PromiseFulfilledResult<T> & { rejected:false   } )
                                 | ( PromiseRejectedResult     & { rejected:true    } )
//====================================================================

  export type TPromise<T> = {
      promise: Promise<T>
      resolve( value :T     ):void
      reject ( reason:Error ):void
    }

//====================================================================

  export interface IReleaseResource<R> {
      ():void
      ( err:any ):Promise<R>
    }

//--------------------------------------------------------------------
/*
*/