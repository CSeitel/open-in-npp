/*
*/
//--------------------------------------------------------------------
  export type TTimer       = ()=>number

  export type      TPromiseFulfilled<T>           = PromiseFulfilledResult<T> & { rejected:false }
  export interface IPromiseRejected <R=any> extends PromiseRejectedResult       { rejected:true
      reason:R
    }
  export type TPromiseSettled<T,R> = TPromiseFulfilled<T>
                                   | IPromiseRejected <R>

//====================================================================

  export type TPromise<T,R=any> = {
      promise        :Promise<T>
      resolve( value :T ):void
      reject ( reason:R ):void
    }

//====================================================================

  export interface IReleaseResource<R> {
      ():void
      ( err:any ):Promise<R>
    }

//--------------------------------------------------------------------
/*
*/