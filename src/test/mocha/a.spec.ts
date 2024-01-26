/*
*/
  import { basename
         } from 'path';
  import * as ßß_assert from 'assert';
//--------------------------------------------------------------------
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
      ßß_assert.strictEqual( 1, 1 );

  try {
  } finally {
  }
});

test( ß_tests[2], async ()=>{
    await whenDelay( 1000 );
    ßß_assert.strictEqual( 1, 1 );
});

});
