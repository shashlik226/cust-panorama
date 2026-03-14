function setupTooltip()
{
    var ctx = $.GetContextPanel();
	var id = ctx.GetAttributeString("itemid", "0");
	
	                          
	var bThisIsFauxItemID = InventoryAPI.IsFauxItemID( id );

           
    ctx.SetDialogVariable('name', InventoryAPI.GetItemName(id));

                  
    var strDesc = InventoryAPI.GetItemDescription(id);
    if (strDesc.endsWith('<br>'))
    {
                               
        strDesc = strDesc.slice(0, -4);
    }
    ctx.SetDialogVariable('description', strDesc);

                          
    var strSetName = InventoryAPI.GetTag(id, 'ItemSet');
    var strSetLoc = undefined;
    if (strSetName && strSetName != '0')
        strSetLoc = InventoryAPI.GetTagString(strSetName);

	if (strSetName && strSetName != '0')
	{
	    ctx.AddClass('tooltip-inventory-item__has-set');
	    $('#CollectionLogo').SetImage('file://{images_econ}/econ/set_icons/' + strSetName + '_small.png');
	    ctx.SetDialogVariable('collection', strSetLoc);
	}
	else
	{
	    ctx.RemoveClass('tooltip-inventory-item__has-set');
	    $('#CollectionLogo').SetImage('');
	    ctx.SetDialogVariable('collection', '');
	}

                             
	var rarity = InventoryAPI.GetItemRarity(id);
	var rarityName = InventoryAPI.GetItemType(id);

	if (rarityName)
	{
	    ctx.AddClass('tooltip-inventory-item__has-rarity');
	    ctx.SwitchClass('tooltip-rarity', 'tooltip-inventory-item__rarity-' + rarity);
	    ctx.SetDialogVariable('rarity', rarityName);
	}
	else
	{
	    ctx.RemoveClass('tooltip-inventory-item__has-rarity');
	    ctx.SetDialogVariable('rarity', '');
	}

                              
	var numWear = bThisIsFauxItemID ? undefined : InventoryAPI.GetWear(id);
	if (numWear != undefined && numWear >= 0)
	{
	    ctx.AddClass('tooltip-inventory-item__has-grade');
	    ctx.SetDialogVariable('grade', $.Localize('#SFUI_InvTooltip_Wear_Amount_' + numWear));
	}
	else
	{
	    ctx.RemoveClass('tooltip-inventory-item__has-grade');
	    ctx.SetDialogVariable('grade', '');
	}

                
	var strTeam = InventoryAPI.GetItemTeam(id);

                               
	var strSlot = InventoryAPI.GetSlot(id);
	if (!strSlot || strSlot === 'flair0' || strSlot === 'musickit' || strSlot === 'spray0')
	{
	    strTeam = undefined;
	}

	if (strTeam)
	{
	    ctx.AddClass('tooltip-inventory-item__has-team');
	    ctx.SetDialogVariable('team', $.Localize(strTeam));

	    var bAny = (strTeam == '#CSGO_Inventory_Team_Any');
	    var bCT = bAny || (strTeam == '#CSGO_Inventory_Team_CT');
	    var bT = bAny || (strTeam == '#CSGO_Inventory_Team_T');

	    ctx.SetHasClass('tooltip-inventory-item__team-ct', bCT);
	    ctx.SetHasClass('tooltip-inventory-item__team-t', bT);
    }
	else
	{
	    ctx.RemoveClass('tooltip-inventory-item__has-team');
	    ctx.RemoveClass('tooltip-inventory-item__team-ct');
	    ctx.RemoveClass('tooltip-inventory-item__team-t');
    }

	                                             
	if ( GameInterfaceAPI.GetSettingString( "cl_inventory_debug_tooltip") == "1" )
	{
		var debugOutput = "";
		var Print = function( string )
		{
			debugOutput += string + "<br />";
		}

		          
		Print( "--------------------------------------" );
		Print( "itemID: " + id );

		       
		var oTags = InventoryAPI.BuildItemTagsObject( id );

		Object.keys( oTags ).forEach( function( key, index )
		{
			var tag = oTags[ key ];

			var cat = Object.keys( tag )[0];
			var val = tag[ Object.keys( tag )[0]];

			Print( cat + ": " + val );
		});

	    var attrs = [
	        'always tradable',
	        'cannot trade',
	        'referenced item id low',
	        'referenced item id high',
	        'set item texture prefab',
	        'set item texture seed',
	        'set item texture wear',
	        'has silencer',
	        'has burst mode',
	        'cycletime when in burst mode',
	        'time between burst shots',
	        'unzoom after shot',
	        'cycletime when zoomed',
	        'cannot shoot underwater',
	        'in game price',
	        'primary clip size',
	        'secondary clip size',
	        'is full auto',
	        'heat per shot',
	        'addon scale',
	        'tracer frequency',
	        'max player speed',
	        'max player speed alt',
	        'armor ratio',
	        'crosshair min distance',
	        'crosshair delta distance',
	        'penetration',
	        'damage',
	        'range',
	        'range modifier',
	        'bullets',
	        'cycletime',
	        'time to idle',
	        'idle interval',
	        'flinch velocity modifier large',
	        'flinch velocity modifier small',
	        'spread',
	        'inaccuracy crouch',
	        'inaccuracy stand',
	        'inaccuracy jump',
	        'inaccuracy land',
	        'inaccuracy ladder',
	        'inaccuracy fire',
	        'inaccuracy move',
	        'spread alt',
	        'inaccuracy crouch alt',
	        'inaccuracy stand alt',
	        'inaccuracy jump alt',
	        'inaccuracy land alt',
	        'inaccuracy ladder alt',
	        'inaccuracy fire alt',
	        'inaccuracy move alt',
	        'recovery time crouch',
	        'recovery time stand',
	        'recoil seed',
	        'recoil angle',
	        'recoil angle variance',
	        'recoil magnitude',
	        'recoil magnitude variance',
	        'recoil angle alt',
	        'recoil angle variance alt',
	        'recoil magnitude alt',
	        'recoil magnitude variance alt',
	        'set supply crate series',
	        'minutes played',
	        'alternate icon',
	        'season access',
	        'disallow recycling',
	        'upgrade threshold',
	        'tradable after date',
	        'is revolver',
	        'scope dot model',
	        'elevate quality',
	        'cycletime alt',
	        'kill eater',
	        'kill eater score type',
	        'kill eater user 1',
	        'kill eater user score type 1',
	        'kill eater user 2',
	        'kill eater user score type 2',
	        'kill eater user 3',
	        'kill eater user score type 3',
	        'kill eater 2',
	        'kill eater score type 2',
	        'tracer frequency alt',
	        'primary default clip size',
	        'secondary default clip size',
	        'recipe filter',
	        'competitive kills',
	        'competitive 3k',
	        'competitive 4k',
	        'competitive 5k',
	        'competitive hsp',
	        'competitive wins',
	        'competitive mvps',
	        'competitive minutes played',
	        'match wins',
	        'preferred sort',
	        'custom name attr',
	        'custom desc attr',
	        'sticker slot 0 id',
	        'sticker slot 0 wear',
	        'sticker slot 0 scale',
	        'sticker slot 0 rotation',
	        'sticker slot 1 id',
	        'sticker slot 1 wear',
	        'sticker slot 1 scale',
	        'sticker slot 1 rotation',
	        'sticker slot 2 id',
	        'sticker slot 2 wear',
	        'sticker slot 2 scale',
	        'sticker slot 2 rotation',
	        'sticker slot 3 id',
	        'sticker slot 3 wear',
	        'sticker slot 3 scale',
	        'sticker slot 3 rotation',
	        'sticker slot 4 id',
	        'sticker slot 4 wear',
	        'sticker slot 4 scale',
	        'sticker slot 4 rotation',
	        'sticker slot 5 id',
	        'sticker slot 5 wear',
	        'sticker slot 5 scale',
	        'sticker slot 5 rotation',
	        'tournament event id',
	        'tournament event stage id',
	        'tournament event team0 id',
	        'tournament event team1 id',
	        'icon display model',
	        'buymenu display model',
	        'pedestal display model',
	        'magazine model',
	        'uid model',
	        'stattrak model',
	        'aimsight capable',
	        'aimsight eye pos',
	        'aimsight pivot angle',
	        'aimsight speed up',
	        'aimsight speed down',
	        'aimsight looseness',
	        'aimsight fov',
	        'aimsight pivot forward',
	        'gifter account id',
	        'radio use sound',
	        'radio use subtitle',
	        'aimsight lens mask',
	        'music id',
	        'quest id',
	        'quest points remaining',
	        'quest reward lootlist',
	        'quests complete',
	        'operation kills',
	        'operation 3k',
	        'operation 4k',
	        'operation 5k',
	        'operation hsp',
	        'operation mvps',
	        'operation minutes played',
	        'operation wins',
	        'deployment date',
	        'use after date',
	        'expiration date',
	        'campaign id',
	        'campaign completion bitfield',
	        'last campaign completion',
	        'operation points',
	        'zoom time 0',
	        'zoom time 1',
	        'zoom time 2',
	        'zoom fov 1',
	        'zoom fov 2',
	        'hide view model zoomed',
	        'zoom levels',
	        'kill award',
	        'primary reserve ammo max',
	        'secondary reserve ammo max',
	        'campaign 1 completion bitfield',
	        'campaign 1 last completed quest',
	        'campaign 2 completion bitfield',
	        'campaign 2 last completed quest',
	        'campaign 3 completion bitfield',
	        'campaign 3 last completed quest',
	        'campaign 4 completion bitfield',
	        'campaign 4 last completed quest',
	        'campaign 5 completion bitfield',
	        'campaign 5 last completed quest',
	        'campaign 6 completion bitfield',
	        'campaign 6 last completed quest',
	        'operation bonus points',
	        'prestige year',
	        'issue date',
	        'tournament mvp account id',
	        'campaign 7 completion bitfield',
	        'campaign 7 last completed quest',
	        'campaign 8 completion bitfield',
	        'campaign 8 last completed quest',
	        'recovery time crouch final',
	        'recovery time stand final',
	        'recovery transition start bullet',
	        'recovery transition end bullet',
	        'sprays remaining',
	        'spray tint id',
	        'inaccuracy jump initial',
	        'campaign 9 completion bitfield',
	        'campaign 9 last completed quest',
	        'operation drops awarded 1',
	        'operation xp awarded 0',
	        'operation xp awarded 1',
	        'operation drops awarded 0',
	        'attack movespeed factor',
	        'allow hand flipping',
	        'is melee weapon',
	        'model right handed',
	        'weapon weight',
	        'wrong team msg',
	        'itemflag select on empty',
	        'itemflag no auto reload',
	        'itemflag no auto switch empty',
	        'itemflag limit in world',
	        'itemflag exhaustible',
	        'itemflag do hit location dmg',
	        'itemflag no ammo pickups',
	        'itemflag no item pickup',
	        'inaccuracy reload',
	        'throw velocity',
	        'bot audible range',
	        'rumble effect',
	        'inaccuracy pitch shift',
	        'inaccuracy alt sound threshold',
	        'silencer model',
	        'spread seed',
	        'special event id',
	        'upgrade level',
	        'items count',
	        'modification date',
	        'casket item id low',
	        'casket item id high',
	        'stars attained',
	        'inaccuracy jump apex',
	        'headshot multiplier',
	        'free reward status'
	    ];

		Print('itemDefIndex: '+InventoryAPI.GetItemDefinitionIndex( id ));
		for (let i = 0; i < attrs.length; i++) {
			var attr = attrs[i];
			var value = InventoryAPI.GetItemAttributeValue( id, attr );
			if(value)
				Print(attr+": "+value);
		}

		ctx.SetDialogVariable('debug_text', debugOutput);
	} else {
		ctx.SetDialogVariable('debug_text', '');
	}

}