/*
*/
  import { l10n
         } from 'vscode';
//====================================================================

  export const LCXtn =
    { welcome : ( _0:string           )=>l10n.t( 'Welcome to "Open-In-Notepad++" Version {0}', _0 )
    , delta   :                      ()=>l10n.t( 'What\'s new ?' )
    };

//--------------------------------------------------------------------

  export const LCDoIt =
    {
      spawn_error     : ( _0:string           )=>l10n.t( 'Notepad++ execution failed due to error: "{0}"'                       , _0    )
    , no_active_file  : (                     )=>l10n.t( 'There is no active file.'                                                     )
    , only_folders    : (                     )=>l10n.t( 'Only folders'                                                                 )
    , cwd_not_found   : ( _0:string           )=>l10n.t( 'Working directory not found: "{0}".'                                  , _0    )
    , file_hits       : ( _0:number,_1:string )=>l10n.t( '{0} files matching pattern "{1}" were found.'                         , _0,_1 )
    , max_items       : ( _0:number,_1:number )=>l10n.t( 'Overall {1} matching items were found. Only {0} items will be opened.', _0,_1 )
    , confirmSelection:                      ()=>l10n.t( 'Open in Notepad++'                                                            )
    , createShadow    : ( _0:string,_1:string )=>l10n.t( 'Save the contents of "{0}" as "{1}" and open it in Notepad++ ?'       , _0,_1 )
    , context         : ( _0:string           )=>l10n.t( 'When trying to open the file "{0}" in Notepad++'                      , _0    )
    };
  export const LCHeader =
    { selectShadowDir :                      ()=>l10n.t( 'Select folder for shadow copy creation'                                       )
    };

//--------------------------------------------------------------------

  export const LCConfig =
    { executable_Y    : ( _0:string           )=>l10n.t(        'Executable: "{0}"'                            , _0 )
    , noExeFile       : ( _0:string           )=>l10n.t( 'Not an executable file: "{0}"'                       , _0 )
    , workingDir_Y    : ( _0:string           )=>l10n.t(                    'Working Directory: "{0}"'         , _0 )
    , workingDir_N    : ( _0:string           )=>l10n.t( 'Unknown or invalid Working Directory: "{0}"'         , _0 )
    , virtualDocsDir_Y: ( _0:string           )=>l10n.t(                    'Virtual Documents Diretory: "{0}"', _0 )
    , virtualDocsDir_N: ( _0:string           )=>l10n.t( 'Unknown or invalid Virtual Documents Diretory: "{0}"', _0 )
    , noFolder        : ( _0:string,_1:string )=>l10n.t( 'Unknown or invalid directory: "{0}"'                 , _0 )
    , notAbsolute     : ( _0:string           )=>l10n.t( 'Relative path "{0}" cannot be checked.'              , _0 )
    };

//====================================================================
/*
*/