// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
	
	console.log("device is now ready");
    ImgCache.options.debug = true;
	ImgCache.options.usePersistentCache = true;
	ImgCache.init(function(){
		ImgCache.clearCache();
		console.log('ImgCache: init worked!');
		$rootScope.$broadcast('ImgCacheReady');
	}, function(){
		alert('ImgCache: init failed!');
	});
	
  });
})

.config(function($stateProvider, $urlRouterProvider, $compileProvider) {
	$compileProvider.imgSrcSanitizationWhitelist('filesystem'); 
	$compileProvider.imgSrcSanitizationWhitelist('file'); 
	$compileProvider.imgSrcSanitizationWhitelist('file:'); 
	$compileProvider.imgSrcSanitizationWhitelist('file:/'); 
	$compileProvider.imgSrcSanitizationWhitelist('file://'); 
	$compileProvider.imgSrcSanitizationWhitelist('file:///'); 
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })
	
	.state('app.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "templates/home.html",
          controller: 'HomeCtrl'
        }
      }
    })

    .state('app.search', {
      url: "/search",
      views: {
        'menuContent' :{
          templateUrl: "templates/search.html"
        }
      }
    })

    .state('app.imgCapt', {
      url: "/img-capture",
      views: {
        'menuContent' :{
          templateUrl: "templates/image-capture.html",
          controller: 'ImgCaptCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
})
; 
 
