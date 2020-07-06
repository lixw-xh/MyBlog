angular.module("strap",[]);
angular.module("common",[
	"provider",
	"service",
	"directives",
	"filters",
	"oc.lazyLoad",
	"strap"
]);
angular.module("routeApp",[]);
var App = angular.module("App",["common","routeApp"],function($httpProvider){
	$httpProvider.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	$httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript, */*; q=0.01';
	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
});
App.controller('mainController',function($scope,$ocLazyLoad){
	// $ocLazyLoad.load('/sjhpxj/bower_components/jplayer/jquery.jplayer.min.js').then(function(res){
	// 	$("#jquery_jplayer_1").jPlayer({
	//         ready: function () {
	//             $(this).jPlayer("setMedia", {
	//                 m4v: "http://www.jq22.com/demo/src/mi4.m4v",
	//                 ogv: "http://www.jq22.com/demo/src/mi4.ogv",
	//                 webmv: "http://jq22.qiniudn.com/www.jq22.commi4.webm",
	//                 poster: "http://www.jq22.com/demo/src/mi4.png"
	//             });
	//         },
	//         swfPath: "js",
	//         supplied: "webmv, ogv, m4v",
	//         size: {
	//             width: "570px",
	//             height: "340px",
	//             cssClass: "jp-video-360p"
	//         }

	//     });
	// });
});
App.controller('pagination',function($scope,$element,$window){
	var url 			= $element.attr('url');
	$scope.pagecount	= $element.attr('pagecount');
	$scope.page			= $element.attr('page');
	$scope._page_		= $scope.page;
	$scope.$watch('page', function(newValue, oldValue) {
		if(newValue){
			if(/^\d+$/.test(newValue)){
				if(parseInt(newValue) > $scope.pagecount){
					$scope.page 	= $scope.pagecount;
				}
			}else{
				$scope.page 	= 1;
			}
		}
	});
	$scope.goto 	= function(){
		if($scope.page != $scope._page_ && $scope.page <= $scope.pagecount)
			$window.location.href 	= url.replace('__PAGE__',$scope.page);
	}
});
function ArrayToJSON(data){
	var json 	= {};
	angular.forEach(data, function(n){
		if(/\[\]$/.test(n.name)){
			var name 		= n.name.replace(/\[\]$/,'');
			if(angular.isArray(json[name])){
				json[name].push(n.value);
			}else{
				json[name]	= [n.value];
			}
		}else
			json[n.name]	= n.value;
	});
	return json;
}