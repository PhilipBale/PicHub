// PicHub App

angular.module('pichub', ['ionic', 'pichub.controllers', 'pichub.services']).run(function($ionicPlatform, $rootScope) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}

		console.log("device is now ready");
		ImgCache.options.debug = true;
		ImgCache.options.usePersistentCache = true;
		ImgCache.init(function() {
			ImgCache.clearCache();
			console.log('ImgCache: init worked!');
			$rootScope.$broadcast('ImgCacheReady');
		}, function() {
			alert('ImgCache: init failed!');
		});

	});
}).config(function($stateProvider, $urlRouterProvider, $compileProvider) {
	$compileProvider.imgSrcSanitizationWhitelist('filesystem');
	$compileProvider.imgSrcSanitizationWhitelist('file');
	/*
	 $compileProvider.imgSrcSanitizationWhitelist('file:');
	 $compileProvider.imgSrcSanitizationWhitelist('file:/');
	 $compileProvider.imgSrcSanitizationWhitelist('file://');
	 $compileProvider.imgSrcSanitizationWhitelist('file:///');  */
	$stateProvider.state('app', {
		url : "/app",
		abstract : true,
		templateUrl : "views/menu.html",
		controller : 'AppCtrl'
	}).state('app.home', {
		url : "/home",
		views : {
			'menuContent' : {
				templateUrl : "views/home.html",
				controller : 'HomeCtrl'
			}
		}
	}).state('app.search', {
		url : "/search",
		views : {
			'menuContent' : {
				templateUrl : "views/search.html"
			}
		}
	}).state('app.imgCapt', {
		url : "/img-capture",
		views : {
			'menuContent' : {
				templateUrl : "views/image-capture.html",
				controller : 'ImgCaptCtrl'
			}
		}
	});
	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/app/home');
});
