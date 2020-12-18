/*
*/
//==============================================================================

//------------------------------------------------------------------------------
//const i18n =
export default
  {
    exe_not_found : (ü1:string                    ) => `Notepad++ executable not found: "${ ü1 }"`
  , spawn_error   : (ü1:string                    ) => `Notepad++ execution failed due to error: "${ ü1 }"`
  , no_active_file: (                             ) => `There is no active file.`
  , cwd_not_found : (ü1:string                    ) => `Working directory not found: "${ ü1 }"`
  , file_hits     : (ü1:number,ü2:string,ü3:string) => `${ ü1 || 'No' } files match pattern "${ ü2 }" within folder "${ ü3 }"`
  , max_items     : (ü1:number,ü2:number          ) => `Only ${ ü1 } items ${ ü2 }`
  }
//------------------------------------------------------------------------------
  export const EButtons =
    { OK     : () => 'OK'
    , ALL    : () => 'Open all'
    , CANCEL : () => 'Cancel'
    };
//==============================================================================
/*
*/