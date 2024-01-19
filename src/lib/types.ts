/*
*/
//==============================================================================
  export type TFSError = Error &
  ( { code   : TNodeFSErrorCodes
    , errno  : number
    , syscall: string
    }
  | { code   : TVscFSErrorCodes
    }
  )
//------------------------------------------------------------------------------
  export type TNodeFSErrorCodes = 'ENOENT'
                                | 'ENOTDIR'
                                | 'EPERM'
                                | 'ENOTEMPTY'
  export type TVscFSErrorCodes  = 'FileNotFound'
//==============================================================================
/*
*/