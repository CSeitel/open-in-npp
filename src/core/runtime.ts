/*
*/
  import { type TExtensionConfig
         } from '../constants/extension';
//--------------------------------------------------------------------
//--------------------------------------------------------------------
  import * as ßß_vsCode from 'vscode';
//====================================================================
  type TExtensionCommand =
    { command :keyof typeof CCommandHandlerMap
    , title   :string
    }
  type TOpenInNpp =
    {
    }
export type TExtension = ßß_vsCode.Extension<TOpenInNpp>

export default class ExtensionRuntime {
    static readonly CExtensionId                             = 'CSeitel.open-in-npp';
  //static readonly CExtensionUrl                            = 'https://marketplace.visualstudio.com/items?itemName=CSeitel.open-in-npp';
    static readonly CExtensionUrl                            = 'https://marketplace.visualstudio.com/items/CSeitel.open-in-npp';
    static readonly developerTrace :false|typeof console.log = console.log;
    static          activeInstance :ExtensionRuntime //|undefined = undefined;
  //
    readonly globalHistory:History
    readonly extensionApi :TExtension
  //
    readonly version      :string
    readonly commands     :TExtensionCommand[]
    readonly settings     :TExtensionConfig

constructor(
    readonly context      :ßß_vsCode.ExtensionContext
){
    if(ß_trc){ß_trc( ExtensionRuntime.activeInstance === undefined ? 'Activation' : 'Re-Activation' );}
                     ExtensionRuntime.activeInstance = this;
  //
    this.globalHistory = new History();
    this.extensionApi = ßß_vsCode.extensions.getExtension( ExtensionRuntime.CExtensionId )!;
  //
                 const ü_json = this.extensionApi.packageJSON;
    this.version     = ü_json.version;
    this.commands    = ü_json.contributes.commands;
    this.settings    = ü_json.contributes.configuration.properties;
  //
}

}
//------------------------------------------------------------------------------
  export const ß_RuntimeContext = ExtensionRuntime;
  export const ß_trc            = ExtensionRuntime.developerTrace;
//==============================================================================
  import { CommandHandler
         , ConfigHandler
         } from '../core/implementation';
  import { History
         } from '../core/historyProxy';
//------------------------------------------------------------------------------
  export const CCommandHandlerMap =
    {           'openInNpp.openSettings': ConfigHandler .whenSettingsOpened
    , 'extension.openInNpp'             : CommandHandler.openInNppActive 
    , 'extension.openInNppX'            : CommandHandler.openInNppEditor
    , 'extension.openInNppY'            : CommandHandler.openInNppExplorer
    };
//------------------------------------------------------------------------------