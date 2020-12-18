/*
*/
  import * as ßß_vsCode from 'vscode';
//------------------------------------------------------------------------------
  type TExtensionCommand =
    { command :keyof typeof CCommandHandlerMap
    , title   :string
    }
  type TOpenInNpp =
    {
    }
export type TExtension = ßß_vsCode.Extension<TOpenInNpp>
//==============================================================================

export default class ExtensionRuntime {
    static readonly CExtensionFullName                       = 'CSeitel.open-in-npp';
    static readonly developerTrace :false|typeof console.log = console.log;
    static          activeInstance :ExtensionRuntime //|null = null;
  //
    readonly GSDataApi    :ßß_vsCode.Memento
    readonly WSDataApi    :ßß_vsCode.Memento
    readonly extensionApi :TExtension
    readonly version      :string
    readonly commands     :TExtensionCommand[]

constructor(
    readonly context      :ßß_vsCode.ExtensionContext
){
    this.GSDataApi    = this.context.globalState    ;
    this.WSDataApi    = this.context.workspaceState ;
    this.extensionApi = ßß_vsCode.extensions.getExtension( ExtensionRuntime.CExtensionFullName )!;
  //
    ExtensionRuntime.activeInstance = this;
  //
                 const ü_json = this.extensionApi.packageJSON;
    this.version     = ü_json.version;
    this.commands    = ü_json.contributes.commands;
    const ü_a        = ü_json.contributes.configuration.properties;
  //
    if(ß_trc){ß_trc( ü_a );}
}

}
  const ß_trc = ExtensionRuntime.developerTrace;
//------------------------------------------------------------------------------
  import { CommandHandler
         } from './implementation';
  import { ConfigSnapshot
         } from './configHandler';
//------------------------------------------------------------------------------
  const CCommandHandlerMap =
    {           'openInNpp.openSettings': CommandHandler.openSettings
    , 'extension.openInNpp'             : CommandHandler.openInNppActive 
    , 'extension.openInNppX'            : CommandHandler.openInNppEditor
    , 'extension.openInNppY'            : CommandHandler.openInNppExplorer
    };
//==============================================================================

export function activate( ü_extnContext: ßß_vsCode.ExtensionContext ):void {
  //
    const ü_activeInstance = new ExtensionRuntime( ü_extnContext );
  //
    for ( const ü_cmd of ü_activeInstance.commands ) {
      const ü_cmdId = ü_cmd.command;
      if ( ü_cmdId in CCommandHandlerMap ) {
        ü_extnContext.subscriptions.push(  ßß_vsCode.commands.registerCommand( ü_cmdId, CCommandHandlerMap[ ü_cmdId ] ) );
      }
    }
  //
    ßß_vsCode.workspace.onDidChangeConfiguration( ConfigSnapshot.modificationSignalled );
}

export function deactivate():void {}

//==============================================================================
/*
*/