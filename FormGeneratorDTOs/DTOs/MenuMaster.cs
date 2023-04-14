using System;

namespace FormGeneratorDTOs.DTOs
{
    public class MenuMaster : CommonClass
    {
        public int menuId { get; set; }
        public string menuName { get; set; }

        public string menuDescription { get; set; }

        public int menuGroup { get; set; }

        public string bgImage { get; set; }

        public string bgColor { get; set; }

        public int gutter { get; set; }

        public int number { get; set; }

        public bool responsive { get; set; }
        public bool shiftlayout { get; set; }

        public bool expandOneItem { get; set; }

        public string expandColor { get; set; }
        public string mouseoverColor { get; set; }

        public bool market_place { get; set; }

        public string market_placeText { get; set; }
        public string first_level_menuText { get; set; }

        public bool first_level_menu { get; set; }

        public int rowOrder { get; set; }

        public DateTime? created_date { get; set; }

        public DateTime? modified_date { get; set; }

        public int userMenuID { get; set; }
    }
}
