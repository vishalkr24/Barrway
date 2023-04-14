using System;
using System.Collections.Generic;

namespace FormGeneratorDTOs.DTOs
{
    public class Room_History : CommonClass
    {
        public string title { get; set; }
        public string groupIcon { get; set; }
        public string totalmembers { get; set; }
        public string userIcon { get; set; }
        public string roomId { get; set; }
        public int UserId { get; set; }
        public int groupId { get; set; }
        public int formId { get; set; }
        public int ReplyUserId { get; set; }
        public bool isInvitation { get; set; }
        public DateTime? isAcceptOn { get; set; }
        public int Id { get; set; }
        public string type { get; set; }

        public string message { get; set; }

        public string sender { get; set; }
        public string receiver { get; set; }
        public List<Chat_History> chatHistory { get; set; }

        public bool isChat { get; set; }

        public int totalunread { get; set; }

#pragma warning disable CS0108 // 'Room_History.sorters' hides inherited member 'CommonClass.sorters'. Use the new keyword if hiding was intended.
        public List<SortDTO> sorters { get; set; }
#pragma warning restore CS0108 // 'Room_History.sorters' hides inherited member 'CommonClass.sorters'. Use the new keyword if hiding was intended.
        public int isInvitationA_R { get; set; }
        public string statusType { get; set; }

        public string timestamp { get; set; }

    }
}
