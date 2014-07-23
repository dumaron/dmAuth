
(function(window, angular, undefined) {
	'use strict';
	angular.module('dmAuth',['ng'])
		.service('Auth', function Auth($http, $q) {
			// AngularJS will instantiate a singleton by calling "new" on this function
			var user = false;

			this.existSession = function existSession(yes, no, however) {
				var deferred = $q.defer();
				$http.get('getSession')
					.success(function (data) {
						user = data;
						deferred.resolve(true);
					})
					.error(function() {
						deferred.reject('No session on the server');
					});
				return deferred.promise;
			};

			this.getUserInfo = function getUserInfo() {
				return user;
			};

			this.noLoggedUser = function noLoggedUser() {
				return !!user;
			};

			this.login = function login(username, password) {
				var deferred = $q.defer();
				if (!username || !password) {
					deferred.reject('Username and password should not be empty');
				}
				else {
					$http.post('login/', {
						username: username,
						password: password
					})
						.success(function (data, status, header, config) {
							user = data;
							deferred.resolve(true);
						})
						.error(function (data, status, header, config) {
							deferred.reject('Authentication failed');
						});
				}

				return deferred.promise;
			};
		});
})(window, window.angular);

