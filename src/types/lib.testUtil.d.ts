/*
*/
  import { TAsyncFunctionWithoutArg
         } from './generic.d'
//--------------------------------------------------------------------
  export type TTDDSuite = typeof suite
  export type TTDDTest  = typeof test
//====================================================================
  export type TTestSuiteDefinition = [string,TTestSuite,boolean|undefined]
  export type TTestSuites          = TTestSuiteDefinition[]

  export type TTestResult = string

  export type                            TAsyncTestFunction = TAsyncFunctionWithoutArg<void>
  export type TTestSuite = Record<string,TAsyncTestFunction>
                         |               TAsyncTestFunction[]

//====================================================================
/*
*/