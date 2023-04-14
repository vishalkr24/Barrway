using System;

namespace FormGeneratorDTOs.DTOs
{
    public class ApprovalHistoryModel
    {
        public int awhm_table_id { get; set; }
        public int awhm_document_type { get; set; }
        public string awhm_workflow_name { get; set; }
        public int awhm_start_record_id { get; set; }
        public int awhm_record_id { get; set; }
        public int awhm_from_stage { get; set; }
        public int awhm_to_stage { get; set; }
        public string awhm_remark { get; set; }
        public int awhm_button_number { get; set; }
        public string awhm_group { get; set; }
        public string awhm_user { get; set; }
        public DateTime? awhm_created_date { get; set; }
        public DateTime? awhm_update_date { get; set; }
        public string awbm_button_cid { get; set; }
        public int awst_master_id { get; set; }
        public int form_id { get; set; }
        public int record_id_for_approval_tbl { get; set; }
        public string original_status { get; set; }
        public string revised_status { get; set; }
        public string approval_date { get; set; }
        //for version wise approval
        public int VersionId { get; set; }
        public string datafields { get; set; }
        public string columndata { get; set; }

        //approval history detail
        public int awhd_table_id { get; set; }
        public string awhd_original_status { get; set; }
        public string awhd_revise_status { get; set; }
        public string awhd_remark { get; set; }
        public DateTime? awhd_created_date { get; set; }
        public int history_Master_Model_table_id { get; set; }
        public int app_master_TransactionId { get; set; }

        public string awhm_tabdatainjson { get; set; }
        public int Action { get; set; }
        public string selectedrows { get; set; }

        //Tasklist model
        public int TableId { get; set; }
        public string stsk_sender_user_id { get; set; }
        public string stsk_receiver_user_id { get; set; }
        public int stsk_task_group_key { get; set; }
        public string stsk_emailId { get; set; }
        public string stsk_approval_record_id { get; set; }
        public int stsk_formId { get; set; }
        public string stsk_count_type { get; set; }
        public string stsk_desc_en { get; set; }
        public string stsk_desc_tc { get; set; }
        public string stsk_desc_sc { get; set; }
        public string stsk_URL { get; set; }
        public DateTime? stsk_deadline { get; set; }
        public bool stsk_active { get; set; }
        public string stsk_createdby { get; set; }
        public DateTime? stsk_createdate { get; set; }
        public string stsk_updatedby { get; set; }
        public DateTime? stsk_updatedate { get; set; }
        public int tasklistid { get; set; }
        public string senderName { get; set; }

        public string approvalValidation { get; set; }

        public string from_stage { get; set; }
        public string to_stage { get; set; }
        public string formname { get; set; }
        public string dynamictblname { get; set; }
        public string formGroupKey { get; set; }
        public string app_unique_key { get; set; }
        public int total_records { get; set; }
        public int page { get; set; }
        public int size { get; set; }


    }
}
