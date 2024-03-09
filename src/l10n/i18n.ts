/*
*/
  import { l10n
         } from 'vscode';
//==============================================================================
  export const LCXtn =
    { welcome : ( ü1:string )=>l10n.t( 'Welcome to "Open-In-Notepad++" Version ${ ü1 }', ü1 )
    , delta   :                       ()=>l10n.t( 'What\'s new ?' )
    , noFolder: ( ü1:string, ü2:string )=>l10n.t( 'Unknown or invalid ${ ü1 }: ${ ü2 } ', ü1, ü2 )
    };
//------------------------------------------------------------------------------
  export const LCDoIt =
    {
      exe_not_found : (   ü1:string                    )=>l10n.t( 'Notepad++ executable not found: "${ ü1 }"'                                    , ü1    )
    , spawn_error   : (   ü1:string                    )=>l10n.t( 'Notepad++ execution failed due to error: "${ ü1 }"'                           , ü1    )
    , no_active_file: (                                )=>l10n.t( 'There is no active file.'                                                             )
    , cwd_not_found : (   ü1:string                    )=>l10n.t( 'Working directory not found: "${ ü1 }".'                                      , ü1    )
    , file_hits     : (   ü1:number,ü2:string          )=>l10n.t( '${ ü1 } files matching pattern "${ ü2 }" were found.'                         , ü1,ü2 )
    , max_items     : (   ü1:number,ü2:number          )=>l10n.t( 'Overall ${ ü2 } matching files were found. Only ${ ü1 } file will be opened.' , ü1,ü2 )
    };
//------------------------------------------------------------------------------
  export const LCButton =
    { OK     : ()=>l10n.t( 'OK' )
    , ALL    : ()=>l10n.t( 'Open All' )
    , SELECT : ()=>l10n.t( 'Open a Subset' )
    , CANCEL : ()=>l10n.t( 'Cancel' )
    };
//==============================================================================
/*
*/