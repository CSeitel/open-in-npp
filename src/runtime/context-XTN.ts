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
         , type TDeveloperTrace
         } from '../types/runtime.context.d';
  type TInitialRuntimeContext = TWritable<IXtnRuntimeContext>
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
         } from '../core/gui';
//====================================================================
  export const ß_XtnOpenInNpp      = null as unknown as XtnOpenInNpp;
  export const ß_getConfigSnapshot = getConfigSnapshot;
  export const ß_StatusBarItem     = new XtnStatusBarItem();
  export const ß_ViewErrorDetails  = new TextDocViewer( CXtnTxtScheme, LCHeader.DETAILS() );
         const ß_that              = ß_implement( ß_RuntimeContext as TInitialRuntimeContext );
  import { XtnOpenInNpp
         } from '../core/runtime';
//====================================================================

function ß_implement( ü_rtCntxt:TInitialRuntimeContext ):IXtnRuntimeContext {
  //
    if ( ü_rtCntxt.typeCode === 'any' ) {
         ü_rtCntxt.typeCode    = 'xtn';
         ü_rtCntxt.tracePrefix = 'Xtn';
      //
      //ü_rtCntxt .devTrace     = ( ß_trc as TNotReadonly<TDeveloperTrace> ) =   ß_devTrace   ;
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
    }
  //
    //ß_trc&& ß_trc( 'Re-Activation' );
      if ( ß_XtnOpenInNpp.vscContext !== ü_vscXtnContext ) {
        //ß_trc&& ß_trc( 'Re-Activation: new Context' );
      }
  //
    return ß_XtnOpenInNpp;
}

//====================================================================
/*
*/