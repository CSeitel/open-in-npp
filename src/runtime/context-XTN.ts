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
  import { ß_RuntimeContext as ß_rtCntxt
         , ß_trc
         } from './context';
  import { LCHeader
         } from '../l10n/generic';
  import { TextDocViewer
         } from '../vsc/docUtil';
  import { XtnStatusBarItem
         } from '../vsc/uiUtil';
  import   XtnOpenInNpp
           from '../core/xtnOpenInNpp';
//====================================================================
  type TInitialRuntimeContext = TWritable<IXtnRuntimeContext>
  export const ß_XtnOpenInNpp   = null as unknown as XtnOpenInNpp;
         const ß_that           = ß_implement( ß_rtCntxt as TInitialRuntimeContext );
  export const ß_RuntimeContext = ß_that;
//--------------------------------------------------------------------
// post-export imports ?
//====================================================================

function ß_implement( ü_rtCntxt:TInitialRuntimeContext ):IXtnRuntimeContext {
  //
    if ( ü_rtCntxt.typeCode === 'any' ) {
         ü_rtCntxt.typeCode    = 'xtn';
         ü_rtCntxt.tracePrefix = 'XTN';
      //
        ü_rtCntxt .statusBarItem    = new XtnStatusBarItem();
        ü_rtCntxt .viewErrorDetails = new TextDocViewer( CXtnTxtScheme, LCHeader.DETAILS() );
    }
    return ü_rtCntxt;
}

//====================================================================

export async function ß_whenXtnActivated_Internal( ü_vscXtnContext:ExtensionContext ):Promise<XtnOpenInNpp> {
    if ( ß_XtnOpenInNpp === null ) {
        ü_vscXtnContext.subscriptions.push( ß_that.viewErrorDetails );
                       (ß_XtnOpenInNpp as TNotReadonly<XtnOpenInNpp> ) = await new XtnOpenInNpp( ü_vscXtnContext ).whenReady;
        ß_trc&& ß_trc( (ß_XtnOpenInNpp as any                        ) instanceof XtnOpenInNpp, 'Activation-Done' );
    } else {
        if ( ß_XtnOpenInNpp.vscContext === ü_vscXtnContext )
             { ß_trc&& ß_trc( 'Old context', 'Re-Activation' ); }
        else { ß_trc&& ß_trc( 'New Context', 'Re-Activation' ); }
    }
  //
    return ß_XtnOpenInNpp;
}

export async function ß_whenXtnActivated_External():Promise<XtnOpenInNpp> {
    const ü_eXtn = extensions.getExtension<XtnOpenInNpp>( CXtnId )!;
    const ü_isActive = ü_eXtn.isActive;
              ß_trc&& ß_trc( `Is active = ${ ü_isActive }`, 'External-Activation-Request' );
    if ( ! ü_isActive ) {
        await ü_eXtn.activate();
    }
    return ü_eXtn.exports;
}

//====================================================================
/*
*/