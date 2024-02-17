/*
*/
  import { type Extension
         } from 'vscode';
  import { type TActiveExtension
         } from '../core/runtime';
  import { type MementoFacade
         } from '../vsc/histUtil';
//====================================================================
  type TOpenInNpp = TActiveExtension
  export type TExtension = Extension<TOpenInNpp>
//--------------------------------------------------------------------
  export type TCommandIds = 'openInNpp.openSettings'
                          | 'extension.openInNpp'
                          | 'extension.openInNppX'
                          | 'extension.openInNppY'
  export type TExtensionCommand =
    { command :TCommandIds
    , title   :string
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