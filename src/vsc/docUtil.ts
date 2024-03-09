/*
*/
  import { type TextEditor
         , type TextDocument
         , type TextDocumentShowOptions,
         } from 'vscode';
  import { type TFileUri
         } from '../types/vsc.fsUtil.d';
  import { type TUntitled
         } from '../types/vsc.docUtil.d';
  import { CELanguageId
         } from '../constants/vsc';
  import { CXtnTxtScheme
         } from '../constants/extension';
//--------------------------------------------------------------------
  import { Uri
         , workspace
         , window
         , languages
         , Position
         } from 'vscode';
//--------------------------------------------------------------------
  import { ß_trc
         } from '../runtime/context';
  import { ß_XtnOpenInNpp
         } from '../runtime/context-XTN';
  import { fileToUri
         } from '../vsc/fsUtil';
//====================================================================

//export async function whenNewTextEditorOpened( ü_text :          string, ü_preview?:boolean ):Promise<TextEditor>
//export async function whenNewTextEditorOpened( ü_text :TUntitled       , ü_preview?:boolean ):Promise<TextEditor>
export async function whenNewTextEditorOpened( ü_text_:TUntitled, ü_preview = false  ):Promise<TextEditor> {
    let ü_uri:Uri
    const ü_isUri = typeof( ü_text_.title ) === 'string';
    if ( ü_isUri ) {
        ü_uri = ß_XtnOpenInNpp.echoTextBuffer.createNewDocument( ü_text_.title!
                                                               , ü_text_.content ?? '' );
    }
  //
    const ü_doc = await workspace.openTextDocument( ü_isUri
                                                  ? ü_uri!
                                                  : ü_text_ as any
                                                  );
    if ( ü_isUri ) {
      //ü_doc.languageId = 
        languages.setTextDocumentLanguage( ü_doc, ü_text_.language ?? CELanguageId.txt );
    }
  //
    const ü_opts:TextDocumentShowOptions =
      { preview: ü_preview
      };
  //const ü_edt = await ßß_vsCode.window.showTextDocument( ü_doc, ßß_vsCode.ViewColumn.One, true );
    const ü_edt = await window.showTextDocument( ü_doc, ü_opts );
    if ( ü_isUri && false
      && typeof( ü_text_.content ) === 'string'
       ) {
        ü_edt.edit(function( ü_a ){
            ü_a.insert( new Position(0,0), ü_text_.content! );
        }, { undoStopBefore:false, undoStopAfter:false } );
    }
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