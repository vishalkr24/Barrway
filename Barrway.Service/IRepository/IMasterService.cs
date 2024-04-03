using Barrway.DTO.BusinessModels;
using Barrway.DTO.Common;
using FormGeneratorDTOs.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.Service.IRepository
{
    public interface IMasterService
    {
        Task<AddUpdateDelete<List<IDictionary<string, object>>>> GetLocationMasterList(GenerateDynamicFormData data, string companyCode, string calendarCode);
        Task<AddUpdateDelete<List<IDictionary<string, object>>>> GetServiceMasterList(GenerateDynamicFormData data, string companyCode, string calendarCode);
        Task<AddUpdateDelete<List<IDictionary<string, object>>>> GetServiceProviderMasterList(GenerateDynamicFormData data, string companyCode, string calendarCode); 
        Task<AddUpdateDelete<List<IDictionary<string, object>>>> GetParticipantMasterList(GenerateDynamicFormData data, string companyCode, string calendarCode);
        Task<AddUpdateDelete<List<IDictionary<string, object>>>> GetSchedularFormList(GenerateDynamicFormData data, string companyCode, string calendarCode);
        Task<AddUpdateDelete<List<IDictionary<string, object>>>> GetTransactionMasterList(GenerateDynamicFormData data, string companyCode, string calendarCode);
        Task<AddUpdateDelete<List<IDictionary<string, object>>>> GetClientPaymentHistory(GenerateDynamicFormData data, string companyCode, string calendarCode);
        Task<AddUpdateDelete> GetPaymentReceiptData(string Id);
        Task<AddUpdateDelete> GetSingleClientPaymentHistory(string LedgerId);
        Task<AddUpdateDelete> GetSingleSlotDetailsByTransactionId(string TransactionId);
        Task<AddUpdateDelete> SendCalendarFile(string email, string TransactionId);

        Task<AddUpdateDelete<List<IDictionary<string, object>>>> GetSingleTransactionMaster(string TransactionId);
        
        Task<AddUpdateDelete<List<IDictionary<string, object>>>> GetAllBlogPosts(GenerateDynamicFormData data);
        Task<AddUpdateDelete> GetMasterSearchResult(string keyword);
        Task<AddUpdateDelete<List<IDictionary<string, object>>>> GetAllFeaturedCompany(GenerateDynamicFormData data);
        Task<AddUpdateDelete> GetSingleBlogPost(string NewsId);
        Task<AddUpdateDelete> GetCompanyCalendarPackages(string CompanyCode);
        Task<AddUpdateDelete> GetSingleCalendarPackage(string PackageId);
        Task<AddUpdateDelete> GetSingleCompanyPackage(string PackageId);
        Task<AddUpdateDelete> CreateOrder(OrderModel model);
        Task<AddUpdateDelete> CreateBusinessOrder(BusinessOrderModel model);
        Task<AddUpdateDelete> CreatePaymentTracker(PaymentTrackerModel model);
        Task<AddUpdateDelete> CreateLedgerEntry(LedgerModel model);
        Task<AddUpdateDelete> CreatePaymentHistory(PaymentHistoryModel model);
        Task<AddUpdateDelete> CreateCompanyPaymentHistory(CompanyPaymentHistoryModel model);
        Task<AddUpdateDelete<List<IDictionary<string, object>>>> GetAllBlog(Pagination data);
        Task<AddUpdateDelete> GetAllSubcategory();
        Task<AddUpdateDelete<List<IDictionary<string, object>>>> GetAllCompany_SubCategoryWise(Pagination data);

        //GetAllFeaturedCompany_SubCategoryWise(Pagination data)

    }
}
