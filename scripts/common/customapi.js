"use strict";

class CustomAPI {
    static GetActiveTournamentEventID() {
        return g_ActiveTournamentInfo.active == true ? g_ActiveTournamentInfo.eventid : 0;
    }
}