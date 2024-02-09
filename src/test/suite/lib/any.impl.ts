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
         , whenKnownAsFolder
         } from '../../../vsc/fsUtil';
  import { expect
         } from '../../../lib/error';
  import { pickDuplet
         } from '../../../lib/arrayUtil';
  import { testSrc
         , identity
         , testSummary
         , testEquals
         , testAsyncFunction
         , bind
         } from '../../../lib/testUtil';
//====================================================================

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
        [ __filename              , CEFileType.File           , false ]
      , [ __dirname               , CEFileType.Folder         , true  ]
      , [ '*'                     , CEFileType.Unknown        , false ]
      , [ ''                      , CEFileType.Folder         , true  ]
      , [ ' '                     , CEFileType.Unknown        , false ]
      , [ '.'                     , CEFileType.Folder         , true ]
      , [ '..'                    , CEFileType.Folder         , true ]
      , [ '../..'                 , CEFileType.Folder         , true ]
      , [ testSrc( 'virtual_1_j' ), CEFileType.SymLinkFolder  , true ]
      , [ testSrc( 'virtual_1_d' ), CEFileType.SymLinkFolder  , true ]
      , [ testSrc( 'virtual_2_d' ), CEFileType.SymLinkFolder  , true ]
      , [ testSrc( 'virtual_3_d' ), null                      , true ]
      , [ testSrc( 'virtual_6_d' ), CEFileType.SymLinkUnknown , false ]
      ];
    const ü_01 = ü_data.map( pickDuplet<string,CEFileType|null,boolean>( 0, 1 ) );
    const ü_02 = ü_data.map( pickDuplet<string,boolean,CEFileType|null>( 0, 2 ) );
    
    testSummary( await testAsyncFunction( whenFileTypeKnown, ü_01, (ü_x,ü_eX)=>{ return ü_x.endsWith( 'virtual_3_d' ) && expect( ü_eX, 'Unknown', true ); } )
               , await testAsyncFunction( whenKnownAsFolder, ü_02 )
               , strictEqual );
}

//====================================================================
/*
    const ü_data_2 = structuredClone( ü_data );
    ü_data_2[ ü_data_2.length - 3 ][1] = CEFileType.Folder;
*/