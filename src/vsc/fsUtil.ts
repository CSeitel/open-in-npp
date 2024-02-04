/*
*/
  import { type TFileUri
         } from '../types/vsc.fsUtil.d';
  import { type TVscFSErrorCodes
         , type TNodeFSErrorCodes
         } from '../types/error.d';
//--------------------------------------------------------------------
  import { CEFileType
         } from '../constants/vsc';
//--------------------------------------------------------------------
  import { promises as ßß_fs_p } from 'fs';
  import { FileType
         , FileStat
         , Uri
         , workspace
         } from 'vscode';
  import { expect
         } from '../lib/error';
//--------------------------------------------------------------------
  const ßß_fs = workspace.fs;
//====================================================================

export function ß_fileToUri( ü_path:TFileUri ):Uri {
    return           ü_path instanceof Uri
         ?           ü_path
         :   typeof( ü_path ) === 'string'
         ? Uri.file( ü_path )
         :           ü_path.uri
         ;
}

//====================================================================

export async function whenFileInfoRead( ü_fileUri:TFileUri ):Promise<FileStat|null> {
  //
    try {
        return await ßß_fs.stat(  ß_fileToUri( ü_fileUri ) );
    } catch ( ü_eX ) {
        return expect<TVscFSErrorCodes,null>( ü_eX, 'FileNotFound', null );
    }
}

export async function whenFileInfoRead_( ü_fileUri:TFileUri ):Promise<FileStat|null> {
    const ü_info = await whenFileInfoRead( ü_fileUri );
    if ( ü_info !== null
      && ( ü_info.type & FileType.SymbolicLink ) === FileType.SymbolicLink ) {
        try {
                                     const ü_real = await ßß_fs_p.realpath( ß_fileToUri( ü_fileUri ).fsPath );
            return await whenFileInfoRead( ü_real );
        } catch ( ü_eX ) {
            return expect<TNodeFSErrorCodes,null>( ü_eX, 'ELOOP', null );
        }
    }
        return ü_info;
}

//====================================================================

export async function whenFileTypeKnown( ü_fileUri:TFileUri ):Promise<CEFileType> {
    const ü_info = await whenFileInfoRead( ü_fileUri );
  //
    if ( ü_info === null ) { return CEFileType.Unknown; }
                             return ü_info.type as unknown as CEFileType;
}

//====================================================================