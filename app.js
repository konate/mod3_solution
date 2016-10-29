(function () {

  'use strict';

  angular.module('shoppingListCheckOff', [])
  .controller('ToBuyController', ToBuyController)
  .controller('AlreadyBoughtController', AlreadyBoughtController)
  .service('ShoppingListCheckOffService', ShoppingListCheckOffService);

  ToBuyController.$inject = ['ShoppingListCheckOffService'];
  function ToBuyController(ShoppingListCheckOffService) {
    var toBuyCtr = this;
    var shoppingListCheckOffService= ShoppingListCheckOffService;
    toBuyCtr.buyList = [];
    toBuyCtr.allBought=false;
    toBuyCtr.bought = function (item) {
      if(!isAllBought()){
        shoppingListCheckOffService.bought(item);
        toBuyCtr.allBought = isAllBought();
      }else {
        toBuyCtr.allBought = true;
      }
    };

    toBuyCtr.getToBuyList = function () {
      toBuyCtr.buyList = shoppingListCheckOffService.toBuyList();
      return toBuyCtr.buyList;
    };
    function isAllBought () {
      return ShoppingListCheckOffService.isAllBoughtService();
    }
    toBuyCtr.isItemBought =  function (itemIndex) {
      return ShoppingListCheckOffService.isItemBoughtService(itemIndex);
    };
  }

  AlreadyBoughtController.inject = ['ShoppingListCheckOffService'];
  function AlreadyBoughtController(ShoppingListCheckOffService) {
    var boughtCtr = this;
    boughtCtr.alreadyBoughtList= [];
    var shoppingListCheckOffService= ShoppingListCheckOffService;

    boughtCtr.getBoughList = function () {
      boughtCtr.alreadyBoughtList = shoppingListCheckOffService.boughtList();
      return boughtCtr.alreadyBoughtList;
    };

    boughtCtr.isEmpty = function () {
      return boughtCtr.alreadyBoughtList.length>0? false : true;

    };

  }

  function ShoppingListCheckOffService() {
    var service = this;
    service.itemList = [
      { name: "tomatoes", quantity: 10 , bought:false},
      { name: "pizza", quantity: 10, bought:false },
      { name: "kiwi", quantity: 10, bought:false },
      { name: "orange", quantity: 10, bought:false },
      { name: "banana", quantity: 10, bought:false },
      { name: "candy", quantity: 10, bought:false },
      { name: "cat food", quantity: 10, bought:false }
    ];

    service.bought = function (item) {
      if (service.itemList.length) {
        var itemIndex = service.itemList.indexOf(item);
        item.bought = true;
        service.itemList[itemIndex] = item;
      }
      else {
        throw new Error("Service item list is empty.");
      }
    };

    service.boughtList = function () {
      return service.itemList.filter(itemBought);
    };

    service.toBuyList = function () {
      return service.itemList.filter(itemToBuy);
    };

    service.isAllBoughtService = function () {
      return service.itemList.every(itemBought);
    };

    function itemBought(item) {
      return item.bought === true;
    }

    function itemToBuy(item) {
      return item.bought === false;
    }

    return service;
  }

})();
