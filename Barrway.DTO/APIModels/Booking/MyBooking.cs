using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.APIModels.Booking
{

    public class MyBooking
    {
        public int ROWNUMBER { get; set; }
        public long total_records { get; set; }
        public int size { get; set; }
        public int page { get; set; }
        public int Id { get; set; }
        public string formGroupKey { get; set; }
        public int formID { get; set; }
        public int userID { get; set; }
        public string Current_Status { get; set; }
        public int cycle { get; set; }
        public int MasterFormID { get; set; }
        public string MasterFormRow { get; set; }
        public int formRecordOrder { get; set; }
        public int formRecordStatus { get; set; }
        public object ApprovalStatus { get; set; }
        public string COMPANY_CODE { get; set; }
        public string CALENDAR_CODE { get; set; }
        public object hidden_fullcalendar { get; set; }
        public object schedulerformgroupkey { get; set; }
        public string title { get; set; }
        public DateTime start { get; set; }
        public DateTime end { get; set; }
        public string allDay { get; set; }
        public string resources { get; set; }
        public string activities { get; set; }
        public string description { get; set; }
        public object color { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public object created_by { get; set; }
        public object updated_by { get; set; }
        public object resForm_2304 { get; set; }
        public object actFormID { get; set; }
        public object parentID { get; set; }
        public object seperatedFormIDs { get; set; }
        public object seperatedTitles { get; set; }
        public object seperatedIds { get; set; }
        public object seperatedResFormIDs { get; set; }
        public object seperatedResEntryIDs { get; set; }
        public object seperatedResColValues { get; set; }
        public object seperatedColorValues { get; set; }
        public object tabulator_1683726769059 { get; set; }
        public object tabulator_1683785383381 { get; set; }
        public string SCHEDULAR_FORM_ID { get; set; }
        public object CREATION_TYPE { get; set; }
        public object SLOT_DURATION_IN_MINS { get; set; }
        public string EVENT_TYPE { get; set; }
        public string COMPANY_SUBSCRIPTION_ID { get; set; }
        public string IS_UPLOAD_REQUIRED { get; set; }
        public string UPLOAD_TIME { get; set; }
        public string DOWNLOADABLE_ATTACHMENT { get; set; }
        public object DOWNLOAD_FILE_LIST { get; set; }
        public List<DownloadFile> DOWNLOAD_FILES_LIST { get; set; }
        public string IS_COURSE_EVENT { get; set; }
        public string resourceId { get; set; }
        public int TransactionId { get; set; }
        public string COMPANY_LOGO_PATH { get; set; }
        public int COMPANY_ID { get; set; }
        public string COMPANY_NAME_ENGLISH { get; set; }
        public object customFourthTitle { get; set; }
        public string customTitle { get; set; }
        public string customForms { get; set; }
        public string customFormIds { get; set; }
        public string referrences_1 { get; set; }
        public string referrences_2 { get; set; }
        public string referrences_3 { get; set; }
        public string ATTEND { get; set; }
        public string SESSION_REVIEWED { get; set; }
        public object REVIEW_SCORE { get; set; }
        public object REVIEW_COMMENT { get; set; }
        public string ATTENDANCE { get; set; }
        public string CALENDAR_NAME { get; set; }
        public string SERVICE_PROVIDER_TITLE { get; set; }
        public string SERVICE_PROVIDER_ID { get; set; }
        public string SERVICE_PROVIDER_FORMID { get; set; }
        public string SERVICE_TITLE { get; set; }
        public string SERVICE_ID { get; set; }
        public string SERVICE_FORMID { get; set; }
        public string LOCATION_TITLE { get; set; }
        public string LOCATION_ID { get; set; }
        public string LOCATION_FORMID { get; set; }

        public List<EventFormDataList> eventFormDatas { get; set; }
        
    }

    public class EventFormDataList
    {
        public string id { get; set; }
        public string title { get; set; }
        public string formid { get; set; }
        public string formname { get; set; }
        public int seq { get; set; }
    }

    public class ModifiedMyBooking : MyBooking
    {
        // Additional properties for modified data
        public string SERVICE_TITLE { get; set; }
        public string SERVICE_ID { get; set; }
        public string SERVICE_FORMID { get; set; }
        // Add properties for other custom fields
    }

    public class DownloadFile
    {
        public string url { get; set; }
        public string path { get; set; }
        public string name { get; set; }
        public string type { get; set; }
    }

    public class DOWNLOADFILELIST
    {
        public List<DownloadFile> DOWNLOAD_FILE_LIST { get; set; }
    }


    public class LedgerModel
    {
        public string ORDER_NO { get; set; }
        public double DEBIT_COIN { get; set; }
        public double CREDIT_COIN { get; set; }
        public string CALENDAR_CODE { get; set; }
        public string COMPANY_CODE { get; set; }
        public string USER_ID { get; set; }
        public string TRANSACTION_TYPE { get; set; }
    }


    public class CalendarEnrollModel
    {
        public string USER_ID { get; set; }
        public string USER_EMAIL { get; set; }
        public string RESOURCE_NAME { get; set; }
        public string ACTIVITY_NAME { get; set; }
        public string FormGroupKey { get; set; }
        public CalendarParticipantModel participant { get; set; }
        public TransactionMasterModel transaction { get; set; }
    }

}
