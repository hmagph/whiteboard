/**
 * Author: Bahvani Shankar
 * Date: 12/26/11
 * Time: 11:16 AM
 * About matisse.ui : matisse.ui is the module to set lall ui related things like canvas, accordian, carousal etc.
 */
define(["matisse","matisse.action-bar"], function (matisse,mActionBar) {
	"use strict";
	var ui = { 
		/** width and height of panels for resize */
		bodyWidth: null,
		bodyHeight: null,
		initialBodyWidth: $(window).width() > 960 ? $(window).width() : 960,
		initialBodyHeight: $(window).height() > 800 ? $(window).height() : 800,
		topPanelHeight: null,
		leftPanelWidth: null,
		leftPanelHeight: null,
		accordionContentHeight: null,
		canvasWidth: null,
		canvasHeight: null,
		deviceWidth: null,
		deviceHeight: null,
		deiviceInnerHeight: null,
		deviceInnerWidth: null,
		/**
		 * function to initialize width and heights
		 * @method initWidthAndHeightOfPanels
		 * @param none
		 */
		initWidthAndHeightOfPanels: function () {
			//this.bodyWidth = $(window).width() - 2;
			//this.bodyHeight = $(window).height();
			this.topPanelHeight = 100;
			this.leftPanelWidth = 105;
			//this.leftPanelHeight = this.bodyHeight - this.topPanelHeight;
			//this.canvasWidth = 800;//this.bodyWidth - this.leftPanelWidth;
			//this.canvasHeight = 600;//this.bodyHeight - this.topPanelHeight - 23;

			$(window).click(function(e){
				var userInfoSecObj = $(e.target).closest(".userInfoSec")[0]		 
				if(!userInfoSecObj){
					mActionBar.hideUserInfoSection();									
				}				
			});
		},
		/**
		 * method to resize panels on resize of browser window
		 * @method resizeWindow
		 * @param none
		 */
		resizeWindow: function () {
			this.resizeBody();
			this.resizeHeader();
			this.resizeMainPanel();
			this.resizeLeftPanel();
			this.resizeCanvas();			
		},
		/**
		 * method to resize the document body
		 * @method resizeBody
		 * @param none
		 */
		resizeBody: function () {
			//$('#_body').width(this.bodyWidth + 2);
			//$('#_body').height(this.bodyHeight);
		},

		/**
		 * method to set header width and height
		 * @method resizeHeader
		 * @param none
		 */
	    resizeHeader: function () {
			//$('#header').width(this.bodyWidth);
			//$('#header').height(this.topPanelHeight);
		},
		/**
		 * Set Outer panel width and height
		 * @method resizeMainPanel
		 * @param none
		 */
		resizeMainPanel: function () {
			//$('#outer').height(this.leftPanelHeight);
			//$('#outer').width(this.bodyWidth);
		},
		/**
		 * Set left panel width and height
		 * @method resizeLeftPanel
		 * @param none
		 */
		resizeLeftPanel: function () {
			//$('#leftdiv').width(this.leftPanelWidth);
			$('#leftdiv').height($(window).height());
		},
		/**
		 * Set Canvas width and height
		 * @method resizeCanvas
		 * @param none
		 */
	    resizeCanvas: function () {
			var rightPanelWidth = $(".rightdiv").width();
			//$('#containerDiv').height($(window).height() - this.topPanelHeight - 23);
			$('#containerDiv').height($(window).height());
			$('#containerDiv').width($(window).width() - (this.leftPanelWidth + rightPanelWidth));
			$('#containerBody').height(this.deviceHeight); //Should be set to container height and width
			$('#containerBody').width(this.deviceWidth);	
			$('#canvasId').height(this.deviceInnerHeight); //Should be set to container inner height and width
			$('#canvasId').width(this.deviceInnerWidth);		
			canvas.setDimensions({width: this.canvasWidth, height: this.canvasHeight});
		},
		
		/**
		 * Bind resizing of window to panels
		 * @method bindResizeWindow
		 * @param none
		 */
		bindResizeWindow: function () {
			var thisObj = this;
			$(window).resize(function () {
				thisObj.initWidthAndHeightOfPanels();
			    thisObj.resizeWindow();
			    //thisObj.setCanvasSize();
				thisObj.drawHVLines();
			});			
		},
		/**
		 *  Reset Current seltected tool Icon when object is drawn on canvas
		 *  @method  resetIconSelection
		 *  @param none 
                 *
		 *  TODO -- This method is obselete, should be removed in near future
		 */
		resetIconSelection: function () {
			if (matisse.$currActiveIcon) {
				matisse.$currActiveIcon.attr("src", matisse.$currActiveIcon.attr('data-inactive'));
				matisse.$currActiveIcon.parent().parent().removeClass('shape-active');
			}
		},
		/**
		 *  Reset Current seltected shape
		 *  @method  resetShapeSelection
		 *  @param none 
		 *  
		 */
		
		resetShapeSelection:function(){
			if (matisse.$currShape) {
				matisse.$currShape.removeClass('shape-selected');
			}
		}, 
		/**
		 * Sets the Canvas width and height based on browser window size
		 * @method setCanvasSize
		 * @param none
		 *
		 */
		setCanvasSize: function () {			
			var width = this.canvasWidth;
			var height = this.canvasHeight;
			canvas.setDimensions({width: width, height: height});
		},
		/**
		 * Update accordion
		 * @method updateAccordian
		 * @param palette_DisplayName
		 */
		updateAccordian: function (palette_DisplayName) {
			$("#accordion").append('<div class="p-header p-close" data-accName="'+ palette_DisplayName +'"><div class="p-text">' + palette_DisplayName + '</div><div class="p-icon"></div></div><div  class="p-cntr" data-paletteName="'+palette_DisplayName+'" id="' + palette_DisplayName + '"></div>');
		},
		
		/**
		 * Draws Horizontal and Vertical lines that are used as guilde lines for object alignment
		 * @method drawHVLines
		 * @param none
		 */
		drawHVLines: function () {
			//remove first, needs to redraw when window is resized
			canvas.remove(matisse.hLine);
			canvas.remove(matisse.vLine);
			
			var width = this.canvasWidth;
			var height = this.canvasHeight;
			matisse.hLine = new fabric.Line([0, -10, width, -10], {
				eanbled: false,
				stroke: '#ff0000',
				left: width / 2
			});
			matisse.vLine = new fabric.Line([-10, 0, -10, height], {
				eanbled: false,
				stroke: '#ff0000',
				top: height / 2
			});
			matisse.vLine.name = 'vline';
			matisse.hLine.name = 'hline';
			canvas.add(matisse.hLine);
			canvas.add(matisse.vLine);
			matisse.hLine.set('fill', '#ff0000');
			matisse.vLine.set('fill', '#ff0000');
			matisse.hLine.set('strokeWidth', '.5');
			matisse.vLine.set('strokeWidth', '.5');
			//disableObject(line);
			//	fabric.util.makeElementUnselectable(line)
		}
	};

	return ui;
});
