/*
*/
  import { basename
         } from 'path';
  import { testSuite
         , testToggle
         } from '../../lib/testUtil';
//--------------------------------------------------------------------
  import * as ßß_suite
          from './lib/fs.impl';
//====================================================================
  const ü_single =  true;
suite( 'Debug', ()=>{
    test( 'Single', testToggle( ßß_suite.tst_whenFileInfoRead, !ü_single ) );
});
  testSuite( basename( __filename ), ßß_suite, ü_single );
//====================================================================
/*
*/