using System;
using System.Collections.Generic;

namespace FormGeneratorDTOs.DTOs
{
    public class Groups : CommonClass
    {
        public int userId { get; set; }
        public int groupId { get; set; }
        public int masterGroupId { get; set; }
        public string groupName { get; set; }
        public string masterGroupName { get; set; }
        public string firebase_room_id { get; set; }
        public string groupIcon { get; set; }
        public int status { get; set; }
        public string statusText { get; set; }
        public string groupTag { get; set; }
        public int[] userGroupId { get; set; }
        public int userGroupID { get; set; }
        public string userGroupIds { get; set; }

        public Users[] subtable_users { get; set; }

        public FormTable[] subtable_forms { get; set; }
        public int userRole { get; set; }

        public string[] usersTags { get; set; }
        public int[] usersRoles { get; set; }
        public bool isEdit { get; set; }
        public bool isDelete { get; set; }
        public int contactUserId { get; set; }
        public string contactUserTag { get; set; }
        public string lastestmsg { get; set; }
        public int totalmembers { get; set; }
        public string roomId { get; set; }
        public IEnumerable<FormTable> formData { get; set; }

        public DateTime? texttime { get; set; }
    }


}
