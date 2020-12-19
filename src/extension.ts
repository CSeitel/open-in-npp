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
  type TExtension = ßß_vsCode.Extension<TOpenInNpp>

export default class ExtensionRuntime {
    static readonly CExtensionId                             = 'CSeitel.open-in-npp';
    static readonly developerTrace :false|typeof console.log = console.log;
    static          activeInstance :ExtensionRuntime //|undefined = undefined;
  //
    readonly GSDataApi    :ßß_vsCode.Memento
    readonly WSDataApi    :ßß_vsCode.Memento
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
    this.GSDataApi    = this.context.globalState    ;
    this.globalHistory = new History( this.WSDataApi    = this.context.globalState );
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

export function activate( ü_extnContext: ßß_vsCode.ExtensionContext ):void {
  //
    const ü_activeInstance = new ExtensionRuntime( ü_extnContext );
  //
  //if ( )
    const ü_globalHistory = new History( ü_activeInstance.GSDataApi );
    const ü_old = ü_globalHistory.version;
    const ü_new = parseInt( ü_activeInstance.version.replace( /\./g, '' ) );
    if ( ü_new > ü_old ) {
      if(ß_trc){ß_trc( ü_new );}
    //ü_activeInstance.GSDataApi.update( 'version', ü_new );
    }
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
}

export function deactivate():void {}

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
  const SINITIAL = Symbol();
export class History {
    private _version   :number | typeof SINITIAL = SINITIAL;
    private _allUpdates:Thenable<void>[] = [];
constructor(
    private readonly _dataStore:ßß_vsCode.Memento
){}

async whenIdle():Promise<number> {
    let ü_count = 0;
    while ( this._allUpdates.length > 0 ) {
      const ü_all = this._allUpdates.slice(0);
            this._allUpdates.length = 0;

      ü_count += ( await Promise.all( ü_all ) ).length;
    }
    if(ß_trc){ß_trc( `History updates ${ ü_count }` );}
    return ü_count;
}

get version():number {
    if ( this._version === SINITIAL ) {
         this._version = this._dataStore.get<number>( 'version' ) || 0;
    }
    return this._version;
}

set version( ü_version:number ) {
    this._version = ü_version;
    this._dataStore.update( 'version', ü_version );
}

get dummy():number[] {
    return this._dataStore.get<number[]>( 'dummy' ) || [ 0 ];
}

set dummy( ü_dummy:number[] ) {
    this._allUpdates.push(
    this._dataStore.update( 'dummy', ü_dummy )

    );
}

}

//==============================================================================
/*
*/