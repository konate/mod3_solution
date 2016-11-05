(function () {

  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController )
  .service('MenuSearchService', MenuSearchService)
  .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
  .directive('foundItems', FoundItemsDirective);

  function FoundItemsDirective() {
    var ddo = {
      restrict: 'E',
      templateUrl: 'found-items-list.html',
      scope: {
        found: '<',
        message: '@',
        onRemove: '&'
      },
      controller: NarrowItDownController,
      controllerAs: 'narrowItCtrl',
      bindToController: true
    };

    return ddo;
  }
//////////////////
  NarrowItDownController.$inject = ['MenuSearchService', "$scope"];
  function NarrowItDownController (MenuSearchService, $scope) {
    var narrowItCtrl = this;
    narrowItCtrl.message = "";
    narrowItCtrl.searchTerm="";
    $scope.submittedError = false;
    narrowItCtrl.found =[];
    var menuSearchService = MenuSearchService;

    narrowItCtrl.getMatchedMenuItems = function () {
      if(narrowItCtrl.searchTerm){
        activate();
      }else{
        $scope.submittedError = true;
        narrowItCtrl.found.splice(0,narrowItCtrl.found.length);
        narrowItCtrl.message = "Nothing found!";
      }

    };

    function activate(){
      return  menuSearchService.getMatchedMenuItems(narrowItCtrl.searchTerm)
      .then(function(data){
        narrowItCtrl.found = data;
        return narrowItCtrl.found;
      });
    }

    narrowItCtrl.showNotFoundMessage = function () {
      if(narrowItCtrl.submittedError===true) {
        return true;
      }
      if(!narrowItCtrl.searchTerm || narrowItCtrl.searchTerm.length ===0) {
        return true;
      }else{
        return menuSearchService.noSearchMatched() ;
      }
    };

    narrowItCtrl.remove = function (itemIndex) {
      if(narrowItCtrl.found.length){
        narrowItCtrl.found.splice(itemIndex, 1);
      }
    };
  }
  //////////////////// SERVICE    //////
  MenuSearchService.$inject = ['$http', 'ApiBasePath'];
  function MenuSearchService($http, ApiBasePath) {
    var service = this;
    service.searchTerm = "";
    service.nothingFound = true;
    var foundItems = [];

    service.getMatchedMenuItems = function (searchTerm){
      service.searchTerm = searchTerm;
      return $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json"),
        params: {
          category: ''
        }
      })
      .then(function (result) {
        foundItems = result.data.menu_items.filter(resultFilter);
        if(foundItems.length >0){
          service.nothingFound = false;
        }else{
          service.nothingFound = true;
        }
        // return processed items
        return foundItems;
      })
      .catch(function (error) {
        console.log(error);
        return [];
      });
    };
    function resultFilter (item){
      return item.description.toLowerCase()
      .includes(service.searchTerm.toLowerCase());
    }
    service.noSearchMatched = function (){
      return service.nothingFound;
    };
    return service;
  }

})();
