/*
*/

//------------------------------------------------------------------------------

export const enum textIds
  { cmd_error
  , exe_not_found
  , cwd_not_found
  , no_active_file
  , file_hits
  };

export function i18n( ü_id?:textIds, ü_arg1?:any, ü_arg2?:any, ü_arg3?:any ):string {
  switch ( ü_id ) {
    case textIds.exe_not_found : return `Notepad++ executable not found: "${ ü_arg1 }"`;
    case textIds.cmd_error     : return `Notepad++ execution failed due to error: "${ ü_arg1 }"`;
    case textIds.no_active_file: return `There is no active file.`;
    case textIds.cwd_not_found : return `Working directory not found: "${ ü_arg1 }"`;
    case textIds.file_hits     : return `${ ü_arg1 || 'No' } files match pattern "${ ü_arg2 }" within folder "${ ü_arg3 }"`;
  }
  throw new Error( '' );
}

//export default i18n ;
//------------------------------------------------------------------------------