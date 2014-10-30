angular.module('pichub.controllers', [])
    .controller('AppCtrl', function($scope, $ionicModal, $timeout) {
        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function() {
                $scope.modal.hide();
            },

            // Open the login modal
            $scope.login = function() {
                $scope.modal.show();

            };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function() {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function() {
                $scope.closeLogin();
            }, 1000);
        };
    })

.controller('HomeCtrl', function($scope, $ionicModal, $timeout, $http, $ionicNavBarDelegate, $document, User, PhotoUpload) {

        $scope.countdownTime = 0;
        $scope.onTimeout = function() {
            $scope.countdownTime--;
            if ($scope.countdownTime > 0) {
                mytimeout = $timeout($scope.onTimeout, 1000);
            } else {
                $scope.closeImageDisplay();
            }
        }
        var mytimeout = 0;

        $scope.updateItems = function() {
            $http.jsonp('http://www.lc11.net/getData.php?callback=JSON_CALLBACK').success(function(data) {
                $scope.items = data;
                formatTimeDifference();
            });
        }
        $scope.$on('ImgCacheReady', function() {
            console.log("Updating items list");
            $scope.updateItems();
        });

        function formatTimeDifference() {
            for (var i in $scope.items) {
                $scope.items[i].upload_date = prettyDate($scope.items[i].upload_date);
            }
        }

        // Triggered in the login modal to close it
        $scope.closeImageDisplay = function() {
            $timeout.cancel(mytimeout);
            $ionicNavBarDelegate.showBar(true);
            $("#pic-display").hide();
            //$("#main-content").show();
            $("#footer").show();
        };

        // Open the login modal
        $scope.showImageDisplay = function() {
            $ionicNavBarDelegate.showBar(false);
            $("#footer").hide();
            var pd = $("#pic-display");
            console.log(pd.length);
            $("#pic-display").show();
            //$scope.modal.show();
        };

        $scope.vote = function(id, yesVote) {
            $http.get('http://www.lc11.net/vote.php?direction=' + (yesVote ? 1 : 0) + '&id=' + id).finally(function() {
                for (var i in $scope.items) {
                    if ($scope.items[i].id == id) {
                        if (yesVote) {
                            $scope.items[i].yes_votes++;
                        } else {
                            $scope.items[i].no_votes++;
                        }
                    }
                }
            });
        };

        $scope.showImage = function(curImg, eventObj) {

            $scope.imgSrc = "";
            var properObj = eventObj.srcElement;
            console.log("Entering image show");

            // Super fucking hack           
            // Go up until we get the correct tag
            for (i = 0; i < 4; i++) {
                if (properObj.tagName != "ION-ITEM") {
                    properObj = properObj.parentElement;
                } else {
                    break;
                }
            }

            console.log("Img src: " + properObj.firstElementChild.src);

            $scope.imgSrc = properObj.firstElementChild.src;
            //var testImg = $('#ourImg');
            //ImgCache.useCachedFile(testImg, curImg.image_name);

            /*if (testImg.length == 0) {
                console.log("Null test img");
            } 
            // another section
            
        ImgCache.getImgPath(curImg.image_name, function(data) {
            var testImg = $('#ourImg');
            console.log(testImg);
            $scope.imgSrc = data;
            console.log($scope.imgSrc);
        });*/

            $scope.countdownTime = curImg.time_limit;
            $scope.showImageDisplay();
            mytimeout = $timeout($scope.onTimeout, 1000);
        };

        $scope.capturePhoto = function() {
        	PhotoUpload.takePhoto();
        }
        
    }).directive('imageonload', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('load', function() {
                    //alert("loaded: " + attrs.src);
                });
            }
        };
    })
    .directive('testcache', function() {
        return {
            restrict: 'A',
            transclude: true,
            link: function(scope, el, attrs, transclude) {
                var src = "http://www.lc11.net/getImage.php?fileName=" + attrs["tsrc"];
                var sSrc = attrs["tsrc"];

                ionic.Platform.ready(function() {
                    ImgCache.isCached(sSrc, function(path, success, fail) {

                        if (success) {
                            console.log("cached already: " + src);
                            ImgCache.useCachedFile(el, sSrc);
                        } else {
                            ImgCache.cacheFile(src, sSrc, function() {
                                console.log(src + " | " + sSrc);
                                ImgCache.useCachedFile(el, sSrc);
                            });
                        }

                    });
                });
            }
        };
    })




.controller('ImgCaptCtrl', function($scope, $ionicModal) {
    $scope.countdownTime = 0;
    $scope.simulatePost = function(caption) {
        if (caption != null) {
            alert(caption);
        }
    };

});
