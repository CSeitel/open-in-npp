/*
*/

//------------------------------------------------------------------------------

export const textIds = {
  exe_not_found : Symbol()
, exe_error     : Symbol()
, no_active_file: Symbol()
};

export function i18n( ü_id?:Symbol, ...args:string[] ):string {
  switch ( ü_id ) {
    case textIds.exe_not_found : return `Notepad++ executable not found: "${ arguments[1] }"`;
    case textIds.exe_error     : return `Executable "${ arguments[1] }" fails "${ arguments[2] }"`;
    case textIds.no_active_file: return `There is no active file`;
  }
  throw new Error( '' );
}

//export default i18n ;
//------------------------------------------------------------------------------