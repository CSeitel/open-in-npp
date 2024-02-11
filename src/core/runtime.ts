/*
*/
  import { type ExtensionContext
         } from 'vscode';
  import { type TAnyFunction
         } from '../types/generic.d';
  import { type TExtension
         , type TExtensionCommand
         } from '../types/runtime';
  import { type TExtensionConfig
         } from '../constants/extension';
//--------------------------------------------------------------------
  import { CExtensionId
         , CExtensionUrl
         , CECommands
         } from '../constants/extension';
//--------------------------------------------------------------------
  import { workspace
         , window
         , commands
         } from 'vscode';
  import * as ßß_vsCode from 'vscode';
  import { CommandHandler
         , ConfigHandler
         } from '../core/implementation';
  import { ConfigSnapshot
         } from '../core/configProxy';
  import { whenDelay
         } from '../lib/asyncUtil';
  import { whenUriOpened
         } from '../lib/vsc';
//import { ß_RuntimeContext
//       } from '../core/runtime';
//--------------------------------------------------------------------

//====================================================================

class ExtensionRuntimeContext {
    static readonly developerTrace :false|typeof console.log = console.log;
    static          activeInstance :ExtensionRuntimeContext //|undefined = undefined;

static async activate( ü_extnContext:ExtensionContext ):Promise<TActiveExtension> {
    if ( ExtensionRuntimeContext.activeInstance === undefined ) {
       await new ExtensionRuntimeContext( ü_extnContext )._whenActivationFinalized();
    } else {
      ß_trc&& ß_trc( 'Re-Activation' );
      if ( ExtensionRuntimeContext.activeInstance.context !== ü_extnContext ) {
          ß_trc&& ß_trc( 'Re-Activation: new Context' );
      }
    }
  //
    return ExtensionRuntimeContext.activeInstance;
}

  //----------
    readonly globalHistory:History
    readonly extensionApi :TExtension
  //
    readonly version      :string
    readonly commands     :TExtensionCommand[]
    readonly settings     :TExtensionConfig

private constructor(
    readonly context      :ExtensionContext
){
    ExtensionRuntimeContext.activeInstance = this;
    ß_trc&& ß_trc( 'Instance activated' );
  //console.dir( this.context.globalState );
  //
    this.globalHistory = new History();
    this.extensionApi = ßß_vsCode.extensions.getExtension( CExtensionId )!;
  //
                 const ü_json = this.extensionApi.packageJSON;
    this.version     = ü_json.version;
    this.commands    = ü_json.contributes.commands;
    this.settings    = ü_json.contributes.configuration.properties;
  //
    for ( const ü_cmd of this.commands ) {
        let ü_cmdImpl:TAnyFunction
        const ü_cmdId = ü_cmd.command;
        switch ( ü_cmdId ) {
            case CECommands.oSettings : ü_cmdImpl = ConfigHandler .whenSettingsOpened; break;
            case CECommands.oActive   : ü_cmdImpl =  CommandHandler.openInNppActive  ; break;
            case CECommands.oEditor   : ü_cmdImpl = CommandHandler.openInNppEditor   ; break;
            case CECommands.oExplorer : ü_cmdImpl = CommandHandler.openInNppExplorer ; break;
            default:
                console.error( `Command "${ ü_cmdId }" not implemented.` );
                continue;
        }
        this.context.subscriptions.push(  commands.registerCommand( ü_cmdId, ü_cmdImpl )  );
    }
        this.context.subscriptions.push(  workspace.onDidChangeConfiguration( ConfigSnapshot.modificationSignalled )  );
  //
}

private async _whenActivationFinalized():Promise<void> {
    const ü_versionToNumber = /\./g;
    const ü_current = parseInt( this.version.replace( ü_versionToNumber, '' ) );
  //
    const ü_admin = this.globalHistory.admin;
    if ( ü_current > ü_admin.version ) {
    //ß_trc&& ß_trc( `Admin-History`, ü_admin );
      const ü_when = this.globalHistory.whenAdmin( { version: ü_current } );
      ö_info( this.version );
    }
  //
async function ö_info( ü_newVersion:string ):Promise<void> {
    const ü_show = await window.showInformationMessage( `Welcome to \`Open-In-Notepad++\` Version ${ ü_newVersion }`, `What's new ?` );
    switch ( ü_show ) {
        case undefined: break;
        default:
          whenUriOpened( CExtensionUrl + '/changelog' );
    }
}
}

}

//====================================================================
  export type TActiveExtension  = ExtensionRuntimeContext
//--------------------------------------------------------------------
  export const ß_RuntimeContext = ExtensionRuntimeContext;
  export const ß_trc            = ExtensionRuntimeContext.developerTrace;
//====================================================================
  import { History
         } from '../core/historyProxy';
