/*
*/
  export type TMessageType = 'i'|'w'|'e'
  export interface IMessage {
      readonly type     :TMessageType
      readonly variables:string[]
      readonly text     :string
  }

//====================================================================
  export type TFSError = Error &
  ( { code   : TNodeFSErrorCodes
    , errno  : number
    , syscall: string
    }
  | { code   : TVscFSErrorCodes
    }
  )

//--------------------------------------------------------------------

  export type TNodeFSErrorCodes = 'ENOENT'
                                | 'ENOTDIR'
                                | 'EPERM'
                                | 'ELOOP'
                                | 'ENOTEMPTY'
  export type TVscFSErrorCodes  = 'FileNotFound'
                                | 'Unknown'
//====================================================================
/*
*/