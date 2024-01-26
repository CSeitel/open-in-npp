/*
*/
  import { type ExtensionContext
         , type Extension
         } from 'vscode';
  import { type TExtensionConfig
         } from '../constants/extension';
  import { type TExtensionCommands
         } from '../extension';
//--------------------------------------------------------------------
  import { CExtensionId
         } from '../constants/extension';
//--------------------------------------------------------------------
  import * as ßß_vsCode from 'vscode';
//====================================================================
  type TExtensionCommand =
    { command :TExtensionCommands
    , title   :string
    }
  type TOpenInNpp =
    {
    }
  export type TExtension       = Extension<TOpenInNpp>
  export type TActiveExtension = ExtensionRuntimeContext

//====================================================================

class ExtensionRuntimeContext {
    static readonly developerTrace :false|typeof console.log = console.log;
    static          activeInstance :TActiveExtension //|undefined = undefined;
  //
static async whenActive():Promise<void> {
    await ßß_vsCode.commands.executeCommand<unknown>( 'openInNpp.openSettings' );
  //return ExtensionRuntime;
}

static activate( ü_extnContext:ExtensionContext ):TActiveExtension {
    if ( ExtensionRuntimeContext.activeInstance === undefined ) {
      return new ExtensionRuntimeContext( ü_extnContext );
    }
    if(ß_trc){ß_trc( 'Re-Activation' );}
      return ExtensionRuntimeContext.activeInstance;
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
    ExtensionRuntimeContext.activeInstance = this;
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
  export const ß_RuntimeContext = ExtensionRuntimeContext;
  export const ß_trc            = ExtensionRuntimeContext.developerTrace;
//------------------------------------------------------------------------------
  import { History
         } from '../core/historyProxy';
//==============================================================================