/*
*/
  import * as ßß_vsCode from 'vscode';
  import ßß_fs = ßß_vsCode.workspace.fs;
//==============================================================================

export async function isDirectory( ü_fileUri:ßß_vsCode.Uri ):Promise<boolean> {
  //
    const ü_stat = await ßß_fs.stat( ü_fileUri );
    return ü_stat.type === ßß_vsCode.FileType.Directory;
}

//------------------------------------------------------------------------------

export async function exists( ü_path:string, ü_andIsDirectory = false ):Promise<boolean> {
  //
    try {
      const ü_stat = await ßß_fs.stat( ßß_vsCode.Uri.file( ü_path ) );
      return ü_andIsDirectory
           ? ü_stat.type === ßß_vsCode.FileType.Directory
           : true
           ;
    } catch ( ü_eX ) {
      console.log( ü_eX );
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