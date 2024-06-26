/*
*/
  import { type ExtensionContext
         , type Extension
         , type TextDocument
         } from 'vscode';
  import { type TAnyFunction
         } from '../types/generic.d';
  import { type TXtnCommand
         , type TGlobalHistoryProxy
         , type TLocalHistoryProxy
         , type TShadowDocAccess
         , type IDisposableLike
         } from '../types/vsc.extension.d';
  import { type TXtnCfgJSON
         } from '../constants/extension';
//--------------------------------------------------------------------
  import { CXtnWebUrl
         , CXtnCfgPrefix
         , CEXtnCommands
         } from '../constants/extension';
  import { CEUriScheme
         } from '../constants/vsc';
//--------------------------------------------------------------------
  import { workspace
         , commands
         , window
         } from 'vscode';
  import { ß_trc
         } from '../runtime/context';
  import { ConfigHandler
         } from '../core/configContext';
  import { LCXtn
         } from '../l10n/i18n';
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

export default class XtnOpenInNpp {
    readonly whenReady:Promise<this>
  //
    readonly shadowDocsBfr = new Map<TextDocument,TShadowDocAccess>();
    readonly vscDisposables:ReadonlyArray<IDisposableLike> & { push:( ... item:IDisposableLike[] )=>void }
    readonly globalHistory :TGlobalHistoryProxy
    readonly  localHistory :TLocalHistoryProxy
    readonly configApi:ConfigHandler
  //
    readonly extensionApi :Extension<XtnOpenInNpp>
  //readonly version      :string
    private readonly _version      :string
    readonly commands     :TXtnCommand[]
    readonly settings     :TXtnCfgJSON

readonly dispose = ()=>{
    ß_trc&& ß_trc( 'Disposing', 'Runtime' );
    this.shadowDocsBfr.clear();
}

private _onDidCloseTextDocument = ( ü_anyDoc:TextDocument )=>{
    if ( ! ü_anyDoc.isClosed
      ||   ü_anyDoc.uri.scheme === CEUriScheme.file
       ) { return; }
    if ( this.shadowDocsBfr.has   ( ü_anyDoc ) )
       { this.shadowDocsBfr.delete( ü_anyDoc );
    ß_trc&& ß_trc( `Shadow ${ ü_anyDoc.fileName } was closed`, 'Runtime' );
       }
}

constructor(
    readonly vscContext   :ExtensionContext
){
    this.configApi = new ConfigHandler();
  //
    this.globalHistory =
      { admin  : new MementoFacade( this.vscContext, 'admin' , { version   : 0                 }, true )
      , config : new MementoFacade( this.vscContext, 'config', { executable: '', shadowDir: '' }, true )
      , dummy  : new MementoFacade( this.vscContext, 'dummy' , []                                      )
      };
    this.localHistory =
      { config : new MementoFacade( this.vscContext, 'config', { shadowDir: '' }, false )
      };
  //
    this.vscDisposables = this.vscContext.subscriptions
    this.extensionApi = this.vscContext.extension;// extensions.getExtension( CExtensionId )!;
  //
                 const ü_json = this.extensionApi.packageJSON;
    this._version    = ü_json.version;
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
                ß_trc&& ß_trc( `Command "${ ü_cmdId }" not implemented.` );
                continue;
        }
        this.vscDisposables.push(  commands.registerCommand( ü_cmdId, ü_cmdImpl )  );
    }
  //
      this.vscDisposables.push(             this
      , workspace.onDidChangeConfiguration( this.configApi.configModificationSignalled.bind( this.configApi ) )
      , workspace.onDidCloseTextDocument  ( this._onDidCloseTextDocument )
      );
  //
    this.whenReady = this._whenActivationFinalized();
}

private async _whenActivationFinalized():Promise<this> {
    try {
        const ü_dummy = this.globalHistory.dummy.dataRef;
        ß_trc&& ß_trc( ü_dummy, 'Dummy-History' );
              ü_dummy[0] = new Date().valueOf();
                        this.globalHistory.dummy.triggerCommit();
    } finally {}
  //
    const ü_admin = this.globalHistory.admin;
    ß_trc&& ß_trc( ü_admin.dataRef, 'Admin-History' );
  //ß_trc&& ß_trc( this.version, 'Admin-History' );
    const ü_current = this.version;
    if ( ü_current > ü_admin.dataRef.version ) {
      //
        ü_admin.dataRef.version = ü_current;
        this.globalHistory.admin.triggerCommit(); //whenCommitted();
      //
        ß_whenNewVersionInfoShown( this._version );
    }
    return this;
  //
}

get version():number {
               const ü_main = this._version.split('.');
                   //ü_main.pop();
    return parseInt( ü_main.join('') );
}

}

//====================================================================

async function ß_whenNewVersionInfoShown( ü_newVersion:string ):Promise<void> {
    const ü_show = await window.showInformationMessage( LCXtn.welcome( ü_newVersion ), LCXtn.delta() );
    switch ( ü_show ) {
        case undefined: break;
        default:
          whenUriOpened( CXtnWebUrl + '/changelog' );
    }
}

//====================================================================
/*
*/