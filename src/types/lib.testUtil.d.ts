/*
*/
  import { TAsyncFunctionWithoutArg
         } from './generic.d'
//--------------------------------------------------------------------
//====================================================================

  export type TTestResult = string

  export type                            TAsyncTestFunction = TAsyncFunctionWithoutArg<void>
  export type TTestSuite = Record<string,TAsyncTestFunction>
                         |               TAsyncTestFunction[]

  export type TResultArray<A,B> = [A,B][]
//====================================================================
/*
*/