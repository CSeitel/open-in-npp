/*
*/
  import { tst_ as testImpl
         } from './lib/a.impl';

suite( 'Debug', ()=>{
    test( 'Single', async ()=>{
        await testImpl();
    });
});