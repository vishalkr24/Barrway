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
        Task<AddUpdateDelete<List<IDictionary<string, object>>>> GetSingleTransactionMaster(string TransactionId);
        
        Task<AddUpdateDelete<List<IDictionary<string, object>>>> GetAllBlogPosts(GenerateDynamicFormData data);
        Task<AddUpdateDelete<List<IDictionary<string, object>>>> GetAllFeaturedCompany(GenerateDynamicFormData data);
        Task<AddUpdateDelete> GetSingleBlogPost(string NewsId);
        

    }
}
