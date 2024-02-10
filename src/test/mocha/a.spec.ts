/*
*/
//--------------------------------------------------------------------
  import { basename
         } from 'path';
  import { strictEqual
         } from 'assert';
  import { whenDelay
         , LockHandler
         } from '../../lib/asyncUtil';
//--------------------------------------------------------------------
  const ß_tests =
    { 1: 'YYY'
    , 2: 'ZZZ'
    };
//const ß_testLock = new LockHandler( 1, ß_tests );
  const ß_testLock = new LockHandler( 1, {1:'Suite'} );
//====================================================================

suite( basename( __filename ), ()=>{
  const a = 0;
  console.log(a);

setup(async function() {
    await ß_testLock.whenLocked();
    console.log( 'ready' );
});

teardown(function() {
    ß_testLock.release();
    console.log( 'done' );
});

test( ß_tests[1], async ()=>{
      await whenDelay( 1000 );
      strictEqual( 1, 1 );

  try {
  } finally {
  }
});

test( ß_tests[2], async ()=>{
    await whenDelay( 1000 );
    strictEqual( 1, 1 );
});

});

//====================================================================

class VscTestSpec {

static get some():number { return 1; }


static async test_0():Promise<void> {
    const ö_lock = new LockHandler( 'some', VscTestSpec );
    const ü_a = ö_cycle( 2 );
    const ü_b = ö_cycle( 1 );
    await ö_lock.whenLocked();
//
async function ö_cycle( ü_secs:number ):Promise<void> {
    await ö_lock.whenLocked();
    await whenDelay( ü_secs * 1000 );
    ö_lock.release();
}

}
}
