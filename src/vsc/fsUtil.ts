/*
*/
  import { type FileStat
         } from 'vscode';
  import { type TFileUri
         } from '../types/vsc.fsUtil.d';
  import { type TVscFSErrorCodes
         , type TNodeFSErrorCodes
         } from '../types/lib.errorUtil.d';
//--------------------------------------------------------------------
  import { CEFileType
         } from '../constants/vsc';
//--------------------------------------------------------------------
  import { TextDecoder
         } from 'util';
  import { FileType
         , Uri
         , workspace
         , RelativePattern
         } from 'vscode';
  import { expect
         } from '../lib/errorUtil';
//--------------------------------------------------------------------
  export const CVscFs = workspace.fs;
//====================================================================

export function fileToUri( ü_path:TFileUri ):Uri {
    return           ü_path instanceof Uri
         ?           ü_path
         :   typeof( ü_path ) === 'string'
         ? Uri.file( ü_path )
         :           ü_path.uri
         ;
}

export function uriToFile( ü_uri:Uri ):string {
    return ü_uri.fsPath;
}

//====================================================================

export async function whenFileInfoRead( ü_fileUri:TFileUri ):Promise<FileStat|null> {
  //
    try {
        return await CVscFs.stat(  fileToUri( ü_fileUri ) );
    } catch ( ü_eX ) {
        return expect<TVscFSErrorCodes|TNodeFSErrorCodes,null>( ü_eX, 'FileNotFound', null ); // ['ELOOP','ENOENT'] realpath
    }
}

//====================================================================

export async function whenFileTypeKnown( ü_fileUri:TFileUri ):Promise<CEFileType> {
    const ü_info = await whenFileInfoRead( ü_fileUri );
  //
    return ü_info === null ? CEFileType.Unknown
                           : ü_info.type as unknown as CEFileType;
                           ;
}

export async function whenKnownAsFolder( ü_fileUri:TFileUri ):Promise<boolean> {
    const ü_info = await whenFileTypeKnown( ü_fileUri );
    return ( ü_info & FileType.Directory ) > 0;
}

export async function whenKnownAsFileOrFolder( ü_fileUri:TFileUri ):Promise<boolean> {
    const ü_info = await whenFileTypeKnown( ü_fileUri );
    return ( ü_info & (FileType.File|FileType.Directory) ) > 0;
}

//====================================================================

export async function whenTextFileRead( ü_fileUri:TFileUri ):Promise<string> {
  //
    const ü_rawContent = await CVscFs.readFile( fileToUri( ü_fileUri ) );
    return new TextDecoder().decode( ü_rawContent );
}

//====================================================================

export async function findFiles( ü_folder:string, ü_pattern:string ):Promise<string[]> {
    const ü_glob = new RelativePattern( ü_folder, ü_pattern );
    const ü_hits = await workspace.findFiles( ü_glob );
  //
    return ü_hits.map( uriToFile );
}

//====================================================================

export function toggleAsWorkspaceFolder( ü_folderUri:TFileUri ):number {
  //
    const ü_indx = findWorkspaceFolder( ü_folderUri = fileToUri( ü_folderUri ) );
    if ( ü_indx > -1 ) { // found
      return workspace.updateWorkspaceFolders( ü_indx, 1 ) // delete
           ? -1 -ü_indx
           : 0
           ;
    } else {
      const ü_indx = workspace.workspaceFolders === undefined
                   ? 0
                   : workspace.workspaceFolders.length
                   ;
      return workspace.updateWorkspaceFolders( ü_indx, null, { uri: ü_folderUri } ) // add
           ? 1 + ü_indx
           : 0
           ;
    }
}

export function findWorkspaceFolder( ü_folderUri:Uri ):number {
  //
   const ü_wsFolders = workspace.workspaceFolders;
    if ( ü_wsFolders        === undefined
      || ü_wsFolders.length === 0 ) { return -1; }
  //
                                                                        const ö_path = ü_folderUri.toString();
    return ü_wsFolders.findIndex( ü_wsFolder => ü_wsFolder.uri.toString() === ö_path );
}

export function isContainedInWorkspace( ü_fileUri:Uri ):boolean {
                          const ü_relative = workspace.asRelativePath( ü_fileUri, false );
    return ü_fileUri.fsPath !== ü_relative
        || findWorkspaceFolder( ü_fileUri ) > -1
         ;
}

//====================================================================
/*
*/