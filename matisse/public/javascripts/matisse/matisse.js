/**
 * User: Bahvani Shankar,Pradeep
 * Date: 12/26/11
 * Time: 11:16 AM
 * About matisse : matisse is the Main Namespace
 */
//Defining the global name space
define(function () {
    "use strict";
	return {
		fillColor : "#AAAAAA",
		points : {},
		palette: {},
		layout: {},
		containers: {},
		textEl: null,
		drawShape : false,
		action: null,
		shapeArgs: null,
		currTool: null,
		xPoints : [],
		yPoints : [],
		xOffset: null,
		yOffset: null,
		paletteName: null,
		associateText: {},
		focusInput: "stroke",
		palettes: {},
		Properties: {},
		$currActiveIcon: null,
		main: {},
		comm: {},
		events: {},
		hLine: {},
		vLine: {},
		horIndent : 1,
		verIndent : 1,
		indentMultiplier : 10,
		imageTag: null,
		containerName: null,
		eventObj: {},
		layoutURL: null,
		undoStack: [],
		redoStack: [],
		groupCopyMode: false,
		isUpdatingProperties: false
	};
});