using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;
using AutoMapper;
using Mx.OperationalReporting.Services.Contracts.CommandService;
using Mx.OperationalReporting.Services.Contracts.QueryServices;
using Mx.OperationalReporting.Services.Contracts.Requests;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Models;
using Mx.Web.UI.Config.WebApi;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Services;
using System;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Attributes;

namespace Mx.Web.UI.Areas.Operations.Reporting.Api
{   
    public class ViewController : ApiController
    {
        private readonly IMappingEngine _mapper;
        private readonly IViewQueryService _viewQueryService;
        private readonly IViewCommandService _viewCommandService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IEntityService _entityService;
        private readonly IReportAttributeService _reportAttrService;

        public ViewController(IMappingEngine mapper,
                              IAuthenticationService authenticationService,
                              IViewQueryService viewQueryService,
                              IEntityService entityService,
                              IViewCommandService viewCommandService,
                              IReportAttributeService reportAttrService
            )
        {
            _mapper = mapper;
            _authenticationService = authenticationService;
            _viewQueryService = viewQueryService;
            _viewCommandService = viewCommandService;
            _entityService = entityService;
            _reportAttrService = reportAttrService;
        }

        public ViewModel GetView(long entityId, int viewId, ReportType reportType)
        {
            if (_reportAttrService.GetReportViewType(reportType) == ReportViewType.ByEntity)
            {
                return GetEntityView(entityId, viewId);
            }
            else
            {
                return GetUserView(viewId);
            }
        }

        private ViewModel GetEntityView(long entityId, int viewId)
        {
            var isSharedView = false;

            var view = _viewQueryService.GetReportView(entityId, viewId);
            if (view == null)
            {
                view = _viewQueryService.GetReportView(_entityService.CorporateEntityId(), viewId);
                isSharedView = true;
            }

            var response = _mapper.Map<ViewModel>(view);

            _reportAttrService.CheckUserCanAccess(response.ReportType);

            if (isSharedView)
            {
                _reportAttrService.CheckUserCanCreateSharedViews(response.ReportType);
            }

            return response;
        }

        private ViewModel GetUserView(int viewId)
        {
            var view = _viewQueryService.GetReportView(viewId);
            var response = _mapper.Map<ViewModel>(view);

            if (!view.UserId.HasValue)
            {
                _reportAttrService.CheckUserCanCreateSharedViews(response.ReportType);                
            }
            else if (view.UserId != _authenticationService.UserId)
            {
                throw new HttpResponseException(HttpStatusCode.Forbidden);
            }

            _reportAttrService.CheckUserCanAccess(response.ReportType);

            return response;
        }

        public IEnumerable<ViewModel> GetReportViews(long entityId, ReportType reportType)
        {
            if (_reportAttrService.GetReportViewType(reportType) == ReportViewType.ByEntity)
            {
                return GetEntityReportViews(entityId, reportType);
            }
            else
            {
                return GetUserReportViews(reportType);
            }
        }

        private IEnumerable<ViewModel> GetEntityReportViews(long entityId, ReportType reportType)
        {
            _reportAttrService.CheckUserCanAccess(reportType);

            var views = _viewQueryService.GetEntityReportViews(entityId, (OperationalReporting.Services.Contracts.Enums.ReportType)reportType).ToList();
            views.AddRange(_viewQueryService.GetEntityReportViews(_entityService.CorporateEntityId(), (OperationalReporting.Services.Contracts.Enums.ReportType)reportType));
            return _mapper.Map<IEnumerable<ViewModel>>(views).OrderBy(x=>x.ViewName.ToLower());
        }

        private IEnumerable<ViewModel> GetUserReportViews(ReportType reportType)
        {
            _reportAttrService.CheckUserCanAccess(reportType);

            var views = _viewQueryService.GetUserReportViews(_authenticationService.UserId, (OperationalReporting.Services.Contracts.Enums.ReportType)reportType).ToList();
            return _mapper.Map<IEnumerable<ViewModel>>(views).OrderBy(x => x.ViewName.ToLower());
        }

        public int PostCreateView([FromUri] long entityId, [FromBody] ViewModel view)
        {
            if (_reportAttrService.GetReportViewType(view.ReportType) == ReportViewType.ByEntity)
            {
                return PostCreateEntityView(entityId, view);
            }
            else
            {
                return PostCreateUserView(view);
            }
        }

        private int PostCreateEntityView(long entityId, ViewModel view)
        {
            _reportAttrService.CheckUserCanAccessViewManager(view.ReportType);
            
            if (view.EntityId == 0)
            {
                view.EntityId = _entityService.CorporateEntityId();
                _reportAttrService.CheckUserCanCreateSharedViews(view.ReportType);
            }

            var request = _mapper.Map<ViewRequest>(view);
            request.UserId = null;
            return _viewCommandService.InsertView(view.EntityId, request);
        }

        private int PostCreateUserView(ViewModel view)
        {
            _reportAttrService.CheckUserCanAccessViewManager(view.ReportType);

            var request = _mapper.Map<ViewRequest>(view);

            if (view.UserId == 0)
            {
                _reportAttrService.CheckUserCanCreateSharedViews(view.ReportType);
                request.UserId = null;
            }
            else
            {
                request.UserId = _authenticationService.UserId;
            }

            request.EntityId = null;
            return _viewCommandService.InsertView(request);
        }

        public void PutUpdateView([FromUri] long entityId, [FromBody] ViewModel view)
        {
            if (_reportAttrService.GetReportViewType(view.ReportType) == ReportViewType.ByEntity)
            {
                PutUpdateEntityView(entityId, view);
            }
            else
            {
                PutUpdateUserView(view);
            }
        }

        private void PutUpdateEntityView(long entityId, ViewModel view)
        {
            _reportAttrService.CheckUserCanAccessViewManager(view.ReportType);

            if (view.EntityId == 0)
            {
                view.EntityId = _entityService.CorporateEntityId();
                _reportAttrService.CheckUserCanCreateSharedViews(view.ReportType);
            }

            var request = _mapper.Map<ViewRequest>(view);
            request.UserId = null;
            _viewCommandService.UpdatetView(entityId, request);
        }

        private void PutUpdateUserView(ViewModel view)
        {
            _reportAttrService.CheckUserCanAccessViewManager(view.ReportType);

            var request = _mapper.Map<ViewRequest>(view);

            if (view.UserId == 0)
            {
                _reportAttrService.CheckUserCanCreateSharedViews(view.ReportType);
                request.UserId = null;
            }
            else
            {
                request.UserId = _authenticationService.UserId;
            }

            request.EntityId = null;
            _viewCommandService.UpdatetView(request);
        }

        public void DeleteView([FromUri] long entityId, int viewId, ReportType reportType)
        {
            if (_reportAttrService.GetReportViewType(reportType) == ReportViewType.ByEntity)
            {
                DeleteEntityView(entityId, viewId);
            }
            else
            {
                DeleteUserView(viewId);
            }
        }

        private void DeleteEntityView(long entityId, int viewId)
        {
            // Check user can access view before allowing deletion.
            var view = GetEntityView(entityId, viewId);
            if (view.EntityId != entityId)
            {
                _reportAttrService.CheckUserCanCreateSharedViews(view.ReportType);
            }
            _reportAttrService.CheckUserCanAccessViewManager(view.ReportType);

            _viewCommandService.DeleteView(entityId, viewId);
        }

        private void DeleteUserView(int viewId)
        {
            // Check user can access view before allowing deletion.
            var view = GetUserView(viewId);
            if (view.UserId == 0)
            {
                _reportAttrService.CheckUserCanCreateSharedViews(view.ReportType);
            }
            _reportAttrService.CheckUserCanAccessViewManager(view.ReportType);

            _viewCommandService.DeleteView(viewId);
        }

    }
}