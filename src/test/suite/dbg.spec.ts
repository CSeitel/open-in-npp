/*
*/
  import '../../runtime/context-XTN';
  import { tst_dbg as testImpl
         } from './lib/a.impl';
//====================================================================

suite( 'Debug', ()=>{
    test( 'Single', async ()=>{
        await testImpl();
    });
});