var module = angular.module('pichub.services', []); // Creating module here
 
module.factory('User', function () {
	
  var currentUser;
  
  // Used for dev testing
  function updateNull() {
  	if (currentUser == null) {
  		currentUser = [];
  		currentUser.id = 2;
  	}
  }

  return {
  	current: function() {
  		updateNull();
  		return currentUser;
  	},
  	id: function() {
  		updateNull();
  		return currentUser.id;
  	}
  };

});