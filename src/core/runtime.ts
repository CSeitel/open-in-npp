/*
*/
  import { type ExtensionContext
         , type Extension
         , type ConfigurationChangeEvent
         } from 'vscode';
  import { type TAnyFunction
         } from '../types/generic.d';
  import { type TExtensionCommand
         , type THistoryProxy
         } from '../types/vsc.extension.d';
//--------------------------------------------------------------------
  import { type TExtensionConfig
         } from '../constants/extension';
  import { CExtensionUrl
         , CPrefix
         , CEXtnCommands
         } from '../constants/extension';
//--------------------------------------------------------------------
  import { ß_trc
         } from '../runtime/context-XTN';
  import { workspace
         , commands
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

export class XtnOpenInNpp {
    readonly whenActivated:Promise<this>
    readonly globalHistory:THistoryProxy
    readonly extensionApi :Extension<XtnOpenInNpp>
  //
    readonly version      :string
    readonly commands     :TExtensionCommand[]
    readonly settings     :TExtensionConfig

constructor(
    readonly context      :ExtensionContext
){
    ß_trc&& ß_trc( 'Instance activated' );
  //console.dir( this.context.globalState );
  //
    this.globalHistory =
      { admin  : new MementoFacade( context, 'admin' , { version   : 0  } )
      , config : new MementoFacade( context, 'config', { executable: '' } )
      , dummy  : new MementoFacade( context, 'dummy' , []                 )
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
    this.whenActivated = this._whenActivationFinalized();
}

private modificationSignalled( ü_change:ConfigurationChangeEvent ):void {
    if ( ! ü_change.affectsConfiguration( CPrefix ) ) { return; }
    ConfigContext.modificationSignalled( ü_change );
}

private async _whenActivationFinalized():Promise<this> {
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
    return this;
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
  export type _OpenInNpp = XtnOpenInNpp
//--------------------------------------------------------------------
//====================================================================
/*
*/