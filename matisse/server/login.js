var passport = require('passport');
var OpenIDConnectStrategy = require('passport-idaas-openidconnect').IDaaSOIDCStrategy; 
//var app = require('./app');
module.exports = {
	authenticate: function() {
		var UserModel = require(__dirname + '/../models/UserModel.js');
		var everyauth = require('everyauth');
		var conf = require('./conf');

		//-------------------- EveryAuth START---------------------------------//
		var usersById = {};
		var nextUserId = 0;

		var users = {};

      everyauth
          .facebook
          .appId(conf.fb.appId)
          .appSecret(conf.fb.appSecret)
          .findOrCreateUser( function (sess, accessToken, accessSecret, user) {
							var userDetails = users[user.id] || (users[user.id] = addUser('facebook', user));
							var data = {
									userID: 'facebook' +"- " + userDetails['facebook'].id
							};
							var newUser = new UserModel();
							newUser.store(data, function (err) {
									if (!err) console.log("saved new user to DB");
									else console.log("Could not Save user, possibly exist in DB");
							});
							return userDetails;
              
              return usersByFbId[fbUserMetadata.id] ||
                  (usersByFbId[fbUserMetadata.id] = addUser('facebook', fbUserMetadata));
          })
          .redirectPath('/');
      
      everyauth
          .twitter
          .consumerKey(conf.twit.appId)
          .consumerSecret(conf.twit.appSecret)
          .findOrCreateUser( function (sess, accessToken, accessSecret, user) {
							var userDetails = users[user.id] || (users[user.id] = addUser('twitter', user));
							var data = {
									userID: 'twitter' +"- " + userDetails['twitter'].id
							};
							var newUser = new UserModel();
							newUser.store(data, function (err) {
									if (!err) console.log("saved new user to DB");
									else console.log("Could not Save user, possibly exist in DB");
							});
							return userDetails;
              
          })
          .redirectPath('/');

      everyauth.facebook.sendResponse( function (res, data) {
        var session = data.session;
        res.redirect(session.redirectPath || // Re-direct to the path stored in the session by route middleware
          this.redirectPath());              // Or redirect to the configured redirectPath
      });

      everyauth.twitter.sendResponse( function (res, data) {
        var session = data.session;
        res.redirect(session.redirectPath || // Re-direct to the path stored in the session by route middleware
          this.redirectPath());              // Or redirect to the configured redirectPath
      });

      /*everyauth.google.sendResponse( function (res, data) {
        var session = data.session;
        res.redirect(session.redirectPath || // Re-direct to the path stored in the session by route middleware
          this.redirectPath());              // Or redirect to the configured redirectPath
      });*/

		function addUser(source, sourceUser) {
			var user;
			if (arguments.length === 1) { // password-based
				user = sourceUser = source;
				user.id = ++nextUserId;
				return usersById[nextUserId] = user;
			} else { // non-password-based
				user = usersById[++nextUserId] = {
					id: nextUserId
				};
				user[source] = sourceUser;
			}
			return user;
		}
		everyauth.debug = true;		

//======================= PASSPORT STARTS HERE================================

		passport.serializeUser(function(user, done) {
		   done(null, user);
		}); 

		passport.deserializeUser(function(obj, done) {
		   done(null, obj);
		});         

		// VCAP_SERVICES contains all the credentials of services bound to
		// this application. For details of its content, please refer to
		// the document or sample of each service.  
		var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
		var ssoConfig = services.SingleSignOn[0]; 
		var client_id = ssoConfig.credentials.clientId;
		var client_secret = ssoConfig.credentials.secret;
		var authorization_url = ssoConfig.credentials.authorizationEndpointUrl;
		var token_url = ssoConfig.credentials.tokenEndpointUrl;
		var issuer_id = ssoConfig.credentials.issuerIdentifier;
		var callback_url = "http://thematisse.org:8000/auth/sso/callback";//(process.env.VCAP_APP_HOST || 'thematisse.org').concat('/auth/sso/callback');//'https://wbsso-yyq9oxtgi6-cwg2.iam.ibmcloud.com/idaas/mtfim/sps/idaas/login/google/callback';        

		var OpenIDConnectStrategy = require('passport-idaas-openidconnect').IDaaSOIDCStrategy;
		var Strategy = new OpenIDConnectStrategy({
		                 authorizationURL : authorization_url,
		                 tokenURL : token_url,
		                 clientID : client_id,
		                 scope: 'openid',
		                 response_type: 'code',
		                 clientSecret : client_secret,
		                 callbackURL : callback_url,
		                 skipUserProfile: true,
		                 issuer: issuer_id}, 
			function(accessToken, refreshToken, profile, done) {
			         	process.nextTick(function() {
							profile.accessToken = accessToken;
							profile.refreshToken = refreshToken;
							done(null, profile);
			         	})
		}); 

		passport.use(Strategy); 
		          
		function ensureAuthenticated(req, res, next) {
			if(!req.isAuthenticated()) {
				req.session.originalUrl = req.originalUrl;
				console.log(req.originalUrl);
				res.redirect('/login');
			} else {
				return next();
			}
		}
	},

	googleUser: function(req, res, next){
       		var user = req.user;
       		var userName = req.user.username;
       		console.log("google user ");
       		console.log(user);
       		console.log(userName);
            //user.refreshToken = accessSecret.refresh_token;
            //user.expiresIn = accessSecret.expires_in;
			var userDetails = users[userName] || (users[userName] = addUser('google', user));
			var data = {
					userID: 'google' +"- " + userDetails['google'].userName
			};
					var newUser = new UserModel();
			newUser.store(data, function (err) {
					if (!err) console.log("saved new user to DB");
					else console.log("Could not Save user, possibly exist in DB");
			});
			return userDetails;              
	}
}
//-------------------- EveryAuth END---------------------------------//
