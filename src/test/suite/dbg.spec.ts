/*
*/
  import '../../runtime/context-XTN';
  import { tst_dbg      as testImp_ } from './lib/a.npp'  ;
  import { tst_dispatch as testImpl } from './lib/fs.vsc' ;
  import { tst_         as testImp1 } from './lib/etc.vsc';
//====================================================================

suite( 'Debug', ()=>{
    test( 'Single', async ()=>{
        await testImpl();
    });
});