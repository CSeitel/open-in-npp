/*
*/
  import { type ExtensionContext
         , type Extension
         , type ConfigurationChangeEvent
         } from 'vscode';
  import { type TAnyFunction
         } from '../types/generic.d';
  import {
           type TOpenInNpp
         , type TExtensionCommand
         , type THistoryProxy
         } from '../types/vsc.extension.d';
  import { type IRuntimeContext
         } from '../types/runtime.context.d';
  import { type TExtensionConfig
         } from '../constants/extension';
//--------------------------------------------------------------------
  import { CExtensionId
         , CExtensionUrl
         , CPrefix
         , CEXtnCommands
         } from '../constants/extension';
//--------------------------------------------------------------------
  import { workspace
         , commands
         , extensions
         , window
         } from 'vscode';
  import { openInNppActive
         , openInNppEditor
         , openInNppExplorer
         } from '../core/implementation';
  import   ConfigContext
           from '../core/configContext';
  import { whenUriOpened
         , whenSettingsOpened
         } from '../vsc/cmdUtil';
//--------------------------------------------------------------------
  import { MementoFacade
         } from '../vsc/histUtil';
//====================================================================

class XtnRuntimeContext {
    static readonly lineSep = '\n';
    static readonly devTrace :false|typeof console.log = console.log;
    static          activeInstance :TOpenInNpp //|undefined = undefined;

static async whenActiveInstanceAvailable():Promise<TOpenInNpp> {
    const ü_extn = extensions.getExtension<TOpenInNpp>( CExtensionId )!;
    if ( ! ü_extn.isActive ) { await ü_extn.activate(); }
    return ü_extn.exports;
}

static async _whenXtnActivated( ü_extnContext:ExtensionContext ):Promise<TOpenInNpp> {
    if ( XtnRuntimeContext.activeInstance === undefined ) {
       await new XtnRuntimeContext( ü_extnContext )._whenActivationFinalized();
    } else {
      ß_trc&& ß_trc( 'Re-Activation' );
      if ( XtnRuntimeContext.activeInstance.context !== ü_extnContext ) {
          ß_trc&& ß_trc( 'Re-Activation: new Context' );
      }
    }
  //
    return XtnRuntimeContext.activeInstance;
}

  //----------
    readonly globalHistory:THistoryProxy
    readonly extensionApi :Extension<TOpenInNpp>
  //
    readonly version      :string
    readonly commands     :TExtensionCommand[]
    readonly settings     :TExtensionConfig

private constructor(
    readonly context      :ExtensionContext
){
    XtnRuntimeContext.activeInstance = this;
    ß_trc&& ß_trc( 'Instance activated' );
  //console.dir( this.context.globalState );
  //
    this.globalHistory =
      { admin  : new MementoFacade( 'admin' , { version   : 0  } )
      , config : new MementoFacade( 'config', { executable: '' } )
      , dummy  : new MementoFacade( 'dummy' , []                 )
      };
  //
    this.extensionApi = context.extension;// extensions.getExtension( CExtensionId )!;
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
            case CEXtnCommands.oSettings : ü_cmdImpl = whenSettingsOpened.bind( null, CPrefix ); break;
            case CEXtnCommands.oActive   : ü_cmdImpl = openInNppActive   ; break;
            case CEXtnCommands.oEditor   : ü_cmdImpl = openInNppEditor   ; break;
            case CEXtnCommands.oExplorer : ü_cmdImpl = openInNppExplorer ; break;
            default:
                console.error( `Command "${ ü_cmdId }" not implemented.` );
                continue;
        }
        this.context.subscriptions.push(  commands.registerCommand( ü_cmdId, ü_cmdImpl )  );
    }
        this.context.subscriptions.push(  workspace.onDidChangeConfiguration( this.modificationSignalled.bind( this ) )  );
  //
}

private modificationSignalled( ü_change:ConfigurationChangeEvent ):void {
    if ( ! ü_change.affectsConfiguration( CPrefix ) ) { return; }
    ConfigContext.modificationSignalled( ü_change );
}

private async _whenActivationFinalized():Promise<void> {
    const ü_versionToNumber = /\./g;
    const ü_current = parseInt( this.version.replace( ü_versionToNumber, '' ) );
  //
    const ü_admin = this.globalHistory.admin;
    if ( ü_current > ü_admin.dataRef.version ) {
    //ß_trc&& ß_trc( `Admin-History`, ü_admin );
      ü_admin.dataRef.version= ü_current;
      const ü_when = await this.globalHistory.admin.whenCommitted( );
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
  export type _OpenInNpp = XtnRuntimeContext
//--------------------------------------------------------------------
  export const ß_RuntimeContext = XtnRuntimeContext as ( typeof XtnRuntimeContext & IRuntimeContext );
  export const ß_trc            = XtnRuntimeContext.devTrace;
//====================================================================
/*
*/