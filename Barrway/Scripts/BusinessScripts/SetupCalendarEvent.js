var templateList = [];
var locationList = [];
var serviceList = [];
var locationModelList = [];
var providerModelList = [];
var serviceProviderList = [];
var serviceModelList = [];
const createdCalendarCode = $("#calendarCodeInput").val();
const createdCompanyCode = $("#companyCodeInput").val();
const createdCalendarType = $("#calendarCategoryInput").val();
var createdServiceType = "";
var ConfigData = {};
var CalendarData = {};

$(document).ready(function () {

    readyPage();
    setTimeout(function () {
        $("#calendarsMegaMenu").addClass("active");
    }, 500);

});

function readyPage() {
    checkRegistrationStep();

    ConfigData = JSON.parse(getCalendarSetupMatrix());
    CalendarData = getSingleCalendar(createdCalendarCode);
    
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
            updateCalendarType(helper);
            //bindCalendarLocationMaster();
            break;
        case 4:
            createLocationMaster();
            break;
        case 5:
            createServiceProviderMaster();
            break;
        case 6:
            createServiceMaster();
        default:
            break;
    };
}

function backToStep(stepId) {
    switch (stepId) {
        case 1:
            goToStep1();
            break;
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
            BindStep5();
            break;
        case 6:
            BindStep6();
        default:
            break;
    };
}

function skipToStep(stepId) {
    window.location.href = "/BusinessAdmin/SetupCalendarEvent?CompanyId=" + localStorage.getItem("COMPANY_ID") + "&&CalendarCode=" + createdCalendarCode + "&&Step=" + stepId;
}

function goToStep1() {
    swal({
        icon: "warning",
        title: "Are you sure!",
        text: "Are you sure to go back to step 1?"
    }).then(function (check) {
        if (check) {
            window.location.replace(`/BusinessAdmin/SetupCompanyCalendar?CompanyId=${localStorage.getItem("COMPANY_ID")}&IsPartial=false&CalendarCode=${createdCalendarCode}`)
        }
    });
}

function configureStep(step) {
    debugger;
    let configStep = ConfigData["Type" + createdCalendarType]["Step" + step];

    // steps and common and special based on JSON architecture type
    let specialSteps = [5, 6, 7];

    if (specialSteps.includes(step)) {
        if (CalendarData.Data.CALENDAR_TYPE != undefined && CalendarData.Data.CALENDAR_TYPE != null) {
            configStep = configStep["2_" + CalendarData.Data.CALENDAR_TYPE];
        }
    }

    if (configStep.Is_Step == null || configStep.Is_Step == undefined) {
        alert("Something went wrong!");
        return;
    }

    if (configStep.Is_Step == true) {
        $("#step-" + step + " .template-binder").empty();

        if (configStep.Is_Kanban == true) {
            // bind Kanban Template
        } else {
            if (configStep.Has_Multiple_Steps == true) {
                $("#step-" + step + " .template-binder").append(`<div class="hed-til">
                        <p></p>
                    </div>

                    <div class="f_of_f-wrap-o">
                        <div class="choose">

                        </div>
                        <button type="button" onclick="backToStep(${(step - 1)})" class="back">Back</button>
                    </div>`);

                let counter = 1;
                let binderString = "";
                while (configStep.Steps["2_" + counter] != undefined && configStep.Steps["2_" + counter] != null) {
                    binderString += `<div class="chose-inner" onclick="moveToStep(${(parseInt(step) + 1)}, ${counter})">
                                <div class="one">
                                    <img src="${configStep.Steps["2_" + counter].Image}" onerror="this.src='../assets/svg/logos/favicon.png'" />
                                </div>
                                <div class="two">
                                    <p>${configStep.Steps["2_" + counter].Text}</p>
                                </div>
                                <div class="three">
                                    <p><img src="../assets/img/purple.png" /></p>
                                </div>
                            </div>`;
                    counter++;
                }
                $("#step-" + step + " .choose").append(binderString);
            } else {
                let masterName = "";
                let addFuncName = "";

                if (configStep.Title == "Location Master") {
                    masterName = "locations"
                    addFuncName = "addMoreLocation"
                }
                else if (configStep.Title == "Service Provider Master") {
                    masterName = "providers"
                    addFuncName = "addMoreProvider"
                }
                else if (configStep.Title == "Service Master") {
                    masterName = "service"
                    addFuncName = "addMoreService"
                }

                if (configStep.Is_Final_Step) {

                    $("#step-" + step + " .template-binder").append(`<div class="hed-til">
                        <p></p>
                    </div>

                    <div class="f_of_f-wrap-o">
                        <div class="choose">

                        </div>
                        <button type="button" onclick="backToStep(${(step - 1)})" class="back">Back</button>
                    </div>`);

                    let binderString = "";
                    let counter = 1;
                    while (configStep.Helpers["Helper_" + counter] != undefined && configStep.Helpers["Helper_" + counter] != null) {
                        binderString += `<div class="chose-inner" onclick="moveToStep(${(parseInt(step) + 1)}, ${counter})">
                                <div class="one">
                                    <img src="${configStep.Helpers["Helper_" + counter].Image}" onerror="this.src='../assets/svg/logos/favicon.png'" />
                                </div>
                                <div class="two">
                                    <p>${configStep.Helpers["Helper_" + counter].Text}</p>
                                </div>
                                <div class="three">
                                    <p><img src="../assets/img/purple.png" /></p>
                                </div>
                            </div>`;
                        counter++;
                    }

                    $("#step-" + step + " .choose").append(binderString);
                } else {
                    $("#step-" + step + " .template-binder").append(`<div class="hed-til">
                            <p class="heading-title"></p>
                        </div>
                        <div>

                            <div id="div1">
                                <div class="text-center">
                                    <div class="profile-form">
                                        
                                        <div style="text-align:right; color:crimson;">* mandatory</div>
                                        <div class="form-inner set-cal" style="max-width:100%;">
                                            <div id="${masterName}-div">

                                            </div>

                                            <div class="ycaml">
                                                <p>You can add more location if your event takes place in more than one location.</p>
                                                <button class="bg-t-b" onclick="${addFuncName}(null, true, true)">+Add more</button>
                                            </div>

                                            <button type="button" onclick="backToStep(${(step - 1)})" class="back">Back</button>
                                            <button type="button" style="display:none;" onclick="skipToStep(${(step + 1)})" class="back skip-button">Skip</button>
                                            <button type="button" class="btn btn-primary" onclick="moveToStep(${(step + 1)})">Next</button>

                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>`);
                }
            }
        }

        $("#step-" + step + " .hed-til p").text(configStep.Heading_Title);

        if (configStep.Is_Skippable == true) {
            $("#step-" + step + " .skip-button").show();
        } else {
            $("#step-" + step + " .skip-button").hide();
        }

        if (configStep.Helper_After_Form != null && configStep.Helper_After_Form != undefined) {

        }

    } else {
        backToStep((parseInt(step) + 1));
    }

    $("#step-" + step).fadeIn();
}

function goToStep2() {
    $("#step-3").fadeOut();
    $("#step-4").fadeOut();
    $("#step-5").fadeOut();

    configureStep(2);
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

function BindStep5(type) {
    $("#step-4").hide();
    $("#step-5").fadeOut();
    debugger;
    configureStep(5);

    $("#ddlMasterCalendar").val(createdCalendarCode);
    localStorage.setItem("CALENDAR_CODE", createdCalendarCode)
    $(".selectable-calendar-item").removeClass("selected");
    setTimeout(function () {
        $(".selectable-calendar-item[data-id=CLR_SEL_" + localStorage.getItem("CALENDAR_CODE") + "]").addClass("selected");
        $(".lbl-calendar-name").text($("#ddlMasterCalendar option:selected").text());
    }, 500);

    // Define Location Model
    $.ajax({
        url: "/FormAPI/ManageForm",
        method: "POST",
        async: false,
        data: {
            data: {
                action: 7,
                formId: "2303"
            }
        },
        success: function (response) {
            debugger;
            if (response.length > 0) {

                var data = JSON.parse(response[0].fields);

                if (data["Page 1"] != null && data["Page 1"] != undefined) {
                    var data2 = JSON.parse(data["Page 1"]);

                    let containerClass = "";

                    if (data2 != null && data2 != undefined) {
                        data2 = data2.filter(x => x["required"] != undefined && x["required"] == true);
                    }

                    data2.forEach(x => {
                        serviceModelList.push({
                            label: x["label"],
                            containerClass: "col-md-" + parseInt(( 12/parseInt(100 / parseInt(x["column_width"])) )),
                            name: x["name"],
                            type: x["type"],
                            values: (x["type"] == "radio-group" || x["type"] == "select" || x["type"] == "checkbox-group") ? x["values"] : null
                        });

                    });

                }

            }


        },
        error: function (error) {

        }
    })

    // Bind Location Master
    $.ajax({
        url: "/Calendar/GetServiceMasterList",
        method: "POST",
        data: {
            data: {},
            companyCode: createdCompanyCode,
            calendarCode: createdCalendarCode
        },
        success: function (response) {

            var data = response.data;

            if (data != null) {

                locationList = [];

                data.forEach(x => {
                    addMoreService(x, false, false);
                });

                if (data.length == 0) {
                    addMoreService(null, false, true);
                }

            } else {
                addMoreService(null, false, true);
            }

        },
        error: function (er) {

        }
    })

    //createdServiceType = type;
}

function BindStep6(type) {
    $("#step-4").hide();
    $("#step-5").fadeOut();
    
    configureStep(6);

    $("#ddlMasterCalendar").val(createdCalendarCode);
    localStorage.setItem("CALENDAR_CODE", createdCalendarCode)
    $(".selectable-calendar-item").removeClass("selected");
    setTimeout(function () {
        $(".selectable-calendar-item[data-id=CLR_SEL_" + localStorage.getItem("CALENDAR_CODE") + "]").addClass("selected");
        $(".lbl-calendar-name").text($("#ddlMasterCalendar option:selected").text());
    }, 500);

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

function updateCalendarType(type) {
    $.ajax({
        url: "/BusinessAdmin/UpdateCalendarType",
        method: "POST",
        data: {
            CalendarCode: createdCalendarCode,
            CalendarType: type
        },
        success: function (response) {
            if (response.Status) {

                window.location.replace(`/BusinessAdmin/SetupCalendarEvent?CompanyId=${localStorage.getItem("COMPANY_ID")}&CalendarCode=${createdCalendarCode}&Step=3`)

            } else {
                swal({
                    icon: "error",
                    title: "Error",
                    text: response.Message
                }).then(function () {
                    window.location.reload();
                })
            }
        },
        error: function (err) {

        }
    })
}

function bindCalendarLocationMaster() {

    $("#step-4").fadeOut();
    $("#step-5").fadeOut();
    $("#step-6").fadeOut();
    
    configureStep(3)

    $("#ddlMasterCalendar").val(createdCalendarCode);
    localStorage.setItem("CALENDAR_CODE", createdCalendarCode)
    $(".selectable-calendar-item").removeClass("selected");
    setTimeout(function () {
        $(".selectable-calendar-item[data-id=CLR_SEL_" + localStorage.getItem("CALENDAR_CODE") + "]").addClass("selected");
        $(".lbl-calendar-name").text($("#ddlMasterCalendar option:selected").text());
    }, 500);

    // Define Location Model
    $.ajax({
        url: "/FormAPI/ManageForm",
        method: "POST",
        async: false,
        data: {
            data: {
                action: 7,
                formId: "2306"
            }
        },
        success: function (response) {

            if (response.length > 0) {

                var data = JSON.parse(response[0].fields);

                if (data["Page 1"] != null && data["Page 1"] != undefined) {
                    var data2 = JSON.parse(data["Page 1"]);

                    let containerClass = "";

                    if (data2 != null && data2 != undefined) {
                        data2 = data2.filter(x => x["required"] != undefined && x["required"] == true);
                    }

                    containerClass = (data2.length == 1) ? "col-md-12" : "col-md-6";

                    data2.forEach(x => {
                        locationModelList.push({
                            label: x["label"],
                            containerClass: containerClass,
                            name: x["name"],
                            type: x["type"],
                            values: (x["type"] == "radio-group" || x["type"] == "select" || x["type"] == "checkbox-group") ? x["values"] : null
                        });

                    });

                }

            }


        },
        error: function (error) {

        }
    })

    // Bind Location Master
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

                locationList = [];

                data.forEach(x => {
                    addMoreLocation(x, false, false);
                });

                if (data.length == 0) {
                    addMoreLocation(null, false, true);
                }

            } else {
                addMoreLocation(null, false, true);
            }

        },
        error: function (er) {

        }
    })

}

function bindCalendarServiceProviderMaster() {

    $("#step-5").fadeOut();
    $("#step-3").fadeOut();
    $("#step-6").fadeOut();

    configureStep(4);

    $("#ddlMasterCalendar").val(createdCalendarCode);
    localStorage.setItem("CALENDAR_CODE", createdCalendarCode)
    $(".selectable-calendar-item").removeClass("selected");
    setTimeout(function () {
        $(".selectable-calendar-item[data-id=CLR_SEL_" + localStorage.getItem("CALENDAR_CODE") + "]").addClass("selected");
        $(".lbl-calendar-name").text($("#ddlMasterCalendar option:selected").text());
    }, 500);

    // Define Provider Model
    $.ajax({
        url: "/FormAPI/ManageForm",
        method: "POST",
        async: false,
        data: {
            data: {
                action: 7,
                formId: "2304"
            }
        },
        success: function (response) {

            if (response.length > 0) {

                var data = JSON.parse(response[0].fields);

                if (data["Page 1"] != null && data["Page 1"] != undefined) {
                    var data2 = JSON.parse(data["Page 1"]);

                    let containerClass = "";

                    if (data2 != null && data2 != undefined) {
                        data2 = data2.filter(x => x["required"] != undefined && x["required"] == true);
                    }

                    containerClass = (data2.length == 1) ? "col-md-12" : "col-md-6";

                    data2.forEach(x => {
                        providerModelList.push({
                            label: x["label"],
                            containerClass: containerClass,
                            name: x["name"],
                            type: x["type"],
                            values: (x["type"] == "radio-group" || x["type"] == "select" || x["type"] == "checkbox-group") ? x["values"] : null
                        });

                    });

                }

            }


        },
        error: function (error) {

        }
    })

    // BInd Provider Data
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

                serviceProviderList = [];

                data.forEach(x => {
                    addMoreProvider(x, false, false)
                })

                if (data.length == 0) {
                    addMoreProvider(null, false, true)
                }

            } else {
                addMoreProvider(null, false, true)
            }
        },
        error: function (er) {

        }
    })
}

function addMoreProvider(dataItem, isRemovable, isNew) {

    let dataModel = {
        Id: (dataItem == null) ? parseInt(getMaxId(serviceProviderList)) + 1 : dataItem.Id,
        CALENDAR_CODE: createdCalendarCode,
        COMPANY_CODE: createdCompanyCode,
        Is_New: isNew
    };

    $("#providers-div").append(`<div class="form" id="provider-elem-${dataModel.Id}"> ${(isRemovable) ? `<div class="element-remover" onclick="removeProvider(${dataModel.Id})"><i class="fa fa-times" aria-hidden="true"></i></div>` : ""} <div class="row"></div></div>`)

    providerModelList.forEach(x => {

        dataModel[x.name] = (dataItem == null) ? "" : dataItem[x.name];

        $("#providers-div #provider-elem-" + dataModel.Id + " .row").append(`<div class="${x.containerClass}">
                                            <div class="form-group">
                                                ${generateInputBox(x, dataModel.Id, "provider-input")}
                                            </div>
                                        </div>`);

        $(`input[name=${x.name}${dataModel.Id}]`).val(dataModel[x.name]);
    });

    serviceProviderList.push(dataModel);
    setTimeout(function () {
        providerModelList.forEach(x => {
            $(`input[name^=${x.name}]`).bind("keyup change paste", function () {
                let inputId = $(this).attr("data-input-id");
                serviceProviderList.find(y => y.Id == inputId)[x.name] = this.value;
            });
        });
    }, 500);

}

function addMoreLocation(dataItem, isRemovable, isNew) {
    debugger;
    let dataModel = {
        Id: (dataItem == null) ? parseInt(getMaxId(locationList)) + 1 : dataItem.Id,
        CALENDAR_CODE: createdCalendarCode,
        COMPANY_CODE: createdCompanyCode,
        Is_New: isNew
    };

    $("#locations-div").append(`<div class="form" id="location-elem-${dataModel.Id}"> ${(isRemovable) ? `<div class="element-remover" onclick="removeLocation(${dataModel.Id})"><i class="fa fa-times" aria-hidden="true"></i></div>` : ""} <div class="row"></div></div>`)

    locationModelList.forEach(x => {

        dataModel[x.name] = (dataItem == null) ? "" : dataItem[x.name];

        $("#locations-div #location-elem-" + dataModel.Id + " .row").append(`<div class="${x.containerClass}">
                                            <div class="form-group">
                                                ${generateInputBox(x, dataModel.Id, "location-input")}
                                            </div>
                                        </div>`);

        $(`input[name=${x.name}${dataModel.Id}]`).val(dataModel[x.name]);
    });

    locationList.push(dataModel);
    setTimeout(function () {
        locationModelList.forEach(x => {
            $(`input[name^=${x.name}]`).bind("keyup change paste", function () {
                let inputId = $(this).attr("data-input-id");
                locationList.find(y => y.Id == inputId)[x.name] = this.value;
            })
        });
    }, 500);
}

function addMoreService(dataItem, isRemovable, isNew) {
    debugger;
    let dataModel = {
        Id: (dataItem == null) ? parseInt(getMaxId(serviceList)) + 1 : dataItem.Id,
        CALENDAR_CODE: createdCalendarCode,
        COMPANY_CODE: createdCompanyCode,
        Is_New: isNew
    };

    $("#service-div").append(`<div class="form" id="service-elem-${dataModel.Id}"> ${(isRemovable) ? `<div class="element-remover" onclick="removeService(${dataModel.Id})"><i class="fa fa-times" aria-hidden="true"></i></div>` : ""} <div class="row mt-2"></div></div>`)

    serviceModelList.forEach(x => {

        dataModel[x.name] = (dataItem == null) ? "" : dataItem[x.name];

        $("#service-div #service-elem-" + dataModel.Id + " .row").append(`<div class="${x.containerClass}">
                                            <div class="form-group">
                                                ${generateInputBox(x, dataModel.Id, "location-input")}
                                            </div>
                                        </div>`);

        $(`input[name=${x.name}${dataModel.Id}]`).val(dataModel[x.name]);
    });

    serviceList.push(dataModel);
    setTimeout(function () {
        serviceModelList.forEach(x => {
            $(`input[name^=${x.name}]`).bind("keyup change paste", function () {
                let inputId = $(this).attr("data-input-id");
                serviceList.find(y => y.Id == inputId)[x.name] = this.value;
            })
        });
    }, 500);
}

function generateInputBox(modelItem, id, additionalClass) {

    let value = "";

    switch (modelItem.type) {
        case "text":
            value = `
                    <label for="${modelItem.name}${id}">${modelItem.label}*</label>
                    <input class="form-control ${additionalClass}" type="text" name="${modelItem.name}${id}" data-input-id="${id}"/>`;
            break;
        case "number":
            value = `
                    <label for="${modelItem.name}${id}">${modelItem.label}*</label>
                    <input class="form-control ${additionalClass}" type="number" name="${modelItem.name}${id}" data-input-id="${id}"/>`;
            break;
        case "date":
            value = `
                    <label for="${modelItem.name}${id}">${modelItem.label}*</label>
                    <input class="form-control ${additionalClass}" type="date" name="${modelItem.name}${id}" data-input-id="${id}"/>`;
            break;
        case "radio-group":
            if (modelItem.values != null) {
                value += `<label for="${modelItem.name}${id}">${modelItem.label} *</label> <br />`;
                debugger;
                modelItem.values.forEach(x => {
                    value += `
                            <div style="float:left;">
                                <input type="radio" ${(x.selected == true) ? "checked" : ""} class="" id="${modelItem.name}${x.value}${id}" name="${modelItem.name}${id}" value="${x.value}" data-input-id="${id}">
                                <label class="form-check-label" for="${modelItem.name}${x.value}${id}">${x.label}</label>
                            </div>
                            `
                });
            }
            break;
        case "checkbox-group":
            if (modelItem.values != null) {
                value += `<label for="${modelItem.name}${id}">${modelItem.label} *</label> <br />`;
                modelItem.values.forEach(x => {
                    value += `
                            <div style="float:left;">
                                <input type="checkbox" class="" id="${modelItem.name}${x.value}${id}" name="${modelItem.name}${id}" value="${x.value}" data-input-id="${id}">
                                <label class="form-check-label" for="${modelItem.name}${x.value}${id}">${x.label}</label>
                            </div>
                            `
                });
            }
            break;
        case "select":
            if (modelItem.values != null) {
                value += `<label for="${modelItem.name}${id}">${modelItem.label} *</label> <br /><select class="form-control" name="${modelItem.name}${id}" data-input-id="${id}">`;
                modelItem.values.forEach(x => {
                    value += `
                            <option value="${x.value}">${x.label}</option>
                            `
                });
                value += "</select>";
            }
            break;
        default:
            break;
    }

    return value;
}

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

function removeService(Id) {
    if (serviceList.filter(x => x.Id == Id).length > 0) {
        if (serviceList.find(x => x.Id == Id).Is_New) {
            serviceList = serviceList.filter(x => x.Id != Id);
            $("#service-elem-" + Id).remove();
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
    if (true) {

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

function createServiceMaster() {
    if (true) {
        $.ajax({
            url: "/Calendar/AddMasterData",
            method: "POST",
            data: {
                data: locationList,
                ModelId: 3
            },
            success: function (response) {
                // after success response
                if (response.Status) {
                    swal({
                        icon: "success",
                        title: "Service Added",
                        text: "Service added successfully!"
                    }).then(function (check) {
                        window.location.href = '/BusinessAdmin/SetupCalendarEvent?CompanyId=' + localStorage.getItem("COMPANY_ID") + "&CalendarCode=" + createdCalendarCode + "&Step=6";
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
    if (true) {
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



// Helper functions
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
