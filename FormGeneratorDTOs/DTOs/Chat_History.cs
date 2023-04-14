using System;
using System.Collections.Generic;

namespace FormGeneratorDTOs.DTOs
{
    public class Chat_History : CommonClass
    {
        public string Id { get; set; }
        public int userId { get; set; }
        public string roomId { get; set; }
        public string type { get; set; }
        public string message { get; set; }
        public bool readStatus { get; set; }
        public DateTime? timestamp { get; set; }
        public string filePath { get; set; }
        public bool IsClientDeleted { get; set; }
        public string name { get; set; }
        public string searchText { get; set; }

        public string connectedId { get; set; }

        public int totalunread { get; set; }
        public int totalmember { get; set; }

        public string sender { get; set; }
        public string statusType { get; set; }
        public List<Chat_History> chatHistory { get; set; }
        public int ReplyUserId { get; set; }
        public int messagesenderId { get; set; }
        public string receiver { get; set; }
        public string receivericon { get; set; }
        public string receiveruid { get; set; }
        public int selectedgroupid { get; set; }
        public int selectedformid { get; set; }
        public int loginuserid { get; set; }
        public string userIcon { get; set; }
        public string groupIcon { get; set; }
        public string user_uid { get; set; }
        public string groupName { get; set; }
        public string formtitle { get; set; }
        //public int page { get; set; }
        //public int size { get; set; }
        //public int total_records { get; set; }
        //public int last_page { get; set; }
        //public int page_records { get; set; }

    }
}
