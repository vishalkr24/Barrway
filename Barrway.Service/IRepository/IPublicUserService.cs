using Barrway.DTO.Common;
using Barrway.DTO.BusinessModels;
using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Barrway.DTO.AuthViewModel;
using FormGeneratorDTOs.DTOs;
using Barrway.DTO.PublicModels;
using Barrway.DTO.UserAdminModels;
using Barrway.DTO.MarketplaceModels;

namespace Barrway.Service.IRepository
{
    public interface IPublicUserService
    {
        Task<AddUpdateDelete> CreatePublicUserAccount(PublicAccountModel model);
        Task<AddUpdateDelete> GetSingleEventDetails(string EventId);
        Task<AddUpdateDelete> GetSingleServiceDetails(string EventId);
        Task<AddUpdateDelete> GetSinglePublicUserAccount(string UserId);
        Task<AddUpdateDelete> UpdatePublicUserProfilePic(PublicAccountModel model);
        Task<AddUpdateDelete> UpdatePublicUserProfileData(PublicUserProfileModel model, bool updatePassword = false);
        Task<AddUpdateDelete> EnrollPublicUserForCalendar(CalendarEnrollModel model, bool isServiceType = false, string PaymentId = null);
        Task<AddUpdateDelete> EnrollCourse(CalendarEnrollModel model, bool isServiceType = false, string PaymentId = null);
        Task<AddUpdateDelete> CancelPublicUserBooking(CalendarEnrollModel model);
        Task<AddUpdateDelete> AddSessionReview(SessionReviewModel model);
        Task<AddUpdateDelete> EnrollParticipantForCalendar(CalendarFormModel model, string UserId, string UserEmail);
        Task<AddUpdateDelete> AddFavoriteCalendar(FavoriteCalendarModel model);
        Task<AddUpdateDelete> RemoveFavoriteCalendar(FavoriteCalendarModel model);
        Task<AddUpdateDelete> GetAllEnrolledCompaniesData(string userEmail, bool IsDistinct = true);
        Task<AddUpdateDelete<List<IDictionary<string, object>>>> GetMyAttendanceList(GenerateDynamicFormData data, string userEmail);
        Task<AddUpdateDelete> GetRecentlyBookedCalendars(string userEmail, string userId);
        Task<AddUpdateDelete> CheckSingleMyFavoriteCalendar(string userId, string CalendarCode = null);
        Task<AddUpdateDelete> GetMyFavoriteCalendars(GenerateDynamicFormData data, string userId, string CalendarCode = null);
        Task<AddUpdateDelete> GetUserBCoinMaster(GenerateDynamicFormData data, string userName, string userEmail);
        Task<AddUpdateDelete> GetUserCoinBalance(string UserId);
        Task<AddUpdateDelete> CheckAdditionalFormDetails(string CalendarCode, string UserId);
        Task<AddUpdateDelete> GetUserCoinBalance(string UserId, string CompanyCode, string CalendarCode);
        Task<AddUpdateDelete> GetCurrentPackageDetails(string UserId, string CompanyCode, string CalendarCode, string ServiceId, CommonTimeObject TimeRange);
        Task<AddUpdateDelete> GetAllEnrolledCalendarsData(string CompanyCode, string UserEmail, string filterDate = null, bool IsCustomInFilter = false);
        Task<AddUpdateDelete> GetAlreadyEnrolledEvents(string CompanyCode, string UserEmail, string filterDate);
        Task<AddUpdateDelete> GetFullCalendarEvents(string StartDate, string EndDate, string UserEmail);
        Task<AddUpdateDelete> GetMyUpcomingBookings(string UserEmail);
        Task<AddUpdateDelete> BookingServiceEvent(RequestEventViewModel eventModal, string userName, string UserId, string PaymentId = null);
        Task<AddUpdateDelete> CreateDynamicFormEntry(List<IDictionary<string, string>> data, string formId, string UserId, string CalendarCode);
        Task<AddUpdateDelete> MarkPresent(string EventId, string UserEmail);
        Task<AddUpdateDelete> MarkPresentByCompany(string TransactionId, string EventId);
    }
}
