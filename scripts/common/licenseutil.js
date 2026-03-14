                                                             

"use strict";

var LicenseUtil = ( function ()
{
	var _GetCurrentLicenseRestrictions = function()
	{
		var szButtonText = "#Store_Get_License";
		var szMessageText = "#SFUI_LoginLicenseAssist_NoOnlineLicense";
		switch ( MyPersonaAPI.GetLicenseType() )
		{
		case "free_pw_needlink":
			szButtonText = "#Store_Link_Accounts";
			szMessageText = "#SFUI_LoginLicenseAssist_PW_NeedToLinkAccounts";
			break;
		case "free_pw_needupgrade":
			szMessageText = "#SFUI_LoginLicenseAssist_HasLicense_PW";
			break;
		case "free_pw":
			szMessageText = "#SFUI_LoginLicenseAssist_NoOnlineLicense_PW";
			break;
		case "free_sc":                                                                          
			szMessageText = "#SFUI_LoginLicenseAssist_NoOnlineLicense_SC";
			szButtonText = "#Store_Register_License";
			break;
		case "unsupported":
			szMessageText = "#SFUI_LoginLicenseAssist_UnsupportedText";
			szButtonText = "#ShowFAQ";
			break;
		case "purchased":
			return false;
		}

		return {
			license_msg : szMessageText,
			license_act : szButtonText
		};
	}
	
	var _BuyLicenseForRestrictions = function( restrictions )
	{
		if ( restrictions.license_act === "#Store_Register_License" ) {
			UiToolkitAPI.ShowCustomLayoutPopupParameters(
				'',
				'file://{resources}/layout/popups/popup_license_register.xml',
				'message=Store_Register_License' +
				'&' + 'spinner=1'
			);
		} else if ( restrictions.license_act === "#ShowFAQ" ) {
			UiToolkitAPI.ShowGenericPopupThreeOptionsBgStyle( "#SFUI_LoginLicenseAssist_UnsupportedTitle", "#SFUI_LoginLicenseAssist_UnsupportedText", "",
				"#SFUI_Continue", function () { },
				"#GameUI_Quit", function () { GameInterfaceAPI.ConsoleCommand( "quit" ); },
				"#ShowFAQ", function () { SteamOverlayAPI.OpenURL( "https://support.steampowered.com/kb_article.php?ref=73EF-08A3-0935-6369" ); },
				"dim" );
		} else {
			MyPersonaAPI.ActionBuyLicense();
		}
	}

	var _ShowLicenseRestrictions = function( restrictions )
	{
		if ( restrictions !== false )
		{
			                              
			return UiToolkitAPI.ShowGenericPopupYesNo(
				$.Localize( restrictions.license_act ),
				$.Localize( restrictions.license_msg ),
				'',
				_BuyLicenseForRestrictions.bind( null, restrictions ),
				function() {}
			);
		}
	}

	return{
		GetCurrentLicenseRestrictions : _GetCurrentLicenseRestrictions,
		BuyLicenseForRestrictions : _BuyLicenseForRestrictions,
		ShowLicenseRestrictions : _ShowLicenseRestrictions
	};
})();