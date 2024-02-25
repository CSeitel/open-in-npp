/*
*/
//--------------------------------------------------------------------
  export type TWritable<T extends any> = {
      -readonly [K in keyof T] :T[K]
    }

  export type TOther<T,U> = {
      [K in keyof T]:T[K] & U
    }
//====================================================================

  export type TAnyFunction  <T=any> = ( ...args:any[] )=>            T
  export type TAsyncFunction<T=any> = ( ...args:any[] )=>PromiseLike<T>

  export type TStringify  <T=any> = ( arg0:T )=>string

//====================================================================
/*
*/