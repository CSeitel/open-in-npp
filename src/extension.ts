/*
*/
  import { type ExtensionContext
         } from 'vscode';
  import { type XtnOpenInNpp
         } from './types/vsc.extension.d';
//--------------------------------------------------------------------
  import {
         } from 'vscode';
  import { ß_trc
         } from './runtime/context';
  import { ß_whenXtnActivated
         } from './runtime/context-XTN';
//====================================================================

export async function activate( ü_vscXtnContext:ExtensionContext ):Promise<XtnOpenInNpp> {
    ß_trc&& ß_trc( 'Welcome to `Open In Notepad++`' );
    return ß_whenXtnActivated( ü_vscXtnContext );
}

export async function deactivate():Promise<void> {
    ß_trc&& ß_trc( 'De-activation' );
}

//====================================================================
/*
*/