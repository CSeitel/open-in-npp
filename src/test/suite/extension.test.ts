import * as assert from 'assert';

import * as ßß_vscode from 'vscode';
// import * as myExtension from '../extension';

suite('Extension Test Suite', () => {
  ßß_vscode.window.showInformationMessage('Start all tests.');

  test('Sample test', () => {
console.log();
assert.equal(-1, [1, 2, 3].indexOf(5));
assert.equal(-1, [1, 2, 3].indexOf(0));
  });
});