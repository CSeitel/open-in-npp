/*
*/
  import { type TOrderedPairArray
         } from '../../../types/lib.arrayUtil.d';
  import { CEFileType
         } from '../../../constants/vsc';
//--------------------------------------------------------------------
  import { ß_trc
         } from '../../../runtime/context';
  import { fileToUri
         , whenFileInfoRead
         , whenFileTypeKnown
         , whenKnownAsFolder
         , isContainedInWorkspace
         , whenFilesFound
         } from '../../../vsc/fsUtil';
//--------------------------------------------------------------------
  import { pickDuplet
         } from '../../../lib/arrayUtil';
  import { expect
         } from '../../../lib/errorUtil';
  import { bindArguments
         } from '../../../lib/functionUtil';
  import { testSrc
         , testSummary_
         , whenAsyncFunctionTested
         , testFunction
         , testEqual
         } from '../../../lib/testUtil';
//====================================================================

export async function tst_dispatch(){
    return tst_whenFileTypeKnown();
}

//====================================================================

export async function tst_whenFileInfoRead(){
    const ö_info = ( await whenFileInfoRead( testSrc( 'real_1' ) ) )!;
    const ü_data = [ 'virtual_2_d'
                   , 'virtual_1_d' ].map( ü_name => [testSrc( ü_name ), '0.0' ] as [string,string] )
    await whenAsyncFunctionTested( ö_whenCtime, ü_data );
  //
    const ü_a = await whenFileInfoRead( '.'  );
    const ü_b = await whenFileInfoRead( '..' );
    ß_trc&& ß_trc( `"${ new Date( ü_a!.mtime ) }"` );
    ß_trc&& ß_trc( fileToUri( 'Users' ).fsPath );
    
    testEqual( ü_a!.mtime, ü_b!.mtime );
  //
    testSummary_();

async function ö_whenCtime( ü_path:string ):Promise<string> {
    const ü_info = ( await whenFileInfoRead( ü_path ) )!;
    return ( ü_info.ctime - ö_info.ctime )
         + '.'
         + ( ü_info.mtime - ö_info.mtime )
         ;
}
}

//====================================================================

export async function tst_whenFilesFound(){
    const ü_files = await whenFilesFound( testSrc(), '**/*e*.txt' );
    testEqual( ü_files.length, 5 );
    testSummary_();
}

//====================================================================

export async function tst_whenFileTypeKnown(){
  //
    const ü_data =
      [
      //[ join( ß_testDir, 'virtual_6_d' ), CEFileType.SymLinkFolder ]
        [ __filename              , CEFileType.File           , false ]
      , [ __dirname               , CEFileType.Folder         , true  ]
      , [ '*'                     , CEFileType.Unknown        , false ]
      , [ ''                      , CEFileType.Folder         , true  ]
      , [ ' '                     , CEFileType.Unknown        , false ]
      , [ '.'                     , CEFileType.Folder         , true  ]
      , [ '..'                    , CEFileType.Folder         , true  ]
      , [ '../..'                 , CEFileType.Folder         , true  ]
      , [ testSrc( 'virtual_1_j' ), CEFileType.SymLinkFolder  , true  ]
      , [ testSrc( 'virtual_1_d' ), CEFileType.SymLinkFolder  , true  ]
      , [ testSrc( 'virtual_2_d' ), CEFileType.SymLinkFolder  , true  ]
      , [ testSrc( 'virtual_3_d' ), -9                        , true  ]
      , [ testSrc( 'virtual_6_d' ), CEFileType.SymLinkUnknown , false ]
      ];
    const ü_01 = ü_data.map( pickDuplet<string,CEFileType|-9  ,boolean   |-9  >( 0, 1 ) );
    const ü_02 = ü_data.map( pickDuplet<string,boolean   |-9  ,CEFileType|-9  >( 0, 2 ) );
    
    await whenAsyncFunctionTested( whenFileTypeKnown, ü_01, ö_err );
    await whenAsyncFunctionTested( whenKnownAsFolder, ü_02, ö_err );
    testSummary_();
function ö_err( ü_x:string, ü_eX:any ):-9      {
    return ü_x.endsWith( 'virtual_3_d' ) && expect( ü_eX, 'Unknown', true )
         ? -6 as -9
         : -5 as -9
         ;
}
}

//====================================================================

export async function tst_whenWS(){
  //
    const ü_data = [
        [ __filename, true ]
      , [ testSrc( '../etc/test/workspaceFolder/temp' ), true ]
      , [ testSrc( 'virtual_6_d' ), false ]
      ] as TOrderedPairArray<string,boolean>;
    testFunction( bindArguments( isContainedInWorkspace, { prepare: {0:fileToUri} } ), ü_data )
    testSummary_();
}

//====================================================================
/*
    const ü_data_2 = structuredClone( ü_data );
    ü_data_2[ ü_data_2.length - 3 ][1] = CEFileType.Folder;
*/