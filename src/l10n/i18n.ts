/*
*/
  import { l10n
         } from 'vscode';
//==============================================================================
  export const LCXtn =
    { welcome : ( _0:string           )=>l10n.t( 'Welcome to "Open-In-Notepad++" Version {0}', _0 )
    , delta   :                      ()=>l10n.t( 'What\'s new ?' )
    };
  export const LCConfig =
    { executable    : ( _0:string           )=>l10n.t( 'Executable "{0}"'                , _0    )
    , workingDir    : ( _0:string           )=>l10n.t( 'Working Directory "{0}"'         , _0    )
    , virtualDocsDir: ( _0:string           )=>l10n.t( 'Virtual Documents Diretory "{0}"', _0    )
    , noFolder      : ( _0:string,_1:string )=>l10n.t( 'Unknown or invalid {0}: "{1}"'   , _0,_1 )
    , noExeFile     : ( _0:string           )=>l10n.t( 'Not an executable file: "{0}"'   , _0    )
    };
//------------------------------------------------------------------------------
  export const LCDoIt =
    {
      exe_not_found : ( _0:string           )=>l10n.t( 'Notepad++ executable not found: "{0}"'                                , _0    )
    , spawn_error   : ( _0:string           )=>l10n.t( 'Notepad++ execution failed due to error: "{0}"'                       , _0    )
    , no_active_file: (                     )=>l10n.t( 'There is no active file.'                                                     )
    , cwd_not_found : ( _0:string           )=>l10n.t( 'Working directory not found: "{0}".'                                  , _0    )
    , file_hits     : ( _0:number,_1:string )=>l10n.t( '{0} files matching pattern "{1}" were found.'                         , _0,_1 )
    , max_items     : ( _0:number,_1:number )=>l10n.t( 'Overall {1} matching files were found. Only {0} file will be opened.' , _0,_1 )
    , createShadow  : ( _0:string,_1:string )=>l10n.t( 'Save the contents of "{0}" as "{1}" and open it in Notepad++ ?'       , _0,_1 )
    };
//------------------------------------------------------------------------------
  export const LCButton =
    { YES    : ()=>l10n.t( 'Yes' )
    , NO     : ()=>l10n.t( 'No' )
    , OK     : ()=>l10n.t( 'OK' )
    , ALL    : ()=>l10n.t( 'Open All' )
    , SELECT : ()=>l10n.t( 'Open a Subset' )
    , CANCEL : ()=>l10n.t( 'Cancel' )
    , DETAILS: ()=>l10n.t( 'Show Details' )
    };
//==============================================================================
/*
*/