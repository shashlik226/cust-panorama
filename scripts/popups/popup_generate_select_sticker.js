'use strict';

var PopupGenerateSelectSticker = ( function()
{
    let items = [];

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
                var callbackHandle = $.GetContextPanel().GetAttributeInt( "callback", -1 );
		        if ( callbackHandle != -1 )
		        {
		        	UiToolkitAPI.InvokeJSCallback( callbackHandle, item.id, $.GetContextPanel().GetAttributeInt( "slot", 0 ) );
		        }

		        $.DispatchEvent( 'UIPopupButtonClicked', '' );
            }.bind( undefined ) );

            elItem.SetPanelEvent( 'oncontextmenu', function()
            {
                SteamOverlayAPI.CopyTextToClipboard( item.itemid );
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

	function _Init()
	{
        let roskomnadzorList = [
            29, 30, 45, 54, 204, 205, 206, 216, 217, 218, 277, 298, 299, 1318, 1319, 1320, 1321, 1322, 1323, 1324, 1325, 1326, 1327, 1328, 1329, 1330, 1331, 1332, 1333, 1334, 1335, 1336, 1337, 1338, 1339, 1340, 1341, 1342, 1343, 1344, 1345, 1346, 1347, 1348, 1349, 1350, 1351, 1352, 1353, 1354, 1355, 1356, 1357, 1358, 1359, 1360, 1361, 1362, 1363, 1364, 1365, 1366, 1367, 1368, 1369, 1370, 1371, 1372, 1373, 1374, 1375, 1376, 1377, 1378, 1379, 1380, 1381, 1382, 1383, 1384, 1385, 1386, 1387, 1388, 1389, 1390, 1391, 1392, 1393, 1394, 1395, 1396, 1397, 1398, 1399, 1400, 1401, 1402, 1403, 1404, 1405, 1406, 1407, 1408, 1409, 1410, 1411, 1412, 1413, 1414, 1415, 1416, 1417, 1418, 1419, 1420, 1421, 1422, 1423, 1424, 1425, 1426, 1427, 1428, 1429, 1430, 1431, 1432, 1433, 1434, 1435, 1436, 1437, 1438, 1439, 1440, 1441, 1442, 1443, 1444, 1445, 1446, 1447, 1448, 1449, 1450, 1451, 1452, 1453, 1454, 1455, 1456, 1457, 1458, 1459, 1460, 1461, 1462, 1463, 1464, 1465, 1466, 1467, 1468, 1469, 1470, 1471, 1472, 1473, 1474, 1475, 1476, 1477, 1478, 1479, 1480, 1481, 1482, 1483, 1484, 1485, 1486, 1487, 1488, 1489, 1490, 1491, 1492, 1493, 1494, 1495, 1496, 1497, 1498, 1499, 1500, 1501, 1502, 1503, 1504, 1505, 1506, 1507, 1508, 1509, 1510, 1511, 1512, 1513, 1514, 1515, 1516, 1517, 1518, 1519, 1520, 1521, 1522, 1523, 1524, 1525, 1526, 1527, 1528, 1529, 1530, 1531, 1532, 1533, 1534, 1535, 1536, 1537, 1538, 1539, 1540, 1541, 1542, 1543, 1544, 1545, 1546, 1547, 1548, 1549, 1550, 1551, 1552, 1553, 1554, 1555, 1556, 1557, 1558, 1559, 1560, 1561, 1562, 1563, 1564, 1565, 1566, 1567, 1568, 1569, 1570, 1571, 1572, 1573, 1574, 1575, 1576, 1577, 1578, 1579, 1580, 1581, 1582, 1583, 1584, 1585, 1586, 1587, 1588, 1589, 1590, 1591, 1592, 1593, 1594, 1595, 1596, 1597, 1598, 1599, 1600, 1601, 1602, 1603, 1604, 1605, 1606, 1607, 1608, 1609, 1610, 1611, 1612, 1613, 1614, 1615, 1616, 1617, 1618, 1619, 1620, 1621, 1622, 1623, 1624, 1689, 1690, 1691, 1692, 1693, 1694, 1695, 1696, 3458, 3459, 3948, 3957, 3964, 4573, 4574, 4577, 4590, 4647, 4648, 4698, 5896, 5897, 5898, 5899, 5900, 5901, 5902, 5903, 5904, 5905, 5906, 5907, 5908, 5909, 5910, 5911, 5912, 5913, 5914, 5915, 5916, 5917, 5918, 5919, 5920, 5921, 5922, 5923, 5924, 5925, 5926, 5927, 5928, 5929, 5930, 5931, 5932, 5933, 5934, 5935, 5936, 5937, 5938, 5939, 5940, 5941, 5942, 5943, 5944, 5945, 5946, 5947, 5948, 5949, 5950, 5951, 5952, 5953, 5954, 5955, 5956, 5957, 5958, 5959, 5960
        ];
		for (let i = 0; i < 7232; i++) {
            if(roskomnadzorList.includes(i))
                continue;

			var fauxItemId = InventoryAPI.GetFauxItemIDFromDefAndPaintIndex( 1209, i );
			var itemName = InventoryAPI.GetItemName(fauxItemId);

			if(itemName == '' || itemName == undefined || !itemName)
				continue;

            var oTags = InventoryAPI.BuildItemTagsObject( fauxItemId );
            if (JSON.stringify(oTags).includes('TournamentTeam'))
                continue;

			items.push({name: itemName, id: i, itemid: fauxItemId});
		}
        _CreatePanels();
	}

	return {
        Init: _Init,
        CreatePanels: _CreatePanels
	};

})();