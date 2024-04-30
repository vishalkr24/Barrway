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
        Task<AddUpdateDelete> UpdateInvitationStatus(string Token, string status, string UserId);
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

        Task<AddUpdateDelete> AddCalendar(BusinessCalendarModel model, string UserId);

        
        Task<AddUpdateDelete> GetAllCalendarTemplatesByCategory(string CalendarCategoryId);

        Task<AddUpdateDelete> GetSingleCalendarById(string Id);
        Task<AddUpdateDelete> UpdateCalendarType(string CalendarCode, string CalendarType);

        Task<AddUpdateDelete> PublishCalendar(string CalendarCode, string UserId);
        Task<AddUpdateDelete> UpdateStaffServiceMapping(List<StaffServiceMappingModel> model);
        Task<AddUpdateDelete> GetStaffServiceMappingData(string CalendarCode);
        Task<AddUpdateDelete> GetCompanyCalendarByCompanyId(string CompanyId);
        Task<AddUpdateDelete> GetMarcketPlaceCompanyCalendarByCompanyId(string CompanyId);
        Task<AddUpdateDelete> GetCompanyCalendars(GenerateDynamicFormData data, string CompanyId);
        Task<AddUpdateDelete> GetCompanyCalendarTemplates(GenerateDynamicFormData data, string CompanyCode);

        Task<AddUpdateDelete> GetCalendarUpcomingBookings(GenerateDynamicFormData data, string CompanyCode, string CalendarCode);
        Task<AddUpdateDelete> GetSchedule(string ScheduleId, string UserId);
        Task<AddUpdateDelete> GetSchedule(string CompanyCode, string CalendarCode, string UserId);
        Task<AddUpdateDelete> GetCourseEvents(string ServiceId, string UserEmail);

        Task<AddUpdateDelete> AddSchedularForm(SchedularFormModel model, string formGroupKey);

        Task<AddUpdateDelete> DeleteSchedule(int ScheduleId, bool deleteForm);

        Task<AddUpdateDelete> AddQueueSession(List<QueueMasterModel> queues, List<SessionMasterModel> sessions, string ScheduleId);
        Task<AddUpdateDelete> UpdateQueueDetails(List<QueueMasterModel> queues);

        Task<AddUpdateDelete> UpdateSessionDetails(List<SessionMasterModel> sessions);

        Task<AddUpdateDelete> GetQueueAndSession(string CompanyCode, string CalendarCode);

        Task<AddUpdateDelete> CheckOverlapingSlots(SchedularFormModel model);
        Task<AddUpdateDelete> CheckRoomRentalOverlapingSlots(SchedularFormModel model);
        

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

        Task<AddUpdateDelete> GetSessionsForThisMonth(string CompanyCode, string CalendarCode);

        Task<AddUpdateDelete> GetSessionsForThisMonthCalendarWise(string CompanyCode);

        Task<AddUpdateDelete> CheckCreditLimit(string CompanyCode);

        Task<AddUpdateDelete> GetBookingsForThisMonth(string CompanyCode, string SlotId);


        Task<AddUpdateDelete> AddCompanySubscriptionDetails(CompanySubscriptionDetailsModel model);

        #endregion


        Task<AddUpdateDelete> GetCalendarDetails(string calendarCode, string UserId = null);

        Task<AddUpdateDelete> GetServiceList(string calendarCode, string CompanyCode);

        bool CheckCmpanyUrlExists(string PageName, string CompanyCode);

        Task<AddUpdateDelete> GetCompanyCodeByPageUrl(string PageUrl);

        Task<AddUpdateDelete> getCalendarUploadFiles(int eventId);
        Task<AddUpdateDelete> updateCalendarUploadFiles(int eventId, string downloadable_attachment, string download_file_list);
        Task<AddUpdateDelete> updateCalendarOtherField(int eventId, Dictionary<string, object> data);
        Task<AddUpdateDelete> updateSchedularCalendarOtherField(int schedularId, SchedularFormModel schedularForm);


        Task<AddUpdateDelete> GetFeaturedBlogs();
        Task<AddUpdateDelete> GetBlogs();
        //Task<AddUpdateDelete> GetBlogsTags();
        Task<Resultdata> GetAllBlogsTags();
        Task<AddUpdateDelete> GetBlogbyId(string Id);
        Task<AddUpdateDelete> GetEnrollUserDetails(int eventId, string email);
        Task<AddUpdateDelete> updateAssesstmentUploadFiles(int transactionId, string downloadable_attachment, string download_file_list);

        Task<AddUpdateDelete> GetCalanderSubCategoryNameList(string CompanyCode);
        Task<AddUpdateDelete> GetCalanderCategoryNameList(string CompanyCode);

        Task<AddUpdateDelete> GetCompanyServiceList(string CompanyCode);
    }
}
