/*
*/
  import { type TFileUri
         } from '../types/vsc.fsUtil.d';
  import { EVscConstants
         } from '../constants/vsc';
//--------------------------------------------------------------------
  import { Uri
         , workspace
         , window
         , commands
         , env
         } from 'vscode';
//--------------------------------------------------------------------
  import { ß_trc
         } from '../core/runtime';
  import { fileToUri
         } from '../vsc/fsUtil';
//====================================================================

export async function whenSettingsOpened( ü_prefix:string ):Promise<void> {
  //
    const ü_done = await commands.executeCommand<null>( EVscConstants.openWbSettings, ü_prefix );
    try {
      //console.log( typeof( ü_done ) );
    } catch (error) {
      console.error( error );
    }
    //ß_trc&& ß_trc( typeof( ü_done ) + 'ttt' );
}

export async function whenUriOpened( ü_realUri:Uri|string ):Promise<void> {
    if (!( ü_realUri instanceof Uri ) ) { ü_realUri = Uri.parse( ü_realUri ); }
  //
    await commands.executeCommand( EVscConstants.vsCodeOpen, ü_realUri );
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

//==============================================================================

export async function whenShownInVscExplorer( ü_fileUri:TFileUri ):Promise<boolean> {
  //
    if ( isContainedInWorkspace( ü_fileUri = fileToUri( ü_fileUri ) ) ) {
      await commands.executeCommand( 'revealInExplorer', ü_fileUri );
             return true ;
    } else { return false; }
}

export async function whenShownInOSExplorer( ü_fileUri:TFileUri ):Promise<void> {
    await commands.executeCommand( 'revealFileInOS', fileToUri( ü_fileUri ) );
}

export async function whenOpenedInOSDefaultApp( ü_fileUri:TFileUri ):Promise<boolean> {
  //
    try {
      return env.openExternal( fileToUri( ü_fileUri ) );
    } catch ( ü_eX ) {
      console.error( (ü_eX as Error).message );
      return false;
    }
}

//==============================================================================