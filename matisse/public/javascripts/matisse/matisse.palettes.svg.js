/**
 * User: Bhavani Shankar,Pradeep
 * Date: 12/28/11
 * Time: 11:16 AM
 * About this : Define all SVGs here
 */
require(["matisse", "matisse.main", "matisse.palettes", "matisse.palettes.properties", "matisse.util"], function (matisse, main, palettes, objproperties, util) {

	var updateProperties = function (obj, recvdObj) {
		obj.left = recvdObj.left;
		obj.top = recvdObj.top;
		obj.scaleX = recvdObj.scaleX;
		obj.scaleY = recvdObj.scaleY;
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
	loadSVG = function (args) {
		fabric.loadSVGFromURL('/images/svg/' + args.svg, function (objects, options) {
            var loadedObject;
            if (objects.length > 1) {
                loadedObject = new fabric.PathGroup(objects, options);
            } else {
                loadedObject = objects[0];
            }

            loadedObject.set({
                left: args.left,
                top: args.top,
                angle: 0
            });
            loadedObject.name = args.name;
            loadedObject.palette = args.palette;
			loadedObject.uid = args.uid;
            loadedObject.scaleToWidth(100).setCoords();
            canvas.add(loadedObject);
        });

    }
palettes.registerpalette("svg", {
    order: 4,
    collectionName: 'svg',
    shapes: {
        pathgroup1: {
            displayName: "pathgroup1",
            activeIcon: "36.svg",
            inactiveIcon: "36.svg",
            toolAction: function (args) {
                args.svg = '36.svg'
                args.name = 'pathgroup1';
                loadSVG(args);
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
                defaultvalue: 200
            }, {
                name: 'scaleY',
                type: 'number',
                action: function (args) {
                    (args.obj).set("scaleY", args.property);
                },
                defaultvalue: 100
            },

            {
                name: 'angle',
                type: 'number',
                action: function (args) {
                    (args.obj).set("angle", args.property);
                },
                defaultvalue: 0
            }]
        },
        pathgroup2: {
            displayName: "pathgroup2",
            activeIcon: "17.svg",
            inactiveIcon: "17.svg",
            toolAction: function (args) {
                args.svg = '17.svg';
                args.name = 'pathgroup2';
                loadSVG(args);
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
                defaultvalue: 200
            }, {
                name: 'scaleY',
                type: 'number',
                action: function (args) {
                    (args.obj).set("scaleY", args.property);
                },
                defaultvalue: 100
            },

            {
                name: 'angle',
                type: 'number',
                action: function (args) {
                    (args.obj).set("angle", args.property);
                },
                defaultvalue: 0
            }]
        },
		button: {
            displayName: "button",
            activeIcon: "25.svg",
            inactiveIcon: "25.svg",
            toolAction: function (args) {
                args.svg = '25.svg';
                args.name = 'button';
                loadSVG(args);
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
                defaultvalue: 200
            }, {
                name: 'scaleY',
                type: 'number',
                action: function (args) {
                    (args.obj).set("scaleY", args.property);
                },
                defaultvalue: 100
            },

            {
                name: 'angle',
                type: 'number',
                action: function (args) {
                    (args.obj).set("angle", args.property);
                },
                defaultvalue: 0
            }]
        }

    } //end of shapes
} // end of svg
);
})