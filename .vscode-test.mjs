/*
https://code.visualstudio.com/api/working-with-extensions/testing-extension
*/
  import { defineConfig } from '@vscode/test-cli';
/*
  require('out/test/vscode-test' );
  d.ß_cfg_1.mocha.timeout
*/
//--------------------------------------------------------------------

  let ß_files = 'out/test/suite/**/vsc*.spec.js';
      ß_files = 'out/test/suite/all.spec.js';
  const ß_cfg_1 =
    { label: 'unitTests'
    , files: ß_files
  //, version: 'insiders'
    , workspaceFolder: './etc/test/workspaceFolder'
  //, extensionDevelopmentPath: './src'
    , mocha:
	      { ui: 'tdd'
	      , timeout: 10 * 1000
        }
    };

//====================================================================
  export default defineConfig([ ß_cfg_1 ]);