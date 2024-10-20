/*
*/
  import { join
         } from 'path';
//--------------------------------------------------------------------
  import { ß_trc
         } from '../../runtime/context';
  import { whenAllTestsRun
         } from '../../lib/testUtil';
//====================================================================
  import * as ß_array from './lib/array.impl';
  import * as ß_async from './lib/async.impl';
  import * as ß_error from './lib/error.impl';
  import * as ß_etc   from './lib/etc.impl'  ;
  import * as ß_fs    from './lib/fs.impl'   ;
  import * as ß_test  from './lib/test.impl' ;
  import * as ß_text  from './lib/text.impl' ;
//====================================================================
  const ß_skipTests =  true; // = except single test
  const ß_allTests  =  true;
  (ß_trc as any) = false;

    whenAllTestsRun([
        [ 'Array' , ß_array,  ß_skipTests ]
      , [ 'Single', [ ß_text.tst_dispatch ], !ß_skipTests ]
      , [ 'Async' , ß_async,  ß_skipTests ]
      , [ 'Error' , ß_error,  ß_skipTests ]
      , [ 'Etc'   , ß_etc  ,  ß_skipTests ]
      , [ 'Fs'    , ß_fs   ,  ß_skipTests ]
      , [ 'Test'  , ß_test ,  ß_skipTests ]
      , [ 'Text'  , ß_text , !ß_skipTests ]
      ], { resourceDirName: join( __dirname, '../../../etc/test' )
         , summaryOnly: ß_allTests
         , singleTest : ß_allTests ? undefined :
                  //ß_array.tst_dispatch
                  //ß_async.tst_dispatch
                  //ß_error.tst_dispatch
                  //ß_etc  .tst_dispatch
                  //ß_fs   .tst_dispatch
                  //ß_test .tst_dispatch
                    ß_text .tst_dispatch
         }
      );

//====================================================================
/*
*/