
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using FormGeneratorDTOs.DTOs;
using Barrway.DTO.Common;
using Barrway.DTO.FormAPI;

namespace Barrway.Service.IRepository
{
    public interface IFormAPIRepository
    {
        Task<AddUpdateDelete<IEnumerable<TabulatorConfigurationsDTO>>> manageTabulatorConfig(TabulatorConfigurationsDTO data);
        Task<AddUpdateDelete<GetFormRecordListResponseModel>> GetFormRecordList(GenerateDynamicFormData data);
        Task<AddUpdateDelete<GenerateDynamicFormData>> GeneratedFormData(Form_DataTable data);
        Task<AddUpdateDelete<List<FormTable>>> ManageForm(FormTable data);
        Task<AddUpdateDelete<List<Languages>>> ManageLanguages(Languages data);
        Task<AddUpdateDelete<GenerateDynamicFormData>> EditEventData(Form_DataTable data);
        Task<AddUpdateDelete<IEnumerable<FormCalenderReferrenceTable>>> ManageCalenderReferrence(FormCalenderReferrenceTable data);
        Task<IEnumerable<FormCalenderReferrenceTable>> getEventDetails(FormCalenderReferrenceTable data);
        Task<IEnumerable<calenderSettingsFormDetails>> getCalenderSettingsFormData(calenderSettingsFormDetails data);
    }
}
