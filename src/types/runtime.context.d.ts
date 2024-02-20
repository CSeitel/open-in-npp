/*
*/
//--------------------------------------------------------------------
  export type TPathSeparator  = '/' |'\\'
  export type TLineSeparator  = '\n'|'\r\n'
  export type TOutputWriter   = ( output:string )=>void
  export type TDeveloperTrace = TOutputWriter|false
//====================================================================

  export interface IRuntimeContext<T extends object={}> {
    //
      readonly pathSep:TPathSeparator
      readonly lineSep:TLineSeparator
    //
      readonly globalData:T
      readonly devTrace:TDeveloperTrace
  }

//====================================================================
/*
*/