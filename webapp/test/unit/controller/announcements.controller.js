/*global QUnit*/

sap.ui.define([
	"www/xyz/com/announcements/controller/announcements.controller"
], function (Controller) {
	"use strict";

	QUnit.module("announcements Controller");

	QUnit.test("I should test the announcements controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
