/*
*/
  import { type ExtensionContext
         } from 'vscode';
  import { type XtnOpenInNpp
         } from '../core/runtime';
//--------------------------------------------------------------------
  export type TPathSeparator  = '/' |'\\'
  export type TLineSeparator  = '\n'|'\r\n'
//====================================================================
  export type TUnicodeReader  = (                moreThanAscii?:boolean )=>string
  export type TUnicodeWriter  = ( output:string, moreThanAscii?:boolean )=>void
  export type TInputReader    = ()=>string
  export type TOutputWriter   = ( output:string )=>void
  export type TDeveloperTrace =(( output:any    )=>void)|false
  export type TInputDecoder   = (  input:string )=>string
  export type TOutputEncoder  = ( output:string )=>string
  export type TOutputTypeCode = 'abort'
                              | 'trace'
                              | 'error'
                              | 'warn'
  export type TProcessAbort = ( this:void, reason  ?:any    )=>never
  export type TProcessExit  = ( this:void, exitCode :number )=>never

//====================================================================

  export interface IRuntimeContext<T extends object={}> {
      readonly typeCode    :'xtn'|'njs'|'any'
    //
      readonly pathSep:TPathSeparator
      readonly lineSep:TLineSeparator
    //
      readonly self       :this
      readonly globalThis :typeof globalThis & { ßRuntimeContext$ ?:IRuntimeContext }
      readonly globalData :T
    //
      readonly devTrace   :TDeveloperTrace
      readonly writeStdOut:TOutputWriter
  }

  export interface IXtnRuntimeContext extends IRuntimeContext<{}> {
      readonly xtnOpenInNpp:XtnOpenInNpp
  }

//====================================================================
/*
*/