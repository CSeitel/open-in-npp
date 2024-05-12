/*
*/
//--------------------------------------------------------------------
  import { ß_trc
         } from '../../../runtime/context';
  import { whenDelay
         , UniqueResource
         , LockHandler
         , AsyncCalculation
         , createTimer
         , whenDoneAndPostProcessed
         } from '../../../lib/asyncUtil';
  import { hasErrorCode
         , createErrorWithCode
         } from '../../../lib/errorUtil';
  import { asyncNullOperation
         , bindAppending
         } from '../../../lib/functionUtil';
  import { whenFileInfoRead
         } from '../../../lib/fsUtil';
  import { testSrc
         , testNever
         , testEqual
         , testRejected
         } from '../../../lib/testUtil';
//====================================================================
  export const tst_dispatch = asyncNullOperation;
//====================================================================

export async function tst_syntax(){
    const ü_1 = Promise.resolve(1);
    const ü_2 = Promise.resolve(2);
    const ü_3 = Promise.resolve(3);
}

//====================================================================

export async function tst_UniqueResource(){
  //
    const ü_data = {a:1};
    const ö_uSrc = new UniqueResource( ü_data );
    const ü_id = 'init';
    testEqual( ö_uSrc.isPending( ü_id ), false );
    const ü_when = ö_uSrc.whenAvailable<undefined>( 'init' );
    testEqual( ö_uSrc.isPending( ü_id ), true  );
    const ü_release = await ü_when;
    testEqual( ö_uSrc.isPending( ü_id ), true  );
  //
    testEqual( ö_uSrc.getResource( ü_release ), ü_data );
  //
    try {
        ö_uSrc.getResource( asyncNullOperation );
        testNever();
    } catch ( ü_eX ) {
        testEqual( ü_eX instanceof Error, true );
    }
  //
               const ü_eX = new TypeError( 'Dummy' );
    await ü_release( ü_eX ).then(                testNever
                                , bindAppending( testEqual, ü_eX, 'Rethrow' )
                                );
}

//--------------------------------------------------------------------

export async function tst_UniqueResourceOrder(){
  //
    const ü_data = {};
    const ö_uSrc = new UniqueResource( ü_data );
    const ö_timer = createTimer();
  //
    const ö_expOrder = [200,100,10,1];
    const ö_actOrder = [] as number[];
    const ö_times    = [] as number[];
    await Promise.allSettled( ö_expOrder.map( ü_secs => ö_whenAccessed( ü_secs ) ) );
    testEqual( ö_actOrder.join(), ö_expOrder.join(), 'Order' );
    ß_trc&& ß_trc( ö_times );
  //
async function ö_whenAccessed( ü_ms:number ):Promise<void> {
    const ü_release = await ö_uSrc.whenAvailable( `${ ü_ms }` );
    await whenDelay( ü_ms );
  //ü_release();
    ö_uSrc.getResource( ü_release );
    ö_actOrder.push( ü_ms );
    ö_times.push( ö_timer() );
    ü_release();
}
}

//====================================================================

export async function tst_AsyncCalculation(){
    const ö_outdated   = hasErrorCode.bind( null, 'OUTDATED_PROMISE' );
    const ö_no_initial = hasErrorCode.bind( null, 'NO_INITIAL_VALUE' );
    const ö_internal   = hasErrorCode.bind( null, 'NNN' );
    const ö_timer = createTimer();
    const ö_times = [] as [number,number][];
  for ( const ü_lazy of [false,true] ) {
    const ü_calc_1 = new AsyncCalculation( ö_whenY, ü_lazy, 'WhenYofX' );
          ü_calc_1.x = 200;
    await whenDelay( 50 ); // lazy -> no delta 50
  //
    const ü_whenY_200 = testRejected( ü_calc_1.whenY, '200', ö_outdated );
    ü_calc_1.x = 10;
    const ü_whenY_10  = testRejected( ü_calc_1.whenY,  '10', ö_outdated );
    ü_calc_1.x = 20;
    const ü_whenY_20  =               ü_calc_1.whenY;
  //
    const ü_20 = await ü_whenY_20;
    testEqual( ü_20, 33 );
    testEqual( await ü_whenY_200, true, 'Rejected 200' );
  //
    ü_calc_1.x = 30; // lazy -> no entry
    ü_calc_1.x = 40; // delta 200
    const ü_40 = await ü_calc_1.whenY;
    testEqual( ü_40, 53 );
  //
    ß_trc&& ß_trc( ö_times );
    testEqual( ö_times.length, ü_lazy ? 4 : 5, 'Count' );
    testEqual( ö_times[1][1] - ö_times[0][1] >=  50, !ü_lazy, 'Delta 50'  );
    testEqual( ö_times[3][1] - ö_times[2][1] >= 200,  ü_lazy, 'Delta 200' );
    ö_times.length = 0;
  //
    const ü_calc_2 = new AsyncCalculation( ö_whenY, ü_lazy );
    ü_calc_2.x = 17;
    testRejected( ü_calc_2.whenY, '17', ö_outdated );
    ü_calc_2.x = 17;
    const ü_17 = await ü_calc_2.whenY;
    testEqual( ü_17, 30 );
  //
    const ü_calc_3 = new AsyncCalculation( ö_whenY, ü_lazy );
    const ü_NaN = ü_calc_3.whenY;
    if ( ü_lazy ) {
        testEqual( isNaN( await ü_NaN ), true, 'NaN' );
    } else {
        const ü_whenY_init = testRejected( ü_NaN, 'Undefined X', ö_no_initial );
        await whenDelay( 0 );
    }
    ü_calc_3.x = 55;
    const ü_whenY_55 = testRejected( ü_calc_3.whenY, '55', ö_outdated );
    ü_calc_3.x = 66;
    const ü_whenY_66 = testRejected( ü_calc_3.whenY, '66', ö_internal );
        await whenDelay( 0 );
        await ü_whenY_66;
  //
    ö_times.length = 0;
  }
      //await whenDelay( 5 );
//
async function ö_whenY( ü_x:number ):Promise<number> {
    ö_times.push([ ü_x, ö_timer() ]);
    await whenDelay( ü_x );
    switch ( ü_x ) {
        case 55:
        case 66:
            throw createErrorWithCode( 'NNN', ''+ü_x );
    }
    return ü_x + 13;
}
}

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

//====================================================================
/*
*/