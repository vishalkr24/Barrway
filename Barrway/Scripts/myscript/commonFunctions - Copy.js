function customDate(_date) {

    var returnDate = "";

    try {

        // 2020-01-31
        if (_date.length == 10) {
            if (_date.includes('-')) {
                // returnDate = _date.replace('-', '/') + " 00:00";
                var arr = _date.split('-');
                returnDate = arr[0] + "/" + arr[1] + "/" + arr[2] + " 00:00";
            }
            else {
                var d = new Date(parseInt(_date + "000"));

                var newdateFormat = d.toLocaleString();
                //  18 / 01 / 1970, 21:59:39
                var splittedform = newdateFormat.split(' ');
                var datepart = splittedform[0].split('/');

                var timepart = splittedform[1].split(':');

                if (datepart[1].length == 1) { datepart[1] = '0' + datepart[1]; }
                if (datepart[0].length == 1) { datepart[0] = '0' + datepart[0]; }
                if (timepart[0].length == 1) { timepart[0] = '0' + timepart[0]; }
                if (timepart[1].length == 1) { timepart[1] = '0' + timepart[1]; }

                returnDate = datepart[2].substring(0, 4) + "/" + datepart[0] + "/" + datepart[1];
                returnDate = returnDate + " " + timepart[0] + ":" + timepart[1];
            }
        }
        else {


            if (_date != null && _date.includes("T") == false) {
                var dateSplit = '';
                if (_date.includes('-') == true)
                    dateSplit = _date.split('-');
                else
                    dateSplit = _date.split(' ');
                var firstSlice = dateSplit[0].substring(0, 1);
                // console.log(dateSplit);


                if ((firstSlice == "0" || firstSlice == "1" || firstSlice == "2" || firstSlice == "3" || firstSlice == "4" || firstSlice == "5" || firstSlice == "6" || firstSlice == "7" || firstSlice == "8" || firstSlice == "9") && dateSplit[0].length < 4) {

                    if (dateSplit[0].length == 1) { dateSplit[0] = '0' + dateSplit[0]; }
                    if (dateSplit[1].length == 1) { dateSplit[1] = '0' + dateSplit[1]; }


                    var slicetimeDay = dateSplit[2].split(' ');
                    if (slicetimeDay[0].length == 1) { slicetimeDay[0] = '0' + slicetimeDay[0]; }
                    returnDate = slicetimeDay[0] + "/" + dateSplit[1] + "/" + dateSplit[0];
                    var HHmm = slicetimeDay[1].split(':');

                    if (HHmm[0].length == 1) { HHmm[0] = '0' + HHmm[0]; }
                    if (HHmm[1].length == 1) { HHmm[1] = '0' + HHmm[1]; }
                    returnDate = returnDate + " " + HHmm[0] + ":" + HHmm[1];
                }
                else if (dateSplit[0].length == 4 || dateSplit[0].includes('/')) {

                    if (dateSplit[0].includes('/')) {



                        var _dateSplit = _date.split(' ');
                        if (_dateSplit[0].includes('/')) {

                            // mm/dd/yyyy
                            var _datePart = _dateSplit[0].split('/');
                            var _timePart = _dateSplit[1].split(':');

                            returnDate = _datePart[2] + "/" + _datePart[1] + "/" + _datePart[0];
                            returnDate = returnDate + " " + _timePart[0] + ":" + _timePart[1];
                        }
                        else {
                            var _datePart = _dateSplit[0].split('-');
                            var _timePart = _dateSplit[1].split(':');

                            returnDate = _datePart[0] + "/" + _datePart[1] + "/" + _datePart[2];
                            returnDate = returnDate + " " + _timePart[0] + ":" + _timePart[1];

                        }


                    }
                    else {
                        //    mm/dd/yyyy
                        var _dateSplit = _date.split(' ');


                        if (_dateSplit[0].includes('/')) {
                            var _datePart = _dateSplit[0].split('/');
                            var _timePart = _dateSplit[1].split(':');

                            returnDate = _datePart[2] + "/" + _datePart[1] + "/" + _datePart[0];
                            returnDate = returnDate + " " + _timePart[0] + ":" + _timePart[1];
                        }
                        else {
                            //"2019-12-12"  format
                            var _datePart = _dateSplit[0].split('-');
                            var _timePart = _dateSplit[1].split(':');

                            returnDate = _datePart[0] + "/" + _datePart[1] + "/" + _datePart[2];
                            returnDate = returnDate + " " + _timePart[0] + ":" + _timePart[1];


                        }
                    }


                }
                else {

                    _date = _date.replace(/  +/g, ' ');
                    var dateSplitVarchar = _date.split(' ');

                    var yearText = dateSplitVarchar[0];
                    var monthInt = '01';
                    if (yearText == "Jan")
                        monthInt = '01';
                    if (yearText == "Feb")
                        monthInt = '02';
                    if (yearText == "Mar")
                        monthInt = '03';
                    if (yearText == "Apr")
                        monthInt = '04';
                    if (yearText == "May")
                        monthInt = '05';
                    if (yearText == "Jun")
                        monthInt = '06';
                    if (yearText == "Jul")
                        monthInt = '07';
                    if (yearText == "Aug")
                        monthInt = '08';
                    if (yearText == "Sept" || yearText == "Sep")
                        monthInt = '09';
                    if (yearText == "Oct")
                        monthInt = '10';
                    if (yearText == "Nov")
                        monthInt = '11';
                    if (yearText == "Dec")
                        monthInt = '12';
                    try {

                        if (dateSplitVarchar[1].length == 1) { dateSplitVarchar[1] = '0' + dateSplitVarchar[1]; }
                        returnDate = dateSplitVarchar[2] + "/" + monthInt + "/" + dateSplitVarchar[1];
                        var timesplit = dateSplitVarchar[3].split(':');
                        // console.log(timesplit);
                        if (timesplit != 'undefined' || timesplit != null) {
                            if (timesplit[0].length == 1) { timesplit[0] = '0' + timesplit[0]; }
                            if (timesplit[1].length == 1) { timesplit[1] = '0' + timesplit[1]; }

                            returnDate = returnDate + " " + timesplit[0] + ":" + timesplit[1].substring(0, 2);
                        }


                    }
                    catch
                    { returnDate = ''; return returnDate; }


                }

            }
            else {
                var dateSplit = _date.split('T');


                if (dateSplit.length > 0) {
                    var datePart = dateSplit[0].split('-');
                    var timePart = dateSplit[1].split(':');;
                    returnDate = datePart[0] + "/" + datePart[1] + "/" + datePart[2];
                    returnDate = returnDate + " " + timePart[0] + ":" + timePart[1];

                }
            }
        }


        return returnDate;
    }
    catch
    {
        return returnDate;

    }

}

function changeFormStatus(formId) {
    $.ajax({
        type: "POST",
        url: "api/FormAPI/GetFormList",
        data: "{'formId':" + formId + " ,'action':9}",
        contentType: "application/json",
        datatype: "json",
        success: function (responseFromServer) {

            location.reload(true);
        }
    });
}

function publishToOpen(formId, groupId) {
    $.ajax({
        type: "POST",
        url: "api/FormAPI/GetFormList",
        data: "{'formId':" + formId + " ,'action':12}",
        contentType: "application/json",
        datatype: "json",
        success: function (responseFromServer) {
            alert(responseFromServer.d)
        }
    });
}
function backToPrivate(formId) {
    $.ajax({
        type: "POST",
        url: "api/FormAPI/GetFormList",
        data: "{'formId':" + formId + " ,'action':12}",
        contentType: "application/json",
        datatype: "json",
        success: function (responseFromServer) {
            alert(responseFromServer.d)
        }
    });
}

function openBoot(formid, userId, btnType) {


    $.ajax({
        type: "POST",
        url: "api/FormAPI/ManageGroups",
        data: "{'userId':" + userId + " ,'action':4}",
        contentType: "application/json",
        datatype: "json",
        success: addOptions


    });



    var actions = '<div class="panel-blue">' +
        '<div class="row">' +
        '<div class="col-sm-12">' +

        '<form class="needs-validation" name="groupForm" id="publishForm"  novalidate>' +
        ' <div class="col-sm-12 form-group">' +
        ' <input type="hidden" id="frmIdHidden" name="frmId" value=' + formid + ' />' +
        ' <input type="hidden" id="hdnfbuttonType" name="btnType" value=' + btnType + ' />' +
        ' <input type="hidden" id="hdnfGroupId" name="grpId" value="0" />' +
        ' <div class="col-sm-8">' +


        ' </div>' +
        ' </div>' +
        ' <div class="col-sm-12 form-group">' +

        ' <div class="col-sm-4"><label class="control-label">select Group:</label></div>' +
        ' <div class="col-sm-8">' +


        '   <select class="form-control" id="ddlGroups" onchange="changeEvent(this.value)" required>' +






        '  </select>' +





        ' </div>' +
        '   </div>' +
        ' <div class="col-sm-12 form-group">' +

        ' <div class="col-sm-4"></div>' +
        ' <div class="col-sm-8"><a onclick="openAddGroupBoot()"  ><i class="fa fa-plus"></i> Add Group</a></div>' +

        ' </div>' +
        ' <div class="col-sm-12 form-group">' +

        ' <div class="col-sm-4"></div>' +
        ' <div class="col-sm-8">  <label> <input type="checkbox" id="chkAll" value="sdsd"/>delete all records</label>  </div>' +

        ' </div>' +
        ' <div class="col-sm-offset-4 col-sm-8 navbar-btn btn-sm">' +

        '  <button type="button" onclick="submitToPublish()"' +

        '  class="btn btn-primary">' +
        ' Publish' +
        '            </button>' +
        '  <button type="button"' +
        ' class="btn btn-default"' +
        ' aria-label="Close"' +
        'data-dismiss="modal">' +
        ' Cancel' +
        '    </button>' +
        ' </div>' +

        ' </form></div></div ></div ></div ></div > ';






    bootbox.dialog({
        backdrop: true,
        onEscape: true,
        title: "Publish To Open",
        message: actions
    }).on('shown.bs.modal', function (e) {
        Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
        Waves.attach('.flat-buttons', ['waves-button']);
        Waves.init();

    });
    $("div.form-group.more_setup-wrap", '.panel-blue').nextUntil("div.form-group.advance_setup-wrap").hide();
    $("div.form-group.advance_setup-wrap", '.panel-blue').nextAll("div.form-group").hide();
}
function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxxyxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 12) % 12 | 0;
        dt = Math.floor(dt / 12);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(12);
    });
    return uuid;
}
function openAddGroupBoot() {

    var actions = '<div class="panel-blue">' +
        '<div class="row">' +
        '<div class="col-sm-12">' +

        '<form class="needs-validation" name="groupForm"  novalidate>' +
        ' <div class="col-sm-12 form-group">' +

        ' <div class="col-sm-8">' +


        ' </div>' +
        ' </div>' +
        ' <div class="col-sm-12 form-group">' +

        ' <div class="col-sm-4"><label class="control-label"> Group Name:</label></div>' +
        ' <div class="col-sm-8">' +


        '<input type="text" class="form-control" id="txtGroupName" />' +

        ' </div>' +
        '   </div>' +


        ' <div class="col-sm-offset-4 col-sm-8 navbar-btn btn-sm">' +

        '  <button type="button" onclick="createNewGroup()"' +

        '  class="btn btn-primary">' +
        ' Create' +
        '            </button>' +
        '  <button type="button" id="btnCancel"' +
        ' class="btn btn-default"' +
        ' aria-label="Close"' +
        'data-dismiss="modal">' +
        ' Cancel' +
        '    </button>' +
        ' </div>' +

        ' </form></div></div ></div ></div ></div > ';

    bootbox.dialog({
        backdrop: true,
        onEscape: true,
        title: "New Group",
        message: actions
    }).on('shown.bs.modal', function (e) {
        Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
        Waves.attach('.flat-buttons', ['waves-button']);
        Waves.init();

    });
    $("div.form-group.more_setup-wrap", '.panel-blue').nextUntil("div.form-group.advance_setup-wrap").hide();
    $("div.form-group.advance_setup-wrap", '.panel-blue').nextAll("div.form-group").hide();
}

function addOptions(data) {
    if (data.length > 0) {
        var ddl = $('#ddlGroups');
        ddl.append($("<option></option>").val(0).text('--select Group--'));
        for (var i = 0; i < data.length; i++) {
            ddl.append($("<option></option>").val(data[i].groupId).text(data[i].groupName));
        }
    }
}
function changeEvent(id) {
    $('#hdnfGroupId').val(id);
}

function submitToPublish() {


    if ($("#ddlGroups option:selected").index() != 0) {
        // alert($('select#ddlGroups option:selected').val());

        var clearData = 0;
        var action = 0;
        var formType = 0;
        if ($("#chkAll").is(':checked')) {
            clearData = 1;
        }

        if ($('#hdnfbuttonType').val() == 'btnPublishToOpen') {
            action = 9;
            formType = 3;
        }
        else if ($('#hdnfbuttonType').val() == 'btnBackToPrivate') {
            action = 10;
            formType = 1;
        }
        else if ($('#hdnfbuttonType').val() == 'btnPublishToPublic') {
            action = 10;
            formType = 2;
        }
        else if ($('#hdnfbuttonType').val() == 'btnPublishToMarketPlace') {
            action = 13;
            formType = 1;
        }

        $.ajax({
            type: "POST",
            url: "api/FormAPI/ManageForm",
            data: "{'userId':" + JSON.parse(localStorage.detail).Id + " ,'action':" + action + ",'created_by':" + JSON.parse(localStorage.detail).Id + ",'updated_by':" + JSON.parse(localStorage.detail).Id + ",'groupID':" + $('select#ddlGroups option:selected').val() + ",'formId':" + $('#frmIdHidden').val() + ",'clearData':" + clearData + ",'formType':" + formType + "}",
            contentType: "application/json",
            datatype: "json",
            success: function (data) {

                alert(data[0].Message);
                location.reload(true);
            }

        });

    }
    else {

        alert('please select  group');
    }
}

function createNewGroup() {
    if ($('#txtGroupName').val() != '') {

        var isEdit = false;
        $.ajax({
            type: "POST",
            url: "api/FormAPI/ManageGroups",
            data: "{'userId':" + JSON.parse(localStorage.detail).Id + " ,'action':10,'created_by':" + JSON.parse(localStorage.detail).Id + ",'updated_by':" + JSON.parse(localStorage.detail).Id + ",'groupName':'" + $('#txtGroupName').val() + "','isEdit':" + isEdit + "}",
            contentType: "application/json",
            datatype: "json",
            success: function (data) {

                $('#ddlGroups').append($("<option></option>").val(data[0].groupId).text(data[0].groupName));

                $("#ddlGroups").val(data[0].groupId).change();
                $('#btnCancel').click();
            }

        });


    }
    else { alert('please enter group name'); }

}

function subscribeForm(grpId, topicId) {
    if (grpId != 0 && grpId != null && grpId != 'undefined') {
        var subscribleAllParam = 0;
        if (confirm('do u want to subscribe all forms of related topic?')) {




            //$.ajax({
            //    type: "POST",
            //    url: "api/FormAPI/ManageForm",
            //    data: "{'userId':" + JSON.parse(localStorage.detail).Id + " ,'action':11,'created_by':" + JSON.parse(localStorage.detail).Id + ",'updated_by':" + JSON.parse(localStorage.detail).Id + ",'groupID':" + grpId + ",'subscribleAll':" + subscribleAllParam + ",'topicId':" + topicId + "}",
            //    contentType: "application/json",
            //    datatype: "json",
            //    success: function (data) {

            //        alert(data[0].Message);
            //        location.reload(true);
            //    }

            //});
            $.ajax({
                type: "POST",
                url: "api/FormAPI/ManageForm",
                data: "{'userId':" + JSON.parse(localStorage.detail).Id + " ,'action':11,'created_by':" + JSON.parse(localStorage.detail).Id + ",'updated_by':" + JSON.parse(localStorage.detail).Id + ",'groupID':" + grpId + ",'subscribleAll':" + subscribleAllParam + "}",
                contentType: "application/json",
                datatype: "json",
                success: function (data) {

                    alert(data[0].Message);
                    location.reload(true);
                }

            });
        }
        else {
            $.ajax({
                type: "POST",
                url: "api/FormAPI/ManageForm",
                data: "{'userId':" + JSON.parse(localStorage.detail).Id + " ,'action':11,'created_by':" + JSON.parse(localStorage.detail).Id + ",'updated_by':" + JSON.parse(localStorage.detail).Id + ",'groupID':" + grpId + ",'subscribleAll':" + subscribleAllParam + "}",
                contentType: "application/json",
                datatype: "json",
                success: function (data) {

                    alert(data[0].Message);
                    location.reload(true);
                }

            });
        }
    }
    else { alert('in this form .. group id is null') }




}

function getFunctionNew(groupId) {
    window.location.href = "#/chat/" + groupId + "/group_chat";
    setTimeout(function () {
        window.location.reload();
    }, 450);
}
function deleteGroup(groupId, reqType) {

    if (confirm('delete this group?')) {
        $.ajax({
            type: "POST",
            url: "api/FormAPI/ManageGroups",
            data: "{'userId':" + JSON.parse(localStorage.detail).Id + " ,'action':11,'updated_by':" + JSON.parse(localStorage.detail).Id + ",'groupId':" + groupId + ",'IsDeleted':true}",
            contentType: "application/json",
            datatype: "json",
            success: function (data) {
                var response = data[0];
                alert(response.Message)
                if (reqType == "fromGroupDetails") {
                    window.location.href = "#/grouplist";
                }
                else
                    location.reload(true);
            }

        });
    }

}
function exportGroupUsers(groupId, groupName) {
    try {
        var exportable = [];

        $.ajax({
            type: "POST",
            url: "api/FormAPI/ManageUserGroup",
            data: "{'action':6,'userId':" + JSON.parse(localStorage.detail).Id + ",'groupId':" + groupId + "}",
            contentType: "application/json",
            datatype: "json",
            success: function (data) {
                $.each(data, function (key, value) {
                    var rowData = value;
                    var row = {};
                    row.UserName = rowData.UserName;
                    row.Name = rowData.Name;
                    row.PhoneNumber = rowData.phone;
                    row.Email = rowData.eMail;
                    exportable.push(row);
                });
                var createXLSLFormatObj = [];
                var xlsHeader = ["UserName", "Name", "PhoneNumber", "Email"];
                createXLSLFormatObj.push(xlsHeader);
                $.each(exportable, function (index, value) {
                    var innerRowData = [];
                    $("tbody").append('<tr><td>' + value.UserName + '</td><td>' + value.Name + '</td><td>' + value.PhoneNumber + '</td><td>' + value.Email + '</td></tr>');
                    $.each(value, function (ind, val) {

                        innerRowData.push(val);
                    });
                    createXLSLFormatObj.push(innerRowData);
                });
                var filename = groupName + ".xlsx";
                var ws_name = "groupUsers";
                if (typeof console !== 'undefined') console.log(new Date());
                var wb = XLSX.utils.book_new(),
                    ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);
                XLSX.utils.book_append_sheet(wb, ws, ws_name);
                if (typeof console !== 'undefined') console.log(new Date());
                XLSX.writeFile(wb, filename);
                if (typeof console !== 'undefined') console.log(new Date());
            }

        });
    }
    catch (err) { }

}
function verifyPhone() {

    try {
        var enteredCode = $('#txtVerificationCode').val();
        var persistCode = $.cookie("fgC");
        if (typeof persistCode === "undefined") {
            alert("code expired");
            swal.close();
        }
        else {
            if (enteredCode === persistCode) {
                alert('matched');
                $.ajax({
                    type: "POST",
                    url: "api/FormAPI/profile",
                    data: "{'Id':" + JSON.parse(localStorage.detail).Id + " ,'action':10}",
                    contentType: "application/json",
                    datatype: "json",
                    success: function (data) {
                        //var response = data[0];

                        console.log(data);
                        if (data.res == 1) {
                            alert(data.Message);
                            $.cookie('fgC', null);
                            location.reload(true);
                        }
                        else
                            alert('not verified .');
                        //else
                        //    alert('not verified .. some technical issues .');
                        //if (reqType == "fromGroupDetails") {
                        //    window.location.href = "#/grouplist";
                        //}
                        //else
                        //    location.reload(true);
                    }

                });


            }
            else {

                alert('code mismatched ');



            }

        }
        // alert(persistCode);

    }
    catch (err) {
        // swal(err);
    }
}



function formatDateTime(sDate, FormatType) {
    var lDate = new Date(sDate)

    var month = new Array(12);
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sept";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";

    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    var hh = lDate.getHours() < 10 ? '0' +
        lDate.getHours() : lDate.getHours();
    var mi = lDate.getMinutes() < 10 ? '0' +
        lDate.getMinutes() : lDate.getMinutes();
    var ss = lDate.getSeconds() < 10 ? '0' +
        lDate.getSeconds() : lDate.getSeconds();

    var d = lDate.getDate();
    var dd = d < 10 ? '0' + d : d;
    var yyyy = lDate.getFullYear();
    var mon = eval(lDate.getMonth() + 1);
    var mm = (mon < 10 ? '0' + mon : mon);
    var monthName = month[lDate.getMonth()];
    var weekdayName = weekday[lDate.getDay()];

    if (FormatType == 1) {
        return yyyy + '/' + mm + '/' + dd + ' ' + hh + ':' + mi;
    } else if (FormatType == 2) {
        return weekdayName + ', ' + monthName + ' ' +
            dd + ', ' + yyyy;
    } else if (FormatType == 3) {
        return mm + '/' + dd + '/' + yyyy;
    } else if (FormatType == 4) {
        var dd1 = lDate.getDate();
        return dd1 + '-' + Left(monthName, 3) + '-' + yyyy;
    } else if (FormatType == 5) {
        return mm + '/' + dd + '/' + yyyy + ' ' + hh + ':' + mi + ':' + ss;
    } else if (FormatType == 6) {
        return mon + '/' + d + '/' + yyyy + ' ' +
            hh + ':' + mi + ':' + ss;
    } else if (FormatType == 7) {
        return dd + '-' + monthName.substring(0, 3) +
            '-' + yyyy + ' ' + hh + ':' + mi + ':' + ss;
    }
}



function addEvent(form) {

    if (!checkUserRoleRights()) {
        swal({
            title: 'Form Entry',
            text: 'You are not allowed to do this operation. Form Based Roles',
            type: 'error'
        });
        return false;
    }

    var basicDetails = window["EventBasicDetail"];
    var activityField = basicDetails.formData.activities;
    var eventOverlap = false;// this is event overlap bool . in resource settings .  could be True/False/NULL

    if (basicDetails.formData.eventOverlap !== null) {
        if (basicDetails.formData.eventOverlap == 1)
            eventOverlap = true;
        else
            eventOverlap = false;
    }

    var activitiesOverlap = false;
    if (basicDetails.formData.activitiesOverlap !== null) {
        if (basicDetails.formData.activitiesOverlap == 1)
            activitiesOverlap = true;
        else
            activitiesOverlap = false;
    }
    var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
    console.log(current_tab);
    var title = $.trim($("#tab_title").val()),
        start = $("#tab_start").val(),
        end = $("#tab_end").val(),
        color = $("#tab_color").val();
    resourceIdParam = $("#resourceId").val();
    resourcesParam = $("#resources").val();
    var param = [];
    if (start.indexOf(":") !== -1) {
        allDay = false;
    } else {
        allDay = true;
    }

    if (title) {
        var eventData = {
            title: title,
            color: color,
            allDay: allDay,
            start: start,
            end: end,
            resourceId: resourceIdParam,
            resources: resourcesParam
            //activities: activityValue,

        };
        var eventBasicData = window["EventBasicDetail"];


        console.log(eventBasicData);
        param.action = eventBasicData.action;
        param.formId = eventBasicData.formId;
        param.userId = eventBasicData.userId;
        param.topicId = eventBasicData.formData.topicId;
        param.created_by = eventBasicData.created_by;
        param.update_by = eventBasicData.update_by;
        param.formGroupKey = eventBasicData.formGroupKey;
        param.resourceId = resourceIdParam;
        param.eventOverlap = eventOverlap;
        param.activitiesOverlap = activitiesOverlap;
        if (current_tab == "timeline-resource-view" || current_tab == "vertical-resource-view")
            param.isResourceSelectable = true;
        else
            param.isResourceSelectable = false;
        var formfieldDataListTempData = [];

        formfieldDataListTempData = [

            { "name": "title", "value": title },
            { "name": "start", "value": start },
            { "name": "end", "value": end },
            { "name": "color", "value": color },
            { "name": "allDay", "value": allDay },
            { "name": "service", "value": "" },
            { "name": "description", "value": "" },
            { "name": "resources", "value": resourceIdParam },
            // { "name": "resources", "value": resources},
            { "formGroupKey": eventBasicData.formGroupKey, "name": "formGroupKey", "value": eventBasicData.formGroupKey }
        ];

        param.formfieldDataListTemp = formfieldDataListTempData;

        $.ajax({
            method: 'POST',
            url: "api/FormAPI/GeneratedFormData",
            dataType: 'json',
            contentType: "application/json",
            // data: "{'action':" + param.action + ",'formId':" + param.formId + ",'topicId':" + param.topicId + ",'created_by':" + param.created_by + ",'updated_by':" + param.update_by + ",'formGroupKey':" + param.formGroupKey + ",'formfieldDataListTemp':" + JSON.stringify(param.formfieldDataListTemp) + "}", //$.param(formData)
            data: "{'action':" + param.action + ",'userId':" + param.userId + ",'formId':" + param.formId + ",'topicId':" + param.topicId + ",'created_by':" + param.created_by + ",'updated_by':" + param.update_by + ",'formGroupKey':'" + param.formGroupKey + "','formfieldDataListTemp':'" + JSON.stringify(param.formfieldDataListTemp) + "','isResourceSelectable':" + param.isResourceSelectable + ", startDate:'" + start + "', endDate:'" + end + "', resourceId:" + param.resourceId + "}", //$.param(formData)

            beforeSend: function () {
                showLoader();
            },
            success: function (response) {
                if (response.res > 0) {
                    console.log(response);

                    var newRow1 = {
                        Id: response.Id,
                        label: null,
                        selected: false,
                        value: response.Id,
                        color: color,
                        title: title,
                        start: start,
                        end: end,
                        allDay: allDay,
                        resourceId: resourceIdParam,
                        resources: resourcesParam
                    };





                    var CalendarEventList = window["CalendarEventList"];

                    console.log('before insertion ');
                    console.log(CalendarEventList);

                    //CalendarEventList = $.grep(CalendarEventList, function (e) {
                    //    return e.value != Id;
                    //});
                    CalendarEventList.push(newRow1);
                    window["CalendarEventList"] = CalendarEventList;
                    console.log('after  insertion ');
                    console.log(CalendarEventList);
                    $('.calendar').fullCalendar('destroy');



                    loadCalendar('BasicView', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn);
                    $('#basic-view div.calendar').fullCalendar('refetchEvents');


                    eventBasicData.formGroupKey = create_UUID();
                    window["EventBasicDetail"] = eventBasicData;





                    $.jGrowl(response.Message, { position: 'center' });
                    // swal({ type: 'success', title: 'success', text: "created successfully" });
                    //var eventData = {
                    //    id: response.Id,
                    //    title: title,
                    //    start: start,
                    //    end: end,
                    //    color: color
                    //};
                    //$("#" + current_tab + " div.calendar").fullCalendar('renderEvent', eventData);
                    //$("#" + current_tab + " div.calendar").fullCalendar('refetchEvents');
                    //$(".calendar").not($("#" + current_tab + " div.calendar")).fullCalendar('refetchEvents');

                    // location.reload(true);
                } else {
                    swal({ type: 'error', title: '', text: response.overlapMessage });
                }


            },
            complete: function () {
                $.unblockUI();
            }
        });



    }
}
//functionLoadCalendar////////

function checkUserRoleRights() {
    var result = false;
    var scope = angular.element($("#calendar")).scope();
    if (scope.formDetailsDataInfo.recordAccessSecurity.insert) {
        result = false;
        var exist = scope.formDetailsDataInfo.recordAccessSecurity.insert.roles.filter(r => r == scope.currentUserFormRole.toString());
        if (exist != null && exist.length > 0) {
            result = true;
        }
    }
    else
        result = true;
    return result;
}


function userAccessRightsEdit() {
    var result = false;
    var scope = angular.element($("#calendar")).scope();
    var formDetailsInfo = scope.formDetailsDataInfo;
    var userId = json.parse(localStorage.getItem('detail').Id);
    if (userId.toString() === formDetailsInfo.created_by.toString()) {
        var _own = formDetailsDataInfo.recordAccessSecurity.own;
        if (_own.edit == true)
            result = true;

    }
    else {
        var _other = formDetailsDataInfo.recordAccessSecurity.other;
        if (_other.edit == true)
            result = true;
    }

    return result;

}

function loadCalendar(calenderType, calenderData, resourceData, resColumns, activityFormData, activityColumn, activityEvents) {

    console.log('this is the calender data............');
    console.log(calenderData);

    var basicDetails = window["EventBasicDetail"];
    //var activitiesCategory = '';
    var formID = basicDetails.formData.formId;
    var resourceColumn = basicDetails.formData.minorGroup;
    var activitiesForm = basicDetails.formData.activitiesForm;
    var majorGroup = basicDetails.formData.majorGroup;
    var minorGroup = basicDetails.formData.minorGroup;
    var activityField = basicDetails.formData.activities;
    var eventOverlap = false;// this is event overlap bool . in resource settings .  could be True/False/NULL

    if (basicDetails.formData.eventOverlap !== null) {
        if (basicDetails.formData.eventOverlap == 1)
            eventOverlap = true;
        else
            eventOverlap = false;
    }
    var activitiesOverlap = false;
    if (basicDetails.formData.activitiesOverlap !== null) {
        if (basicDetails.formData.activitiesOverlap == 1)
            activitiesOverlap = true;
        else
            activitiesOverlap = false;
    }

    console.log('event overlap is ' + eventOverlap);
    var userid = JSON.parse(localStorage.detail).Id;
    var activitiesCategory = basicDetails.formData.activitiesCategory;
    if (activitiesCategory == '' || activitiesCategory == null)
        activitiesCategory = '0';
    var overlapField = basicDetails.formData.overlapField; // value of activity radioButton field   (for overlap)

    var defaultDuration = "01:00:00";
    var calendarOptions = '';
    var resourceOrder = majorGroup + ',' + minorGroup;

    var defaultOptions = {
        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
        theme: true,
        themeSystem: 'jquery-ui',
        //  themeSystem:'bootstrap4',
        nowIndicator: true,
        defaultTimedEventDuration: defaultDuration,
        //aspectRatio: 1.5,
        defaultDate: new Date(),
        eventMouseover: function (event, jsEvent, view) {
            if (view.name !== 'agendaDay') {
                //console.log(event);
                $(jsEvent.target).attr('title', event.title);
            }
        },
        //eventClick: function (calEvent, jsEvent, view) {
        //    var r = confirm("Delete " + calEvent.title);
        //    if (r === true) {
        //        $('#basic-view div.calendar').fullCalendar('removeEvents', calEvent._id);
        //    }
        //},



        //lazyFetching: true,
        now: new Date(),
        navLinks: true, // can click day/week names to navigate views

        editable: true,
        eventLimit: true, // allow "more" link when too many events            
        loading: function (bool) {
            //var current_tab = $('#tabs .ui-tabs-panel:eq(' + $( "#tabs" ).tabs( "option", "active" ) + ')').attr('id');
            if (bool) {
                showLoader(".calendar .fc-view-container");
            }
            else {
                $(".calendar .fc-view-container").unblock();
            }
            //$('#loading').toggle(bool);
        },
        eventDrop: function (event, delta, revertFunc) {
            console.log('event is');
            console.log(event);
            var eventBasicData = window["EventBasicDetail"];
            var eventExtData = $(this).data('event');
            var resourceValue = '', title = '';
            var Id = 0;
            if (typeof event.Id === "undefined")
                Id = event.value;
            else
                Id = event.Id;
            title = event.title;
            var start = event.start.format();
            // var start = event.start.format();
            var end = '';
            if (event.end != null)
                end = event.end.format();
            else
                end = event.start.format();
            var activities = (event.activities) ? event.activities : '';
            var resources = (event.resources) ? event.resources : '';
            var resourceId = (event.resourceId) ? event.resourceId : '';
            var allDay = false;
            var formfieldDataListTempData = [];
            console.log(eventExtData);



            //console.log(event);
            //alert(event.title + " end is now " + event.end.format());
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            if (!confirm("Are you sure about this change?")) {
                revertFunc();
            } else {
                if (event.resourceId) {
                    var resource = $("#" + current_tab + " .calendar").fullCalendar('getResourceById', event.resourceId);
                    var activity = $("#vertical - activities - view" + " .calendar").fullCalendar('getResourceById', event.activities);

                    if (resource && typeof resource[resourceColumn] != 'undefined') {
                        resourceValue = resource[resourceColumn];
                        var activityValue = activity[activityField];
                        if (event.activities != 'undefined')
                            title = event.activities + ' in ' + resourceValue;
                        else
                            title = ' in ' + resourceValue;
                    }
                }

                formfieldDataListTempData = [
                    { "name": "Id", "value": parseInt(Id) },
                    { "name": "title", "value": title },
                    { "name": "start", "value": start },
                    { "name": "end", "value": end },
                    { "name": "allDay", "value": allDay },
                    // { "name": "activities", "value": activities },
                    { "name": "resources", "value": resourceId },
                ];
                $.ajax({
                    method: 'POST',
                    url: "api/FormAPI/EditEventData",
                    dataType: 'json',
                    contentType: "application/json",
                    data: "{'action':2,'Id':" + parseInt(Id) + ", 'formId':" + eventBasicData.formId + ",'topicId':" + eventBasicData.formData.topicId + ",'created_by':" + eventBasicData.created_by + ",'updated_by':" + eventBasicData.update_by + ",'formfieldDataListTemp':'" + JSON.stringify(formfieldDataListTempData) + "'}", //$.param(formData)
                    success: function (response) {
                        if (response.res > 0) {

                            var CalendarEventList = window["CalendarEventList"];
                            var ActivityEventList = window["ActivityEventList"];
                            var editableRowCalender = $.grep(CalendarEventList, function (e) {
                                return e.value == Id;
                            });
                            var editableRowActivity = $.grep(ActivityEventList, function (e) {
                                return e.value == Id;
                            });

                            //for calender's event Data
                            editableRowCalender.start = start;
                            editableRowCalender.end = end;
                            editableRowCalender.Id = Id;
                            editableRowCalender.title = title;
                            editableRowCalender.color = event.color;
                            editableRowCalender.description = event.description;
                            editableRowCalender.service = event.service;
                            editableRowCalender.activities = event.activities;
                            editableRowCalender.resources = event.resources;
                            editableRowCalender.resourceId = event.resourceId;
                            var filteredEventsCalender = $.grep(CalendarEventList, function (e) {
                                return e.value != Id;
                            });
                            filteredEventsCalender.push(editableRowCalender);

                            //for activity's  Event data.
                            editableRowActivity.start = start;
                            editableRowActivity.end = end;
                            editableRowActivity.Id = Id;
                            editableRowActivity.title = title;
                            editableRowActivity.color = event.color;
                            editableRowActivity.description = event.description;
                            editableRowActivity.service = event.service;
                            editableRowActivity.activities = event.activities;
                            editableRowActivity.resources = event.resources;
                            editableRowActivity.resourceId = event.resourceId;
                            var filteredEventsActivity = $.grep(CalendarEventList, function (e) {
                                return e.value != Id;
                            });
                            filteredEventsActivity.push(editableRowActivity);

                            window["CalendarEventList"] = filteredEventsCalender;
                            window["ActivityEventList"] = filteredEventsActivity;
                            $('.calendar').fullCalendar('destroy');
                            loadCalendar('BasicView', filteredEventsCalender, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, filteredEventsActivity);


                            //  loadCalendar('BasicView', filteredEvents);
                            $('#basic-view div.calendar').fullCalendar('refetchEvents');










                            eventBasicData.formGroupKey = create_UUID();
                            window["EventBasicDetail"] = eventBasicData;
                            $.jGrowl(response.Message, { position: 'center' });
                            // $scope.bindDraggable();
                        } else
                            console.log(response);

                    },

                    beforeSend: function () {
                        showLoader();
                    },

                    complete: function () {
                        $.unblockUI();
                        // $("#" + current_tab + " div.calendar").unblock();
                    }
                });

                //$.ajax({
                //    method: 'POST',
                //    url: "{{ URL::to('formUpdating/'.$formDetails->formID) }}/" + event.id,
                //    dataType: 'json',
                //    //data: {
                //    //    // our hypothetical feed requires UNIX timestamps
                //    //    start: event.start.format(),
                //    //    end: event.end.format(),
                //    //    myviewtime: moment().unix(),
                //    //    //recordID: event.id,
                //    //    resourceId: (event.resourceId) ? event.resourceId : '',
                //    //    resources: (resourceValue !== '') ? resourceValue : event.resources,
                //    //    activities: (event.activities) ? event.activities : '',
                //    //},
                //    beforeSend: function () {
                //        //showLoader("#" + current_tab +" div.calendar");
                //        showLoader();
                //    },
                //    success: function (response) {
                //        //alert(event.title + ' Updated Successfully.');
                //        $("#" + current_tab + " div.calendar").fullCalendar('refetchEvents');
                //        if (response.res > 0) {
                //            $.jGrowl(response.Message, { position: 'center' });
                //        }
                //        else {
                //            //alert(response.message);
                //            swal({ type: 'error', title: '', text: response.message });
                //        }
                //    },
                //    complete: function () {
                //        //$("#" + current_tab +" div.calendar").unblock(); 
                //        $.unblockUI();
                //    }
                //});
            }

        },
        // resize event's duration inside calendar view
        eventResize: function (event, delta, revertFunc, view) {

            if (!(userAccessRightsEdit)) {
                swal({
                    title: 'Form Edit',
                    text: 'You are not allowed to do this operation. Form Based Roles',
                    type: 'error'
                });
                return false;
            }


            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            var eventBasicData = window["EventBasicDetail"];
            var eventExtData = $(this).data('event');
            var Id = 0;
            if (typeof event.Id === "undefined")
                Id = event.value;
            else
                Id = event.Id;
            var start = event.start.format();
            var end = event.end.format();
            var isResizedEvent = 0;
            if (current_tab == "timeline-resource-view" || current_tab == "vertical-resource-view")
                isResizedEvent = 1;
            else
                isResizedEvent = 0;
            var resourceId = (event.resourceId) ? event.resourceId : '';
            var resources = (event.resources) ? event.resources : '';
            var activities = (event.activities) ? event.activities : '';
            var allDay = false;
            var formfieldDataListTempData = [];
            console.log(eventExtData);
            var activityName = '';
            if (current_tab == "vertical-activities-view") {
                activityId = (event.resourceId) ? event.resourceId : '';
                activitiesName = (event.activities) ? event.activities : '';
                formfieldDataListTempData = [
                    { "name": "Id", "value": parseInt(Id) },
                    { "name": "start", "value": start },
                    { "name": "end", "value": end },
                    { "name": "allDay", "value": allDay },
                    { "name": "color", "value": event.color },
                    { "name": "activities", "value": activityId },
                ];

            }
            else {
                formfieldDataListTempData = [
                    { "name": "Id", "value": parseInt(Id) },
                    { "name": "start", "value": start },
                    { "name": "end", "value": end },
                    { "name": "allDay", "value": allDay },
                    { "name": "color", "value": event.color },
                    { "name": "resources", "value": resourceId },
                ];
            }

            if (!confirm("Are you sure about this change?")) {
                revertFunc();
            } else {
                var resourceValue = '', title = '';
                if (event.resourceId && current_tab == "vertical-activities-view") {
                    var resource = $("#" + current_tab + " .calendar").fullCalendar('getResourceById', activityId);

                    if (resource && typeof resource[resourceColumn] != 'undefined') {
                        resourceValue = resource[resourceColumn];
                        title = event.activities + ' in ' + resourceValue;
                    }
                }
                else {
                    var resource = $("#" + current_tab + " .calendar").fullCalendar('getResourceById', event.resourceId);

                    if (resource && typeof resource[resourceColumn] != 'undefined') {
                        resourceValue = resource[resourceColumn];
                        title = event.activities + ' in ' + resourceValue;
                    }
                }
                $.ajax({
                    method: 'POST',
                    url: "api/FormAPI/EditEventData",
                    dataType: 'json',
                    contentType: "application/json",
                    data: "{'action':2,'userid':" + eventBasicData.userId + ",'Id':" + parseInt(Id) + ", 'formId':" + eventBasicData.formId + ",'topicId':" + eventBasicData.formData.topicId + ",'created_by':" + eventBasicData.created_by + ",'updated_by':" + eventBasicData.update_by + ",'formfieldDataListTemp':'" + JSON.stringify(formfieldDataListTempData) + "' ,'isResizedEvent':" + parseInt(isResizedEvent) + ",startDate:'" + start + "','endDate':'" + end + "','eventOverlap':" + eventOverlap + ",'activitiesOverlap':" + activitiesOverlap + "}", //$.param(formData)
                    success: function (response) {
                        if (response.res > 0) {

                            var CalendarEventList = window["CalendarEventList"];
                            var ActivityEventList = window["ActivityEventList"];
                            var CalenderEditableRow = $.grep(CalendarEventList, function (e) {
                                return e.value == event.value;
                            });
                            var ActivityEditableRow = $.grep(ActivityEventList, function (e) {
                                return e.value == event.value;
                            });

                            // for calender events
                            CalenderEditableRow.start = start;
                            CalenderEditableRow.end = end;
                            CalenderEditableRow.Id = Id;
                            CalenderEditableRow.title = event.title;
                            CalenderEditableRow.color = event.color;
                            CalenderEditableRow.description = event.description;
                            CalenderEditableRow.service = event.service;
                            if (current_tab != "vertical-activities-view") {
                                CalenderEditableRow.resources = resources;
                                CalenderEditableRow.resourceId = resourceId;
                            }

                            //for activity events
                            ActivityEditableRow.start = start;
                            ActivityEditableRow.end = end;
                            ActivityEditableRow.Id = Id;
                            ActivityEditableRow.title = event.title;
                            ActivityEditableRow.color = event.color;
                            ActivityEditableRow.description = event.description;
                            ActivityEditableRow.service = event.service;
                            ActivityEditableRow.resources = resources;
                            if (current_tab == "vertical-activities-view") {
                                ActivityEditableRow.resourceId = activityId;
                                ActivityEditableRow.activities = activities;// SETTING UP ACTIVITY ID AS RESOURCE ID FOR VERTICAL RESOURCE DATA .
                            }
                            else {
                                ActivityEditableRow.resourceId = activities;
                                ActivityEditableRow.activities = activities;// SETTING UP ACTIVITY ID AS RESOURCE ID FOR VERTICAL RESOURCE DATA .
                            }
                            // editableRow.color = event.color;

                            //var  filteredItems = CalendarEventList.filter((item) => item.Id !== response.Id);
                            console.log(event.value);
                            console.log('ffffff');
                            console.log(CalenderEditableRow);

                            var filteredEventsCalender = $.grep(CalendarEventList, function (e) {
                                return e.value != event.value;
                            });
                            var filteredEventsActivity = $.grep(ActivityEventList, function (e) {
                                return e.value != event.value;
                            });
                            filteredEventsCalender.push(CalenderEditableRow);
                            filteredEventsActivity.push(ActivityEditableRow);
                            //$.grep(CalendarEventList, function (e) {
                            //    return e.value = response.Id;
                            //}).end = end;
                            //editableRow.start = start;
                            //editableRow.end = end;




                            console.log(response.Id);
                            // console.log(editableRow);
                            console.log('before insertion ');
                            console.log(filteredEventsCalender);

                            // CalendarEventList.push(editableRow);
                            window["CalendarEventList"] = filteredEventsCalender;
                            window["ActivityEventList"] = filteredEventsActivity;
                            console.log('after  insertion ');
                            console.log(filteredEventsActivity);
                            $('.calendar').fullCalendar('destroy');
                            loadCalendar('BasicView', filteredEventsCalender, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, filteredEventsActivity);
                            //  loadCalendar('BasicView', filteredEvents);
                            $('#basic-view div.calendar').fullCalendar('refetchEvents');


                            eventBasicData.formGroupKey = create_UUID();
                            window["EventBasicDetail"] = eventBasicData;
                            $.jGrowl(response.Message, { position: 'center' });
                            // $scope.bindDraggable();
                        } else {
                            revertFunc();
                            swal({ type: 'error', title: '', text: response.overlapMessage });

                        }

                    },

                    beforeSend: function () {
                        showLoader();
                    },

                    complete: function () {
                        $.unblockUI();
                        // $("#" + current_tab + " div.calendar").unblock();
                    }
                });

                //$.ajax({
                //    method: 'POST',
                //    url: "{{ URL::to('formUpdating/'.$formDetails->formID) }}/" + event.id,
                //    dataType: 'json',
                //    //data: {
                //    //    // our hypothetical feed requires UNIX timestamps
                //    //    start: event.start.format(),
                //    //    end: event.end.format(),
                //    //    myviewtime: moment().unix(),
                //    //    //recordID: event.id,
                //    //    resourceId: (event.resourceId) ? event.resourceId : '',
                //    //    resources: (resourceValue !== '') ? resourceValue : event.resources,
                //    //    activities: (event.activities) ? event.activities : '',
                //    //},
                //    beforeSend: function () {
                //        //showLoader("#" + current_tab +" div.calendar");
                //        showLoader();
                //    },
                //    success: function (response) {
                //        //alert(event.title + ' Updated Successfully.');
                //        $("#" + current_tab + " div.calendar").fullCalendar('refetchEvents');
                //        if (response.res > 0) {
                //            $.jGrowl(response.Message, { position: 'center' });
                //        }
                //        else {
                //            //alert(response.message);
                //            swal({ type: 'error', title: '', text: response.message });
                //        }
                //    },
                //    complete: function () {
                //        //$("#" + current_tab +" div.calendar").unblock(); 
                //        $.unblockUI();
                //    }
                //});
            }
        },



        eventRender: function (event, element) {
            // console.log(event);

            var table = $("<table class='event-detail'></table>"), deleteParams;

            if (event.data) {
                //add row data on right hand side
                var imageFound = 0, rowRecord = "", data = event.data;
                $.each(columns, function (field, text) {
                    if (typeof (data[field]) !== 'undefined' && $.inArray(field, ['current_status', 'title', 'color']) === -1) {
                        var value = data[field];
                        var result = value.toString().indexOf("uploads");

                        if (result < 0) {
                            // No image found
                            if (data[field] !== "") { rowRecord += "<div class='" + field + "'><strong>" + text + ":</strong> " + data[field] + "</div>"; }
                        } else {
                            // Image found
                            //var result = str.toString().indexOf("#galleryModal");
                            //if(result < 0){
                            imageFound++;
                            if (/\.(jpe?g|png|gif)$/i.test(value)) {
                                if (value.startsWith("uploads"))
                                    img = "<img class='img-responsive' src='{{asset('')}}/" + value + "'/>";
                                else
                                    img = "<img class='img-responsive' src='{{asset('/uploads/users/'.$uid)}}/" + value + "'/>";
                                $(img).on("load", function () {
                                    //cell.getRow().normalizeHeight();
                                }).on("error", function () {
                                    //  console.log("file " + $(this).attr('src') + " not found");
                                    img = '';
                                });
                            } else {
                                if (/\.(pdf)$/i.test(value)) // pdf files                        
                                    img = "<a target='_blank' href='{{url('/file-view/')}}?file=" + value + "'><b>" + value + "</b></a>";
                                else {
                                    if (value.startsWith("upload"))
                                        img = "<a href='{{asset('')}}/" + value + "'><b>" + value + "</b></a>";
                                    else
                                        img = "<a href='{{asset('/uploads/users/'.$uid)}}/" + value + "'><b>" + value + "</b></a>";
                                }
                            }
                            table.append("<tr><td class='media'>" + img + "</td></tr>");
                            //}
                        }
                    }
                });

                // deleteParams = JSON.stringify({ formId: <?= $formDetails -> formID; ?>, created_by: event.data.fg_created_by_id, created_at: event.data.fg_created_at_timestamp});

            }
            else {
                var rowRecord = "";
                var eventData = {
                    Images: event.files,
                    title: event.title,
                    start: event.start ? customDate(event.start.format()) : '',
                    end: event.end ? customDate(event.end.format()) : '',
                    allDay: event.allDay,
                    service: event.service,
                    description: event.description,
                    resources: event.resources,
                    activities: event.activities,
                    activityName: event.activityName,
                };
                var imageFound = 0; var ImgString = ''; var showAllFiles = '';
                if (eventData.Images != null && eventData.Images.length > 0) {

                    var _images = eventData.Images.split(',');

                    if (_images.length > 0) {
                        for (var count = 0; count < _images.length; count++) {
                            var imgPath = _images[count].toString().replace("~", "");
                            imageFound++;
                            ImgString += "<div class='" + _images[count].toString() + "'><img height='150' src='" + imgPath + "'></div>";
                        }

                        if (imageFound == 1)
                            rowRecord += "<div class='" + eventData.Images + "'>" + ImgString + "</div>";
                    }
                }
                if (eventData.title != null && eventData.title.length > 0)
                    rowRecord += "<div class='" + eventData.title + "'><strong>Title:</strong> " + eventData.title + "</div>";
                if (eventData.start != null && eventData.start.length > 0)
                    rowRecord += "<div class='" + eventData.start + "'><strong>Start:</strong> " + eventData.start + "</div>";
                if (eventData.end != null && eventData.end.length > 0)
                    rowRecord += "<div class='" + eventData.end + "'><strong>End:</strong> " + eventData.end + "</div>";
                if (eventData.allDay != null)
                    rowRecord += "<div class='" + eventData.allDay + "'><strong>All Day:</strong> " + eventData.allDay + "</div>";




                if (eventData.resources != null && eventData.resources.length > 0)
                    rowRecord += "<div class='" + eventData.resources + "'><strong>Resource:</strong> " + eventData.resources + "</div>";
                if (eventData.activityName != null && eventData.activityName.length > 0)
                    rowRecord += "<div class='" + eventData.activityName + "'><strong>Activities:</strong> " + eventData.activityName + "</div>";


                if (eventData.service != null && eventData.service.length > 0)
                    rowRecord += "<div class='" + eventData.service + "'><strong>Service:</strong> " + eventData.service + "</div>";
                if (eventData.description != null && eventData.description.length > 0)
                    rowRecord += "<div class='" + eventData.description + "'><strong>Description:</strong> " + eventData.description + "</div>";
                if (imageFound > 1) {
                    showAllFiles = "<a  class='btn btn-xs btn-default' data-toggle='modal' data-target='#galleryModal' title='Show all files'   data-files='" + eventData.Images + "'>Show all files</a>";
                    rowRecord += "<div class='" + eventData.Images + "'><strong>File Uploads:</strong> " + showAllFiles + "</div>";
                }
            }


            table.append("<tr><td>" + rowRecord + "</td></tr>");
            var basicDetails = window["EventBasicDetail"];
            var actionRow = "<a class='btn btn-primary edit-event' title='Edit'  ui-sref='editFormEntryData({ formId: " + basicDetails.formId + ",formGroupKey:calxyz25ss,Id:" + event.Id + "})'  href='#/form/editEntry/" + basicDetails.formId + "/calxyz25ss/" + event.Id + "'> <i class='fa fa-edit'></i></a > ";
            actionRow += "<a class='btn btn-danger delete-event' title='Delete'  data-formgroupkey='" + event.Id + "' data-deleteparams=''><i class='fa fa-trash'></i></a>";
            table.append("<tr><td align='center'>" + actionRow + "</td></tr>");

            element.attr('title', event.title);
            element.popover({
                container: 'body',
                animation: true,
                //delay: 300,
                content: table,
                trigger: 'click',
                html: true,
                placement: 'top'
            });


        },

        eventClick: function (calEvent, jsEvent, view) {
            console.log(view);
            /*var r=confirm("Delete " + calEvent.title);
            if (r===true)
            {
                $('#basic-view div.calendar').fullCalendar('removeEvents', calEvent._id);
            }*/
        },

    },
        // Basic View
        myOptions = {

            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,basicWeek,basicDay'
            },
            //events: function (start, end, timezone, callback) {
            //    $.ajax({
            //        url: "{{ URL::to('calendar/getEvents/'.$formDetails->formID.'/basic') }}",
            //        dataType: 'json',
            //        data: {
            //            // our hypothetical feed requires UNIX timestamps
            //            //start: start.unix(),
            //            //end: end.unix()
            //        },
            //        success: function (response) {
            //            callback(response);
            //        }
            //    });
            //},
            events: calenderData,
            selectable: true,
            selectHelper: true,
            select: function (start, end) {
                // alert(start + end)
                if (!checkUserRoleRights()) {
                    swal({
                        title: 'Form Entry',
                        text: 'You are not allowed to do this operation. Form Based Roles',
                        type: 'error'
                    });
                    return false;
                }
                dialog.find("form #tab_start").val(start.format());
                dialog.find("form #tab_end").val(start.format());
                dialog.find("form #allDay").val('true');
                dialog.find("form #tab_color").val('#8500b2').change();
                dialog.dialog("open");
                $('.popover').remove();
                $('#basic-view div.calendar').fullCalendar('unselect');
            },

        };
    calendarOptions = $.extend({}, defaultOptions, myOptions);
    $('#basic-view div.calendar').fullCalendar(calendarOptions);

    // List View
    myOptions = {
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'listYear,listMonth,listWeek,listDay'
        },
        // customize the button names,
        // otherwise they'd all just say "list"
        views: {
            listYear: { buttonText: 'year' },
            listMonth: { buttonText: 'month' },
            listWeek: { buttonText: 'week' },
            listDay: { buttonText: 'day' },
        },
        defaultView: 'listYear',
        defaultDate: new Date(),
        events: calenderData,
    };
    calendarOptions = $.extend({}, defaultOptions, myOptions);
    $('#list-view div.calendar').fullCalendar(calendarOptions);


    // Agenda View
    myOptions = {
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        defaultView: 'agendaWeek',
        events: calenderData,
        scrollTime: '00:00',
        allDaySlot: false,

        selectable: true,
        selectHelper: true,
        select: function (start, end) {
            if (!checkUserRoleRights()) {
                swal({
                    title: 'Form Entry',
                    text: 'You are not allowed to do this operation. Form Based Roles',
                    type: 'error'
                });
                return false;
            }
            dialog.find("form #tab_start").val(start.format());
            dialog.find("form #tab_end").val(end.format());
            dialog.find("form #allDay").val('false');
            dialog.find("form #tab_color").val('#8500b2').change();
            dialog.dialog("open");

            $("#agenda-view div.calendar").fullCalendar('unselect');
        },
        droppable: true, // this allows things to be dropped onto the calendar
        drop: function (date, jsEvent, ui, resourceId) {
            console.log($(this));
            if (!checkUserRoleRights()) {
                swal({
                    title: 'Form Entry',
                    text: 'You are not allowed to do this operation. Form Based Roles',
                    type: 'error'
                });
                return false;
            }
            var eventBasicData = window["EventBasicDetail"];

            var eventExtData = $(this).data('event');
            var title = eventExtData.title ? eventExtData.title : '';
            var color = eventExtData.color ? eventExtData.color : '';
            var start = date.format();

            var defaultDuration = moment.duration(eventExtData.duration);
            var end = date.clone().add(defaultDuration);
            var activities = eventExtData.id;

            var allDay = false;
            var formfieldDataListTempData = [];
            console.log(eventExtData);

            formfieldDataListTempData = [

                { "name": "title", "value": title },
                { "name": "start", "value": start },
                { "name": "end", "value": end },
                { "name": "color", "value": color },
                { "name": "allDay", "value": allDay },
                { "name": "service", "value": "" },
                { "name": "description", "value": "" },
                { "name": "activities", "value": activities },
                { "formGroupKey": eventBasicData.formGroupKey, "name": "formGroupKey", "value": eventBasicData.formGroupKey }
            ];
            if (title !== '') {
                var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
                $.ajax({
                    method: 'POST',
                    url: "api/FormAPI/GeneratedFormData",
                    dataType: 'json',
                    contentType: "application/json",
                    data: "{'action':" + eventBasicData.action + ",'userId':" + eventBasicData.userId + ",'formId':" + eventBasicData.formId + ",'topicId':" + eventBasicData.formData.topicId + ",'created_by':" + eventBasicData.created_by + ",'updated_by':" + eventBasicData.update_by + ",'formGroupKey':'" + eventBasicData.formGroupKey + "','formfieldDataListTemp':'" + JSON.stringify(formfieldDataListTempData) + "'}", //$.param(formData)
                    success: function (response) {
                        if (response.res > 0) {

                            var calenderNewRow = {
                                Id: response.Id,
                                label: null,
                                selected: false,
                                value: response.Id,
                                color: color,
                                title: title,
                                start: start,
                                end: end,
                                allDay: allDay,
                                activities: title

                            };

                            var activityNewRow = {
                                Id: response.Id,
                                label: null,
                                selected: false,
                                value: response.Id,
                                color: color,
                                title: title,
                                start: start,
                                end: end,
                                allDay: allDay,
                                activities: title,
                                resourceId: activities

                            };



                            eventBasicData.formGroupKey = create_UUID();
                            window["EventBasicDetail"] = eventBasicData;




                            var CalendarEventList = window["CalendarEventList"];
                            var ActivityEventList = window["ActivityEventList"];
                            console.log('before insertion ');
                            console.log(CalendarEventList);


                            CalendarEventList.push(calenderNewRow);
                            ActivityEventList.push(activityNewRow);
                            window["CalendarEventList"] = CalendarEventList;
                            window["ActivityEventList"] = ActivityEventList;
                            console.log('after  insertion ');
                            console.log(CalendarEventList);
                            $('.calendar').fullCalendar('destroy');
                            loadCalendar('BasicView', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, ActivityEventList);
                            //  loadCalendar('BasicView', CalendarEventList);
                            $('#basic-view div.calendar').fullCalendar('refetchEvents');


                            eventBasicData.formGroupKey = create_UUID();
                            window["EventBasicDetail"] = eventBasicData;
                            $.jGrowl(response.Message, { position: 'center' });
                        }

                    },

                    beforeSend: function () {
                        showLoader();
                    },

                    complete: function () {
                        $.unblockUI();
                    }
                });
            }
        }

    };
    var calendarOptions = $.extend({}, defaultOptions, myOptions);
    $('#agenda-view div.calendar').fullCalendar(calendarOptions);




    // timeLine resource view
    function addExternalEvent(eventData) {


        //var eventData = {
        //    title: title,
        //    color: color,
        //    allDay: allDay,
        //    start: start,
        //    end: end,
        //    resourceId: resourceIdParam,
        //    resources: resourcesParam
        //    //activities: activityValue,

        //};
        var eventBasicData = window["EventBasicDetail"];
        console.log('start date is ' + eventData.start);
        console.log('end date is ' + eventData.end);
        var param = {};
        console.log(eventBasicData);
        param.action = eventBasicData.action;
        param.formId = eventBasicData.formId;
        param.userId = eventBasicData.userId;
        param.topicId = eventBasicData.formData.topicId;
        param.created_by = eventBasicData.created_by;
        param.update_by = eventBasicData.update_by;
        param.formGroupKey = eventBasicData.formGroupKey
        var service = ''; var description = '';
        if (activitiesCategory != null) {
            service = eventData.service;
            description = eventData.description;
        }
        var formfieldDataListTempData = [];

        formfieldDataListTempData = [

            { "name": "title", "value": eventData.title },
            { "name": "start", "value": eventData.start },
            { "name": "end", "value": eventData.end },
            { "name": "color", "value": eventData.color },
            { "name": "allDay", "value": eventData.allDay },
            { "name": "service", "value": service },
            { "name": "description", "value": description },
            { "name": "resources", "value": eventData.resourceId },
            { "name": "activities", "value": eventData.id },
            // { "name": "resources", "value": resources},
            { "formGroupKey": eventBasicData.formGroupKey, "name": "formGroupKey", "value": eventBasicData.formGroupKey }
        ];

        param.formfieldDataListTemp = formfieldDataListTempData;

        $.ajax({
            method: 'POST',
            url: "api/FormAPI/GeneratedFormData",
            dataType: 'json',
            contentType: "application/json",
            // data: "{'action':" + param.action + ",'formId':" + param.formId + ",'topicId':" + param.topicId + ",'created_by':" + param.created_by + ",'updated_by':" + param.update_by + ",'formGroupKey':" + param.formGroupKey + ",'formfieldDataListTemp':" + JSON.stringify(param.formfieldDataListTemp) + "}", //$.param(formData)
            data: "{'action':" + param.action + ",'userId':" + param.userId + ",'formId':" + param.formId + ",'topicId':" + param.topicId + ",'created_by':" + param.created_by + ",'updated_by':" + param.update_by + ",'formGroupKey':'" + param.formGroupKey + "','formfieldDataListTemp':'" + JSON.stringify(param.formfieldDataListTemp) + "'}", //$.param(formData)

            beforeSend: function () {
                showLoader();
            },
            success: function (response) {
                if (response.res > 0) {
                    console.log(response);

                    var calenderNewRow = {
                        Id: response.Id,
                        label: null,
                        selected: false,
                        value: response.Id,
                        color: eventData.color,
                        title: eventData.title,
                        start: eventData.start,
                        end: eventData.end,
                        allDay: eventData.allDay,
                        resourceId: eventData.resourceId,
                        resources: eventData.resources,
                        service: service,
                        description: description,
                        activities: eventData.activities
                    };
                    var activityNewRow = {
                        Id: response.Id,
                        label: null,
                        selected: false,
                        value: response.Id,
                        color: eventData.color,
                        title: eventData.title,
                        start: eventData.start,
                        end: eventData.end,
                        allDay: eventData.allDay,
                        resourceId: eventData.id,
                        resources: eventData.resources,
                        service: service,
                        description: description,
                        activities: eventData.activities
                    };




                    var CalendarEventList = window["CalendarEventList"];
                    var ActivityEventList = window["ActivityEventList"];
                    console.log('before insertion ');
                    console.log(CalendarEventList);

                    //CalendarEventList = $.grep(CalendarEventList, function (e) {
                    //    return e.value != Id;
                    //});
                    CalendarEventList.push(calenderNewRow);
                    ActivityEventList.push(activityNewRow);
                    window["CalendarEventList"] = CalendarEventList;
                    window["ActivityEventList"] = ActivityEventList;
                    console.log('after  insertion ');
                    console.log(CalendarEventList);
                    $('.calendar').fullCalendar('destroy');



                    loadCalendar('BasicView', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, ActivityEventList);
                    $('#basic-view div.calendar').fullCalendar('refetchEvents');


                    eventBasicData.formGroupKey = create_UUID();
                    window["EventBasicDetail"] = eventBasicData;





                    $.jGrowl(response.Message, { position: 'center' });
                    // swal({ type: 'success', title: 'success', text: "created successfully" });
                    //var eventData = {
                    //    id: response.Id,
                    //    title: title,
                    //    start: start,
                    //    end: end,
                    //    color: color
                    //};
                    //$("#" + current_tab + " div.calendar").fullCalendar('renderEvent', eventData);
                    //$("#" + current_tab + " div.calendar").fullCalendar('refetchEvents');
                    //$(".calendar").not($("#" + current_tab + " div.calendar")).fullCalendar('refetchEvents');

                    // location.reload(true);
                } else {
                    swal({ type: 'error', title: '', text: "failed" });
                }


            },
            complete: function () {
                $.unblockUI();
            }
        });








        //console.log('velcome');
        //console.log(eventData);
        //var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
        //$.ajax({
        //    method: 'POST',
        //    url: "",
        //    dataType: 'json',
        //    data: eventData,
        //    beforeSend: function () {
        //        showLoader();
        //    },
        //    success: function (response) {
        //        if (response.success) {
        //            $.jGrowl(response.message, { position: 'center' });
        //            //toast({type: 'success', title: response.message});

        //        } else {
        //            swal({ type: 'error', title: '', text: response.message });
        //        }
        //    },
        //    complete: function () {
        //        $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
        //        $.unblockUI();
        //    }
        //});
    }


    var resourceOptions = {

        selectable: true,
        selectHelper: true,
        select: function (start, end, jsEvent, view, resource) {
            if (!checkUserRoleRights()) {
                swal({
                    title: 'Form Entry',
                    text: 'You are not allowed to do this operation. Form Based Roles',
                    type: 'error'
                });
                return false;
            }
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            var resource = $("#" + current_tab + " .calendar").fullCalendar('getResourceById', resource.id);

            //console.log(resource)
            dialog.find("form #tab_start").val(start.format());
            dialog.find("form #tab_end").val(end.format());
            if (typeof resource.eventColor != 'undefined')
                dialog.find("form #tab_color").val('#' + resource.eventColor).change();
            dialog.find("form #allDay").val('false');
            dialog.find("form #resourceId").val(resource.id);
            if (typeof resource[resourceColumn] != 'undefined') {
                resourceValue = resource[resourceColumn];
                dialog.find("form #resources").val(resourceValue);
                dialog.find("form #tab_title").val(' in ' + resourceValue);
            }
            dialog.dialog("open");

            $("#" + current_tab + " .calendar").fullCalendar('unselect');
        },
        droppable: true, // this allows things to be dropped onto the calendar
        drop: function (date, jsEvent, ui, resourceId) {
            if (!checkUserRoleRights()) {
                swal({
                    title: 'Form Entry',
                    text: 'You are not allowed to do this operation. Form Based Roles',
                    type: 'error'
                });
                return false;
            }
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');

            var eventExtData = $(this).data('event');
            console.log('external event data :');
            console.log(eventExtData);
            var resource = $("#" + current_tab + " .calendar").fullCalendar('getResourceById', resourceId);
            var title = eventExtData.title ? eventExtData.title : '';
            var id = eventExtData.id ? eventExtData.id : ''
            var resourceValue = '', activityValue = title;
            if (typeof resource[resourceColumn] != 'undefined') {
                resourceValue = resource[resourceColumn];
            }
            var defaultDuration = moment.duration(eventExtData.duration);
            var end = date.clone().add(defaultDuration);

            var eventData = {
                id: id,
                title: title,
                color: eventExtData.color,
                allDay: 'false',
                start: date.format(),
                end: end.format(),
                resourceId: resourceId,
                resources: resourceValue,
                activities: activityValue
            };

            //for activity category && overlap check.
            var postData = {
                action: 21,
                userId: userid,
                formId: formID,
                ActivityFormId: activitiesForm,
                ActivityId: eventExtData.id,
                resourceId: resourceId,
                isActivityCategory: 1,
                resEntryColumn: activitiesCategory,
                compareColumn: activityField,
                compareValue: eventExtData.title,
                startDate: date.format(),
                endDate: end.format(),
                eventOverlap: eventOverlap,
                activitiesOverlap: activitiesOverlap,
                isResourceExternalDrop: true

            }
            // select a category
            if (activitiesCategory !== '' && activitiesCategory != null) {
                async function callCategory(eventData) {

                    // inputOptions can be an object or Promise
                    const inputOptions = new Promise((resolve) => {
                        // var postData = { formID: activitiesForm, mainField: activityField, activity: activityValue, categoryField: activitiesCategory, calendarForm: formID, eventData: eventData };

                        console.log(postData);
                        $.post("api/FormAPI/getReferralFormFields", postData, function (response) {
                            console.log('response is this ');
                            console.log(response);


                            if (typeof response.overlapMesage !== 'undefined') {
                                console.log(typeof response.success);
                                swal({ type: 'error', title: '', text: response.overlapMesage });
                                $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                            } else {

                                var categoryEntry = response[0];
                                var resolveCategory = {};
                                var categoryString = [];
                                if (categoryEntry !== 'undefined') {
                                    try {
                                        if (categoryEntry.resEntry !== 'undefined')
                                            categoryString = categoryEntry.resEntry.split(',');
                                        for (var count = 0; count < categoryString.length; count++) {
                                            resolveCategory[categoryString[count]] = categoryString[count];
                                        }
                                    }
                                    catch (err) {
                                        console.log(err);
                                    }
                                }

                                console.log(resolveCategory);
                                if (Object.keys(resolveCategory).length > 1) {
                                    resolve(resolveCategory);
                                } else {
                                    //swal.close();
                                    //console.log(response);
                                    var service = '';
                                    if (typeof resolveCategory.length === 'undefined') {
                                        // 1 service provided
                                        $.each(resolveCategory, function (key, value) {
                                            service = value;
                                        });
                                    }
                                    swal({
                                        input: 'textarea',
                                        inputAttributes: { id: 'swal-service-description', rows: '3' },
                                        inputPlaceholder: 'Type your message here',
                                        focusConfirm: false,
                                        showCloseButton: true,
                                        preConfirm: () => {
                                            return [
                                                service,
                                                $('textarea#swal-service-description').val()
                                            ]
                                        }
                                    }).then((result) => {
                                        //console.log(result)
                                        if (result.value) {
                                            var service = $.trim(result.value[0]), description = $.trim(result.value[1]);

                                            if (service !== '')
                                                eventData.title += ' (' + service + ') ';

                                            if (resourceValue !== '')
                                                eventData.title += ' in ' + resourceValue;

                                            if (eventData.title !== '') {
                                                eventData['service'] = service;
                                                eventData['description'] = description;
                                                addExternalEvent(eventData);
                                            }
                                        } else if (result.dismiss === 'close' || result.dismiss === 'esc' || result.dismiss === 'overlay') {
                                            $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                                        }
                                    });
                                }
                            }
                        });
                    })

                    await swal({
                        title: 'Enter following details:',
                        input: 'select',
                        html: '<textarea class="form-control" id="swal-service-description" placeholder="Type your message here" rows="3"></textarea>',
                        inputOptions: inputOptions,
                        inputAttributes: { id: 'swal-service' },
                        inputPlaceholder: 'Select an option',
                        inputValidator: (value) => {
                            return !value && 'You need to select something!'
                        },
                        focusConfirm: false,
                        showCloseButton: true,
                        preConfirm: () => {
                            return [
                                $('select#swal-service').val(),
                                $('textarea#swal-service-description').val()
                            ]
                        }
                    }).then((result) => {
                        //console.log(result)
                        if (result.value) {
                            var service = $.trim(result.value[0]), description = $.trim(result.value[1]);

                            eventData.title += ' (' + service + ') ';
                            if (eventData.resources !== '') {
                                eventData.title += 'in ' + eventData.resources;
                            }
                            if (eventData.title !== '') {
                                eventData['service'] = service;
                                eventData['description'] = description;
                                addExternalEvent(eventData);
                            }
                        } else if (result.dismiss === 'close' || result.dismiss === 'esc' || result.dismiss === 'overlay') {
                            $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                        }
                    });
                }
                callCategory(eventData);
            } else {
                if (resourceValue !== '') {
                    eventData.title += ' in ' + resourceValue;
                }
                if (eventData.title !== '') {
                    addExternalEvent(eventData);
                }
            }
        }

    };

    myOptions = {
        //defaultDate: '2017-12-07',
        scrollTime: '00:00', // undo default 6am scrollTime
        header: {
            left: 'myCustomButton prev,next today',
            center: 'title',
            right: 'timelineDay,timelineThreeDays,timelineWeek,timelineMonth,timelineYear'
        },
        customButtons: {
            myCustomButton: {
                text: "Client",
                click: function () {
                    // window.location.href = "{{ URL::to('records/'.$formDetails->resourceForm) }}";
                }
            }
        },
        defaultView: 'timelineDay',
        views: {
            timelineThreeDays: {
                type: 'timeline',
                duration: { days: 3 }
            },
            timelineMonth: { buttonText: 'month' },
            timelineWeek: { buttonText: 'week' },
            timelineDay: { buttonText: 'day' },
        },

        resourceAreaWidth: '40%',
        events: calenderData,
        // resourceLabelText: "Client",
        resourceColumns: resColumns,
        resources: resourceData,
        resourceOrder: resourceOrder,

        resourceRender: function (resourceObj, labelTds, bodyTds) {
            var cellText = '';
            //cellText = labelTds.find('.fc-cell-text').text();
            //labelTds.find('.fc-cell-text').html(cellText);

            for (i = 0; i < labelTds.length; i++) {
                //console.log($(labelTds[i]));
                var labelTd = $(labelTds[i]);
                var cellText = labelTd.find('.fc-cell-text').text();
                var result1 = cellText.indexOf("img-responsive");
                if (result1 >= 0) {
                    labelTd.find('.fc-cell-text').html(cellText);
                }
                var result2 = cellText.indexOf("file-download");
                if (result2 >= 0) {
                    labelTd.find('.fc-cell-text').html(cellText);
                }
            }
        },
    };
    calendarOptions = $.extend({}, defaultOptions, resourceOptions, myOptions);
    $('#timeline-resource-view div.calendar').fullCalendar(calendarOptions);


    /// vertical resource view.

    myOptions = {
        //defaultDate: '2017-12-07',
        scrollTime: '00:00', // undo default 6am scrollTime            
        header: {
            left: 'myCustomButton prev,next today',
            center: 'title',
            right: 'agendaDay,agendaTwoDays,agendaThreeDays'
        },
        customButtons: {
            myCustomButton: {
                text: "ClientName",
                click: function () {
                    // window.location.href = "{{ URL::to('records/'.$formDetails->resourceForm) }}";
                }
            }
        },
        views: {
            agendaTwoDays: {
                type: 'agenda',
                duration: { days: 2 },

                // views that are more than a day will NOT do this behavior by default
                // so, we need to explicitly enable it
                groupByResource: true,

                // uncomment this line to group by day FIRST with resources underneath
                //groupByDateAndResource: true
            },
            agendaThreeDays: {
                type: 'agenda',
                duration: { days: 3 },
                groupByResource: true,
            }
        },
        defaultView: 'agendaDay',
        events: calenderData,
        resources: resourceData,
        //events: function (start, end, timezone, callback) {
        //    $.ajax({
        //        url: "{{ URL::to('calendar/getEvents/'.$formDetails->formID.'/v-resources') }}",
        //        dataType: 'json',
        //        data: {
        //            // our hypothetical feed requires UNIX timestamps
        //            //start: start.unix(),
        //            //end: end.unix()
        //        },
        //        success: function (response) {
        //            callback(response);
        //        }
        //    });
        //},
        allDaySlot: false,
        //resources: {
        //    url: "{{ URL::to('calendar/getResources/resources/'.$formDetails->formID) }}",
        //    dataType: 'json'
        //},
    };
    calendarOptions = $.extend({}, defaultOptions, resourceOptions, myOptions);
    $('#vertical-resource-view div.calendar').fullCalendar(calendarOptions);


    // Vertical Activities View
    myOptions = {
        scrollTime: '00:00', // undo default 6am scrollTime            
        header: {
            left: 'myCustomButton prev,next today',
            center: 'title',
            right: 'agendaDay,agendaTwoDays,agendaThreeDays'
        },
        customButtons: {
            myCustomButton: {
                text: "Professional Name",
                click: function () {
                    //  window.location.href = "{{ URL::to('records/'.$formDetails->activitiesForm) }}";
                }
            }
        },
        views: {
            agendaTwoDays: {
                type: 'agenda',
                duration: { days: 2 },

                // views that are more than a day will NOT do this behavior by default
                // so, we need to explicitly enable it
                groupByResource: true,

                // uncomment this line to group by day FIRST with resources underneath
                //groupByDateAndResource: true
            },
            agendaThreeDays: {
                type: 'agenda',
                duration: { days: 3 },
                groupByResource: true,
            }
        },
        defaultView: 'agendaDay',
        //events: function (start, end, timezone, callback) {
        //    $.ajax({
        //        url: "{{ URL::to('calendar/getEvents/'.$formDetails->formID.'/v-activities') }}",
        //        dataType: 'json',
        //        data: {
        //            // our hypothetical feed requires UNIX timestamps
        //            //start: start.unix(),
        //            //end: end.unix()
        //        },
        //        success: function (response) {
        //            callback(response);
        //        }
        //    });
        //}, 
        events: activityEvents,
        resources: activityFormData,
        allDaySlot: false,
        //resources: {
        //    url: "{{ URL::to('calendar/getResources/activities/'.$formDetails->formID) }}",
        //    dataType: 'json'
        //},



    };
    calendarOptions = $.extend({}, defaultOptions, myOptions);
    $('#vertical-activities-view div.calendar').fullCalendar(calendarOptions);






}



function replaceColumn(namecol) {
    var col = namecol;
    if (col != "") {
        if (col == "end") {
            // if ($scope.isCreateNew)
            col = "[" + col + "]";
            // else
            //    col = col;
        } if (col != undefined)
            if (col.includes('-'))
                col = col.replace('-', '_');
            else
                col = col;
    }
    return col;
}


function GetImage(type) {
    if (type == 0) {
        return "<br/><img src = '../../Scripts/fullCalender/Styles/images/attendance.png' style='width:24px;height:24px'/><br/>"
    }
    else if (type == 1) {
        return "<br/><img src = '../../Scripts/fullCalender/Styles/images/not_available.png' style='width:24px;height:24px'/><br/>"
    }
    else
        return "<br/><img src = '../../Scripts/fullCalender/Styles/images/not_available.png' style='width:24px;height:24px'/><br/>"
}

function checkIfCalenderControl(formId) {





    var flag = false;
    try {
        $.ajax({
            type: "POST",
            url: "api/FormAPI/ManageForm",
            data: "{'action':12,'formId':" + formId + "}",
            contentType: "application/json",
            datatype: "json",
            success: function (data) {
                // console.log('calender is : ' + data[0].isCalendar);
                if (parseInt(data[0].isCalendar) == 1) {
                    flag = true;
                    $('#form-records').hide();
                    $('#calendar').show();


                }
                else {
                    flag = false;
                    $('#form-records').show();
                    $('#calendar').hide();




                }
            }

        });
        return flag;
    }
    catch
    {
        console.log('unable to check calender control');
        return false;
    }

}


function hasExtension(inputID, exts) {
    var fileName = document.getElementById(inputID).value;
    return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
}










// records page functions
function showQR() {
    bootbox.dialog({
        onEscape: true,
        title: "QR Code",
        message: '<div id="menuId" class="list-group text-center clearfix">' +
            '<div id="codeSection"></div>' +
            '<p class="mt-10">Scan me to access this form page.</p>' +

            '</div>'
    });
    new QRCode(document.getElementById("codeSection"), {
        width: 400,
        height: 400,
        dotScale: 1 ,
        text: window.location.href + "?check=anonymous",
        logo: "./../../newAssets/images/favicons/qr-logo.png",
        logoWidth:80, // width. default is automatic width
        logoHeight:80, // height. default is automatic height
        logoBackgroundColor:'rgb(0, 0, 0, 0)', // Logo backgroud color, Invalid when `logBgTransparent` is true; default is '#ffffff'
        logoBackgroundTransparent:true, 

    });
    // jQuery('#codeSection').qrcode({
    //     width: 400,
    //     height: 400,
    //     render: "canvas",
    //     text: window.location.href + "?check=anonymous"
    //     //text:"https://github.com/jeromeetienne/jquery-qrcode"
    // });
}

function quickSignUp(reqType) {

    //   reqType   either will be 'signUp'  or  'anonymous'

    var userName = $('#name').val();
    var password = $('#password').val();
    var confirmPass = $('#re-password').val();

    var anonymousUserId = $('#txtAnonymousUserId').val();
    var anonymousPassword = $('#txtAnonymousPassword').val();
    var param = {};
    param.uid = (new Date().getTime()).toString(36);
    param.isQuickSignUp = true;
    param.action = 7;
    if (reqType == "signUp") {
        param.fullName = 'name title';
        param.name = userName;
        param.newPassword = password;
        param.confirmPassword = confirmPass;
    }
    else if (reqType == "anonymous") {
        param.fullName = 'Anonymous User';
        param.name = anonymousUserId;
        param.newPassword = anonymousPassword;
        param.confirmPassword = anonymousPassword;
    }

    $.ajax({
        type: "POST",
        url: "api/FormAPI/profile",
        data: JSON.stringify(param),
        contentType: "application/json",
        datatype: "json",
        success: function (data) {
            var respData = data;
            if (respData.res == 1) {
                if (reqType == "signUp") {   // alert(respData.Message); 
                }
                if (reqType == "anonymous") {
                    respData.reqType = "anonymous";
                }
                localStorage.setItem("detail", JSON.stringify(respData));
                location.reload(true);
            }
            else {
                alert(data.Message);
            }
        }
    });

}
function quickLogin() {
    var param = {};
    param.action = 1;
    param.name = $('#loginUserName').val();
    param.username = $('#loginUserName').val();
    param.email = $('#loginUserName').val();
    param.phoneNumber = $('#loginUserName').val();
    param.password = $('#loginPassword').val();
    $.ajax({
        type: "POST",
        url: "api/FormAPI/Login",
        data: JSON.stringify(param),
        contentType: "application/json",
        datatype: "json",
        success: function (data) {
            console.log(data);
            if (data.res == 1) {
                // alert(data.Message);
                localStorage.setItem("detail", JSON.stringify(data));
                location.reload(true);
            }
            else {
                alert(data.Message);
            }
        }
    });
}

function checkPass() {
    var check_password = $('#check_form_password').val();
    var id = $('#check_form_password').data('id');
    // var formIdString = $('#hdnfValidatedforms').val();
    var formId = $('#hdnfFomId').val();
    var editable = JSON.parse(localStorage.getItem('detail'));
    var formObj = editable.varifiedForms;
    if (check_password != "" && check_password == id) {

        if (formObj == null || formObj == '' || formObj == "undefined") {


            //arr.push({ formId: check_password});
            //editable.varifiedForms = arr;
            var arr = [];
            var arrParam = {};
            arrParam[formId] = check_password;
            arr.push(arrParam);
            editable.varifiedForms = arr;
            localStorage.setItem('detail', JSON.stringify(editable));

        }
        else {
            //formIdString += ',' + formId;
            var varifiedForms = formObj;
            var isFound = false;
            $.each(varifiedForms, function (key, value) {
                // var obj = value;
                console.log(value); console.log(key);
                var output1 = formId in value;
                // alert(output1);
                if (output1 == true && value[formId].toString() == check_password.toString()) {
                    alert('matched');
                    isFound = true;
                }
                else if (output1 == true && value[formId].toString() !== check_password.toString()) {
                    value[formId] = check_password.toString();// updating changed password from formSettings.
                    isFound = true;
                }
                else
                    isFound = false;


                console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjj');
                console.log(value);
                console.log(key);
            });

            if (!isFound) {
                var arrParam = {};
                arrParam[formId] = check_password;
                varifiedForms.push(arrParam);
            }
            // varifiedForms[formId] = check_password;
            editable.varifiedForms = varifiedForms;
            localStorage.setItem('detail', JSON.stringify(editable));
        }
        bootbox.hideAll();
        window.location.reload();

        //                    var id = window.location.href.split('/')[window.location.href.split('/').length - 1 ];
        //$.ajax({
        //    url: "<?php echo e(url('createFormSession')); ?>",
        //    data: { id: id },
        //    success: function (data) {
        //        window.location.reload();
        //    }
        //});

    } else {
        alert('Wrong Password!');
    }
}





