/**
 * User: Bhavani Shankar
 * Date: 01/19/12
 * Time: 11:16 AM
 * About this : Event listener methods are declared here
 *
 */

define(["matisse", "matisse.ui", "matisse.comm", "matisse.action-bar", "matisse.util"], function (matisse, ui, comm, actionBar, util) {
	"use strict";
	return {
		/**
		 * Listen for keyboard events and do necessary action
		 * @method keyDown 
		 * @param e keyevent
		 */
		keyDown: function (e) {
      var evt = (e) ? e : (window.event) ? window.event : null;
      if (evt && ($("#propdiv:visible").length === 0)) {
        var key = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode : ((evt.which) ? evt.which : 0));
        if (key == "46") { //  DELETE
          actionBar.stateUpdated(null, "deleted");
          util.hideQuickMenuDiv();
          util.hideQuickMenuGroupDiv();
        } else if (key == "38" && evt.ctrlKey) { // CONTROL + Up Arrow
            var obj = canvas.getActiveObject();
            if (obj) {
              canvas.bringForward(obj);
              notifyZindexChange(obj, 'forward');
            }
        } else if (key == "40" && evt.ctrlKey) { // CONTROL + Down Arrow
            var obj = canvas.getActiveObject();
            if (obj) {
                canvas.sendBackwards(obj);
                notifyZindexChange(obj, 'backward');
            }
        } else if (key == "90" && evt.ctrlKey) {
            actionBar.handleUndoRedoAction("undo");
        } else if (key == "89" && evt.ctrlKey) {
            actionBar.handleUndoRedoAction("redo");
        } else if (key == "27") { // when Escape key pressed
        	 evt.preventDefault();
            closePopup();
        } else if (key == "37" && evt.shiftKey) {
            var obj = canvas.getActiveObject();
            if(obj) {
            	var objleft = obj.left;
            	obj.set('left', objleft - (matisse.horIndent * matisse.indentMultiplier));
            	onObjectMoveByKey(obj);
            }
        } else if (key == "37") {
            var obj = canvas.getActiveObject();
            if(obj) {
            	var objleft = obj.left;
            	obj.set('left', objleft - matisse.horIndent);
            	onObjectMoveByKey(obj)
            }
        } else if (key == "39" && evt.shiftKey) {
            var obj = canvas.getActiveObject();
            var objleft = obj.left;
            if(obj) {
            	obj.set('left', objleft + (matisse.horIndent * matisse.indentMultiplier));
            	onObjectMoveByKey(obj);
            }
        } else if (key == "39") {
            var obj = canvas.getActiveObject();
            if(obj) {
            	var objleft = obj.left;
            	obj.set('left', objleft + matisse.horIndent);
            	onObjectMoveByKey(obj)
            }
        } else if (key == "38" && evt.shiftKey) {
            var obj = canvas.getActiveObject();
            if(obj) {
            	var objtop = obj.top;
            	obj.set('top', objtop - matisse.verIndent * matisse.indentMultiplier);
            	onObjectMoveByKey(obj)
            }
        } else if (key == "38") {
            var obj = canvas.getActiveObject();
            if(obj) {
            	var objtop = obj.top;
            	obj.set('top', objtop - matisse.verIndent);
            	onObjectMoveByKey(obj)
            }
        } else if (key == "40" && evt.shiftKey) {
            var obj = canvas.getActiveObject();
            if(obj) {
            	var objtop = obj.top;
            	obj.set('top', objtop + matisse.verIndent * matisse.indentMultiplier);
            	onObjectMoveByKey(obj)
            }
        } else if (key == "40") {
            var obj = canvas.getActiveObject();
            if(obj) {
            	var objtop = obj.top;
            	obj.set('top', objtop + matisse.verIndent);
            	onObjectMoveByKey(obj)
            }
        }
      }
    },

    /**
     * Listen for mouse down(on canvas after shape tool is selected) event and do necessary action
     * @method mouseDown
     * @param e mouseevent
     */
    mouseDown: function (event) {
       if (document.getElementById('delete_menuItem') && event.button == 0) { //if it is left click, remove the context menu item, if any
        $('#delete_menuItem').remove();
      }
      if (!canvas.isDrawingMode && matisse.drawShape) {
    	matisse.points.x = event.pageX + document.getElementById("canvasId").scrollLeft + document.getElementById("containerDiv").scrollLeft - matisse.xOffset; //offset
        matisse.points.y = event.pageY + document.getElementById("canvasId").scrollTop + document.getElementById("containerDiv").scrollTop - matisse.yOffset; //offset
        if(matisse.groupCopyMode) {
        	var selected_group_obj_array = canvas.getActiveGroup().getObjects();
        	var createdObjArray = [];
        	$.each(selected_group_obj_array,function(index,value) {
        		matisse.action = value.name;
        		matisse.paletteName = value.palette;   
        		var obj = util.getPropertiesFromObject(matisse.palette[matisse.paletteName].shapes[matisse.action].properties,value);
        		obj.uid = util.uniqid();
        		matisse.shapeArgs = [obj];
        		matisse.shapeArgs[0].left = matisse.points.x + obj.left;
                matisse.shapeArgs[0].top = matisse.points.y + obj.top;
                createdObjArray.push({
                    palette: matisse.paletteName,
                    action: matisse.action,
                    args: matisse.shapeArgs
                });
        		drawObject(event);
        	});
        	matisse.groupCopyMode = false;
        	$('span.copy_icon','div.m-quick-edit-group').removeClass('selected');
        	actionBar.stateUpdated(createdObjArray, "created");
        }
        else {
        	matisse.shapeArgs[0].left = matisse.points.x;
            matisse.shapeArgs[0].top = matisse.points.y;
        	drawObject(event);
        	$('span.copy_icon','div.m-quick-edit').removeClass('selected');
        	canvas.setActiveObject(canvas.item(canvas.getObjects().length-1));
            actionBar.stateUpdated(null, "created");
        }
	    canvas.isSelectMode = true;
	    matisse.drawShape = false;
	    ui.resetShapeSelection();
      }
      if (canvas.isDrawingMode) {
          matisse.xPoints = [];
          matisse.yPoints = [];
          matisse.xPoints.push(event.pageX + document.getElementById("canvasId").scrollLeft + document.getElementById("containerDiv").scrollLeft - matisse.xOffset);
          matisse.yPoints.push(event.pageY + document.getElementById("canvasId").scrollTop + document.getElementById("containerDiv").scrollTop - matisse.yOffset);
      }
     },

     // Listen for right click of mouse and display context menu when any object on canvas is selected.
		contextMenu: function (event) {
			var obj = canvas.getActiveObject();
			if (obj &&
			(event.clientX -$('#canvasId').css('left').split('px')[0] - $('#leftdiv').css('width').split('px')[0]) >= (obj.left - obj.width/2) &&
			(event.clientX - $('#canvasId').css('left').split('px')[0] - $('#leftdiv').css('width').split('px')[0]) <= (obj.left + obj.width/2) &&
			(event.clientY - $('#canvasId').css('top').split('px')[0] - $('#header').css('height').split('px')[0]) >= (obj.top - obj.height/2) &&
			(event.clientY - $('#canvasId').css('top').split('px')[0] - $('#header').css('height').split('px')[0]) <= (obj.top + obj.height/2)) {
				//prevent the display of default context menu.
				event.preventDefault();
				if (document.getElementById('delete_menuItem')) {
					$('#delete_menuItem').remove();
				}
				var a = document.createElement('div');
				a.id = "delete_menuItem";				
				a.innerHTML = "Delete";
				$('#_body').append(a);
				a.style.left = event.clientX + "px";
				a.style.top = event.clientY + "px";
				// when clicked on delete context menu item, delete the selected object from canvas.
				$('#delete_menuItem').click(function(evt) {
					matisse.main.deleteObjects();
					$('#delete_menuItem').css('display','none');
				});
				$('#delete_menuItem').mouseenter(function(evt) {					
					$('#delete_menuItem').css('background-color','#ddd');
				});
				$('#delete_menuItem').mouseleave(function(evt) {					
					$('#delete_menuItem').css('background-color','#eee');
				});
			} else { // if right click happens outside of the selected object, remove the context menu item
				if (document.getElementById('delete_menuItem')) {
					$('#delete_menuItem').remove();
				}
			}
		},
    /**
     * Listen for mouse move event and do necessary action
     * @method mouseMove
     * @param e mouseevent
     */
    mouseMove: function (event) {
      matisse.eventObj = event;
      if (canvas.isDrawingMode) {
          matisse.xPoints.push(event.pageX + document.getElementById("canvasId").scrollLeft + document.getElementById("containerDiv").scrollLeft - matisse.xOffset);
          matisse.yPoints.push(event.pageY + document.getElementById("canvasId").scrollTop + document.getElementById("containerDiv").scrollTop - matisse.yOffset);
      }
    },

    /**
     *  Notify Server about Group Moved
     *  @method  notifyServerGroupMoved
     *  @param none
     */
    notifyServerGroupMoved: function () {
      var activeGroup = canvas.getActiveGroup();
      var objectsInGroup = activeGroup.getObjects();
      canvas.discardActiveGroup();
      util.hideQuickMenuGroupDiv();
      actionBar.stateUpdated(objectsInGroup, "modified");
      objectsInGroup.forEach(function (obj) {
          notifyObjModify(obj);
      });
    }
    };
    return eve;

	function drawObject(event) {
		matisse.shapeArgs[0].name = matisse.action;
	    matisse.shapeArgs[0].palette = matisse.paletteName;
	    matisse.palette[matisse.paletteName].shapes[matisse.action].toolAction.apply(this, matisse.shapeArgs);
	    matisse.comm.sendDrawMsg({
	        palette: matisse.paletteName,
	        action: matisse.action,
	        args: matisse.shapeArgs
	    });
	}
    
    function closePopup() {
      var popEl = document.getElementById('popUpDiv');
      var blanketEl = document.getElementById('blanket');
      if (popEl.style.display != 'none') popEl.style.display = 'none';
      if (blanketEl.style.display != 'none') blanketEl.style.display = 'none'
      $(popEl).removeClass('scale-container');
      $('div.m-submenu-list').hide();
    }

    function onObjectMoveByKey(obj) {
      canvas.renderAll();
      obj.setCoords();
      canvas.fire('object:moving', {
          target: obj
      });
      util.quickMenuHandler(obj);
      notifyObjModify(obj);
    }
    function notifyObjModify(obj) {
      matisse.comm.sendDrawMsg({
        action: "modified",
        //name: obj.name,
        palette: obj.palette,
        args: [{
          uid: obj.uid,
          object: obj
        }] // When sent only 'object' for some reason object  'uid' is not available to the receiver method.

      });
    }
    function notifyZindexChange(obj, changType) {
      matisse.comm.sendDrawMsg({
        action: "zindexchange",
        name: obj.name,
        palette: obj.palette,
        args: [{
          uid: obj.uid,
          object: obj,
          change : changType,
        }] // When sent only 'object' for some reason object  'uid' is not available to the receiver method.
      });
    }
});
