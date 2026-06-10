"use strict";

var CustomAPI = ( function()
{
    function _GetActiveTournamentEventID() {
        return g_ActiveTournamentInfo.active == true ? g_ActiveTournamentInfo.eventid : 0;
    }

	return {
		GetActiveTournamentEventID:	_GetActiveTournamentEventID
		
	}
})();