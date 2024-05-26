/*
*/
//--------------------------------------------------------------------
  import { join
         } from 'path';
  import { 
         } from 'fs';
  import { ß_trc
         , ß_err
         } from '../runtime/context';
  import { promises  as ß_fs_p
         , constants as ß_fs_c
         } from 'fs';
  import { testSrc
         } from '../lib/testUtil';
//--------------------------------------------------------------------
  const ß_rootDir = testSrc();
  const ß_real_1  = join( ß_rootDir, './real_1'       );
//====================================================================
  ß_main();

async function ß_main():Promise<void> {
    ß_trc&& ß_trc( ß_rootDir, 'Root' );
    await ß_fs_p.symlink( ß_real_1, join( ß_rootDir, './virtual_1_j' ), 'junction' ).then( undefined, ß_err );
    await ß_fs_p.symlink( ß_real_1, join( ß_rootDir, './virtual_1_d' ), 'dir'      ).then( undefined, ß_err );
}

//====================================================================
/*
mklink /D  .\.vscode-temp\virtual_1_d  .\real_1
mklink /J  .\.vscode-temp\virtual_1_j  .\.vscode-temp\real_1
mklink /D  .\.vscode-temp\virtual_2_d  .\virtual_1_d
mklink /D  .\.vscode-temp\virtual_3_d  .\virtual_4_d
mklink /D  .\.vscode-temp\virtual_4_d  .\virtual_5_d
mklink /D  .\.vscode-temp\virtual_5_d  .\virtual_3_d
mklink /D  .\.vscode-temp\virtual_6_d  .\real_0
*/