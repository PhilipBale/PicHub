var module = angular.module('pichub.services', []);
 
module.service('UserService', function () {
	
  var currentUser;

  var friends = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];
  
  function getUserId() {
  	// TODO pull user ID from local cache
  }
  
  function updateUserCache() {
  	// TOOD sync user with server data
  }

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  };

});