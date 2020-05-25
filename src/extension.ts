/*
*/
  import * as ßß_vsCode from 'vscode';
//------------------------------------------------------------------------------
  import { ß_executeCommand
         , ß_openSettings
         } from './implementation';
  import { handleModification
         } from './configHandler';
//------------------------------------------------------------------------------
export const enum EExtensionIds
    { fullName         = 'CSeitel.open-in-npp'
    , openInNppActive  = 'extension.openInNpp'
    , openInNppContext = 'extension.openInNppX'
    , openNppSettings  =           'openInNpp.openSettings'
    , openWbSettings   = 'workbench.action.openSettings'
    };
//==============================================================================

export function activate( ü_extContext: ßß_vsCode.ExtensionContext ):void {
    const ü_ext = ßß_vsCode.extensions.getExtension( EExtensionIds.fullName )!;
  //
    ü_extContext.subscriptions.push(
      ßß_vsCode.commands.registerCommand( EExtensionIds.openInNppActive , ß_executeCommand )
    , ßß_vsCode.commands.registerCommand( EExtensionIds.openInNppContext, ß_executeCommand )
    , ßß_vsCode.commands.registerCommand( EExtensionIds.openNppSettings , ß_openSettings   )
    );
  //
    ßß_vsCode.workspace.onDidChangeConfiguration( handleModification );
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