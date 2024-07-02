using Barrway.DTO.APIModels.Calendar;
using Barrway.Service.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;

namespace Barrway.Controllers.API.v1
{
    public class EventCalanderController : ApiController
    {
        private readonly IMobileAPIService mobileAPIService;

        public EventCalanderController(IMobileAPIService mobileAPIService)
        {
            this.mobileAPIService = mobileAPIService;
        }

        [AllowAnonymous]
        [Route("api/calendar/CalanderEvents")]
        [HttpPost]
        [ResponseType(typeof(List<IDictionary<string, object>>))]
        public async Task<IHttpActionResult> GetCalanderEvents(CalendarEventsViewModel model)
        {
            try
            {
                CalendarEvents data = new CalendarEvents();
                data.CALENDAR_CODE = data.CALENDAR_CODE;
                data.COMPANY_CODE = data.COMPANY_CODE;
                data.start = DateTime.Parse(model.start); 
                data.end = DateTime.Parse(model.end);
                return Ok(await mobileAPIService.GetCalnderEvents(data));
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }

    }
}
