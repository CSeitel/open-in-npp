/*
*/
  import { EConfigurationIds
         } from './constants/extension';
//--------------------------------------------------------------------
  import * as ßß_vsCode from 'vscode';
  import ExtensionRuntime
          from './core/runtime';
  import { CCommandHandlerMap
         } from './core/runtime';
  import { ConfigSnapshot
         } from './core/configProxy';
  import { CommandHandler
         } from './core/implementation';
//====================================================================

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

export async function deactivate():Promise<void> {
  /*
    const ü_hist = ExtensionRuntime.activeInstance.globalHistory;
    ü_hist.dummy = [ Date.now() ];
    await ü_hist.whenCommitted();
    if(ß_trc){ß_trc( `Deactivation` );}
  */
}

//--------------------------------------------------------------------
//--------------------------------------------------------------------
/*
*/