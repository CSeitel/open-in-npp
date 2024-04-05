/*
*/
//export const ß_trc      = './context';
//export     { ß_trc } from './context';
//Object.defineProperty(exports, "\u00DF_trc", { enumerable: true, get: function () { return context_1.ß_trc; } });
  import { type ExtensionContext
         } from 'vscode';
  import { type TWritable
         , type TNotReadonly
         } from '../types/generic.d';
  import { type IXtnRuntimeContext
         } from '../types/vsc.extension.d';
//--------------------------------------------------------------------
  import { CXtnId
         , CXtnTxtScheme
         } from '../constants/extension';
//--------------------------------------------------------------------
  import { extensions
         } from 'vscode';
//--------------------------------------------------------------------
  import { ß_RuntimeContext
         , ß_trc
         } from './context';
  import { LCHeader
         } from '../l10n/generic';
  import { getConfigSnapshot
         } from '../core/configContext';
  import { TextDocViewer
         } from '../vsc/docUtil';
  import { XtnStatusBarItem
         } from '../vsc/uiUtil';
//====================================================================
  type TInitialRuntimeContext = TWritable<IXtnRuntimeContext>
  export const ß_XtnOpenInNpp      = null as unknown as XtnOpenInNpp;
  export const ß_getConfigSnapshot = getConfigSnapshot;
  export const ß_StatusBarItem     = new XtnStatusBarItem();
  export const ß_ViewErrorDetails  = new TextDocViewer( CXtnTxtScheme, LCHeader.DETAILS() );
         const ß_that              = ß_implement( ß_RuntimeContext as TInitialRuntimeContext );
  import   XtnOpenInNpp
           from '../core/xtnOpenInNpp';
//====================================================================

function ß_implement( ü_rtCntxt:TInitialRuntimeContext ):IXtnRuntimeContext {
  //
    if ( ü_rtCntxt.typeCode === 'any' ) {
         ü_rtCntxt.typeCode    = 'xtn';
         ü_rtCntxt.tracePrefix = 'XTN';
      //
        ü_rtCntxt .xtnOpenInNpp = ß_XtnOpenInNpp ;
    }
    return ü_rtCntxt;
}

//====================================================================

export async function ß_whenXtnAvailable():Promise<XtnOpenInNpp> {
    const ü_eXtn = extensions.getExtension<XtnOpenInNpp>( CXtnId )!;
    if ( ! ü_eXtn.isActive ) { await ü_eXtn.activate(); }
    return ü_eXtn.exports;
}

export async function ß_whenXtnActivated( ü_vscXtnContext:ExtensionContext ):Promise<XtnOpenInNpp> {
    if ( ß_XtnOpenInNpp === null ) {
        ü_vscXtnContext.subscriptions.push( ß_ViewErrorDetails );
        (ß_XtnOpenInNpp as TNotReadonly<XtnOpenInNpp> ) = await new XtnOpenInNpp( ü_vscXtnContext ).whenReady;
    } else {
        if ( ß_XtnOpenInNpp.vscContext === ü_vscXtnContext )
             { ß_trc&& ß_trc( 'Old context', 'Re-Activation' ); }
        else { ß_trc&& ß_trc( 'New Context', 'Re-Activation' ); }
    }
  //
    return ß_XtnOpenInNpp;
}

//====================================================================
/*
*/