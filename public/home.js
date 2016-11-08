var home=angular.module('home',[]);

home.controller('homeController', ['$scope', '$http',function($scope,$http) {
    $scope.userPost='Post something';
    $scope.addPost= function() {
        var str= {text:""+$scope.userPost};
        console.log(str);
        $http({method:'POST',url:'/text',data:str})
            .then(function successCallback(res) {
            }, function errorCallback(res) {
                console.log("something went wrong");
        });
    }
    $scope.loadPosts= function() {
        $http({method:'GET',url:'/load'})
            .then(function successCallback(res) {
                console.log(res);

            }, function errorCallback(res) {
                console.log("something went wrong while loading.");
            });
    }

}]);
