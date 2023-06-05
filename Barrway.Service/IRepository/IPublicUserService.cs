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
        Task<AddUpdateDelete> GetAllEnrolledCompaniesData(string userEmail);
        Task<AddUpdateDelete> GetRecentlyBookedCalendars(string userEmail);
        Task<AddUpdateDelete> GetAllEnrolledCalendarsData(string CompanyCode, string UserEmail, bool IsCustomInFilter = false);
        #endregion


    }
}
