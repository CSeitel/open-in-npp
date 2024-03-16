/*
*/
  import { type TWritable
         , type TNotReadonly
         } from '../types/generic.d';
  import { type IRuntimeContext
         , type TDeveloperTrace
         } from '../types/runtime.context.d';
//--------------------------------------------------------------------
  import { sep
         } from 'path';
  import { format
         } from 'util';
//====================================================================
  
  type TInitialRuntimeContext = TWritable<IRuntimeContext>
         const ß_that           = ß_implement( {} as TInitialRuntimeContext );
  export const ß_RuntimeContext = ß_that;
//====================================================================

function ß_implement( ü_rtCntxt:TInitialRuntimeContext ):IRuntimeContext {
    ü_rtCntxt. typeCode = 'any';
    ü_rtCntxt. pathSep  = sep;
    ü_rtCntxt. lineSep  = sep === '/'
                        ?   '\n'
                        : '\r\n';

    ü_rtCntxt. self       = ü_rtCntxt  ;
    ü_rtCntxt. globalThis = globalThis ;
    ü_rtCntxt. globalData = {}         ;

    ü_rtCntxt. devTrace    = ß_trc         ;
    ü_rtCntxt. writeStdOut = ß_writeStdOut ;
  //
    return ü_rtCntxt;
}

//====================================================================

export const ß_trc:IRuntimeContext['devTrace'] = function( ü_text:any, ü_intro?:string ):void {
    if ( typeof(ü_intro) === 'string' ) { console.log( 'TST-%s: %o', ü_intro, ü_text ); }
    else                                { console.log(    'TST: %o',          ü_text ); }
}

export function ß_stringify( ü_oref:any ):string {
    return format( '%o', ü_oref );
}

export function ß_writeStdOut( ü_text:string ):void {
    process.stdout.write( ü_text + ß_that.lineSep );
}

export function ß_toggleDevTrace():void {
    ( ß_trc as TInitialRuntimeContext['devTrace'] ) = ß_trc ? false : ß_that.devTrace;
}

//====================================================================
/*
*/