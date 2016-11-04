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
    $scope.submittedError = false;
    narrowItCtrl.found =[];
    narrowItCtrl.nothingToShow = false;

    var menuSearchService = MenuSearchService;

    ///////////////////////////////
   narrowItCtrl.getMatchedMenuItems = function () {
       narrowItCtrl.nothingToShow = false;
       if($scope.searchTerm){
          activate();
       }else{
        $scope.submittedError = true;
         console.log("CLICKED: " + $scope.submittedError );

         narrowItCtrl.found.splice(0,narrowItCtrl.found.length);
         narrowItCtrl.message = "Nothing found!";
       }

   };
   ////////////////////////////////
       function activate(){
         return  menuSearchService.getMatchedMenuItems($scope.searchTerm)
         .then(function(data){
           narrowItCtrl.found = data;
           if(narrowItCtrl.found.length > 0 ){
               narrowItCtrl.nothingToShow = false;
           }
           return narrowItCtrl.found;
         });
       }

  //  diplays nothing found only when user has perform search
   narrowItCtrl.showNotFoundMessage = function () {

   if($scope.submittedError===true) {
     console.log("showNot 1: " + $scope.submittedError );
     return true;
   }
      if($scope.searchTerm){
           console.log("showNot 2: " + $scope.submittedError );
          return (menuSearchService.noSearchMatched() && menuSearchService.searched()) ;

      }else{
           console.log("menuSearchService.noSearchMatched(): " + menuSearchService.noSearchMatched() );
            console.log("showNot 3 $scope.submittedError: " + $scope.submittedError );
           if(!$scope.searchTerm || $scope.searchTerm.length ===0) return true;
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
//////////////////// SERVICE    //////
  MenuSearchService.$inject = ['$http', 'ApiBasePath'];
  function MenuSearchService($http, ApiBasePath) {
    var service = this;
    service.searchTerm = "";
    service.nothingFound = true;
    service.searched = false;
    var foundItems = [];

    service.getMatchedMenuItems = function (searchTerm){
      service.searchTerm = searchTerm;
        service.searched = true;
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
          service.nothingFound = false;
        }else{
            service.nothingFound = true;
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
      return service.nothingFound;
    };
    // this force message not to show when no search is done
    service.searched = function (){
        return service.searched;
    };
    return service;
  }

})();
