/*
*/
  import { type TResultArray
         } from '../../types/lib.testUtil.d';
//--------------------------------------------------------------------
  import { basename
         } from 'path';
  import { strictEqual
         } from 'assert';
  import { FileType } from 'vscode';
/*
*/
  import { whenFileInfoRead
         } from '../../lib/vsc';
  import { whenDelay
         , LockHandler
         } from '../../lib/asyncUtil';
  import { testSuite
         , testSummary
         , testEquals
         , testAsyncFunction
         , bind
         } from '../../lib/testUtil';
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

testSuite( basename( __filename ),
    [ ß_whenFileInfoRead
    ]
  );
/*
  test( 'Execute Command', VscTestSpec.openInNpp );
  test( 'Env'            , VscTestSpec.test_2    );
*/

//====================================================================

async function ß_whenFileInfoRead():Promise<void> {
    const ü_data =
      [ [ __filename , true  ]
      , [ __dirname  , false ]
      , [ '*'        , false ]
      , [ ''         , false ]
      , [ ' '        , false ]
      , [ '.'        , false ]
      , [ '..'       , false ]
      , [ '../..'    , false ]
      ] as TResultArray<string,boolean>;
  //const ü_isExe = bind( isExe, {realFirst:true,arrangeBound:[1]}, false )
    testSummary( await testAsyncFunction( ö_tst, ü_data ), strictEqual );
  //
async function ö_tst( ü_path:string ):Promise<boolean|null> {
    const ü_info = await whenFileInfoRead( ü_path );
    if ( ü_info === null ) { return null; }
    return ü_info.type === FileType.File;
}
}

//====================================================================
/*
*/