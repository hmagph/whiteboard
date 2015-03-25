/* fabric related methods */

define(["matisse", "matisse.util", "matisse.palettes.properties", "matisse.ui", "matisse.events", "matisse.action-bar"], function (matisse, util, properties, ui, events, actionBar) {
    
    'use strict';

    return {
        initialize:function() {
            observe('object:modified');
            observe('path:created');
            observe('selection:cleared');
            observe('object:selected');
            observe('object:moving');
            observe('object:scaling');
            observe('object:resizing');
            observe('selection:created');
            //bar shift click #171 
            stopShiftClick();
            //bar negative resize #158
            stopNegativeDimension();
        }
    };

    function stopShiftClick() {
        var original = canvas.__onMouseDown;
        canvas.__onMouseDown = function(e) {
            if (e.shiftKey) {
                $('div.shift-click-alert').slideDown(400).delay(2000).fadeOut(1000);
                return true;
            } else {
                original.call(this, e);
            }
        }
    }

    function stopNegativeDimension() {
        var original = canvas._resizeObject;
        canvas._resizeObject = function(x, y, direction) {
            var target = canvas._currentTransform.target, memo = {}, memoFields = ['top', 'left', 'width', 'height'];
            memoFields.forEach(function(memoField) { memo[memoField] = target[memoField]; });
            original.call(this, x, y, direction);
            //restore if the move spoilt the width or height
            if (target.width < 1 ||  target.height < 1) {
                memoFields.forEach(function(memoField) { target[memoField] = memo[memoField]; });
            }
        }
    }


    /**
     *  Check for the event fired by fabric when any of the canvas objects modified and apply update properites panel accordingly
     *  @method  observe
     *  @param eventName - name of the event fired by fabricjs
     */
    function observe(eventName) {
        canvas.observe(eventName, function (e) {
            switch (eventName) {
            case "object:modified":
                // Check if it is a group of objects and dont perform any action
                if (canvas.getActiveGroup()) {  //TODO
                    events.notifyServerGroupMoved();
                    return;
                } 
                var obj = e.memo.target; // Get currently modified object
                matisse.comm.sendDrawMsg({ // Notify about this to server
                    action: "modified",
                    name: obj.name,
                    palette: obj.palette,
                    path: obj.path,
                    args: [{
                        uid: obj.uid,
                        object: obj
                    }] // When sent only 'object' for some reason object  'uid' is not available to the receiver method.
                });
                //store original state information or undo/redo actions
                actionBar.stateUpdated(obj, "modified");
                matisse.hLine.set('top', -10); // hide horizontal alignment guide line
                matisse.vLine.set('left', -10); // hide vertical alignment guide line
                properties.updatePropertyPanel(obj); // Update property values for this object in property panel
                util.quickMenuHandler(obj);
                break;
            case "selection:created": 
                util.quickMenuGroupHandler(canvas.getActiveGroup());
                break;
            case "selection:cleared":
                $('#propdiv').dialog("close");
                if(!matisse.isUpdatingProperties)
                    util.hideQuickMenuDiv();
                util.hideQuickMenuGroupDiv();
                break;
            case 'path:created': // When path creation is completed by user
                canvas.isSelectMode = true;
                canvas.isDrawingMode = false; // Set drawing mode to false
                ui.resetIconSelection(); // Reset drawing icon selection
                matisse.drawShape = false;
                document.getElementById("c").style.cursor = 'default';
                var pathObj = e.memo.path; // get path object and assign parameters
                pathObj.uid = util.uniqid(); // Assign a Unique ID for this object
                pathObj.name = "drawingpath";
                pathObj.palette = matisse.paletteName;
                matisse.comm.sendDrawMsg({ // Notify server about this drawing path to draw it on other users canvas
                    action: 'drawpath',
                    palette: matisse.paletteName,
                    args: [{
                        uid: pathObj.uid,
                        left: pathObj.left,
                        top: pathObj.top,
                        width: pathObj.width,
                        height: pathObj.height,
                        path: pathObj.path,
                        name: pathObj.name,
                        palette: matisse.paletteName,
                        stroke: pathObj.stroke
                    }]
                });
                matisse.xPoints = []; // nullify x points array
                matisse.yPoints = []; // nullify x points array
                break;
            case 'object:selected':
                if(matisse.isUpdatingProperties) return;
                var selectedObj = e.memo.target; // Get selected object reference
                // Check if it is a group of objects and dont perform any action
                if (canvas.getActiveGroup()) { // TODO
                    return;
                }
                // Show property panel for this selected object
                properties.createPropertiesPanel(selectedObj);
                util.quickMenuHandler(selectedObj);
                break;
            case 'object:moving':
                // Get moving object reference
                var movingObj = e.memo.target;
                // Check for Alignment of this object with all other objects on canvas
                checkAlign(movingObj);
                util.hideQuickMenuDiv();
                util.hideQuickMenuGroupDiv();
                break;
            case 'object:resizing':
                // Get resizing object reference
                var resizingObj = e.memo.target;
                var props = [];                 
                props.push(resizingObj);
                if (matisse.palette[resizingObj.palette]) {
                    matisse.palette[resizingObj.palette].shapes[resizingObj.name].resizeAction ? matisse.palette[resizingObj.palette].shapes[resizingObj.name].resizeAction.apply(null, props) : null;
                }
                break;
            case 'object:scaling':                   
                var scalingObj = e.memo.target,
                cursorStyle = canvas.upperCanvasEl.style.cursor,                
                curLeft = scalingObj.originalState.left,    //left of the object before scaling
                curTop = scalingObj.originalState.top,  //top of the object before scaling
                scalingWidth = scalingObj.width,    //object width
                curWidth = scalingObj.currentWidth, //object width after scaling
                scalingHeight = scalingObj.height,  //object height
                curHeight = scalingObj.currentHeight,   //object height after scaling
                scaleWidth = 0,
                scaleHeight = 0;                        
                if (cursorStyle == 'e-resize') {    //when an object is scaled in east direction            
                    scaleWidth = scalingWidth * scalingObj.scaleX;  //object width while scaling
                    scalingObj.left = curLeft + (scaleWidth - curWidth)/2;  //object left after scaling (move towards right)                        
                } else if (cursorStyle == 'w-resize') { //when an object is scaled in west direction
                    scaleWidth = scalingWidth * scalingObj.scaleX;  //object width while scaling
                    scalingObj.left = curLeft - (scaleWidth - curWidth)/2;  //object left after scaling (move towards left)
                } else if (cursorStyle == 'n-resize') { //when an object is scaled in north direction
                    scaleHeight = scalingHeight * scalingObj.scaleY;    //object height while scaling
                    scalingObj.top = curTop - (scaleHeight - curHeight)/2;  //object top after scaling (move towards north)
                } else if (cursorStyle == 's-resize') { //when an object is scaled in south direction
                    scaleHeight = scalingHeight * scalingObj.scaleY;    //object height while scaling
                    scalingObj.top = curTop + (scaleHeight - curHeight)/2;  //object top after scaling (move towards south)
                } else if (cursorStyle == 'ne-resize') {    //when an object is scaled in north east direction, move the left and top in east and north directions
                    scaleHeight = scalingHeight * scalingObj.scaleY;
                    scalingObj.top = curTop - (scaleHeight - curHeight)/2;
                    scaleWidth = scalingWidth * scalingObj.scaleX;
                    scalingObj.left = curLeft + (scaleWidth - curWidth)/2;
                } else if (cursorStyle == 'nw-resize') {    //when an object is scaled in north west direction, move the left and top in west and north directions
                    scaleHeight = scalingHeight * scalingObj.scaleY;
                    scalingObj.top = curTop - (scaleHeight - curHeight)/2;
                    scaleWidth = scalingWidth * scalingObj.scaleX;
                    scalingObj.left = curLeft - (scaleWidth - curWidth)/2;
                } else if (cursorStyle == 'se-resize') {    //when an object is scaled in south east direction, move the left and top in east and south directions
                    scaleHeight = scalingHeight * scalingObj.scaleY;
                    scalingObj.top = curTop + (scaleHeight - curHeight)/2;
                    scaleWidth = scalingWidth * scalingObj.scaleX;
                    scalingObj.left = curLeft + (scaleWidth - curWidth)/2;
                } else if (cursorStyle == 'sw-resize') {    //when an object is scaled in south west direction, move the left and top in west and south directions
                    scaleHeight = scalingHeight * scalingObj.scaleY;
                    scalingObj.top = curTop + (scaleHeight - curHeight)/2;
                    scaleWidth = scalingWidth * scalingObj.scaleX;
                    scalingObj.left = curLeft - (scaleWidth - curWidth)/2;
                }   
                break;      
            }
        });
    }

    /* Get all objects from canvas and check if borders of any of them matches with active object borders
     */
    function checkAlign(obj) {
        var hLine = matisse.hLine,
        vLine = matisse.vLine;
        hLine.set('top', -10);
        vLine.set('left', -10);
        var movingObjLeft = Math.round(obj.left - (obj.width * obj.scaleX) / 2),
        movingObjTop = Math.round(obj.top - (obj.height * obj.scaleY) / 2),
        movingObjRight = Math.round(obj.left + (obj.width * obj.scaleX) / 2),
        movingObjBottom = Math.round(obj.top + (obj.height * obj.scaleY) / 2),
        canvasObjects = canvas.getObjects(),
        i = 0;
        for (i; i < canvasObjects.length; i++) {
            var otherObjLeft = Math.round(canvasObjects[i].left - (canvasObjects[i].width * canvasObjects[i].scaleX) / 2),
            otherObjTop = Math.round(canvasObjects[i].top - (canvasObjects[i].height * canvasObjects[i].scaleY) / 2),
            otherObjRight = Math.round(canvasObjects[i].left + (canvasObjects[i].width * canvasObjects[i].scaleX) / 2),
            otherObjBottom = Math.round(canvasObjects[i].top + (canvasObjects[i].height * canvasObjects[i].scaleY) / 2);
            if (canvasObjects[i] !== obj && canvasObjects[i].name !== 'vline' && canvasObjects[i].name !== 'hline') { /* this LEFT matches with Other LEFT */
                /* this RIGHT matches with Other LEFT */
                if (otherObjLeft - 1 === movingObjLeft || otherObjLeft + 1 === movingObjLeft) {
                    showAlginLine(obj, "left", "minus");
                } /* this RIGHT matches with Other RIGHT */
                if (otherObjRight - 1 === movingObjRight || otherObjRight + 1 === movingObjRight) {
                    showAlginLine(obj, "left", "plus");
                } /* this TOP matches with Other TOP */
                if (otherObjTop - 1 === movingObjTop || otherObjTop + 1 === movingObjTop) {
                    showAlginLine(obj, "top", "minus");
                } /* this BOTTOM matches with Other BOTTOM */
                if (otherObjBottom - 1 === movingObjBottom || otherObjBottom + 1 === movingObjBottom) {
                    showAlginLine(obj, "top", "plus");
                } /* this LEFT matches with Other RIGHT */
                if (otherObjRight - 1 === movingObjLeft || otherObjRight + 1 === movingObjLeft) {
                    showAlginLine(obj, "left", "minus");
                } /* this RIGHT matches with Other LEFT */
                if (otherObjLeft - 1 === movingObjRight || otherObjLeft + 1 === movingObjRight) {
                    showAlginLine(obj, "left", "plus");
                } /* this TOP matches with Other BOTTOM */
                if (otherObjBottom - 1 === movingObjTop || otherObjBottom + 1 === movingObjTop) {
                    showAlginLine(obj, "top", "minus");
                } /* this BOTTOM matches with Other TOP */
                if (otherObjTop - 1 === movingObjBottom || otherObjTop + 1 === movingObjBottom) {
                    showAlginLine(obj, "top", "plus");
                }
            }
        }
        return null;
    }
    
    /**
     *  Show Align guild line when objects align   
     *  @method  showAlginLine
     *  @param obj, position, operator
     */
    function showAlginLine(obj, position, operator) {
        var vLine = matisse.vLine;
        var hLine = matisse.hLine;
        // 'LEFT' + 'plus' means left of object is aligned with left of other object  
        // 'LEFT' + 'minus' means left of object is aligned with right of other object  
        switch (position) {
        case "left":
            (operator === "plus") ? vLine.set('left', obj.left + (obj.width * obj.scaleX) / 2) : vLine.set('left', obj.left - (obj.width * obj.scaleX) / 2);
            break;
        case "top":
            (operator === "plus") ? hLine.set('top', obj.top + (obj.height * obj.scaleY) / 2) : hLine.set('top', obj.top - (obj.height * obj.scaleY) / 2);
            break;
        }
        // show align line on top of all other objects on canvas
        canvas.bringForward(vLine);
        canvas.bringForward(hLine);
        vLine.setCoords();
        hLine.setCoords();
        canvas.renderAll();
        setTimeout(function() {
            if (hLine.top !== -10 || vLine.left !== -10) {
                hLine.top = -10; vLine.left = -10; canvas.renderAll();
            }
        }, 200);
    }
});