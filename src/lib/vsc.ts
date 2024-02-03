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
         } from 'vscode';
  import { promises as ßß_fs_p } from 'fs';
//------------------------------------------------------------------------------
  const ßß_fs = ßß_vsCode.workspace.fs;
//------------------------------------------------------------------------------
  import { ß_trc
         } from '../core/runtime';
  import { ß_fileToUri
         , whenFileInfoRead
         } from '../vsc/fsUtil';
//------------------------------------------------------------------------------
export const enum EVscConstants {
    openWbSettings  = 'workbench.action.openSettings'
  , vsCodeOpen      = 'vscode.open'
  }
//------------------------------------------------------------------------------
//==============================================================================

function ß_fileUri( ü_file:string | { uri:Uri } ):Uri {
    return   typeof( ü_file ) === 'string'
         ? Uri.file( ü_file )
         :           ü_file.uri
         ;
}
//ß0
//ß0============================================================================
//ß0
//------------------------------------------------------------------------------

export async function whenFileTypeKnown( ü_fileUri:TFileUri ):Promise<FileType.Directory|FileType.File|FileType.Unknown> {
    if (!( ü_fileUri instanceof Uri ) ) { ü_fileUri = ß_fileUri( ü_fileUri ); }
  //
    const ü_stat = await whenFileInfoRead( ü_fileUri );
    if ( ü_stat === null ) {
      return FileType.Unknown;
    }
  //
    switch ( ü_stat.type ) {
      case FileType.Directory:
      case FileType.File     :
      case FileType.Unknown  : return ü_stat.type;
      case FileType.SymbolicLink:
      default: {
        const ü_real = await ßß_fs_p.realpath( ü_fileUri.fsPath );
        if(ß_trc){ß_trc( `"${ ü_real }"` );}
        const ü_next = await whenFileTypeKnown( ü_real );
        return ü_next;
      }
    }
}

export async function whenKnownAsFolder( ü_fileUri:TFileUri, ü_fileExists?:boolean ):Promise<boolean> {
    if (!( ü_fileUri instanceof ßß_vsCode.Uri ) ) { ü_fileUri = ß_fileUri( ü_fileUri ); }
  //
    const ü_stat = await whenFileInfoRead( ü_fileUri );
    if ( ü_stat === null ) {
      return false;
    }
  //
    switch ( ü_stat.type ) {
      case FileType.Directory: return true ;
      case FileType.File     :
      case FileType.Unknown  : return false;
      case FileType.SymbolicLink:
      default: {
        const ü_real = await ßß_fs_p.realpath( ü_fileUri.fsPath );
        if(ß_trc){ß_trc( `"${ ü_real }"` );}
        const ü_next = await whenKnownAsFolder( ü_real, false );
        return ü_next;
      }
    }
}

//==============================================================================

export async function whenTextFileRead( ü_fileUri:TFileUri ):Promise<string> {
    if (!( ü_fileUri instanceof ßß_vsCode.Uri ) ) { ü_fileUri = ß_fileUri( ü_fileUri ); }
  //
    const ü_rawContent = await ßß_fs.readFile( ü_fileUri );
    return new ßß_util.TextDecoder().decode( ü_rawContent );
}
//ß1
//ß1============================================================================
//ß1
export function toggleAsWorkspaceFolder( ü_folderUri:TFileUri ):number {
    if (!( ü_folderUri instanceof ßß_vsCode.Uri ) ) { ü_folderUri = ß_fileUri( ü_folderUri ); }
  //
    const ü_indx = findWorkspaceFolder( ü_folderUri );
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

export function isContainedInWorkspace( ü_fileUri:ßß_vsCode.Uri ):boolean {
//
                        const ü_relative = ßß_vsCode.workspace.asRelativePath( ü_fileUri, false );
  return ü_fileUri.fsPath !== ü_relative
      || findWorkspaceFolder( ü_fileUri ) > -1
       ;
}

//==============================================================================

export async function whenShownInVscExplorer( ü_fileUri:TFileUri ):Promise<boolean> {
    if (!( ü_fileUri instanceof ßß_vsCode.Uri ) ) { ü_fileUri = ß_fileUri( ü_fileUri ); }
  //
    if ( isContainedInWorkspace( ü_fileUri ) ) {
      await ßß_vsCode.commands.executeCommand( 'revealInExplorer', ü_fileUri );
             return true ;
    } else { return false; }
}

export async function whenShownInOSExplorer( ü_fileUri:TFileUri ):Promise<void> {
    if (!( ü_fileUri instanceof ßß_vsCode.Uri ) ) { ü_fileUri = ß_fileUri( ü_fileUri ); }
  //
    await ßß_vsCode.commands.executeCommand( 'revealFileInOS', ü_fileUri );
}

export async function whenUriOpened( ü_realUri:Uri|string ):Promise<void> {
    if (!( ü_realUri instanceof ßß_vsCode.Uri ) ) { ü_realUri = ßß_vsCode.Uri.parse( ü_realUri ); }
  //
    await ßß_vsCode.commands.executeCommand( 'vscode.open', ü_realUri );
}

export async function whenOpenedInOSDefaultApp( ü_fileUri:TFileUri ):Promise<boolean> {
    if (!( ü_fileUri instanceof ßß_vsCode.Uri ) ) { ü_fileUri = ß_fileUri( ü_fileUri ); }
  //
    try {
      return ßß_vsCode.env.openExternal( ü_fileUri );
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

export async function isDirectory( ü_fileUri:Uri|string ):Promise<boolean> {
  //
    ü_fileUri =   typeof( ü_fileUri ) === 'string'
              ? Uri.file( ü_fileUri )
              :           ü_fileUri
              ;
  //
    try {
      const ü_stat = await ßß_fs.stat( ü_fileUri );
      return ü_stat.type === ßß_vsCode.FileType.Directory;
    } catch ( ü_eX ) {
      console.error( ü_eX );
      throw ü_eX;
    }
}

//------------------------------------------------------------------------------

export async function exists( ü_path:string, ü_andIsDirectory?:boolean ):Promise<boolean> {
  //
    try {
      const ü_stat = await ßß_fs.stat( Uri.file( ü_path ) );
      return ü_andIsDirectory === undefined
           ? true
           : ü_andIsDirectory
             ? ü_stat.type === FileType.Directory
             : ü_stat.type !== FileType.Directory
           ;
    } catch ( ü_eX ) {
      if(ß_trc){ß_trc( (ü_eX as Error).message );}
      return false;
    }
}

//==============================================================================

export async function findFiles( ü_folder:string, ü_pattern:string ):Promise<string[]> {
    const ü_glob = new ßß_vsCode.RelativePattern( ü_folder, ü_pattern );
    const ü_hits = await ßß_vsCode.workspace.findFiles( ü_glob );
  //
    return ü_hits.map( ü_fileUri => ü_fileUri.fsPath );
}

//==============================================================================