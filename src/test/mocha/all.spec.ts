/*
*/
  import { whenAllTestsRun
         } from '../../lib/testUtil';
//--------------------------------------------------------------------
  import * as ß_array from './lib/array.impl';
  import * as ß_async from './lib/async.impl';
  import * as ß_error from './lib/error.impl';
  import * as ß_etc   from './lib/etc.impl'  ;
  import * as ß_fs    from './lib/fs.impl'   ;
  import * as ß_test  from './lib/test.impl' ;
  import * as ß_text  from './lib/text.impl' ;
//====================================================================

  const ß_skipTests =  true; // = except single test
  whenAllTestsRun([
      [ 'Single', [ 
                  ß_test
                         .tst_bindArgs
                //ß_fs   
                //       .tst_win32Exe
                //ß_error
                //       .tst_
                        ], !ß_skipTests ]
    , [ 'Array' , ß_array,  ß_skipTests ]
    , [ 'Async' , ß_async,  ß_skipTests ]
    , [ 'Error' , ß_error,  ß_skipTests ]
    , [ 'Etc'   , ß_etc  ,  ß_skipTests ]
    , [ 'Fs'    , ß_fs   ,  ß_skipTests ]
    , [ 'Test'  , ß_test ,  ß_skipTests ]
    , [ 'Text'  , ß_text ,  ß_skipTests ]
    ]);

//====================================================================
/*
*/