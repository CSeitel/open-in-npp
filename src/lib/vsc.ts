/*
*/
  import * as ßß_vsCode from 'vscode';
  import ßß_fs = ßß_vsCode.workspace.fs;
//------------------------------------------------------------------------------
  import   ExtensionRuntime
           from '../extension';
  const ß_trc = ExtensionRuntime.developerTrace;
//------------------------------------------------------------------------------
export const enum EVscConstants {
    openWbSettings  = 'workbench.action.openSettings'
  , vsCodeOpen      = 'vscode.open'
  }
//==============================================================================

export async function whenUriOpened( ü_url:string ):Promise<void> {
    await ßß_vsCode.commands.executeCommand( EVscConstants.vsCodeOpen, ßß_vsCode.Uri.parse( ü_url ) );
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

export async function isDirectory( ü_fileUri:ßß_vsCode.Uri|string ):Promise<boolean> {
  //
    ü_fileUri =             typeof( ü_fileUri ) === 'string'
              ? ßß_vsCode.Uri.file( ü_fileUri )
              :                     ü_fileUri
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

//==============================================================================

export async function findFiles( ü_folder:string, ü_pattern:string ):Promise<string[]> {
    const ü_glob = new ßß_vsCode.RelativePattern( ü_folder, ü_pattern );
    const ü_hits = await ßß_vsCode.workspace.findFiles( ü_glob );
  //
    return ü_hits.map( ü_fileUri => ü_fileUri.fsPath );
}

//==============================================================================