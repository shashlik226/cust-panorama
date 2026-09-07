'use strict';

var PopupGenerateSelectPaint = ( function()
{
    var items = [];
    var weapons = [ 4,32,61,2,36,30,3,63,1,64,7,16,60,13,10,40,39,8,9,11,38,17,34,33,23,24,19,26,35,25,29,27,14,28,49,42,59 ];
    var itemSets = [];

    function _CreatePanels() {
		var itemNamefilter = $.GetContextPanel().FindChildInLayoutFile('itemsFilter').text.toLowerCase();
		var itemWeaponfilter = $.GetContextPanel().FindChildInLayoutFile('Weapon').GetSelected().GetAttributeString( "value", "" );
		var itemRarityfilter = $.GetContextPanel().FindChildInLayoutFile('Rarity').GetSelected().GetAttributeString( "value", "" );
		var itemSetfilter = $.GetContextPanel().FindChildInLayoutFile('ItemSet').GetSelected().GetAttributeString( "value", "" );

        var filteredItems = items.filter(item => {
            var matchesName = !itemNamefilter || (item.itemName && item.itemName.toLowerCase().includes(itemNamefilter));
            var matchesWeapon = !itemWeaponfilter || itemWeaponfilter === "none" || item.weaponId == itemWeaponfilter;
            var matchesRarity = !itemRarityfilter || itemRarityfilter === "none" || item.rarity == itemRarityfilter;
            var matchesSet = !itemSetfilter || itemSetfilter === "none" || item.itemSet == itemSetfilter;

            return matchesName && matchesWeapon && matchesRarity && matchesSet;
        });

        var container = $.GetContextPanel().FindChildInLayoutFile('id-popup-items');
        container.RemoveAndDeleteChildren();

        filteredItems.forEach(item => {
            var panelId = 'item' + item.paintId + item.weaponId;
            var elItem = $.CreatePanel("ItemImage", container, panelId,
                {
                    itemid: item.itemid,
                    class: 'popup-tournament-select-spray-team'
                }
            );

            elItem.SetPanelEvent( 'onactivate', function()
            {
                var callbackHandle = $.GetContextPanel().GetAttributeInt( "callback", -1 );
		        if ( callbackHandle != -1 )
		        {
		        	UiToolkitAPI.InvokeJSCallback( callbackHandle, item );
		        }

		        $.DispatchEvent( 'UIPopupButtonClicked', '' );
            }.bind( undefined ) );

            elItem.SetPanelEvent( 'oncontextmenu', function()
            {
    	        UiToolkitAPI.ShowSimpleContextMenu( '', 'PaintContextMenu', [
		        	{ label: 'Create item', jsCallback: function() {
                        GameInterfaceAPI.ConsoleCommand(`rcon give_item ${item.weaponId} 1 paint=${item.paintId}`);
                    } },
		        	{ label: 'Copy Faux ItemId to Clipboard', jsCallback: function() {
		        		SteamOverlayAPI.CopyTextToClipboard( item.itemid );
		        	} },
		        	{ label: 'Copy create command to Clipboard', jsCallback: function() {
		        		SteamOverlayAPI.CopyTextToClipboard( `give_item ${item.weaponId} 1 paint=${item.paintId}` );
		        	} }
		        ]);
            }.bind( undefined ) );

            elItem.SetPanelEvent( 'onmouseover', function()
            {
                UiToolkitAPI.ShowCustomLayoutParametersTooltip(panelId, 'JsItemTooltip', 'file://{resources}/layout/tooltips/tooltip_inventory_item.xml', 'itemid=' + item.itemid);
            }.bind( undefined ) );

		    elItem.SetPanelEvent( 'onmouseout', function()
		    {
                UiToolkitAPI.HideCustomLayoutTooltip('JsItemTooltip');
		    	UiToolkitAPI.HideTextTooltip();
		    } );
        });
    }

	function _Init()
	{
        var globalObject = UiToolkitAPI.GetGlobalObject();
        if(globalObject.hasOwnProperty('selectPaintCache')) {
            items = globalObject['selectPaintCache'];
            itemSets = globalObject['selectPaintItemSetsCache'];
        } else {
            weapons.forEach(weapon => {
                for (var i = 0; i < 2000; i++) {
		    	    var itemId = InventoryAPI.GetFauxItemIDFromDefAndPaintIndex( weapon, i );
		        	var itemName = InventoryAPI.GetItemName(itemId);

		        	if(itemName == '' || itemName == undefined || !itemName)
		        		continue;

		    		var itemSet = InventoryAPI.GetSet( itemId );
                    if(itemSet == undefined)
                        continue;
                    
                    var itemRarity = InventoryAPI.GetItemRarity(itemId);

		        	items.push({
                        paintId: i,
                        weaponId: weapon,
                        itemid: itemId,
                        itemName: itemName,
                        itemSet: itemSet,
                        rarity: itemRarity
                    });

                    if (!itemSets.includes(itemSet)) {
                        itemSets.push(itemSet);
                    }
		        }
		    });
            globalObject['selectPaintCache'] = items;
            globalObject['selectPaintItemSetsCache'] = itemSets;
        }

        var elWeaponDropdown = $.GetContextPanel().FindChildInLayoutFile('Weapon');
		weapons.forEach(weapon => {
			var itemName = InventoryAPI.GetItemName(InventoryAPI.GetFauxItemIDFromDefAndPaintIndex( weapon, 0 ));
			var newEntry = $.CreatePanel('Label', elWeaponDropdown, "item"+weapon, {
				class: 'DropDownMenu Width-300 White',
				value: weapon,
				text: itemName
			});

			elWeaponDropdown.AddOption(newEntry);
		});

        var elItemSetDropdown = $.GetContextPanel().FindChildInLayoutFile('ItemSet');
		itemSets.forEach(itemSet => {
			var newEntry = $.CreatePanel('Label', elWeaponDropdown, "item"+itemSet, {
				class: 'DropDownMenu Width-300 White',
				value: itemSet,
				text: $.Localize('#CSGO_'+itemSet)
			});

			elItemSetDropdown.AddOption(newEntry);
		});
    
		elWeaponDropdown.SetSelected( 'item'+weapons[0] );
	    elItemSetDropdown.SetSelected( 'none' );
	    $.GetContextPanel().FindChildInLayoutFile('Rarity').SetSelected( 'none' );
        _CreatePanels();
	}

	return {
        Init: _Init,
        CreatePanels: _CreatePanels
	};

})();