var fiddleSearch = angular.module("fiddleSearch", ['ngAnimate', 'ui.bootstrap']);

fiddleSearch.config(["$logProvider", function($logProvider){
  $logProvider.debugEnabled(true);
}]);

fiddleSearch.factory("fiddleStorageFactory", ["$log", function ($log) {
	var factory = {};
  
	factory.getFromLocalStorage = function (keyPrefix) {
		if (typeof (localStorage) !== "undefined") {
			$log.debug('Got some data from the local storage for ' + keyPrefix);
			return localStorage.getItem(keyPrefix + "_data");
		} else {
			$log.debug('Unable to get from the local storage ' + keyPrefix);
			return null;
		}
	};

	factory.setToLocalStorage = function (keyPrefix, data) {
		if (typeof (localStorage) !== "undefined") {
			localStorage.setItem(keyPrefix + "_data", JSON.stringify(data));
			$log.debug('Added to the local storage ' + keyPrefix);
		} else {
			$log.debug('Unable to add to the local storage ' + keyPrefix);
		}
	};

	return factory;
}]);

fiddleSearch.factory("fiddleApiFactory", ["$http","$q", "$log", function ($http, $q, $log) {
  var factory = {};
  var baseUrl = "http://jsfiddle.net/api/user/{userName}/demo/list.json?limit=1000&callback=JSON_CALLBACK";
  
  var getApiUrl = function (userName){
	var modifiedUrl = baseUrl.replace("{userName}", userName);
	return modifiedUrl;
  };

  factory.getFiddlesForUser = function (userName) {
	var defer = $q.defer();

	var url = getApiUrl(userName);
	var promise = $http.jsonp(url)
	promise.success(function(data){
		defer.resolve(data.list);
	}, function (){
		$log.error('[ERROR] Error');
	});

	return defer.promise;
  };
  
  return factory;
}]);

fiddleSearch.controller("fiddleSearchController", ["$scope", "$log", "fiddleStorageFactory", "fiddleApiFactory", function($scope, $log, fiddleStorageFactory, fiddleApiFactory){
	$scope.gettingStarted = true;

	$scope.userName = "";
	$scope.searchText = "";

	$scope.refresh = false;
	$scope.setDefault = false;
	$scope.showHeader = true;

	$scope.userFiddles = [];

	$scope.filteredUserFiddles = [], $scope.currentPage = 1, $scope.numPerPage = 5, $scope.maxSize = 10, $scope.totalItems = 0;

	$scope.loadingFiddles = false;
	$scope.moreCredits = false;

	$scope.setBannerStatus = function () {
		var defaultUser = fiddleStorageFactory.getFromLocalStorage("f_defaultUser");
		if (defaultUser == null || defaultUser == "") {
			$scope.gettingStarted = true;
			$scope.setDefault = false;
		}
		else {
			$scope.gettingStarted = false;
			$scope.setDefault = true;
		}
		$log.debug('Default user: ' + defaultUser + ' & Status: ' + $scope.gettingStarted);
	};

	$scope.getFiddles = function(sText, update){
		$scope.loadingFiddles = true;

		$log.debug('Getting the fiddles');
		$scope.gettingStarted = false;

		if ($scope.setDefault) {
			$log.debug('Setting default user = ' + $scope.userName);
			fiddleStorageFactory.setToLocalStorage("f_defaultUser", $scope.userName);
		}

		var fiddles = fiddleStorageFactory.getFromLocalStorage($scope.userName);

		if (!$scope.refresh && fiddles) {
			$log.debug('Got the data from local storage...1');
			$scope.userFiddles = $scope.filteredFiddles(JSON.parse(fiddles), sText);
			$scope.updateResults();
			$scope.loadingFiddles = false;
			return;
		}
		else {
			$log.debug('Getting from the api');
			fiddleApiFactory.getFiddlesForUser($scope.userName).then(function(data){
				$log.debug('Done!!!');
				$scope.userFiddles = $scope.filteredFiddles(data, sText);
				$scope.loadingFiddles = false;
				fiddleStorageFactory.setToLocalStorage($scope.userName, data);
				if (update)
				{
					$scope.updateResults();
				}
			});
		}
	};

	$scope.filteredFiddles = function (items, text) {
		var filteredItems = [];

		for (var i = 0; i < items.length; i++)
		{
			var item = items[i];
			if (text != null && text != ''){
				if (item.title.toLowerCase().indexOf(text) >= 0 || item.description.toLowerCase().indexOf(text) >= 0 || item.framework.toLowerCase().indexOf(text) >= 0){
					filteredItems.push(item);
				}
			}
			else{
				filteredItems.push(item);
			}
		}

		return filteredItems;
	};

	$scope.$watch('searchText', function(newValue, oldValue){
		if (newValue != oldValue)
		{
			$log.debug('searching...');
			var text = $scope.searchText.length > 3 ? $scope.searchText : null;
			$scope.getFiddles(text, true);		
		}
	});

	$scope.$watch('currentPage + numPerPage', function () {
		$scope.updateResults();
	});

	$scope.getVersions = function(versions){
		var possibilities = [];

		versions = versions - 1;
		if (versions <= 1) {
			return possibilities
		}

		for (var i = versions; (i>0 && possibilities.length < 10); i--){
			possibilities.push(i);
		}
		return possibilities;
	};

	$scope.getDisplayStatus = function(versions){
		if (versions <= 1) {
			return true;
		}
		return false;
	};

	$scope.updateResults = function () {
		var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
		$log.debug('Begin = ' + begin + ' end = ' + end + ' total = ' + $scope.userFiddles.length);
		$scope.totalItems = $scope.userFiddles.length;
		$scope.filteredUserFiddles = $scope.userFiddles.slice(begin, end);
	};

	$scope.numPages = function () {
		return Math.ceil($scope.userFiddles.length / $scope.numPerPage);
	};

	$scope.updateResultsInternal = function() {
		$log.debug('Update results internal');
		$scope.getFiddles("", true);
	};

	$scope.initialize = function () {
		var _userName = fiddleStorageFactory.getFromLocalStorage("f_defaultUser");
		var re = new RegExp('"', 'g');
		if (_userName != null && _userName != "") {
		$scope.userName = _userName.replace(re,'');
		}
		$log.debug('Default username = ' + $scope.userName);

		if ($scope.userName != null && $scope.userName != "") {
			$log.debug('Default call');
			$scope.updateResultsInternal();
		}
	};

	$scope.setBannerStatus();
	$scope.initialize();
}]);
