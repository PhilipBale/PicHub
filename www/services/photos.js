var module = angular.module('pichub.services'); // Using same module

module.factory('Photos', function(User, $http) {
	var photoCache = [];
	
	
	function makeDirty() {
		photoCache = photoCache;
		/*var tempCache = photoCache;
		photoCache.length = 0;
		photoCache.push.apply(photoCache, tempCache);*/
	}
	
	function updateItems() {
		console.log("Updating items");
		$http.jsonp('http://www.lc11.net/getData.php?callback=JSON_CALLBACK').success(function(data) {
			photoCache.length = 0; // Clear initial array
			photoCache.push.apply(photoCache, data); // Push data to initial array =
	        formatTimeDifference();
	    }); 
	}
	
    function formatTimeDifference() {
        for (var i in photoCache) {
            photoCache[i].upload_date = prettyDate(photoCache[i].upload_date);
        }
    }
    
	function voteForPhoto(id, yesVote) {
        $http.get('http://www.lc11.net/vote.php?direction=' + (yesVote ? 1 : 0) + '&id=' + id).finally(function() {
            for (var i in photoCache) {
                if (photoCache[i].id == id) {
                	console.log("Well fuck...");
                    if (yesVote) {
                        photoCache[i].yes_votes++;
                    } else {
                        photoCache[i].no_votes++;
                    }
                }
            }
        }); 
    };
	 
	
	return {
		voteForPhoto: function(id, yesVote) {
			return voteForPhoto(id, yesVote);
		}, 
		updateItems: function() {
			updateItems();
			return photoCache;
		},
		getPhotos: function() {
			return photoCache;
		}
	};
});



