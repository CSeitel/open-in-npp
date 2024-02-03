
  import { type Uri
         , type FileType
         } from 'vscode';
  export type TFileUri = string | Uri | { uri:Uri }
  export type TFileType = FileType | 66