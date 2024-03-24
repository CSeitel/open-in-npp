/*
*/
  import '../../runtime/context-XTN';
  import { tst_dbg as testImp_ } from './lib/a.npp'  ;
  import { tst_    as testImpl } from './lib/etc.vsc';
//====================================================================

suite( 'Debug', ()=>{
    test( 'Single', async ()=>{
        await testImpl();
    });
});