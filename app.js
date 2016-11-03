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
      onEmpty:'&',
      onRemove: '&'
    },
    controller: NarrowItDownController,
    controllerAs: 'narrowItCtrl',
    bindToController: true
  };

  return ddo;
}

  NarrowItDownController.$inject = ['MenuSearchService', "$scope"];

  function NarrowItDownController (MenuSearchService, $scope) {
    var narrowItCtrl = this;
    narrowItCtrl.message = "";
    $scope.searchTerm="";
    narrowItCtrl.found =[];
    narrowItCtrl.nothingToShow = false;

    var menuSearchService = MenuSearchService;
    function activate(){

      return  menuSearchService.getMatchedMenuItems($scope.searchTerm)
      .then(function(data){
          narrowItCtrl.message = "Nothing found!";
        narrowItCtrl.found = data;
        if(narrowItCtrl.found.length > 0 ){
            narrowItCtrl.nothingToShow = false;
        }
        return narrowItCtrl.found;
      });
    }
   narrowItCtrl.getMatchedMenuItems = function () {
       narrowItCtrl.nothingToShow = false;
       if($scope.searchTerm.length > 0){
          activate();
       }else{
         narrowItCtrl.message = "Nothing found!";
       }

   };

  //  diplays nothing found only when user has perform search
   narrowItCtrl.showNotFoundMessage = function () {
      if($scope.searchTerm.length > 0){
         return (menuSearchService.noSearchMatched() && menuSearchService.searched()) ;
      }else{
       return (menuSearchService.noSearchMatched()) ;
     }
   };
   narrowItCtrl.remove = function (itemIndex) {
     if(narrowItCtrl.found.length){
       console.log( itemIndex);
        narrowItCtrl.found.splice(itemIndex, 1);
  }

   };
  }

  MenuSearchService.$inject = ['$http', 'ApiBasePath'];
  function MenuSearchService($http, ApiBasePath) {
    var service = this;
    service.searchTerm = "";
    var nothingFound = true;
    var searched = false;
    var foundItems = [];

    service.getMatchedMenuItems = function (searchTerm){
      service.searchTerm = searchTerm;
        searched = true;
      return $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json"),
        params: {
          category: ''
        }
      })
      .then(function (result) {
        foundItems = result.data.menu_items.filter(searchT);
        if(foundItems.length >0){
          nothingFound = false;
        }else{
            nothingFound = true;
        }
        // return processed items
        return foundItems;
      })
      .catch(function (error) {
        console.log(error);
      });
    };
    function searchT (item){
      return item.description.includes(service.searchTerm );
    }
    service.noSearchMatched = function (){
      return nothingFound;
    };
    // this force message not to show when no search is done
    service.searched = function (){
        return searched;
    };
    return service;
  }

})();
