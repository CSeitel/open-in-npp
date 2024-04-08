/*
*/
  import { type TButton
         } from '../types/vsc.uiUtil.d'
//--------------------------------------------------------------------
  import { l10n
         } from 'vscode';
//====================================================================

  const LCButtonText =
    { YES    : ()=>l10n.t( 'Yes' )
    , NO     : ()=>l10n.t( 'No' )
    , OK     : ()=>l10n.t( 'OK' )
    , CANCEL : ()=>l10n.t( 'Cancel' )
    };

//====================================================================

export const CButton =
  { YES            : { text: LCButtonText    .YES     } as TButton
  , NO             : { text: LCButtonText    .NO      } as TButton
  , OK             : { text: LCButtonText    .OK      } as TButton
  , CANCEL         : { text: LCButtonText    .CANCEL  } as TButton

  , selectAll      : { text:()=>l10n.t( 'Open All'      ) } as TButton
  , selectFiles    : { text:()=>l10n.t( 'Open a Subset' ) } as TButton
  , showDetails    : { text:()=>l10n.t( 'Show Details'  ) } as TButton
  , selectShadowDir: { text:()=>l10n.t( 'Select Folder' ) } as TButton
  };

//====================================================================
/*
*/