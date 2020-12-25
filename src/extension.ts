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
    if(ß_trc){ß_trc( ExtensionRuntime.activeInstance === undefined ? 'Initial Activation' : 'Re-Activation' );}
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
    , preserveCursor            = 'openInNpp.preserveCursorPosition'
    };
//------------------------------------------------------------------------------
  type TExtensionConfig =
    {
  [P in EConfigurationIds] :{ type:string }
    }
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
    const ü_hist = ExtensionRuntime.activeInstance.globalHistory;
    ü_hist.dummy = [ Date.now() ];
    await ü_hist.whenCommitted();
    if(ß_trc){ß_trc( `Deactivation` );}
}

//==============================================================================

class ConfigProxy {
//
constructor(
    private readonly _wsConfig:ßß_vsCode.WorkspaceConfiguration
){}

  get _executable            ():string       { return this._wsConfig.get( EConfigurationIds.executable            ) as any; }
  get  spawnOptions          ():SpawnOptions { return this._wsConfig.get( EConfigurationIds.spawnOptions          ) as any; }
  get _workingDirectory      ():string       { return this._wsConfig.get( EConfigurationIds.workingDirectory      ) as any; }
  get  decoupledExecution    ():boolean      { return this._wsConfig.get( EConfigurationIds.decoupledExecution    ) as any; }
  get  commandLineArguments  ():string[]     { return this._wsConfig.get( EConfigurationIds.commandLineArguments  ) as any; }
  get  multiInst             ():boolean      { return this._wsConfig.get( EConfigurationIds.multiInst             ) as any; }
  get  skipSessionHandling   ():string       { return this._wsConfig.get( EConfigurationIds.skipSessionHandling   ) as any; }
  get  openFolderAsWorkspace ():string       { return this._wsConfig.get( EConfigurationIds.openFolderAsWorkspace ) as any; }
  get  filesInFolderPattern  ():string       { return this._wsConfig.get( EConfigurationIds.filesInFolderPattern  ) as any; }
  get  preserveCursor        ():boolean      { return this._wsConfig.get( EConfigurationIds.preserveCursor        ) as any; }

}

//==============================================================================

export class ConfigSnapshot extends ConfigProxy {
//
            static readonly CPrefix                        = 'openInNpp'
    private static         _current:ConfigSnapshot | null = null;
//
static modificationSignalled( this:undefined, ü_change:ßß_vsCode.ConfigurationChangeEvent ):void {
    if ( ConfigSnapshot._current === null ) { return; }
  //
    if (   ü_change.affectsConfiguration( ConfigSnapshot   .CPrefix                    ) ) {
      if ( ü_change.affectsConfiguration( EConfigurationIds.extendExplorerContextMenu )
        || ü_change.affectsConfiguration( EConfigurationIds.extendEditorContextMenu   )
        || ü_change.affectsConfiguration( EConfigurationIds.extendEditorTitleMenu     )
         ) { return; }
      const ü_exe
         = ü_change.affectsConfiguration( EConfigurationIds.executable )
         ConfigSnapshot._current  =  null;
      if ( ü_exe ) {
        if(ß_trc){ß_trc( EConfigurationIds.executable );}
      }
    }
}
//
static get current():ConfigSnapshot {
    if ( this._current === null ) {
         this._current = new ConfigSnapshot( ßß_vsCode.workspace.getConfiguration() );
    }
    return this._current;
}
//
                 executable?:string
    readonly whenExecutable = this._whenExecutable();
    readonly whenWorkingDir = ConfigHandler.whenWorkingDir( super._workingDirectory );
//
private async _whenExecutable():Promise<string> {
    return this.executable = await ConfigHandler.whenExecutable( super._executable );
}
//
}

//==============================================================================
  type TResolve<T> = (value:T) => void

class LockHandler<T> {
    private          _pending   = false;
    private readonly _queue     :TResolve<T>[] = [];
    private readonly _getter    :() => T
//
constructor(        ü_getter    :() => T
                  , ü_that      :any
){
    this._getter = ü_getter.bind( ü_that );
}
//
async whenLocked():Promise<T> {
      if ( this._pending     ) { return new Promise(  (ü_resolve) => { this._queue.push( ü_resolve ); }  ); }
    else { this._pending = true; return this._getter()                                                    ; }
  //
}
//
release():void {
    if ( this._queue.length > 0 )
       { this._queue.shift()! ( this._getter() ); }
    else { this._pending = false; }
}

}

//==============================================================================
  const SINITIAL = Symbol();
  const enum EHistStates {
    IDLE = 0
  , LOCKED
  , DIRTY
  }
//------------------------------------------------------------------------------
  type TINITIAL = typeof SINITIAL
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
//------------------------------------------------------------------------------
  type THistFolders = string[]
interface IHistoryData {
    dummy   :number[]
    admin   :
      { version :number
      }
    folders :THistFolders
}
export class History implements IHistoryData {
//
//static get():History { return new History(); }
//
    private readonly _initials:THistInitials<IHistoryData> =
      { dummy  : () => []
      , admin  : () => { return { version: 0 }; }
      , folders: () => []
      };
    private readonly _buffer :THistBuffer<IHistoryData> =
      { dummy  : SINITIAL
      , admin  : SINITIAL
      , folders: SINITIAL
      };
    private readonly _state  :THistBufferState<IHistoryData> =
      { dummy  : EHistStates.IDLE
      , admin  : EHistStates.IDLE
      , folders: EHistStates.IDLE
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

async whenCommitted( ...ü_mKeys:( keyof IHistoryData )[] ):Promise<number> {
  //
    for ( const ü_mKey of ü_mKeys ) {
      this._state[ ü_mKey ] = EHistStates.DIRTY;
    }
  //
    const ü_all:Thenable<void>[] = [];
    let ü_mKey:keyof THistBufferState<IHistoryData>
    for ( ü_mKey in this._state ) {
      switch ( this._state[ ü_mKey ] ) {
        case EHistStates.DIRTY:
          this._state[ ü_mKey ] = EHistStates.IDLE;
          ü_all.push( this._dataApi.update( ü_mKey, this._buffer[ ü_mKey ] ) );
      }
    }
    if ( ü_all.length > 0 ) {
      await Promise.all( ü_all );
    }
    if(ß_trc){ß_trc( `History updates ${ ü_all.length }` );}
      return ü_all.length;
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

private async _lock<P extends keyof IHistoryData>( ü_mKey:P ):Promise<IHistoryData[P]> {
    switch ( this._state[ ü_mKey ] ) {
      case EHistStates.IDLE:
             this._state[ ü_mKey ] = EHistStates.LOCKED;
        return this._getter( ü_mKey );
    }
    const ü_oref = createPromise<IHistoryData[P]>();
    return ü_oref.promise;
}

get folders()         :IHistoryData['folders']   { return this._getter( 'folders'             ); }
get admin  ()         :IHistoryData['admin']     { return this._getter( 'admin'               ); }
get dummy  ()         :IHistoryData['dummy']     { return this._getter( 'dummy'               ); }
set folders( ü_folders:IHistoryData['folders'] ) {        this._setter( 'folders' , ü_folders ); }
set admin  ( ü_admin  :IHistoryData['admin']   ) {        this._setter( 'admin'   , ü_admin   ); }
set dummy  ( ü_dummy  :IHistoryData['dummy']   ) {        this._setter( 'dummy'   , ü_dummy   ); }

async getAdmin  ()    :Promise<IHistoryData['admin']>     { return this._getter( 'admin'               ); }

}

//==============================================================================
/*
*/