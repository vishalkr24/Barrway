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
        Task<AddUpdateDelete> AddBusinessAssignedUser(BusinessAssignedUsersModel model);
        Task<AddUpdateDelete> UpdateAdmin(string NewSuperUserId, string oldSuperUserId, string BusinessAccountId);
        Task<AddUpdateDelete> UpdateAssignedCompany(UserAssignedCompanyModel data, string UserId);
        Task<AddUpdateDelete> DeleteAdmin(string Id);
        Task<AddUpdateDelete> GetSingleBusinessWebsite(string UserId);
        Task<AddUpdateDelete> GetAllAssignedBusinessList(string UserId);
        Task<AddUpdateDelete> GetSuperAssignedBusinessList(string UserId);
        Task<AddUpdateDelete> SendEmailInvite(BusinessUserInvitationModel inviteModel);
        Task<AddUpdateDelete> ValidateInvitationTokenAndUser(string Token, string UserId);
        Task<AddUpdateDelete> UpdateInvitationStatus(string Token, string status);
        Task<AddUpdateDelete> GetAllRecentInvites(GenerateDynamicFormData data, string UserId);
        
        #endregion


        #region Photo Album

        Task<AddUpdateDelete> GetCompanyPhotoAlbumByCompanyId(string CompanyId, bool checkVisibility = false);
        Task<AddUpdateDelete> AddCompanyPhotoAlbum(CompanyPhotoAlbumModel model);

        Task<AddUpdateDelete> GetSingleCompanyPhotoAlbum(string Id);
        Task<AddUpdateDelete> DeleteSingleCompanyPhotoAlbum(string Id);
        #endregion


        #region Business Company
        Task<AddUpdateDelete> GetSingleCompanyById(string Id);
        Task<AddUpdateDelete> GetAllCompaniesByUserId(string UserId);
        Task<AddUpdateDelete> GetAllCompaniesMasterByUserId(GenerateDynamicFormData data, string UserId);
        Task<AddUpdateDelete> GetAllBusinessAssignedUsers(GenerateDynamicFormData data, string CompanyId);
        Task<AddUpdateDelete> GetSingleBusinessUserMaster(GenerateDynamicFormData data, string UserId);
        Task<AddUpdateDelete> AddCompany(BusinessCompanyModel model, string UserName, string UserId, bool IsDefault = false);
        Task<AddUpdateDelete> UpdateCompanyService(BusinessCompanyModel model);
        Task<AddUpdateDelete> UpdateTemplatePalette(BusinessCompanyModel model);
        Task<AddUpdateDelete> GetSingleCompanyByCompanyCode(string CompanyCode);
        Task<AddUpdateDelete> GetDefaultCompanyByUserId(string UserId);
        Task<AddUpdateDelete> UpdateBusinessCompanyProfileStatusByUserId(string userId, bool isActive);
        Task<AddUpdateDelete> getCompanyDashboardData(string CompanyCode, string UserId);
        Task<AddUpdateDelete> getAllAssignedCompanies(string AssignedId, string UserId);
        Task<AddUpdateDelete> getCompanyCalendarDashboardData(string CompanyCode, string CalendarCode);
        #endregion


        #region Business Calendar

        Task<AddUpdateDelete> AddCalendar(BusinessCalendarModel model, string UserId, CalendarControlModel calendarControlModel);

        
        Task<AddUpdateDelete> GetAllCalendarTemplatesByCategory(string CalendarCategoryId);

        Task<AddUpdateDelete> GetSingleCalendarById(string Id);
        Task<AddUpdateDelete> UpdateCalendarType(string CalendarCode, string CalendarType);
        Task<AddUpdateDelete> UpdateStaffServiceMapping(List<StaffServiceMappingModel> model);
        Task<AddUpdateDelete> GetStaffServiceMappingData(string CalendarCode);
        Task<AddUpdateDelete> GetCompanyCalendarByCompanyId(string CompanyId);
        Task<AddUpdateDelete> GetMarcketPlaceCompanyCalendarByCompanyId(string CompanyId);
        Task<AddUpdateDelete> GetCompanyCalendars(GenerateDynamicFormData data, string CompanyId);
        Task<AddUpdateDelete> GetCompanyCalendarTemplates(GenerateDynamicFormData data, string CompanyCode);

        Task<AddUpdateDelete> GetCalendarUpcomingBookings(GenerateDynamicFormData data, string CompanyCode, string CalendarCode);
        Task<AddUpdateDelete> GetSchedule(string ScheduleId, string UserId);

        Task<AddUpdateDelete> AddSchedularForm(SchedularFormModel model, string formGroupKey);

        Task<AddUpdateDelete> AddQueueSession(List<QueueMasterModel> queues, List<SessionMasterModel> sessions);

        Task<AddUpdateDelete> CheckOverlapingSlots(SchedularFormModel model);

        Task<AddUpdateDelete> AddCalendarEventSlot(CalendarFormModel model, string formGroupKey);

        Task<AddUpdateDelete> AddCalendarReference(CalendarReferenceModel model);

        Task<AddUpdateDelete> UpdateTransactionAttendance(string TransactionId, bool IsPresent = false);

        Task<AddUpdateDelete> UpdateTransactionAttendance(List<BulkAttendanceModel> BulkAttendance, string userId);
        #endregion


        #region Company Suscription

        Task<AddUpdateDelete> GetAllSubscriptionPlansForBusiness();

        Task<AddUpdateDelete> GetCompanyPaymentHistory(GenerateDynamicFormData data, string CompanyId);

        Task<AddUpdateDelete> GetCompanyFreeSubscriptionDetails(string CompanyId);

        Task<AddUpdateDelete> GetFreeCompanyPackage();

        Task<AddUpdateDelete> GetCompanyActiveSubscriptionDetails(string Id, bool isCompanyCode = false);

        Task<AddUpdateDelete> GetSessionsForThisMonth(string CompanyCode);

        Task<AddUpdateDelete> GetSessionsForThisMonthCalendarWise(string CompanyCode);

        Task<AddUpdateDelete> CheckCreditLimit(string CompanyCode);

        Task<AddUpdateDelete> GetBookingsForThisMonth(string CompanyCode, string SlotId);


        Task<AddUpdateDelete> AddCompanySubscriptionDetails(CompanySubscriptionDetailsModel model);

        #endregion


        Task<AddUpdateDelete> GetCalendarDetails(string calendarCode, string UserId = null);

    }
}
