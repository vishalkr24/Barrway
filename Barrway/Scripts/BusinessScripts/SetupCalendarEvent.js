var templateList = [];
var locationList = [];
var serviceProviderList = [];
const createdCalendarCode = $("#calendarCodeInput").val();
const createdCompanyCode = $("#companyCodeInput").val();
const createdCalendarType = $("#calendarCategoryInput").val();
var createdServiceType = "";

$(document).ready(function () {

    readyPage();
    setTimeout(function () {
        $("#calendarsMegaMenu").addClass("active");
    }, 500);

});

function readyPage() {
    checkRegistrationStep();

    let step = window.location.href.split('?')[1].replaceAll('&&', '&').split('&')[2].split('=')[1];
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

function moveToStep(stepId, helper = '') {
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
        case 6:
            BindStep6(helper);
        default:
            break;
    };
}

function backToStep(stepId) {
    switch (stepId) {
        case 2:
            goToStep2();
            break;
        case 3:
            bindCalendarLocationMaster();
            break;
        case 4:
            bindCalendarServiceProviderMaster();
            break;
        case 5:
            BindEventData();
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

$(document).on("click", "input[name=servicePaid]", function () {
    if ($(this).val() == "Y") {
        $("#feesPerSession").attr("disabled", false);
        $("#feesPerSessionDiv").fadeIn();
        $("label[for=feesPerSession]").text("Fees per Session *")
    } else {
        $("#feesPerSession").val("0");
        $("#feesPerSession").attr("disabled", true);
        $("#feesPerSessionDiv").fadeOut();
        $("label[for=feesPerSession]").text("Fees per Session")
    }
})

function BindEventData() {
    $("#step-3").hide();
    $("#step-4").hide();
    $("#step-6").fadeOut();
    setTimeout(function () {
        $("#step-5").fadeIn();
    }, 500)

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
            var divString = "";

            if (data != null) {
                if (data.length <= 0) {
                    window.location.replace(`/BusinessAdmin/SetupCalendarEvent?CompanyId=${localStorage.getItem("COMPANY_ID")}&CalendarCode=${createdCalendarCode}&Step=3`);
                    return;
                }

                data.forEach(x => {
                    divString += `<option value="${x.Id}">${x.LOCATION_ADDRESS}</option>`;
                })

            } else {
                window.location.replace(`/BusinessAdmin/SetupCalendarEvent?CompanyId=${localStorage.getItem("COMPANY_ID")}&CalendarCode=${createdCalendarCode}&Step=3`)
                return;
            }

            $("#sessionLocationMaster").append(divString);
        },
        error: function (er) {

        }
    })

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
            var divString = "";

            if (data != null) {
                if (data.length <= 0) {
                    window.location.replace(`/BusinessAdmin/SetupCalendarEvent?CompanyId=${localStorage.getItem("COMPANY_ID")}&CalendarCode=${createdCalendarCode}&Step=4`);
                    return;
                }

                data.forEach(x => {
                    divString += `<option value="${x.Id}">${x.FIRST_NAME} ${x.LAST_NAME}</option>`;
                })

            } else {
                window.location.replace(`/BusinessAdmin/SetupCalendarEvent?CompanyId=${localStorage.getItem("COMPANY_ID")}&CalendarCode=${createdCalendarCode}&Step=4`);
                return;
            }

            $("#sessionServiceProviderMaster").append(divString);
        },
        error: function (er) {

        }
    })
}

function submitCalendar() {


    var scheduleTableData = {
        "Monday": {
            "Start": $("#Monday_Start_Time").val(),
            "End": $("#Monday_End_Time").val()
        },
        "Tuesday": {
            "Start": $("#Tuesday_Start_Time").val(),
            "End": $("#Tuesday_End_Time").val(),
        },
        "Wednesday": {
            "Start": $("#Wednesday_Start_Time").val(),
            "End": $("#Wednesday_End_Time").val(),
        },
        "Thursday": {
            "Start": $("#Thursday_Start_Time").val(),
            "End": $("#Thursday_End_Time").val(),
        },
        "Friday": {
            "Start": $("#Friday_Start_Time").val(),
            "End": $("#Friday_End_Time").val()
        },
        "Saturday": {
            "Start": $("#Saturday_Start_Time").val(),
            "End": $("#Saturday_End_Time").val()
        },
        "Sunday": {
            "Start": $("#Sunday_Start_Time").val(),
            "End": $("#Saturday_End_Time").val()
        }
    };

    var data = {
        Id: 0,
        COMPANY_CODE: localStorage.getItem("COMPANY_CODE"),
        CALENDAR_CODE: localStorage.getItem("CALENDAR_CODE"),
        SCH__NAME: "",
        SCH_LOCATION: $("#sessionLocationMaster option:selected").val(),
        SCH_ACTIVITY: 0,
        SCH_RESOURCE: $("#sessionServiceProviderMaster option:selected").val(),
        SCH_MEDIUM: "ZOOM",
        SCH_DESCRIPTION: "",
        SCH_FROM_DATE: $("#SCH_FROM_DATE").val(),
        SCH_TO_DATE: $("#SCH_TO_DATE").val(),
        SCH_DAYS: 0,
        SCH_ALTERNATIVE_WEEK: "EVERY-WEEK",
        IF_SLOT_EXIST: "SKIP",
        IF_SLOT_DOES_NOT_EXIST: "INSERT",
        table: scheduleTableData,
        CREATION_TYPE: "MANUAL"
    }

    if (validateSchedularFormData(data)) {
        //data = JSON.stringify(data);

        var dataModel = {
            COMPANY_CODE: createdCompanyCode,
            CALENDAR_CODE: createdCalendarCode,
            ACTIVITY_NAME: $("#serviceName").val(),
            fees_1: $("#feesPerSession").val(),
            IS_SERVICE_PAID: $("input[name=servicePaid]:checked").val(),
            SERVICE_TYPE: createdServiceType
        }

        $.ajax({
            url: "/Calendar/AddMasterData",
            method: "POST",
            beforeSend: function () {
                $(".favicon-loader-overlay").removeClass("ng-hide");
            },
            complete: function () {
                $(".favicon-loader-overlay").removeClass("ng-hide");
            },
            data: {
                data: [dataModel],
                ModelId: 3
            },
            success: function (response) {
                // after success response
                if (response.Status) {

                    data.SCH_ACTIVITY = response.Data;

                    $.ajax({
                        url: "/Calendar/AddSchedule",
                        method: "POST",
                        beforeSend: function () {
                            $(".favicon-loader-overlay").removeClass("ng-hide");
                        },
                        complete: function () {
                            $(".favicon-loader-overlay").addClass("ng-hide");
                        },
                        data: { dataList: [data] },
                        dataType: "json",
                        success: function (response) {
                            // after success response
                            if (response == "Success") {

                                swal({
                                    icon: "success",
                                    title: "Session Created",
                                    text: "Sessions created successfully!"
                                }).then(function (check) {
                                    window.location.href = '/BusinessAdmin/CalendarMaster';
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

    } else {
         window.scrollTo({ top: 0, behavior: 'smooth' });
    }


    return;
    swal({
        icon: "success",
        title: "Success",
        text: "Calendar created successfully!"
    }).then(function (check) {
        window.location.replace("/BusinessAdmin/CalendarMaster");
    });
}

function validateSchedularFormData(data) {
    debugger;
    var finalCheck = true;
    
    if ($("#serviceName").val() == "" || $("#serviceName").val() == null) {
        finalCheck = false;
        $("#SCH_ACTIVITY_ERROR").show();
    } else {
        $("#SCH_ACTIVITY_ERROR").hide();
    }

    if (createdServiceType == "Package") {
        if ($("#maxParticipants").val() == "" || $("#maxParticipants").val() == null) {
            finalCheck = false;
            $("#SCH_PARTI_ERROR").show();
        } else {
            $("#SCH_PARTI_ERROR").hide();
        }
    }

    if ($("input[name=servicePaid]:checked").val() == "Y") {
        if ($("#feesPerSession").val() == "" || $("#feesPerSession").val() == null) {
            finalCheck = false;
            $("#SCH_FEES_ERROR").show();
        } else {
            $("#SCH_FEES_ERROR").hide();
        }
    }

    if (data.SCH_LOCATION == "" || data.SCH_LOCATION == null) {
        finalCheck = false;
        $("#SCH_LOCATION_ERROR").show();
    } else {
        $("#SCH_LOCATION_ERROR").hide();
    }

    if (data.SCH_RESOURCE == "" || data.SCH_RESOURCE == null) {
        finalCheck = false;
        $("#SCH_RESOURCE_ERROR").show();
    } else {
        $("#SCH_RESOURCE_ERROR").hide();
    }

    if (data.SCH_FROM_DATE == "" || data.SCH_FROM_DATE == null) {
        finalCheck = false;
        $("#SCH_FROM_DATE_ERROR").show();
    } else {
        $("#SCH_FROM_DATE_ERROR").hide();
    }

    if (data.SCH_TO_DATE == "" || data.SCH_TO_DATE == null) {
        finalCheck = false;
        $("#SCH_TO_DATE_ERROR").show();
    } else {
        $("#SCH_TO_DATE_ERROR").hide();
    }

    if (data.SCH_FROM_DATE > data.SCH_TO_DATE) {
        alert("From date should be earlier than To date.");
        finalCheck = false;
    }

    var temp = false;
    for (let key in data.table) {
        if (data.table.hasOwnProperty(key)) {
            if (data.table[key].Start != "" && data.table[key].End != "") {
                temp = true;
            }
        }
    }

    if (!temp) {
        finalCheck = false;
        $("#SCH_TIME_ERROR").show();
    } else {
        $("#SCH_TIME_ERROR").hide();
    }

    return finalCheck;
}

function BindStep6(type) {
    $("#step-4").hide();
    $("#step-5").fadeOut();
    setTimeout(function () {
        $("#step-6").fadeIn();
    }, 500)

    $("#calendarType" + type).prop("checked", true);

    createdServiceType = type;
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

    $("#step-4").fadeOut();
    $("#step-5").fadeOut();
    $("#step-6").fadeOut();
    setTimeout(function () {
        $("#step-3").fadeIn();
    }, 500);

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
            var divString = "";

            if (data != null) {

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


            } else {
                locationList.push({
                    Id: 1,
                    CALENDAR_CODE: createdCalendarCode,
                    COMPANY_CODE: createdCompanyCode,
                    LOCATION_ADDRESS: "",
                    Is_New: true
                });

                divString += `<div class="form-group">
                                            <label for="calendarname">Location*</label>

                                            <input type="text" class="form-control location-input" placeholder="" value="" data-input-id="1">
                                        </div>`;
            }

            $("#locations-div").append(divString);
        },
        error: function (er) {

        }
    })

}

function bindCalendarServiceProviderMaster() {

    $("#step-5").fadeOut();
    $("#step-3").fadeOut();
    $("#step-6").fadeOut();
    setTimeout(function () {
        $("#step-4").fadeIn();
    }, 500);

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
            var divString = "";

            if (data != null) {

                serviceProviderList = [];

                if (data.length > 0) {

                } else {
                    serviceProviderList.push({
                        Id: 1,
                        CALENDAR_CODE: createdCalendarCode,
                        COMPANY_CODE: createdCompanyCode,
                        FIRST_NAME: "",
                        LAST_NAME: "",
                        Is_New: false
                    });

                    divString += `      <div class="row">
                                            <p class="sp">Service provider</p>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label for="calendarname">First Name *</label>

                                                    <input type="text" class="form-control provider-first-input" placeholder="" value="" data-input-id="1">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label for="calendarname">Last Name *</label>

                                                    <input type="text" class="form-control provider-last-input" placeholder="" value="" data-input-id="1">
                                                </div>
                                            </div>
                                        </div>
                                       `;
                }

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

            } else {
                serviceProviderList.push({
                    Id: 1,
                    CALENDAR_CODE: createdCalendarCode,
                    COMPANY_CODE: createdCompanyCode,
                    FIRST_NAME: "",
                    LAST_NAME: "",
                    Is_New: true
                });

                divString += `      <div class="row">
                                            <p class="sp">Service provider</p>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label for="calendarname">First Name *</label>

                                                    <input type="text" class="form-control provider-first-input" placeholder="" value="" data-input-id="1">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label for="calendarname">Last Name *</label>

                                                    <input type="text" class="form-control provider-last-input" placeholder="" value="" data-input-id="1">
                                                </div>
                                            </div>
                                        </div>
                                       `;
            }

            $("#providers-div").append(divString);
        },
        error: function (er) {

        }
    })
}

function getMaxId(arr) {
    let max = 1;
    if (arr != null) {
        if (arr.length > 0) {
            max = arr[0].Id;
            arr.forEach(x => {
                if (x.Id > max) {
                    max = x.Id;
                }
            })
        }
    }

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

function setSameTime() {
    $("#Tuesday_Start_Time").val($("#Monday_Start_Time").val());
    $("#Tuesday_End_Time").val($("#Monday_End_Time").val());

    $("#Wednesday_Start_Time").val($("#Monday_Start_Time").val());
    $("#Wednesday_End_Time").val($("#Monday_End_Time").val());

    $("#Thursday_Start_Time").val($("#Monday_Start_Time").val());
    $("#Thursday_End_Time").val($("#Monday_End_Time").val());

    $("#Friday_Start_Time").val($("#Monday_Start_Time").val());
    $("#Friday_End_Time").val($("#Monday_End_Time").val());

    $("#Saturday_Start_Time").val($("#Monday_Start_Time").val());
    $("#Saturday_End_Time").val($("#Monday_End_Time").val());

    $("#Sunday_Start_Time").val($("#Monday_Start_Time").val());
    $("#Sunday_End_Time").val($("#Monday_End_Time").val());
}

function setSameDateValue() {
    if ($("input[name=TimeSameAsMonday]:checked").val() == "on") {
        setSameTime();
    }
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

$(document).on("keyup change paste", ".provider-first-input", function () {
    let inputId = $(this).attr("data-input-id");
    serviceProviderList.find(x => x.Id == inputId).FIRST_NAME = this.value;
})

$(document).on("keyup change paste", ".provider-last-input", function () {
    let inputId = $(this).attr("data-input-id");
    serviceProviderList.find(x => x.Id == inputId).LAST_NAME = this.value;
})

function removeLocation(Id) {
    if (locationList.filter(x => x.Id == Id).length > 0) {
        if (locationList.find(x => x.Id == Id).Is_New) {
            locationList = locationList.filter(x => x.Id != Id);
            $("#location-elem-" + Id).remove();
        }
    }
}

function removeProvider(Id) {
    if (serviceProviderList.filter(x => x.Id == Id).length > 0) {
        if (serviceProviderList.find(x => x.Id == Id).Is_New) {
            serviceProviderList = serviceProviderList.filter(x => x.Id != Id);
            $("#provider-elem-" + Id).remove();
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
                        window.location.href = '/BusinessAdmin/SetupCalendarEvent?CompanyId=' + localStorage.getItem("COMPANY_ID") + "&CalendarCode=" + createdCalendarCode + "&Step=4";
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
                        window.location.href = '/BusinessAdmin/SetupCalendarEvent?CompanyId=' + localStorage.getItem("COMPANY_ID") + "&CalendarCode=" + createdCalendarCode + "&Step=5";
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