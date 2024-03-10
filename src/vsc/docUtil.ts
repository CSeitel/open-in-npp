/*
*/
  import { type TextEditor
         , type TextDocumentContentProvider
         , type TextDocumentShowOptions,
         } from 'vscode';
  import { type TFileUri
         } from '../types/vsc.fsUtil.d';
  import { type TUntitled
         } from '../types/vsc.docUtil.d';
  import { CELanguageId
         } from '../constants/vsc';
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
  import { fileToUri
         } from '../vsc/fsUtil';
//====================================================================

export async function whenNewTextEditorOpened( ü_newDoc:TUntitled, ü_preview = false  ):Promise<TextEditor> {
  //
    const ü_doc = await workspace.openTextDocument( ü_newDoc );
                                           if ( ü_newDoc.language !== undefined )
    { languages.setTextDocumentLanguage( ü_doc, ü_newDoc.language ); }
  //
    const ü_opts:TextDocumentShowOptions =
      { preview: ü_preview
      };
  //const ü_edt = await window.showTextDocument( ü_doc, ßß_vsCode.ViewColumn.One, true );
    const ü_edt = await window.showTextDocument( ü_doc, ü_opts );
    return ü_edt;
  /*
    if ( ü_isUri && false
      && typeof( ü_text_.content ) === 'string'
       ) {
        ü_edt.edit(function( ü_a ){
            ü_a.insert( new Position(0,0), ü_text_.content! );
        }, { undoStopBefore:false, undoStopAfter:false } );
    }
  */
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

export class TextDocViewer extends Map<string,string> implements TextDocumentContentProvider {
    private _count = 1;
constructor(
    public  readonly  scheme:string
  , public  readonly  title :string
  , public  readonly  langId:string = CELanguageId.txt
){
    super();
    workspace.registerTextDocumentContentProvider( this.scheme, this );
}
async openNewDocument( ü_content:string, ü_title?:string ):Promise<TextEditor> {
    const ü_uri = this.createNewDocument( ü_content, ü_title );
    const ü_doc = await workspace.openTextDocument( ü_uri );
    languages.setTextDocumentLanguage( ü_doc, this. langId );
    const ü_opts:TextDocumentShowOptions =
      { preview:false
      };
  //const ü_edt = await window.showTextDocument( ü_doc, ViewColumn.One, true );
    const ü_edt = await window.showTextDocument( ü_doc, ü_opts );
    return ü_edt;
}

createNewDocument( ü_content:string, ü_title?:string ):Uri {
    if ( ü_title === undefined )
       { ü_title = this.title; }
        const ü_uri = Uri.parse( this.scheme +':'+ ü_title
                                             +` (${ this._count ++ })` );
    this.set( ü_uri.toString(), ü_content );
       return ü_uri;
}

provideTextDocumentContent( ü_uri:Uri ):string {
    const ü_id = ü_uri.toString();
    if ( ! this.has( ü_id ) ) {
        return '';
    }
  //
    const ü_content = this.get   ( ü_id )!;
                      this.delete( ü_id );
    return ü_content;
}
}

//====================================================================