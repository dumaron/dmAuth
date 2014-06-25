
(function(window, angular, undefined) {
	'use strict';
	angular.module('dmAuth',['ng'])
		.service('Auth', function Auth($http, $q) {
			// AngularJS will instantiate a singleton by calling "new" on this function

			var users = {};

			this.existsSession = function (yes, no) {
				$http.get('/getSession')
					.success(function (data) {
						users[data.username] = data;
						yes();
					})
					.error(no);
			};

			this.noLoggedUser = function () {
				for (var key in users) {
					if (users.hasOwnProperty(key))
						return false;
				}
				return true;
			};

			this.login = function (username, password) {
				var deferred = $q.defer();
				if (!username || !password) {
					deferred.reject('Username and password should not be empty');
				}
				else {
					$http.post('/login/', {
						username: username,
						password: password
					})
						.success(function (data, status, header, config) {
							users.push({
								username: username
							});
							deferred.resolve(true);
						})
						.error(function (data, status, header, config) {
							deferred.reject('Authentication failed');
						});
				}

				return deferred.promise;
			};

			this.getUserInfo = function (username) {
				return users[username];
			}
		});
})(window, window.angular);

