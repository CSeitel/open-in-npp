/*
*/
  import { type ExtensionContext
         } from 'vscode';
  import { type TWritable
         } from '../types/generic.d';
  import { type IXtnRuntimeContext
         , type TProcessAbort
         , type TOutputTypeCode
         , type TOutputEncoder
         , type TOutputWriter
         , type TPathSeparator
         , type TLineSeparator
         } from '../types/runtime.context.d';
//--------------------------------------------------------------------
  import { CExtensionId
         } from '../constants/extension';
//--------------------------------------------------------------------
  import { extensions
         } from 'vscode';
//--------------------------------------------------------------------
  type TInitialRuntimeContext = TWritable<IXtnRuntimeContext>
  import * as ß_rtCntxt from './context';
         const ß_that           = ß_implement( ß_rtCntxt         .ß_RuntimeContext as TInitialRuntimeContext );
  export const ß_RuntimeContext = ß_that;
  export const ß_trc            =              ß_rtCntxt         .ß_trc;
//export const ß_trc            =            ( ß_rtCntxt as any ).ß_trc
//                              = ß_that.devTrace;
  import { XtnOpenInNpp
         } from '../core/runtime';
//====================================================================

function ß_implement( ü_rtCntxt:TInitialRuntimeContext ):IXtnRuntimeContext {
  //
    if ( ü_rtCntxt.typeCode === 'any' ) {
         ü_rtCntxt.typeCode   = 'xtn';
    //
    //ü_rtCntxt.writeStdOut = function( ü_text:string ):void { process.stdout.write( ü_text ); }
    }
    return ü_rtCntxt;
}

//====================================================================

export async function ß_whenActiveInstanceAvailable():Promise<XtnOpenInNpp> {
    const ü_eXtn = extensions.getExtension<XtnOpenInNpp>( CExtensionId )!;
    if ( ! ü_eXtn.isActive ) { await ü_eXtn.activate(); }
    return ü_eXtn.exports;
}

export async function ß_whenXtnActivated( ü_vscXtnContext:ExtensionContext ):Promise<XtnOpenInNpp> {
    if ( ß_RuntimeContext.activeInstance === undefined ) {
        (ß_RuntimeContext as TInitialRuntimeContext).activeInstance = await new XtnOpenInNpp( ü_vscXtnContext ).whenActivated;
    }
  //
      ß_trc&& ß_trc( 'Re-Activation' );
      if ( ß_RuntimeContext.activeInstance.context !== ü_vscXtnContext ) {
          ß_trc&& ß_trc( 'Re-Activation: new Context' );
      }
  //
    return ß_RuntimeContext.activeInstance;
}

//====================================================================
/*
*/