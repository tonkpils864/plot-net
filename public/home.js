var home=angular.module('home',[]);

home.controller('homeController', ['$scope', '$http',function($scope,$http) {
    $scope.userPost='';
    $scope.currentPage = 0;
    $scope.pageSize = 10;

    $scope.addPost= function() {
        if(!$scope.userPost.length) return;
        var str= {text:""+$scope.userPost};
        console.log(str);
        $http({method:'POST',url:'/text',data:str})
            .then(function successCallback(res) {
                $scope.userPost="";
                loadPosts();
            }, function errorCallback(res) {
                console.log("something went wrong");
        });
    }

    function loadPosts() {
        $http({method:'GET',url:'/load'})
            .then(function successCallback(res) {
                $scope.posts=res.data;
                $scope.numberOfPages=function(){
                    return Math.ceil($scope.posts.length/$scope.pageSize);
                }
            }, function errorCallback(res) {
                console.log("something went wrong while loading.");
            });
    }
    loadPosts();
}]);

home.directive("postResult", function() {
    return {
        templateUrl:'directives/postResult.html',
        replace:true
    }
});

home.filter('startFrom', function() {
    return function(input, start) {
        if (!input || !input.length) { return; }
        start = +start; //parse to int
        return input.slice(start);
    }
});
