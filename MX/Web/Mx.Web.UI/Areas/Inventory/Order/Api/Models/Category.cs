using System;

namespace Mx.Web.UI.Areas.Inventory.Order.Api.Models
{
    public class Category
    {
        public Int64 CategoryId { get; set; }
        public String Name { get; set; }
        public Int32 TotalItems { get; set; }
        public Int32 ItemsInOrder { get; set; }
    }
}