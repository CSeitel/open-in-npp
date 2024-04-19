/*
*/
  import { whenAllTestsRun
         } from '../../lib/testUtil';
//--------------------------------------------------------------------
  import * as ß_etc from './lib/etc.vsc';
  import * as ß_fs  from './lib/fs.vsc' ;
//====================================================================
  const ß_skipTests =  true; // = except single test
  whenAllTestsRun([
      [ 'Single', [
                  ß_fs
                      .tst_dispatch
                      ], !ß_skipTests ]
    , [ 'Etc'   , ß_etc,  ß_skipTests ]
    , [ 'Fs'    , ß_fs ,  ß_skipTests ]
    ]);

//====================================================================
/*
*/