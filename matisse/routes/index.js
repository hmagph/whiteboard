var BoardModel = require(__dirname + '/../models/BoardModel.js');
var ShapesModel = require(__dirname + '/../models/ShapesModel.js');
var UserModel = require(__dirname + '/../models/UserModel.js');
var events = require('events');
var login = require(__dirname + '/../server/login.js');

var renderLogin = function(res) {
    res.render('index', { title:'Matisse'});
}

var renderDashboard = function(res, ownedBoards, sharedBoards) {
    var defaults = {
        title:'Matisse' , 
        createdNum: 0, 
        sharedNum: 0, 
        ownedBoards:  [], 
        sharedBoards: [],
        passport: undefined
    }, actualValues = {};

    actualValues['title'] = defaults.title;
    actualValues['ownedBoards'] = (ownedBoards)? ownedBoards: defaults.ownedBoards;
    actualValues['sharedBoards'] = (sharedBoards)? sharedBoards: defaults.sharedBoards;
    actualValues['createdNum'] = actualValues['ownedBoards'].length;
    actualValues['sharedNum'] = actualValues['sharedBoards'].length;
    actualValues['passport'] = login.isLoggedIn(res.req.session) || defaults.passport;
    console.error("DEBUG renderDashboard actualValues:", actualValues);
    res.render('index', actualValues);
};


var MatisseServer = new function() {
    var collectBoards = function(req, res, boardIds, callback) {
        var boards = [], i = 0, props, board = new BoardModel(), boardCount = boardIds.length;
        
        boardIds.forEach(function (id) {
            var board = new BoardModel();
            board.load(id, function (err, props) {
                if (err) {
                    renderDashboard(res);
                } else {
                    boards.push ({
                        id:this.id,
  					    url: props.url,
					    name: props.name,
   					    container: props.container,
	   				    canvasWidth: props.canvasWidth,
		   			    canvasHeight: props.canvasHeight
                    });
                    if (++i === boardCount) {
                        callback(boards);
                    }
                }
            });
        });
        if (boardIds.length === 0) {
            callback(boards);
        }
    }

	var server = Object.create(new events.EventEmitter);

    server.on('valid session', function(req, res, session_data) {
        console.log("valid session req");
        console.log(req);
        console.log("valid session data");
        console.log(session_data);
        var userObj = new UserModel();
        var userID = userObj.getUserID(session_data);
        console.error("DEBUG: userID", userID, session_data);
        if (typeof(userID) != "undefined" && userID != null) {
            server.emit('valid user', req, res, userID);
        } else {
            renderLogin(res);
        }
    });

    server.on('valid user', function(req, res, userID) {
        var loggedInUser = new UserModel();

        loggedInUser.find({userID:userID}, function(err,ids) {
            if (err) {
                console.error("DEBUG error on finding user", err);
                renderLogin(res);
            } else {
                console.error("DEBUG found users", ids);
                loggedInUser.load(ids[0], function (err, props) {
                    if (err) {
                        console.error("DEBUG error on loading user", err);
                        console.error("DEBUG error ids contents: ", ids[0]);
                        renderLogin(res);
                    } else {
                        // get the boards linked with this user
                        loggedInUser.getAll('Board', 'ownedBoard', function (err, boardIds) {
                            if (err) {
                                console.error("DEBUG error on getting boards", err);
                                renderDashboard(res);
                            } else {
                                server.emit('valid owned boards', req, res, loggedInUser, boardIds);
                            }
                        });
                    }
                });
            }
        });
    });

    server.on('valid owned boards' , function(req, res, loggedInUser, boardIds) {
        collectBoards(req, res, boardIds, function(boards) {
            loggedInUser.getAll('Board', 'sharedBoard', function (err, sharedBoardIds) {
                if (err) {
                    console.error("DEBUG error on shared boards", err);
                    renderDashboard(res);
                } else {
                    server.emit('valid shared boards', req, res, loggedInUser, boards, sharedBoardIds);
                }
            });
        });
    });

    server.on('valid shared boards', function(req, res, loggedInUser, boards, sharedBoardIds) {
        collectBoards(req, res, sharedBoardIds, function(sharedBoards) {
            console.error("DEBUG render the dashboard");
            renderDashboard(res, boards, sharedBoards);
        });
    });

    server.on('invalid login' , function(res) {
        renderLogin(res);
    });

    server.on('invalid dashboard' , function(res) {
        renderDashboard(res);
    });

    server.render = function(req, res) {        
        var session_data = login.isLoggedIn(req.session);
        if (session_data) {
            server.emit('valid session', req, res, session_data);
            if (req.session)
                console.error("DEBUG: SESSION - ", req.session);
        } else {
            console.error("DEBUG: INVALID LOGIN");
            if (req.session)
                console.error("DEBUG: SESSION - ", req.session);
            server.emit('invalid login', res);
        }
	};

	return server;
}


exports.index = function (req, res) {
    console.error("DEBUG index req", req.session.passport);
    Object.create(MatisseServer).render(req, res);
};

exports.favicon = function (req, res, next) {

}

/*
 * The function for boards
 */

exports.boards = {
    index:function (req, res, next) {
        console.error("DEBUG boards.index");
	    var chars = "0123456789abcdefghiklmnopqrstuvwxyz";
        var string_length = 8;
        randomstring = '';
		var session_data = login.isLoggedIn(req.session);
		var userObj = new UserModel();
		var userID = userObj.getUserID(session_data);
		var userName = userObj.getUserFromSession(session_data).name;
		
        for (var i = 0; i < string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum, rnum + 1);
        }
        var data = {
            url:randomstring,
	        container: req.body.container,
	        canvasWidth: req.body.canvasWidth,
	        canvasHeight: req.body.canvasHeight,
	        name: req.body.whiteboardName,
	        createdBy: userName
        };
        var whiteBoard = new BoardModel();
        whiteBoard.store(data, function (err) {
            console.error("DEBUG whiteboard create error:", err);
            if (err === 'invalid') {
                console.error("DEBUG whiteboard create error:", whiteBoard.errors);
		        next(whiteBoard.errors);
	        } else if (err) {
		        next(err);
	        } else {
		        userObj.linkBoard(whiteBoard, userID, false);
		        res.writeHead(302, {
		            'Location':randomstring
		        });
                console.error("DEBUG whiteboard create:", res);
		        res.end();

	        }
	    });
    },
	
	remove:function (req, res, next) {
		var boardUrl = req.body.boardUrl;
		var session_data = login.isLoggedIn(req.session);
		var userObj = new UserModel();
		var userID = userObj.getUserID(session_data);
		// remove shapes from the board
		ShapesModel.find({board_url: "boards/" + boardUrl}, function (err, ids) {
			if (err) {
				console.log(err);
			}
			var len = ids.length;
			if (len === 0) {} else {
				ids.forEach(function (id) {
					var shape = new ShapesModel();
					var data = {};
					shape.load(id, function (err, props) {
						if (err) {
							console.log(err);
						}
						shape.delete(data, function (err) {
							console.log("***** Error while deleting ID:" + id + " errr:" + err);
						});
					});
				});
			}
		});
		
		// remove board 
		BoardModel.find({url:boardUrl},function (err, ids) {
			if (err) {
				console.log(err);
			} else {
				ids.forEach(function (id) {
					var board = new BoardModel();
					var data = {};
					board.load(id, function (err, props) {
						if (err) {
							return next(err);
						} else {
							userObj.linkBoard(board, userID, true, function () {
                                board.remove();
								console.log("######### Deleting : ######"+board);
 						    });
						}
					});
				});
			}
		}); 
		res.writeHead(200, {'Content-Type': 'text/plain' });
		res.end("deleted");
	},
    update: function(req, res, next) {
        var whiteBoard = new BoardModel();
        whiteBoard.load(req.body.id, function (err, props) {
            if (err) {
                console.log(err);
                res.contentType('json');
                res.send({
                    error: true
                });
            } else {
                props.name = req.body.name;
                whiteBoard.store(props, function (err) {
                    if (err === 'invalid') {
                        res.contentType('json');
                        res.send({
                            error: true
                        });
                    } else if (err) {
                        res.contentType('json');
                        res.send({
                            error: true
                        });
                    } else {
                        res.contentType('json');
                        res.send({
                            success: true
                        });
                    }
                });
            }
        });
    }
}

/*
 * For exposing things as aan API
 */
exports.api = {
    index:function (req, res, next) {
        ShapesModel.find(function (err, ids) {
            if (err) {
                return next(err);
            }
            var shapes = [];
            var len = ids.length;
            var count = 0;
            if (len === 0) {
                return res.json(shapes);
            }
            ids.forEach(function (id) {
                var shape = new ShapesModel();
                shape.load(id, function (err, props) {
                    if (err) {
                        return next(err);
                    }
                    shapes.push({
                        id:this.id,
                        palette:props.palette,
                        action:props.action,
                        args:props.args,
                        board_url:props.board_url
                    });
                    if (++count === len) {
                        res.json(shapes);
                    }
                });
            });
        });
    }
};

exports.userinfo = function (req, res) {
    var status = login.isLoggedIn(req.session) ? 200 : 403;
    var userinfo = "{}";
    if (req.session.auth) {
        userinfo = JSON.stringify(new UserModel().getUserFromSession(req.session.auth));
    } else if (req.session.passport.user) {
        userinfo = JSON.stringify(new UserModel().getUserFromSession(req.session.passport));
    }
    
    res.writeHead(status, {"Content-Type": "application/json"});
    res.write(userinfo);
    res.end();
};
