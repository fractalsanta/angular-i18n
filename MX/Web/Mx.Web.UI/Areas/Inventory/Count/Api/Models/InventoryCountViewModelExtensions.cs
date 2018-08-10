using System;

namespace Mx.Web.UI.Areas.Inventory.Count.Api.Models
{
    static class InventoryCountViewModelExtensions
    {
        public static String FlipFrequencyOrder(this String frequency)
        {
            var frequencyArray = frequency.ToCharArray();
            var temp = frequencyArray[4];

            frequencyArray[4] = frequency[3];
            frequencyArray[3] = temp;

            return new String(frequencyArray);
        }
    }
}