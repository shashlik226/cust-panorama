                                                             

"use strict";

var CommonUtil = ( function ()
{
	                                             
	                                                                              
	                                                                          
	var remap_lang_to_region = {
		af: 'za',
		ar: 'sa',
		be: 'by',
		cs: 'cz',
		da: 'dk',
		el: 'gr',
		en: 'gb',
		et: 'ee',
		ga: 'ie',
		he: 'il',
		hi: 'in',
		ja: 'jp',
		kk: 'kz',
		ko: 'kr',
		nn: 'no',
		sl: 'si',
		sr: 'rs',
		sv: 'se',
		uk: 'ua',
		ur: 'pk',
		vi: 'vn',
		zh: 'cn',
		zu: 'za',
	};

	                                                                                    
	function _SetRegionOnLabel ( isoCode, elPanel, tooltip = true  )
	{
		var tooltipString = "";
		if ( isoCode )
		{
			tooltipString = $.LocalizeSafe( "#SFUI_Country_" + isoCode.toUpperCase() );
		}
		_SetDataOnLabelInternal( isoCode, isoCode, tooltip ? tooltipString : "", elPanel, tooltipString ? false : true );
	}

	function _SetLanguageOnLabel ( isoCode, elPanel, tooltip = true  )
	{
		var tooltipString = "";
		var imgCode = isoCode;
		if ( isoCode )
		{
			var sTranslated = $.LocalizeSafe( "#Language_Name_Translated_" + isoCode );
			var sLocal = $.LocalizeSafe( "#Language_Name_Native_" + isoCode );
			if ( sTranslated && sLocal && sTranslated === sLocal )
			{
				tooltipString = sLocal;
			}
			else
			{
				tooltipString = ( sTranslated && sLocal ) ? sTranslated + " (" + sLocal + ")" : "";
			}

			if ( remap_lang_to_region[isoCode] )
			{	                                                                                                
				imgCode = remap_lang_to_region[isoCode];
			}
		}
		
		_SetDataOnLabelInternal( isoCode, imgCode, tooltip ? tooltipString : "", elPanel, tooltipString ? false : true );
	}

	function _SetDataOnLabelInternal ( isoCode, imgCode, tooltipString, elPanel, bWarningColor )
	{
		if ( !elPanel )
			return;
		
		var elLabel = elPanel.FindChildTraverse( 'JsRegionLabel' );
		elLabel.AddClass( 'visible-if-not-perfectworld' );

		if ( isoCode )
		{
			elLabel.text = isoCode.toUpperCase();

			elLabel.style.backgroundImage = 'url("file://{images}/regions/' + imgCode + '.png")';

			var elTTAnchor = elLabel.FindChildTraverse( 'region-tt-anchor' );
			if ( !elTTAnchor )
			{
				elTTAnchor = $.CreatePanel( "Panel", elLabel, elPanel.id + '-region-tt-anchor' );
			}

			if ( tooltipString )
			{
				elLabel.SetPanelEvent( 'onmouseover', _ => UiToolkitAPI.ShowTextTooltip( elTTAnchor.id, tooltipString ) );
				elLabel.SetPanelEvent( 'onmouseout', _ => UiToolkitAPI.HideTextTooltip() );
			}

			          
			                    
			 
				                                     
				                                   
				                                                                                                                  
			 
			          


			elLabel.RemoveClass( 'hidden' );
			elLabel.SetHasClass( 'world-region-label', true );
			elLabel.SetHasClass( 'world-region-label--image', true );

		}
		else
		{
			elLabel.AddClass( 'hidden' );
			elLabel.SetHasClass( 'world-region-label', false );
			elLabel.SetHasClass( 'world-region-label--image', false );
		}
	}

	function _SetVanityLightingBasedOnBackgroundMovie( vanityPanel, backgroundMap )
	{
	    vanityPanel.RestoreLightingState();

		if ( backgroundMap === 'overpass' )
		{
			vanityPanel.SetFlashlightAmount( 2 );
			                                               
			vanityPanel.SetFlashlightFOV( 60 );                                     
			                                                            
			vanityPanel.SetFlashlightColor( 4, 4, 4);
			vanityPanel.SetAmbientLightColor( 0.25, 0.20, 0.35 );

			vanityPanel.SetDirectionalLightModify( 0 );
			vanityPanel.SetDirectionalLightColor(0.00, 0.19, 0.38 );
			vanityPanel.SetDirectionalLightDirection( 0.6, 0.67, -0.71 );
			
			vanityPanel.SetDirectionalLightModify( 1 );
			vanityPanel.SetDirectionalLightColor( 0.05, 0.09, 0.21) ;
			vanityPanel.SetDirectionalLightDirection(-0.86, -0.18, -0.47 );

			vanityPanel.SetDirectionalLightModify( 2 );
			vanityPanel.SetDirectionalLightColor( 0.0, 0.0, 0.0 );
			vanityPanel.SetDirectionalLightDirection( 0.76, 0.48, -0.44 );
		}
		else if ( backgroundMap === 'dust2' )
		{
		
		    vanityPanel.SetFlashlightAmount( 2.0 );
		    vanityPanel.SetFlashlightFOV( 55 );
		    vanityPanel.SetFlashlightColor( 2.4, 2.3, 2.2 ); 
		
		
		    vanityPanel.SetAmbientLightColor( 0.48, 0.45, 0.4 );
		
		
		    vanityPanel.SetDirectionalLightModify( 0 );
		    vanityPanel.SetDirectionalLightColor( 1.1, 1.05, 0.95 );
		    vanityPanel.SetDirectionalLightDirection( -0.15, 0.95, -0.3 );
		
		
		    vanityPanel.SetDirectionalLightModify( 1 );
		    vanityPanel.SetDirectionalLightColor( 0.35, 0.33, 0.3 );
		    vanityPanel.SetDirectionalLightDirection( 0.0, -0.4, 0.5 );
		
		
		    vanityPanel.SetDirectionalLightModify( 2 );
		    vanityPanel.SetDirectionalLightColor( 0.2, 0.2, 0.18 );
		    vanityPanel.SetDirectionalLightDirection( 0.4, 0.4, -0.6 );
		}
		else if ( backgroundMap === 'warehouse' )
		{
		    vanityPanel.SetFlashlightAmount( 1.8 );
		    vanityPanel.SetFlashlightFOV( 55 );
		    vanityPanel.SetFlashlightColor( 2.1, 2.0, 1.7 );
		
		    vanityPanel.SetAmbientLightColor( 0.38, 0.36, 0.42 );
		
		    vanityPanel.SetDirectionalLightModify( 0 );
		    vanityPanel.SetDirectionalLightColor( 0.25, 0.28, 0.4 ); 
		    vanityPanel.SetDirectionalLightDirection( -0.5, 0.8, -0.3 );
		
		    vanityPanel.SetDirectionalLightModify( 1 );
		    vanityPanel.SetDirectionalLightColor( 0.28, 0.22, 0.18 );
		    vanityPanel.SetDirectionalLightDirection( 0.6, -0.2, -0.6 );
		
		    vanityPanel.SetDirectionalLightModify( 2 );
		    vanityPanel.SetDirectionalLightColor( 0.1, 0.12, 0.18 );
		    vanityPanel.SetDirectionalLightDirection( 0.3, 0.5, -0.8 );
		
		    //vanityPanel.SetSceneAngles( 0, 0, 0, true );
		}
		else if ( backgroundMap === 'mirage' )
		{
		
		    vanityPanel.SetFlashlightAmount( 2.0 );
		    vanityPanel.SetFlashlightFOV( 55 );
		    vanityPanel.SetFlashlightColor( 2.3, 2.2, 2.1 ); 
		
		
		    vanityPanel.SetAmbientLightColor( 0.46, 0.44, 0.4 );
		
		
		    vanityPanel.SetDirectionalLightModify( 0 );
		    vanityPanel.SetDirectionalLightColor( 1.05, 1.0, 0.9 );
		    vanityPanel.SetDirectionalLightDirection( -0.2, 0.92, -0.35 );
		
		
		    vanityPanel.SetDirectionalLightModify( 1 );
		    vanityPanel.SetDirectionalLightColor( 0.3, 0.28, 0.26 );
		    vanityPanel.SetDirectionalLightDirection( 0.0, -0.5, 0.5 );
		
		
		    vanityPanel.SetDirectionalLightModify( 2 );
		    vanityPanel.SetDirectionalLightColor( 0.22, 0.2, 0.18 );
		    vanityPanel.SetDirectionalLightDirection( 0.5, 0.5, -0.6 );
		}
		else if ( backgroundMap === 'inferno' )
		{
		
		    vanityPanel.SetFlashlightAmount( 2.1 );
		    vanityPanel.SetFlashlightFOV( 55 );
		    vanityPanel.SetFlashlightColor( 2.35, 2.2, 2.0 ); 
		
		
		    vanityPanel.SetAmbientLightColor( 0.5, 0.45, 0.4 );
		
		
		    vanityPanel.SetDirectionalLightModify( 0 );
		    vanityPanel.SetDirectionalLightColor( 1.05, 1.0, 0.9 );
		    vanityPanel.SetDirectionalLightDirection( -0.2, 0.92, -0.35 );
		
		
		    vanityPanel.SetDirectionalLightModify( 1 );
		    vanityPanel.SetDirectionalLightColor( 0.35, 0.3, 0.25 );
		    vanityPanel.SetDirectionalLightDirection( 0.1, -0.5, 0.6 );
		
		
		    vanityPanel.SetDirectionalLightModify( 2 );
		    vanityPanel.SetDirectionalLightColor( 0.2, 0.18, 0.15 );
		    vanityPanel.SetDirectionalLightDirection( 0.5, 0.4, -0.6 );
		}
		else if (backgroundMap === 'sirocco') {
		    vanityPanel.SetFlashlightAmount( 2.2 );  
		    vanityPanel.SetFlashlightFOV( 65 );
		    vanityPanel.SetFlashlightColor( 2.0, 1.9, 1.7 );
		
		    vanityPanel.SetAmbientLightColor( 0.35, 0.32, 0.28 );
		
		    vanityPanel.SetDirectionalLightModify( 0 );
		    vanityPanel.SetDirectionalLightColor( 0.9, 0.75, 0.55 );
		    vanityPanel.SetDirectionalLightDirection( 0.2, 0.7, -0.65 );
		
		    vanityPanel.SetDirectionalLightModify( 1 );
		    vanityPanel.SetDirectionalLightColor( 0.15, 0.18, 0.25 );
		    vanityPanel.SetDirectionalLightDirection( -0.85, -0.2, -0.5 );
		
		    vanityPanel.SetDirectionalLightModify( 2 );
		    vanityPanel.SetDirectionalLightColor( 0.05, 0.05, 0.07 );
		    vanityPanel.SetDirectionalLightDirection( 0.7, 0.5, -0.4 );
		
		    // vanityPanel.SetSceneAngles( 0, 0, 0, true );   
		}
		else if ( backgroundMap === 'nuke' )
		{
		    vanityPanel.SetAmbientLightColor( 0.38, 0.34, 0.30 ); 
		
		    vanityPanel.SetDirectionalLightModify( 0 );
		    vanityPanel.SetDirectionalLightColor( 1.95, 2.26, 2.59 ); 
		    vanityPanel.SetDirectionalLightDirection( -0.34, 0.85, 0.41 );
		
		    vanityPanel.SetDirectionalLightModify( 1 );
		    vanityPanel.SetDirectionalLightColor( 0.67, 0.55, 0.00 ); 
		    vanityPanel.SetDirectionalLightDirection( -0.90, -0.44, -0.04 );
		
		    vanityPanel.SetDirectionalLightModify( 2 );
		    vanityPanel.SetDirectionalLightColor( 0.22, 0.20, 0.18 ); 
		    vanityPanel.SetDirectionalLightDirection( -0.02, 0.99, -0.16 );
		
		    vanityPanel.SetDirectionalLightModify( 3 );
		    vanityPanel.SetDirectionalLightColor( 0.08, 0.10, 0.14 ); 
		    vanityPanel.SetDirectionalLightDirection( -0.02, 0.82, 0.57 );
		
		    vanityPanel.SetFlashlightColor( 1.00, 0.95, 0.83 ); 
		    vanityPanel.SetFlashlightAmount( 1.00 );
		    vanityPanel.SetFlashlightFOV( 52 ); 

			// vanityPanel.SetSceneAngles( 0, 0, 0, true ); 
		}
		else if ( backgroundMap === 'train' )
		{
		
		    vanityPanel.SetFlashlightAmount( 1.2 );
		    vanityPanel.SetFlashlightFOV( 50 );
		    vanityPanel.SetFlashlightColor( 2.4, 2.35, 2.2 ); 
		
		
		    vanityPanel.SetAmbientLightColor( 0.2, 0.25, 0.3 );
		
		
		    vanityPanel.SetDirectionalLightModify( 0 );
		    vanityPanel.SetDirectionalLightColor( 1.0, 0.95, 0.85 );
		    vanityPanel.SetDirectionalLightDirection( 0.0, -1.0, 0.0 );
		
		
		    vanityPanel.SetDirectionalLightModify( 1 );
		    vanityPanel.SetDirectionalLightColor( 0.25, 0.3, 0.4 );
		    vanityPanel.SetDirectionalLightDirection( 0.3, 0.6, -0.4 );
		
		
		    vanityPanel.SetDirectionalLightModify( 2 );
		    vanityPanel.SetDirectionalLightColor( 0.12, 0.14, 0.2 );
		    vanityPanel.SetDirectionalLightDirection( -0.4, 0.5, -0.6 );
		}
		else if ( backgroundMap === 'office' )
		{
		
		    vanityPanel.SetFlashlightAmount( 2.8 );
		    vanityPanel.SetFlashlightFOV( 55 );
		    vanityPanel.SetFlashlightColor( 2.0, 2.05, 2.2 ); 
		
		
		    vanityPanel.SetAmbientLightColor( 0.25, 0.3, 0.45 );
		
		
		    vanityPanel.SetDirectionalLightModify( 0 );
		    vanityPanel.SetDirectionalLightColor( 0.8, 0.85, 0.95 );
		    vanityPanel.SetDirectionalLightDirection( 0.0, -1.0, 0.0 ); 
		
		
		    vanityPanel.SetDirectionalLightModify( 1 );
		    vanityPanel.SetDirectionalLightColor( 0.4, 0.45, 0.6 );
		    vanityPanel.SetDirectionalLightDirection( -0.4, 0.3, -0.5 );
		
		
		    vanityPanel.SetDirectionalLightModify( 2 );
		    vanityPanel.SetDirectionalLightColor( 0.0, 0.0, 0.0 );
		    vanityPanel.SetDirectionalLightDirection( 0.5, 0.4, -0.3 );

			vanityPanel.SetDirectionalLightModify( 3 );
		    vanityPanel.SetDirectionalLightColor( 0.0, 0.0, 0.0 );
		    vanityPanel.SetDirectionalLightDirection( 0.5, 0.4, -0.3 );
		}
		else if ( backgroundMap === 'anubis' )
		{
		
		    vanityPanel.SetFlashlightAmount( 2.0 );
		    vanityPanel.SetFlashlightFOV( 55 );
		    vanityPanel.SetFlashlightColor( 2.5, 2.3, 2.0 );
		
		
		    vanityPanel.SetAmbientLightColor( 0.5, 0.45, 0.38 );
		
		
		    vanityPanel.SetDirectionalLightModify( 0 );
		    vanityPanel.SetDirectionalLightColor( 1.1, 0.95, 0.75 );
		    vanityPanel.SetDirectionalLightDirection( -0.1, 0.85, -0.5 );
		
		
		    vanityPanel.SetDirectionalLightModify( 1 );
		    vanityPanel.SetDirectionalLightColor( 0.25, 0.3, 0.35 );
		    vanityPanel.SetDirectionalLightDirection( 0.0, -0.5, 0.5 );
		
		
		    vanityPanel.SetDirectionalLightModify( 2 );
		    vanityPanel.SetDirectionalLightColor( 0.15, 0.12, 0.08 );
		    vanityPanel.SetDirectionalLightDirection( 0.5, 0.4, -0.6 );
		}
		else if ( backgroundMap === 'vertigo' )
		{
		
		    vanityPanel.SetFlashlightAmount( 2.2 );
		    vanityPanel.SetFlashlightFOV( 55 );
		    vanityPanel.SetFlashlightColor( 2.2, 2.3, 2.6 ); 
		
		
		    vanityPanel.SetAmbientLightColor( 0.42, 0.48, 0.58 );
		
		
		    vanityPanel.SetDirectionalLightModify( 0 );
		    vanityPanel.SetDirectionalLightColor( 1.1, 1.2, 1.35 );
		    vanityPanel.SetDirectionalLightDirection( -0.25, 0.92, -0.32 );
		
		
		    vanityPanel.SetDirectionalLightModify( 1 );
		    vanityPanel.SetDirectionalLightColor( 0.35, 0.35, 0.3 );
		    vanityPanel.SetDirectionalLightDirection( 0.15, -0.4, 0.2 );
		    vanityPanel.SetDirectionalLightModify( 2 );
		    vanityPanel.SetDirectionalLightColor( 0.2, 0.25, 0.35 );
		    vanityPanel.SetDirectionalLightDirection( 0.6, 0.5, -0.5 );
		}
		else if ( backgroundMap === 'ancient' )
		{
			vanityPanel.SetFlashlightAmount( 3 );
			vanityPanel.SetFlashlightFOV( 60 );
			vanityPanel.SetFlashlightColor( 1.8, 1.8, 2 );
			vanityPanel.SetAmbientLightColor( 0.2, 0.32, 0.4 );
			
			vanityPanel.SetDirectionalLightModify( 0 );
			vanityPanel.SetDirectionalLightColor(0.00, 0.19, 0.38 );
			vanityPanel.SetDirectionalLightDirection( 0.1, 0.67, -0.71 );
			
			vanityPanel.SetDirectionalLightModify( 1 );
			vanityPanel.SetDirectionalLightColor( 0.05, 0.09, 0.21) ;
			vanityPanel.SetDirectionalLightDirection(-0.86, -0.18, -0.47 );

			vanityPanel.SetDirectionalLightModify( 2 );
			vanityPanel.SetDirectionalLightColor( 0.0, 0.0, 0.0 );
			vanityPanel.SetDirectionalLightDirection( 0.76, 0.48, -0.44 );
		}
		else if ( backgroundMap === 'blacksite' )
		{
			vanityPanel.SetFlashlightAmount( 1 );
			vanityPanel.SetFlashlightColor( 4, 4, 4);
			vanityPanel.SetAmbientLightColor( 0.16, 0.26, 0.30 );
			
			vanityPanel.SetDirectionalLightModify( 0 );
			vanityPanel.SetDirectionalLightColor( 0.26, 0.35, 0.47 );
			vanityPanel.SetDirectionalLightDirection( -0.50, 0.80, 0.00 );
			
			vanityPanel.SetDirectionalLightModify( 1 );
			vanityPanel.SetDirectionalLightColor( 0.74, 1.01, 1.36 );
			vanityPanel.SetDirectionalLightDirection( 0.47, -0.77, -0.42 );

			vanityPanel.SetDirectionalLightModify( 2 );
			vanityPanel.SetDirectionalLightColor( 0.75, 1.20, 1.94 );
			vanityPanel.SetDirectionalLightDirection( 0.76, 0.48, -0.44 );
		}
	    else if ( backgroundMap === 'cbble' )
		{
			vanityPanel.SetFlashlightAmount( 1.0 );
			vanityPanel.SetFlashlightColor( 0.81, 0.92, 1.00 );
			vanityPanel.SetAmbientLightColor( 0.12, 0.21, 0.46 );

			vanityPanel.SetDirectionalLightModify( 0 );
			vanityPanel.SetDirectionalLightColor( 0.13, 0.14, 0.13 );
			vanityPanel.SetDirectionalLightDirection( -0.81, 0.41, 0.43 );
			
			vanityPanel.SetDirectionalLightModify( 1 );
			vanityPanel.SetDirectionalLightColor( 0.82, 0.19, 0.08 );
			vanityPanel.SetDirectionalLightDirection( 0.62, -0.74, 0.25 );
			vanityPanel.SetDirectionalLightPulseFlicker( 0.25, 0.25, 0.25, 0.25 );

			vanityPanel.SetDirectionalLightModify( 2 );
			vanityPanel.SetDirectionalLightColor( 0.72, 1.40, 1.68 );
			vanityPanel.SetDirectionalLightDirection( 0.50, -0.69, -0.52 );


		}
		else if ( backgroundMap === 'sirocco_night' )
		{
			vanityPanel.SetFlashlightAmount( 2 );
			vanityPanel.SetFlashlightFOV( 45 );
			vanityPanel.SetFlashlightColor( 1.8, 1.8, 2 );
			vanityPanel.SetAmbientLightColor( 0.13, 0.17, 0.29 );
			
			vanityPanel.SetDirectionalLightModify( 0 );
			vanityPanel.SetDirectionalLightColor(0.00, 0.19, 0.38 );
			vanityPanel.SetDirectionalLightDirection( 0.22, 0.67, -0.71 );
			
			vanityPanel.SetDirectionalLightModify( 1 );
			vanityPanel.SetDirectionalLightColor( 0.05, 0.09, 0.21) ;
			vanityPanel.SetDirectionalLightDirection(-0.86, -0.18, -0.47 );

			vanityPanel.SetDirectionalLightModify( 2 );
			vanityPanel.SetDirectionalLightColor( 0.0, 0.0, 0.0 );
			vanityPanel.SetDirectionalLightDirection( 0.76, 0.48, -0.44 );
		}
	}

	return {
		
		SetRegionOnLabel: _SetRegionOnLabel,
		SetLanguageOnLabel: _SetLanguageOnLabel,
		SetVanityLightingBasedOnBackgroundMovie: _SetVanityLightingBasedOnBackgroundMovie

	};
})();