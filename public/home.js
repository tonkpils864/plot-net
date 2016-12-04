var home=angular.module('home',['nvd3']);

home.controller('homeController', ['$scope', '$http',function($scope,$http) {
    $scope.currentPage = 0;
    $scope.pageSize = 10;

    $scope.filesChanged= function (elm) {
        $scope.files=elm.files
        $scope.$apply();
    }
    $scope.upload= function() {
        var fd = new FormData();
        fd.append('file', $scope.files[0]);
        console.log($scope.files[0]);
        console.log(fd);
        $http({
            method:'POST',
            url:'/upload',
            data: fd,
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(function successCallback(res) {
                console.log("all done");
                $scope.loadPosts();
            }, function errorCallback(res) {
                console.log("something went wrong");
        });
    }
    $scope.loadPosts=function() {
        $http({method:'GET',url:'/load'})
            .then(function successCallback(res) {
                $scope.posts = formData(res.data);
                $scope.numberOfPages=function(){
                    return Math.ceil($scope.posts.length/$scope.pageSize);
                }
                $scope.options={
                    chart: {
                        type: 'lineChart',
                        height: 450,
                        margin : {
                            top: 20,
                            right: 20,
                            bottom: 40,
                            left: 55
                        },
                        x: function(d){ return d.x; },
                        y: function(d){ return d.y; },
                        useInteractiveGuideline: true,
                        dispatch: {
                            stateChange: function(e){ console.log("stateChange"); },
                            changeState: function(e){ console.log("changeState"); },
                            tooltipShow: function(e){ console.log("tooltipShow"); },
                            tooltipHide: function(e){ console.log("tooltipHide"); }
                        },
                        xAxis: {
                            axisLabel: 'Time (ms)'
                        },
                        yAxis: {
                            axisLabel: 'Voltage (v)',
                            tickFormat: function(d){
                                return d3.format('.02f')(d);
                            },
                            axisLabelDistance: -10
                        },
                        callback: function(chart){
                            console.log("!!! lineChart callback !!!");
                        }
                    },
                    title: {
                        enable: true,
                        text: 'Title for Line Chart'
                    },
                    subtitle: {
                        enable: true,
                        text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
                        css: {
                            'text-align': 'center',
                            'margin': '10px 13px 0px 7px'
                        }
                    },
                    caption: {
                        enable: true,
                        html: '<b>Figure 1.</b> Lorem ipsum dolor sit amet, at eam blandit sadipscing, <span style="text-decoration: underline;">vim adhuc sanctus disputando ex</span>, cu usu affert alienum urbanitas. <i>Cum in purto erat, mea ne nominavi persecuti reformidans.</i> Docendi blandit abhorreant ea has, minim tantas alterum pro eu. <span style="color: darkred;">Exerci graeci ad vix, elit tacimates ea duo</span>. Id mel eruditi fuisset. Stet vidit patrioque in pro, eum ex veri verterem abhorreant, id unum oportere intellegam nec<sup>[1, <a href="https://github.com/krispo/angular-nvd3" target="_blank">2</a>, 3]</sup>.',
                        css: {
                            'text-align': 'justify',
                            'margin': '10px 13px 0px 7px'
                        }
                    }
                };
            }, function errorCallback(res) {
                console.log("something went wrong while loading.");
            });
    }
    $scope.loadPosts();
}]);

home.directive("fileInput", ['$parse', function($parse) {
    return {
        restrict:'A',
        link:function(scope,elm,attrs){
            elm.bind('change', function(){
                $parse(attrs.fileInput)
                .assign(scope,elm[0].files)
                scope.$apply()
            })
        }
    }
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

function formData(data) {
    var rdata=[];
    for(var i=0;i<data.length;i++)
    {
        rdata.push([
            {
                values: data[i].jsondata,      //values - represents the array of {x,y} data points
                key: 'My wave!!', //key  - the name of the series.
                color: '#ff7f0e',  //color - optional: choose your own line color.
                strokeWidth: 2,
                classed: 'dashed'
            }
        ]);
    }
    return rdata;
}
