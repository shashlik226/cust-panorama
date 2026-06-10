"use strict";

var MainMenuStore;
(function (MainMenuStore) {

    const _m_cp = $.GetContextPanel();
    let _m_activePanelId = '';
    let _m_pagePrefix = 'id-store-page-';

    let nonPageCategories = [
        'tools',
        'nightmode',
        'nightmode2'
    ]

    function ReadyForDisplay() {

        // ugh
        _m_cp.SetDialogVariable( "tournament_name", $.Localize( '#CSGO_Watch_Cat_Events' ) );

        if (!ConnectedToGcCheck()) {
            return;
        }

        try {
            let storeItems = StoreItems.GetStoreItems();
            if (_m_activePanelId === '' || !_m_activePanelId || (storeItems.coupons && storeItems.coupons.length < 1)) {
                StoreItems.MakeStoreItemList();
            }

            if (!storeItems || typeof storeItems !== 'object') {
                return;
            }
        } catch (e) {
            return;
        }

        MakeTabsBtnsFromStoreData();

        if (_m_activePanelId === '' || !_m_activePanelId) {
            NavigateToTab('id-store-page-home');
        } else {
            NavigateToTab(_m_activePanelId);
        }
    }

    function ConnectedToGcCheck() {
        if (!MyPersonaAPI.IsInventoryValid() || !MyPersonaAPI.IsConnectedToGC()) {
            UiToolkitAPI.ShowGenericPopupOk(
                $.Localize('#SFUI_SteamConnectionErrorTitle'),
                $.Localize('#SFUI_Steam_Error_LinkUnexpected'),
                '',
                () => $.DispatchEvent('HideContentPanel')
            );
            return false;
        }
        return true;
    }

    function NavigateToTab(panelId, keyType = '') {
        if (keyType) {
            panelId = _m_pagePrefix + keyType;
        }

        if (_m_activePanelId !== panelId) {
            if (panelId === 'id-store-page-home') {
                UpdateItemsInHomeSection('coupons', 'id-store-popular-items', 5);
                UpdateItemsInHomeSection('tools', 'id-store-tools-items', 5);

                if(ItemInfo.IsValidItem(7041))
                    CreateAndUpdateItemsInHomeSection('nightmode', 'NIGHTMODE\nMusic Kits', 6, 'url("file://{images}/backgrounds/store_home_coupon_nightmode2.png")');

                if(ItemInfo.IsValidItem(7029))
                    CreateAndUpdateItemsInHomeSection('nightmode2', 'NIGHTMODE II\nMusic Kits', 6, 'url("file://{images}/backgrounds/store_home_coupon_nightmode2.png")');

            } else if (panelId === 'id-store-page-tournament') {
                MakeTournamentsPage();
            } else {
                MakePageFromStoreData(keyType);
            }

            if (_m_activePanelId) {
                let prevPanel = _m_cp.FindChildInLayoutFile(_m_activePanelId);
                if (prevPanel) {
                    prevPanel.SetHasClass('Active', false);
                }
            }

            _m_activePanelId = panelId;
            let activePanel = _m_cp.FindChildInLayoutFile(panelId);

            if (activePanel) {
                activePanel.SetHasClass('Active', true);
            }
        }
    }
    MainMenuStore.NavigateToTab = NavigateToTab;
    
    function MakeTournamentsPage() {
        let elPanel = _m_cp.FindChildInLayoutFile('id-store-page-tournament-container');

        if (elPanel) {
            Object.keys(g_Tournaments).reverse().forEach(tournamentid => {

                let elTournamentPanel = elPanel.FindChildInLayoutFile('tournament-section-'+tournamentid);
                if(elTournamentPanel) return;

                elTournamentPanel = $.CreatePanel("Panel", elPanel, 'tournament-section-'+tournamentid);
		    	elTournamentPanel.SetDialogVariable( "tournament_name", $.Localize( "#CSGO_Tournament_Event_Location_" + tournamentid ) );
                elTournamentPanel.BLoadLayoutSnippet('TournamentSection');

                let elBackground = elTournamentPanel.FindChildInLayoutFile('tournament-section-background');

                if(tournamentid >= 18)
                    elBackground.style.backgroundImage = 'url("file://{images}/tournaments/events/bg_' + tournamentid + '_fullscreen.png")';
                else if (tournamentid == 16)
                    elBackground.style.backgroundImage = "url( 'file://{images}/tournaments/backgrounds/background_" + tournamentid + ".png' );";
                else if (tournamentid == 15)
                    elBackground.style.backgroundImage = "url( 'file://{resources}/videos/tournament_bg.webm' );";
                else
                    elBackground.style.backgroundImage = "url( 'file://{images}/backgrounds/background.png' )";

                elBackground.style.backgroundRepeat = 'no-repeat';
		        elBackground.style.backgroundSize = 'cover' ;
		        elBackground.style.backgroundPosition = '50% 50%';

                let elItemsPanel = $.CreatePanel("Panel", elTournamentPanel, '', {
                    class: 'store-home-popular__items'
                });

                for (let i = 0; i < g_Tournaments[tournamentid].g_ActiveTournamentStoreLayout.length; i++) {
                    let items = g_Tournaments[tournamentid].g_ActiveTournamentStoreLayout[i];
                    let hasLinkedCoupon = items.length == 3;
    
                    let elTile = elItemsPanel.FindChildInLayoutFile('tournament-section-item-' + i);

                    if (!elTile) {
                        elTile = $.CreatePanel("Panel", elItemsPanel, 'tournament-section-item-' + i);
                        elTile.BLoadLayout('file://{resources}/layout/store/store_itemtile.xml', false, false);
                    }

                    let oItemData = { id: InventoryAPI.GetFauxItemIDFromDefAndPaintIndex( items[0] , 0 ) }

                    if(hasLinkedCoupon)
                        oItemData.linkedid = InventoryAPI.GetFauxItemIDFromDefAndPaintIndex( items[1] , 0 );

                    ItemTileStore.Init(elTile, oItemData);
                }
		    });
        }
    }

    function UpdateItemsInHomeSection(category, parentId, numItemsToShow, background = 'url("file://{images}/backgrounds/background.png")') {
        let elPanel = _m_cp.FindChildInLayoutFile(parentId);
        let elParent = _m_cp.FindChildInLayoutFile('id-store-home-section-' + category);

        if (elParent && elPanel) {
            elParent.style.backgroundImage = background;
            elParent.style.backgroundPosition = '50% 50%';
            elParent.style.backgroundSize = 'cover';

            try {
                let oItemsByCategory = StoreItems.GetStoreItems();
                let aItemsList = oItemsByCategory[category];

                if (!aItemsList || aItemsList.length < 1) {
                    elParent.visible = false;
                    return;
                }

                elParent.visible = true;

                for (let i = 0; i < numItemsToShow; i++) {
                    let elTile = elPanel.FindChildInLayoutFile('home-' + category + '-' + i);

                    if (!elTile) {
                        elTile = $.CreatePanel("Button", elPanel, 'home-' + category + '-' + i);
                        elTile.BLoadLayout('file://{resources}/layout/store/store_itemtile.xml', false, false);
                    }

                    UpdateItem(elTile, category, i);
                }
            } catch (e) {
            }
        }
    }

    function MakeTabsBtnsFromStoreData() {
        let elParent = _m_cp.FindChildInLayoutFile('id-store-lister-tabs');
        try {
            let oItemsByCategory = StoreItems.GetStoreItems();

            if (elParent) {
                for (let [key, value] of Object.entries(oItemsByCategory)) {
                    if(nonPageCategories.includes(key))
                        continue;

                    let panelIdString = 'id-store-nav-' + key;
                    let elButton = elParent.FindChildInLayoutFile(panelIdString);

                    if (value.length > 0 && !elButton) {
                        elButton = $.CreatePanel('RadioButton', elParent, panelIdString, {
                            group: 'store-top-nav'
                        });

                        let btnString = `#store_tab_${key}`;
                        $.CreatePanel('Label', elButton, '', { text: btnString });

                        elButton.SetPanelEvent('onactivate', () => {
                            NavigateToTab(_m_pagePrefix + key, key);
                        });
                    }
                }
            }
        } catch (e) {
        }
    }


    function MakePageFromStoreData(typeKey) {
        let panelIdString = _m_pagePrefix + typeKey;
        let elParent = _m_cp.FindChildInLayoutFile('id-store-pages');
        let elPanel = elParent ? elParent.FindChildInLayoutFile(panelIdString) : null;

        if (elParent && !elPanel) {
            elPanel = $.CreatePanel('Panel', elParent, panelIdString, {
                class: 'store-dynamic-lister',
                itemwidth: "178px",
                itemheight: "280px",
                spacersize: "4px",
                spacerperiod: "4px"
            });

            // UpdateDynamicLister should be defined elsewhere
            UpdateDynamicLister(elPanel, typeKey);
        }
    }

    function UpdateDynamicLister(elList, typeKey) {
        let oItemsByCategory = StoreItems.GetStoreItems();
        let aItemsList = oItemsByCategory[typeKey];

        // Ensure the number of panels matches the number of items
        let numItems = aItemsList.length;

        // Make sure the panel is visible
        elList.visible = true;

        // Loop through the items and either create or update panels
        for (let i = 0; i < numItems; i++) {
            let item = aItemsList[i];
            let itemPanel = elList.FindChildInLayoutFile(item.id);

            // If the panel doesn't exist, create a new one
            if (!itemPanel) {
                itemPanel = $.CreatePanel("Button", elList, item.id);
                itemPanel.BLoadLayout('file://{resources}/layout/store/store_itemtile.xml', false, false);
            }

            // Update the item in the panel
            UpdateItem(itemPanel, typeKey, i);
        }

        // Remove extra panels if there are more than necessary
        for (let i = numItems; i < elList.Children().length; i++) {
            let extraPanel = elList.Children()[i];
            if (extraPanel) {
                extraPanel.DeleteAsync(0);
            }
        }

        // Refresh the list to immediately show the updated items
        elList.SetHasClass('Active', true);
    }

    function UpdateItem(elPanel, typeKey, idx) {
        let oItemData = StoreItems.GetStoreItemData(typeKey, idx);
        ItemTileStore.Init(elPanel, oItemData);
    }

    function CreateAndUpdateItemsInHomeSection(category, name, numItemsToShow, background = 'url("file://{images}/backgrounds/background.png")') {
        let elHomeSection = _m_cp.FindChildInLayoutFile('id-store-page-home-sections');
        let elParent = elHomeSection.FindChildInLayoutFile('id-store-items-'+category);

        if(!elParent) {
            elParent = $.CreatePanel('Panel', elHomeSection, 'id-store-items-'+category);
            elParent.BLoadLayoutSnippet('HomeSection');
            elParent.SetDialogVariable('name', name);
        }

        let elPanel = elParent.FindChildInLayoutFile('store-items');

        if (elParent && elPanel) {
            elParent.style.backgroundImage = background;
            elParent.style.backgroundPosition = '50% 50%';
            elParent.style.backgroundSize = 'cover';

            try {
                let oItemsByCategory = StoreItems.GetStoreItems();
                let aItemsList = oItemsByCategory[category];

                if (!aItemsList || aItemsList.length < 1) {
                    elParent.visible = false;
                    return;
                }

                elParent.visible = true;

                for (let i = 0; i < numItemsToShow; i++) {
                    let elTile = elPanel.FindChildInLayoutFile('home-' + category + '-' + i);

                    if (!elTile) {
                        elTile = $.CreatePanel("Button", elPanel, 'home-' + category + '-' + i);
                        elTile.BLoadLayout('file://{resources}/layout/store/store_itemtile.xml', false, false);
                    }

                    UpdateItem(elTile, category, i);
                }
            } catch (e) {
            }
        }
    }

    {
        ReadyForDisplay();

        $.RegisterEventHandler('ReadyForDisplay', $('#JsMainMenuStore'), ReadyForDisplay);
    }
})(MainMenuStore || (MainMenuStore = {}));
