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
         , type TViewDoc
         , type IDisposableLike
         } from '../types/vsc.extension.d';
//--------------------------------------------------------------------
  import { type TXtnConfigJSON
         } from '../constants/extension';
  import { CExtensionUrl
         , CPrefix
         , CEXtnCommands
         , CXtnTxtScheme
         } from '../constants/extension';
//--------------------------------------------------------------------
  import { workspace
         , commands
         , window
         } from 'vscode';
  import { ß_trc
         , ß_toggleDevTrace
         } from '../runtime/context';
  import { configModificationSignalled
         , getConfigSnapshot
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
  import { TextDocViewer
         } from '../vsc/docUtil';
//====================================================================

export class XtnOpenInNpp {
    readonly whenActivated:Promise<this>
  //
    readonly showDetailsBuffer = new TextDocViewer( CXtnTxtScheme, 'Details' );
    readonly docViewsBuffer    = new Map<TextDocument,TViewDoc>();
    readonly disposables = [] as IDisposableLike[]
    readonly globalHistory:THistoryProxy
  //
    readonly extensionApi :Extension<XtnOpenInNpp>
    readonly version      :string
    readonly commands     :TExtensionCommand[]
    readonly settings     :TXtnConfigJSON

constructor(
    readonly vscContext   :ExtensionContext
){
    ß_trc&& ß_trc( 'Instance activated' );
  //console.dir( this.context.globalState );
    getConfigSnapshot().developerTrace || ß_toggleDevTrace();
  //
    this.globalHistory =
      { admin  : new MementoFacade( this.vscContext, 'admin' , { version   : 0  } )
      , config : new MementoFacade( this.vscContext, 'config', { executable: '' } )
      , dummy  : new MementoFacade( this.vscContext, 'dummy' , []                 )
      };
  //
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
            case CEXtnCommands.oSettings : ü_cmdImpl = whenSettingsOpened.bind( null, CPrefix ); break;
            case CEXtnCommands.oActive   : ü_cmdImpl = openInNppActive   ; break;
            case CEXtnCommands.oEditor   : ü_cmdImpl = openInNppEditor   ; break;
            case CEXtnCommands.oExplorer : ü_cmdImpl = openInNppExplorer ; break;
            default:
                console.error( `Command "${ ü_cmdId }" not implemented.` );
                continue;
        }
      this.vscContext.subscriptions.push(  commands.registerCommand( ü_cmdId, ü_cmdImpl )  );
    }
  //
      this.vscContext.subscriptions.push(
        workspace.onDidChangeConfiguration( configModificationSignalled        )
      , workspace.onDidCloseTextDocument  ( this._onDocViewClosed.bind( this ) )
      ,                          { dispose: this._dispose        .bind( this ) }
      );
  //
    this.whenActivated = this._whenActivationFinalized();
}

private _onDocViewClosed( ü_doc:TextDocument ):void {
    ß_trc&& ß_trc(  ü_doc.fileName  );
    this.docViewsBuffer.delete( ü_doc );
}

private _dispose():void {
    this.docViewsBuffer   .clear();
    this.showDetailsBuffer.clear();
    this.disposables.forEach( ü_disp => {
        try {
            ü_disp.dispose();
        } catch (error) {
        }
    });
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
          whenUriOpened( CExtensionUrl + '/changelog' );
    }
}
}

}

//====================================================================
/*
*/