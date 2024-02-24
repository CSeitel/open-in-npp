/*
*/
  import { type TextEditor
         , type TextDocument
         , type TextDocumentShowOptions
         } from 'vscode';
  import { type TFileUri
         } from '../types/vsc.fsUtil.d';
  import { type TUntitled
         } from '../types/vsc.docUtil.d';
//--------------------------------------------------------------------
  import { Uri
         , workspace
         , window
         } from 'vscode';
//--------------------------------------------------------------------
  import { ß_trc
         } from '../core/runtime';
  import { fileToUri
         } from '../vsc/fsUtil';
//====================================================================

export async function whenNewTextEditorOpened( ü_text:TUntitled, ü_preview = false ):Promise<TextEditor> {
  //workspace.open
    const ü_doc = await workspace.openTextDocument( ü_text );
  //
    const ü_opts:TextDocumentShowOptions =
      { preview: ü_preview
      };
  //const ü_edt = await ßß_vsCode.window.showTextDocument( ü_doc, ßß_vsCode.ViewColumn.One, true );
    const ü_edt = await window.showTextDocument( ü_doc, ü_opts );
  //
    return ü_edt;
}

export async function whenTextEditorOpened( ü_fileUri:TFileUri, ü_preview = false, ü_languageId?:string ):Promise<TextEditor> {
  //
    const ü_opts:TextDocumentShowOptions =
      { preview: ü_preview
      };
  //
    const ü_doc = await workspace.openTextDocument( fileToUri( ü_fileUri ) );
  //const ü_edt = await ßß_vsCode.window.showTextDocument( ü_doc, ßß_vsCode.ViewColumn.One, true );
    const ü_edt = await window.showTextDocument( ü_doc, ü_opts );
  //
    return ü_edt;
}

//====================================================================