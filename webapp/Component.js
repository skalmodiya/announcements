sap.ui.define([
    "sap/ui/core/UIComponent",
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/m/Button",
	"sap/m/VBox",
	"sap/m/Image",
	"sap/m/Label"
], (UIComponent,Dialog,Text,Button,VBox,Image,Label) => {
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
				contentWidth: "30rem",
				title: "User Profile",
				type: "Message",
				content: new VBox({
					alignItems: "Center",
					class: "sapUiMediumMargin",
					items: [
						new Image({
							src: "https://ui5.sap.com/test-resources/sap/m/images/Woman_avatar_02.png",
							width: "120px",
							height: "120px",
							class: "sapUiMediumMarginBottom"
						}).addStyleClass("profileImage"),
						new VBox({
							alignItems: "Center",
							items: [
								new Label({
									text: "Sarah Johnson",
									design: "Bold"
								}).addStyleClass("sapUiMediumMarginBottom"),
								new Label({
									text: "Senior Developer",
									design: "Standard"
								}).addStyleClass("sapUiSmallMarginBottom"),
								new Label({
									text: "sarah.johnson@company.com"
								}).addStyleClass("sapUiSmallMarginBottom"),
								new Text({
									text: "Experienced full-stack developer with expertise in SAP UI5, JavaScript, and modern web technologies. Passionate about creating user-friendly applications.",
									textAlign: "Center"
								}).addStyleClass("sapUiMediumMarginTop")
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