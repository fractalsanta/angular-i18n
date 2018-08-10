var Inventory;
(function (Inventory) {
    var Transfer;
    (function (Transfer) {
        var parent = new Core.NG.StateNode("TransferHistory", null, "Templates/TransferHistoryContainer.html", Transfer.transferHistoryContainerController, null, true);
        var main = new Core.NG.StateNode("History", "History", "Templates/TransferHistory.html", Transfer.transferHistoryController);
        var transferDetails = new Core.NG.StateNode("TransferDetails", "TransferDetails/:TransferRequestId", null, null);
        transferDetails.AddView("Details" + "@" + "TransferHistory", "Templates/TransferHistoryDetails.html", Transfer.transferHistoryDetailsController);
        main.AddChild(transferDetails);
        parent.AddChild(main);
        Core.NG.InventoryTransferModule.RegisterStateTree(parent);
    })(Transfer = Inventory.Transfer || (Inventory.Transfer = {}));
})(Inventory || (Inventory = {}));
