//--------------------------------------------------------------------
  import { type TTestSummary
         } from '../types/lib.testUtil.d';
//====================================================================
  export type TMochaDone = ()=>void
  export type TAllSpecsModule = {
      whenTestSummary:PromiseLike<TTestSummary>
    }