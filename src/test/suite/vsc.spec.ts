import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';
  import { whenDelay
         , LockHandler
         } from '../../lib/asyncUtil';
//--------------------------------------------------------------------
  const ß_tests =
    {
    };

//====================================================================

suite('Extension Test Suite', async function (){
  this.timeout();
  vscode.window.showInformationMessage('Start all tests.');
//vscode.window.

test('Sample test', async (  ) => {
    await whenDelay( 1000 );
    await vscode.window.showInformationMessage('Done');
  //assert.strictEqual(-1, [1, 2, 3].indexOf(5));
  //assert.strictEqual(-1, [1, 2, 3].indexOf(0));
    assert.strictEqual( 1, 1 );
	  try { } finally { }
  //return Promise.resolve( true );
});

after(()=>{
  vscode.window.showInformationMessage('All Done');
});

});

//====================================================================
/*
*/