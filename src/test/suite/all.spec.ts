/*
*/
  import { whenAllTestsRun
         } from '../../lib/testUtil';
//--------------------------------------------------------------------
  import * as ß_fs from './lib/fs.impl';
//====================================================================
  const ß_skipTests =  true; // = except single test
  whenAllTestsRun([
      [ 'Single', [ ß_fs.tst_whenFilesFound
                      ], !ß_skipTests ]
    , [ 'Fs'    , ß_fs,  ß_skipTests ]
    ]);

//====================================================================
/*
*/