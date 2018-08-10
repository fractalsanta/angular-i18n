module Inventory.Count {
    
    var countState = new Core.NG.StateNode("InventoryCount", null, "Templates/CountLayout.html", myCountController, ['CountType']);
    var locationsState = new Core.NG.StateNode("Locations", "Edit/:CountType", "Templates/CountLocation.html", myCountLocationController);
    var itemsState = new Core.NG.StateNode("Items", "Edit/Items/:CountType", "Templates/CountItems.html", myCountItemsController);
    var groupState = new Core.NG.StateNode("Groups", "Edit/Groups/:CountType", "Templates/CountGroup.html", myCountGroupController);

    countState.AddChild(locationsState, itemsState, groupState);    
    Core.NG.InventoryCountModule.RegisterStateTree(countState);
} 