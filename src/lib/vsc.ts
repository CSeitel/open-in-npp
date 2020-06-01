/*
*/
  import * as ßß_vsCode from 'vscode';
  import ßß_fs = ßß_vsCode.workspace.fs;
  import { runtime
         } from '../extension';
  const ß_trc = runtime.trace;
//==============================================================================

export async function isDirectory( ü_fileUri:ßß_vsCode.Uri ):Promise<boolean> {
  //
    const ü_stat = await ßß_fs.stat( ü_fileUri );
    return ü_stat.type === ßß_vsCode.FileType.Directory;
}

//------------------------------------------------------------------------------

export async function exists( ü_path:string, ü_andIsDirectory?:boolean ):Promise<boolean> {
  //
    try {
      const ü_stat = await ßß_fs.stat( ßß_vsCode.Uri.file( ü_path ) );
      return ü_andIsDirectory === undefined
           ? true
           : ü_andIsDirectory
             ? ü_stat.type === ßß_vsCode.FileType.Directory
             : ü_stat.type !== ßß_vsCode.FileType.Directory
           ;
    } catch ( ü_eX ) {
      if(ß_trc){ß_trc( ü_eX.message );}
      return false;
    }
}

//------------------------------------------------------------------------------

export async function findFiles( ü_folder:string, ü_pattern:string ):Promise<string[]> {
    const ü_glob = new ßß_vsCode.RelativePattern( ü_folder, ü_pattern );
    const ü_hits = await ßß_vsCode.workspace.findFiles( ü_glob );
  //
    return ü_hits.map( ü_fileUri => ü_fileUri.fsPath );
}

//==============================================================================