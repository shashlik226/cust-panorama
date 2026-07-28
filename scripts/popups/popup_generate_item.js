'use strict';

var PopupGenerateItems = ( function()
{
    let items = [];

    function _Init()
	{
		for (let i = 0; i < 10000; i++) {
			var fauxItemId = InventoryAPI.GetFauxItemIDFromDefAndPaintIndex( i, 0 );
			var itemName = InventoryAPI.GetItemName(fauxItemId);

			if(itemName == '' || itemName == undefined || !itemName)
				continue;
			
			items.push({name: itemName, id: i, itemid: fauxItemId});
		}
        _CreatePanels();
	}

    function _CreatePanels() {
		var filter = $.GetContextPanel().FindChildInLayoutFile('itemsFilter').text.toLowerCase();

        var filteredItems = items.filter(item => {
            if (!filter) return true; 

            return item.name.toLowerCase().includes(filter);
        });

        var container = $.GetContextPanel().FindChildInLayoutFile('id-popup-items');
        container.RemoveAndDeleteChildren();

        filteredItems.forEach(item => {
            var elItem = $.CreatePanel("ItemImage", container, 'items' + item.id,
                {
                    itemid: item.itemid,
                    class: 'popup-tournament-select-spray-team'
                }
            );
        
            elItem.SetPanelEvent( 'onactivate', function()
            {
                var items = [
		        	{ label: 'Inspect', jsCallback: function() {
                        
                        if(ItemInfo.ItemHasCapability( item.itemid, 'decodable' ))
                            _ShowDecodePopup(item);
                        else
                            _ShowInspectPopup(item);

                    }.bind(undefined) },
		        	{ label: 'Generate', jsCallback: function() {
                        GameInterfaceAPI.ConsoleCommand(`rcon give_item ${item.id}`);
                    }.bind(undefined) },
		        	{ label: 'Copy ItemId', jsCallback: function() {
                        SteamOverlayAPI.CopyTextToClipboard( item.itemid );
                    }.bind(undefined) },
		        	{ label: 'Copy ItemSchema', jsCallback: function() {
                        SteamOverlayAPI.CopyTextToClipboard( InventoryAPI.BuildItemSchemaDefJSON( item.itemid ) );
                    }.bind(undefined) }
		        ];
            
    	        UiToolkitAPI.ShowSimpleContextMenu( '', 'ItemContextMenu', items );
            }.bind( undefined ) );
        
            elItem.SetPanelEvent( 'onmouseover', function()
            {
                UiToolkitAPI.ShowCustomLayoutParametersTooltip('items' + item.id, 'JsItemTooltip', 'file://{resources}/layout/tooltips/tooltip_inventory_item.xml', 'itemid=' + item.itemid);
            }.bind( undefined ) );
        
		    elItem.SetPanelEvent( 'onmouseout', function()
		    {
                UiToolkitAPI.HideCustomLayoutTooltip('JsItemTooltip');
		    	UiToolkitAPI.HideTextTooltip();
		    } );
        });
        
    }

    function _ShowDecodePopup(item) {
        UiToolkitAPI.ShowCustomLayoutPopupParameters(
			'popup-inspect-'+ item.itemid,
			'file://{resources}/layout/popups/popup_capability_decodable.xml',
			'key-and-case=,'+ item.itemid +
			'&extrapopupfullscreenstyle=solidbkgnd' +
			'&asyncworkitemwarning=no' +
			'&inspectonly=true' +
			'&allowtointeractwithlootlistitems=false' +
			'&asyncworktype=cartpreview' +
			'&asyncworkbtnstyle=hidden' +
            '&' + 'storeitemid=' + item.itemid,
			'none'
		);
    }

    function _ShowInspectPopup(item) {
        UiToolkitAPI.ShowCustomLayoutPopupParameters(
			'popup-inspect-'+ item.itemid,
			'file://{resources}/layout/popups/popup_inventory_inspect.xml',
			'itemid=' + item.itemid
			+ '&inspectonly=true'
			+ '&extrapopupfullscreenstyle=solidbkgnd'
			+ '&asyncworkitemwarning=no',
			'none'
		);
    }
 
	return {
        Init: _Init,
        CreatePanels: _CreatePanels
	};

})();