var templateList = [];
var locationList = [];
var serviceProviderList = [];
const createdCalendarCode = $("#calendarCodeInput").val();
const createdCompanyCode = $("#companyCodeInput").val();

var locationModel = {
    Id: 0,
    CALENDAR_CODE: "",
    COMPANY_CODE: "",
    LOCATION_ADDRESS: ""
}

var serviceProviderModel = {
    Id: 0,
    CALENDAR_CODE: "",
    COMPANY_CODE: "",
    FIRST_NAME: "",
    LAST_NAME: "",
    MIDDLE_NAME: ""
}

$(document).ready(function () {

    readyPage();
    setTimeout(function () {
        $("#calendarsMegaMenu").addClass("active");
    }, 500);

});

function readyPage() {
    checkRegistrationStep();

    let step = window.location.href.split('?')[1].split('&&')[2].split('=')[1];
    backToStep(parseInt(step));

    var obj = { 'create': true, 'placeholder': 'Add tags...' };
    $("#content").show();
    $("#content-2").hide();
    $("#TAGS").attr("data-hs-tom-select-options", JSON.stringify(obj));
    HSCore.components.HSTomSelect.init('.js-select')
}

function checkRegistrationStep() {
    var data = getCompanyWebsite().Data;

    if (data.COMPANY_PROFILE_STATUS == "N") {
        lockCalendarSetup();
    } else {
        $("#error-div").hide();
    }

}

function moveToStep(stepId) {
    switch (stepId) {
        case 2:
            goToStep2();
            break;
        case 3:
            bindCalendarLocationMaster();
            break;
        case 4:
            createLocationMaster();
            break;
        case 5:
            createServiceProviderMaster();
            break;
        default:
            break;
    };
}

function backToStep(stepId) {
    switch (stepId) {
        case 3:
            bindCalendarLocationMaster();
            break;
        case 4:
            bindCalendarServiceProviderMaster();
            break;
        case 5:
            createServiceProviderMaster();
            break;
        default:
            break;
    };
}

function goToStep2() {
    swal({
        icon: "warning",
        title: "Are you sure!",
        text: "Are you sure to go back to step 2?"
    }).then(function (check) {
        if (check) {
            window.location.replace(`/BusinessAdmin/SetupCompanyCalendar?CompanyId=${localStorage.getItem("COMPANY_ID")}&IsPartial=false&CalendarCode=${createdCalendarCode}`)
        }
    })
}

function validateStep(stepId) {
    var flag = true;
    if (stepId == 3) {
        let inputList = document.getElementsByClassName("location-input");
        inputList.forEach(x => {
            if (x.value == "" || x.value == null) {
                swal({
                    icon: "warning",
                    title: "Warning",
                    text: "Please fill all location fields."
                });
                flag = false;
            }
        });
    }

    if (stepId == 4) {
        let tempFlag1 = true;
        let tempFlag2 = true;
        let inputList = document.getElementsByClassName("provider-first-input");
        inputList.forEach(x => {
            if (x.value == "" || x.value == null) {
                
                tempFlag1 = false;
            }
        });

        let inputList2 = document.getElementsByClassName("provider-last-input");
        inputList2.forEach(x => {
            if (x.value == "" || x.value == null) {
                
                tempFlag2 = false;
            }
        });

        if (!tempFlag1 && !tempFlag2) {
            swal({
                icon: "warning",
                title: "Warning",
                text: "Please fill first & last name fields."
            });
            flag = false;
        } else if (!tempFlag1) {
            swal({
                icon: "warning",
                title: "Warning",
                text: "Please fill first name fields."
            });
            flag = false;
        } else if (!tempFlag2) {
            swal({
                icon: "warning",
                title: "Warning",
                text: "Please fill last name fields."
            });
            flag = false;
        }
    }

    return flag;
}


function bindCalendarLocationMaster() {
    $("#step-3").show();
    $("#step-4").hide();
    $("#step-5").hide();

    $.ajax({
        url: "/Calendar/GetLocationMasterList",
        method: "POST",
        data: {
            data: {},
            companyCode: createdCompanyCode,
            calendarCode: createdCalendarCode
        },
        success: function (response) {

            var data = response.data;

            if (data != null) {
                var divString = "";

                locationList = [];

                data.forEach(x => {

                    locationList.push({
                        Id: x.Id,
                        CALENDAR_CODE: createdCalendarCode,
                        COMPANY_CODE: createdCompanyCode,
                        LOCATION_ADDRESS: x.LOCATION_ADDRESS,
                        Is_New: false
                    });

                    divString += `<div class="form-group">
                                            <label for="calendarname">Location*</label>

                                            <input type="text" class="form-control location-input" placeholder="" value="${x.LOCATION_ADDRESS}" data-input-id="${x.Id}">
                                        </div>`;
                })

                $("#locations-div").append(divString);
            }

        },
        error: function (er) {

        }
    })

}

function bindCalendarServiceProviderMaster() {
    $("#step-3").hide();
    $("#step-4").show();
    $("#step-5").hide();

    $.ajax({
        url: "/Calendar/GetServiceProviderMasterList",
        method: "POST",
        data: {
            data: {},
            companyCode: createdCompanyCode,
            calendarCode: createdCalendarCode
        },
        success: function (response) {

            var data = response.data;

            if (data != null) {
                var divString = "";

                serviceProviderList = [];

                data.forEach(x => {

                    serviceProviderList.push({
                        Id: x.Id,
                        CALENDAR_CODE: createdCalendarCode,
                        COMPANY_CODE: createdCompanyCode,
                        FIRST_NAME: x.FIRST_NAME,
                        LAST_NAME: x.LAST_NAME,
                        Is_New: false
                    });

                    divString += `      <div class="row">
                                            <p class="sp">Service provider</p>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label for="calendarname">First Name *</label>

                                                    <input type="text" class="form-control provider-first-input" placeholder="" value="${x.FIRST_NAME}" data-input-id="${x.Id}">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label for="calendarname">Last Name *</label>

                                                    <input type="text" class="form-control provider-last-input" placeholder="" value="${x.LAST_NAME}" data-input-id="${x.Id}">
                                                </div>
                                            </div>
                                        </div>
                                       `;
                })

                $("#providers-div").append(divString);
            }

        },
        error: function (er) {

        }
    })
}

function getMaxId(arr) {
    let max = arr[0].Id;
    arr.forEach(x => {
        if(x.Id > max) {
            max = x.Id;
        }
    })
    return max;
}

function addMoreProvider() {
    
    let dataModel = {
        Id: parseInt(getMaxId(serviceProviderList)) + 1,
        CALENDAR_CODE: createdCalendarCode,
        COMPANY_CODE: createdCompanyCode,
        FIRST_NAME: "",
        LAST_NAME: "",
        Is_New: true
    };

    serviceProviderList.push(dataModel);

    $("#providers-div").append(`
                                        <div class="row" id="provider-elem-${dataModel.Id}">
                                            <p class="sp">Service provider <span><i class="fa fa-times" onclick="removeProvider(${dataModel.Id})" aria-hidden="true"></i></span></p>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label for="calendarname">First Name *</label>

                                                    <input type="text" class="form-control provider-first-input" placeholder="" value="${dataModel.FIRST_NAME}" data-input-id="${dataModel.Id}">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label for="calendarname">Last Name *</label>

                                                    <input type="text" class="form-control provider-last-input" placeholder="" value="${dataModel.LAST_NAME}" data-input-id="${dataModel.Id}">
                                                </div>
                                            </div>
                                        </div>`);
}

function addMoreLocation() {

    let dataModel = {
        Id: parseInt(getMaxId(locationList)) + 1,
        CALENDAR_CODE: createdCalendarCode,
        COMPANY_CODE: createdCompanyCode,
        LOCATION_ADDRESS: "",
        Is_New: true
    };

    locationList.push(dataModel);

    $("#locations-div").append(`<div class="form-group" id="location-elem-${dataModel.Id}">
                                            <label for="calendarname">Location*</label> <span><i class="fa fa-times" onclick="removeLocation(${dataModel.Id})" aria-hidden="true"></i></span>

                                            <input type="text" class="form-control location-input" placeholder="" value="" data-input-id="${dataModel.Id}">
                                        </div>`);
}

$(document).on("keyup change paste", ".location-input", function () {
    let inputId = $(this).attr("data-input-id");
    locationList.find(x => x.Id == inputId).LOCATION_ADDRESS = this.value;
})

function removeLocation(Id) {
    if (locationList.filter(x => x.Id == Id).length > 0) {
        if (locationList.find(x => x.Id == Id).Is_New) {
            locationList = locationList.filter(x=> x.Id != Id);
            $("#location-elem-" + Id).remove();
        }
    }
}

function createLocationMaster() {
    if (validateStep(3)) {

        $.ajax({
            url: "/Calendar/AddMasterData",
            method: "POST",
            data: {
                data: locationList,
                ModelId: 1
            },
            success: function (response) {
                // after success response
                if (response.Status) {
                    swal({
                        icon: "success",
                        title: "Location Added",
                        text: "Location added successfully!"
                    }).then(function (check) {
                        window.location.href = '/BusinessAdmin/SetupCalendarEvent?CompanyId=' + localStorage.getItem("COMPANY_ID") + "&&CalendarCode=" + createdCalendarCode + "&&Step=4";
                    });

                } else {
                    swal({
                        icon: "error",
                        title: "Error",
                        text: response.Message
                    });
                }
                
            },
            error: function (er) {
                
            }
        })
        
    }
}

function createServiceProviderMaster() {
    if (validateStep(4)) {
        $.ajax({
            url: "/Calendar/AddMasterData",
            method: "POST",
            data: {
                data: serviceProviderList,
                ModelId: 2
            },
            success: function (response) {
                
                if (response.Status) {
                    swal({
                        icon: "success",
                        title: "Service Provider Added",
                        text: "Service Provider added successfully!"
                    }).then(function (check) {
                        // after success response
                        window.location.href = '/BusinessAdmin/SetupCalendarEvent?CompanyId=' + localStorage.getItem("COMPANY_ID") + "&&CalendarCode=" + createdCalendarCode + "&&Step=5";
                    });

                } else {
                    swal({
                        icon: "error",
                        title: "Error",
                        text: response.Message
                    });
                }

            },
            error: function (er) {
                
            }
        })
        
        
    }
}