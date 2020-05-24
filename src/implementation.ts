/*
https://www.linux.com/tutorials/understanding-linux-file-permissions/
https://nodejs.org/api/child_process.html#child_process_event_error
*/
  import * as ßß_path from 'path';
  import * as ßß_cp   from 'child_process';
//------------------------------------------------------------------------------
  import { ConfigSnapshot
         } from './configHandler';
  import { EExtensionIds
         } from './extension';
//------------------------------------------------------------------------------
  const enum ECLIParameters
    { multipleInstances      = '-multiInst'
    , openFoldersAsWorkspace = '-openFoldersAsWorkspace'
    , skipSessionHandling    = '-nosession'
    ,   lineNumber           = '-n'
    , columnNumber           = '-c'
    };
//------------------------------------------------------------------------------
  export const CNaLineNumber = 0;
//==============================================================================

export async function spawnProcess( ü_config:ConfigSnapshot, ü_fileName:string, ü_files:string[] | undefined ):Promise<number> {
    const ü_isFolder = ü_files !== undefined;
  //
                                           const ü_args = [ ... ü_config.commandLineArguments ];
    if ( ü_config.multiInst
    || ( ü_isFolder
      && ü_config.openFolderAsWorkspace    ) ) { ü_args.push( ECLIParameters.multipleInstances                    ); }
    if ( ü_config.skipSessionHandling        ) { ü_args.push( ECLIParameters.skipSessionHandling                  ); }
  //
    if ( ü_config.lineNumber > CNaLineNumber ) { ü_args.push( ECLIParameters.  lineNumber + ü_config.  lineNumber );
                                                 ü_args.push( ECLIParameters.columnNumber + ü_config.columnNumber ); }
  //
    if ( ü_isFolder                          ) {
    if ( ü_config.openFolderAsWorkspace      ) { ü_args.push( ECLIParameters.openFoldersAsWorkspace               );
                                                 ü_args.push(     ü_fileName ); }
                                                 ü_args.push( ... ü_files!   ); }
    else                                       { ü_args.push(     ü_fileName ); }
  //
    const ü_opts:ßß_cp.SpawnOptions =
      { stdio   : 'ignore'
      , detached: ü_config.detachProcess
      };
  //
    if ( ü_config.workingDirectory.length > 0 ) {
      if ( ßß_path.isAbsolute( ü_config.workingDirectory ) ) {
         ü_opts.cwd = ü_config.workingDirectory;
      } else {
         ü_opts.cwd = ßß_path.join(    ü_isFolder
                    ?                  ü_fileName
                    : ßß_path.dirname( ü_fileName )
                    ,                  ü_config.workingDirectory );
      }
    } else {
         ü_opts.cwd =                  ü_isFolder
                    ?                  ü_fileName
                    : ßß_path.dirname( ü_fileName )
                    ;
    }
  //
    console.info( `${ EExtensionIds.fullName }`, ü_opts, [ ü_config.executable, ... ü_args ] );
    const ö_proc = ßß_cp.spawn( ü_config.executable, ü_args, ü_opts );
  //
    return new Promise<number>( (ü_resolve,ü_reject) => {
      ö_proc.on( 'error', ü_eX => {
      //console.error( ü_eX );
        ü_reject( ü_eX );
      });
      if ( ö_proc.pid !== undefined ) {
        ü_resolve( ö_proc.pid );
      }
    });
  //
}

//==============================================================================
/*
*/