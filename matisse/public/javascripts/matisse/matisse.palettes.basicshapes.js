/**
 * User: Bhavani Shankar,Pradeep
 * Date: 12/28/11
 * Time: 11:16 AM
 * About this : To set the properties of the object with the received object
 */

require(["matisse", "matisse.main", "matisse.palettes", "matisse.palettes.properties", "matisse.util"], function (matisse, main, palettes, objproperties, util) {
	"use strict";
	var updateProperties = function (obj, recvdObj) {
		obj.left = recvdObj.left;
		obj.top = recvdObj.top;
		obj.scaleX = recvdObj.scaleX;
		obj.scaleY = recvdObj.scaleY;
		obj.width = recvdObj.width;
		obj.height = recvdObj.height;
		obj.setAngle(recvdObj.angle);
		if (recvdObj.fill) {
			obj.set("fill", recvdObj.fill);
		}
		if (recvdObj.stroke) {
			obj.set("stroke", recvdObj.stroke);
		}
		if (obj.text) {
			obj.text = recvdObj.text;
		}
		if(recvdObj.path)
		obj.path = recvdObj.path;
	};
	palettes.registerpalette("shapes", {
	  order: 1,
		collectionName: 'shapes',
		shapes: {
			rectangle: {
				name: "rectangle",
				displayName: "Rectangle",
				activeIcon: "rectangle_w.png",
				inactiveIcon: "rectangle_g.png",
				toolAction: function (args) {
					var rect = new fabric.Rect({
						width: args.width,
						height: args.height,
						left: args.left,
						top: args.top,
						fill: args.fill,
						stroke: args.stroke,
						scaleX: args.scaleX,
						scaleY: args.scaleY
					});
					rect.uid = args.uid;
					rect.name = 'rectangle';
					rect.palette = args.palette;
					rect.setAngle(args.angle);
					//rect.selectable = false;
					canvas.add(rect);
				},
				modifyAction: function (args) {
					var obj = util.getObjectById(args.uid);
					var recvdObj = args.object;
					updateProperties(obj, recvdObj);
				},
				applyProperties: function (props) {
					objproperties._applyProperties(props);
				},
				properties: [{
					name: 'left',
					type: 'number',
					action: function (args) {
						(args.obj).set("left", args.property);
					},
					defaultvalue: 100
				}, {
					name: 'top',
					type: 'number',
					action: function (args) {
						(args.obj).set("top", args.property);
					},
					defaultvalue: 100
				}, {
					name: 'width',
					type: 'number',
					action: function (args) {
						(args.obj).set("width", args.property / args.obj.scaleX);
					},
					defaultvalue: 200
				}, {
					name: 'height',
					type: 'number',
					action: function (args) {
						(args.obj).set("height", args.property / args.obj.scaleY);
					},
					defaultvalue: 100
				}, {
					name: 'scaleX',
					type: 'number',
					action: function (args) {
						(args.obj).set("scaleX", args.property);
					},
					defaultvalue: 1
				}, {
					name: 'scaleY',
					type: 'number',
					action: function (args) {
						(args.obj).set("scaleY", args.property);
					},
					defaultvalue: 1
				}, {
					name: 'fill',
					type: 'string',
					action: function (args) {
						(args.obj).set("fill", args.property);
					},
					defaultvalue: '#D3DAE5'
				}, {
					name: 'stroke',
					type: 'string',
					action: function (args) {
						(args.obj).set("stroke", args.property);
					},
					defaultvalue: '#000000'
				}, {
					name: 'angle',
					type: 'number',
					action: function (args) {
						(args.obj).set("angle", args.property);
					},
					defaultvalue: 0
				}]
			},
			circle: {
				name: "circle",
				displayName: "Circle",
				activeIcon: "circle_w.png",
				inactiveIcon: "circle_g.png",
				toolAction: function addCircle(args) {
					var cir = new fabric.Circle({
						radius: args.radius,
						left: args.left,
						top: args.top,
						fill: args.fill,
						stroke: args.stroke,
						opacity: 1,
						scaleX: args.scaleX,
						scaleY: args.scaleY
					});
					cir.setAngle(args.angle);
					cir.uid = args.uid;
					cir.name = "circle";
					cir.palette = args.palette;
					canvas.add(cir);
				},
				modifyAction: function (args) {
					var obj = util.getObjectById(args.uid);
					var recvdObj = args.object;
					updateProperties(obj, recvdObj);
					obj.radius = recvdObj.width/2;
				},
				resizeAction: function (resizedObj) {
					var obj = util.getObjectById(resizedObj.uid);
					
					if (obj.width/2 == obj.radius) {
						obj.radius = resizedObj.height/2;
						obj.width = resizedObj.height;
					} else if (obj.height/2 == obj.radius) {
						obj.radius = resizedObj.width/2;
						obj.height = resizedObj.width;
					} else {
						obj.radius = resizedObj.width/2;
						obj.height = resizedObj.width;
					}					
				},
				
				applyProperties: function (props) {
					objproperties._applyProperties(props);
				},
				properties: [{
					name: 'left',
					type: 'number',
					action: function (args) {
						(args.obj).set("left", args.property);
					},
					defaultvalue: 100
				}, {
					name: 'top',
					type: 'number',
					action: function (args) {
						(args.obj).set("top", args.property);
					},
					defaultvalue: 100
				}, {
					name: 'radius',
					type: 'number',
					action: function (args) {
						(args.obj).set("radius", args.property / args.obj.scaleX);
					},
					defaultvalue: 20
				}, {
					name: 'scaleX',
					type: 'number',
					action: function (args) {
						(args.obj).set("scaleX", args.property);
					},
					defaultvalue: 1
				}, {
					name: 'scaleY',
					type: 'number',
					action: function (args) {
						(args.obj).set("scaleY", args.property);
					},
					defaultvalue: 1
				}, {
					name: 'fill',
					type: 'string',
					action: function (args) {
						(args.obj).set("fill", args.property);
					},
					defaultvalue: '#D3DAE5'
				}, {
					name: 'stroke',
					type: 'string',
					action: function (args) {
						(args.obj).set("stroke", args.property);
					},
					defaultvalue: '#000000'
				}, {
					name: 'angle',
					type: 'number',
					action: function (args) {
						(args.obj).set("angle", args.property);
					},
					defaultvalue: 0
				}]

			},
			triangle: {
				name: "triangle",
				displayName: "Triangle",
				activeIcon: "triangle_w.png",
				inactiveIcon: "triangle_g.png",
				toolAction: function addCircle(args) {
					var tri = new fabric.Triangle({
						width: args.width,
						height: args.height,
						left: args.left,
						top: args.top,
						fill: args.fill,
						stroke: args.stroke,
						scaleX: args.scaleX,
						scaleY: args.scaleY
					});
					tri.setAngle(args.angle)
					tri.uid = args.uid;
					tri.name = "triangle";
					tri.palette = args.palette;
					
					canvas.add(tri);
				},
				modifyAction: function (args) {
					var obj = util.getObjectById(args.uid);
					var recvdObj = args.object;
					updateProperties(obj, recvdObj);					
				},
				resizeAction: function (resizedObj) {									
				},				
				applyProperties: function (props) {
					objproperties._applyProperties(props);
				},
				properties: [{
					name: 'left',
					type: 'number',
					action: function (args) {
						(args.obj).set("left", args.property);
					},
					defaultvalue: 100
				}, {
					name: 'top',
					type: 'number',
					action: function (args) {
						(args.obj).set("top", args.property);
					},
					defaultvalue: 100
				}, 
				{
					name: 'scaleX',
					type: 'number',
					action: function (args) {
						(args.obj).set("scaleX", args.property);
					},
					defaultvalue: 1
				}, {
					name: 'scaleY',
					type: 'number',
					action: function (args) {
						(args.obj).set("scaleY", args.property);
					},
					defaultvalue: 1
				},
				{
					name: 'fill',
					type: 'string',
					action: function (args) {
						(args.obj).set("fill", args.property);
					},
					defaultvalue: '#D3DAE5'
				}, {
					name: 'stroke',
					type: 'string',
					action: function (args) {
						(args.obj).set("stroke", args.property);
					},
					defaultvalue: '#000000'
				}, {
					name: 'angle',
					type: 'number',
					action: function (args) {
						(args.obj).set("angle", args.property);
					},
					defaultvalue: 0
				}]

			},
			// end of triangle
			text: {
				name: "text",
				displayName: "Text",
				activeIcon: "text_w.png",
				inactiveIcon: "text_g.png",
				toolAction: function addText(args) {
					var textVal;
					if (args.text) {
						textVal = args.text;
					} else {
						textVal = 'sample';
					}
					var textSample = new fabric.Text(textVal, {
						left: args.left,
						top: args.top,
						fontFamily: 'delicious_500',
						angle: args.angle,
						fill: args.fill,
						scaleX: args.scaleX,
						scaleY: args.scaleY,
						stroke: args.stroke
					});
					//alert(textSample)
					textSample.uid = args.uid;
					textSample.name = "text";
					textSample.palette = args.palette;
					textSample.customName = "text";
					canvas.add(textSample);
				},
				modifyAction: function (args) {
					var obj = util.getObjectById(args.uid);
					var recvdObj = args.object;
					updateProperties(obj, recvdObj);
				},
				resizeAction: function (resizedObj) {					
					var obj = util.getObjectById(resizedObj.uid);
					obj.width = resizedObj.width;
					obj.height = resizedObj.height;
				},
				applyProperties: function (props) {
					objproperties._applyProperties(props);
				},
				properties: [{
					name: 'left',
					type: 'number',
					action: function (args) {
						(args.obj).set("left", args.property);
					},
					defaultvalue: 100
				}, {
					name: 'top',
					type: 'number',
					action: function (args) {
						(args.obj).set("top", args.property);
					},
					defaultvalue: 100
				}, {
					name: 'scaleX',
					type: 'number',
					action: function (args) {
						(args.obj).set("scaleX", args.property);
					},
					defaultvalue: 1
				}, {
					name: 'scaleY',
					type: 'number',
					action: function (args) {
						(args.obj).set("scaleY", args.property);
					},
					defaultvalue: 1
				}, {
					name: 'fill',
					type: 'string',
					action: function (args) {
						(args.obj).set("fill", args.property);
					},
					defaultvalue: '#222222'
				}, {
					name: 'stroke',
					type: 'string',
					action: function (args) {
						(args.obj).set("stroke", args.property);
					},
					defaultvalue: '#00FF00'
				}, {
					name: 'angle',
					type: 'number',
					action: function (args) {
						(args.obj).set("angle", args.property);
					},
					defaultvalue: 0
				}, {
					name: 'text',
					type: 'string',
					action: function (args) {
						(args.obj).set("text", args.property);
					},
					defaultvalue: 'sample'
				}]
			},
			line: {
				name: "line",
				displayName: "Line",
				activeIcon: "line_w.png",
				inactiveIcon: "line_g.png",
				toolAction: function (args) {					
					args.width = args.width ? args.width : 100;	
					args.height = args.strokeWidth ? args.strokeWidth : 1;
					args.strokeWidth = args.strokeWidth ? args.strokeWidth : 1;					
					var line = new fabric.Line([args.left - args.width/2, args.top, args.left + args.width/2, args.top],{								
						width: args.width,
						height: args.height,
						left: args.left,
						top: args.top,
						fill: args.fill,
						stroke: args.stroke,
						strokeWidth: args.strokeWidth,
						scaleX: args.scaleX,
						scaleY: args.scaleY,
						angle: args.angle
					});
					line.uid = args.uid;
					line.name = 'line';
					line.palette = args.palette;
					line.setAngle(args.angle);									
					canvas.add(line);					
				},
				modifyAction: function (args) {
					var obj = util.getObjectById(args.uid);
					var recvdObj = args.object;				
					updateProperties(obj, recvdObj);
					obj.strokeWidth = recvdObj.strokeWidth;
					obj.angle = recvdObj._angle;					
				},
				resizeAction: function (resizedObj) {					
					var obj = util.getObjectById(resizedObj.uid);					
					obj.left = resizedObj.left;
					obj.top = resizedObj.top;
					obj.angle = resizedObj._angle;					
					obj.height = resizedObj.strokeWidth;					
				},				
				applyProperties: function (props) {					
					objproperties._applyProperties(props);					
				},
				properties: [{
					name: 'left',
					type: 'number',
					action: function (args) {
						(args.obj).set("left", args.property);
					},
					defaultvalue: 100
				}, {
					name: 'top',
					type: 'number',
					action: function (args) {
						(args.obj).set("top", args.property);
					},
					defaultvalue: 100
				}, 
				{
					name: 'scaleX',
					type: 'number',
					action: function (args) {
						(args.obj).set("scaleX", args.property);
					},
					defaultvalue: 1
				}, {
					name: 'scaleY',
					type: 'number',
					action: function (args) {
						(args.obj).set("scaleY", args.property);
					},
					defaultvalue: 1
				},
				{
					name: 'fill',
					type: 'string',
					action: function (args) {
						(args.obj).set("fill", args.property);
					},
					defaultvalue: '#000000'
				}, {
					name: 'strokeWidth',
					type: 'number',
					action: function (args) {
						(args.obj).set("strokeWidth", args.property);
					},
					defaultvalue: 1
				}, {
					name: 'angle',
					type: 'number',
					action: function (args) {
						(args.obj).set("angle", args.property);
					},
					defaultvalue: 0
				}]
			},
			importimage: {
				name: "importimage",
				displayName: "Image",
				activeIcon: "rectangle_w.png",
				inactiveIcon: "rectangle_g.png",
				toolAction: null,				
				modifyAction: function (args) {
					var obj = util.getObjectById(args.uid);
					var recvdObj = args.object;
					updateProperties(obj, recvdObj);
				},
				applyProperties: function (props) {
					objproperties._applyProperties(props);
				},
				properties: [{
					name: 'left',
					type: 'number',
					action: function (args) {
						(args.obj).set("left", args.property);
					},
					defaultvalue: 100
				}, {
					name: 'top',
					type: 'number',
					action: function (args) {
						(args.obj).set("top", args.property);
					},
					defaultvalue: 100
				}, {
					name: 'width',
					type: 'number',
					action: function (args) {
						(args.obj).set("width", args.property / args.obj.scaleX);
					},
					defaultvalue: 200
				}, {
					name: 'height',
					type: 'number',
					action: function (args) {
						(args.obj).set("height", args.property / args.obj.scaleY);
					},
					defaultvalue: 100
				}, {
					name: 'scaleX',
					type: 'number',
					action: function (args) {
						(args.obj).set("scaleX", args.property);
					},
					defaultvalue: 1
				}, {
					name: 'scaleY',
					type: 'number',
					action: function (args) {
						(args.obj).set("scaleY", args.property);
					},
					defaultvalue: 1
				}, {
					name: 'angle',
					type: 'number',
					action: function (args) {
						(args.obj).set("angle", args.property);
					},
					defaultvalue: 0
				}]
			},
			drawingpath: {
				name: "path",
				displayName: "Path",
				activeIcon: "brush_w.png",
				inactiveIcon: "brush_g.png",
				toolAction: null,
				modifyAction: function (args) {
					var obj = util.getObjectById(args.uid);
					var recvdObj = args.object;
					updateProperties(obj, recvdObj);
				},
				applyProperties: function (props) {
					objproperties._applyProperties(props);
				},
				properties: [{
					name: 'left',
					type: 'number',
					action: function (args) {
						(args.obj).set("left", args.property);
					},
					defaultvalue: 100
				}, {
					name: 'top',
					type: 'number',
					action: function (args) {
						(args.obj).set("top", args.property);
					},
					defaultvalue: 100
				},	{
					name: 'scaleX',
					type: 'number',
					action: function (args) {
						(args.obj).set("scaleX", args.property);
					},
					defaultvalue: 1
				}, {
					name: 'scaleY',
					type: 'number',
					action: function (args) {
						(args.obj).set("scaleY", args.property);
					},
					defaultvalue: 1
				}, {
					name: 'stroke',
					type: 'string',
					action: function (args) {
						(args.obj).set("stroke", args.property);
					},
					defaultvalue: '#00FF00'
				}
				]
			}, // end of path
		} // end of shapes
	}); // end of basic shapes
});
