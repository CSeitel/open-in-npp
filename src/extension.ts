/*
*/
  import * as ßß_vsCode from 'vscode';
  import { SpawnOptions
         } from 'child_process';
//==============================================================================
  type TExtensionCommand =
    { command :keyof typeof CCommandHandlerMap
    , title   :string
    }
  type TOpenInNpp =
    {
    }
export type TExtension = ßß_vsCode.Extension<TOpenInNpp>

export default class ExtensionRuntime {
    static readonly CExtensionId                             = 'CSeitel.open-in-npp';
    static readonly developerTrace :false|typeof console.log = console.log;
    static          activeInstance :ExtensionRuntime //|undefined = undefined;
  //
    readonly globalHistory:History
    readonly extensionApi :TExtension
  //
    readonly version      :string
    readonly commands     :TExtensionCommand[]
    readonly settings     :TExtensionConfig

constructor(
    readonly context      :ßß_vsCode.ExtensionContext
){
    if(ß_trc){ß_trc( ExtensionRuntime.activeInstance === undefined ? 'Activation' : 'Re-Activation' );}
                     ExtensionRuntime.activeInstance = this;
  //
    this.globalHistory = new History();
    this.extensionApi = ßß_vsCode.extensions.getExtension( ExtensionRuntime.CExtensionId )!;
  //
                 const ü_json = this.extensionApi.packageJSON;
    this.version     = ü_json.version;
    this.commands    = ü_json.contributes.commands;
    this.settings    = ü_json.contributes.configuration.properties;
  //
}

}
//------------------------------------------------------------------------------
  const ß_trc = ExtensionRuntime.developerTrace;
//==============================================================================
  import { createPromise
         , LockHandler
         } from './lib/any';
  import { CommandHandler
         , ConfigHandler
         } from './implementation';
//------------------------------------------------------------------------------
  const CCommandHandlerMap =
    {           'openInNpp.openSettings': ConfigHandler .whenSettingsOpened
    , 'extension.openInNpp'             : CommandHandler.openInNppActive 
    , 'extension.openInNppX'            : CommandHandler.openInNppEditor
    , 'extension.openInNppY'            : CommandHandler.openInNppExplorer
    };
//------------------------------------------------------------------------------
   enum EConfigurationIds
    {
      extendExplorerContextMenu = 'openInNpp.extendExplorerContextMenu'
    , extendEditorContextMenu   = 'openInNpp.extendEditorContextMenu'
    , extendEditorTitleMenu     = 'openInNpp.extendEditorTitleMenu'
  //
    , executable                = 'openInNpp.Executable'
    , spawnOptions              = 'openInNpp.spawnOptions'
    , workingDirectory          = 'openInNpp.workingDirectory'
    , decoupledExecution        = 'openInNpp.decoupledExecution'
    , commandLineArguments      = 'openInNpp.commandLineArguments'
    , multiInst                 = 'openInNpp.multiInst'
    , skipSessionHandling       = 'openInNpp.skipSessionHandling'
  //
    , openFolderAsWorkspace     = 'openInNpp.openFolderAsWorkspace'
    , filesInFolderPattern      = 'openInNpp.filesInFolderPattern'
    , matchingFilesLimit        = 'openInNpp.matchingFilesLimit'
    , preserveCursor            = 'openInNpp.preserveCursorPosition'
    };
//------------------------------------------------------------------------------
  type TExtensionConfig =
    {
  [P in EConfigurationIds] :{ type:string }
    }
//------------------------------------------------------------------------------
  const SINITIAL = Symbol();
  type  TINITIAL = typeof SINITIAL
//==============================================================================

export async function activate( ü_extnContext: ßß_vsCode.ExtensionContext ):Promise<void> {
  //
    const ü_activeInstance = new ExtensionRuntime( ü_extnContext );
  //
    for ( const ü_cmd of ü_activeInstance.commands ) {
      const ü_cmdId = ü_cmd.command;
      if ( ü_cmdId in CCommandHandlerMap ) {
        ü_extnContext.subscriptions.push(  ßß_vsCode.commands.registerCommand( ü_cmdId, CCommandHandlerMap[ ü_cmdId ] ) );
      } else {
        console.error( `Command "${ ü_cmdId }" not implemented.` );
      }
    }
  //
                                           const ü_cfgKeys:Record<EConfigurationIds,string> = {} as any;
    for ( const ü_alias in EConfigurationIds ) { ü_cfgKeys[ EConfigurationIds[ ü_alias as keyof typeof EConfigurationIds ] ] = ü_alias; }
    for ( const ü_cfgKey in ü_activeInstance.settings ) {
      if (!( ü_cfgKey in ü_cfgKeys )) {
        console.error( `Setting "${ ü_cfgKey }" not implemented.` );
      }
    }
  //
    ßß_vsCode.workspace.onDidChangeConfiguration( ConfigSnapshot.modificationSignalled );
  //
    await CommandHandler.whenActivationFinalized( ü_activeInstance );
}

export async function deactivate( this:null ):Promise<void> {
  /*
    const ü_hist = ExtensionRuntime.activeInstance.globalHistory;
    ü_hist.dummy = [ Date.now() ];
    await ü_hist.whenCommitted();
    if(ß_trc){ß_trc( `Deactivation` );}
  */
}

//==============================================================================

class ConfigProxy {
    private readonly _wsConfig = ßß_vsCode.workspace.getConfiguration();
//
  get  executable            ():string       { return this._wsConfig.get( EConfigurationIds.executable            ) as any; }
  get  spawnOptions          ():SpawnOptions { return this._wsConfig.get( EConfigurationIds.spawnOptions          ) as any; }
  get  workingDirectory      ():string       { return this._wsConfig.get( EConfigurationIds.workingDirectory      ) as any; }
  get  decoupledExecution    ():boolean      { return this._wsConfig.get( EConfigurationIds.decoupledExecution    ) as any; }
  get  commandLineArguments  ():string[]     { return this._wsConfig.get( EConfigurationIds.commandLineArguments  ) as any; }
  get  multiInst             ():boolean      { return this._wsConfig.get( EConfigurationIds.multiInst             ) as any; }
  get  skipSessionHandling   ():string       { return this._wsConfig.get( EConfigurationIds.skipSessionHandling   ) as any; }
  get  openFolderAsWorkspace ():string       { return this._wsConfig.get( EConfigurationIds.openFolderAsWorkspace ) as any; }
  get  filesInFolderPattern  ():string       { return this._wsConfig.get( EConfigurationIds.filesInFolderPattern  ) as any; }
  get  matchingFilesLimit    ():number       { return this._wsConfig.get( EConfigurationIds.matchingFilesLimit    ) as any; }
  get  preserveCursor        ():boolean      { return this._wsConfig.get( EConfigurationIds.preserveCursor        ) as any; }
}

//------------------------------------------------------------------------------

export class ConfigSnapshot extends ConfigProxy {
//
            static readonly CPrefix                          = 'openInNpp';
    private static         _current :ConfigSnapshot|TINITIAL = SINITIAL;
    private static         _touched                          = 1;
    private static         _executableTouched                = 0;
//
static modificationSignalled( this:undefined, ü_change:ßß_vsCode.ConfigurationChangeEvent ):void {
    const ü_that = ConfigSnapshot;
  //
    if ( ! ü_change.affectsConfiguration( ü_that.CPrefix ) ) { return; }
    if(ß_trc){ß_trc( `Configuration modified: "${ ü_that._touched }"` );}
    if ( ü_that._current === SINITIAL ) { return; } // _touched = 1
  //
    if ( ü_change.affectsConfiguration( EConfigurationIds.extendExplorerContextMenu )
      || ü_change.affectsConfiguration( EConfigurationIds.extendEditorContextMenu   )
      || ü_change.affectsConfiguration( EConfigurationIds.extendEditorTitleMenu     )
       ) { return; }
  //
                                                                           ü_that._touched           ++ ;
    if ( ü_change.affectsConfiguration( EConfigurationIds.executable ) ) { ü_that._executableTouched ++ ; }
  //
}
//
static get current():ConfigSnapshot {
    if ( this._touched > 0 ) {
         this._touched = 0 ;
    //
      const ü_current = new ConfigSnapshot( this._current, this._executableTouched > 0 );
      this._current           = ü_current;
      this._executableTouched = 0;
    }
  //
    return this._current as ConfigSnapshot;
}
//
    private          _whenWorkingDir    :Promise<string> | TINITIAL = SINITIAL;
    private          _whenExecutable    :Promise<string> | TINITIAL = SINITIAL;
    private          _executable        :        string  | TINITIAL = SINITIAL;
constructor(
                    ü_previous          :ConfigSnapshot  | TINITIAL
  , private readonly _executableTouched :boolean
){
    super();
  //
    if ( ü_previous !== SINITIAL ) {
      if ( this._executableTouched ) {
        if ( ü_previous.executable === this.executable ) {
          if(ß_trc){ß_trc( `Constant` );}
        }
      }
    }
}
//
async whenExecutable():Promise<string> {
      if ( this._executable === SINITIAL )
         { this._executable = await ConfigHandler.whenExecutable( super.executable, ! this._executableTouched );
         //this._whenExecutable.then( ü_executable => { this.executable = ü_executable; } );
         }
    return this._executable;
}

get whenWorkingDir():Promise<string> {
      if ( this._whenWorkingDir === SINITIAL )
         { this._whenWorkingDir = ConfigHandler.whenWorkingDir( super.workingDirectory ); }
    return this._whenWorkingDir;
}
//
}

//==============================================================================
  const enum EHistStates {
    IDLE = 0
  , LOCKED
  , DIRTY
  }
//------------------------------------------------------------------------------
  type THistInitials<T> = {
    [P in keyof T] :() => T[P]
  }
  type THistBuffer<T> = {
    [P in keyof T] :T[P] | TINITIAL
  }
  type THistBufferState<T> = {
    [P in keyof T] :EHistStates
  }
//------------------------------------------------------------------------------
  type THistBufferLocks<T> = {
    [P in keyof T] ?:LockHandler<T,P>
  }
//------------------------------------------------------------------------------
interface IHistoryData {
    dummy :number[]
    admin :
      { version    :number
      }
    config:
      { executable :string
      }
}
//------------------------------------------------------------------------------
export class History implements IHistoryData {
//
//static get():History { return new History(); }
//
    private readonly _initials:THistInitials<IHistoryData> =
      { dummy  : () => []
      , admin  : () => { return { version   : 0  }; }
      , config : () => { return { executable: '' }; }
      };
    private readonly _buffer  :THistBuffer<IHistoryData> =
      { dummy  : SINITIAL
      , admin  : SINITIAL
      , config : SINITIAL
      };
    private readonly _state   :THistBufferState<IHistoryData> =
      { dummy  : EHistStates.IDLE
      , admin  : EHistStates.IDLE
      , config : EHistStates.IDLE
      };
    private          _locks   :THistBufferLocks<IHistoryData> =
      {
      };
    private readonly _dataApi:ßß_vsCode.Memento
constructor(
    ü_global = true
){
    this._dataApi = ü_global
                  ? ExtensionRuntime.activeInstance.context.globalState
                  : ExtensionRuntime.activeInstance.context.workspaceState
                  ;
}

async whenCommitted( ü_mKey:keyof IHistoryData, ü_lazy = true ):Promise<boolean> {
    let ü_dirty = false;
  //
    switch ( this._state[ ü_mKey ] ) {

      case EHistStates.DIRTY:
        ü_dirty = true;
        this._state[ ü_mKey ] = EHistStates.IDLE;
        const ü_then = this._dataApi.update( ü_mKey, this._buffer[ ü_mKey ] );
        if ( ! ü_lazy ) { await ü_then; }
        if(ß_trc){ß_trc( `History updates committed for "${ ü_mKey }"` );}

      case EHistStates.LOCKED:
       const ü_lock = this._locks[ ü_mKey ];
             ü_lock!.release();
        if ( ü_dirty ) {
          return true ;
        }

      case EHistStates.IDLE:
          return false;

    }
}

release( ü_mKey:keyof IHistoryData ):boolean {
    switch ( this._state[ ü_mKey ] ) {

      case EHistStates.LOCKED:
        const ü_lock = this._locks[ ü_mKey ];
              ü_lock!.release();
        return true ;

      default:
        return false;

    }
}

private _getter<P extends keyof IHistoryData>( ü_mKey:P ):IHistoryData[P] {
    if ( this._buffer[ ü_mKey ] === SINITIAL ) {
                         const ü_data = this._dataApi.get<IHistoryData[P]>( ü_mKey );
      this._buffer[ ü_mKey ] = ü_data === undefined
                             ? this._initials[ ü_mKey ]() as IHistoryData[P]
                             : ü_data
                             ;
    }
      return this._buffer[ ü_mKey ] as IHistoryData[P];
  //
}

private _setter<P extends keyof IHistoryData>( ü_mKey:P, ü_data:IHistoryData[P] | TINITIAL ) {
    this._buffer[ ü_mKey ] = ü_data === SINITIAL
                           ? this._initials[ ü_mKey ]() as IHistoryData[P]
                           : ü_data
                           ;
    this._state[ ü_mKey ] = EHistStates.DIRTY;
}

private async _whenLocked<P extends keyof IHistoryData>( ü_mKey:P ):Promise<IHistoryData[P]> {
  //
    switch ( this._state[ ü_mKey ] as EHistStates ) {

      case EHistStates.IDLE:
             this._state[ ü_mKey ] = EHistStates.LOCKED;

      case EHistStates.DIRTY:
       const ü_old = this._locks[ ü_mKey ];
        if ( ü_old === undefined ) {
                            const ü_new = new LockHandler( ü_mKey, <IHistoryData> this );
          this._locks[ ü_mKey ] = ü_new as unknown as THistBufferLocks<IHistoryData>[P];
          return await   ü_new                                            .whenLocked();
        } else {
          return await ( ü_old as unknown as LockHandler<IHistoryData,P> ).whenLocked();
        }

      case EHistStates.LOCKED:
        {
                   const ü_old = this._locks[ ü_mKey ];
          return await ( ü_old as unknown as LockHandler<IHistoryData,P> ).whenLocked();
        }

    }
}

private async _whenObject<P extends keyof IHistoryData>( ü_mKey:P, ü_newData:Partial<IHistoryData[P]> | undefined, ü_noLock:boolean ):Promise<IHistoryData[P]> {
  //
    if ( ü_newData === undefined ) {
      if ( ü_noLock ) {
        console.error( `Wrong invocation` );
             return       this._getter    ( ü_mKey ); }
      else { return await this._whenLocked( ü_mKey ); }
    }
  //
    const ü_dataRef = ü_noLock
                    ?       this._getter    ( ü_mKey )
                    : await this._whenLocked( ü_mKey )
                    ;
  //
    try {
      for ( const ü_pKey in ü_newData ) {
      //const ü_a = ü_oldData[ ü_pKey as keyof IHistoryData[P] ]
      //const ü_b = ü_newData[ ü_pKey as keyof IHistoryData[P] ]
        if ( ( ü_dataRef[ ü_pKey as keyof IHistoryData[P] ] =
               ü_newData[ ü_pKey as keyof IHistoryData[P] ]! ) === undefined ) {
        delete ü_dataRef[ ü_pKey as keyof IHistoryData[P] ] ;
    
        }
      }
      //Object.assign( ü_oldData, ü_newData );
    //
      this._state[ ü_mKey ] = EHistStates.DIRTY;
      const ü_done = await this.whenCommitted( ü_mKey );
    //
    } catch ( ü_eX ) {
      console.error( ü_eX );
      if ( ! ü_noLock ) { this.release( ü_mKey ); }
      throw ü_eX;
    }
  //
    return ü_dataRef;
}

get       config ()          :        IHistoryData['config']   { return this._getter    ( 'config'           ); }
async whenConfig ( ü_config ?:Partial<IHistoryData['config']>  , ü_noLock = false )
                             :Promise<IHistoryData['config']>  { return this._whenObject( 'config', ü_config , ü_noLock ); }
get       admin  ()          :        IHistoryData['admin' ]   { return this._getter    ( 'admin'            ); }
async whenAdmin  ( ü_admin  ?:Partial<IHistoryData['admin' ]>  , ü_noLock = true  )
                             :Promise<IHistoryData['admin' ]>  { return this._whenObject( 'admin' , ü_admin  , ü_noLock ); }
get       dummy  ()          :        IHistoryData['dummy' ]   { return this._getter    ( 'dummy'            ); }
set       config ( ü_config  :        IHistoryData['config'] ) {        this._setter    ( 'config', ü_config ); }
set       admin  ( ü_admin   :        IHistoryData['admin' ] ) {        this._setter    ( 'admin' , ü_admin  ); }
set       dummy  ( ü_dummy   :        IHistoryData['dummy' ] ) {        this._setter    ( 'dummy' , ü_dummy  ); }

}

//==============================================================================
/*
*/