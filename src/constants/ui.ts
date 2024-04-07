/*
*/
  import { type TButton
         } from '../types/vsc.uiUtil.d'
//--------------------------------------------------------------------
  import { LCButtonText
         } from '../l10n/ui';
  import { LCButton
         } from '../l10n/i18n'
//====================================================================

export const CButton:Record<keyof typeof LCButtonText
                           |keyof typeof LCButton
                           |'selectShadowDir'
                            ,TButton> =
  { YES            : { text: LCButtonText.YES     }
  , NO             : { text: LCButtonText.NO      }
  , OK             : { text: LCButtonText.OK      }
  , CANCEL         : { text: LCButtonText.CANCEL  }
  , ALL            : { text: LCButton    .ALL     }
  , SELECT         : { text: LCButton    .SELECT  }
  , DETAILS        : { text: LCButton    .DETAILS }
  , selectShadowDir: { text: LCButton    .SELECT  }
  };

//====================================================================
/*
*/