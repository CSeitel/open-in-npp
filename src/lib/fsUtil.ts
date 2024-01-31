/*
https://nodejs.org/api/fs.html#fslstatpath-options-callback
*/
  import { type Stats
         , type PathLike
         } from 'fs';
  import * as ßß_path   from 'path';
  import { promises as ßß_fs_p
         } from 'fs';
  import { expect
         } from '../lib/error';
//====================================================================

export async function whenFileInfoRead( ü_path:PathLike, ü_slnk = false ):Promise<Stats|null> {
  //
    try {
        return await ßß_fs_p[ ü_slnk ? 'lstat'
                                     :  'stat' ]( ü_path );
    } catch ( ü_eX ) {
        return expect( ü_eX, 'ENOENT', null );
    }
}

//--------------------------------------------------------------------

export async function whenKnownAsFolder( ü_path:PathLike, ü_slnk = false ):Promise<boolean> {
    const ü_info = await whenFileInfoRead( ü_path, ü_slnk );
    if ( ü_info === null      ) { return false; }
    if ( ü_info.isDirectory() ) { return true ; }
                                  return false;
  //if ( ü_info.isSymbolicLink() ) { const ü_real = await ßß_fs_p.realpath( ü_path ); }
}

//====================================================================
  const ß_exe_exts = ['.exe','.cmd','.bat','.lnk'];

export async function isExe( ü_path:string, ü_enforceAbsolute = false ):Promise<boolean> {
  //
    if ( ü_enforceAbsolute
      && ! ßß_path.isAbsolute( ü_path ) ) {
      return false;
    }
  //
    const ü_info = await whenFileInfoRead( ü_path );
    if ( ü_info === null
      || ! ü_info.isFile() ) { return false; }
  //
    const ü_ext = ßß_path.extname( ü_path ).toLowerCase();
    if ( ! ß_exe_exts.includes( ü_ext ) ) { return false; }
  //
  //ß_trc( (( ü_stats.mode >>9 ) <<9) + (ü_stats.mode & 0x1ff ), ü_stats.mode );
  //ß_trc( ( ü_stats.mode >>9 ).toString(8) , (ü_stats.mode & 0x1ff ).toString(8), ü_stats.mode );
    return true;
}

//====================================================================
/*
*/