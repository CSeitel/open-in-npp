
  export type TAssert<T=any> = (actual:unknown, expected:T, message?:string|Error) => asserts actual is T;
  export type TTestResult = string
  export type TResultArray<A,B> = [A,B][]
//( act:any, exp:, message?:string )=>void
  export type TArgMap = number
                      | ( (ü_argN:any) => any )
                      | { }
  export type TArgumentsInfo = {
    that ?:any
    realFirst ?:boolean
    arrangeReal ?: number[]
    arrangeBound?: number[]
  }

  export type TAnyFunction  <T=any> = ( ...args:any[] )=>T
  export type TAsyncFunction<T=any> = TAnyFunction<Promise<T>>
  export type TAsyncTestFunction = ()=>Promise<void>