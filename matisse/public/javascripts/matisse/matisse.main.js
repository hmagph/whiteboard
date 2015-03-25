/**
 * User: Bhavani Shankar
 * Date: 01/19/12
 * Time: 11:16 AM
 * About this : This is the main javascipt file to handle adding, editing, deleting all elements on canvas (text, rectangle, circle etc)
 * Uses 'Fabric.js' library for client side
 * Node.js and  Node Package Manager (NPM) for server side - JavaScript environment that uses an asynchronous event-driven model.
 */
define(["matisse", "matisse.ui", "matisse.util", "matisse.fabric", "matisse.palettes", "matisse.events", "matisse.palettes.properties", "matisse.toolbuttons.handlers", "matisse.comm","../components/ui.imaginea.accordion","matisse.action-bar"], function (matisse, ui, util, mfabric, palettes, events,  properties, toolHandlers, comm, CustomAccordion,mActionBar) {
    "use strict";
    /**
     *  create canvas object
     */
    window.canvas = new fabric.Canvas('c', {
        //backgroundColor: '#FFFFFF'
    });
    //canvas.setOverlayImage('/images/bg_overlay_iphone.png', canvas.renderAll.bind(canvas));
    /**
     * by default selection mode is false 
     */
    canvas.isSelectMode = false;
    var main = {
        /**
         * Initializes the application
         * @method main.init
         * @param none
         *
         */
        init: function () {
            ui.initWidthAndHeightOfPanels();
            ui.resizeWindow();
            //ui.setCanvasSize();
            ui.bindResizeWindow();
            ui.drawHVLines();
            canvas.isSelectMode = true;
            
            matisse.xOffset = util.getOffset(document.getElementById('canvasId')).left+matisse.xOffset;
            matisse.yOffset = util.getOffset(document.getElementById('canvasId')).top+ matisse.yOffset;
            
            // this.addTools();

            document.onkeydown = events.keyDown;
            $('#propicon').click(toolHandlers.openPropertiesPanel);
            $('#editicon, #friendsicon, #reporticon, #shareicon')
                .click(toolHandlers.openSubmenu);
            $('ul.menu-list', 'div.m-submenu-list').on("click", "li" , function () {
                var handler, command;
                switch($(this).attr('id')) {
                case 'Undo':
                    handler = 'handleUndoRedoAction';
                    command = 'undo';
                    break;
                case 'Redo':
                    handler = 'handleUndoRedoAction';
                    command = 'redo';
                    break;
                default:
                    handler = 'handle'+$(this).attr('id')+'Action';
                    command = '';
                }
                mActionBar[handler] && mActionBar[handler](command);
            });
            
            if(matisse.containers[matisse.containerName].src=="") {
                $('#showImageIcon').click(mActionBar.handleRawAction);
            } else {
                $('#showImageIcon').click(toolHandlers.openSubmenu);
            }

            $('ul.menu-list','div.m-align-list').on("click", "li" , function () {
                var selected_group = canvas.getActiveGroup();
                var selected_group_obj_array = selected_group.getObjects();
                var handler = 'handle'+$(this).attr('id')+'Action';
                mActionBar[handler](selected_group, selected_group_obj_array);
                $('span.prop_icon','div.m-quick-edit-group').trigger('click');
                canvas.fire('object:modified');
                canvas.renderAll();
            });
            $('div.m-quick-edit').on("click", "span", function(event) { 
                var item_checked = $(event.target); 
                if(item_checked.hasClass('prop_icon')) {item_checked.addClass('selected');toolHandlers.openPropertiesPanel();}
                else if(item_checked.hasClass('copy_icon')) {item_checked.addClass('selected');mActionBar.handleCopyAction();}
                else {mActionBar.stateUpdated(null, "deleted");util.hideQuickMenuDiv();}
            });
            
            $('div.m-quick-edit-group').on("click", "span", function(event) { 
                var item_checked = $(event.target);
                if(item_checked.hasClass('prop_icon')) {
                    item_checked.toggleClass('selected');
                    item_checked.parents('div.m-quick-edit-group').find('div.m-align-list').toggle();
                }
                else if(item_checked.hasClass('copy_icon')) {item_checked.addClass('selected');mActionBar.handleGroupCopyAction();}
                else { //$.each(selected_group_obj_array,function(index,value) { mActionBar.stateUpdated(value, "deleted"); })
                    mActionBar.stateUpdated(null, "deleted");util.hideQuickMenuGroupDiv();
                }
            });
            
            mActionBar.initialize();            
            mfabric.initialize();

            //TODO - Refactor
            toolHandlers.newButtonClickHanlder();
            toolHandlers.helpButtonListener();
            toolHandlers.importImageButtonListener();
            //toolHandlers.bindContainerCombo();
            //toolHandlers.bindLayoutCombo();
            toolHandlers.logoutButtonClickHandler();
        },

        /**
         *  Check for the active object or group object and remove them from canvas
         *  @method  deleteObjects
         *  @param none
         */
        deleteObjects: function () {
            var activeObject = canvas.getActiveObject(),
            activeGroup = canvas.getActiveGroup();

            if (activeObject) {
                canvas.remove(activeObject);
                matisse.comm.sendDrawMsg({
                    action: "delete",
                    args: [{
                        uid: activeObject.uid
                    }]
                });
                $('#propdiv').dialog('close');
            } else if (activeGroup) {
                var objectsInGroup = activeGroup.getObjects();
                canvas.discardActiveGroup();
                objectsInGroup.forEach(function (object) {
                    canvas.remove(object);
                    matisse.comm.sendDrawMsg({
                        action: "delete",
                        args: [{
                            uid: object.uid
                        }]
                    });
                });
            }
        },
        /**
         *  When receive a notification from server to modify the other side when it gets modified.
         *  @method  modifyObject
         *  @param args - received object and object's id.
         */
        modifyObject: function (args) {
            var obj = util.getObjectById(args[0].uid);
            try{
                if (obj) {
                    if (canvas.getActiveGroup()) {
                        canvas.deactivateAllWithDispatch();
                        canvas.renderAll();
                    }
                    matisse.palette[obj.palette].shapes[obj.name].modifyAction ? matisse.palette[obj.palette].shapes[obj.name].modifyAction.apply(this, args) : null;
                    obj.setCoords(); // without this object selection pointers remain at orginal postion(beofore modified)
                }
                canvas.renderAll();
            }catch(e) {
                if (console && console.error) {
                    console.error("Problems with modifyObject");
                }
            }
        },
        /**
         * Draw free-hand drawing path when notification received from server
         * @method drawPath
         * @param args
         */
        drawPath: function (args) {
            var p = new fabric.Path(args.path);
            p.fill = null;
            p.stroke = args.stroke;
            p.strokeWidth = 1;
            p.uid = args.uid;
            p.name = "drawingpath";
            p.scaleX = 1;
            p.scaleY = 1;
            p.palette = "shapes";
            p.set("left", args.left);
            p.set("top", args.top);
            p.set("width", args.width);
            p.set("height", args.height);
            canvas.add(p);
            canvas.renderAll();
            p.setCoords();
        },
        /**
         *  Handle MouseMove and MouseDown events - when user trying to draw a shape on canvas
         *  @method  handleMouseEvents
         *  @param none
         */
        handleMouseEvents: function () {
            $('#canvasId').bind('mousedown', events.mouseDown);
            $('#canvasId').bind('mousemove', events.mouseMove);
            $('#canvasId').bind('contextmenu', events.contextMenu);
        },
        /**
         * Grabs all the shape elements and creates a tool icon for each shape, to add in the toolbar
         * @method addTools
         * @param none
         */
        addTools: function () {
            palettes.createAllPallettes(matisse.palette);
            new CustomAccordion({
                "cntrId":"accordion",  
                "headerClass":"p-header",
                "sectionClass":"p-cntr",
                "headerOpenClass":"p-open",
                "headerCloseClass":"p-close"
            });
            
            
            $('#toolsdiv').append("<div id='deleteTool' class='tools deleteTool'></div>");
            $('#deleteTool').click(function () {
                main.deleteObjects();
            });
            main.handleMouseEvents();
        },
        /**
         *  Called when other users add, modify or delete any object
         *  @method  matisse.onDraw
         *  @param data - shape(data.shape) and args array (data.args)
         *
         */
        commOnDraw: function () {
            comm.prototype.onDraw =  function (data) {
                if (data && data.args) {
                    if (data.action === undefined || data.action === null) {
                        return;
                    }
                    if (data.action === "modified") {
                        matisse.main.modifyObject(data.args);
                    } else if (data.action === "drawpath") {
                        matisse.main.drawPath(data.args[0]);
                    } else if (data.action === "delete") {
                        var obj = util.getObjectById(data.args[0].uid);
                        var activeObj = canvas.getActiveObject();
                        canvas.remove(obj);
                        if (activeObj == obj) {
                            $('#propdiv').dialog('close');
                            util.hideQuickMenuDiv();
                        }
                    } else if (data.action === "importimage") {
                        matisse.main.addImageToCanvasFromServer(data.args[0]);
                    } else if (data.action === "zindexchange") {
                        var obj = util.getObjectById(data.args[0].uid);
                        if(data.args[0].change === 'forward') {
                            canvas.bringForward(obj);
                            canvas.renderAll();
                        } else {
                            canvas.sendBackwards(obj);
                            canvas.renderAll();
                        }
                    } else if (data.action === "uploadLayout") {
                        matisse.main.addLayoutToCanvasFromServer(data.args[0]);
                    } else {
                        if (matisse.palette[data.palette] !== undefined) {
                            matisse.palette[data.palette].shapes[data.action].toolAction.apply(this, data.args);
                        }                   
                    }
                }
            };
        },
        /**
         * Adding image to canvas when data received from Server 
         * @method addImageToCanvasFromServer
         * @param args - image source and other properties
         */
        addImageToCanvasFromServer : function(args) {
            var img = new Image();
            img.onload = function() {
                args.image = this;
                args.width = this.width;
                args.height = this.height;
                matisse.main.addImageToCanvas(args);    
            }
            /* args.src - image source as dataURL */
            img.src = args.src;
        },
        
        /**
         * Adding layout to canvas when data received from Server 
         * @method addLayoutToCanvasFromServer
         * @param args - image source and other properties
         */
        addLayoutToCanvasFromServer: function (args) {
            var img = new Image();
            img.onload = function() {
                args.image = this;
                args.width = this.width;
                args.height = this.height;
                matisse.main.addLayoutToCanvas(args);   
            }
            /* args.src - image source as dataURL */
            img.src = args.src;
        },
        
        /**
         * Adding layout to canvas as a background image when user selects a layout image from local storage
         * @method addLayoutToCanvas
         * @param args - image source and other properties
         */
        addLayoutToCanvas: function (args) {
            /* args.image - HTML Element */
            var fabImage = new fabric.Image(args.image, {               
                width: args.width,
                height: args.height             
            });         
            canvas.setBackgroundImage(args.src, function() {
                canvas.renderAll();
            });
            fabImage.uid = args.uid;
            fabImage.name = args.name;
            fabImage.palette = args.palette;            
            if(args.self) {
                args.self = false;
                matisse.comm.sendDrawMsg({
                    action: 'uploadLayout',
                    palette: fabImage.palette,
                    args: [{
                        uid: fabImage.uid,                      
                        name: fabImage.name,
                        image:args.image,
                        src:args.src,
                        palette: args.palette
                    }]
                });
            }
        },
        /**
         * Adding image to canvas when user selects an image from local storage
         * @method addImageToCanvas
         * @param args - image source and other properties
         */
        addImageToCanvas : function (args) {
            /* args.image - HTML Element */
            var fabImage = new fabric.Image(args.image, {
                left: args.left,
                top: args.top,
                width: args.width,
                height: args.height,
                scaleX: args.scaleX,
                scaleY: args.scaleY
            });
            canvas.add(fabImage);
            fabImage.uid = args.uid;
            fabImage.name = args.name;
            fabImage.palette = args.palette;
            if(args.angle) fabImage.setAngle(args.angle);
            canvas.renderAll();
            fabImage.setCoords();
            if(args.self) {
                args.self = false;
                matisse.comm.sendDrawMsg({
                    action: 'importimage',
                    palette: fabImage.palette,
                    args: [{
                        uid: fabImage.uid,
                        left: fabImage.left,
                        top: fabImage.top,
                        width: fabImage.width,
                        height: fabImage.height,    
                        scaleX: fabImage.scaleX,
                        scaleY: fabImage.scaleY,
                        name: fabImage.name,
                        image:args.image,
                        src:args.src,
                        palette: args.palette
                    }]
                });
            }
        }   
    }; // end of 'return'    
    main.commOnDraw();
    return main;
});
