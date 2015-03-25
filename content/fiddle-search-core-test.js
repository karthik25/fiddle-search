fiddleSearch.factory("fiddleApiFactory", ["$q", function ($q) {
  var factory = {};

  factory.getFiddlesForUser = function (userName) {
	var defer = $q.defer();
	
	defer.resolve([ {
			"framework": "AngularJS",
			"version": 20,
			"description": "",
			"title": "Angular - simple",
			"url": "//jsfiddle.net/karthik25/Us98w/",
			"author": "karthik25",
			"latest_version": 20,
			"created": "2013-06-21 21:09:14"
			},
			{
			"framework": "jQuery",
			"version": 1,
			"description": "",
			"title": "Bootstrap 3.0 -Keep Accordions Open",
			"url": "//jsfiddle.net/karthik25/HKvS3/",
			"author": "karthik25",
			"latest_version": 1,
			"created": "2014-02-18 21:09:30"
			},
			{
			"framework": "jQuery",
			"version": 8,
			"description": "",
			"title": "Appear menus - with hide on outside click",
			"url": "//jsfiddle.net/karthik25/pnf6M/",
			"author": "karthik25",
			"latest_version": 8,
			"created": "2012-09-16 07:07:07"
			},
			{
			"framework": "jQuery",
			"version": 9,
			"description": "",
			"title": "Qtip",
			"url": "//jsfiddle.net/karthik25/zXP6W/",
			"author": "karthik25",
			"latest_version": 9,
			"created": "2012-10-03 16:04:46"
			},
			{
			"framework": "jQuery",
			"version": 0,
			"description": "",
			"title": "Bootstrap tabs",
			"url": "//jsfiddle.net/karthik25/79258cjs/",
			"author": "karthik25",
			"latest_version": 0,
			"created": "2015-03-11 04:04:03"
			},
			{
			"framework": "jQuery",
			"version": 5,
			"description": "",
			"title": "sBlog menu",
			"url": "//jsfiddle.net/karthik25/RkGrd/",
			"author": "karthik25",
			"latest_version": 5,
			"created": "2012-10-03 16:04:38"
			},
			{
			"framework": "jQuery",
			"version": 1,
			"description": "Bottom menu v4",
			"title": "Bottom menu v4",
			"url": "//jsfiddle.net/karthik25/6Rqak/",
			"author": "karthik25",
			"latest_version": 1,
			"created": "2012-07-17 21:09:17"
			},
			{
			"framework": "jQuery",
			"version": 14,
			"description": "",
			"title": "Button",
			"url": "//jsfiddle.net/karthik25/bLtHe/",
			"author": "karthik25",
			"latest_version": 15,
			"created": "2013-08-29 21:09:48"
			} ]);
		return defer.promise;
  };
  
  return factory;
}]);
