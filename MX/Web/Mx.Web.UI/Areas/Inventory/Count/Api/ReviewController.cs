using System;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Inventory.Services.Contracts.CommandServices;
using Mx.Inventory.Services.Contracts.QueryServices;
using Mx.Inventory.Services.Contracts.Requests;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Inventory.Count.Api.Models;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Inventory.Count.Api
{
    [Permission(Task.Inventory_InventoryCount_CanView_Review)]
    public class ReviewController : ApiController
    {
        private readonly IMappingEngine _mappingEngine;
        private readonly IEntityTimeQueryService _entityTimeQueryService;
        private readonly IStockCountLocationQueryService _stockCountLocationQueryService;
        private readonly IStockCountLocationCommandService _stockCountLocationCommandService;

        public ReviewController(
            IMappingEngine mappingEngine,
            IEntityTimeQueryService entityTimeQueryService,
            IStockCountLocationQueryService stockCountLocationQueryService,
            IStockCountLocationCommandService stockCountLocationCommandService)
        {
            _mappingEngine = mappingEngine;
            _entityTimeQueryService = entityTimeQueryService;
            _stockCountLocationQueryService = stockCountLocationQueryService;
            _stockCountLocationCommandService = stockCountLocationCommandService;
        }

        public CountReviewViewModel GetReview(
            [FromUri] Int64 stockCountLocationId,
            [FromUri] CountType countType,
            [FromUri] Int64 entityIdCurrent)
        {
            _stockCountLocationCommandService.MarkAsReviewed(stockCountLocationId);

            var request = new GetCountRequest
            {
                EntityId = entityIdCurrent,
                RequestTime = _entityTimeQueryService.GetCurrentStoreTime(entityIdCurrent),
                StockCountLocationId = stockCountLocationId,
                CountTypeId = (Int32)countType
            };

            var entityTime = _entityTimeQueryService.GetCurrentStoreTime(entityIdCurrent);
            var result = _stockCountLocationQueryService.GetCountItemsForReview(request);
            var viewModel = _mappingEngine.Map<CountReviewViewModel>(result);
            var emptyGroup = new CountReviewItemViewModel[] {};
            var totalSales = result.TotalSales;
            var countedItems = viewModel.Groups.SelectMany(g => g.Items ?? emptyGroup).ToList();
            viewModel.TotalCounted = 0;
            var entityTimeOffset = (DateTime.UtcNow - entityTime).TotalHours;
            viewModel.EntityTimeOffset = Math.Round(entityTimeOffset, 2);
            countedItems.ForEach(i => {
                ProcessCosts(i, totalSales);
                viewModel.TotalCounted += i.CurrentCountValue;
            });

            return viewModel;
        }

        private static Decimal Round(Decimal value)
        {
            return Math.Round(value, 2);
        }

        private static Single Round(Single value)
        {
            return (Single)Math.Round(value, 2);
        }

        private static void ProcessCosts(CountReviewItemViewModel item, Decimal totalSales)
        {
            item.CostPercent = Round(item.CostPercent * 100);
            item.PreviousCount = (item.PreviousCount.HasValue) ? Round(item.PreviousCount.Value) : (Single?)null;
            item.CurrentCount = Round(item.CurrentCount);
            item.Usage = Round(item.Usage);
            item.Cost = Round(item.Cost);
            item.CurrentCountValue = Round(item.CurrentCountValue);
        }
    }
}