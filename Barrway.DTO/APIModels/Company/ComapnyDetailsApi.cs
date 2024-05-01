using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.APIModels.Company
{
    public class ComapnyInformationApi<T> where T : class
    {
        public bool Status { get; set; }
        public string Message { get; set; }
        public object Data { get; set; }
    }


    public class CompanyServiceDetails
    {
        public CompanyServiceDetails()
        {
            SERVICE_LIST = new List<ServiceList>();
        }
        public string SERVICE_DESC { get; set; }

        public List<ServiceList> SERVICE_LIST { get; set; }
    }


    public class ServiceList
    {
        public int Id { get; set; }
        public string ACTIVITY_NAME { get; set; }
        public string DESCRIPTION { get; set; }
        public decimal REVIEW_SCORE { get; set; }
    }

    public class ServiceString
    {
        public int Id { get; set; }
        public string ACTIVITY_NAME { get; set; }
        public string DESCRIPTION { get; set; }
    }

    public class companyPackage
    {
        public List<CalanderService> SERVICE_LIST { get; set; }
        public List<Packagemaster> PackageList { get; set; }
    }


    public class Packagemaster
    {
        public int Id { get; set; }
        public string formGroupKey { get; set; }
        public int formID { get; set; }
        public int userID { get; set; }
        public string Current_Status { get; set; }
        public string cycle { get; set; }
        public int MasterFormID { get; set; }
        public string MasterFormRow { get; set; }
        public string formRecordOrder { get; set; }
        public string formRecordStatus { get; set; }
        public string ApprovalStatus { get; set; }
        public string text_1688647226990 { get; set; }
        public string created_at { get; set; }
        public string updated_at { get; set; }
        public string created_by { get; set; }
        public string updated_by { get; set; }
        public string CALENDAR_CODE { get; set; }
        public string COMPANY_CODE { get; set; }
        public string PACKAGE_NAME { get; set; }
        public string PACKAGE_PRICE { get; set; }
        public string PRICE_PER_SLOT { get; set; }
        public string PACKAGE_COIN { get; set; }
        public string PACKAGE_SEQUENCE { get; set; }
        public string PACKAGE_DESCRIPTION { get; set; }
        public string IS_ACTIVE { get; set; }
        public string CREDIT_EXPIRE_DATE { get; set; }
        public string VALIDITY_IN_MONTHS { get; set; }
    }

    public class CalanderService
    {
        public string CALENDAR_SUB_CATEGORY_NAME { get; set; }
        public string CALENDAR_NAME { get; set; }
        public string CALENDAR_CODE { get; set; }
        public string CALENDAR_PHOTO_PATH { get; set; }
        public string ActivityName { get; set; }
    }






}
