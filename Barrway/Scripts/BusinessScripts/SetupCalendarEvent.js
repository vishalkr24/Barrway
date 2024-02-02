var dataList = [];
var dataModelList = [];
var staffServiceMapping = [];
const createdCalendarCode = $("#calendarCodeInput").val();
const createdCompanyCode = $("#companyCodeInput").val();
const createdCalendarType = $("#calendarCategoryInput").val();
var ConfigData = {};
var ConfigStep = {};
var CurrentStep = 0;
var CalendarData = {};

$(document).ready(function () {

    readyPage();
    setTimeout(function () {
        $("#calendarsMegaMenu").addClass("active");
    }, 500);

});

$(document).on("change", "input[name=staff-service-mapper-input]", function () {
    let serviceId = $(this).attr("data-service-id");
    let providerId = $(this).attr("data-provider-id");

    staffServiceMapping
        .find(x => x.SERVICE_ID == serviceId && x.SERVICE_PROVIDER_ID == providerId)
        .checked = ($(this).is(":checked")) ? true : false;

    if ($(this).is(":checked")) {
        $(`#SS_IMG_${serviceId}_${providerId}`).show();
    } else {
        $(`#SS_IMG_${serviceId}_${providerId}`).hide();
    }
    

})

function readyPage() {
    checkRegistrationStep();

    ConfigData = JSON.parse(getCalendarSetupMatrix());
    CalendarData = getSingleCalendar(createdCalendarCode);

    CurrentStep = window.location.href.split('?')[1].replaceAll('&&', '&').split('&')[2].split('=')[1];
    bindStep(CurrentStep);

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

//function moveToStep(stepId, helper = '') {
//    switch (stepId) {
//        case 2:
//            goToStep2();
//            break;
//        case 3:
//            updateCalendarType(helper);
//            //bindCalendarLocationMaster();
//            break;
//        case 4:
//            createLocationMaster();
//            break;
//        case 5:
//            createServiceProviderMaster();
//            break;
//        case 6:
//            createServiceMaster();
//        default:
//            break;
//    };
//}

//function backToStep(stepId) {
//    switch (stepId) {
//        case 1:
//            goToStep1();
//            break;
//        case 2:
//            goToStep2();
//            break;
//        case 3:
//            bindCalendarLocationMaster();
//            break;
//        case 4:
//            bindCalendarServiceProviderMaster();
//            break;
//        case 5:
//            BindStep5();
//            break;
//        case 6:
//            BindStep6();
//        default:
//            break;
//    };
//}

function skipToStep(stepId) {
    window.location.href = "/BusinessAdmin/SetupCalendarEvent?CompanyId=" + localStorage.getItem("COMPANY_ID") + "&&CalendarCode=" + createdCalendarCode + "&&Step=" + stepId;
}

function backToStep(stepId) {
    window.location.href = "/BusinessAdmin/SetupCalendarEvent?CompanyId=" + localStorage.getItem("COMPANY_ID") + "&&CalendarCode=" + createdCalendarCode + "&&Step=" + stepId;
}

function bindStep(step) {
    debugger;
    $("#ddlMasterCalendar").val(createdCalendarCode);
    localStorage.setItem("CALENDAR_CODE", createdCalendarCode)
    $(".selectable-calendar-item").removeClass("selected");
    setTimeout(function () {
        $(".selectable-calendar-item[data-id=CLR_SEL_" + localStorage.getItem("CALENDAR_CODE") + "]").addClass("selected");
        $(".lbl-calendar-name").text($("#ddlMasterCalendar option:selected").text());
    }, 500);

    if (step == 1) {
        swal({
            icon: "warning",
            title: "Are you sure!",
            text: "Are you sure to go back to step 1?"
        }).then(function (check) {
            if (check) {
                window.location.replace(`/BusinessAdmin/SetupCompanyCalendar?CompanyId=${localStorage.getItem("COMPANY_ID")}&IsPartial=false&CalendarCode=${createdCalendarCode}`)
            }
        });
    } else {

        ConfigStep = ConfigData["Type" + createdCalendarType]["Step" + step];

        if (ConfigStep.Is_Based_On_Category) {
            if (CalendarData.Data.CALENDAR_TYPE != undefined && CalendarData.Data.CALENDAR_TYPE != null) {
                ConfigStep = ConfigStep.Category["2_" + CalendarData.Data.CALENDAR_TYPE];
            }
        }

        switch (ConfigStep.View_Name) {
            case "MULTI_VIEW":
                BindMultiViewTemplate();
                break;
            case "DYNAMIC_FORM":
                BindDynamicFormTemplate();
                break;
            case "FINAL_VIEW":
                BindFinalViewTemplate();
                break;
            case "STAFF_SERVICE_MAPPING_VIEW":
                BindStaffServiceMappingTemplate();
                break;
            default:
                break;
        }

        if (ConfigStep.View_Name != "FINAL_VIEW") {
            $("#step .step-counter").text("Step " + step + " of 6");

            $("#step .hed-til p").text(ConfigStep.Heading_Title);

            if (ConfigStep.Is_Skippable == true) {
                $("#step .skip-button").show();
            } else {
                $("#step .skip-button").hide();
            }
        }
        

    }
}

function BindMultiViewTemplate() {

    let counter = 1;
    let binderString = "";

    $("#step .template-binder").append(`<div class="hed-til">
                        <p class="step"></p>
                    </div>

                    <div class="f_of_f-wrap-o">
                        <div class="choose">

                        </div>
                        <button type="button" onclick="backToStep(${(parseInt(CurrentStep) - 1)})" class="back">Back</button>
                    </div>`);

    while (ConfigStep.Steps["Step" + counter] != undefined) {
        binderString += `<div class="chose-inner" onclick="updateCalendarType(${counter})">
                                <div class="one">
                                    <img src="${ConfigStep.Steps["Step" + counter].Image}" onerror="this.src='../assets/svg/logos/favicon.png'" />
                                </div>
                                <div class="two">
                                    <p>${ConfigStep.Steps["Step" + counter].Text}</p>
                                </div>
                                <div class="three">
                                    <p><img src="../assets/img/purple.png" /></p>
                                </div>
                            </div>`;
        counter++;
    }

    $("#step .template-binder .choose").append(binderString);

}

function BindDynamicFormTemplate() {

    let formId = ConfigStep.Form_Id;
    
    $("#step .template-binder").append(`<div class="hed-til">
                            <p class="heading-title step"></p>
                        </div>
                        <div>

                            <div id="div1">
                                <div class="text-center">
                                    <div class="profile-form">
                                        
                                        <div style="text-align:right; color:crimson;">* mandatory</div>
                                        <div class="form-inner set-cal" style="max-width:100%; margin-bottom: 1em;">
                                            <div id="service-div" class="service-div">

                                            </div>

                                            <div class="ycaml">
                                                <p>You can add more location if your event takes place in more than one location.</p>
                                                <button class="bg-t-b" onclick="addMoreRow(null, true, true)">+Add more</button>
                                            </div>

                                            <button type="button" onclick="backToStep(${(parseInt(CurrentStep) - 1)})" class="back">Back</button>
                                            <button type="button" style="display:none;" onclick="skipToStep(${(parseInt(CurrentStep) + 1)})" class="back skip-button">Skip</button>
                                            <button type="button" class="btn btn-primary" onclick="createMasterData(${(parseInt(CurrentStep) + 1)})">Next</button>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div class="blocks">

                        </div>`);

    
    if (ConfigStep.Helper_After_Form != null && ConfigStep.Helper_After_Form != undefined) {

        let counter = 1;
        let binderString = "";

        $(".blocks").empty();

        while (ConfigStep.Helper_After_Form["Helper_" + counter] != undefined) {
            binderString += `<div class="block-inner">
                    <div class="block-image">
                        <img src="${ConfigStep.Helper_After_Form["Helper_" + counter].Image}" onerror="this.src='/assets/marketplace/image/hands.png'">
                    </div>
                    <div class="block-text">
                        <p>${ConfigStep.Helper_After_Form["Helper_" + counter].Text} </p>
                    </div>
                </div>`;
            counter++;
        }

        $(".blocks").append(binderString);
    }

    // Define Data Model
    $.ajax({
        url: "/FormAPI/ManageForm",
        method: "POST",
        async: false,
        data: {
            data: {
                action: 7,
                formId: formId
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

                    if (ConfigStep.Form_Fields != undefined && ConfigStep.Form_Fields != undefined) {
                        data2 = data2.filter(x => ConfigStep.Form_Fields.find(y => y == x.name));
                    }

                    data2.forEach(x => {
                        
                        dataModelList.push({
                            label: x["label"],
                            containerClass: "col-md-" + parseInt((12 / parseInt(100 / parseInt(x["column_width"])))),
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

    // Bind Data Master
    let FormIdToMethod = {
        2303: "GetServiceMasterList",
        2304: "GetServiceProviderMasterList",
        2306: "GetLocationMasterList"
    }

    $.ajax({
        url: "/Calendar/" + FormIdToMethod[formId],
        method: "POST",
        data: {
            data: {
                IsCustomFilter: true,
                filters: [{
                    field: "CALENDAR_CODE",
                    type: "=",
                    value: createdCalendarCode
                }]
            },
            companyCode: createdCompanyCode
        },
        success: function (response) {

            var data = response.data;

            if (data != null) {

                dataList = [];

                data.forEach(x => {
                    addMoreRow(x, false, false);
                });

                if (data.length == 0) {
                    addMoreRow(null, false, true);
                }

            } else {
                addMoreRow(null, false, true);
            }

        },
        error: function (er) {

        }
    })

}

function BindFinalViewTemplate() {

    let binderString = "";
    let counter = 1;

    $("#step .step-counter").text(ConfigStep.Success_Message);

    $("#step .template-binder").append(`<div class="hed-til">
                        <p class="step"></p>
                    </div>

                    <div class="f_of_f-wrap-o">
                        <div class="blocks">

                        </div>
                    </div>
                    `);

    while (ConfigStep.Helpers["Helper_" + counter] != undefined && ConfigStep.Helpers["Helper_" + counter] != null) {
        binderString += `<div class="block-inner">
                        <div class="block-image">
                            <img src="${ConfigStep.Helpers["Helper_" + counter].Image}" onerror="this.src='../assets/svg/logos/favicon.png'">
                        </div>
                        <div class="block-text">
                            <p>${ConfigStep.Helpers["Helper_" + counter].Text}</p>
                            <div class="block-lower">
                                <span><button class="my-button">Go</button></span>
                            </div>
                        </div>
                    </div>`;
        counter++;
    }

    $("#step .blocks").append(binderString);
}

function BindStaffServiceMappingTemplate() {
    
    $("#step .template-binder").append(`<div class="hed-til">
                            <p class="heading-title step"></p>
                        </div>
                        <div class="cal-table">
                            <div class="tab-notification">Tick on the box for the staff who can offer the service</div>
                            <div class="table-content">
                                <table id="mapper-table">
                                    <tbody>
                                    </tbody>
                                </table>

                                <div class="table-button">
                                    <button type="button" class="back" onclick="backToStep(${parseInt(CurrentStep) - 1})">Back</button>
                                    <button type="button" class="back" onclick="skipToStep(${parseInt(CurrentStep) + 1})">Skip</button>
                                    <button class="pink-button right" onclick="UpdateStaffServiceMapping()">Create calendar</button>
                                </div>
                            </div>
                        </div>`);
    debugger;

    let serviceMasterData = getServiceMasterDataByCalendar(createdCompanyCode, createdCalendarCode).data;
    let serviceProviderMasterData = getServiceProviderDataByCalendar(createdCompanyCode, createdCalendarCode).data;

    if (serviceProviderMasterData != null && serviceProviderMasterData != null) {
        let binderString = `<tr>
                                            <td></td>`;

        for (var i = 0; i < serviceMasterData.length; i++) {
            binderString += "<td>" + serviceMasterData[i].ACTIVITY_NAME + "</td>"
        }

        binderString += "</tr>";

        for (var i = 0; i < serviceProviderMasterData.length; i++) {
            binderString += "<tr><td>" + serviceProviderMasterData[i].FIRST_NAME + " " + serviceProviderMasterData[i].LAST_NAME + "</td>"
            for (var j = 0; j < serviceMasterData.length; j++) {
                staffServiceMapping.push({
                    CALENDAR_CODE: createdCalendarCode,
                    SERVICE_ID: serviceMasterData[j].Id,
                    SERVICE_PROVIDER_ID: serviceProviderMasterData[i].Id,
                    checked: false
                });

                binderString += `<td style="padding: 0px;">
                                                <label style="width: 100%; float: left; height: 50px; display: flex; justify-content: center; align-items: center;" for="SS_${serviceMasterData[j].Id}_${serviceProviderMasterData[i].Id}">
                                                    <img id="SS_IMG_${serviceMasterData[j].Id}_${serviceProviderMasterData[i].Id}" style="width: 18px; position: relative; height: 18px; vertical-align: middle; display:none;" src="../assets/marketplace/image/Isolation_Mode.png" />
                                                    <input type="checkbox" style="display:none" class="form-control" data-service-id="${serviceMasterData[j].Id}" data-provider-id="${serviceProviderMasterData[i].Id}" id="SS_${serviceMasterData[j].Id}_${serviceProviderMasterData[i].Id}" name="staff-service-mapper-input">
                                                </label>

                                            </td>`

            }
            binderString += "</tr>";
        }

        $("#mapper-table tbody").empty();
        $("#mapper-table tbody").append(binderString);

    } else {
        $(".tab-notification").text("Please create staff and services in previous steps!")
    }
    debugger;
    let mappingData = GetStaffServiceMappingData(createdCalendarCode);

    if (mappingData.Status) {

        if (mappingData.Data != null) {
            mappingData.Data.forEach(x => {
                $(`input[data-service-id=${x.SERVICE_ID}][data-provider-id=${x.SERVICE_PROVIDER_ID}]`).prop("checked", true);
                staffServiceMapping.find(y => y.SERVICE_ID == x.SERVICE_ID && y.SERVICE_PROVIDER_ID == x.SERVICE_PROVIDER_ID).checked = true;
                $(`#SS_IMG_${x.SERVICE_ID}_${x.SERVICE_PROVIDER_ID}`).show();
            });
        }

    }

}

//function validateStep(stepId) {
//    var flag = true;
//    if (stepId == 3) {
//        let inputList = document.getElementsByClassName("location-input");
//        inputList.forEach(x => {
//            if (x.value == "" || x.value == null) {
//                swal({
//                    icon: "warning",
//                    title: "Warning",
//                    text: "Please fill all location fields."
//                });
//                flag = false;
//            }
//        });
//    }

//    if (stepId == 4) {
//        let tempFlag1 = true;
//        let tempFlag2 = true;
//        let inputList = document.getElementsByClassName("provider-first-input");
//        inputList.forEach(x => {
//            if (x.value == "" || x.value == null) {

//                tempFlag1 = false;
//            }
//        });

//        let inputList2 = document.getElementsByClassName("provider-last-input");
//        inputList2.forEach(x => {
//            if (x.value == "" || x.value == null) {

//                tempFlag2 = false;
//            }
//        });

//        if (!tempFlag1 && !tempFlag2) {
//            swal({
//                icon: "warning",
//                title: "Warning",
//                text: "Please fill first & last name fields."
//            });
//            flag = false;
//        } else if (!tempFlag1) {
//            swal({
//                icon: "warning",
//                title: "Warning",
//                text: "Please fill first name fields."
//            });
//            flag = false;
//        } else if (!tempFlag2) {
//            swal({
//                icon: "warning",
//                title: "Warning",
//                text: "Please fill last name fields."
//            });
//            flag = false;
//        }
//    }

//    return flag;
//}

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

function addMoreRow(dataItem, isRemovable, isNew) {

    let dataModel = {
        Id: (dataItem == null) ? parseInt(getMaxId(dataList)) + 1 : dataItem.Id,
        CALENDAR_CODE: createdCalendarCode,
        COMPANY_CODE: createdCompanyCode,
        Is_New: isNew
    };

    $("#service-div").append(`<div class="form" id="service-elem-${dataModel.Id}"> ${(isRemovable) ? `<div class="element-remover" onclick="removeRow(${dataModel.Id})"><i class="fa fa-times" aria-hidden="true"></i></div>` : ""} <div class="row mt-3" style="border-bottom: 1px dashed #898989;"></div></div>`)

    dataModelList.forEach(x => {

        dataModel[x.name] = (dataItem == null) ? "" : dataItem[x.name];

        $("#service-div #service-elem-" + dataModel.Id + " .row").append(`<div class="${x.containerClass}">
                                            <div class="form-group">
                                                ${generateInputBox(x, dataModel.Id, "")}
                                            </div>
                                        </div>`);

        $(`input[name=${x.name}${dataModel.Id}]`).val(dataModel[x.name]);
    });

    dataList.push(dataModel);
    setTimeout(function () {
        dataModelList.forEach(x => {
            $(`input[name^=${x.name}]`).bind("keyup change paste", function () {
                let inputId = $(this).attr("data-input-id");
                dataList.find(y => y.Id == inputId)[x.name] = this.value;
            })
        });
    }, 500);


    var element = document.querySelector('#service-div');
    element.scrollTop = element.scrollHeight;

}

function removeRow(Id) {
    if (dataList.filter(x => x.Id == Id).length > 0) {
        if (dataList.find(x => x.Id == Id).Is_New) {
            dataList = dataList.filter(x => x.Id != Id);
            $("#service-elem-" + Id).remove();
        }
    }
}

function createMasterData() {
    if (true) {

        $.ajax({
            url: "/Calendar/AddMasterData",
            method: "POST",
            data: {
                data: dataList,
                ModelId: (ConfigStep.Form_Id == 2306) ? 1 : (ConfigStep.Form_Id == 2304) ? 2 : 3
            },
            success: function (response) {
                // after success response
                if (response.Status) {
                    swal({
                        icon: "success",
                        title: "Great!",
                        text: "Data added successfully!"
                    }).then(function (check) {
                        if (ConfigStep.Has_Next_Step) {
                            window.location.href = '/BusinessAdmin/SetupCalendarEvent?CompanyId=' + localStorage.getItem("COMPANY_ID") + "&CalendarCode=" + createdCalendarCode + "&Step=" + (parseInt(CurrentStep) + 1);
                        } else {
                            window.location.href = '/BusinessAdmin/Dashboard';
                        }
                        
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

function UpdateStaffServiceMapping() {
    if (staffServiceMapping.find(x => x.checked == true) == null) {
        swal({
            icon: "warning",
            title: "Warning",
            text: "Please check the boxes to assign Service(s) to Service Provider(s)"
        })
    } else {

        let finalData = staffServiceMapping.filter(x => x.checked == true);

        if (finalData.length > 0) {
            $.ajax({
                url: "/Calendar/UpdateStaffServiceMapping",
                method: "POST",
                data: {
                    model: finalData
                },
                success: function (response) {
                    if (response.Status) {
                        swal({
                            icon: "success",
                            title: "Great!",
                            text: "Staff successfully assigned to Service Providers"
                        }).then(function (check) {
                            if (ConfigStep.Has_Next_Step) {
                                window.location.replace(`/BusinessAdmin/SetupCalendarEvent?CompanyId=${localStorage.getItem("COMPANY_ID")}&CalendarCode=${createdCalendarCode}&Step=${(parseInt(CurrentStep) + 1)}`)
                            }
                        })
                    } else {
                        swal({
                            icon: "error",
                            title: "Error",
                            text: "Kindly refresh and try again!"
                        })
                    }
                },
                error: function (error) {

                }
            })
        }
    }
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

                if (ConfigStep.Has_Next_Step) {
                    window.location.replace(`/BusinessAdmin/SetupCalendarEvent?CompanyId=${localStorage.getItem("COMPANY_ID")}&CalendarCode=${createdCalendarCode}&Step=${(parseInt(CurrentStep) + 1)}`)
                }


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

//function configureStep(step) {

//    let configStep = ConfigData["Type" + createdCalendarType]["Step" + step];

//    // steps and common and special based on JSON architecture type
//    let specialSteps = [5, 6, 7];

//    if (specialSteps.includes(step)) {
//        if (CalendarData.Data.CALENDAR_TYPE != undefined && CalendarData.Data.CALENDAR_TYPE != null) {
//            configStep = configStep["2_" + CalendarData.Data.CALENDAR_TYPE];
//        }
//    }

//    if (configStep.Is_Step == null || configStep.Is_Step == undefined) {
//        alert("Something went wrong!");
//        return;
//    }

//    if (configStep.Is_Step == true) {
//        $("#step-" + step + " .template-binder").empty();

//        if (configStep.Is_Kanban == true) {
//            // bind Kanban Template
//        } else {
//            if (configStep.Has_Multiple_Steps == true) {
//                $("#step-" + step + " .template-binder").append(`<div class="hed-til">
//                        <p class="step"></p>
//                    </div>

//                    <div class="f_of_f-wrap-o">
//                        <div class="choose">

//                        </div>
//                        <button type="button" onclick="backToStep(${(step - 1)})" class="back">Back</button>
//                    </div>
//                    <div class="blocks">

//                    </div>`);

//                let counter = 1;
//                let binderString = "";
//                while (configStep.Steps["2_" + counter] != undefined && configStep.Steps["2_" + counter] != null) {
//                    binderString += `<div class="chose-inner" onclick="moveToStep(${(parseInt(step) + 1)}, ${counter})">
//                                <div class="one">
//                                    <img src="${configStep.Steps["2_" + counter].Image}" onerror="this.src='../assets/svg/logos/favicon.png'" />
//                                </div>
//                                <div class="two">
//                                    <p>${configStep.Steps["2_" + counter].Text}</p>
//                                </div>
//                                <div class="three">
//                                    <p><img src="../assets/img/purple.png" /></p>
//                                </div>
//                            </div>`;
//                    counter++;
//                }
//                $("#step-" + step + " .choose").append(binderString);
//            } else {

//                // bind entry form or final step
//                let masterName = "";
//                let addFuncName = "";

//                if (configStep.Title == "Location Master") {
//                    masterName = "locations"
//                    addFuncName = "addMoreLocation"
//                }
//                else if (configStep.Title == "Service Provider Master") {
//                    masterName = "providers"
//                    addFuncName = "addMoreProvider"
//                }
//                else if (configStep.Title == "Service Master") {
//                    masterName = "service"
//                    addFuncName = "addMoreService"
//                }

//                if (configStep.Is_Final_Step) {
//                    debugger;

//                } else {

//                    if (step == 6 && CalendarData.Data.CALENDAR_TYPE == 3) {

//                        // bind mapper form


//                    } else {
//                        // bind entry form
//                        $("#step-" + step + " .template-binder").append(`<div class="hed-til">
//                            <p class="heading-title step"></p>
//                        </div>
//                        <div>

//                            <div id="div1">
//                                <div class="text-center">
//                                    <div class="profile-form">
                                        
//                                        <div style="text-align:right; color:crimson;">* mandatory</div>
//                                        <div class="form-inner set-cal" style="max-width:100%; margin-bottom: 1em;">
//                                            <div id="${masterName}-div">

//                                            </div>

//                                            <div class="ycaml">
//                                                <p>You can add more location if your event takes place in more than one location.</p>
//                                                <button class="bg-t-b" onclick="${addFuncName}(null, true, true)">+Add more</button>
//                                            </div>

//                                            <button type="button" onclick="backToStep(${(step - 1)})" class="back">Back</button>
//                                            <button type="button" style="display:none;" onclick="skipToStep(${(step + 1)})" class="back skip-button">Skip</button>
//                                            <button type="button" class="btn btn-primary" onclick="moveToStep(${(step + 1)})">Next</button>
                                            
//                                        </div>
//                                    </div>
//                                </div>
//                            </div>

//                        </div>

//                        <div class="blocks">

//                        </div>`);
//                    }


//                }
//            }
//        }

//        $("#step-" + step + " .hed-til p").text(configStep.Heading_Title);

//        if (configStep.Is_Skippable == true) {
//            $("#step-" + step + " .skip-button").show();
//        } else {
//            $("#step-" + step + " .skip-button").hide();
//        }

//        // helper text and image after form bindings
//        if (configStep.Helper_After_Form != null && configStep.Helper_After_Form != undefined) {

//            let counter = 1;
//            let stringBinder = "";

//            $(".blocks").empty();

//            while (configStep.Helper_After_Form["Helper_" + counter] != undefined) {
//                stringBinder += `<div class="block-inner">
//                    <div class="block-image">
//                        <img src="${configStep.Helper_After_Form["Helper_" + counter].Image}" onerror="this.src='/assets/marketplace/image/hands.png'">
//                    </div>
//                    <div class="block-text">
//                        <p>${configStep.Helper_After_Form["Helper_" + counter].Text} </p>
//                    </div>
//                </div>`;
//                counter++;
//            }

//            $(".blocks").append(stringBinder);
//        }

//    } else {
//        backToStep((parseInt(step) + 1));
//    }

//    $("#step-" + step).fadeIn();
//}