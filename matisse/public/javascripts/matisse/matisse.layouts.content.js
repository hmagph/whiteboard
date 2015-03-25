/**
 * User: Bhavani Shankar
 * Date: 12/28/11
 * Time: 11:16 AM
 * About this : Generates different type of layouts
 */

require(["matisse", "matisse.main", "matisse.layouts", "matisse.palettes.properties", "matisse.util"], function (matisse, main, layouts, objproperties, util) {
	
	layouts.registerLayout("content", {
		collectionName: 'content',
		layouts: {
			/**
			 * This is a blank layout, where only border is displayed.
			 * Only a single rectangle from basic shapes is created with arguments passed to it.
			 */
			blank: {
				displayName: "blank",
				/**
				 * Here, blank layout is created for the first time when a blank layout is chosen from the combo.
				 */
				toolAction: function () {
					var canvas_width = canvas.width,
						canvas_height = canvas.height,
						args1 = [{
							width: canvas_width - 20,
							height: canvas_height - 20,
							left: canvas_width / 2,
							top: canvas_height / 2,
							fill: '#ffffff',
							stroke: '#000000',
							uid: util.uniqid(),
							palette: "shapes",
							angle: 0,
							scaleX: 1,
							scaleY: 1
						}],
						args = [];
					matisse.palette["shapes"].shapes["rectangle"].toolAction.apply(this, args1);
					args.push(args1);
					/**
					 * arguments of each object are returned so that they can be sent to the server and its state is saved.
					 */
					return args;
				}
			},

			/**
			 * This is a column_header layout, where a header as well as content section are there.
			 * Two rectangles, one for header and the other for content from basic shapes are created with arguments passed to it.
			 */
			column_header: {
				displayName: "column_header",
				/**
				 * Here, column_header layout is created for the first time when a column_header layout is chosen from the combo.
				 */
				toolAction: function () {
					var canvas_width = canvas.width,
						canvas_height = canvas.height,
						/**
						 * arguments for header rectangle
						 */
						args1 = [{
							width: canvas_width - 20,
							height: 50,
							left: canvas_width / 2,
							top: 50,
							fill: '#ffffff',
							stroke: '#000000',
							uid: util.uniqid(),
							palette: "shapes",
							angle: 0,
							scaleX: 1,
							scaleY: 1
						}],
						/**
						 * arguments for content rectangle
						 */
						args2 = [{
							width: canvas_width - 20,
							height: canvas_height - 90,
							left: canvas_width / 2,
							top: canvas_height / 2 + 40,
							fill: '#ffffff',
							stroke: '#000000',
							uid: util.uniqid(),
							palette: "shapes",
							angle: 0,
							scaleX: 1,
							scaleY: 1
						}],
						args = [];
					matisse.palette["shapes"].shapes["rectangle"].toolAction.apply(this, args1);
					matisse.palette["shapes"].shapes["rectangle"].toolAction.apply(this, args2);
					args.push(args1);
					args.push(args2);
					/**
					 * arguments of each object are returned so that they can be sent to the server and its state is saved.
					 */
					return args;
				}
			},	//End of column_header layout

			/**
			 * This is a column_header_footer layout, where a header, content as well as footer sections are there.
			 * Three rectangles, one for header, one for content and the other for footer from basic shapes are created with arguments passed to it.
			 */
			column_header_footer: {
				displayName: "column_header_footer",				
				toolAction: function () {
					var canvas_width = canvas.width,
						canvas_height = canvas.height,
						/**
						 * arguments for header rectangle
						 */
						args1 = [{
							width: canvas_width - 20,
							height: 50,
							left: canvas_width / 2,
							top: 50,
							fill: '#ffffff',
							stroke: '#000000',
							uid: util.uniqid(),
							palette: "shapes",
							angle: 0,
							scaleX: 1,
							scaleY: 1
						}],					
						/**
						 * arguments for content rectangle
						 */
						args2 = [{
							width: canvas_width - 20,
							height: canvas_height - 180,
							left: canvas_width / 2,
							top: canvas_height / 2 + 10,
							fill: '#ffffff',
							stroke: '#000000',
							uid: util.uniqid(),
							palette: "shapes",
							angle: 0,
							scaleX: 1,
							scaleY: 1
						}],
						/**
						 * arguments for footer rectangle
						 */
						args3 = [{
							width: canvas_width - 20,
							height: 50,
							left: canvas_width / 2,
							top: canvas_height - 35,
							fill: '#ffffff',
							stroke: '#000000',
							uid: util.uniqid(),
							palette: "shapes",
							angle: 0,
							scaleX: 1,
							scaleY: 1
						}],
						args = [];
					matisse.palette["shapes"].shapes["rectangle"].toolAction.apply(this, args1);
					matisse.palette["shapes"].shapes["rectangle"].toolAction.apply(this, args2);
					matisse.palette["shapes"].shapes["rectangle"].toolAction.apply(this, args3);
					
					args.push(args1);
					args.push(args2);
					args.push(args3);
					/**
					 * arguments of each object are returned so that they can be sent to the server and its state is saved.
					 */					
					return args;
				}
			},	//End of column_header_footer layout
			
			/**
			 * This is a two_column_header layout, where a header, and two adjacent content sections are there.
			 * Three rectangles, one for header, one for left content and the other for right content section from basic shapes are created with arguments passed to it.
			 */
			two_column_header: {
				displayName: "two_column_header",				
				toolAction: function () {
					var canvas_width = canvas.width,
						canvas_height = canvas.height,
						/**
						 * arguments for header rectangle
						 */
						args1 = [{
							width: canvas_width - 20,
							height: 50,
							left: canvas_width / 2,
							top: 50,
							fill: '#ffffff',
							stroke: '#000000',
							uid: util.uniqid(),
							palette: "shapes",
							angle: 0,
							scaleX: 1,
							scaleY: 1
						}],
						/**
						 * arguments for left content rectangle
						 */
						args2 = [{
							width: canvas_width / 2 - 20,
							height: canvas_height - 120,
							left: canvas_width / 4,
							top: canvas_height / 2 + 40,
							fill: '#ffffff',
							stroke: '#000000',
							uid: util.uniqid(),
							palette: "shapes",
							angle: 0,
							scaleX: 1,
							scaleY: 1
						}],
						/**
						 * arguments for right content rectangle
						 */
						args3 = [{
							width: canvas_width / 2 - 20,
							height: canvas_height - 120,
							left: 3 * canvas_width / 4,
							top: canvas_height / 2 + 40,
							fill: '#ffffff',
							stroke: '#000000',
							uid: util.uniqid(),
							palette: "shapes",
							angle: 0,
							scaleX: 1,
							scaleY: 1
						}],
						args = [];
					/**
					 * To call basic shapes rectangle's tool action to create fabric rectangle on canvas
					 */
					matisse.palette["shapes"].shapes["rectangle"].toolAction.apply(this, args1);
					matisse.palette["shapes"].shapes["rectangle"].toolAction.apply(this, args2);
					matisse.palette["shapes"].shapes["rectangle"].toolAction.apply(this, args3);

					args.push(args1);
					args.push(args2);
					args.push(args3);
					/**
					 * arguments of each object are returned so that they can be sent to the server and its state is saved.
					 */						
					return args;
				}
			},	//End of two_column_header layout

			/**
			 * This is a two_column_header_footer layout, where a header, and two adjacent content sections and a footer section are there.
			 * Four rectangles, one for header, one for left content and the other for right content and the last for footer section from basic shapes are created with arguments passed to it.
			 */
			two_column_header_footer: {
				displayName: "two_column_header_footer",				
				toolAction: function () {
					var canvas_width = canvas.width,
						canvas_height = canvas.height,
						/**
						 * arguments for header rectangle
						 */
						args1 = [{
							width: canvas_width - 20,
							height: 50,
							left: canvas_width / 2,
							top: 50,
							fill: '#ffffff',
							stroke: '#000000',
							uid: util.uniqid(),
							palette: "shapes",
							angle: 0,
							scaleX: 1,
							scaleY: 1
						}],
						/**
						 * arguments for left content rectangle
						 */
						args2 = [{
							width: canvas_width / 2 - 20,
							height: canvas_height - 190,
							left: canvas_width / 4,
							top: canvas_height / 2 + 10,
							fill: '#ffffff',
							stroke: '#000000',
							uid: util.uniqid(),
							palette: "shapes",
							angle: 0,
							scaleX: 1,
							scaleY: 1
						}],
						/**
						 * arguments for right content rectangle
						 */
						args3 = [{
							width: canvas_width / 2 - 20,
							height: canvas_height - 190,
							left: 3 * canvas_width / 4,
							top: canvas_height / 2 + 10,
							fill: '#ffffff',
							stroke: '#000000',
							uid: util.uniqid(),
							palette: "shapes",
							angle: 0,
							scaleX: 1,
							scaleY: 1
						}],
						
						/**
						 * arguments for footer rectangle
						 */
						args4 = [{
							width: canvas_width - 20,
							height: 50,
							left: canvas_width / 2,
							top: canvas_height - 35,
							fill: '#ffffff',
							stroke: '#000000',
							uid: util.uniqid(),
							palette: "shapes",
							angle: 0,
							scaleX: 1,
							scaleY: 1
						}],
						args = [];
						
					/**
					 * To call basic shapes rectangle's tool action to create fabric rectangle on canvas
					 */
					matisse.palette["shapes"].shapes["rectangle"].toolAction.apply(this, args1);
					matisse.palette["shapes"].shapes["rectangle"].toolAction.apply(this, args2);
					matisse.palette["shapes"].shapes["rectangle"].toolAction.apply(this, args3);
					matisse.palette["shapes"].shapes["rectangle"].toolAction.apply(this, args4);

					args.push(args1);
					args.push(args2);
					args.push(args3);
					args.push(args4);					
					/**
					 * arguments of each object are returned so that they can be sent to the server and its state is saved.
					 */	
					return args;
				}
			},	//End of two_column_header_footer layout

			/**
			 * This is a three_column_header layout, where a header, and three adjacent content sections are there.
			 * Four rectangles, one for header, one for left content and the other for middle content section and the other for right content section from basic shapes are created with arguments passed to it.
			 */			
			three_column_header: {
				displayName: "three_column_header",				
				toolAction: function() {
					var canvas_width = canvas.width,
						canvas_height = canvas.height,
						/**
						 * arguments for header rectangle
						 */
						args1 = [{
							width: canvas_width - 20,
							height: 50,
							left: canvas_width/2,
							top: 50,
							fill: '#ffffff',
							stroke: '#000000',
							uid: util.uniqid(),
							palette: "shapes",
							angle: 0,
							scaleX: 1,
							scaleY: 1
						}],
						/**
						 * arguments for left content rectangle
						 */
						args2 = [{
							width: canvas_width/3 - 20,
							height: canvas_height - 120,
							left: canvas_width/6,
							top: canvas_height/2 + 40,
							fill: '#ffffff',
							stroke: '#000000',
							uid: util.uniqid(),
							palette: "shapes",
							angle: 0,
							scaleX: 1,
							scaleY: 1
						}],
						/**
						 * arguments for middle content rectangle
						 */
						args3 = [{
							width: canvas_width/3 - 20,
							height: canvas_height - 120,
							left: canvas_width/2,
							top: canvas_height/2 + 40,
							fill: '#ffffff',
							stroke: '#000000',
							uid: util.uniqid(),
							palette: "shapes",
							angle: 0,
							scaleX: 1,
							scaleY: 1
						}],
						/**
						 * arguments for right content rectangle
						 */
						args4 = [{
							width: canvas_width/3 - 20,
							height: canvas_height - 120,
							left: 5 * canvas_width/6,
							top: canvas_height/2 + 40,
							fill: '#ffffff',
							stroke: '#000000',
							uid: util.uniqid(),
							palette: "shapes",
							angle: 0,
							scaleX: 1,
							scaleY: 1
						}],
						args = [];
					
					/**
					 * To call basic shapes rectangle's tool action to create fabric rectangle on canvas
					 */
					matisse.palette["shapes"].shapes["rectangle"].toolAction.apply(this, args1);
					matisse.palette["shapes"].shapes["rectangle"].toolAction.apply(this, args2);
					matisse.palette["shapes"].shapes["rectangle"].toolAction.apply(this, args3);
					matisse.palette["shapes"].shapes["rectangle"].toolAction.apply(this, args4);
					
					args.push(args1);
					args.push(args2);
					args.push(args3);
					args.push(args4);

					/**
					 * arguments of each object are returned so that they can be sent to the server and its state is saved.
					 */					
					return args;					
				}
			},	//End of three_column_header layout

			/**
			 * This is a three_column_header_footer layout, where a header, and three adjacent content sections and a footer section are there.
			 * Five rectangles, one for header, one for left content and the other for middle content section and the other for right content section and the last one for footer section from basic shapes are created with arguments passed to it.
			 */
			 three_column_header_footer: {
				displayName: "three_column_header_footer",
				toolAction: function () {
					var canvas_width = canvas.width,
						canvas_height = canvas.height,
						/**
						 * arguments for header rectangle
						 */
						args1 = [{
							width: canvas_width - 20,
							height: 50,
							left: canvas_width/2,
							top: 50,
							fill: '#ffffff',
							stroke: '#000000',
							uid: util.uniqid(),
							palette: "shapes",
							angle: 0,
							scaleX: 1,
							scaleY: 1
						}],
						/**
						 * arguments for left content rectangle
						 */
						args2 = [{
							width: canvas_width/3 - 20,
							height: canvas_height - 190,
							left: canvas_width/6,
							top: canvas_height/2 + 10,
							fill: '#ffffff',
							stroke: '#000000',
							uid: util.uniqid(),
							palette: "shapes",
							angle: 0,
							scaleX: 1,
							scaleY: 1
						}];
						/**
						 * arguments for middle content rectangle
						 */
						args3 = [{
							width: canvas_width/3 - 20,
							height: canvas_height - 190,
							left: canvas_width/2,
							top: canvas_height/2 + 10,
							fill: '#ffffff',
							stroke: '#000000',
							uid: util.uniqid(),
							palette: "shapes",
							angle: 0,
							scaleX: 1,
							scaleY: 1
						}],
						/**
						 * arguments for right content rectangle
						 */
						args4 = [{
							width: canvas_width/3 - 20,
							height: canvas_height - 190,
							left: 5 * canvas_width/6,
							top: canvas_height/2 + 10,
							fill: '#ffffff',
							stroke: '#000000',
							uid: util.uniqid(),
							palette: "shapes",
							angle: 0,
							scaleX: 1,
							scaleY: 1
						}],
						/**
						 * arguments for footer rectangle
						 */
						args5 = [{
							width: canvas_width - 20,
							height: 50,
							left: canvas_width/2,
							top: canvas_height - 30,
							fill: '#ffffff',
							stroke: '#000000',
							uid: util.uniqid(),
							palette: "shapes",
							angle: 0,
							scaleX: 1,
							scaleY: 1
						}],
						args = [];
					/**
					 * To call basic shapes rectangle's tool action to create fabric rectangle on canvas
					 */
					matisse.palette["shapes"].shapes["rectangle"].toolAction.apply(this, args1);
					matisse.palette["shapes"].shapes["rectangle"].toolAction.apply(this, args2);
					matisse.palette["shapes"].shapes["rectangle"].toolAction.apply(this, args3);
					matisse.palette["shapes"].shapes["rectangle"].toolAction.apply(this, args4);
					matisse.palette["shapes"].shapes["rectangle"].toolAction.apply(this, args5);

					args.push(args1);
					args.push(args2);
					args.push(args3);
					args.push(args4);
					args.push(args5);
					/**
					 * arguments of each object are returned so that they can be sent to the server and its state is saved.
					 */
					return args;
				}
			}	//End of three_column_header_footer layout
		} 
	}); 
	
	layouts.registerLayout("custom", {
		collectionName: 'custom',
		layouts: {
			uploadLayout: {
				displayName: "uploadLayout",
				toolAction: function() {
					var oReader = new FileReader();
					if (matisse.layoutURL) {
						oReader.onload = (function (theFile) {
							return function (e) {
								var args = {};
								args.left = 100;
								args.top = 300;
								args.scaleX = 1;
								args.scaleY = 1;
								args.angle = 0;
								args.uid = util.uniqid();
								args.name = 'uploadLayout';
								args.palette = 'custom';
								args.self = true;
								var img = new Image();
								img.onload = function() {
									args.image = this;
									args.src = this.src;
									args.width = canvas.width;
									args.height = canvas.height;
									matisse.main.addLayoutToCanvas(args);
								}
								img.src = e.target.result
							};
						})(matisse.layoutURL);
						// Read in the image file as a data URL.
						oReader.readAsDataURL(matisse.layoutURL);
					}
				}				
			}
		}
	});
});