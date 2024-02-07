/*
*/
  import { type TResultArray
         } from '../../../types/lib.testUtil.d';
//--------------------------------------------------------------------
  import { basename
         , join
         } from 'path';
  import { strictEqual
         } from 'assert';
  import { FileType } from 'vscode';
  import { CEFileType
         } from '../../../constants/vsc';
/*
*/
  import { whenFileInfoRead
         , whenFileTypeKnown
         } from '../../../vsc/fsUtil';
  import { whenDelay
         , LockHandler
         } from '../../../lib/asyncUtil';
  import { testSrc
         , identity
         , testSummary
         , testEquals
         , testAsyncFunction
         , bind
         } from '../../../lib/testUtil';
//====================================================================
  type Duplet<T1,T2> = [T1,T2][]

export async function tst_whenFileInfoRead():Promise<void> {
    const ö_info = ( await whenFileInfoRead( testSrc( 'real_1' ) ) )!;
    const ü_data = [ 'virtual_2_d'
                   , 'virtual_1_d' ].map( ü_name => [testSrc( ü_name ), '0.1' ] as [string,string] )
    testSummary( await testAsyncFunction( ö_whenCtime, ü_data ), strictEqual );

async function ö_whenCtime( ü_path:string ):Promise<string> {
    const ü_info = ( await whenFileInfoRead( ü_path ) )!;
    return ( ü_info.ctime - ö_info.ctime )
         + '.'
         + ( ü_info.mtime - ö_info.mtime )
         ;
}
}

//====================================================================

export async function tst_whenFileTypeKnown():Promise<void> {
  //
    const ü_data =
      [
      //[ join( ß_testDir, 'virtual_6_d' ), CEFileType.SymLinkFolder ]
        [ __filename , CEFileType.File    ]
      , [ __dirname  , CEFileType.Folder  ]
      , [ '*'        , CEFileType.Unknown ]
      , [ ''         , CEFileType.Folder  ]
      , [ ' '        , CEFileType.Unknown ]
      , [ '.'        , CEFileType.Folder  ]
      , [ '..'       , CEFileType.Folder  ]
      , [ '../..'    , CEFileType.Folder  ]
      , [ testSrc( 'virtual_1_j' ), CEFileType.SymLinkFolder  ]
      , [ testSrc( 'virtual_1_d' ), CEFileType.SymLinkFolder  ]
      , [ testSrc( 'virtual_2_d' ), CEFileType.SymLinkFolder  ]
      , [ testSrc( 'virtual_3_d' ),         -1 ]
      , [ testSrc( 'virtual_6_d' ), CEFileType.SymLinkUnknown ]
      ] as TResultArray<string,CEFileType|-1>;
    
    testSummary( await testAsyncFunction( whenFileTypeKnown, ü_data, (ü_x,ü_eX)=>{
                                    return ü_x.endsWith( 'virtual_3_d' ) ? -1 : -2 as -1; } )
               //await testAsyncFunction( ö_tst, ü_data_2 )
               , strictEqual );
}

//====================================================================
/*
    const ü_data_2 = structuredClone( ü_data );
    ü_data_2[ ü_data_2.length - 3 ][1] = CEFileType.Folder;
*/