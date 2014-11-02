var module = angular.module('pichub.services'); // Using same module

module.factory('PhotoUpload', function(User) {
	
	
	function capturePhoto($scope) {
		if (navigator.camera != null) {
			navigator.camera.getPicture(uploadPhoto, onFailedPhoto, {
				sourceType : 1,
				quality : 50,
				encodingType : 0,
				saveToPhotoAlbum : false,
				targetHeight : 960,
				correctOrientation : true
			});
		} else {
			alert("Camera not supported!");
		}

	}
	
	function uploadPhoto(data) {
		//$scope.cameraSrc = "data:image/jpeg;base64," + data;

		/*$.post( "upload.php", {data: imageData}, function(data) {
		 alert("Image uploaded!");
		 }); */
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
	
	return {
		takePhoto: function() {
		return capturePhoto();
		}
	};
}); 