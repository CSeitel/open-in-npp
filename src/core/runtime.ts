/*
*/
  import { type ExtensionContext
         , type Extension
         } from 'vscode';
  import { type TExtensionConfig
         } from '../constants/extension';
//--------------------------------------------------------------------
  import { CExtensionId
         } from '../constants/extension';
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
export type TExtension      = Extension<TOpenInNpp>
export type TRuntimeContext = ExtensionRuntime

class ExtensionRuntime {
    static readonly developerTrace :false|typeof console.log = console.log;
    static          activeInstance :ExtensionRuntime //|undefined = undefined;
  //
static activate( ü_extnContext:ExtensionContext ):ExtensionRuntime {
    if(ß_trc){ß_trc( ExtensionRuntime.activeInstance === undefined ? 'Activation' : 'Re-Activation' );}
    return new ExtensionRuntime( ü_extnContext );
}
  //
    readonly globalHistory:History
    readonly extensionApi :TExtension
  //
    readonly version      :string
    readonly commands     :TExtensionCommand[]
    readonly settings     :TExtensionConfig

private constructor(
    readonly context      :ExtensionContext
){
  //
    ExtensionRuntime.activeInstance = this;
    this.globalHistory = new History();
    this.extensionApi = ßß_vsCode.extensions.getExtension( CExtensionId )!;
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