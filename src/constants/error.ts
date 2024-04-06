/*
*/
//--------------------------------------------------------------------
//====================================================================

  export const enum CEUiXMessageType {
      info    = 'i'
    , warning = 'w'
    , error   = 'e'
    }
  export const CUiXMessageTypeIcon:Record<'text'|'verified'
                                         ,Record<CEUiXMessageType,string>> =
    { text:
        { 'i': '\u24D8 ' // \u2139
        , 'w': '\u26A0 '
        , 'e': '\u26A1'
        }
    , verified:
        { 'i': '\u2705 '
        , 'w': '\u26A0 '
        , 'e': '\u274C '
        }
    };

//====================================================================

  export const enum CEUiXText {
      errorOccurred   = 'An exception occurred in the following situation'
    , reason          = 'As reason for the issue the following information has been provided'
    , callStack       = 'Call Stack'
    , context         = 'Context'
    , data            = 'Object'
    , isNotTypeError  = 'An exception occurred which is represented by the following object: {0}'
    }

//====================================================================
/*
*/