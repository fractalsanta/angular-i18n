module Inventory.Transfer {

    var parent = new Core.NG.StateNode("TransferHistory",
        null,
        "Templates/TransferHistoryContainer.html",
        transferHistoryContainerController,
        null,
        true);

    var main = new Core.NG.StateNode("History",
        "History",
        "Templates/TransferHistory.html",
        transferHistoryController);

    var transferDetails = new Core.NG.StateNode("TransferDetails",
        "TransferDetails/:TransferRequestId",
        null,
        null);

    transferDetails.AddView("Details" + "@" + "TransferHistory",
        "Templates/TransferHistoryDetails.html",
        transferHistoryDetailsController);

    main.AddChild(transferDetails);
    parent.AddChild(main);

    Core.NG.InventoryTransferModule.RegisterStateTree(parent);
}  