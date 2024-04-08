using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.UserAdminModels
{
    public class EventDataListModel
    {
        public string field { get; set; }
        public object value { get; set; }
    }

    public class RootEventDataListModel
    {
        public int eventId { get; set; }
        public List<EventDataListModel> data { get; set; }
    }
}
