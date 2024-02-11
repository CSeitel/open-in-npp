/*
*/
  import { type ExtensionContext
         } from 'vscode';
  import { type TOpenInNpp
         } from './types/runtime';
//--------------------------------------------------------------------
  import {
         } from 'vscode';
  import { ß_RuntimeContext
         , ß_trc
         } from './core/runtime';
//====================================================================

export async function activate( ü_extnContext:ExtensionContext ):Promise<TOpenInNpp> {
    ß_trc&& ß_trc( 'Activation' );
    return ß_RuntimeContext.activate( ü_extnContext );
}

export async function deactivate():Promise<void> {
    ß_trc&& ß_trc( 'De-activation' );
  /*
    const ü_hist = ß_RuntimeContext.activeInstance.globalHistory;
    ü_hist.dummy = [ Date.now() ];
    await ü_hist.whenCommitted();
    if(ß_trc){ß_trc( `Deactivation` );}
  */
}

//====================================================================
/*
*/