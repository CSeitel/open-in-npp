/*
*/
//--------------------------------------------------------------------

  export type TPromise<T> = {
      promise: Promise<T>
      resolve( value :T     ):void
      reject ( reason:Error ):void
    }

//====================================================================

  export interface IReleaseResource<T> {
      ():void
      ( err:any ):Promise<T>
    }

//--------------------------------------------------------------------