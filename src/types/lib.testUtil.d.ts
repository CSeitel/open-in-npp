/*
*/
  import { type TAsyncFunctionWithoutArg
         } from './generic.d';
  import { type TOutputWriter
         } from './runtime.context.d';
//--------------------------------------------------------------------
  export type TTDDSuite = typeof suite
  export type TTDDTest  = typeof test
//====================================================================

  export type                                      TAsyncTestFunction = TAsyncFunctionWithoutArg<void>
  export type TTestSuite           = Record<string,TAsyncTestFunction>
                                   | ArrayLike    <TAsyncTestFunction>
  export type TTestSuiteDefinition = [string,TTestSuite,boolean|undefined]
  export type TTestSuites          = TTestSuiteDefinition[]

  export type TSingleTest        = [string,TAsyncTestFunction]
  export type TSingleTestSuite   = [string,TSeveralTests     ]
  export type TSeveralTests      = TSingleTest     []
  export type TSeveralTestSuites = TSingleTestSuite[]

  export type TTestResult  = string
  export type TTestSummary = {
      all   :number
      failed:number
    }

  export type TTestOptions = {
      resourceDirName :string
      withMocha       :boolean
      summaryOnly     :boolean
      failuresOnly    :boolean
      singleTest     ?:TAsyncTestFunction
    }
  export type TTestContext = TTestOptions & {
      write     :TOutputWriter
      checksSum :TTestResult[]
    }

//====================================================================
/*
*/