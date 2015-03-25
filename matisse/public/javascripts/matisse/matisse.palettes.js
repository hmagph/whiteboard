/**
 * User: Bhavani Shankar
 * Date: 01/19/12
 * Time: 11:16 AM
 * About this : Utility to Create all the shapes, based on the type specified
 *
 */
define(["matisse", "matisse.main", "matisse.ui", "matisse.util"], function (matisse, main, ui, util) {
    "use strict";
	return {
		registerpalette : function (paletteName, paletteDesc) {
			matisse.palette[paletteName] = paletteDesc;
		},
		 /**
		 * Loop through all palettes and call createPallette for each palette found
		 * @method createAllPallettes
		 * @param paletteObj
		 */
		createAllPallettes: function (paletteObj) {
			//Rendering Palettes
      var paletteArray = [];
			var paletteName;
			for (paletteName in paletteObj) {
			  paletteArray.push({"name": paletteName, "order": paletteObj[paletteName]["order"]});
			}
      paletteArray.sort(function(a,b){return a["order"]- b["order"]});
      for(var i=0;i< paletteArray.length;i++) {
				this.createPallette(paletteArray[i]["name"]);
			}
			//Event handler for the Shape Click
			$(".p-cntr").click(this.handleShapeClick);
		},
		/**
		 * Create a  palette for each type of palette and add it in toolbar
		 * @method createPallette
		 * @param paletteName
		 */
		createPallette: function (paletteName) {
		
			var paletteName = matisse.palette[paletteName].collectionName,shapesObj,html="",i,shape,shapeName,shapeDisplayName,shapeHolder;
			ui.updateAccordian(paletteName);
			shapesObj = matisse.palette[paletteName];

			for (i in shapesObj.shapes) {
				shape = shapesObj.shapes[i];
				shapeName = shape.name;
				shapeDisplayName = shape.displayName;
				
				if(shapeName == "importimage") continue;

				shapeHolder = '<div class="shape-holder" data-shape="'+shapeName+'"><div class="basic-shape s-'+shapeName+'"></div>';
				shapeHolder += '<div class="shape-label">' + shapeDisplayName + '</div></div>';
				html += shapeHolder;
			}
			
			$("#"+paletteName).append(html);

		},
		/**
		 *  Handles the click events on Shape
		 *  @method  handleToolClick
		 *  @param e object
		 */
		handleShapeClick : function(e){
			var shapeEle = $(e.target).closest(".shape-holder"),shapeSelected,obj;
			if(shapeEle!=null){
				ui.resetShapeSelection();
				$(shapeEle).addClass("shape-selected");				
				matisse.$currShape = shapeEle;
				canvas.isSelectMode = false;
				shapeSelected = $(shapeEle).data().shape;
				//matisse.currTool = e.target;
				//$(e.target).removeClass(toolId).addClass(toolId + "_click");
				document.getElementById("c").style.cursor = 'default';
				matisse.drawShape = true;
				matisse.action = shapeSelected;
				matisse.paletteName = $(shapeEle).parent().data().palettename;
				if (shapeSelected !== "path") {
					obj = util.getDefaultDataFromArray(matisse.palette[matisse.paletteName].shapes[shapeSelected].properties);
					obj.uid = util.uniqid();
					matisse.shapeArgs = [obj];
				}
				if (matisse.action !== "path") {
					canvas.isDrawingMode = false;
				} else {
					document.getElementById("c").style.cursor = 'crosshair';
					canvas.isDrawingMode = true;
					return;
				}
		
				}
			}
		};
});


