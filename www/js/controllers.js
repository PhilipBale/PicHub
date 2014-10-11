angular.module('starter.controllers', [])
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

.controller('HomeCtrl', function($scope, $ionicModal, $timeout, $http, $ionicNavBarDelegate, $document) {

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
            if (navigator.camera != null) {
                navigator.camera.getPicture(uploadPhoto, onFailedPhoto, {
                    sourceType: 1,
                    quality: 50,
                    encodingType: 0,
                    saveToPhotoAlbum: false,
                    targetHeight: 960,
                    correctOrientation: true
                });
            } else {
                alert("Camera not supported!");
            }


        }


        function uploadPhoto(data) {
            $scope.cameraSrc = "data:image/jpeg;base64," + data;

            /*$.post( "upload.php", {data: imageData}, function(data) {
            alert("Image uploaded!");
        }); */
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = data.substr(data.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";
            options.chunkedMode = false;
            options.headers = {
                Connection: "close"
            }

            var params = new Object();
            params.fullPath = data;
            params.name = options.fileName;
            params.imageName = params.name;
            params.userId = 2;
            params.caption = "test " + params.name;
            params.timeLimit = Math.floor((Math.random() * 10) + 1);

            options.params = params;

            var ft = new FileTransfer();
            ft.upload(data, "http://www.lc11.net/upload.php", win, fail, options);
        }

        function win(r) {
            alert("Image succesfully posted");
            /*alert("Code = " + r.responseCode);
            alert("Response = " + r.response);
            alert("Sent = " + r.bytesSent);*/
        }

        function fail(error) {
            alert("An error has occurred: Code = " + error.code);
        }

        function onFailedPhoto(data) {
            alert(data);
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
