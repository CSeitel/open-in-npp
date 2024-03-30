/*
*/
  import { type ExtensionContext
         , type Extension
         , type TextDocument
         } from 'vscode';
  import { type TAnyFunction
         } from '../types/generic.d';
  import { type TExtensionCommand
         , type THistoryProxy
         , type TShadowDoc
         , type IDisposableLike
         } from '../types/vsc.extension.d';
  import { type TXtnCfgJSON
         } from '../constants/extension';
//--------------------------------------------------------------------
  import { CXtnWebUrl
         , CXtnCfgPrefix
         , CEXtnCommands
         , CXtnTxtScheme
         } from '../constants/extension';
  import { CEUriScheme
         } from '../constants/vsc';
//--------------------------------------------------------------------
  import { workspace
         , commands
         , window
         , Disposable
         } from 'vscode';
  import { ß_trc
         , ß_toggleDevTrace
         } from '../runtime/context';
  import { configModificationSignalled
         , getConfigSnapshot
         } from '../core/configContext';
  import { LCXtn
         , LCDoIt
         } from '../l10n/i18n';
  import { LCHeader
         } from '../l10n/generic';
  import { openInNppActive
         , openInNppEditor
         , openInNppExplorer
         } from '../core/implementation';
//--------------------------------------------------------------------
  import { whenUriOpened
         , whenSettingsOpened
         } from '../vsc/cmdUtil';
  import { MementoFacade
         } from '../vsc/histUtil';
//====================================================================

export class XtnOpenInNpp {
    readonly whenReady:Promise<this>
  //
    readonly shadowDocsBfr = new Map<TextDocument,TShadowDoc>();
    readonly vscDisposables:ReadonlyArray<IDisposableLike> & { push:( ... item:IDisposableLike[] )=>void }
    readonly globalHistory :THistoryProxy
  //
    readonly extensionApi :Extension<XtnOpenInNpp>
    readonly version      :string
    readonly commands     :TExtensionCommand[]
    readonly settings     :TXtnCfgJSON

readonly dispose = ()=>{
    ß_trc&& ß_trc( 'Disposing', 'Runtime' );
    this.shadowDocsBfr.clear();
}

private _onDidCloseTextDocument = ( ü_anyDoc:TextDocument )=>{
    if ( ! ü_anyDoc.isClosed
      ||   ü_anyDoc.uri.scheme === CEUriScheme.file
       ) { return; }
    ß_trc&& ß_trc( `Closing shadow ${ ü_anyDoc.fileName }`, 'Runtime' );
    if ( this.shadowDocsBfr.has   ( ü_anyDoc ) )
       { this.shadowDocsBfr.delete( ü_anyDoc ); }
}

constructor(
    readonly vscContext   :ExtensionContext
){
    ß_trc&& ß_trc( 'Instance activated' );
    getConfigSnapshot().developerTrace || ß_toggleDevTrace();
  //
    this.globalHistory =
      { admin  : new MementoFacade( this.vscContext, 'admin' , { version   : 0  } )
      , config : new MementoFacade( this.vscContext, 'config', { executable: '' } )
      , dummy  : new MementoFacade( this.vscContext, 'dummy' , []                 )
      };
  //
    this.vscDisposables = this.vscContext.subscriptions
    this.extensionApi = this.vscContext.extension;// extensions.getExtension( CExtensionId )!;
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
            case CEXtnCommands.oSettings : ü_cmdImpl = whenSettingsOpened.bind( null, CXtnCfgPrefix ); break;
            case CEXtnCommands.oActive   : ü_cmdImpl = openInNppActive   ; break;
            case CEXtnCommands.oEditor   : ü_cmdImpl = openInNppEditor   ; break;
            case CEXtnCommands.oExplorer : ü_cmdImpl = openInNppExplorer ; break;
            default:
                console.error( `Command "${ ü_cmdId }" not implemented.` );
                continue;
        }
      this.vscDisposables.push(  commands.registerCommand( ü_cmdId, ü_cmdImpl )  );
    }
  //
      this.vscDisposables.push(             this
      , workspace.onDidChangeConfiguration( configModificationSignalled  )
      , workspace.onDidCloseTextDocument  ( this._onDidCloseTextDocument )
      );
  //
    this.whenReady = this._whenActivationFinalized();
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
    const ü_show = await window.showInformationMessage( LCXtn.welcome( ü_newVersion ), LCXtn.delta());
    switch ( ü_show ) {
        case undefined: break;
        default:
          whenUriOpened( CXtnWebUrl + '/changelog' );
    }
}
}

}

//====================================================================
/*
*/