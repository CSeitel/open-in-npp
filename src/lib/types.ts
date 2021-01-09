/*
*/
//------------------------------------------------------------------------------
  export type TFSError = Error &
    { code   : ESystemErrorCodes
    , errno  : number
    , syscall: string
    }
//==============================================================================

  export const enum ESystemErrorCodes
    { ENOENT    = 'ENOENT'
    , ENOTDIR   = 'ENOTDIR'
    , EPERM     = 'EPERM'
    , ENOTEMPTY = 'ENOTEMPTY'
    }

//==============================================================================
