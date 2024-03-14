/*
*/
  import { type XtnOpenInNpp as _XtnOpenInNpp
         } from '../core/runtime';
  import { type MementoFacade
         } from '../vsc/histUtil';
//====================================================================
  export type XtnOpenInNpp = _XtnOpenInNpp
//--------------------------------------------------------------------
  export type TCommandIds = 'openInNpp.openSettings'
                          | 'extension.openInNpp'
                          | 'extension.openInNppX'
                          | 'extension.openInNppY'
  export type TExtensionCommand =
    { command :TCommandIds
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

  export interface IHistoryData {
      dummy :number[]
      admin :
        { version    :number
        }
      config:
        { executable :string
        }
    }
  type THistProxy<P extends string, T extends Record<P,object>> = {
    [K in P] :MementoFacade<K,T>
  }
  export type THistoryProxy = THistProxy<keyof IHistoryData,IHistoryData>
//====================================================================
/*
*/