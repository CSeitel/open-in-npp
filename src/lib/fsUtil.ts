/*
*/
  import { type Stats
         , type PathLike
         } from 'fs';
  import { type TFSError
         } from '../types/error.d';
  import { promises as ßß_fs_p
         } from 'fs';
//====================================================================

export async function whenFileInfoRead( ü_path:PathLike                        ):Promise<Stats|null>
export async function whenFileInfoRead( ü_path:PathLike, ü_fileExists :false   ):Promise<Stats|null>
export async function whenFileInfoRead( ü_path:PathLike, ü_fileExists :true    ):Promise<Stats     >
export async function whenFileInfoRead( ü_path:PathLike, ü_fileExists?:boolean ):Promise<Stats|null> {
  //
    if ( ü_fileExists === true ) {
      return ßß_fs_p.stat( ü_path );
    }
  //
    try {
      const ü_stat = await ßß_fs_p.stat( ü_path );
      return ü_stat;
    } catch ( ü_eX ) {

      switch ( ( ü_eX as TFSError ).code ) {
        case 'ENOENT':
          return null;
      }

      console.error( ü_eX );
      throw ü_eX;
    }
}

export async function whenKnownAsFolder( ü_path:PathLike ):Promise<boolean> {
    const ü_info = await whenFileInfoRead( ü_path );
    if ( ü_info === null      ) { return false; }
    if ( ü_info.isDirectory() ) { return true ; }
    if ( ü_info.isSymbolicLink() ) {
      const ü_real = await ßß_fs_p.realpath( ü_path );
    }
    return false;
}

//====================================================================