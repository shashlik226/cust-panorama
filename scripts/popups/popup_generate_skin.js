'use strict';

var PopupGenerateSkins = ( function()
{
    var jsStickerCallbackHandle;
	var weapons = [ 4,32,61,2,36,30,3,63,1,64,7,16,60,13,10,40,39,8,9,11,38,17,34,33,23,24,19,26,35,25,29,27,14,28,49,42,59,500,505,506,507,508,509,515,512,516,514,522,519,523,520,521,517,518,503,525,5027,5030,5031,5032,5033,5034,5035,4725,1314 ];
    var stickers = {};
	var skins = [];
	var gloves = [];
	var music = [];

	var latestWeaponSlot = '';
    
	function _Init()
	{
	    $.CreatePanel('ItemPreviewPanel', $.GetContextPanel().FindChildInLayoutFile('Options'), 'ItemPreview', {
	    	manifest: 'resource/ui/econ/ItemModelPanelCharWeaponInspect.res',
	    	enable_floorshadow: true,
	    	mouse_rotate: true
	    });
	    $.GetContextPanel().FindChildInLayoutFile('Rarity').SetSelected( 'rare' );
	    $.GetContextPanel().FindChildInLayoutFile('Quality').SetSelected( 'unique' );

		weapons.forEach(weapon => {
			var itemName = InventoryAPI.GetItemName(InventoryAPI.GetFauxItemIDFromDefAndPaintIndex( weapon, 0 ));
			var elDropdown = $.GetContextPanel().FindChildInLayoutFile('Weapon');
			var newEntry = $.CreatePanel('Label', elDropdown, "item"+weapon, {
				class: 'DropDownMenu Width-250 White',
				value: weapon,
				text: itemName
			});

			elDropdown.AddOption(newEntry);
		});
		$.GetContextPanel().FindChildInLayoutFile('Weapon').SetSelected( 'item'+weapons[0] );
		$.GetContextPanel().FindChildInLayoutFile('Weapon').SetPanelEvent('oninputsubmit', _OnWeaponDropdownChange);

		_GetAllPaints();
		
		_OnWeaponDropdownChange();
        jsStickerCallbackHandle = UiToolkitAPI.RegisterJSCallback( _UpdateSticker );
	}

	function _GetAllPaints()
	{
		for (var i = 0; i < 2000; i++) {
			var itemId = InventoryAPI.GetFauxItemIDFromDefAndPaintIndex( 1, i );
			var itemName = InventoryAPI.GetItemName(itemId);

			if(itemName)
				itemName = itemName.split(' | ')[1];

			if(itemName == '' || itemName == undefined || !itemName)
				continue;
			
			skins.push({id: i, itemid: itemId, name: itemName});
		}
		for (var i = 10000; i < 10100; i++) {
			var itemId = InventoryAPI.GetFauxItemIDFromDefAndPaintIndex( 5027, i );
			var itemName = InventoryAPI.GetItemName(itemId);

			if(itemName)
				itemName = itemName.split(' | ')[1];

			if(itemName == '' || itemName == undefined || !itemName)
				continue;
			
			gloves.push({id: i, itemid: itemId, name: itemName});
		}
		for (var i = 0; i < 100; i++) {
			var itemId = InventoryAPI.GetFauxItemIDFromDefAndPaintIndex( 1314, i );
			var itemName = InventoryAPI.GetItemName(itemId);

			if(itemName)
				itemName = itemName.split(' | ')[1];

			if(itemName == '' || itemName == undefined || !itemName)
				continue;
			
			music.push({id: i, itemid: itemId, name: itemName});
		}
	}

	function _FillDropdown() {
		var weapon = $.GetContextPanel().FindChildInLayoutFile('Weapon').GetSelected().GetAttributeString( "value", "" );
		var slot = InventoryAPI.GetSlot( InventoryAPI.GetFauxItemIDFromDefAndPaintIndex( weapon, 0 ) );
		
		if(['secondary', 'smg', 'rifle', 'heavy', 'c4', 'melee'].includes(slot))
			slot = 'weapon';

		if(latestWeaponSlot == slot)
			return;

		var items = undefined;

		switch (slot) {
			case 'clothing':
				items = gloves;
				break;
			case 'musickit':
				items = music;
				break;
			default:
				items = skins;
				break;
		}

		var elDropdown = $.GetContextPanel().FindChildInLayoutFile('Paint');
		elDropdown.ClearPanelEvent('oninputsubmit');
		elDropdown.RemoveAllOptions();
		elDropdown.RemoveAndDeleteChildren();

		var fieldEntry = $.CreatePanel('Label', elDropdown, "showfromfield", {
			class: 'DropDownMenu Width-250 White',
			value: 'showfromfield',
			text: 'Custom'
		});

		elDropdown.AddOption(fieldEntry);

		items.forEach(item => {
			var newEntry = $.CreatePanel('Label', elDropdown, "item"+item.id, {
				class: 'DropDownMenu Width-250 White',
				value: item.id,
				text: item.name+` (${item.id})`
			});

			elDropdown.AddOption(newEntry);
		});

		elDropdown.SetSelected( 'item'+items[0].id );
		elDropdown.SetPanelEvent('oninputsubmit', _UpdateWeaponPreview);

		latestWeaponSlot = slot;
	}

	function _OnWeaponDropdownChange()
	{
		var itemId = _GetSelectedWeaponFauxItemId();

		var schema = InventoryAPI.BuildItemSchemaDefJSON( itemId );
		if(schema != undefined)
		{
			var schemaJSO = JSON.parse(schema);

			$.GetContextPanel().FindChildInLayoutFile('StickersGroup').SetHasClass('hidden', !schemaJSO.hasOwnProperty('stickers'))

			if(schemaJSO.hasOwnProperty('stickers')) {
				var availableSlots = Object.keys(schemaJSO['stickers']).length;
				for (var i = 0; i < 5; i++) {
					var stickerPanel = $.GetContextPanel().FindChildInLayoutFile('sticker'+i);
					stickerPanel.SetHasClass('hidden', !schemaJSO['stickers'].hasOwnProperty(i.toString()));
				}
			}
		}
		

		_FillDropdown();
		_UpdateWeaponPreview();
	}

	function _UpdateWeaponPreview()
	{
		var elPanel = $.GetContextPanel().FindChildInLayoutFile('ItemPreview');
		elPanel.SetScene( "resource/ui/econ/ItemModelPanelCharWeaponInspect.res",
			'img://inventory_'+_GetSelectedWeaponFauxItemId(),
			false
		);
	}

	function _GetSelectedPaintId()
	{
		var skinId = $.GetContextPanel().FindChildInLayoutFile('Paint').GetSelected().GetAttributeString( "value", "" );

		$.GetContextPanel().FindChildInLayoutFile('PaintFieldGroup').SetHasClass('hidden', skinId != 'showfromfield');

		if(skinId == 'showfromfield')
			skinId = $.GetContextPanel().FindChildInLayoutFile('PaintField').text;

		if(skinId == '')
			skinId = 2;

		return skinId;
	}

	function _GetSelectedWeaponFauxItemId()
	{
		var weapon = $.GetContextPanel().FindChildInLayoutFile('Weapon').GetSelected().GetAttributeString( "value", "" );
		var paint = _GetSelectedPaintId();
	
		return InventoryAPI.GetFauxItemIDFromDefAndPaintIndex( weapon, paint );
	}

    function _SelectStickerAction(slot)
    {
        UiToolkitAPI.ShowCustomLayoutPopupParameters( 
		    '', 
		    'file://{resources}/layout/popups/popup_generate_select_sticker.xml', 
		    'slot='+slot+'&callback='+jsStickerCallbackHandle 
        );
    }

    function _UpdateSticker(stickerDefIdx, slot)
    {
        var stickerPanel = $.GetContextPanel().FindChildInLayoutFile('sticker'+slot);

        if(stickerDefIdx == 0) {
            if(stickers.hasOwnProperty(slot))
                delete stickers[slot];

            stickerPanel.SetImage("file://{images}/icons/ui/plus.svg");
            stickerPanel.ClearPanelEvent("onmouseover");
            return;
        }

        stickers[slot] = {id: stickerDefIdx, wear: 0.0};

        var itemId = InventoryAPI.GetFauxItemIDFromDefAndPaintIndex( 1209, stickerDefIdx );

        stickerPanel.itemid = itemId;

        stickerPanel.SetPanelEvent( 'onmouseover', function()
        {
            UiToolkitAPI.ShowCustomLayoutParametersTooltip('sticker'+slot, 'JsStickerTooltip', 'file://{resources}/layout/tooltips/tooltip_inventory_item.xml', 'itemid=' + itemId);
        }.bind( undefined ) );

		stickerPanel.SetPanelEvent( 'onmouseout', function()
		{
            UiToolkitAPI.HideCustomLayoutTooltip('JsStickerTooltip');
			UiToolkitAPI.HideTextTooltip();
		} );
    }

    function _ChangeStattrakState() {
        var isSelected = $.GetContextPanel().FindChildInLayoutFile('includeStattrak').IsSelected();
        var qualityDropDown = $.GetContextPanel().FindChildInLayoutFile('Quality')

        qualityDropDown.enabled = !isSelected;
    }

  	function _CreateItem()
	{
		var weapon = $.GetContextPanel().FindChildInLayoutFile('Weapon').GetSelected().GetAttributeString( "value", "" );
        var skin = _GetSelectedPaintId();
        var seed = $.GetContextPanel().FindChildInLayoutFile('PaintSeed').text;
        var wear = $.GetContextPanel().FindChildInLayoutFile('PaintWeer').text;

		var rarity = $.GetContextPanel().FindChildInLayoutFile('Rarity').GetSelected().GetAttributeString( "value", "" );
		var quality = $.GetContextPanel().FindChildInLayoutFile('Quality').GetSelected().GetAttributeString( "value", "" );

		var includeStattrak = $.GetContextPanel().FindChildInLayoutFile('includeStattrak').IsSelected();

		var options = '';

		if(skin == '')
			skin = 2;

		if(seed == '')
			seed = Math.floor(Math.random() * 1000) + 1;

		if(wear == '')
			wear = (Math.random()).toFixed(6);

		if(rarity != "-1")
			options += `rarity=${rarity} `;

		if(includeStattrak) {
			options += `stattrak=1 `;
			quality = 9;
		}

		if(weapon != 1314) {
			options += `paint=${skin} seed=${seed} wear=${wear} `;
		} else {
			options += `music=${skin} `
		}

        Object.keys(stickers).forEach( function(key)
        {
            var sticker = stickers[key];
            options += `sticker${key}=${sticker.id} sticker${key}_wear=${sticker.wear} `;
        });

        GameInterfaceAPI.ConsoleCommand(`rcon give_item ${weapon} 1 ${options} quality=${quality}`);
	}

	function _Inspect()
	{
		UiToolkitAPI.ShowCustomLayoutPopupParameters(
			'',
			'file://{resources}/layout/popups/popup_inventory_inspect.xml',
			'itemid=' + _GetSelectedWeaponFauxItemId() +
			'&' + 'inspectonly=true' +
			'&' + 'viewfunc=primary',
			'none'
		);
	}

	function _CopyItemID()
	{
		SteamOverlayAPI.CopyTextToClipboard( _GetSelectedWeaponFauxItemId() );
	}

	return {
        Init: _Init,
        UpdateWeaponPreview: _UpdateWeaponPreview,
        CopyItemID: _CopyItemID,
        Inspect: _Inspect,
        SelectStickerAction: _SelectStickerAction,
        CreateItem: _CreateItem,
        ChangeStattrakState: _ChangeStattrakState,
		OnWeaponDropdownChange: _OnWeaponDropdownChange
	};

})();