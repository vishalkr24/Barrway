namespace FormGeneratorDTOs.DTOs
{
    public class User_Contact : CommonClass
    {
        public int Id { get; set; }
        public int userId { get; set; }
        public int contactUserId { get; set; }
        public string contactUserName { get; set; }

        public string contactTag { get; set; }

        public string chatted { get; set; }
        public string firebase_room_id { get; set; }
        public string roomId { get; set; }

        public string firebase_invite_id { get; set; }
        public string name { get; set; }

        public string email { get; set; }

        public string phoneNumber { get; set; }
        public string groupTag { get; set; }
        public string userRole { get; set; }
        public string roleName { get; set; }
        public string userIcon { get; set; }
        public string uniqueid { get; set; }

        public int groupId { get; set; }
        public int isExist { get; set; }

        public string[] emailList { get; set; }
        public string[] phonenumberList { get; set; }
        public int formID { get; set; }
        public string uid { get; set; }
        public string lastestmsg { get; set; }
        public string texttime { get; set; }
        public string groupName { get; set; }
        public string groupIcon { get; set; }
        public string status { get; set; }
        public string statusText { get; set; }
        public string s_userId { get; set; }
    }
}
