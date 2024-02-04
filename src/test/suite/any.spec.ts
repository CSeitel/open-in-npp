/*
*/
  import { type TResultArray
         } from '../../types/lib.testUtil.d';
//--------------------------------------------------------------------
  import { basename
         , join
         } from 'path';
  import { strictEqual
         } from 'assert';
  import { FileType } from 'vscode';
  import { CEFileType
         } from '../../constants/vsc';
/*
*/
  import { whenFileInfoRead
         , whenFileInfoRead_
         , whenFileTypeKnown
         } from '../../vsc/fsUtil';
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
  const ß_testDir = join( __dirname, '../../../.vscode-temp' );
//const ß_testDir = join( process.cwd(), '../../.vscode-temp' );

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

suite( 'Debug', ()=>{
  //test( 'Dummy', ß_whenFileInfoRead );
test( '', async ()=>{
    const ü_info = await whenFileInfoRead_( join( ß_testDir, 'virtual_6_d' ) );
    strictEqual( ü_info?.type, 66 )
});
});

//====================================================================

testSuite( basename( __filename ),
    [ 
      //ß_whenFileInfoRead
    ]
  );
/*
  test( 'Execute Command', VscTestSpec.openInNpp );
  test( 'Env'            , VscTestSpec.test_2    );
*/

//====================================================================

async function ß_whenFileInfoRead():Promise<void> {
    console.log( ß_testDir );
    const ü_data =
      [
        [ join( ß_testDir, 'virtual_6_d' ), CEFileType.SymLinkFolder ]
      , [ __filename , CEFileType.File    ]
      , [ __dirname  , CEFileType.Folder  ]
      , [ '*'        , CEFileType.Unknown ]
      , [ ''         , CEFileType.Folder  ]
      , [ ' '        , CEFileType.Unknown ]
      , [ '.'        , CEFileType.Folder  ]
      , [ '..'       , CEFileType.Folder  ]
      , [ '../..'    , CEFileType.Folder  ]
      , [ join( ß_testDir, 'virtual_1_j' ), CEFileType.SymLinkFolder ]
      , [ join( ß_testDir, 'virtual_1_d' ), CEFileType.SymLinkFolder ]
      , [ join( ß_testDir, 'virtual_2_d' ), CEFileType.SymLinkFolder ]
      , [ join( ß_testDir, 'virtual_3_d' ), CEFileType.SymLinkFolder ]
      , [ join( ß_testDir, 'virtual_6_d' ), CEFileType.SymLinkFolder ]
      ] as TResultArray<string,CEFileType>;
    const ü_data_2 = structuredClone( ü_data );
    ü_data_2[ ü_data_2.length - 3 ][1] = CEFileType.Folder;
  //const ü_isExe = bind( isExe, {realFirst:true,arrangeBound:[1]}, false )
    
    testSummary( await testAsyncFunction( ö_tst, ü_data_2 )
               , await testAsyncFunction( whenFileTypeKnown, ü_data )
               , strictEqual );
  //
async function ö_tst( ü_path:string ):Promise<CEFileType> {
    const ü_info = await whenFileInfoRead_( ü_path );
    if ( ü_info === null ) { return CEFileType.Unknown; }
    return ü_info.type as unknown as CEFileType;
}
}

//====================================================================
/*
*/