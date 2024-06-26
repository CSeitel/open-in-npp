/*
*/
  import { type ExtensionContext
         } from 'vscode';
  import { type XtnOpenInNpp
         } from './types/vsc.extension.d';
//--------------------------------------------------------------------
  import { ß_trc
         } from './runtime/context';
  import { ß_whenXtnActivated_Internal
         } from './runtime/context-XTN';
//====================================================================

export async function deactivate()                                  :Promise<void>         { ß_trc&& ß_trc( 'Bye!'                           , 'Deactivation' ); }
export async function   activate( ü_vscXtnContext:ExtensionContext ):Promise<XtnOpenInNpp> { ß_trc&& ß_trc( 'Welcome to `Open In Notepad++`!',   'Activation' );
    return ß_whenXtnActivated_Internal( ü_vscXtnContext );
}

//====================================================================
/*
*/