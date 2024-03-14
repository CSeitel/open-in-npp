/*
*/
  import { whenAllTestsRun
         } from '../../lib/testUtil';
//--------------------------------------------------------------------
  import * as ß_async from './lib/async.impl';
  import * as ß_fs    from './lib/fs.impl'   ;
  import * as ß_test  from './lib/test.impl' ;
  import * as ß_text  from './lib/text.impl' ;
//====================================================================

  const ß_skipTests =  true; // = except single test
  whenAllTestsRun([
      [ 'Single', [ ß_text.tst_expandEnvVariables
                        ], !ß_skipTests ]
    , [ 'Async' , ß_async,  ß_skipTests ]
    , [ 'Fs'    , ß_fs   ,  ß_skipTests ]
    , [ 'Test'  , ß_test ,  ß_skipTests ]
    , [ 'Text'  , ß_text ,  ß_skipTests ]
    ]);

//====================================================================
/*
*/