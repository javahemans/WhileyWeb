/**
 * Created by javahemans on 17/11/16.
 */
var whileyApp = angular.module('whileyApp', ['firebase']).constant('FIREBASE_URL', 'https://whiley-7a709.firebaseio.com/');


whileyApp.controller('LoginController', function ($scope, $firebaseAuth, FIREBASE_URL) {
    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);

    $scope.login = function () {

    }

    $scope.register = function () {
        auth.$createUser({
            email: $scope.user.email,
            password: $scope.user.password
        }).then(function (regUser) {
            alert("DONE");
            $scope.message = "Welcome " + $scope.user.email;
        }).catch(function (error) {
            alert(error);
            $scope.message = error.message;
        })
    }

});