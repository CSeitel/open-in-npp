/*
*/
  import { type TVscFSErrorCodes
         } from '../types/error.d';
  import { type TFileUri
         } from '../types/vsc.fsUtil.d';
  import * as ßß_vsCode from 'vscode';
  import * as ßß_util   from 'util';
  import { FileType
         , FileStat
         , Uri
         , commands
         } from 'vscode';
//------------------------------------------------------------------------------
  import { ß_trc
         } from '../core/runtime';
  import { fileToUri
         } from '../vsc/fsUtil';
//------------------------------------------------------------------------------
export const enum EVscConstants {
    openWbSettings  = 'workbench.action.openSettings'
  , vsCodeOpen      = 'vscode.open'
  }
//------------------------------------------------------------------------------
//==============================================================================
//ß0
//ß0============================================================================
//ß0

//ß1
//ß1============================================================================
//ß1
export function toggleAsWorkspaceFolder( ü_folderUri:TFileUri ):number {
  //
    const ü_indx = findWorkspaceFolder( ü_folderUri = fileToUri( ü_folderUri ) );
    if ( ü_indx > -1 ) { // found
      return ßß_vsCode.workspace.updateWorkspaceFolders( ü_indx, 1 ) // delete
           ? -1 -ü_indx
           : 0
           ;
    } else {
      const ü_indx = ßß_vsCode.workspace.workspaceFolders === undefined
                   ? 0
                   : ßß_vsCode.workspace.workspaceFolders.length
                   ;
      return ßß_vsCode.workspace.updateWorkspaceFolders( ü_indx, null, { uri: ü_folderUri } ) // add
           ? 1 + ü_indx
           : 0
           ;
    }
}

export function findWorkspaceFolder( ü_folderUri:ßß_vsCode.Uri ):number {
  //
   const ü_wsFolders = ßß_vsCode.workspace.workspaceFolders;
    if ( ü_wsFolders        === undefined
      || ü_wsFolders.length === 0 ) { return -1; }
  //
                                                                        const ö_path = ü_folderUri.toString();
    return ü_wsFolders.findIndex( ü_wsFolder => ü_wsFolder.uri.toString() === ö_path );
}

export function isContainedInWorkspace( ü_fileUri:Uri ):boolean {
//
                        const ü_relative = ßß_vsCode.workspace.asRelativePath( ü_fileUri, false );
  return ü_fileUri.fsPath !== ü_relative
      || findWorkspaceFolder( ü_fileUri ) > -1
       ;
}

//==============================================================================

export async function whenShownInVscExplorer( ü_fileUri:TFileUri ):Promise<boolean> {
  //
    if ( isContainedInWorkspace( ü_fileUri = fileToUri( ü_fileUri ) ) ) {
      await ßß_vsCode.commands.executeCommand( 'revealInExplorer', ü_fileUri );
             return true ;
    } else { return false; }
}

export async function whenShownInOSExplorer( ü_fileUri:TFileUri ):Promise<void> {
    await commands.executeCommand( 'revealFileInOS', fileToUri( ü_fileUri ) );
}

export async function whenUriOpened( ü_realUri:Uri|string ):Promise<void> {
    if (!( ü_realUri instanceof ßß_vsCode.Uri ) ) { ü_realUri = ßß_vsCode.Uri.parse( ü_realUri ); }
  //
    await commands.executeCommand( 'vscode.open', ü_realUri );
}

export async function whenOpenedInOSDefaultApp( ü_fileUri:TFileUri ):Promise<boolean> {
  //
    try {
      return ßß_vsCode.env.openExternal( fileToUri( ü_fileUri ) );
    } catch ( ü_eX ) {
      console.error( (ü_eX as Error).message );
      return false;
    }
}

export async function whenTextEditorOpened( ü_fileUri:ßß_vsCode.Uri | string, ü_preview = false, ü_languageId?:string ):Promise<ßß_vsCode.TextEditor> {
    if ( typeof( ü_fileUri ) === 'string' )
               { ü_fileUri = ßß_vsCode.Uri.file( ü_fileUri ); }
  //
    const ü_opts:ßß_vsCode.TextDocumentShowOptions =
      { preview: ü_preview
      };
  //
    const ü_doc = await ßß_vsCode.workspace.openTextDocument( ü_fileUri );
  //const ü_edt = await ßß_vsCode.window.showTextDocument( ü_doc, ßß_vsCode.ViewColumn.One, true );
    const ü_edt = await ßß_vsCode.window.showTextDocument( ü_doc, ü_opts );
  //
    return ü_edt;
}

//==============================================================================