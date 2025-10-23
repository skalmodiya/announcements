/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require(["www/xyz/com/announcements/test/integration/AllJourneys"
], function () {
	QUnit.start();
});
