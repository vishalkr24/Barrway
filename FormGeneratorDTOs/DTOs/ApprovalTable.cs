using System.Collections.Generic;

namespace FormGeneratorDTOs.DTOs
{
    public class ApprovalTable
    {
        //aw_master
        public int awst_master_id { get; set; }

        public int awst_document_type { get; set; }

        public List<SelectListItem> _ListDocType { get; set; }

        public string DocName { get; set; }

        public string awst_workflow_name { get; set; }
        public List<SelectListItem> _ListWorkFlowName { get; set; }

        public int awst_stage_no { get; set; }

        public string awst_status { get; set; }
        public List<SelectListItem> _ListStatus { get; set; }

        public string awst_stage_description { get; set; }

        public string awst_group_list { get; set; }
        public List<SelectListItem> _ListGpMaster { get; set; }
        public string awst_function_code { get; set; }

        public string tote_approved_by { get; set; }

        public int awst_rowno { get; set; }

        public int awst_stage_master { get; set; }
        //button master
        public int awbm_button_id { get; set; }

        public string awbm_button_cid { get; set; }

        public int awbm_button_rowno { get; set; }

        public int awbm_button_colno { get; set; }

        public string awbm_button_text { get; set; }

        public int awbm_next_stage { get; set; }
        public List<SelectListItem> ListStages { get; set; }
        public int awst_button_stage_master_id { get; set; }
        //btn detail
        public int awbd_button_id { get; set; }

        public int awbd_button_number { get; set; }

        public string awbd_selection_criteria { get; set; }

        public string awbd_group_list { get; set; }
        public List<SelectListItem> ListGroupMaster { get; set; }
        public string awbd_after_click_function_code { get; set; }

        public string awbd_after_click_action { get; set; }
        public List<SelectListItem> AfterClickActionList { get; set; }
        public bool awbd_confirmation { get; set; }
        public List<SelectListItem> ConfirmationList { get; set; }
        public string awbd_confirmation_text { get; set; }

        public bool awbd_remark { get; set; }
        public List<SelectListItem> RemarkList { get; set; }
        public string awbd_remark_text { get; set; }

        //public int awbd_notification_type { get; set; }
        //public List<SelectListItem> NotificationList { get; set; }
        //public int awbd_notification_tasklist_config { get; set; }

        public bool awbd_allow_edit_transaction { get; set; }
        public List<SelectListItem> EditTransactionList { get; set; }
        public string awbd_hide_entry { get; set; }
        public List<SelectListItem> HideEntryList { get; set; }

        public bool awbd_allow_pending { get; set; }
        public List<SelectListItem> AllowPendingList { get; set; }

        public string awbd_notification_grouplist1 { get; set; }
        public string awbd_notification_grouplist2 { get; set; }
        public string awbd_notification_grouplist3 { get; set; }
        public string awbd_notification_grouplist4 { get; set; }
        public string awbd_notification_type1 { get; set; }
        public string awbd_notification_type2 { get; set; }
        public string awbd_notification_type3 { get; set; }
        public string awbd_notification_type4 { get; set; }
        public int awbd_notification_tasklist_config1 { get; set; }
        public int awbd_notification_tasklist_config2 { get; set; }
        public int awbd_notification_tasklist_config3 { get; set; }
        public int awbd_notification_tasklist_config4 { get; set; }
        public string awbd_notification_message1 { get; set; }
        public string awbd_notification_message2 { get; set; }
        public string awbd_notification_message3 { get; set; }
        public string awbd_notification_message4 { get; set; }

        public string awbd_cc_group1 { get; set; }
        public string awbd_cc_group2 { get; set; }
        public string awbd_cc_group3 { get; set; }
        public string awbd_cc_group4 { get; set; }
        public string taskstatus { get; set; }
        public string approvalstatus { get; set; }
        public string Operator { get; set; }
        public string col_nm { get; set; }

        public string Stage_BtnNumber { get; set; }
        public string next_stage { get; set; }
        public string FormName { get; set; }
        public bool awbd_IsTabAccessible { get; set; }
        public string awbd_tabName { get; set; }

        //to maintain renaming
        public string old_tabName { get; set; }
    }
}
