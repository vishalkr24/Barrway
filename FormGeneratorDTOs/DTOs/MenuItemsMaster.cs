using System;

namespace FormGeneratorDTOs.DTOs
{
    public class MenuItemsMaster : CommonClass
    {
        public int menuItemId { get; set; }
        public int menuId { get; set; }
        public string sequence { get; set; }
        public string type { get; set; }
        public string short_name { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string color { get; set; }
        public string link { get; set; }
        public string parameter { get; set; }
        public string original_size { get; set; }
        public string expanded_size { get; set; }
        public string icon { get; set; }
        public bool pictureWithWord { get; set; }
        public int originalTransparency { get; set; }
        public int expansionTransparency { get; set; }
        public int mouseoverTransparency { get; set; }
        public string shortNameColor { get; set; }
        public string otherTextColor { get; set; }

        public int itemBorder { get; set; }
        public string itemBorderColor { get; set; }
        public string itemIcon { get; set; }
        public int itemIconType { get; set; }
        public bool openNewTab { get; set; }
        public int shortNameSize { get; set; }
        public bool displayType { get; set; }
        public bool fullScreen { get; set; }
        public bool system_type { get; set; }
        public DateTime? LastUsedDateTime { get; set; }
        public string borderRadius { get; set; }

        public int menuItemType { get; set; }
        public bool imageLoop { get; set; }
        public bool videoLoop { get; set; }

        public string slideshowImages { get; set; }
        public string slideshowVideo { get; set; }
        public bool sliderWithWords { get; set; }
        public bool videoWithWords { get; set; }

        public string menuName { get; set; }

        public string menuDescription { get; set; }

    }
}
