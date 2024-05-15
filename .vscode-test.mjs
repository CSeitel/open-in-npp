/*
https://code.visualstudio.com/api/working-with-extensions/testing-extension
*/
  import { defineConfig } from '@vscode/test-cli';
/*
  require('out/test/vscode-test' );
  d.ß_cfg_1.mocha.timeout
  //, extensionDevelopmentPath: './src'
*/
//--------------------------------------------------------------------
//  IBaseTestConfiguration

  let ß_files = 'out/test/suite/**/vsc*.spec.js';
      ß_files = 'out/test/suite/all.spec.js';
  const ß_cfg_1 =
    { label: 'unitTests'
    , files: ß_files
  //, version: 'insiders'
  //
    , launchArgs     :       [ './etc/test/workspaceFolder/b b.txt' ]
    , workspaceFolder:  true ? './etc/test/workspaceFolder' //
                             : './etc/test/workspaces/folder.code-workspace'
  //
    , mocha:
	      { ui: 'tdd'
	      , timeout: 10 * 1000
        }
    };

//====================================================================
  export default defineConfig([ ß_cfg_1 ]);