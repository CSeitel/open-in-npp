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
//====================================================================

suite( basename( __filename ), ()=>{
setup(function() {
});

teardown(function() {
    console.log( 'done' );
});

test( ß_tests[1], async ()=>{
    new LockHandler<typeof ß_tests,keyof typeof ß_tests>( 1, ß_tests )
    const a = new LockHandler( 1, ß_tests )
    await whenDelay( 1000 );
    ßß_assert.strictEqual( 1, 1 );
});

test( ß_tests[2], async ()=>{
    await whenDelay( 1000 );
    ßß_assert.strictEqual( 1, 1 );
});

});
