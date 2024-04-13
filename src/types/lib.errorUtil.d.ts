/*
*/
  import { type CEUiXMessageType
         } from '../constants/error';
//====================================================================
  export type TUiXMessageType = CEUiXMessageType

  export interface IUiXMessage {
      readonly type:CEUiXMessageType
      readonly text:string
  }
  export interface IEnhancedUiXMessage<R=any> extends IUiXMessage {
      readonly context ?:string
      readonly reason  ?:R
  }
  export interface IExpandUiXMessageVars {
      ( ...vars:any[] ):string
  }

  export type TTextTemplate       = string
  export type TUiXMessageTemplate = TTextTemplate|IExpandUiXMessageVars

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