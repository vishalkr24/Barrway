

const container = document.querySelector('.Barrwaycalendy');
const tempContainer = document.createElement('div');
tempContainer.innerHTML = `
    <div class="BarrwayCalenderHome">
        <div class="container Schedular_container">
            <section class="description-section">
                <hgroup>
                    <h4 id="scheduler"></h4>
                    <h2 id="event"></h2>
                    <div class="icon-text-div">
                        <img src="https://localhost:44360/assets/CalanderScheduler/icons/clock.png" alt="clock-icon">
                        <h4 id="duration"></h4>
                    </div>
                </hgroup>
                <p id="description"></p>
            </section>
            <div class="divider"></div>
            <section id="calendar-section" class="body-section">
                <h3>Select a Date & Time</h3>
                <div id="schedule-div">
                    <div id="available-times-div"><!-- Available times --></div>
                    <div id="calendar"></div>
                </div>
            </section>
        </div>
    </div>
    <div class="BarrwayCalenderRegister">
        <div class="container Schedular_container">
            <section class="description-section">
                <button class="back-btn" onclick="goBack()"><img class="arrow-icon" src="https://localhost:44360/assets/CalanderScheduler/icons/arrow (1).svg" alt="back-arrow"></button>
                <hgroup>
                    <h4 id="scheduler">ACME Sales</h4>
                    <h2 id="event">Pricing Review</h2>
                    <div class="icon-text-div">
                        <img src="https://localhost:44360/assets/CalanderScheduler/icons/clock.svg" alt="clock-icon">
                        <h4 id="duration">15 min</h4>
                    </div>
                    <br>
                    <div class="icon-text-div">
                        <img src="https://localhost:44360/assets/CalanderScheduler/icons/calendar (1).svg" alt="calendar-icon">
                        <h4 id="event-time-stamp">9:00am - 9:15am, Monday, July 13, 2020</h4>
                    </div>
                </hgroup>
            </section>
            <div class="divider"></div>
            <section id="register-section" class="body-section">
                <form action="confirm.html">
                    <h3>Enter Details</h3>
                    <label for="name">Name</label>
                    <input type="text" name="" id="name" required>
                    <label for="email">Email</label>
                    <input type="email" name="" id="email" required>
                    <label for="Phone">Phone</label>
                    <div style="width: 433px; display: flex;">
                        <select name="CountryCode" id="CountryCode" style="width:150px"></select>
                        <input type="text" name="Phone" id="Phone" style="width: 250px; margin-left: 10px;" placeholder="Phone" data-val="true" required />
                    </div>
                    <label for="Job_title">Job title</label>
                    <input type="text" name="Job_title" id="Job_title" required>
                    <label for="Company">Company</label>
                    <input type="text" name="Company" id="Company" required>
                    <label for="Website">Website</label>
                    <input type="text" name="Website" id="Website" required>
                    <label for="meeting_shaire">Please share anything that will help prepare for our meeting.</label>
                    <textarea name="meeting_shaire" id="meeting_shaire" rows="4" cols="50"></textarea>
                    <label for="Job_Title">Job Title</label>
                    <input type="text" name="Job_Title" id="Job_Title" required>
                    <button id="submit-btn" type="submit" style="margin-bottom:20px;">Schedule Event</button>
                </form>
            </section>
        </div>
    </div>
`;
while (tempContainer.children.length > 0) {
    container.appendChild(tempContainer.children[0]);
}




const countryData = {
    "countries": [
        {
            "code": "+7 840",
            "name": "Abkhazia"
        },
        {
            "code": "+93",
            "name": "Afghanistan"
        },
        {
            "code": "+355",
            "name": "Albania"
        },
        {
            "code": "+213",
            "name": "Algeria"
        },
        {
            "code": "+1 684",
            "name": "American Samoa"
        },
        {
            "code": "+376",
            "name": "Andorra"
        },
        {
            "code": "+244",
            "name": "Angola"
        },
        {
            "code": "+1 264",
            "name": "Anguilla"
        },
        {
            "code": "+1 268",
            "name": "Antigua and Barbuda"
        },
        {
            "code": "+54",
            "name": "Argentina"
        },
        {
            "code": "+374",
            "name": "Armenia"
        },
        {
            "code": "+297",
            "name": "Aruba"
        },
        {
            "code": "+247",
            "name": "Ascension"
        },
        {
            "code": "+61",
            "name": "Australia"
        },
        {
            "code": "+672",
            "name": "Australian External Territories"
        },
        {
            "code": "+43",
            "name": "Austria"
        },
        {
            "code": "+994",
            "name": "Azerbaijan"
        },
        {
            "code": "+1 242",
            "name": "Bahamas"
        },
        {
            "code": "+973",
            "name": "Bahrain"
        },
        {
            "code": "+880",
            "name": "Bangladesh"
        },
        {
            "code": "+1 246",
            "name": "Barbados"
        },
        {
            "code": "+1 268",
            "name": "Barbuda"
        },
        {
            "code": "+375",
            "name": "Belarus"
        },
        {
            "code": "+32",
            "name": "Belgium"
        },
        {
            "code": "+501",
            "name": "Belize"
        },
        {
            "code": "+229",
            "name": "Benin"
        },
        {
            "code": "+1 441",
            "name": "Bermuda"
        },
        {
            "code": "+975",
            "name": "Bhutan"
        },
        {
            "code": "+591",
            "name": "Bolivia"
        },
        {
            "code": "+387",
            "name": "Bosnia and Herzegovina"
        },
        {
            "code": "+267",
            "name": "Botswana"
        },
        {
            "code": "+55",
            "name": "Brazil"
        },
        {
            "code": "+246",
            "name": "British Indian Ocean Territory"
        },
        {
            "code": "+1 284",
            "name": "British Virgin Islands"
        },
        {
            "code": "+673",
            "name": "Brunei"
        },
        {
            "code": "+359",
            "name": "Bulgaria"
        },
        {
            "code": "+226",
            "name": "Burkina Faso"
        },
        {
            "code": "+257",
            "name": "Burundi"
        },
        {
            "code": "+855",
            "name": "Cambodia"
        },
        {
            "code": "+237",
            "name": "Cameroon"
        },
        {
            "code": "+1",
            "name": "Canada"
        },
        {
            "code": "+238",
            "name": "Cape Verde"
        },
        {
            "code": "+ 345",
            "name": "Cayman Islands"
        },
        {
            "code": "+236",
            "name": "Central African Republic"
        },
        {
            "code": "+235",
            "name": "Chad"
        },
        {
            "code": "+56",
            "name": "Chile"
        },
        {
            "code": "+86",
            "name": "China"
        },
        {
            "code": "+61",
            "name": "Christmas Island"
        },
        {
            "code": "+61",
            "name": "Cocos-Keeling Islands"
        },
        {
            "code": "+57",
            "name": "Colombia"
        },
        {
            "code": "+269",
            "name": "Comoros"
        },
        {
            "code": "+242",
            "name": "Congo"
        },
        {
            "code": "+243",
            "name": "Congo, Dem. Rep. of (Zaire)"
        },
        {
            "code": "+682",
            "name": "Cook Islands"
        },
        {
            "code": "+506",
            "name": "Costa Rica"
        },
        {
            "code": "+385",
            "name": "Croatia"
        },
        {
            "code": "+53",
            "name": "Cuba"
        },
        {
            "code": "+599",
            "name": "Curacao"
        },
        {
            "code": "+537",
            "name": "Cyprus"
        },
        {
            "code": "+420",
            "name": "Czech Republic"
        },
        {
            "code": "+45",
            "name": "Denmark"
        },
        {
            "code": "+246",
            "name": "Diego Garcia"
        },
        {
            "code": "+253",
            "name": "Djibouti"
        },
        {
            "code": "+1 767",
            "name": "Dominica"
        },
        {
            "code": "+1 809",
            "name": "Dominican Republic"
        },
        {
            "code": "+670",
            "name": "East Timor"
        },
        {
            "code": "+56",
            "name": "Easter Island"
        },
        {
            "code": "+593",
            "name": "Ecuador"
        },
        {
            "code": "+20",
            "name": "Egypt"
        },
        {
            "code": "+503",
            "name": "El Salvador"
        },
        {
            "code": "+240",
            "name": "Equatorial Guinea"
        },
        {
            "code": "+291",
            "name": "Eritrea"
        },
        {
            "code": "+372",
            "name": "Estonia"
        },
        {
            "code": "+251",
            "name": "Ethiopia"
        },
        {
            "code": "+500",
            "name": "Falkland Islands"
        },
        {
            "code": "+298",
            "name": "Faroe Islands"
        },
        {
            "code": "+679",
            "name": "Fiji"
        },
        {
            "code": "+358",
            "name": "Finland"
        },
        {
            "code": "+33",
            "name": "France"
        },
        {
            "code": "+596",
            "name": "French Antilles"
        },
        {
            "code": "+594",
            "name": "French Guiana"
        },
        {
            "code": "+689",
            "name": "French Polynesia"
        },
        {
            "code": "+241",
            "name": "Gabon"
        },
        {
            "code": "+220",
            "name": "Gambia"
        },
        {
            "code": "+995",
            "name": "Georgia"
        },
        {
            "code": "+49",
            "name": "Germany"
        },
        {
            "code": "+233",
            "name": "Ghana"
        },
        {
            "code": "+350",
            "name": "Gibraltar"
        },
        {
            "code": "+30",
            "name": "Greece"
        },
        {
            "code": "+299",
            "name": "Greenland"
        },
        {
            "code": "+1 473",
            "name": "Grenada"
        },
        {
            "code": "+590",
            "name": "Guadeloupe"
        },
        {
            "code": "+1 671",
            "name": "Guam"
        },
        {
            "code": "+502",
            "name": "Guatemala"
        },
        {
            "code": "+224",
            "name": "Guinea"
        },
        {
            "code": "+245",
            "name": "Guinea-Bissau"
        },
        {
            "code": "+595",
            "name": "Guyana"
        },
        {
            "code": "+509",
            "name": "Haiti"
        },
        {
            "code": "+504",
            "name": "Honduras"
        },
        {
            "code": "+852",
            "name": "Hong Kong SAR China"
        },
        {
            "code": "+36",
            "name": "Hungary"
        },
        {
            "code": "+354",
            "name": "Iceland"
        },
        {
            "code": "+91",
            "name": "India"
        },
        {
            "code": "+62",
            "name": "Indonesia"
        },
        {
            "code": "+98",
            "name": "Iran"
        },
        {
            "code": "+964",
            "name": "Iraq"
        },
        {
            "code": "+353",
            "name": "Ireland"
        },
        {
            "code": "+972",
            "name": "Israel"
        },
        {
            "code": "+39",
            "name": "Italy"
        },
        {
            "code": "+225",
            "name": "Ivory Coast"
        },
        {
            "code": "+1 876",
            "name": "Jamaica"
        },
        {
            "code": "+81",
            "name": "Japan"
        },
        {
            "code": "+962",
            "name": "Jordan"
        },
        {
            "code": "+7 7",
            "name": "Kazakhstan"
        },
        {
            "code": "+254",
            "name": "Kenya"
        },
        {
            "code": "+686",
            "name": "Kiribati"
        },
        {
            "code": "+965",
            "name": "Kuwait"
        },
        {
            "code": "+996",
            "name": "Kyrgyzstan"
        },
        {
            "code": "+856",
            "name": "Laos"
        },
        {
            "code": "+371",
            "name": "Latvia"
        },
        {
            "code": "+961",
            "name": "Lebanon"
        },
        {
            "code": "+266",
            "name": "Lesotho"
        },
        {
            "code": "+231",
            "name": "Liberia"
        },
        {
            "code": "+218",
            "name": "Libya"
        },
        {
            "code": "+423",
            "name": "Liechtenstein"
        },
        {
            "code": "+370",
            "name": "Lithuania"
        },
        {
            "code": "+352",
            "name": "Luxembourg"
        },
        {
            "code": "+853",
            "name": "Macau SAR China"
        },
        {
            "code": "+389",
            "name": "Macedonia"
        },
        {
            "code": "+261",
            "name": "Madagascar"
        },
        {
            "code": "+265",
            "name": "Malawi"
        },
        {
            "code": "+60",
            "name": "Malaysia"
        },
        {
            "code": "+960",
            "name": "Maldives"
        },
        {
            "code": "+223",
            "name": "Mali"
        },
        {
            "code": "+356",
            "name": "Malta"
        },
        {
            "code": "+692",
            "name": "Marshall Islands"
        },
        {
            "code": "+596",
            "name": "Martinique"
        },
        {
            "code": "+222",
            "name": "Mauritania"
        },
        {
            "code": "+230",
            "name": "Mauritius"
        },
        {
            "code": "+262",
            "name": "Mayotte"
        },
        {
            "code": "+52",
            "name": "Mexico"
        },
        {
            "code": "+691",
            "name": "Micronesia"
        },
        {
            "code": "+1 808",
            "name": "Midway Island"
        },
        {
            "code": "+373",
            "name": "Moldova"
        },
        {
            "code": "+377",
            "name": "Monaco"
        },
        {
            "code": "+976",
            "name": "Mongolia"
        },
        {
            "code": "+382",
            "name": "Montenegro"
        },
        {
            "code": "+1664",
            "name": "Montserrat"
        },
        {
            "code": "+212",
            "name": "Morocco"
        },
        {
            "code": "+95",
            "name": "Myanmar"
        },
        {
            "code": "+264",
            "name": "Namibia"
        },
        {
            "code": "+674",
            "name": "Nauru"
        },
        {
            "code": "+977",
            "name": "Nepal"
        },
        {
            "code": "+31",
            "name": "Netherlands"
        },
        {
            "code": "+599",
            "name": "Netherlands Antilles"
        },
        {
            "code": "+1 869",
            "name": "Nevis"
        },
        {
            "code": "+687",
            "name": "New Caledonia"
        },
        {
            "code": "+64",
            "name": "New Zealand"
        },
        {
            "code": "+505",
            "name": "Nicaragua"
        },
        {
            "code": "+227",
            "name": "Niger"
        },
        {
            "code": "+234",
            "name": "Nigeria"
        },
        {
            "code": "+683",
            "name": "Niue"
        },
        {
            "code": "+672",
            "name": "Norfolk Island"
        },
        {
            "code": "+850",
            "name": "North Korea"
        },
        {
            "code": "+1 670",
            "name": "Northern Mariana Islands"
        },
        {
            "code": "+47",
            "name": "Norway"
        },
        {
            "code": "+968",
            "name": "Oman"
        },
        {
            "code": "+92",
            "name": "Pakistan"
        },
        {
            "code": "+680",
            "name": "Palau"
        },
        {
            "code": "+970",
            "name": "Palestinian Territory"
        },
        {
            "code": "+507",
            "name": "Panama"
        },
        {
            "code": "+675",
            "name": "Papua New Guinea"
        },
        {
            "code": "+595",
            "name": "Paraguay"
        },
        {
            "code": "+51",
            "name": "Peru"
        },
        {
            "code": "+63",
            "name": "Philippines"
        },
        {
            "code": "+48",
            "name": "Poland"
        },
        {
            "code": "+351",
            "name": "Portugal"
        },
        {
            "code": "+1 787",
            "name": "Puerto Rico"
        },
        {
            "code": "+974",
            "name": "Qatar"
        },
        {
            "code": "+262",
            "name": "Reunion"
        },
        {
            "code": "+40",
            "name": "Romania"
        },
        {
            "code": "+7",
            "name": "Russia"
        },
        {
            "code": "+250",
            "name": "Rwanda"
        },
        {
            "code": "+685",
            "name": "Samoa"
        },
        {
            "code": "+378",
            "name": "San Marino"
        },
        {
            "code": "+966",
            "name": "Saudi Arabia"
        },
        {
            "code": "+221",
            "name": "Senegal"
        },
        {
            "code": "+381",
            "name": "Serbia"
        },
        {
            "code": "+248",
            "name": "Seychelles"
        },
        {
            "code": "+232",
            "name": "Sierra Leone"
        },
        {
            "code": "+65",
            "name": "Singapore"
        },
        {
            "code": "+421",
            "name": "Slovakia"
        },
        {
            "code": "+386",
            "name": "Slovenia"
        },
        {
            "code": "+677",
            "name": "Solomon Islands"
        },
        {
            "code": "+27",
            "name": "South Africa"
        },
        {
            "code": "+500",
            "name": "South Georgia and the South Sandwich Islands"
        },
        {
            "code": "+82",
            "name": "South Korea"
        },
        {
            "code": "+34",
            "name": "Spain"
        },
        {
            "code": "+94",
            "name": "Sri Lanka"
        },
        {
            "code": "+249",
            "name": "Sudan"
        },
        {
            "code": "+597",
            "name": "Suriname"
        },
        {
            "code": "+268",
            "name": "Swaziland"
        },
        {
            "code": "+46",
            "name": "Sweden"
        },
        {
            "code": "+41",
            "name": "Switzerland"
        },
        {
            "code": "+963",
            "name": "Syria"
        },
        {
            "code": "+886",
            "name": "Taiwan"
        },
        {
            "code": "+992",
            "name": "Tajikistan"
        },
        {
            "code": "+255",
            "name": "Tanzania"
        },
        {
            "code": "+66",
            "name": "Thailand"
        },
        {
            "code": "+670",
            "name": "Timor Leste"
        },
        {
            "code": "+228",
            "name": "Togo"
        },
        {
            "code": "+690",
            "name": "Tokelau"
        },
        {
            "code": "+676",
            "name": "Tonga"
        },
        {
            "code": "+1 868",
            "name": "Trinidad and Tobago"
        },
        {
            "code": "+216",
            "name": "Tunisia"
        },
        {
            "code": "+90",
            "name": "Turkey"
        },
        {
            "code": "+993",
            "name": "Turkmenistan"
        },
        {
            "code": "+1 649",
            "name": "Turks and Caicos Islands"
        },
        {
            "code": "+688",
            "name": "Tuvalu"
        },
        {
            "code": "+1 340",
            "name": "U.S. Virgin Islands"
        },
        {
            "code": "+256",
            "name": "Uganda"
        },
        {
            "code": "+380",
            "name": "Ukraine"
        },
        {
            "code": "+971",
            "name": "United Arab Emirates"
        },
        {
            "code": "+44",
            "name": "United Kingdom"
        },
        {
            "code": "+1",
            "name": "United States"
        },
        {
            "code": "+598",
            "name": "Uruguay"
        },
        {
            "code": "+998",
            "name": "Uzbekistan"
        },
        {
            "code": "+678",
            "name": "Vanuatu"
        },
        {
            "code": "+58",
            "name": "Venezuela"
        },
        {
            "code": "+84",
            "name": "Vietnam"
        },
        {
            "code": "+1 808",
            "name": "Wake Island"
        },
        {
            "code": "+681",
            "name": "Wallis and Futuna"
        },
        {
            "code": "+967",
            "name": "Yemen"
        },
        {
            "code": "+260",
            "name": "Zambia"
        },
        {
            "code": "+255",
            "name": "Zanzibar"
        },
        {
            "code": "+263",
            "name": "Zimbabwe"
        }
    ]
};


const event = {
    name: "Pricing Review",
    organizer: "ACME Sales",
    duration: 15,
    description: "Our team will meet with you to review pricing options.",
    date: new Date(),
    time: "9:00",
    attendees: []
};


const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const timesAvailable = ["9:00am", "10:00am", "11:00am", "2:00pm", "3:00pm"];
const EventDates = ["2024-06-27", "2024-06-28", "2024-06-29", , "2024-06-30", , "2024-07-01", "2024-07-02", "2024-07-03"];


document.getElementById("event").textContent = event.name;
document.getElementById("scheduler").textContent = event.organizer;
document.getElementById("duration").textContent = event.duration + "min";
document.getElementById("description").textContent = event.description;

const Registercontent = document.querySelector(".BarrwayCalenderRegister");
Registercontent.classList.toggle("hidden");
Registercontent.classList.remove("visible");

const Clandercontent = document.querySelector(".BarrwayCalenderHome");
Clandercontent.classList.remove("hidden");
Clandercontent.classList.add("visible");

// Dates to highlight
//const datesToHighlight = ["2024-06-27", "2024-06-28", "2024-06-29", "2024-06-30", "2024-07-01", "2024-07-02", "2024-07-03"];

// Calendar
document.addEventListener('DOMContentLoaded', function () {

    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        height: 'auto',
        showNonCurrentDates: false,
        selectable: true,
        select: function (info) {

            var currentDay = new Date();
            var daySelected = info.start;

            const storedEventDataJSON = localStorage.getItem('eventData');

            // Convert JSON string back to JavaScript object
            const storedEventData = JSON.parse(storedEventDataJSON);

            debugger;

            const isDateHighlighted = isDateAvailable(info.startStr, storedEventData);

            if (isDateHighlighted == true && (daySelected >= currentDay)) {

                var timeDiv = document.getElementById("available-times-div");

                while (timeDiv.firstChild) {
                    timeDiv.removeChild(timeDiv.lastChild);
                }

                const eventTimes = getEventTimes(info.startStr, storedEventData);



                //Heading - Date Selected
                var h4 = document.createElement("h4");
                var h4node = document.createTextNode(
                    days[daySelected.getDay()] + ", " +
                    months[daySelected.getMonth()] + " " +
                    daySelected.getDate());
                h4.appendChild(h4node);

                timeDiv.appendChild(h4);

                //Time Buttons
                for (var i = 0; i < eventTimes.length; i++) {
                    var timeSlot = document.createElement("div");
                    timeSlot.classList.add("time-slot");

                    var timeBtn = document.createElement("button");

                    var btnNode = document.createTextNode(eventTimes[i].Timeing);
                    timeBtn.classList.add("time-btn");

                    timeBtn.appendChild(btnNode);
                    timeSlot.appendChild(timeBtn);

                    timeDiv.appendChild(timeSlot);

                    // When time is selected
                    var last = null;
                    timeBtn.addEventListener("click", function () {
                        if (last != null) {
                            console.log(last);
                            last.parentNode.removeChild(last.parentNode.lastChild);
                        }
                        var confirmBtn = document.createElement("button");
                        var confirmTxt = document.createTextNode("Next");
                        confirmBtn.classList.add("confirm-btn");
                        confirmBtn.appendChild(confirmTxt);
                        this.parentNode.appendChild(confirmBtn);
                        event.time = this.textContent;
                        confirmBtn.addEventListener("click", function () {
                            event.date =
                                days[daySelected.getDay()] + ", " +
                                months[daySelected.getMonth()] + " " +
                                daySelected.getDate();
                            //sessionStorage.setItem("eventObj", JSON.stringify(event));
                            //console.log(event);
                            //window.location.href = "register.html";

                            const Clandercontent = document.querySelector(".BarrwayCalenderHome");
                            Clandercontent.classList.toggle("hidden");
                            Clandercontent.classList.remove("visible");
                            const Registercontent = document.querySelector(".BarrwayCalenderRegister");
                            Registercontent.classList.remove("hidden");
                            Registercontent.classList.add("visible");

                        });
                        last = this;
                    });
                }

                var containerDiv = document.getElementsByClassName("container")[0];
                containerDiv.classList.add("time-div-active");

                document.getElementById("calendar-section").style.flex = "2";

                timeDiv.style.display = "initial";

            }

        },
    });
    calendar.render();
});









// Call highlightDates when the page has fully loaded
window.addEventListener('load', function () {
    const today = new Date();
    const year = today.getFullYear(); // Get the current year
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Get the current month (1-12) and format to 2 digits
    const date = today.getDate().toString().padStart(2, '0');
    const NDate = parseFloat(date) + 1;

    localStorage.setItem('eventyear', year);
    localStorage.setItem('month', month);

    let divElement = document.querySelector('.Barrwaycalendy');
    let calendar_Code = divElement.getAttribute('calendar-Code');
    let Conmpany_code = divElement.getAttribute('Conmpany-code');
    let _startDate = year + '-' + month + '-' + NDate;
    let _EndDate = year + '-' + month + '-31';


    const model = {
        COMPANY_CODE: Conmpany_code, // Replace with your actual COMPANY_CODE
        CALENDAR_CODE: calendar_Code, // Replace with your actual CALENDAR_CODE
        start: _startDate, // Replace with your actual start date/time
        end: _EndDate // Replace with your actual end date/time
    };

    getCalendarEvents(model)
        .then(data => {
            console.log(data, "EventDatesdata");
            const eventDataJSON = JSON.stringify(data);
            localStorage.setItem('eventData', eventDataJSON);
            highlightDates(data);
        })
        .catch(error => {
            // Handle errors
        });
    //console.log(EventDates,"EventDates")

});



// Attach the function to all elements with the class 'fc-prev-button' on page load
document.addEventListener('DOMContentLoaded', function () {
    const prevButtons = document.querySelectorAll('.fc-prev-button');
    prevButtons.forEach(button => {
        button.addEventListener('click', handlePrevButtonClick);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const prevButtons = document.querySelectorAll('.fc-next-button');
    prevButtons.forEach(button => {
        button.addEventListener('click', handleNextButtonClick);
    });
});


// Call the function to populate the dropdown when the page loads
window.onload = populateCountryDropdown;

const defaultCountryCode = "+852"; // The country code you want to set as selected

function populateCountryDropdown() {
    const dropdown = document.getElementById('CountryCode');
    countryData.countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code;
        option.text = `${country.name} (${country.code})`;
        if (country.code === defaultCountryCode) {
            option.selected = true; // Set this option as selected
        }
        dropdown.appendChild(option);
    });
}

//back button handeler
function goBack() {
    const Clandercontent = document.querySelector(".BarrwayCalenderHome");
    Clandercontent.classList.toggle("visible");
    Clandercontent.classList.remove("hidden");
    const Registercontent = document.querySelector(".BarrwayCalenderRegister");
    Registercontent.classList.remove("visible");
    Registercontent.classList.add("hidden");

    location.reload();
}


// previous button click handaling
function handlePrevButtonClick() {

    const today = new Date();
    const year = today.getFullYear();
    const currentMonth = today.getMonth() + 1; 
    const formattedMonth = currentMonth.toString().padStart(2, '0');
    const month = localStorage.getItem('month');
    const Pmonth = parseFloat(month) - 1;
    
    localStorage.setItem('month', Pmonth);
    if (Pmonth >= parseFloat(formattedMonth)) {
        
        let _startDate = year + '-' + Pmonth + '-01';
        let _EndDate = year + '-' + Pmonth + '-31';

        let divElement = document.querySelector('.Barrwaycalendy');
        let calendar_Code = divElement.getAttribute('calendar-Code');
        let Conmpany_code = divElement.getAttribute('Conmpany-code');

        const model = {
            COMPANY_CODE: Conmpany_code, 
            CALENDAR_CODE: calendar_Code,
            start: _startDate, 
            end: _EndDate 
        };
        getCalendarEvents(model)
            .then(data => {
                console.log(data, "EventDatesdata");
                const eventDataJSON = JSON.stringify(data);
                localStorage.setItem('eventData', eventDataJSON);
                highlightDates(data);
            })
            .catch(error => {
                // Handle errors
            });


    }






}

//next month events data
function handleNextButtonClick() {

    const today = new Date();
    const year = today.getFullYear();
    //const currentMonth = today.getMonth() + 1;
    const month = localStorage.getItem('month');
    const Nextmonth = (parseFloat(month) + 1);
    localStorage.setItem('month', Nextmonth);

    let divElement = document.querySelector('.Barrwaycalendy');
    let calendar_Code = divElement.getAttribute('calendar-Code');
    let Conmpany_code = divElement.getAttribute('Conmpany-code');
    let _startDate = year+'-'+ Nextmonth +'-01';
    let _EndDate = year+'-'+ Nextmonth +'-31';
    const Nmodel = {
        COMPANY_CODE: Conmpany_code,
        CALENDAR_CODE: calendar_Code,
        start: _startDate,
        end: _EndDate
        //start: new Date(_startDate),
        //end: new Date(_EndDate)
    };
    getCalendarEvents(Nmodel)
        .then(data => {
            console.log(data, "EventDatesdata");
            const eventDataJSON = JSON.stringify(data);
            localStorage.setItem('eventData', eventDataJSON);
            highlightDates(data);
        })
        .catch(error => {
            // Handle errors
        });
}




// function to highlisht Eventdates
function highlightDates(dates) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset hours to the start of the day for comparison

    dates.forEach(event => {
        const { Date: dateStr, EventTimes } = event;
        const eventDate = new Date(dateStr);

        if (eventDate > today && dateStr && EventTimes) {
            const cell = document.querySelector(`td[data-date="${dateStr}"]`);
            if (cell) {
                cell.classList.add('highlight');
                // Optionally, you can also display event times in the tooltip or console
                //EventTimes.forEach(eventTime => {
                //    console.log(`Event at ${dateStr}: ${eventTime.Timeing}`);
                //});
            }
        }
    });
}

//Get event timing
function getEventTimes(date, eventData) {
    const event = eventData.find(event => event.Date === date);
    return event ? event.EventTimes : [];
}


//check date is availbale
function isDateAvailable(dateToCheck, storedEventData) {
    if (Array.isArray(storedEventData)) {
        return storedEventData.some(event => event.Date === dateToCheck);
    } else {
        return false;
    }
}



async function getCalendarEvents(Data) {
    try {
        const url = 'https://localhost:44360/api/calendar/CalanderEvents'; // Replace with your actual API URL
       
        // Format dates as ISO strings for transmission
        //Data.start = Data.start.toISOString();
        //Data.end = Data.end.toISOString();

        Data.start = Data.start;
        Data.end = Data.end;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add any necessary headers here
            },
            body: JSON.stringify(Data) // Convert model object to JSON string
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();       
        return data; // Return the response data if needed
    } catch (error) {
        console.error('Error fetching calendar events:', error);
        throw error; // Handle or rethrow the error as needed
    }
}