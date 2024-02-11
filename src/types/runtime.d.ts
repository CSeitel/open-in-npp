/*
*/
  import { type Extension
         } from 'vscode';
  import { type TActiveExtension
         } from '../core/runtime';
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