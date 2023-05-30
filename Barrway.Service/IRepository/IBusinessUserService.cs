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

namespace Barrway.Service.IRepository
{
    public interface IBusinessUserService
    {

        #region Business Webiste
        Task<AddUpdateDelete> CreateBusinessWebsite(BusinessAccountWebsiteModel model);
        Task<AddUpdateDelete> GetSingleBusinessWebsite(string UserId);
        #endregion
        

        #region Photo Album

        Task<AddUpdateDelete> GetCompanyPhotoAlbumByCompanyId(string CompanyId, bool checkVisibility = false);
        Task<AddUpdateDelete> AddCompanyPhotoAlbum(CompanyPhotoAlbumModel model);

        #endregion


        #region Business Company
        Task<AddUpdateDelete> GetSingleCompanyById(string Id);
        Task<AddUpdateDelete> GetAllCompaniesByUserId(string UserId); 
        Task<AddUpdateDelete> AddCompany(BusinessCompanyModel model, string UserId, bool IsDefault = false);
        Task<AddUpdateDelete> UpdateCompanyService(BusinessCompanyModel model);
        Task<AddUpdateDelete> GetSingleCompanyByCompanyCode(string CompanyCode);
        Task<AddUpdateDelete> GetDefaultCompanyByBusinessId(string BusinessAccountId);
        Task<AddUpdateDelete> GetDefaultCompanyByUserId(string UserId);
        Task<AddUpdateDelete> UpdateBusinessCompanyProfileStatusByUserId(string userId, bool isActive);
        Task<AddUpdateDelete> UpdateBusinessCompanyProfileStatusByBusinessId(string businessId, bool isActive);
        Task<AddUpdateDelete> getCompanyDashboardData(string CompanyCode);
        Task<AddUpdateDelete> getCompanyCalendarDashboardData(string CompanyCode, string CalendarCode);
        #endregion


        #region Business Calendar

        Task<AddUpdateDelete> AddCalendar(BusinessCalendarModel model, string UserId, CalendarControlModel calendarControlModel);
        Task<AddUpdateDelete> GetSingleCalendarById(string Id);
        Task<AddUpdateDelete> GetCompanyCalendarByCompanyId(string CompanyId);
        Task<AddUpdateDelete> GetMarcketPlaceCompanyCalendarByCompanyId(string CompanyId);
        Task<AddUpdateDelete> GetCompanyCalendars(GenerateDynamicFormData data, string CompanyId);

        Task<AddUpdateDelete> GetCalendarUpcomingBookings(GenerateDynamicFormData data, string CompanyCode, string CalendarCode);

        Task<AddUpdateDelete> AddSchedularForm(SchedularFormModel model, string formGroupKey);

        Task<AddUpdateDelete> AddCalendarEventSlot(CalendarFormModel model, string formGroupKey);

        Task<AddUpdateDelete> AddCalendarReference(CalendarReferenceModel model);

        #endregion


        #region Company Suscription

        Task<AddUpdateDelete> GetAllSubscriptionPlansForBusiness();

        Task<AddUpdateDelete> GetCompanyPaymentHistory(GenerateDynamicFormData data, string CompanyId);

        Task<AddUpdateDelete> GetCompanyFreeSubscriptionDetails(string CompanyId);

        Task<AddUpdateDelete> GetCompanyActiveSubscriptionDetails(string CompanyId);

        Task<AddUpdateDelete> AddCompanySubscriptionDetails(CompanySubscriptionDetailsModel model);

        #endregion


        Task<AddUpdateDelete> GetCalendarDetails(string calendarCode);

    }
}
