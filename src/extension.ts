/*
*/
  import * as ßß_vsCode from 'vscode';
//------------------------------------------------------------------------------
type TOpenInNpp =
  {
  }
export type TExtension = ßß_vsCode.Extension<TOpenInNpp>
//------------------------------------------------------------------------------
export const enum EExtensionIds
    { extensionFullName = 'CSeitel.open-in-npp'
  //
    , openInNppActive   = 'extension.openInNpp'
    , openInNppEditor  = 'extension.openInNppX'
    , openInNppExplorer = 'extension.openInNppY'
    , openNppSettings   =           'openInNpp.openSettings'
  //
    };
//==============================================================================

export default class ExtensionRuntime {
    static readonly developerTrace :false|typeof console.log = console.log;
    static          activeInstance :ExtensionRuntime //|null = null;
  //
    readonly GSDataApi    :ßß_vsCode.Memento
    readonly WSDataApi    :ßß_vsCode.Memento
    readonly extensionApi :TExtension

constructor(
    readonly context      :ßß_vsCode.ExtensionContext
){
    this.GSDataApi    = this.context.globalState    ;
    this.WSDataApi    = this.context.workspaceState ;
    this.extensionApi = ßß_vsCode.extensions.getExtension( EExtensionIds.extensionFullName )!;
  //
    ExtensionRuntime.activeInstance = this;
}

}

//------------------------------------------------------------------------------
  import { ß_executeCommand
         , CommandHandler
         } from './implementation';
  import { ConfigSnapshot
         } from './configHandler';
//==============================================================================

export function activate( ü_extnContext: ßß_vsCode.ExtensionContext ):void {
    new ExtensionRuntime( ü_extnContext );
  //
    ü_extnContext.subscriptions.push(
      ßß_vsCode.commands.registerCommand( EExtensionIds.openInNppActive  , CommandHandler.openInNppActive )
    , ßß_vsCode.commands.registerCommand( EExtensionIds.openInNppEditor  , CommandHandler.openInNppEditor )
    , ßß_vsCode.commands.registerCommand( EExtensionIds.openInNppExplorer,              ß_executeCommand  )
    , ßß_vsCode.commands.registerCommand( EExtensionIds.openNppSettings  , CommandHandler.openSettings    )
    );
  //
    ßß_vsCode.workspace.onDidChangeConfiguration( ConfigSnapshot.modificationSignalled );
}

export function deactivate():void {}

//==============================================================================
  //ü_disposable.dispose();
  //const ü_nls = process.env.VSCODE_NLS_CONFIG || '{}'; const ü_config = JSON.parse( ü_nls );
  //const ü_disposabl_ = ßß_vsCode.commands.registerTextEditorCommand( ß_IDs.openInNppActive, ß_a );
/*

async function ß_a( ü_editor: ßß_vsCode.TextEditor, ü_edit: ßß_vsCode.TextEditorEdit ) {
  const ü_selection = (() => {
  if ( ü_editor.selection.end.isAfter( ü_editor.selection.start ) ) {
                return ü_editor.selection;
  } else {
    const ü_lastLine = ü_editor.document.lineAt(ü_editor.document.lineCount - 1);
    return new ßß_vsCode.Selection(
             new ßß_vsCode.Position( 0, 0 )
           , new ßß_vsCode.Position( ü_lastLine.lineNumber, ü_lastLine.text.length )
                );
  }
        })();
  return ü_editor.edit( (builder) => {
            builder.replace(ü_selection, ü_editor.document.getText(ü_selection));
        });
}
*/