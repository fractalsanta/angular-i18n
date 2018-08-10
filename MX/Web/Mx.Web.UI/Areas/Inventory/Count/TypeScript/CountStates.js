var Inventory;
(function (Inventory) {
    var Count;
    (function (Count) {
        var countState = new Core.NG.StateNode("InventoryCount", null, "Templates/CountLayout.html", Count.myCountController, ['CountType']);
        var locationsState = new Core.NG.StateNode("Locations", "Edit/:CountType", "Templates/CountLocation.html", Count.myCountLocationController);
        var itemsState = new Core.NG.StateNode("Items", "Edit/Items/:CountType", "Templates/CountItems.html", Count.myCountItemsController);
        var groupState = new Core.NG.StateNode("Groups", "Edit/Groups/:CountType", "Templates/CountGroup.html", Count.myCountGroupController);
        countState.AddChild(locationsState, itemsState, groupState);
        Core.NG.InventoryCountModule.RegisterStateTree(countState);
    })(Count = Inventory.Count || (Inventory.Count = {}));
})(Inventory || (Inventory = {}));
