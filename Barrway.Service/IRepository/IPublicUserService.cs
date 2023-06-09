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

        #region Business Webiste
        Task<AddUpdateDelete> CreatePublicUserAccount(PublicAccountModel model);
        Task<AddUpdateDelete> GetSinglePublicUserAccount(string UserId);

        Task<AddUpdateDelete> UpdatePublicUserProfilePic(PublicAccountModel model);

        Task<AddUpdateDelete> UpdatePublicUserProfileData(PublicUserProfileModel model, bool updatePassword = false);
        Task<AddUpdateDelete> EnrollPublicUserForCalendar(CalendarEnrollModel model);
        Task<AddUpdateDelete> AddFavoriteCalendar(FavoriteCalendarModel model);
        Task<AddUpdateDelete> RemoveFavoriteCalendar(FavoriteCalendarModel model);
        Task<AddUpdateDelete> GetAllEnrolledCompaniesData(string userEmail);
        Task<AddUpdateDelete> GetRecentlyBookedCalendars(string userEmail);
        Task<AddUpdateDelete> CheckSingleMyFavoriteCalendar(string userId, string CalendarCode = null);
        Task<AddUpdateDelete> GetMyFavoriteCalendars(GenerateDynamicFormData data, string userId, string CalendarCode = null);

        Task<AddUpdateDelete> GetAllEnrolledCalendarsData(string CompanyCode, string UserEmail, string filterDate = null, bool IsCustomInFilter = false);
        Task<AddUpdateDelete> GetFullCalendarEvents(string StartDate, string EndDate, string UserEmail);

        #endregion


    }
}
