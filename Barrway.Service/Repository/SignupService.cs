using Dapper;
using Barrway.Service.IRepository;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormGeneratorDTOs.DTOs;
using Barrway.DTO.Common;
using Barrway.Utility.Common;

namespace Barrway.Service.Repository
{
    public class SignupService: ISignupService
    {
        private readonly IFormAPIRepository formAPIRepository;

        public SignupService(IFormAPIRepository formAPIRepository)
        {
            this.formAPIRepository = formAPIRepository;
        }

        public async Task<AddUpdateDelete> RegisterUser(IDictionary<string, object> keyValuePairs)
        {
            try
            {
                Form_DataTable data = new Form_DataTable();
                data.action = (int)FormAction.Save;
                data.formId = (int)FormSetting.USER_MASTER;

                data.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(keyValuePairs);
                data.formGroupKey = Guid.NewGuid().ToString();
                var formResult = (await formAPIRepository.GeneratedFormData(data)).Data;



                if (formResult.res == 1)
                {
                    return new AddUpdateDelete() { Message = AppMessage.Success, Status = true, Data = formResult.Id.ToString() };
                }
                else
                {
                    return new AddUpdateDelete() { Message = formResult.Message, Status = false };
                }
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Message = ex.Message, Status = false };
            }



        }

    }
}
