/*
*/
  import { type FileStat
         } from 'vscode';
  import { type TFileUri
         } from '../types/vsc.fsUtil.d';
  import { type TVscFSErrorCodes
         , type TNodeFSErrorCodes
         } from '../types/error.d';
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
         } from '../lib/error';
//--------------------------------------------------------------------
  const ßß_fs = workspace.fs;
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
        return await ßß_fs.stat(  fileToUri( ü_fileUri ) );
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
    const ü_rawContent = await ßß_fs.readFile( fileToUri( ü_fileUri ) );
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