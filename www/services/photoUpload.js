var module = angular.module('pichub.services'); // Using same module
module.factory('Camera', ['$q', function($q) {

  return {
    getPicture: function(options) {
      var q = $q.defer();
      
      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);
      
      return q.promise;
    }
  }
}]);

module.factory('PhotoUpload', function(User, Camera) {
	
	
	function capturePhoto($scope) {
		if (navigator.camera != null) {
			console.log("Taking a picture.");
			Camera.getPicture().then(uploadPhoto, onFailedPhoto, {
				sourceType : 1,
				quality : 75,
				saveToPhotoAlbum : false,
				encodingType: 0,
				destinationType: 1,
				targetHeight : 960,
				correctOrientation : true
			});
		} else {
			console.log("Camera not supported? Something went wrong");
			alert("Camera not supported!");
		}

	}
	
	function uploadPhoto(data) {
		console.log("Trying to upload photo w/ URI: " + data); 
		//$scope.cameraSrc = "data:image/jpeg;base64," + data;

		/*$.post( "upload.php", {data: imageData}, function(data) {
		 alert("Image uploaded!");
		 }); */

		//iOS uri: file:///var/mobile/Containers/Data/Application/2FBD19D6-8321-45AE-BC19-0F998D5EE91D/tmp/cdv_photo_008.jpg
        //Android uri: file:///storage/emulated/0/Android/data/com.logikcomputing.pichub/cache/1417631448726.jpg 
		var options = new FileUploadOptions();
		options.fileKey = "file";
		options.fileName = data.substr(data.lastIndexOf('/') + 1);
		options.mimeType = "image/jpeg";
		options.chunkedMode = false;
		options.headers = {
			Connection : "close"
		};

		var params = new Object();
		params.fullPath = data;
		params.name = options.fileName;
		params.imageName = params.name;
		params.userId = 2;//User.getCurrentUser().id;
		params.caption = "test " + params.name;
		params.timeLimit = Math.floor((Math.random() * 10) + 1);

		options.params = params;

		var ft = new FileTransfer();
		ft.upload(data, "http://www.lc11.net/upload.php", win, fail, options);
	}


	console.log("Current user Id: " + User.id());

	function win(r) {
		console.log("Image successfully posted");
		//alert("Image succesfully posted");
		/*alert("Code = " + r.responseCode);
		 alert("Response = " + r.response);
		 alert("Sent = " + r.bytesSent);*/
	}

	function fail(error) {
		console.log("An error has occurred: Code = " + error.code);
		//alert("An error has occurred: Code = " + error.code);
	}

	function onFailedPhoto(data) {
		console.log(data);
		//alert(data);
	}
	
	return {
		takePhoto: function() {
		return capturePhoto();
		}
	};
}); 