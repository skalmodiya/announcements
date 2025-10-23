sap.ui.define([
    "sap/ui/core/UIComponent",
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/m/Button",
	"sap/m/VBox",
	"sap/m/HBox",
	"sap/m/Image",
	"sap/m/Label",
	"sap/m/Link",
	"sap/m/FormattedText"
], (UIComponent,Dialog,Text,Button,VBox,HBox,Image,Label,Link,FormattedText) => {
    "use strict";

    return UIComponent.extend("www.xyz.com.announcements.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

		init: function () {
            var that = this;
            var rendererPromise = this._getRenderer();
            rendererPromise.then(function(oRenderer) {
            	// Auto-popup profile acknowledgement dialog
            	that._showProfileDialog();
            	
            	oRenderer.addHeaderItem({
            		icon: "sap-icon://marketing-campaign",
            		tooltip: "View Profile",
            		press: function() {
            			that._showProfileDialog();
            		}
            	}, true, false);
            });
		},

		_showProfileDialog: function() {
			var oDialog = new Dialog({
				contentWidth: "40rem",
				title: "Announcement",
				type: "Message",
				content: new VBox({
					alignItems: "Start",
					class: "sapUiMediumMargin",
					items: [
						new HBox({
							alignItems: "Start",
							justifyContent: "SpaceBetween",
							items: [
								new VBox({
									width: "60%",
									items: [
										new Text({
											text: "Dear Colleagues,\n\nAs part of our continuous commitment to enhancing your experience, the Human Capital Annual Single Customer Survey is now available until 31st October 2025.\n\n"
										}),
										new FormattedText({
											htmlText: 'Please access the survey by clicking <a href="https://qatargas.qualtrics.com/jfe/form/SV_5zNR8D5mFaVJLng" target="_blank">here</a>.'
										}),
										new Text({
											text: "\nThank you for your valuable time and participation."
										})
									]
								}),
								new Image({
									src: sap.ui.require.toUrl("www/xyz/com/announcements") + "/announcements.png",
									width: "120px",
									height: "120px",
									class: "sapUiMediumMarginLeft"
								})
							]
						})
					]
				}),
				beginButton: new Button({
					type: "Emphasized",
					text: "Close",
					press: function() {
						oDialog.close();
					}
				}),
				afterClose: function() {
					oDialog.destroy();
				}
			});
			oDialog.open();
		},

		_getRenderer: function () {
			var that = this,
				oDeferred = new jQuery.Deferred(),
				oRenderer;


			that._oShellContainer = jQuery.sap.getObject("sap.ushell.Container");
			if (!that._oShellContainer) {
				oDeferred.reject(
					"Illegal state: shell container not available; this component must be executed in a unified shell runtime context.");
			} else {
				oRenderer = that._oShellContainer.getRenderer();
				if (oRenderer) {
					oDeferred.resolve(oRenderer);
				} else {
					// renderer not initialized yet, listen to rendererCreated event
					that._onRendererCreated = function (oEvent) {
						oRenderer = oEvent.getParameter("renderer");
						if (oRenderer) {
							oDeferred.resolve(oRenderer);
						} else {
							oDeferred.reject("Illegal state: shell renderer not available after recieving 'rendererLoaded' event.");
						}
					};
					that._oShellContainer.attachRendererCreatedEvent(that._onRendererCreated);
				}
			}
			return oDeferred.promise();
		}
    });
});
