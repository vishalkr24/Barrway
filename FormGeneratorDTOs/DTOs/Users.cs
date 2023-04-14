namespace FormGeneratorDTOs.DTOs
{
    public class Users : CommonClass
    {
        public int Id { get; set; }
        public string firebase_uid { get; set; }
        public string chatId { get; set; }
        public string uid { get; set; }
        public string fullName { get; set; }
        public string name { get; set; }

        public string email { get; set; }
        public string emailVerified { get; set; }

        public string emailCheck { get; set; }
        public bool isEmailCheck { get; set; }
        public bool isQuickSignUp { get; set; }
        public string password { get; set; }
        public string newPassword { get; set; }

        public string password_confirmation { get; set; }
        public string confirmPassword { get; set; }
        public int isUpdatePassword { get; set; }
        public string remember_token { get; set; }

        public string userIcon { get; set; }

        public string phoneNumber { get; set; }
        public string phoneVerified { get; set; }
        public string isPhoneVerified { get; set; }
        public string phoneCheck { get; set; }
        public bool isPhoneCheck { get; set; }
        public int role { get; set; }
        public string status { get; set; }

        public int planID { get; set; }

        public string planSequence { get; set; }

        public string tooltipSequence { get; set; }
        public string FB_id { get; set; }

        public string GPlus_id { get; set; }

        public string created_ip { get; set; }
        public int groupId { get; set; }
        public string checkType { get; set; }
        public string title { get; set; }
        public string verificationCode { get; set; }
        public bool isVerificationReq { get; set; }
        public int ayCheck { get; set; }
        public string specialAccess { get; set; }
        public string reset_token { get; set; }
        public string reset_valid_till { get; set; }
        public int isUsable { get; set; }
    }
}
