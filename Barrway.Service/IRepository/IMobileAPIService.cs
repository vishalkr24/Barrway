
﻿using Barrway.DTO.APIModels.Calendar;

﻿using Barrway.DTO.APIModels.Booking;

using Barrway.DTO.APIModels.Company;
using Barrway.DTO.APIModels.Dashboard;
using Barrway.DTO.APIModels.SearchAPI;
using Barrway.DTO.Common;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using Barrway.DTO.APIModels.Account;

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

        Task<List<CompanyModel>> GetCompaniesSearchResult(CompanySearchApiModel data);
        Task<List<BlogModel>> GetBlogsSearchResult(BlogSearchAPIModel data);

        Task<Company> GetCompany(string CompanyCode);

        //Task<Dictionary<string, List<IDictionary<string, object>>>> GetCompanyCalendarPackages(string code);
        Task<companyPackage> GetCompanyCalendarPackages(string code);
        Task<List<ServiceList>> GetCompanyServiceList(string code);
        Task<List<PhotoGalleryModel>> GetCompanyPhotoGallery(string code);

        Task<List<IDictionary<string, object>>> GetEvents(CalendarRequestModel calendarRequest);

        
        Task<List<ModifiedMyBooking>> GetMyBookings(MyBookingApiModel model,string email, string Type, string EventId = null);

        Task<List<FavouriteCalendar>> GetMyFavoriteCalendars(FavouriteClanderData data, string userId);

        Task<List<MyWalletCalander>> GetMyWalletCalendars(MyWalletClanderApiModel data, string userName);

        Task<List<MyWalletCompany>> GetMyWalletCompanyList(string userName);

        Task<List<PaymentHistoryApiModel>> PaymentHistory(PaymentHistorySearchApiModel data, string userName);

        Task<List<MyFavouriteCompany>> GetMyfavoriteCompanyList(string userName);

        Task<List<MyFavouriteCompany>> GetPaymentCompanyList(string userName);

        Task<List<object>> GetPaymentYearList(string userName);
        Task<AddUpdateDeleteAPI> AddToFavoriteCalendar(FavoriteCalendarViewModel model, string UserId);

        Task<AddUpdateDelete> RemoveFavoriteCalendar(FavoriteCalendarViewModel model, string UserId);

        Task<FavouriteCalendarDetails> CalendarDtails(FavoriteCalendarViewModel model, string UserId);
        Task<EventDetails> GetSingleEventDetails(string EventId);       
        Task<ModifiedMyBooking> GetMyBookingsDetails(string email, string EventId = null);

        Task<UserProfile> GetUserProfileDetails(string UserId);

        Task<AddUpdateDelete> SessionReview(SessionReview model);

        Task<AddUpdateDelete> CancelBooking(string SLOT, string USER_EMAIL, string USER_ID);

        Task<AddUpdateDelete> GetUserCoinBalance(string UserId, string CompanyCode, string CalendarCode);

        Task<AddUpdateDelete> GetCalendarDetails(string calendarCode, string UserId = null);

        Task<AddUpdateDelete> GetBookingsForThisMonth(string CompanyCode, string SlotId);

        Task<List<IDictionary<string, object>>> GetUserEvents(UserEventsViewmodel model, string userEmail);

        Task<AddUpdateDelete<BlogDetailModel>> GetBlogdetail(int BlogId);

        Task<AddUpdateDelete> UpdateUserProfileData(UpdateUserProfileModel model);

        Task<AddUpdateDelete> changespassword(userPassword model, string USER_ID);




    }
}
