namespace FormGeneratorDTOs.DTOs
{
    public class SubGroups : CommonClass
    {
        public int subGroupId { get; set; }
        public int groupId { get; set; }
        public string subGroupName { get; set; }
        public string firebase_room_id { get; set; }
        public string subGroupIcon { get; set; }
        public int status { get; set; }
        public string groupName { get; set; }

    }
}
