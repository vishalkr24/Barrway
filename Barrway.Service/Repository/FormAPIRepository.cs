using Barrway.Service.IRepository;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using FormGeneratorDTOs.DTOs;
using Barrway.DTO.Common;
using Barrway.DTO.FormAPI;
using System.Web;
using Barrway.Utility.Common;
using System.Net.Security;

namespace Barrway.Service.Repository
{
    public class FormAPIRepository : IFormAPIRepository
    {
        
        private readonly RestClient _client;
        private readonly string _url = ConfigurationManager.AppSettings["webapibaseurl"];
        
        public FormAPIRepository()
        {
            _client = new RestClient(_url);
          
        }

        public async Task<AddUpdateDelete<IEnumerable<TabulatorConfigurationsDTO>>> manageTabulatorConfig(TabulatorConfigurationsDTO data)
        {
            try
            {
                var request = new RestRequest("api/FormAPI/manageTabulatorConfig", Method.Post) { RequestFormat = DataFormat.Json };
                request.AddBody(data);
                request.AddHeader("content-type", "application/json");
                ServicePointManager.ServerCertificateValidationCallback = new
RemoteCertificateValidationCallback
(
   delegate { return true; }
);
                var response = await _client.ExecuteAsync(request);
                if (response.Content != null)
                {
                    var result = JsonConvert.DeserializeObject<IEnumerable<TabulatorConfigurationsDTO>>(response.Content);
                    if (result != null)
                    {
                        return new AddUpdateDelete<IEnumerable<TabulatorConfigurationsDTO>>() { Status = true, Message = AppMessage.Success, Data = result };
                    }
                    else
                    {
                        return new AddUpdateDelete<IEnumerable<TabulatorConfigurationsDTO>>() { Status = false, Message = AppMessage.NotFound };
                    }
                }
                else
                {
                    return new AddUpdateDelete<IEnumerable<TabulatorConfigurationsDTO>>() { Status = false, Message = response.ErrorMessage };
                }
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete<IEnumerable<TabulatorConfigurationsDTO>>() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete<GetFormRecordListResponseModel>> GetFormRecordList(GenerateDynamicFormData data)
        {
            try
            {
                var dataDic = data.ToDictionary();
                dataDic.Add("query", data.Query);
                var request = new RestRequest("api/FormAPI/GetFormRecordList", Method.Post) { RequestFormat = DataFormat.Json };
                request.AddBody(dataDic);
                request.AddHeader("content-type", "application/json");
                ServicePointManager.ServerCertificateValidationCallback = new
RemoteCertificateValidationCallback
(
   delegate { return true; }
);
                var response = await _client.ExecuteAsync(request);
                if (response.Content != null)
                {
                    var result = JsonConvert.DeserializeObject<GetFormRecordListResponseModel>(response.Content);
                    if (result != null)
                    {
                        return new AddUpdateDelete<GetFormRecordListResponseModel>() { Status = true, Message = AppMessage.Success, Data = result };
                    }
                    else
                    {
                        return new AddUpdateDelete<GetFormRecordListResponseModel>() { Status = false, Message = AppMessage.NotFound };
                    }
                }
                else
                {
                    return new AddUpdateDelete<GetFormRecordListResponseModel>() { Status = false, Message = response.ErrorMessage };
                }
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete<GetFormRecordListResponseModel>() { Status = false, Message =ex.Message };
            }
        }

        public async Task<AddUpdateDelete<GenerateDynamicFormData>> GeneratedFormData(Form_DataTable data)
        {
            try
            {
                var request = new RestRequest("api/FormAPI/GeneratedFormData", Method.Post) { RequestFormat = DataFormat.Json };
                request.AddBody(data);
                request.AddHeader("content-type", "application/json");
                ServicePointManager.ServerCertificateValidationCallback = new
RemoteCertificateValidationCallback
(
   delegate { return true; }
);
                var response = await _client.ExecuteAsync(request);

                if (response.Content != null)
                {
                    var result = JsonConvert.DeserializeObject<GenerateDynamicFormData>(response.Content);
                    if (result != null)
                    {
                        return new AddUpdateDelete<GenerateDynamicFormData>() { Status = true, Message = AppMessage.Success, Data = result };
                    }
                    else
                    {
                        return new AddUpdateDelete<GenerateDynamicFormData>() { Status = false, Message = AppMessage.NotFound };
                    }
                }
                else
                {
                    return new AddUpdateDelete<GenerateDynamicFormData>() { Status = false, Message = response.ErrorMessage };
                }
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete<GenerateDynamicFormData>() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete<GenerateDynamicFormData>> BulkGeneratedFormData(Form_DataTable data)
        {
            try
            {
                var request = new RestRequest("api/FormAPI/BulkGeneratedFormData", Method.Post) { RequestFormat = DataFormat.Json };
                request.AddBody(data);
                request.AddHeader("content-type", "application/json");
                ServicePointManager.ServerCertificateValidationCallback = new
RemoteCertificateValidationCallback
(
   delegate { return true; }
);
                var response = await _client.ExecuteAsync(request);

                if (response.Content != null)
                {
                    var result = JsonConvert.DeserializeObject<GenerateDynamicFormData>(response.Content);
                    if (result != null)
                    {
                        return new AddUpdateDelete<GenerateDynamicFormData>() { Status = true, Message = AppMessage.Success, Data = result };
                    }
                    else
                    {
                        return new AddUpdateDelete<GenerateDynamicFormData>() { Status = false, Message = AppMessage.NotFound };
                    }
                }
                else
                {
                    return new AddUpdateDelete<GenerateDynamicFormData>() { Status = false, Message = response.ErrorMessage };
                }
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete<GenerateDynamicFormData>() { Status = false, Message = ex.Message };
            }
        }
        public async Task<AddUpdateDelete<GenerateDynamicFormData>> EditEventData(Form_DataTable data)
        {
            try
            {
                var request = new RestRequest("api/FormAPI/EditEventData", Method.Post) { RequestFormat = DataFormat.Json };
                request.AddBody(data);
                request.AddHeader("content-type", "application/json");
                ServicePointManager.ServerCertificateValidationCallback = new
RemoteCertificateValidationCallback
(
   delegate { return true; }
);
                var response = await _client.ExecuteAsync(request);
                if (response.Content != null)
                {
                    var result = JsonConvert.DeserializeObject<GenerateDynamicFormData>(response.Content);
                    if (result != null)
                    {
                        return new AddUpdateDelete<GenerateDynamicFormData>() { Status = true, Message = AppMessage.Success, Data = result };
                    }
                    else
                    {
                        return new AddUpdateDelete<GenerateDynamicFormData>() { Status = false, Message = AppMessage.NotFound };
                    }
                }
                else
                {
                    return new AddUpdateDelete<GenerateDynamicFormData>() { Status = false, Message = response.ErrorMessage };
                }
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete<GenerateDynamicFormData>() { Status = false, Message = ex.Message };
            }
        }


        public async Task<AddUpdateDelete<IEnumerable<FormCalenderReferrenceTable>>> ManageCalenderReferrence(FormCalenderReferrenceTable data)
        {
            try
            {
                var request = new RestRequest("api/FormAPI/ManageCalenderReferrenceNew", Method.Post) { RequestFormat = DataFormat.Json };
                request.AddBody(data);
                request.AddHeader("content-type", "application/json");
                ServicePointManager.ServerCertificateValidationCallback = new
RemoteCertificateValidationCallback
(
   delegate { return true; }
);
                var response = await _client.ExecuteAsync(request);
                if (response.Content != null)
                {
                    var result = JsonConvert.DeserializeObject<IEnumerable<FormCalenderReferrenceTable>>(response.Content);
                    if (result != null)
                    {
                        return new AddUpdateDelete<IEnumerable<FormCalenderReferrenceTable>>() { Status = true, Message = AppMessage.Success, Data = result };
                    }
                    else
                    {
                        return new AddUpdateDelete<IEnumerable<FormCalenderReferrenceTable>>() { Status = false, Message = AppMessage.NotFound };
                    }
                }
                else
                {
                    return new AddUpdateDelete<IEnumerable<FormCalenderReferrenceTable>>() { Status = false, Message = response.ErrorMessage };
                }
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete<IEnumerable<FormCalenderReferrenceTable>>() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete<List<FormTable>>> ManageForm(FormTable data)
        {
            try
            {
                var request = new RestRequest("api/FormAPI/ManageForm", Method.Post) { RequestFormat = DataFormat.Json };
                request.AddBody(data);
                request.AddHeader("content-type", "application/json");
                ServicePointManager.ServerCertificateValidationCallback = new
RemoteCertificateValidationCallback
(
   delegate { return true; }
);
                var response = await _client.ExecuteAsync(request);
                if (response.Content != null)
                {
                    var result = JsonConvert.DeserializeObject<List<FormTable>>(response.Content);
                    if (result != null)
                    {
                        return new AddUpdateDelete<List<FormTable>>() { Status = true, Data = result };
                    }
                    else
                    {
                        return new AddUpdateDelete<List<FormTable>>() { Status = false, Message = AppMessage.NotFound };
                    }
                }
                else
                {
                    return new AddUpdateDelete<List<FormTable>>() { Status = false, Message = response.ErrorMessage };
                }
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete<List<FormTable>>() { Status = false, Data = new List<FormTable>(),Message=ex.Message };
            }
        }
        public async Task<AddUpdateDelete<FormTable>> ManageFormApp(FormTable data)
        {
            try
            {
                var request = new RestRequest("api/FormAPI/ManageFormApp", Method.Post) { RequestFormat = DataFormat.Json };
                request.AddBody(data);
                request.AddHeader("content-type", "application/json");
                ServicePointManager.ServerCertificateValidationCallback = new
RemoteCertificateValidationCallback
(
   delegate { return true; }
);
                var response = await _client.ExecuteAsync(request);
                if (response.Content != null)
                {
                    var result = JsonConvert.DeserializeObject<FormTable>(response.Content);
                    if (result != null)
                    {
                        return new AddUpdateDelete<FormTable>() { Status = true, Data = result };
                    }
                    else
                    {
                        return new AddUpdateDelete<FormTable>() { Status = false, Message = AppMessage.NotFound };
                    }
                }
                else
                {
                    return new AddUpdateDelete<FormTable>() { Status = false, Message = response.ErrorMessage };
                }
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete<FormTable>() { Status = false,Message=ex.Message };
            }
        }

        public async Task<AddUpdateDelete<List<Form_Roles>>> ManageFormRoles(Form_Roles data)
        {
            try
            {
                var request = new RestRequest("api/FormAPI/ManageFormRoles", Method.Post) { RequestFormat = DataFormat.Json };
                request.AddBody(data);
                request.AddHeader("content-type", "application/json");
                ServicePointManager.ServerCertificateValidationCallback = new
RemoteCertificateValidationCallback
(
   delegate { return true; }
);
                var response = await _client.ExecuteAsync(request);
                if (response.Content != null)
                {
                    var result = JsonConvert.DeserializeObject<List<Form_Roles>>(response.Content);
                    if (result != null)
                    {
                        return new AddUpdateDelete<List<Form_Roles>>() { Status = true, Data = result };
                    }
                    else
                    {
                        return new AddUpdateDelete<List<Form_Roles>>() { Status = false, Message = AppMessage.NotFound };
                    }
                }
                else
                {
                    return new AddUpdateDelete<List<Form_Roles>>() { Status = false, Message = response.ErrorMessage };
                }
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete<List<Form_Roles>>() { Status = false, Data = new List<Form_Roles>(), Message = ex.Message };
            }
        }


        public async Task<AddUpdateDelete<List<Languages>>> ManageLanguages(Languages data)
        {
            try
            {
                var request = new RestRequest("api/FormAPI/ManageLanguages", Method.Post) { RequestFormat = DataFormat.Json };
                request.AddBody(data);
                request.AddHeader("content-type", "application/json");
                ServicePointManager.ServerCertificateValidationCallback = new
RemoteCertificateValidationCallback
(
   delegate { return true; }
);
                var response = await _client.ExecuteAsync(request);
                if (response.Content != null)
                {
                    var result = JsonConvert.DeserializeObject<List<Languages>>(response.Content);
                    if (result != null)
                    {
                        return new AddUpdateDelete<List<Languages>>() { Status = true, Data = result };
                    }
                    else
                    {
                        return new AddUpdateDelete<List<Languages>>() { Status = false, Message = AppMessage.NotFound };
                    }
                }
                else
                {
                    return new AddUpdateDelete<List<Languages>>() { Status = false, Message = response.ErrorMessage };
                }
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete<List<Languages>>() { Status = false, Message = ex.Message };
            }
        }

        public async Task<IEnumerable<FormCalenderReferrenceTable>> getEventDetails(FormCalenderReferrenceTable data)
        {
            try
            {
                var request = new RestRequest("api/FormAPI/getEventDetails", Method.Post) { RequestFormat = DataFormat.Json };
                request.AddBody(data);
                request.AddHeader("content-type", "application/json");
                ServicePointManager.ServerCertificateValidationCallback = new
RemoteCertificateValidationCallback
(
   delegate { return true; }
);
                var response = await _client.ExecuteAsync(request);
                if (response.Content != null)
                {
                    var result = JsonConvert.DeserializeObject<IEnumerable<FormCalenderReferrenceTable>>(response.Content);
                    if (result != null && result.Count() > 0)
                    {
                        return result;
                    }
                }
                else
                {
                    return new List<FormCalenderReferrenceTable>();
                }
                return new List<FormCalenderReferrenceTable>();
            }
            catch (Exception ex)
            {
                return new List<FormCalenderReferrenceTable>();
            }
        }

        public async Task<IEnumerable<calenderSettingsFormDetails>> getCalenderSettingsFormData(calenderSettingsFormDetails data)
        {
            try
            {
                var request = new RestRequest("api/FormAPI/getCalenderSettingsFormData", Method.Post) { RequestFormat = DataFormat.Json };
                request.AddBody(data);
                request.AddHeader("content-type", "application/json");
                ServicePointManager.ServerCertificateValidationCallback = new
RemoteCertificateValidationCallback
(
   delegate { return true; }
);
                var response = await _client.ExecuteAsync(request);
                if (response.Content != null)
                {
                    var result = JsonConvert.DeserializeObject<IEnumerable<calenderSettingsFormDetails>>(response.Content);
                    if (result != null && result.Count() > 0)
                    {
                        return result;
                    }
                }
                else
                {
                    return new List<calenderSettingsFormDetails>();
                }
                return new List<calenderSettingsFormDetails>();
            }
            catch (Exception ex)
            {
                return new List<calenderSettingsFormDetails>();
            }
        }

        public async Task<AxixColumnsResponseModel> getAxisColumns(calenderSettingsFormDetails data)
        {
            try
            {
                var request = new RestRequest("api/FormAPI/getAxisColumns", Method.Post) { RequestFormat = DataFormat.Json };
                request.AddBody(data);
                request.AddHeader("content-type", "application/json");
                ServicePointManager.ServerCertificateValidationCallback = new
RemoteCertificateValidationCallback
(
   delegate { return true; }
);
                var response = await _client.ExecuteAsync(request);
                if (response.Content != null)
                {
                    var result = JsonConvert.DeserializeObject<AxixColumnsResponseModel>(response.Content);
                    if (result != null)
                    {
                        return result;
                    }
                }
                else
                {
                    return null;
                }
                return null;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        
        public async Task<ReferalFormDataResponseModel> getReferralFormFields(Form_DataTable data)
        {
            try
            {
                var request = new RestRequest("api/FormAPI/getReferralFormFields", Method.Post) { RequestFormat = DataFormat.Json };
                request.AddBody(data);
                request.AddHeader("content-type", "application/json");
                ServicePointManager.ServerCertificateValidationCallback = new
RemoteCertificateValidationCallback
(
   delegate { return true; }
);
                var response = await _client.ExecuteAsync(request);
                if (response.Content != null)
                {
                    var result = JsonConvert.DeserializeObject<ReferalFormDataResponseModel>(response.Content);
                    if (result != null)
                    {
                        return result;
                    }
                }
                else
                {
                    return null;
                }
                return null;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<formDataHeadersList> getReferralFormFieldsAndData(Form_DataTable data)
        {
            try
            {
                var request = new RestRequest("api/FormAPI/getReferralFormFieldsAndData", Method.Post) { RequestFormat = DataFormat.Json };
                request.AddBody(data);
                request.AddHeader("content-type", "application/json");
                ServicePointManager.ServerCertificateValidationCallback = new
RemoteCertificateValidationCallback
(
   delegate { return true; }
);
                var response = await _client.ExecuteAsync(request);
                if (response.Content != null)
                {
                    var result = JsonConvert.DeserializeObject<formDataHeadersList>(response.Content);
                    if (result != null)
                    {
                        return result;
                    }
                }
                else
                {
                    return null;
                }
                return null;
            }
            catch (Exception ex)
            {
                return null;
            }
        }


        public async Task<IEnumerable<FormCalenderReferrenceTable>> ManageCalenderReferrenceNew(FormCalenderReferrenceTable data)
        {
            try
            {
                var request = new RestRequest("api/FormAPI/ManageCalenderReferrenceNew", Method.Post) { RequestFormat = DataFormat.Json };
                request.AddBody(data);
                request.AddHeader("content-type", "application/json");
                ServicePointManager.ServerCertificateValidationCallback = new
RemoteCertificateValidationCallback
(
   delegate { return true; }
);
                var response = await _client.ExecuteAsync(request);
                if (response.Content != null)
                {
                    var result = JsonConvert.DeserializeObject<IEnumerable<FormCalenderReferrenceTable>>(response.Content);
                    if (result != null)
                    {
                        return result;
                    }
                }
                else
                {
                    return new List<FormCalenderReferrenceTable>();
                }
                return new List<FormCalenderReferrenceTable>(); ;
            }
            catch (Exception ex)
            {
                return new List<FormCalenderReferrenceTable>(); ;
            }
        }

        public async Task<List<IDictionary<string,object>>> getJSONjsTree(int root, string title, string formId, string resourceActivityForm, string previousSelection, string selectedRoot, string query, string id, string companyCode, string calendarCode)
        {
            try
            {
                List<CustomFilter> customFilters = new List<CustomFilter>();
                customFilters.Add(new CustomFilter() { FieldName = "COMPANY_CODE", Value = companyCode });
                if (resourceActivityForm != "2304")
                {
                    customFilters.Add(new CustomFilter() { FieldName = "CALENDAR_CODE", Value = calendarCode });
                }
                
                JsonTreeModel jsonTree = new JsonTreeModel() { 
                root= root,
                title= title,
                formId= formId, 
                resourceActivityForm= resourceActivityForm,
                previousSelection= previousSelection,
                selectedRoot= selectedRoot,
                query= query,
                id= id,
                CustomFilters= customFilters
                };
               

                var request = new RestRequest($"api/FormAPI/getJSONjsTreeCustomFilter", Method.Post) { RequestFormat = DataFormat.Json };
                request.AddBody(jsonTree);
                request.AddHeader("content-type", "application/json");
                ServicePointManager.ServerCertificateValidationCallback = new
RemoteCertificateValidationCallback
(
   delegate { return true; }
);
                var response = await _client.ExecuteAsync(request);
                if (response.Content != null)
                {
                    var result = JsonConvert.DeserializeObject<List<IDictionary<string, object>>>(response.Content);
                    if (result != null && result.Count() > 0)
                    {
                        return result;
                    }
                }
                else
                {
                    return new List<IDictionary<string, object>>();
                }
                return new List<IDictionary<string, object>>();
            }
            catch (Exception ex)
            {
                return new List<IDictionary<string, object>>();
            }
        }
        public async Task<IEnumerable<FormListDataView>> GetFormList(FormListDataView data)
        {
            try
            {
                var request = new RestRequest("api/FormAPI/GetFormList", Method.Post) { RequestFormat = DataFormat.Json };
                request.AddBody(data);
                request.AddHeader("content-type", "application/json");
                ServicePointManager.ServerCertificateValidationCallback = new
RemoteCertificateValidationCallback
(
   delegate { return true; }
);
                var response = await _client.ExecuteAsync(request);
                if (response.Content != null)
                {
                    var result = JsonConvert.DeserializeObject<IEnumerable<FormListDataView>>(response.Content);
                    if (result != null)
                    {
                        return result;
                    }
                }
                else
                {
                    return new List<FormListDataView>();
                }
                return new List<FormListDataView>(); ;
            }
            catch (Exception ex)
            {
                return new List<FormListDataView>(); ;
            }
        }
        
       
        public async Task<formDataHeadersList> getReferralFormFieldsAndDataGET(int action, string formID, string formGroupKey)
        {
            try
            {
                var request = new RestRequest($"api/FormAPI/getReferralFormFieldsAndDataGET?action={action}&formID={formID}&formGroupKey={formGroupKey}", Method.Get);
                ServicePointManager.ServerCertificateValidationCallback = new
RemoteCertificateValidationCallback
(
   delegate { return true; }
);
                //request.AddHeader("content-type", "application/json");
                var response = await _client.ExecuteAsync(request);
                if (response.Content != null)
                {
                    var result = JsonConvert.DeserializeObject<formDataHeadersList>(response.Content);
                    if (result != null)
                    {
                        return result;
                    }
                }
                else
                {
                    return null;
                }
                return null; ;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
