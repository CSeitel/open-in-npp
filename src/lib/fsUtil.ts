/*
https://nodejs.org/api/fs.html#fslstatpath-options-callback
*/
  import { type Stats
         , type PathLike
         } from 'fs';
  import { type TFSError
         , type TNodeFSErrorCodes
         } from '../types/lib.errorUtil.d';
//--------------------------------------------------------------------
  import * as ßß_path from 'path';
  import { tmpdir
         } from 'os';
  import { join
         , parse
         } from 'path';
  import { promises  as ßß_fs_p
         , constants as ßß_fs_c
         } from 'fs';
  import { expect
         } from '../lib/errorUtil';
//====================================================================

export async function whenFileInfoRead( ü_path:PathLike, ü_slnk = false ):Promise<Stats|null> {
  //
    try {
        return await ßß_fs_p[ ü_slnk ? 'lstat'
                                     :  'stat' ]( ü_path );
    } catch ( ü_eX ) {
        return expect<TNodeFSErrorCodes,null>( ü_eX, 'ENOENT', null );
    }
}

//--------------------------------------------------------------------

export async function whenKnownAsFolder ( ü_path:PathLike, ü_slnk = false ):Promise<boolean> { const ü_info = await whenFileInfoRead( ü_path, ü_slnk ); return ü_info !== null && ü_info.isDirectory   (); }
export async function whenKnownAsSymLink( ü_path:PathLike, ü_slnk = false ):Promise<boolean> { const ü_info = await whenFileInfoRead( ü_path, ü_slnk ); return ü_info !== null && ü_info.isSymbolicLink(); }
export async function whenKnownAsFile   ( ü_path:PathLike, ü_slnk = false ):Promise<boolean> { const ü_info = await whenFileInfoRead( ü_path, ü_slnk ); return ü_info !== null && ü_info.isFile        (); }

//====================================================================

export function isExecutable( mode:number ):boolean {
    return ( mode & ( ßß_fs_c.S_IXUSR
                    | ßß_fs_c.S_IXGRP
                    | ßß_fs_c.S_IXOTH ) ) > 0
  ;
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

export async function whenTempFile( ü_base:string, ü_tempStub = '', ü_tempDir = '', ü_noReuse = false ):Promise<string> {
    if ( ü_tempDir.length === 0 )
       { ü_tempDir = tmpdir(); }
  //
    if ( ü_tempStub.length > 0 )
       { ü_tempDir = await ßß_fs_p.mkdtemp( join( ü_tempDir, ü_tempStub ) ); }
    
  //
    let ü_file = join( ü_tempDir, ü_base );
    const ü_temp = parse( ü_file );
    if ( ! await whenKnownAsFolder( ü_temp.dir ) ) { throw new TypeError( `Not a folder ${ ü_temp.dir }` ); }
  //
    if ( ! ü_noReuse ) {
        return ü_file;
    }
  //
    const ü_old = ü_temp.name.match( / \((\d+)\)$/ );
    let ü_indx = ü_old === null ? 1
                                : 1 + parseInt( ü_old[1] )
                                ;
    while ( null !== await whenFileInfoRead( ü_file ) ) {
        ü_file = join( ü_temp.dir
                     , `${ ü_temp.name } (${ ++ ü_indx })${ ü_temp.ext }` );
    }
    return ü_file;
}

//====================================================================
/*
*/