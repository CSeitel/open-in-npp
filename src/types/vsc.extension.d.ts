/*
*/
  import { type IRuntimeContext
         } from '../types/runtime.context.d';
  import   type TXtnOpenInNpp
          from '../core/xtnOpenInNpp';
  import { type MementoFacade
         } from '../vsc/histUtil';
//====================================================================

  export type XtnOpenInNpp = TXtnOpenInNpp
  export interface IXtnRuntimeContext extends IRuntimeContext<{}> {
      readonly xtnOpenInNpp:XtnOpenInNpp
  }

//====================================================================

  export type TXtnCommandId = 'openInNpp.openSettings'
                            | 'extension.openInNpp'
                            | 'extension.openInNppX'
                            | 'extension.openInNppY'
  export type TXtnCommand =
    { command :TXtnCommandId
    , title   :string
    }
	export interface IDisposableLike {
			dispose():any
		}

  export type TShadowDoc = {
      file :string
      hash :string
    }
//--------------------------------------------------------------------

  export interface IGlobalHistoryData {
      dummy :number[]
      admin :
        { version    :number
        }
      config:
        { executable :string
        , shadowDir  :string
        }
    }
  export interface ILocalHistoryData {
      config:
        { shadowDir  :string
        }
    }

  type THistoryProxy<P extends string,T extends Record<P,object>> = {
      [K in P] :MementoFacade<K,T>
  }
  export type TGlobalHistoryProxy = THistoryProxy<keyof IGlobalHistoryData,IGlobalHistoryData>
  export type TLocalHistoryProxy  = THistoryProxy<keyof ILocalHistoryData ,ILocalHistoryData >

//====================================================================
/*
*/