'use strict';

var ServerBrowser = (function () {

	var elRoot = $.GetContextPanel().FindChildInLayoutFile('ServerBrowserContainer');
	var elRefreshBtn = $.GetContextPanel().FindChildInLayoutFile('ServersRefreshBtn');
	var steamAPIKey = null;

	function _Init() {
		elRoot.SetDialogVariable("servers_count", 0);

		var config = $.LoadKeyValuesFile('panorama/config.res');

		if(!config || !config.steam_api_token) {
			var elLabel = elRoot.FindChildInLayoutFile( 'nodata-label' );
			elLabel.text = "You need to write your steam api key to file <b>csgo/panorama/config.res</b>";

			elRefreshBtn.enabled = false;
			_SetState('nodata');

			return;
		} else {
			steamAPIKey = config.steam_api_token;
		}

		_RefreshList(false);
	}

	function _HTTPRequest(url, type, data, callback) {
        var request = {
            type: type,
            data: data,
            success: function (response) {
                if (callback) callback(null, response);
            },
            error: function (error) {
                if (callback) callback(error, null);
            }
        };
    
        $.AsyncWebRequest(url, request);
    }

	function _BuildList(servers)
	{
		var elLister = elRoot.FindChildInLayoutFile( 'info-list' );

		if ( elLister === undefined || elLister === null || !servers ) {
			elRefreshBtn.enabled = true;
			return;
		}
		
		elLister.RemoveAndDeleteChildren();
		elRefreshBtn.enabled = true;

		servers['servers'].sort((a, b) => b.players - a.players);

		elRoot.SetDialogVariable("servers_count", servers['servers'].length);

		servers['servers'].forEach( function( server, i )
		{
			var elEntry = $.CreatePanel( 'Panel', elLister, 'server_'+i, {
				acceptsinput: true
			} );
		
			let contextMenu = [
				{
					label: $.Localize('Connect'),
					jsCallback: () => {
						GameInterfaceAPI.ConsoleCommand('connect '+server.addr);
					},
				},
				{
					label: $.Localize('Copy IP'),
					jsCallback: () => {
						SteamOverlayAPI.CopyTextToClipboard(server.addr);
						UiToolkitAPI.HideTextTooltip();
						UiToolkitAPI.ShowTextTooltipOnPanel(
							elLister.FindChildTraverse('name'),
							'Copied to clipboard'
						);
						$.Schedule(1, () => UiToolkitAPI.HideTextTooltip());
					},
				}
			];
		
			elEntry.SetPanelEvent('ondblclick', () => {
				GameInterfaceAPI.ConsoleCommand('connect '+server.addr);
			});
		
			elEntry.BLoadLayoutSnippet( 'serverbrowser_server' );

			elEntry.FindChildTraverse( 'Secure' ).visible = server.secure;
			elEntry.FindChildTraverse( 'Password' ).visible = false;
			elEntry.FindChildTraverse( 'AppIdConflict' ).visible = false;

			if(!server.Secure && !server.Password && !server.AppID)
				elEntry.FindChildTraverse( 'server_status' ).visible = false;
	
			elEntry.SetDialogVariable( 'name', server.name );
			elEntry.SetDialogVariable( 'players', server.players+"/"+server.max_players );
			elEntry.SetDialogVariable( 'map', server.map );

			var mapImage = elEntry.FindChildTraverse( 'MapBackground' );
			var mapIcon = elEntry.FindChildTraverse( 'MapIcon' );

			mapImage.style.backgroundImage = 'url("file://{images}/map_icons/screenshots/1080p/' + server.map + '.png")';
			mapImage.style.backgroundPosition = '0% 65%';
			mapImage.style.backgroundSize = 'auto auto';

			mapIcon.SetImage( 'file://{images}/map_icons/map_icon_' + server.map + '.svg' )

			$.RegisterEventHandler( 'ImageFailedLoad', mapIcon, function(mapIcon) {mapIcon.SetImage( 'file://{images}/map_icons/map_icon_none.png' )}.bind(null, mapIcon) );
			$.RegisterEventHandler( 'ImageFailedLoad', mapImage, function(mapImage) {mapImage.style.backgroundImage = 'url("file://{images}/map_icons/screenshots/1080p/default.png")';}.bind(null, mapImage) );

			var elButtons = elEntry.FindChildTraverse( 'server_buttons' );
			
			var elConnectButton = $.CreatePanel( 'Button', elButtons, 'JoinToServer'+i );

			$.CreatePanel( 'Image', elConnectButton, 'JoinToServerImage'+i, {
				texturewidth: '32',
				textureheight: '-1',
				src: 'file://{images}/icons/ui/play.svg'
			} );

			elConnectButton.SetPanelEvent('onactivate', () => {
				GameInterfaceAPI.ConsoleCommand('connect '+server.addr);
			});
			elConnectButton.SetPanelEvent('onmouseover', () => {
				UiToolkitAPI.ShowTextTooltip( 'JoinToServer'+i, 'Connect' );
			});
			elConnectButton.SetPanelEvent('onmouseout', () => {
				UiToolkitAPI.HideTextTooltip();
			});

		});
		_SetState('list');
	};

	function _RefreshList(cycle) {
		if(!steamAPIKey) return;
		if(!cycle) $.Schedule( 30.0, _RefreshList );

		elRefreshBtn.enabled = false;
		_SetState('loading');

		_HTTPRequest(`https://api.steampowered.com/IGameServersService/GetServerList/v1/?key=${steamAPIKey}&filter=%5Cappid%5C${SteamOverlayAPI.GetAppID()}%5Cgametype%5Ccsgo_gc&limit=100`, 'GET', {}, function(error, response) {
			if(!error) {
				_BuildList(response['response']);
			} else {
				_OnServerReceiveFailed(error);
			}
		});
	}


	function _OnServerReceiveFailed(error) {
		var elLabel = elRoot.FindChildInLayoutFile( 'nodata-label' );
		elLabel.text = "Ошибка получения списка серверов. Статус: "+error.status;

		elRefreshBtn.enabled = true;
	
		_SetState('nodata');
	}

	function _SetState(type)
    {
		var elLoading = elRoot.FindChildInLayoutFile( 'info-loading' );
		var elNoData = elRoot.FindChildInLayoutFile( 'info-nodata' );
		var elList = elRoot.FindChildInLayoutFile( 'info-list' );
        switch (type) {
            case 'loading':
                elLoading.SetHasClass( 'hidden', false );
		        elNoData.SetHasClass( 'hidden', true );
		        elList.SetHasClass( 'hidden', true );
                break;
            case 'nodata':
                elLoading.SetHasClass( 'hidden', true );
		        elNoData.SetHasClass( 'hidden', false );
		        elList.SetHasClass( 'hidden', true );
                break;
            case 'list':
                elLoading.SetHasClass( 'hidden', true );
		        elNoData.SetHasClass( 'hidden', true );
		        elList.SetHasClass( 'hidden', false );
                break;
        }
    }

	return {
		Init: _Init,
		BuildServerBrowser: _BuildList,
		RefreshList: _RefreshList,
		OnServerReceiveFailed: _OnServerReceiveFailed
	};
})();
