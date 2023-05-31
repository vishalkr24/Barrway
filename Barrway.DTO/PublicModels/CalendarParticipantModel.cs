using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.PublicModels
{
    public class CalendarParticipantModel
    {
        public string CALENDAR_CODE { get; set; }
        public string COMPANY_CODE { get; set; }
        public string STUDENT_ID { get; set; }
        public string STUDENT_NAME { get; set; }
        public string PARENT_NAME { get; set; }
        public string ADDRESS { get; set; }
        public string NICKNAME { get; set; }
        public string IS_ACTIVE { get; set; }
        public string PARTICIPANT_CODE { get; set; }
        public DateTime DEACTIVATE_DATE { get; set; }
        public string REASON { get; set; }
        public DateTime DATE_OF_BIRTH { get; set; }
        public string GENDER { get; set; }
        public string EMAIL { get; set; }
        public string MOBILE { get; set; }
        public string PARENT_EMAIL { get; set; }
        public string PARENT_MOBILE { get; set; }
        public string DESCRIPTION { get; set; }
        public string HKID_PASSPORT_NO { get; set; }
        public string NATIONALITY { get; set; }
        public string EMERGENCY_CONTACT_Number { get; set; }
        public string EMERGENCY_CONTACT_PERSON { get; set; }
        public string HIGHEST_EDUCATION_LEVEL { get; set; }
        public string PARTICIPANT_REFERENCE { get; set; }
    }
}
