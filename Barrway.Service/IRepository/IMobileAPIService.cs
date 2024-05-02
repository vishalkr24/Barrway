
﻿using Barrway.DTO.APIModels.Calendar;

﻿using Barrway.DTO.APIModels.Booking;

using Barrway.DTO.APIModels.Company;
using Barrway.DTO.APIModels.Dashboard;
using Barrway.DTO.APIModels.SearchAPI;
using Barrway.DTO.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Barrway.Service.IRepository
{
    public interface IMobileAPIService
    {
        Task<SearchFilterModel> GetSearchFilter();
        Task<List<CategoryModel>> GetCategoryList();
        Task<List<RootCalendarModel>> GetDashboardCalendarList();
        Task<List<CompanyModel>> GetFeatureCompanies();
        Task<List<BlogModel>> GetFeatureBlogs();
        Task<List<CalendarModel>> GetCalendarsSearchResult(SearchAPIModel data, List<string> filters = null);

        Task<List<CompanyModel>> GetCompaniesSearchResult(SearchAPIModel data);
        Task<List<BlogModel>> GetBlogsSearchResult(SearchAPIModel data);

        Task<Company> GetCompany(string CompanyCode);

        //Task<Dictionary<string, List<IDictionary<string, object>>>> GetCompanyCalendarPackages(string code);
        Task<companyPackage> GetCompanyCalendarPackages(string code);
        Task<List<ServiceList>> GetCompanyServiceList(string code);
        Task<List<PhotoGalleryModel>> GetCompanyPhotoGallery(string code);

        Task<List<IDictionary<string, object>>> GetEvents(CalendarRequestModel calendarRequest);

        
        Task<List<ModifiedMyBooking>> GetMyBookings(string email, string Type, string EventId = null);




    }
}
