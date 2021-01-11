/*
*/
//==============================================================================
  export type TFSError = Error &
    { code   : EFSErrorCodes
    , errno  : number
    , syscall: string
    }
//------------------------------------------------------------------------------
  export const enum EFSErrorCodes
    { ENOENT    = 'ENOENT'
    , ENOTDIR   = 'ENOTDIR'
    , EPERM     = 'EPERM'
    , ENOTEMPTY = 'ENOTEMPTY'
    }
//==============================================================================
