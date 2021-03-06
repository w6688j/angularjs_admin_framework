/**
 * Created by chenmingming on 2016/7/4.
 */
define(['oa'], function (pms) {
    pms
        .factory('$page', ['$rootScope', function ($rootScope) {
            var PAGE = function () {
                this.pagevar = 'p';
                this.listrows = 20;
                this.coolpage = 5;
                this.params = $rootScope.$stateParams;
            };
            PAGE.prototype = {
                init: function (total) {
                    this.total = parseInt(total) || 0;
                    this.page = Math.max(parseInt(this.params[this.pagevar]), 1) || 1;
                    this.is_show = true;
                    this.total <= 0 && (this.is_show = false);
                    this.lastpage = this.pages = Math.ceil(this.total / this.listrows);
                    this.page > this.lastpage && (this.page = this.lastpage);

                    this.list = [];
                    if (this.is_show) {
                        var ceil_now_coolpage, i, p;
                        ceil_now_coolpage = Math.ceil(this.coolpage / 2);
                        for (i = 1; i <= this.coolpage; i++) {
                            if ((this.page - ceil_now_coolpage) <= 0) {
                                p = i;
                            } else if ((this.page + ceil_now_coolpage ) >= this.pages) {
                                p = this.pages - this.coolpage + i;
                            } else {
                                p = this.page - ceil_now_coolpage + i;
                            }
                            if (p >= 1 && p <= this.pages)
                                this.list.push(p);
                        }
                    }
                },
                selectPage: function (page) {
                    page < 1 && (page = 1);
                    page > this.pages && (page = this.pages);
                    if (this.page == page) {
                        return false;
                    }
                    this.params[this.pagevar] = page;
                    $rootScope.$state.go('.', $rootScope.$stateParams, {notify: false});
                    this.init(this.total);
                    $rootScope.$emit('reload-page-data');
                }
            };
            return PAGE;
        }])
        .directive('uiPage', ['$page', function ($page) {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    total: '=',
                    config: '='
                },
                template: '<div class="ui pagination menu" ng-show="total>0">'
                + '<a class="labeled item">共 {{total}} 条记录'
                + '<a class="icon item" ng-class="{active:P.page==1}" ng-click="P.selectPage(1);">首页</a>'
                + '<a class="icon item" ng-class="{active:1 == P.page}" ng-click="P.selectPage(P.page-1);"><i class="left chevron icon"></i></a>'
                + '<a class="item" ng-class="{active:listp == P.page}" ng-click="P.selectPage(listp);" ng-repeat="listp in P.list">{{listp}}</a>'
                + '<a class="icon item" ng-class="{active:P.lastpage == P.page}" ng-click="P.selectPage(P.page+1);"><i class="right chevron icon"></i></a>'
                + '<a class="icon item" ng-class="{active:P.lastpage == P.page}" ng-click="P.selectPage(P.lastpage);">尾页</a></div>',
                link: function ($scope) {
                    $scope.P = new $page();
                    $scope.$watch('total', function () {
                        if($scope.total !== undefined){
                            $scope.config && ($scope.P = $.extend($scope.P, $scope.config));
                            $scope.P.init($scope.total);
                        }
                    })
                }
            };
        }])
});