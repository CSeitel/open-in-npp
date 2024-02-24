/*
*/
  import { type TFileUri
         } from '../types/vsc.fsUtil.d';
  import { CEVscCommands
         } from '../constants/vsc';
//--------------------------------------------------------------------
  import { Uri
         , commands
         , env
         } from 'vscode';
//--------------------------------------------------------------------
  import { ß_trc
         } from '../core/runtime';
  import { fileToUri
         , isContainedInWorkspace
         } from '../vsc/fsUtil';
//====================================================================

export async function whenShownInVscExplorer( ü_fileUri:TFileUri ):Promise<boolean> {
  //
    if ( isContainedInWorkspace( ü_fileUri = fileToUri( ü_fileUri ) ) ) {
      await commands.executeCommand( CEVscCommands.revealInExplorer, ü_fileUri );
             return true ;
    } else { return false; }
}

export async function whenShownInOSExplorer( ü_fileUri:TFileUri ):Promise<void> {
    await commands.executeCommand( CEVscCommands.revealFileInOS, fileToUri( ü_fileUri ) );
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

//====================================================================

export async function whenSettingsOpened( ü_prefix:string ):Promise<void> {
  //
    const ü_done = await commands.executeCommand<null>( CEVscCommands.openWbSettings, ü_prefix );
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
    await commands.executeCommand( CEVscCommands.vsCodeOpen, ü_realUri );
}

//====================================================================
/*
*/