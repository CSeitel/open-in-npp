/*
*/
import { defineConfig } from '@vscode/test-cli';
//--------------------------------------------------------------------

  let ß_files = 'out/test/suite/**/vsc*.spec.js';
      ß_files = 'out/test/suite/a.spec.js';
      ß_files = 'out/test/suite/vsc.spec.js';
  const ß_cfg_1 =
    { label: 'unitTests'
    , files: ß_files
  //, version: 'insiders'
  //, workspaceFolder: './sampleWorkspace'
    , mocha:
	  { ui: 'tdd'
	  , timeout: 5 * 1000
      }
    };

//====================================================================
  export default defineConfig([ ß_cfg_1 ]);