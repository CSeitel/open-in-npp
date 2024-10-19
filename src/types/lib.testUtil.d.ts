/*
*/
  import { TAsyncFunctionWithoutArg
         } from './generic.d'
//--------------------------------------------------------------------
  export type TTDDSuite = typeof suite
  export type TTDDTest  = typeof test
//====================================================================

  export type                                  TAsyncTestFunction = TAsyncFunctionWithoutArg<void>
  export type TTestSuiteObject = Record<string,TAsyncTestFunction>
  export type TTestSuiteArray  =               TAsyncTestFunction[]
  export type TTestSuite       = TTestSuiteObject
                               | TTestSuiteArray
  export type TTestSuiteDefinition = [string,TTestSuite,boolean|undefined]
  export type TTestSuites          = TTestSuiteDefinition[]

  export type TTestResult  = string
  export type TTestSummary = {
      all   :number
      failed:number
    }

  export type TTestOptions = {
      resourceDirName :string
      withMocha       :boolean
      summaryOnly     :boolean
    }

//====================================================================
/*
*/