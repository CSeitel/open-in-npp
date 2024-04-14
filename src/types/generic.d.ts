/*
*/
//--------------------------------------------------------------------
  export type TWritable<T> = {
      -readonly [K in keyof T] :T[K]
    }
  export type TNotReadonly<T extends any> = TWritable<{ro:T}>['ro']

  export type TOther<T,U> = {
      [K in keyof T]:T[K] & U
    }
//====================================================================

  export type TAnyFunction            <Ty=any>   = ( ...args:any[] )=>            Ty
  export type TAnyFunctionSingleArg   <Ty,Tx=Ty> = (    arg0:Tx    )=>            Ty
  export type TAsyncFunction          <Ty=any>   = ( ...args:any[] )=>PromiseLike<Ty>
  export type TAsyncFunctionSingleArg <Ty,Tx=Ty> = (    arg0:Tx    )=>PromiseLike<Ty>
  export type TAsyncFunctionWithoutArg<Ty      > = (               )=>PromiseLike<Ty>

//====================================================================

  export type TStringify<T=any> = (   arg0:T      )=>string
  export type TInputDecoder     = (  input:string )=>string
  export type TOutputEncoder    = ( output:string )=>string

//====================================================================
/*
*/