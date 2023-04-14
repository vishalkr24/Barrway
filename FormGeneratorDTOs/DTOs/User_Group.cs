namespace FormGeneratorDTOs.DTOs
{
    public class User_Group : CommonClass
    {
        public int userGroupId { get; set; }
        public int userId { get; set; }
        public int groupId { get; set; }
        public string groupTag { get; set; }
        public string contactTag { get; set; }
        public int contactUserId { get; set; }

        public int userRole { get; set; }
        public string userRoleText { get; set; }
        public string UserName { get; set; }
        public int status { get; set; }
        public string statusText { get; set; }
        public bool inChat { get; set; }

        public string Name { get; set; }

        public string eMail { get; set; }
        public string phone { get; set; }
        public string fullName { get; set; }
        public int SelectedformId { get; set; }



        public string emailList { get; set; }
        public string record_id { get; set; }
        public string FormuserRoles { get; set; }
        public string link { get; set; }
        public string summary_link { get; set; }
        public string rec_link { get; set; }
        public string formTitle { get; set; }
        public string folderTitle { get; set; }
        public int crudNotify { get; set; }
        public string custommsg { get; set; }

    }
}
