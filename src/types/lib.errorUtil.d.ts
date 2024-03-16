/*
*/
  import { type CEUiXMessageType
         } from '../constants/error';
//====================================================================
  export type TUiXMessageType = CEUiXMessageType

  export interface IUiXMessage<R=any> {
      readonly type     :CEUiXMessageType
      readonly text     :string
      readonly context ?:string
      readonly reason  ?:R
  }
  export interface IExpandUiXMessageVars {
      ( ...vars:any[] ):string
  }
  export type TUiXMessageTemplate = string|IExpandUiXMessageVars

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