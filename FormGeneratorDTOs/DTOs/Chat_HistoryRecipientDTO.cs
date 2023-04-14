using System;

namespace FormGeneratorDTOs.DTOs
{
    public class Chat_HistoryRecipientDTO : CommonClass
    {
        public int Id { get; set; }
        public int userId { get; set; }
        public int groupId { get; set; }
        public string messageId { get; set; }

        public bool IsRead { get; set; }

        public DateTime? Seen_at { get; set; }

        public int Unread { get; set; }
    }
}
