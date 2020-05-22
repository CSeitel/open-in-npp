/*
*/
  import * as ßß_path from 'path';
  import { promises as ßß_fs
         , Stats
         , PathLike
         } from 'fs';
//------------------------------------------------------------------------------
  const ß_exe_exts = ['.exe','.cmd','.bat','.lnk'];
//==============================================================================

export async function isExe( ü_path:string ):Promise<boolean> {
//
  let ü_stats:Stats;
  try {
    ü_stats = await ßß_fs.stat( ü_path );
  } catch ( eX ) {
    return false;
  }
//
  if ( ü_stats.isDirectory() ) { return false; }
//
  const ü_ext = ßß_path.extname( ü_path ).toLowerCase();
  if ( ! ß_exe_exts.includes( ü_ext ) ) { return false; }
//
//ß_trc( (( ü_stats.mode >>9 ) <<9) + (ü_stats.mode & 0x1ff ), ü_stats.mode );
//ß_trc( ( ü_stats.mode >>9 ).toString(8) , (ü_stats.mode & 0x1ff ).toString(8), ü_stats.mode );
  return true;
}

export function expandEnvVariables( ü_path:string ):string {
  //
    const ü_rgXp = /%([^%]+)%/g;
    return ü_path.replace( ü_rgXp, ö_win32 );
//
function ö_win32( ü_original:string, ü_name:string ):string {
    const ü_resolved = process.env[ ü_name ];
    return ü_resolved === undefined
         ? ü_original
         : ü_resolved
         ;
}
//
}

//==============================================================================
/*
//ß_trc( (( ü_stats.mode >>9 ) <<9) + (ü_stats.mode & 0x1ff ), ü_stats.mode );
//ß_trc( ( ü_stats.mode >>9 ).toString(8) , (ü_stats.mode & 0x1ff ).toString(8), ü_stats.mode );
*/