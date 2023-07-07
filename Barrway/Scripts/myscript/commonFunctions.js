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
                // //console.log(dateSplit);


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
                        // //console.log(timesplit);
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
        url: BASE_URL +"FormAPI/GetFormList",
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
        url: BASE_URL +"FormAPI/GetFormList",
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
        url: BASE_URL +"FormAPI/GetFormList",
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
        url: BASE_URL +"FormAPI/ManageGroups",
        data: "{'userId':" + userId + " ,'action':4}",
        contentType: "application/json",
        datatype: "json",
        success: addOptions


    });



    var actions = '<div class="panel-blue">' +
        '<div class="row">' +
        '<div class="col-sm-12">' +

        '<form class="needs-validation" name="groupForm" id="publishForm"  novalidate>' +
        ' <div class="col-sm-12 form-group mb-0">' +
        ' <input type="hidden" id="frmIdHidden" name="frmId" value=' + formid + ' />' +
        ' <input type="hidden" id="hdnfbuttonType" name="btnType" value=' + btnType + ' />' +
        ' <input type="hidden" id="hdnfGroupId" name="grpId" value="0" />' +
        ' <div class="col-sm-8">' +


        ' </div>' +
        ' </div>' +
        ' <div class="row form-group">' +

        ' <div class="col-sm-4"><label class="control-label">Select Group:</label></div>' +
        ' <div class="col-sm-8">' +


        '   <select class="form-control" id="ddlGroups" onchange="changeEvent(this.value)" required>' +






        '  </select>' +





        ' </div>' +
        '   </div>' +
        ' <div class="row form-group">' +

        ' <div class="col-sm-4"></div>' +
        ' <div class="col-sm-8"><a onclick="openAddGroupBoot()"  ><i class="fa fa-plus"></i> Add Group</a></div>' +

        ' </div>' +
        ' <div class="row form-group">' +

        ' <div class="col-sm-4"></div>' +
        ' <div class="col-sm-8">  <label> <input type="checkbox" id="chkAll" value="sdsd"/> Delete all records</label>  </div>' +

        ' </div>' +
        ' <div class="offset-sm-4 col-sm-8 navbar-btn btn-sm">' +

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
        ' <div class="form-group row">' +

        ' <div class="col-xl-4"><label class="control-label"> Group Name:</label></div>' +
        ' <div class="col-xl-8">' +


        '<input type="text" class="form-control" id="txtGroupName" />' +

        ' </div>' +
        '   </div>' +


        ' <div class="offset-xl-4 col-xl-8 navbar-btn btn-sm">' +

        '  <button type="button" onclick="createNewGroup()"' +

        '  class="btn btn-primary mr-0">' +
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
            url: BASE_URL +"FormAPI/ManageForm",
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
            url: BASE_URL +"FormAPI/ManageGroups",
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
                url: BASE_URL +"FormAPI/ManageForm",
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
                url: BASE_URL +"FormAPI/ManageForm",
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
    //window.location.href = "#/chat/" + groupId + "/group_chat";
    window.location.href = "#/chatroom/group_chat/" + groupId;
    setTimeout(function () {
        window.location.reload();
    }, 450);
}
function deleteGroup(groupId, reqType) {

    if (confirm('delete this group?')) {
        $.ajax({
            type: "POST",
            url: BASE_URL +"FormAPI/ManageGroups",
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
            url: BASE_URL +"FormAPI/ManageUserGroup",
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
                    url: BASE_URL +"FormAPI/profile",
                    data: "{'Id':" + JSON.parse(localStorage.detail).Id + " ,'action':10}",
                    contentType: "application/json",
                    datatype: "json",
                    success: function (data) {
                        //var response = data[0];

                        ////console.log(data);
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
    var scope = angular.element($("#onetomany")).scope();
    //console.log(scope.multiDcalendar, 'onetomany');
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
    ////console.log(current_tab);
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


        //console.log(eventBasicData);
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
            url: BASE_URL +"FormAPI/GeneratedFormData",
            dataType: 'json',
            contentType: "application/json",
            // data: "{'action':" + param.action + ",'formId':" + param.formId + ",'topicId':" + param.topicId + ",'created_by':" + param.created_by + ",'updated_by':" + param.update_by + ",'formGroupKey':" + param.formGroupKey + ",'formfieldDataListTemp':" + JSON.stringify(param.formfieldDataListTemp) + "}", //$.param(formData)
            data: "{'action':" + param.action + ",'userId':" + param.userId + ",'formId':" + param.formId + ",'topicId':" + param.topicId + ",'created_by':" + param.created_by + ",'updated_by':" + param.update_by + ",'formGroupKey':'" + param.formGroupKey + "','formfieldDataListTemp':'" + JSON.stringify(param.formfieldDataListTemp) + "','isResourceSelectable':" + param.isResourceSelectable + ", startDate:'" + start + "', endDate:'" + end + "', resourceId:" + param.resourceId + "}", //$.param(formData)

            beforeSend: function () {
                showLoader();
            },
            success: function (response) {
                if (response.res > 0) {
                    //console.log(response);
                    param.resourceFormId = resFormIdParam;
                    param.activityFormId = actFormIdParam;
                    param.resourceId = eventData.resourceId.toString();
                    param.activityId = eventData.id.toString();
                    manageOneToManyReferrenceForm(param);
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

                    //console.log('before insertion ');
                    //console.log(CalendarEventList);

                    //CalendarEventList = $.grep(CalendarEventList, function (e) {
                    //    return e.value != Id;
                    //});
                    CalendarEventList.push(newRow1);
                    window["CalendarEventList"] = CalendarEventList;
                    //console.log('after  insertion ');
                    // console.log(CalendarEventList);
                    //$('.calendar').fullCalendar('destroy');


                    console.log('hi1')

                    /// loadCalendar('BasicView', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn);
                    refreshEventResourcesActivity('BasicView', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn);
                    //$('#basic-view div.calendar').fullCalendar('refetchEvents');



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
                    if (response.res == -1) {   
                        var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
                        $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                        swal({ type: 'error', title: '', text: response.Message });

                    } else {
                        swal({ type: 'error', title: '', text: response.overlapMessage });
                    }
       
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
function changeResourceIDByYSelection(calenderData) {
    var result = angular.copy(calenderData);
    //console.log(result, 'result');
    var $scope = angular.element($("#calendar")).scope();
    if ($scope != undefined)
        _.each(result, function (item) {
            if (item) {
                if (item.customForms != undefined)
                    if ($scope.ySelection != undefined && $scope.ySelection != "") {
                        if (item.customForms.contains(",") == true) {
                            var tempformidList = item.customForms.split(",");
                            var tempformentryidList = item.customFormIds.split(",");
                            // var indx = _.indexOf(tempformidList, $scope.ySelection.toString());
                            var indx = _.findIndex(tempformidList, function (formIdString) { return formIdString.toString().trim() == $scope.ySelection.toString() });
                            var indxXSelection = _.findIndex(tempformidList, function (formIdString) { return formIdString.toString().trim() == $scope.xSelection.toString() });
                            if (indx != -1 && indxXSelection != -1) {
                                item.resourceId = tempformentryidList[indx].toString().trim();
                            } else {
                                if (indxXSelection != -1 && indx == -1) {
                                    item.resourceId = "0";
                                } else
                                    item.resourceId = (item.resourceId != undefined) ? item.resourceId.toString().trim() : item.resources;
                            }
                            item.customFormsSplit = tempformidList;
                            item.customFormIdsSplit = tempformentryidList;
                            if (item.allDay != undefined) {
                                item.allDay = item.allDay == "true" ? true : false;
                                if (item.allDay) {
                                    item.start = moment(item.start).format("YYYY-MM-DD");
                                    item.end = moment(item.end).format("YYYY-MM-DD");
                                }
                            }
                        }
                        else if (item.customForms != "") {
                            var tempformidList = item.customForms.split(",");
                            var tempformentryidList = item.customFormIds.split(",");
                            // var indx = _.indexOf(tempformidList, $scope.ySelection.toString());
                            var indx = _.findIndex(tempformidList, function (formIdString) { return formIdString.toString().trim() == $scope.ySelection.toString() });
                            var indxXSelection = _.findIndex(tempformidList, function (formIdString) { return formIdString.toString().trim() == $scope.xSelection.toString() });
                            if (indx != -1 && indxXSelection != -1) {
                                item.resourceId = tempformentryidList[indx].toString().trim();
                            } else {
                                if (indxXSelection != -1 && indx == -1) {
                                    item.resourceId = "0";
                                } else
                                    item.resourceId = (item.resourceId != undefined) ? item.resourceId.toString().trim() : item.resources;
                            }
                            item.customFormsSplit = tempformidList;
                            item.customFormIdsSplit = tempformentryidList;
                            if (item.allDay != undefined) {
                                item.allDay = item.allDay == "true" ? true : false;
                                if (item.allDay) {
                                    item.start = moment(item.start).format("YYYY-MM-DD");
                                    item.end = moment(item.end).format("YYYY-MM-DD");
                                }
                            }
                        }
                    }
                
            }
        });
    return result;
}
function changeResourceIDByXSelection(calenderData) {
    var result = angular.copy(calenderData);
    var $scope = angular.element($("#calendar")).scope();
    if ($scope != undefined)
        _.each(result, function (item) {
            if (item) {
                if (item.customForms != undefined)
                    if ($scope.xSelection != undefined && $scope.xSelection != "") {
                        if (item.customForms.contains(",") == true) {
                            var tempformidList = item.customForms.split(",");
                            var tempformentryidList = item.customFormIds.split(",");
                            var indx = _.findIndex(tempformidList, function (formIdString) { return formIdString.toString().trim() == $scope.xSelection.toString() });
                            if (indx != -1) {
                                item.resourceId = tempformentryidList[indx].toString().trim();
                            } else {
                                item.resourceId = (item.resourceId != undefined) ? item.resourceId.toString().trim() : item.resources;
                            }
                            item.customFormsSplit = tempformidList;
                            item.customFormIdsSplit = tempformentryidList;
                            if (item.allDay != undefined) {
                                item.allDay = item.allDay == "true" ? true : false;
                                if (item.allDay) {
                                    item.start = moment(item.start).format("YYYY-MM-DD");
                                    item.end = moment(item.end).format("YYYY-MM-DD");
                                }
                            }                        
                    } else if (item.customForms != "") {
                            var tempformidList = item.customForms.split(",");
                            var tempformentryidList = item.customFormIds.split(",");
                            var indx = _.findIndex(tempformidList, function (formIdString) { return formIdString.toString().trim() == $scope.xSelection.toString() });
                            if (indx != -1) {
                                item.resourceId = tempformentryidList[indx].toString().trim();
                            } else {
                                item.resourceId = (item.resourceId != undefined) ? item.resourceId.toString().trim() : item.resources;
                            }
                            item.customFormsSplit = tempformidList;
                            item.customFormIdsSplit = tempformentryidList;
                            if (item.allDay != undefined) {
                                item.allDay = item.allDay == "true" ? true : false;
                                if (item.allDay) {
                                    item.start = moment(item.start).format("YYYY-MM-DD");
                                    item.end = moment(item.end).format("YYYY-MM-DD");
                                }
                            }
                        }
                    }
                //if (item.seperatedResFormIDs != undefined)
                //    if ($scope.ySelection != undefined && $scope.ySelection != "") {
                //        if (item.seperatedResFormIDs.contains(",") == true) {
                //            var tempformidList = item.seperatedResFormIDs.split(",");
                //            var tempformentryidList = item.seperatedResEntryIDs.split(",");
                //            var indx = _.indexOf(tempformidList, $scope.ySelection.toString());
                //            if (indx != -1) {
                //                item.resourceId = tempformentryidList[indx];
                //            }
                //        }
                //    }
            }
        });
    return result;
}

function manageOneToManyReferrenceForm(param) {
    param.action = 10;
    $.ajax({
        method: 'POST',
        url: BASE_URL +"FormAPI/ManageCalenderReferrenceNew",
        dataType: 'jsonp',
        contentType: "application/json",
        //data:param,
        data: "{'action':" + param.action + ",'userId':" + param.userId + ",'formId':" + param.formId +
            ",'created_by':" + param.created_by +
            ",'updated_by':" + param.update_by +
            ",'formGroupKey':'" + param.formGroupKey +
            "','resourceFormId':" + param.resourceFormId +
            ",'activityFormId':" + param.activityFormId +
            ",'resourceId':" + param.resourceId +
            ",'activityId':" + param.activityId +
            "}", //$.param(formData)
        success: function (response) {
            if (response.res > 0) {


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

function deleteDimension(refId, refForm, formGroupKey, event) {
    var param = {};
    param.formGroupKey = formGroupKey.toString();
    param.referrenceFormId = parseInt(refForm.toString().trim());
    param.referrenceId = refId.toString();
    $(event.parentElement.parentElement).find('.titleContainer').text('')
    var $scope = angular.element($("#calendar")).scope();
    var exists = _.findWhere($scope.eventData.currentEventCalenderReferrenceList, { referrenceFormId: param.referrenceFormId });
    if (exists != undefined) {
        param.Id = exists.Id;
    }
    //setTimeout(function () {
    //    $("#" + param.Id + "_" + param.referrenceFormId + "_" + param.referrenceId).remove();
    //    $('div.calendar').fullCalendar('refetchEvents');
    //}, 500);
    $scope.deleteDimensionCalenderEvent(param);
}

function changeDimension(formId,formgroupkey,eventId, event) {
    //alert(formId)
    console.log(event)
    var param = {};
    param.formGroupKey= formgroupkey;
    param.referrenceFormId = formId;
    param.referrenceId = event.value;
    param.Id = eventId;
    $(event.parentElement.parentElement).find('.title1').text(event.selectedOptions[0].innerText);
    var $scope = angular.element($("#calendar")).scope();
    param.innerText = event.selectedOptions[0].innerText;
    $scope.updateDimensionCalenderEvent(param);
}


function compareEventStartEndDateTime(eventData, item) {

    return ((moment(new Date(eventData.start), "DD/MM/YYYY HH:mm").format("DD/MM/YYYY HH:mm") ==
        moment(new Date(item.start), "DD/MM/YYYY HH:mm").format("DD/MM/YYYY HH:mm"))
        && (moment(new Date(eventData.end), "DD/MM/YYYY HH:mm").format("DD/MM/YYYY HH:mm") ==
            moment(new Date(item.end), "DD/MM/YYYY HH:mm").format("DD/MM/YYYY HH:mm")) && (eventData.title == item.customTitle.split(',')[1].trim())) ? true : false;


    //return (moment(new Date(eventData.start), "DD/MM/YYYY HH:mm").diff(moment(new Date(item.start), "DD/MM/YYYY HH:mm"))
    //    == 0 && moment(new Date(eventData.end), "DD/MM/YYYY HH:mm").diff(moment(new Date(item.end), "DD/MM/YYYY HH:mm"))
    //    == 0) ? true : false;       
}

function compareEventStartEndDateTime_noOverlap(eventData, item) {

    return (((moment(new Date(eventData.start), "DD/MM/YYYY HH:mm").format("DD/MM/YYYY HH:mm") ==
        moment(new Date(item.start), "DD/MM/YYYY HH:mm").format("DD/MM/YYYY HH:mm")

        &&
        moment(new Date(eventData.end), "DD/MM/YYYY HH:mm").format("DD/MM/YYYY HH:mm") ==
        moment(new Date(item.end), "DD/MM/YYYY HH:mm").format("DD/MM/YYYY HH:mm"))
        ||
        (moment(new Date(eventData.start), "DD/MM/YYYY HH").format("DD/MM/YYYY HH") ==
            moment(new Date(item.start), "DD/MM/YYYY HH").format("DD/MM/YYYY HH")
            ||
            moment(new Date(eventData.end), "DD/MM/YYYY HH").format("DD/MM/YYYY HH") ==
            moment(new Date(item.end), "DD/MM/YYYY HH").format("DD/MM/YYYY HH")
        ))


        && ((eventData.title == item.customTitle.split(',')[1].trim())
            || eventData.resourceId === item.resourceId)) ? true : false;


    //return (moment(new Date(eventData.start), "DD/MM/YYYY HH:mm").diff(moment(new Date(item.start), "DD/MM/YYYY HH:mm"))
    //    == 0 && moment(new Date(eventData.end), "DD/MM/YYYY HH:mm").diff(moment(new Date(item.end), "DD/MM/YYYY HH:mm"))
    //    == 0) ? true : false;       
}
function compareEventStartEndDateTimeHalfTime(eventData, item) {

}
var countLoader = 0;
var listCalenderView, agendaCalenderView, timelineCalenderView, timelineResourceCalenderView;


function rebindCalenderWithEvents(calenderType) {
    var calenderData = window["CalendarEventList"];
    var eventBasicData = window["EventBasicDetail"];
    refreshEventResourcesActivityNew(calenderType, calenderData, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, []);
};

function refreshEventResourcesActivityNew(calenderType, calenderData, resourceData, resColumns, activityFormData, activityColumn, activityEvents) {
    countLoader = 0;
    if (calenderType != "updateResource") {
        if (calenderData != undefined)
            calenderData = changeResourceIDByYSelection((calenderData.data != undefined) ? calenderData.data : calenderData);
        else
            calenderData = [];
    }

    window["eventListTemp"] = calenderData;
    var $scopeVar = angular.element($("#calendar")).scope();
    renderEventHtml(calenderType, calenderData, resourceData, resColumns, activityFormData, activityColumn, activityEvents, {}, [], []);
   // $('.calendar').fullCalendar('destroy');

    //loadCalendar(calenderType, calenderData, resourceData, resColumns, activityFormData, activityColumn, activityEvents);
        
   // $('#basic-view div.calendar').fullCalendar('removeEvents');
    //$('#basic-view div.calendar').fullCalendar('addEventSource', calenderData,  true);


    //$('#list-view div.calendar').fullCalendar('removeEvents');
    //listCalenderView.addEventSource(calenderData);
    //listCalenderView.render();
  //  $('#list-view div.calendar').fullCalendar('removeEvents');
 // $('#list-view div.calendar').fullCalendar('addEventSource', calenderData);
    // $('#list-view div.calendar').fullCalendar('refetchEvents');
    //$('div.calendar').fullCalendar('refetchEvents');
    //$('#agenda-view div.calendar').fullCalendar('removeEvents');
    //$('#agenda-view div.calendar').fullCalendar('addEventSource', calenderData);

    //$('#timeline-resource-view div.calendar').fullCalendar('removeEvents');
    //$('#timeline-resource-view div.calendar').fullCalendar('addEventSource', calenderData);

    //if ($scopeVar != undefined)
    //    if ($scopeVar.isFilterApply) {
    //        var uniqEvents = _.uniq(calenderData, "resourceId");
    //        var tempFormData = [];
    //        _.each(resourceData, function (item) {
    //            var exists = _.findWhere(uniqEvents, { resourceId: item.id });
    //            if (exists != undefined) {
    //                tempFormData.push(item);
    //            }
    //        });
    //        resourceData = tempFormData;
    //    }
    //$('#vertical-resource-view div.calendar').fullCalendar('removeEvents');
    //$('#vertical-resource-view div.calendar').fullCalendar('addEventSource', calenderData);
    //$('#vertical-resource-view div.calendar').fullCalendar('removeResource', resourceData);

    // Vertical Activities View
    //activityEvents = changeResourceIDByXSelection(activityEvents)
    //if ($scopeVar != undefined) 
    //if ($scopeVar.isFilterApply) {
    //    var uniqEvents = _.uniq(activityEvents, "resourceId");
    //    var tempFormData = [];
    //    _.each(activityFormData, function (item) {
    //        var exists = _.findWhere(uniqEvents, { resourceId: item.id });
    //        if (exists != undefined) {
    //            tempFormData.push(item);
    //        }
    //    });
    //    activityFormData = tempFormData;
    //}
    //$('#vertical-activities-view div.calendar').fullCalendar('removeEvents');
    //$('#vertical-activities-view div.calendar').fullCalendar('addEventSource', activityFormData);
  
}


function changeStateOfCalender(view,start,end) {
    var temp = {};
    temp.field = "start";
    var currentdate = moment(start._d, "YYYY-MM-DD").format("YYYY-MM-DD");
    var currentend = moment(moment(end._d).subtract(1, "days"), "YYYY-MM-DD").format("YYYY-MM-DD");
    //if (view.intervalStart != undefined)
    //    currentdate = view.intervalStart.format("YYYY-MM-DD");
    if (view.type != undefined) {
        if (view.type.toLowerCase().contains("month")) {
            if (view.intervalStart != undefined) {
                currentdate = moment(start._d, "YYYY-MM-DD").format("YYYY-MM-DD");
            }
            else
                currentdate = moment(new Date()).format("YYYY-MM-DD");
            temp.value = " datepart(mm,[start]) =month('" + currentdate + "')   and datepart(yyyy, [start]) = year('" + currentdate + "') ";
        }
        else if (view.type.toLowerCase().contains("year")) {
            temp.value = " datepart(yyyy, [start]) = year('" + currentdate + "') ";
        }
        else if (view.type.toLowerCase().contains("week") || view.type.toLowerCase().contains("twodays") || view.type.toLowerCase().contains("threedays")) {
            temp.value = " CAST([start] as date) between CAST('" + currentdate + "' as date) and CAST('" + currentend + "' as date)  ";
        }
        else if (view.type.toLowerCase().contains("day")) {
           // currentdate = moment(moment(start._d).subtract(1, "days"), "YYYY-MM-DD").format("YYYY-MM-DD");

            temp.value = " CAST([start] as date) =CAST('" + currentdate + "' as date) ";
        }
    }
    return temp;
}


function renderEventHtml(calenderType, calenderData, resourceData, resColumns, activityFormData, activityColumn, activityEvents, defaultOptions, resourceOrder, activitiesCategory )     {
    var result = "";
    var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');

    if (current_tab == "list-view") {
        //$('#agenda-view div.calendar').fullCalendar('removeEvents');
        //$('#agenda-view div.calendar').fullCalendar('addEventSource', calenderData);

        $('#timeline-resource-view div.calendar').fullCalendar('removeEvents');
        $('#timeline-resource-view div.calendar').fullCalendar('addEventSource', calenderData);

        $('#vertical-resource-view div.calendar').fullCalendar('removeEvents');
        $('#vertical-resource-view div.calendar').fullCalendar('addEventSource', calenderData);
    }
    else if (current_tab == "agenda-view") {
        $('#list-view div.calendar').fullCalendar('removeEvents');
        $('#list-view div.calendar').fullCalendar('addEventSource', calenderData);

        $('#timeline-resource-view div.calendar').fullCalendar('removeEvents');
        $('#timeline-resource-view div.calendar').fullCalendar('addEventSource', calenderData);

        $('#vertical-resource-view div.calendar').fullCalendar('removeEvents');
        $('#vertical-resource-view div.calendar').fullCalendar('addEventSource', calenderData);
    }
    else if (current_tab == "timeline-resource-view") {
        $('#list-view div.calendar').fullCalendar('removeEvents');
        $('#list-view div.calendar').fullCalendar('addEventSource', calenderData);

        $('#agenda-view div.calendar').fullCalendar('removeEvents');
        $('#agenda-view div.calendar').fullCalendar('refetchEvents');

        // $('#agenda-view div.calendar').fullCalendar('addEventSource', calenderData);

        $('#vertical-resource-view div.calendar').fullCalendar('removeEvents');
        $('#vertical-resource-view div.calendar').fullCalendar('addEventSource', calenderData);
        if (calenderType == "updateResource") {
            $('#timeline-resource-view div.calendar').fullCalendar('removeEvents');
            $('#timeline-resource-view div.calendar').fullCalendar('addEventSource', calenderData);

            //$('#vertical-resource-view div.calendar').fullCalendar('removeResource');
            //$('#vertical-resource-view div.calendar').fullCalendar('addResource', resourceData);
        }
    }
    else if (current_tab == "vertical-resource-view") {
        $('#list-view div.calendar').fullCalendar('removeEvents');
        $('#list-view div.calendar').fullCalendar('addEventSource', calenderData);

        $('#timeline-resource-view div.calendar').fullCalendar('removeEvents');
        $('#timeline-resource-view div.calendar').fullCalendar('addEventSource', calenderData);

        //$('#agenda-view div.calendar').fullCalendar('removeEvents');
        //$('#agenda-view div.calendar').fullCalendar('addEventSource', calenderData);
        if (calenderType == "updateResource") {
            //$('#timeline-resource-view div.calendar').fullCalendar('removeResource');
            //$('#timeline-resource-view div.calendar').fullCalendar('addResource', resourceData);

            $('#vertical-resource-view div.calendar').fullCalendar('removeEvents');
            $('#vertical-resource-view div.calendar').fullCalendar('addEventSource', calenderData);
        }
    }

    if (calenderType == "deleteEvent") {
        $('#' + current_tab + ' div.calendar').fullCalendar('removeEvents');
        $('#' + current_tab + ' div.calendar').fullCalendar('addEventSource', calenderData);
    }
    
    return result;
}

function removeTitleNew() {
    $("#eventCopy").unbind("click");
    $(".editTitle").unbind("click");
    $(".closeSelect").unbind("click");
    $('body .popover-header').remove();
    if ($(".event-detail .temp span").hasClass("titleContainer")) {

        $('.editTitle').on('click', function () {
            $(this).closest('.temp').find('.popoverSelect').removeClass('d-none');
            $(this).closest('.titleContainer').addClass('d-none');
        });
        $('#eventCopy').on('click', function () {
            var $scope = angular.element($("#calendar")).scope();            
            var param = {};    
            if ($scope.listTabulator.length > 0) {
                var temp = $scope.listTabulator[0];
                param.formId = temp.reference_form;
                param.isInternalDrop = true;
            } else {
                param.formId = $scope.formDetailsDataInfo.otherformid;
                param.isInternalDrop = false;
            }
            param.formGroupKey = $scope.selectEventDetails.formGroupKey;
            param.parentID = $scope.currentFormId;   
            param.Id = $scope.selectEventDetails.Id;
            param.action = 10;       
            param.newFormGroupKey = "";
            $scope.copyCalenderEventFunction(param);
        });
        $('.closeSelect').on('click', function () {
            $(this).closest('.temp').find('.titleContainer').removeClass('d-none');
            $(this).closest('.popoverSelect').addClass('d-none');

            $("body .popover").addClass('isPopoverLoaded');
            $("body .popover").popover('hide');
            $("#tabuListUl").empty();
            var $scope = angular.element($("#calendar")).scope();
            $('.temp').find('.titleContainer').removeClass('d-none');
            $('.popoverSelect').addClass('d-none');

        });
    }
   
}

function loadCalendarWithEventFunction(calenderType, calenderData, resourceData, resColumns, activityFormData, activityColumn, activityEvents) {
    try {
        if (calenderData.length > 0)
            showLoader();
        else
            $.unblockUI();
    }
    catch (e) {
        $.unblockUI();
    }
    calenderData = changeResourceIDByYSelection((calenderData.data != undefined) ? calenderData.data : calenderData);
    window["eventListTemp"] = calenderData;
    var $scopeVar = angular.element($("#calendar")).scope();

  

    var basicDetails = window["EventBasicDetail"];

    var GroupingData = window["colGrouping"];
    var $scopeVar = angular.element($("#calendar")).scope();
    var formID = basicDetails.formData.formId;
    var resourceColumn = '';
    var activitiesForm = basicDetails.formData.activitiesForm;
    var majorGroup = "";
    var minorGroup = "";
    var dialog = "";
    if (typeof GroupingData !== "undefined") {
        majorGroup = GroupingData[0].majorGroup;
        if (majorGroup != undefined) {
            majorGroup = majorGroup.replace('[', '').trim();
            majorGroup = majorGroup.replace(']', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
        }
        minorGroup = GroupingData[0].minorGroup;
        resourceColumn = GroupingData[0].minorGroup;
        window["currResColumn"] = resourceColumn;
        window["currMajorColumn"] = GroupingData[0].activitiesCategory;
    }
    else {
        majorGroup = basicDetails.formData.majorGroup;
        if (majorGroup != undefined) {
            majorGroup = majorGroup.replace('[', '').trim();
            majorGroup = majorGroup.replace(']', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
        }
        minorGroup = basicDetails.formData.minorGroup;
        resourceColumn = basicDetails.formData.minorGroup;
        window["currResColumn"] = resourceColumn;
    }
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
    var userid = 0;
    if (localStorage.detail != undefined && localStorage.detail != "")
        userid = JSON.parse(localStorage.detail).Id;
    var activitiesCategory = basicDetails.formData.activitiesCategory;
    if (activitiesCategory == '' || activitiesCategory == null)
        activitiesCategory = '0';
    var overlapField = basicDetails.formData.overlapField; // value of activity radioButton field   (for overlap)
    var calendarOptions = '';
    var resourceOrder = majorGroup + ',' + minorGroup;
    // managing resource ordering  data .
    var _ColumnResults = [];
    var _orderedArr = resourceOrder.split(',');
    $.each(_orderedArr, function (index, value1) {
        $.each(resColumns, function (index, value2) {
            if (value2.field == value1)
                _ColumnResults.push(value2);
        });
    });
    resColumns = _ColumnResults;
    var tagify = "";
   
    var customEventDetailsModelPopUp = angular.element("#customEventDetailsModelPopUp");
    var createCustomEventDetailsModelPopUp = angular.element("#createCustomEventDetailsModelPopUp");

    function assignEvents(eventsData) {
        window["CalendarEventList"] = angular.copy(eventsData);
    }

    var dragresourceId;
    var defaultOptions = {
        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
        theme: true,
        themeSystem: 'jquery-ui',
        //  themeSystem:'bootstrap4',
        nowIndicator: true,
        slotDuration: '00:15:00',
        // defaultTimedEventDuration: defaultDuration,
        //aspectRatio: 1.5,
        defaultDate: new Date(),
        eventMouseover: function (event, jsEvent, view) {
            if (view.name !== 'agendaDay') {
                ////console.log(event);
                $(jsEvent.target).attr('title', event.title);
            }
        },
        //lazyFetching: true,
        now: new Date(),
        navLinks: true, // can click day/week names to navigate views
        editable: true,
        eventLimit: 4, // allow "more" link when too many events            
        loading: function (bool) {
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs( "option", "active" ) + ')').attr('id');
            if (bool) {
                showLoader(".calendar .fc-view-container");
            }
            else {
                $(".calendar .fc-view-container").unblock();
            }
            //$('#loading').toggle(bool);
        },
        eventDrop: function (event, delta, revertFunc, jsEvent, ui, view) {

            var ele = document.elementFromPoint(jsEvent.pageX, jsEvent.pageY);
            //var resourceId = $(ele).closest('tr').attr('data-resource-id');
            //event.resourceId = resourceId;
            ////  revertFunc();
            //var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            //if (current_tab === "vertical-resource-view") {


            //    for (var i = jsEvent.pageY; i > 0;i=i-10) {
            //        var ele = document.elementFromPoint(jsEvent.pageX, i);
            //        if ($(ele).closest('th.fc-resource-cell').length > 0) {
            //            event.resourceId=$(ele).closest('th.fc-resource-cell').attr('data-resource-id')
            //            i = 0;
            //        }
            //    }
            //    //revertFunc();
            //    //return;
            //}


            //console.log('event is');
            //console.log(event);
            var isInternalDropParam = true;
            window["scrollOffset"] = $(window).scrollTop();
            var eventBasicData = window["EventBasicDetail"];
            var eventExtData = $(this).data('event');
            var resourceValue = '', title = '';
            var Id = 0;
            if (typeof event.Id === "undefined")
                Id = event.value;
            else
                Id = event.Id;
            title = event.title;
            var actFormId = event.formId;
            var resFormId = window["ySelected"];
            var activityFormId = window["xSelected"];
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
            var allDay = event.allDay;
            var formfieldDataListTempData = [];
            //console.log(eventExtData);

            var $scope = angular.element($("#calendar")).scope();

            ////console.log(event);
            //alert(event.title + " end is now " + event.end.format());
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            if (!confirm("Are you sure about this change?")) {
                revertFunc();
            } else {
                if (event.resourceId) {
                    event.resources = event.resourceId;
                    var resource = $("#" + current_tab + " .calendar").fullCalendar('getResourceById', event.resourceId);
                    var activity = $("#vertical-activities-view" + " .calendar").fullCalendar('getResourceById', event.activities);
                    var titleModifiedPart = ""; var majorGroupSplits = [];
                    if (resource && typeof resource[resourceColumn] != 'undefined') {
                        resourceValue = resource[resourceColumn];
                        titleModifiedPart = resourceValue;
                        if (typeof majorGroup !== undefined)
                            majorGroupSplits = majorGroup.split(',');
                        if (majorGroupSplits.length > 0) {
                            _.each(majorGroupSplits, function (value, pos) {
                                if (value != "") {
                                    if (titleModifiedPart !== "")
                                        titleModifiedPart += "-" + resource[value].toString();
                                    else
                                        titleModifiedPart = resource[value].toString();
                                }
                            });
                        }
                        var _currResFormId = window["ySelected"];
                        var _seperatedTitles = event.customTitle;
                        var _seperatedFormIDs = event.customForms;

                        if (_seperatedFormIDs && _seperatedFormIDs.split(',').length > 0 && _seperatedFormIDs.split(',').findIndex(x => x == _currResFormId)!=-1) {

                            var tempSepFIds = _seperatedFormIDs.split(',');
                            var index = tempSepFIds.findIndex(x => x == _currResFormId);
                            _seperatedIds = event.customFormIds;
                            if (event.resourceId && event.customFormIds) {
                                var tempIds = event.customFormIds.split(',');
                                if (tempIds.length > index) {
                                    tempIds[index] = event.resourceId;
                                    event.customFormIds = tempIds.join(',');
                                }
                            }
                        }

                        var _seperatedIds = event.customFormIds;

                        //var _seperatedResFormIDs = event.seperatedResFormIDs;
                        //var _seperatedResEntryIDs = event.seperatedResEntryIDs;
                        //var _seperatedResColValues = event.seperatedResColValues;


                        if (typeof _seperatedTitles !== undefined)
                            _seperatedTitles = _seperatedTitles.split(',');
                        if (typeof _seperatedFormIDs !== undefined)
                            _seperatedFormIDs = _seperatedFormIDs.split(',');
                        if (typeof _seperatedIds !== undefined)
                            _seperatedIds = _seperatedIds.split(',');
                        //if (typeof _seperatedResFormIDs !== undefined)
                        //    _seperatedResFormIDs = _seperatedResFormIDs.split(',');
                        //if (typeof _seperatedResEntryIDs !== undefined)
                        //    _seperatedResEntryIDs = _seperatedResEntryIDs.split(',');
                        //if (typeof _seperatedResColValues !== undefined)
                        //    _seperatedResColValues = _seperatedResColValues.split(',');




                        _.each(_seperatedFormIDs, function (value, key) {
                            if (value.trim() === _currResFormId.toString().trim()) {
                                _seperatedTitles[key] = titleModifiedPart;
                                _seperatedIds[key] = event.resourceId;
                            }
                        });
                        //_.each(_seperatedResFormIDs, function (value, key) {
                        //    if (value === _currResFormId.toString()) {
                        //        _seperatedResEntryIDs[key] = event.resourceId;
                        //        _seperatedResColValues[key] = resourceValue;
                        //    }
                        //});

                        var _newseperatedTitles = ""; var _newseperatedIds = ""; var _newseperatedResEntryIDs = ""; var _newseperatedResColValues = "";
                        _.each(_seperatedFormIDs, function (value, key) {
                            if (_newseperatedTitles === "")
                                _newseperatedTitles = _seperatedTitles[key].toString();
                            else
                                _newseperatedTitles += " , " + _seperatedTitles[key].toString();


                            if (_newseperatedIds === "")
                                _newseperatedIds = _seperatedIds[key].toString();
                            else
                                _newseperatedIds += " , " + _seperatedIds[key].toString();

                            //if (_newseperatedResEntryIDs === "")
                            //    _newseperatedResEntryIDs = _seperatedResEntryIDs[key].toString();
                            //else
                            //    _newseperatedResEntryIDs += " , " + _seperatedResEntryIDs[key].toString();


                            //if (_newseperatedResColValues === "")
                            //    _newseperatedResColValues = _seperatedResColValues[key].toString();
                            //else
                            //    _newseperatedResColValues += " , " + _seperatedResColValues[key].toString();

                        });




                        var activityValue = activity[activityField];
                        //if (event.activities != 'undefined')
                        //   // title = event.activities + ' in ' + resourceValue;
                        //else
                        //   // title = ' in ' + resourceValue;
                    }
                }
                var indx = _.findIndex(event.customFormsSplit, function (formIdString) { return formIdString.toString().trim() == $scope.xSelection.toString() });
                if (indx != -1) {
                    activities = event.customFormIdsSplit[indx].toString().trim();
                }
                formfieldDataListTempData = [
                    { "name": "Id", "value": parseInt(Id) },
                    { "name": "title", "value": title },
                    { "name": "start", "value": start },
                    { "name": "end", "value": end },
                    { "name": "allDay", "value": allDay },
                    { "name": "activities", "value": activities },
                    { "name": "resources", "value": resourceId },
                ];
                $.ajax({
                    method: 'POST',
                    url: BASE_URL + "FormAPI/EditEventData",
                    dataType: 'json',
                    contentType: "application/json",
                    data: "{'action':2,'resourceFormId':" + resFormId + ",'ActivityFormId':" + activityFormId + ",'userid':" + eventBasicData.userId + ",'Id':" + parseInt(Id) + ", 'formId':" + eventBasicData.formId + ",'topicId':" + eventBasicData.formData.topicId + ",'created_by':" + eventBasicData.created_by + ",'updated_by':" + eventBasicData.update_by + ",'formfieldDataListTemp':'" + JSON.stringify(formfieldDataListTempData) + "' ,'isInternalDrop':" + isInternalDropParam + ",startDate:'" + start + "','endDate':'" + end + "','eventOverlap': '','activitiesOverlap':" + activitiesOverlap + "}", //$.param(formData)
                    success: function (response) {
                        if (response.res > 0) {
                            //else if (response.res > 0 && param.action == 2) {
                            try {
                                var CalendarEventList = window["CalendarEventList"];
                                //var ActivityEventList = window["ActivityEventList"];
                                //var oneToManyList = eventBasicData.eventData;

                                var CalenderEditableRow = $.grep(CalendarEventList, function (e) {
                                    return e.Id == event.Id;
                                });
                                //var ActivityEditableRow = $.grep(ActivityEventList, function (e) {
                                //    return e.Id == event.Id;
                                //});
                                //var oneToManyListEditableRow = $.grep(oneToManyList, function (e) {
                                //    return e.Id == event.Id;
                                //});

                                CalenderEditableRow[0].start = start;
                                CalenderEditableRow[0].end = end;
                                CalenderEditableRow[0].seperatedTitles = _newseperatedTitles;
                                CalenderEditableRow[0].seperatedIds = _newseperatedIds;
                                CalenderEditableRow[0].seperatedResColValues = _newseperatedResColValues;
                                CalenderEditableRow[0].seperatedResEntryIDs = _newseperatedResEntryIDs;
                                CalenderEditableRow[0].customFormIds = event.customFormIds;
                                CalenderEditableRow[0].resources = event.resources;
                                CalenderEditableRow[0].resourceId = event.resourceId;



                                //ActivityEditableRow[0].start = start;
                                //ActivityEditableRow[0].end = end;
                                //ActivityEditableRow[0].seperatedTitles = _newseperatedTitles;
                                //ActivityEditableRow[0].seperatedIds = _newseperatedIds;
                                //ActivityEditableRow[0].seperatedResColValues = _newseperatedResColValues;
                                //ActivityEditableRow[0].seperatedResEntryIDs = _newseperatedResEntryIDs;

                                //oneToManyListEditableRow[0].start = start;
                                //oneToManyListEditableRow[0].end = end;
                                //oneToManyListEditableRow[0].seperatedTitles = _newseperatedTitles;
                                //oneToManyListEditableRow[0].seperatedIds = _newseperatedIds;
                                //oneToManyListEditableRow[0].seperatedResColValues = _newseperatedResColValues;
                                //oneToManyListEditableRow[0].seperatedResEntryIDs = _newseperatedResEntryIDs;
                                //var  filteredItems = CalendarEventList.filter((item) => item.Id !== response.Id);

                                //console.log('ffffff');
                                //console.log(CalenderEditableRow);

                                //var filteredEventsCalender = $.grep(CalendarEventList, function (e) {
                                //    return e.Id != event.Id;
                                //});
                                var filteredEventsCalender = CalendarEventList;
                                if (filteredEventsCalender.findIndex(x=> x.Id == event.Id) != -1) {
                                    var index = filteredEventsCalender.findIndex(x=> x.Id == event.Id);
                                    filteredEventsCalender[index] = CalenderEditableRow[0];
                                } else {
                                    filteredEventsCalender.push(CalenderEditableRow[0]);
                                }

                                //var filteredEventsActivity = $.grep(ActivityEventList, function (e) {
                                //    return e.Id != event.Id;
                                //});
                                //var filteredoneToManyList = $.grep(oneToManyList, function (e) {
                                //    return e.Id != event.Id;
                                //});
                                //filteredEventsCalender.push(CalenderEditableRow[0]);
                                //filteredEventsActivity.push(ActivityEditableRow[0]);
                                //filteredoneToManyList.push(oneToManyListEditableRow[0]);
                                //eventBasicData.eventData = filteredoneToManyList;



                                //_.each(filteredEventsCalender, function (dataRow, position) {

                                //    var rowRecord = dataRow;
                                //    var seperatedFormIDsParam = dataRow.seperatedFormIDs;

                                //    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;


                                //    var seperatedTitleParam = dataRow.seperatedTitles;
                                //    var commaIDs = seperatedIdsParam.split(',');
                                //    var commaVals = seperatedFormIDsParam.split(',');
                                //    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                //    var ySelected = window["ySelected"];
                                //    _.each(commaVals, function (idVal, pos) {
                                //        //console.log(commaVals + "," + commaIDs[pos].toString())
                                //        if (idVal == ySelected.toString()) {
                                //            dataRow.resFormID = idVal;
                                //            dataRow.resources = commaIDs[pos];
                                //            dataRow.resourceId = commaIDs[pos];
                                //            dataRow.title = "";
                                //        }

                                //    })



                                //});

                                //_.each(filteredEventsActivity, function (dataRow, position) {

                                //    var rowRecord = dataRow;
                                //    var seperatedFormIDsParam = dataRow.seperatedFormIDs;
                                //    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;
                                //    var seperatedTitleParam = dataRow.seperatedTitles;
                                //    var commaIDs = seperatedIdsParam.split(',');
                                //    var commaVals = seperatedFormIDsParam.split(',');
                                //    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                //    var ySelected = window["ySelected"];
                                //    _.each(commaVals, function (idVal, pos) {
                                //        //console.log(commaVals + "," + commaIDs[pos].toString())
                                //        if (idVal == ySelected.toString()) {
                                //            dataRow.resFormID = idVal;
                                //            dataRow.resources = commaIDs[pos];
                                //            dataRow.resourceId = commaIDs[pos];
                                //            dataRow.title = "";
                                //        }

                                //    })



                                //});

                                //_.each(filteredoneToManyList, function (dataRow, position) {

                                //    var rowRecord = dataRow;
                                //    var seperatedFormIDsParam = dataRow.seperatedFormIDs;

                                //    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;


                                //    var seperatedTitleParam = dataRow.seperatedTitles;
                                //    var commaIDs = seperatedIdsParam.split(',');
                                //    var commaVals = seperatedFormIDsParam.split(',');
                                //    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                //    var ySelected = window["ySelected"];
                                //    _.each(commaVals, function (idVal, pos) {
                                //        //console.log(commaVals + "," + commaIDs[pos].toString())
                                //        if (idVal == ySelected.toString()) {
                                //            dataRow.resFormID = idVal;
                                //            dataRow.resources = commaIDs[pos];
                                //            dataRow.resourceId = commaIDs[pos];
                                //            dataRow.title = "";
                                //        }

                                //    })



                                //});


                                window["CalendarEventList"] = filteredEventsCalender;
                                //window["ActivityEventList"] = filteredEventsActivity;
                                console.log('hi3')
                                //$('.calendar').fullCalendar('destroy');
                                //loadCalendar('BasicView', filteredEventsCalender, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, filteredEventsActivity);
                                refreshEventResourcesActivityNew('updateResource', filteredEventsCalender, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, []);
                                //$('#timeline-resource-view div.calendar').fullCalendar('refetchEvents');


                                //eventBasicData.formGroupKey = create_UUID();
                                window["EventBasicDetail"] = eventBasicData;
                                $.jGrowl(response.Message, { position: 'center' });
                                // $scope.bindDraggable();
                            }
                            catch (e) {
                                //console.log(e);
                                $.jGrowl(response.Message, { position: 'center' });

                                var _ScrollOffset = window["scrollOffset"];
                                window.scrollTo(0, _ScrollOffset);
                                $.unblockUI();
                            }

                        } else {
                            revertFunc();
                            if (response.res == -1) {
                                swal({ type: 'error', title: '', text: response.Message });

                            } else {
                                swal({ type: 'error', title: '', text: response.overlapMessage });
                            }


                        }

                    },

                    beforeSend: function () {
                        showLoader();
                    },

                    complete: function () {

                        var _ScrollOffset = window["scrollOffset"];
                        window.scrollTo(0, _ScrollOffset);
                        $.unblockUI();
                        // $("#" + current_tab + " div.calendar").unblock();
                    }
                });
            }

        },
        //  resize event's duration inside calendar view
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
            window["scrollOffset"] = $(window).scrollTop();
            var resourceId = (event.resourceId) ? event.resourceId : '';
            var resources = (event.resources) ? event.resources : '';
            var activities = (event.activities) ? event.activities : '';
            var allDay = event.allDay;
            var formfieldDataListTempData = [];
            var activityName = '';
            var resFormId = window["ySelected"];
            var activityFormId = window["xSelected"];
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
                    url: BASE_URL + "FormAPI/EditEventData",
                    dataType: 'json',
                    contentType: "application/json",
                    data: "{'action':2,'resourceFormId':" + resFormId + ",'ActivityFormId':" + activityFormId + ",'userid':" + eventBasicData.userId + ",'Id':" + parseInt(Id) + ", 'formId':" + eventBasicData.formId + ",'topicId':" + eventBasicData.formData.topicId + ",'created_by':" + eventBasicData.created_by + ",'updated_by':" + eventBasicData.update_by + ",'formfieldDataListTemp':'" + JSON.stringify(formfieldDataListTempData) + "' ,'isResizedEvent':" + parseInt(isResizedEvent) + ",startDate:'" + start + "','endDate':'" + end + "','eventOverlap':" + eventOverlap + ",'activitiesOverlap':" + activitiesOverlap + "}", //$.param(formData)
                    success: function (response) {
                        if (response.res > 0) {

                            try {
                                var CalendarEventList = window["CalendarEventList"];
                                //var ActivityEventList = window["ActivityEventList"];
                               // var oneToManyList = eventBasicData.eventData;
                                var CalenderEditableRow = $.grep(CalendarEventList, function (e) {
                                    return e.Id == event.Id;
                                });
                                //var ActivityEditableRow = $.grep(ActivityEventList, function (e) {
                                //    return e.Id == event.Id;
                                //});
                                //var oneToManyListEditableRow = $.grep(oneToManyList, function (e) {
                                //    return e.Id == event.Id;
                                //});
                                CalenderEditableRow[0].start = start;
                                CalenderEditableRow[0].end = end;
                                //ActivityEditableRow[0].start = start;
                                //ActivityEditableRow[0].end = end;
                                //oneToManyListEditableRow[0].start = start;
                                //oneToManyListEditableRow[0].end = end;
                                var filteredEventsCalender = $.grep(CalendarEventList, function (e) {
                                    return e.Id != event.Id;
                                });
                                //var filteredEventsActivity = $.grep(ActivityEventList, function (e) {
                                //    return e.Id != event.Id;
                                //});
                                //var filteredoneToManyList = $.grep(oneToManyList, function (e) {
                                //    return e.Id != event.value;
                                //});
                                filteredEventsCalender.push(CalenderEditableRow[0]);
                                //filteredEventsActivity.push(ActivityEditableRow[0]);
                                //filteredoneToManyList.push(oneToManyListEditableRow[0]);
                                eventBasicData.eventData = filteredEventsCalender;
                                //_.each(filteredEventsCalender, function (dataRow, position) {

                                //    var rowRecord = dataRow;
                                //    var seperatedFormIDsParam = dataRow.seperatedFormIDs;

                                //    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;


                                //    var seperatedTitleParam = dataRow.seperatedTitles;
                                //    var commaIDs = seperatedIdsParam.split(',');
                                //    var commaVals = seperatedFormIDsParam.split(',');
                                //    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                //    var ySelected = window["ySelected"];
                                //    _.each(commaVals, function (idVal, pos) {
                                //        //console.log(commaVals + "," + commaIDs[pos].toString())
                                //        if (idVal == ySelected.toString()) {
                                //            dataRow.resFormID = idVal;
                                //            dataRow.resources = commaIDs[pos];
                                //            dataRow.resourceId = commaIDs[pos];
                                //            dataRow.title = "";
                                //        }

                                //    })



                                //});
                                //_.each(filteredEventsActivity, function (dataRow, position) {

                                //    var rowRecord = dataRow;
                                //    var seperatedFormIDsParam = dataRow.seperatedFormIDs;
                                //    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;
                                //    var seperatedTitleParam = dataRow.seperatedTitles;
                                //    var commaIDs = seperatedIdsParam.split(',');
                                //    var commaVals = seperatedFormIDsParam.split(',');
                                //    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                //    var ySelected = window["ySelected"];
                                //    _.each(commaVals, function (idVal, pos) {
                                //        //console.log(commaVals + "," + commaIDs[pos].toString())
                                //        if (idVal == ySelected.toString()) {
                                //            dataRow.resFormID = idVal;
                                //            dataRow.resources = commaIDs[pos];
                                //            dataRow.resourceId = commaIDs[pos];
                                //            dataRow.title = "";
                                //        }

                                //    })



                                //});
                                //_.each(filteredoneToManyList, function (dataRow, position) {
                                //    var rowRecord = dataRow;
                                //    var seperatedFormIDsParam = dataRow.seperatedFormIDs;
                                //    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;
                                //    var seperatedTitleParam = dataRow.seperatedTitles;
                                //    var commaIDs = seperatedIdsParam.split(',');
                                //    var commaVals = seperatedFormIDsParam.split(',');
                                //    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                //    var ySelected = window["ySelected"];
                                //    _.each(commaVals, function (idVal, pos) {
                                //        //console.log(commaVals + "," + commaIDs[pos].toString())
                                //        if (idVal == ySelected.toString()) {
                                //            dataRow.resFormID = idVal;
                                //            dataRow.resources = commaIDs[pos];
                                //            dataRow.resourceId = commaIDs[pos];
                                //            dataRow.title = "";
                                //        }

                                //    })
                                //});
                                window["CalendarEventList"] = filteredEventsCalender;
                                //window["ActivityEventList"] = filteredEventsActivity;
                                refreshEventResourcesActivityNew('BasicView', filteredEventsCalender, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, []);
                                window["EventBasicDetail"] = eventBasicData;
                                $.jGrowl(response.Message, { position: 'center' });
                            }
                            catch (e) {
                                $.jGrowl(response.Message, { position: 'center' });
                                var _ScrollOffset = window["scrollOffset"];
                                window.scrollTo(0, _ScrollOffset);
                                $.unblockUI();
                            }
                        } else {
                            revertFunc();
                            if (response.res == -1) {
                                swal({ type: 'error', title: '', text: response.Message });

                            } else {
                                swal({ type: 'error', title: '', text: response.overlapMessage });
                            }
                        }
                    },
                    beforeSend: function () {
                        showLoader();
                    },
                    complete: function () {
                        var _ScrollOffset = window["scrollOffset"];
                        window.scrollTo(0, _ScrollOffset);
                        $.unblockUI();
                    }
                });
            }
        },
        eventRender: function (event, element) {
            //if (countLoader == 0) {
            //    showLoader();
            //    countLoader++;
            //}
            var $scope = angular.element($("#calendar")).scope();
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            var current_subtab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').find('.ui-state-active').attr('class');
            if (current_tab == "agenda-view") {
               // $scope.$parent.$parent.IND_loading = true;
                //if ($scope.counterLoader == undefined)
                    //showLoader();
                $scope.counterLoader = 1;
            }
            var rowTooltipDisplay = "";
            var rowTooltipTitleDisplay = "";
            var rowRecord = "";
            var _associatedTitles = event.customTitle;
            var _associatedFormIDs = event.customForms;
            var _allSelectables = $scope.xaxisFormList; // x options has all selectable options .
            var _ySelected = window["ySelected"]; // get y selected option.
            var _xSelected = window["xSelected"];
            var _lablesToShow = []; var _colorToShow = [];
            var _tempTitle = "";
            var _tempTitleSecond = "";
            var _mainTempHtml = "";
            var eventData = {
                Id: event.Id,
                Images: event.files,
                title: "Text",
                start: event.start != null && event.start != undefined && event.start != '' ? customDate(event.start.format()) : '',
                end: event.end != null && event.end != undefined && event.end != '' ? customDate(event.end.format()) : '',
                allDay: event.allDay,
                service: event.service,
                description: event.description,
                resources: event.resources,
                activities: event.activities,
                activityName: event.activityName,
                formGroupKey: event.formGroupKey
            };
            eventData.title = _tempTitle;
            eventData.Images = event.files;          
            if (typeof _associatedTitles !== "undefined" && _associatedTitles !== null && _associatedTitles !== "") {
                var _arrTitles = _associatedTitles.split(',');
                var _arrColor = [];
                var _arrFormIDs = _associatedFormIDs.split(",");

                ////getting index of x selected form  from  associated formIDs arr
                //var _xPos = _arrFormIDs.indexOf(_xSelected.toString());
                ////swapping position of x occurance  with 0 index;
                //if (_xPos !== undefined && _xPos !== null && _xPos !== -1) {
                //    var _temp = "";
                //    //for titles
                //    _temp = _arrTitles[0];
                //    _arrTitles[0] = _arrTitles[_xPos];
                //    _arrTitles[_xPos] = _temp;
                //    //for color
                //    if (_arrColor.length > 0) {
                //        _temp = _arrColor[0];
                //        _arrColor[0] = _arrColor[_xPos];
                //        _arrColor[_xPos] = _temp;
                //    }
                //    //for formIDs
                //    _temp = _arrFormIDs[0];
                //    _arrFormIDs[0] = _arrFormIDs[_xPos];
                //    _arrFormIDs[_xPos] = _temp;
                //}
                //var eventTemp = angular.copy(event);
                if (!eventData.allDay) {
                    eventData.start = eventData.start != null && eventData.start != undefined && eventData.start != '' ? eventData.start : '';
                    if (eventData.end != "" && eventData.end != null) {
                        eventData.end = eventData.end != null && eventData.end != undefined && eventData.end != '' ? eventData.end : '';
                        rowTooltipDisplay += DateWithDayName(eventData, true) + " <br/> "
                        rowTooltipDisplay += TimeFormatCalender(eventData, true) + " "
                    } else {
                        rowTooltipDisplay += moment(eventData.start).format("YYYY-MM-DD") + " "
                    }
                }
                else {
                    rowTooltipDisplay += moment(eventData.start).format("YYYY-MM-DD") + " "
                }
                //element.find('.fc-content').remove();
                //if (eventData.description != "" && eventData.description != null) {
                //    _tempTitle += "<label class='pr-2'>" + eventData.description + "</label>";
                //}
                var tempHtml = "";

                if (eventData.title != null && eventData.title.length > 0)
                    rowRecord += "<div class='title " + _tempTitleSecond + "'>" + eventData.title + "</div>";
                if (!eventData.allDay) {
                    if (eventData.start != null && eventData.start.length > 0)
                        rowRecord += "<div class='" + eventData.start + "'>" + DateWithDayName(eventData, true) + "</div>";
                    rowRecord += "<div>" + TimeFormatCalender(eventData, true) + "</div>";
                    if (current_tab == "list-view") {
                        var _associatedFormIDsTemp = _associatedFormIDs.split(",");
                        var _associatedTitlestemp = _associatedTitles.split(",").map(function (item) {
                            return item.trim();
                        });
                        var _associatedCustomFormIdsTemp = event.customFormIds.split(",");
                        var exists = _.findIndex(_associatedFormIDsTemp, function (item) { return item == $scope.ySelection.toString() });
                        var lblColor = undefined;
                        var customLocationTitle = "";
                        if (exists >= 0) {
                            customLocationTitle = _associatedTitlestemp[exists];
                            var tempColor = "";
                            var colorExists = _.findWhere($scopeVar.xaxisFormList, { resourceActivityForm: $scope.ySelection });
                            var currentId = _associatedCustomFormIdsTemp[exists].toString();
                            if (colorExists != undefined) {
                                var colorRow = _.findWhere(colorExists.formDataList, { id: currentId });
                                if (colorRow != undefined) {
                                    tempColor = colorRow[colorExists.colorField];
                                }
                            }
                            lblColor = tempColor;
                        }
                        if (customLocationTitle != "" && customLocationTitle != null && customLocationTitle != undefined) {
                            var tempHtml = "<div class='fc-content' id='customLocationTitle' style = 'background:" + (lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor) + ";borderRadius: 3;'><span class='fc-title' title='' > " + customLocationTitle + "</span></div> ";
                            if (current_tab != "agenda-view") {
                                _mainTempHtml += tempHtml;
                            }
                        }
                        //var tempHtml = "";
                        tempHtml = "<div class='fc-content fcTime' id='" + event.Id + "_Time'><small class='time' title=''>" + TimeFormatCalender(eventData, true) + "</small></div>" + _mainTempHtml;
                        // element.prepend(tempHtml);
                        if (current_tab != "agenda-view") {
                            _mainTempHtml = tempHtml;
                        }

                    } else {
                        if (current_subtab != undefined) {
                            if ((current_tab == "agenda-view" || current_tab == "timeline-resource-view") && (current_subtab.contains("fc-month-button") || current_subtab.contains("fc-timelineYear-button") || current_subtab.contains("fc-timelineMonth-button"))) {
                                var tempHtml = "";
                                tempHtml = "<div class='fc-content'><span class='text-dark small' title=''>" + TimeFormatCalender(eventData, true) + "</span></div>" + tempHtml;
                                if (current_tab != "agenda-view") {
                                    _mainTempHtml += tempHtml;
                                }
                            }
                        }

                    }
                }
                else{
                    if (current_tab == "list-view") {
                        var _associatedFormIDsTemp = _associatedFormIDs.split(",");
                        var _associatedTitlestemp = _associatedTitles.split(",").map(function (item) {
                            return item.trim();
                        });
                        var _associatedCustomFormIdsTemp = event.customFormIds.split(",");
                        var exists = _.findIndex(_associatedFormIDsTemp, function (item) { return item == $scope.ySelection.toString() });
                        var lblColor = undefined;
                        var customLocationTitle = "";
                        if (exists >= 0) {
                            customLocationTitle = _associatedTitlestemp[exists];
                            var tempColor = "";
                            var colorExists = _.findWhere($scopeVar.xaxisFormList, { resourceActivityForm: $scope.ySelection });
                            var currentId = _associatedCustomFormIdsTemp[exists].toString();
                            if (colorExists != undefined) {
                                var colorRow = _.findWhere(colorExists.formDataList, { id: currentId });
                                if (colorRow != undefined) {
                                    tempColor = colorRow[colorExists.colorField];
                                }
                            }
                            lblColor = tempColor;
                        }
                        if (customLocationTitle != "" && customLocationTitle != null && customLocationTitle != undefined) {
                            var tempHtml = "<div class='fc-content' id='dd' style = 'background:" + (lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor) + ";borderRadius: 3;'><span class='fc-title' title='' > " + customLocationTitle + "</span></div > ";
                            if (current_tab != "agenda-view") {
                                _mainTempHtml += tempHtml;
                            }
                        }
                    }
                    rowRecord += "<div class='" + moment(eventData.start).format("YYYY-MM-DD") + "'>" + moment(eventData.start).format("MMMM D, YYYY (dddd)") + "</div>";
                }
                //var newLabelList = _.filter(_associatedFormIDsTemp, function (item) { return item != $scope.ySelection.toString() });
                listids = event.customFormIds.split(',');
                var currentId = 0;
                tempHtml = "";
                var agendaTempHtml = '<div class="fc-content" style="padding: 2px 1px;border-radius: 3px;background: #ddd;color: #000;" data-original-title="" title="">';
                var agendaTempHtmlSub = '';
                var titleCounter = 0;
                _.each(_arrFormIDs, function (dataRow, position)
                {
                    if (dataRow !== _ySelected.toString()) {

                        var lblColor = "";
                        _lablesToShow.push(dataRow.toString());
                        var _arrRowData = _arrTitles[position];
                        currentId = listids[position].toString().trim();
                        var tempColor = "";
                        var colorExists = _.findWhere($scopeVar.xaxisFormList, { resourceActivityForm: parseInt(dataRow.toString().trim()) });
                        if (colorExists != undefined) {
                            var colorRow = _.findWhere(colorExists.formDataList, { id: currentId.toString() });
                            if (colorRow != undefined) {
                                tempColor = colorRow[colorExists.colorField];
                            }
                            lblColor = tempColor;
                        }
                        _arrRowData = _arrRowData.split('-');
                        var slipTitle = "";
                        if (_arrRowData.length == 1)
                            slipTitle = _arrRowData[0];
                        else if (_arrRowData.length > 1)
                            slipTitle = _arrRowData[0] + " - " + _arrRowData[1];

                        if (colorExists != undefined) {
                            if (colorExists.isVisible)
                                rowTooltipTitleDisplay += slipTitle + " <br/> ";
                            else {
                                if (!colorExists.isVisible && listids.length == 2)
                                    rowTooltipTitleDisplay += slipTitle + "  <br/> ";
                            }
                            if (current_tab != "agenda-view") {
                                if (colorExists.isVisible)
                                    tempHtml += "<div class='fc-content' id='" + event.Id + "_" + position + "_" + currentId + "' style='background:" + (lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor) + ";borderRadius: 3;'><span class='fc-title'>" + slipTitle + "</span></div>"
                                else
                                    if (!colorExists.isVisible && listids.length==2)
                                        tempHtml += "<div class='fc-content' id='" + event.Id + "_" + position + "_" + currentId + "' style='background:" + (lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor) + ";borderRadius: 3;'><span class='fc-title'>" + slipTitle + "</span></div>"


                                }
                                else {
                                if (titleCounter == 1 && listids.length == 3) {
                                    if (colorExists.isVisible) {
                                        if (tempHtml.length>0)
                                        agendaTempHtml += "	<span>-</span>  ";

                                        agendaTempHtml += "	<span class='fc-title' style='borderRadius: 3;'>" + slipTitle + "</span> ";
                                    }
                                    else {
                                        if (!colorExists.isVisible && listids.length == 2) {
                                            if (tempHtml.length > 0)
                                            agendaTempHtml += "	<span>-</span>  ";

                                            agendaTempHtml += "	<span class='fc-title' style='borderRadius: 3;'>" + slipTitle + "</span> ";
                                        }
                                    }
                                        agendaTempHtml += "	<span class='fc-customtime' >" + formatAMPM(eventData.start) + "</span> ";
                                    }
                                    else {
                                    if (colorExists.isVisible)
                                        agendaTempHtml += "	<span class='fc-title' style='borderRadius: 3;'>" + slipTitle + "</span> ";
                                    else {
                                        if (!colorExists.isVisible && listids.length == 2)
                                            agendaTempHtml += "	<span class='fc-title' style='borderRadius: 3;'>" + slipTitle + "</span> ";
                                    }
                                        titleCounter += 1;
                                        if (listids.length == 2) {
                                            agendaTempHtml += "	<span class='fc-customtime' >" + formatAMPM(eventData.start) + "</span> ";
                                        }
                                    }

                                    //if (titleCounter == 1 && listids.length == 3) {
                                    //    agendaTempHtml += "	<span style='color: #fff;background: #000;'>and</span>  ";
                                    //    agendaTempHtml += "	<span class='fc-title' style='background:" + (lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor) + ";borderRadius: 3;'>" + slipTitle + "</span> ";
                                    //}
                                    //else {
                                    //    agendaTempHtml += "	<span class='fc-title' style='background:" + (lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor) + ";borderRadius: 3;'>" + slipTitle + "</span> ";
                                    //    titleCounter += 1;
                                    //}
                                
                            }
                        }
                    }                                      
                    
                });                
                agendaTempHtml += '</div>';
              
                if (current_tab != "agenda-view") {
                    _mainTempHtml += tempHtml;
                }
                else {
                    _mainTempHtml += agendaTempHtml;
                }

            }
            if ($scope.formDetailsDataInfo.otherFormIsShow != null && $scope.formDetailsDataInfo.otherFormIsShow == true) {
                if (event.customFourthTitle != null && event.customFourthTitle != "") {
                    var tempHtml = "<div class='fc-content fcTime' id='" + event.Id + "_Time'><small class='time' title=''> " + event.customFourthTitle + "</small></div> ";
                    if (current_tab != "agenda-view") {
                        _mainTempHtml += tempHtml;
                    }
                    rowTooltipDisplay += event.customFourthTitle + " <br/> "
                }
            }
            // For Tag view  //
            //static tagify
            rowRecord += '<div>  <input value="' + eventData.Id + '" id="tag-inputHidden" type="hidden"> ';
            //dynamic tagify
            _.each($scope.totalSelectListTagify, function (item) {
                var taglist = [];
                var tempTag = eventData[item.name];
                if (tempTag != undefined && tempTag != null && tempTag != "") {
                    taglist = tempTag.replace(/"/g, "'");
                }
                rowRecord += '<input value="' + item.name + '" id="tag-inputHidden' + eventData.Id + '" type="hidden"> <input value="' + taglist + '" id="tag-inputHidden' + item.name + '" type="hidden"><input id="tag-input' + item.name + '" type="text"  value="' + taglist + '" placeholder="Add tags">';
            });
            rowRecord += '</div>';
            $scope.counterLoader = undefined;
            var tableTempHtml = "<div class='event-detail div-flex'><div class='div-flex'>" + rowRecord + "</div></div>";
            var basicDetails = window["EventBasicDetail"];
            var actionRow = "";
            actionRow += "<div id='eventCopy' class='mr-10 cursor-pointer' data-formId='" + basicDetails.formId + "' data-formGroupKey='" + eventData.formGroupKey + "' data-eventId='" + event.Id + "'><a> <i class='fa fa-copy'></i></a></div>" + "<div id='eventEdit' class='mr-10 cursor-pointer' data-formId='" + basicDetails.formId + "' data-formGroupKey='" + eventData.formGroupKey + "' data-eventId='" + event.Id + "'><a> <i class='fa fa-pencil'></i></a></div>" + "<div id='eventDelete' data-formId='" + basicDetails.formId + "'    data-formGroupKey='" + eventData.formGroupKey + "' data-eventId='" + event.Id + "' class='delete-event cursor-pointer'><i class='fa fa-trash'></i></div>" + "<a class='btn close-event cursor-pointer' title='close'  data-dismiss='modal' aria-label='Close'> <i class='fa fa-times'></i></a>";
            tableTempHtml = "<div class='event-detail div-flex'><div class='div-flex'>" + rowRecord + "</div><div class='btn-box'>" + actionRow + "</div><div class='div-flex div-list-bar'></div></div>";
            var tempHtmlTable = "";
            if ($scope.listTabulator.length > 0) {
                tempHtmlTable = `<div class="div-flex div-list">
                            <div class="d-flex justify-content-between align-items-center p-0">
                                <h5 class="list-title mb-0" id="tabuList"></h5>
                                <div class="d-block">
                                    <div id="addTransactionRecord" class="edit-event-student cursor-pointer d-inline-block"><i class="fa fa-plus"></i></div> <div id="tabuListLink" class="edit-event-student mr-0 ml-1 cursor-pointer d-inline-block"  title="Edit"><i class="fa fa-pencil"></i></div> </div>  </div>   <ul id="tabuListUl">  </ul></div>`;
            }
            else {
                tempHtmlTable = `<div class="div-flex div-list">
                            <div class="d-flex justify-content-between align-items-center p-0">
                                <h5 class="list-title mb-0" id="tabuList"></h5>
                                <div class="d-block">
                                    <div id="addTransactionRecord" class="edit-event-student cursor-pointer d-inline-block"><i class="fa fa-plus"></i></div>  </div>  </div>   <ul id="tabuListUl">  </ul></div>`

            }
            element.append(_mainTempHtml)
            tableTempHtml = "<div class='event-detail div-flex'><div class='div-flex'>" + rowRecord + "</div><div class='btn-box'>" + actionRow + "</div><div class='div-flex div-list-bar'></div>" + tempHtmlTable + "</div>";
            let $fcContent = element.find(".fc-content").detach(),
                $resize = element.find(".fc-resizer").detach();
            element.attr('title', rowTooltipTitleDisplay + "  " + rowTooltipDisplay);
            element.attr('data-html', 'true');
            element.css({
                background: "rgb(255, 255, 255)",
                borderColor: "#aaa",
                padding: 2,
                borderRadius: 5,

                "z-index": 1
            }).droppable({
                drop: function (event, ui) {
                    console.log(event);
                    console.log(ui);
                },
                activate: function (event, ui) {
                    console.log(event);
                }
            })
                .empty().append($fcContent.css({
                    borderRadius: 3,
                }), $resize);
        },
        eventClick: function (calEvent, jsEvent, view) {    
            customEventDetailsModelPopUp.modal('show');
            customEventDetailsModelPopUp.css({ "z-index": "9999" });
            var $scope = angular.element($("#calendar")).scope();        
            $scope.selectEventDetails = calEvent;  
            if (calEvent.formID == undefined) {
                $scope.selectEventDetails.formID = $scope.currentFormId;  
            }
            $scope.selectEventDetails.resourceFormId = $scope.ySelection;
            $scope.selectEventDetails.ActivityFormId = $scope.xSelection;
            $scope.selectEventDetails.start = $scope.selectEventDetails.start != null && $scope.selectEventDetails.start != undefined && $scope.selectEventDetails.start != '' ? customDate($scope.selectEventDetails.start.format()) : ''
            $scope.selectEventDetails.end = $scope.selectEventDetails.end != null && $scope.selectEventDetails.end != undefined && $scope.selectEventDetails.end != '' ? customDate($scope.selectEventDetails.end.format()) : ''
            $scope.selectEventDetails.customDate = DateWithDayName($scope.selectEventDetails, true);
            if (!$scope.selectEventDetails.allDay) {
                $scope.selectEventDetails.customTime = TimeFormatCalender($scope.selectEventDetails, true);
            }
            else {
                $scope.selectEventDetails.customDate = moment($scope.selectEventDetails.start).format("YYYY-MM-DD");
            }
            //$scope.selectEventDetails.customFormIdsSplit
            //$scope.selectEventDetails.customFormsSplit
            $scope.selectEventDetails.customTitleSplit = $scope.selectEventDetails.customTitle.split(',');
            var listFormDropdown = _.filter($scope.selectEventDetails.customFormsSplit, function (item) { return item != $scope.ySelection.toString(); });
            if (listFormDropdown.length > 0) {
                var listActivities = _.filter($scope.xaxisFormList, function (item) { return item.activitiesForm != $scope.ySelection; });
                $scope.selectEventDetails.dropdownList = [];
                _.each(listActivities, function (item,key) {               
                    var tempDrop = {};
                    var indexForm = _.findIndex($scope.selectEventDetails.customFormsSplit, function (itemForm) { return itemForm.trim() == item.activitiesForm.toString() });
                    if (indexForm != -1) {
                        tempDrop.formId = item.activitiesForm.toString();
                        tempDrop.Id = $scope.selectEventDetails.customFormIdsSplit[indexForm];
                        tempDrop.formTitle = $scope.selectEventDetails.customTitleSplit[indexForm];
                        tempDrop.dropdownListData = item;
                        tempDrop.customClass = "false"; 
                        
                    } else {
                        tempDrop.formId = item.activitiesForm.toString();
                        tempDrop.Id = "0";
                        tempDrop.formTitle = item.title;
                        tempDrop.dropdownListData = item;
                        tempDrop.customClass = "true";
                    }
                    $scope.selectEventDetails.dropdownList.push(tempDrop);
                });
            }           


            



            $('.close-event').on('click', function () {
                $("body .popover").addClass('isPopoverLoaded');
                $("body .popover").popover('hide');
                $("#tabuListUl").empty();
                var $scope = angular.element($("#calendar")).scope();
                $('.temp').find('.titleContainer').removeClass('d-none');
                $('.popoverSelect').addClass('d-none');

            });
            setTimeout(function () {

                removeTitleNew();                
              
                _.each($scope.totalSelectListTagify, function (item, key) {
                    var param = {};

                    // init Tagify script on the above inputs     
                    var input = document.getElementById('newtag-input' + item.name);
                    input.value = [];
                    item.tagify = {};
                    if (input != null) {
                        var tempWhiteControl = $scope.selectEventDetails[item.name];
                        var tempWhiteList = [];
                        var tempWh2 = [];
                        if (tempWhiteControl != undefined && tempWhiteControl != "") {
                            tempWhiteList = tempWhiteControl;
                            tempWhiteList = tempWhiteList.replace(/'/g, '"');
                            tempWhiteList = JSON.parse(tempWhiteList);
                            var newList = [];
                            if (tempWhiteList.length > 0) {
                                if (tempWhiteList[0].value != undefined) {
                                    _.each(tempWhiteList, function (itemtag) {
                                        newList.push(itemtag.value);
                                    });
                                } else {
                                    newList = tempWhiteList;
                                }
                            }
                            tempWhiteList = newList.join();
                            tempWh2 = tempWhiteList.split(",");
                            input.value = tempWhiteList;
                            var tmp = [tempWhiteList];
                        }

                        item.tagify = new Tagify(input, {
                            whitelist: tempWh2,
                            maxTags: 10,
                            dropdown: {
                                maxItems: 20,           // <- mixumum allowed rendered suggestions
                                classname: "tags-look", // <- custom classname for this dropdown, so it could be targeted
                                enabled: 0,             // <- show suggestions on focus
                                closeOnSelect: false    // <- do not hide the suggestions dropdown once an item has been selected
                            }
                        });
                        if (item.tagify.on != undefined) {
                            item.tagify.on('add', onAddTag)
                            item.tagify.on('invalid', onInvalidTag)
                            item.tagify.on('remove', onRemoveTag)
                            item.tagify.on('edit', onTagEdit)
                        }
                    }
                });

                
              
             
            }, 200);
            $scope.rootScopeSafe(); 
            var selectedId = $("#newtag-inputHidden").val();     
            if (selectedId != "") {
                    var param = {};
                    param.selectedId = selectedId;
                    $scope.getTabulatorListFromEvents(param);                                    
            }      
            $(document).on('click', function (e) {
                if ($('.favicon-loader-overlay.active').length) {
                }
                else {
                    if (!$(e.target).closest('.popover.show').length && !$(e.target).closest('.fc-content').length) {
                        //$(document).find('.popover.show').remove()
                        //$("body .popover").addClass('isPopoverLoaded');
                        //$("body .popover").popover('hide');
                        //$("#tabuListUl").empty();
                        //var $scope = angular.element($("#calendar")).scope();
                        //$('.temp').find('.titleContainer').removeClass('d-none');
                        //$('.popoverSelect').addClass('d-none');
                    }
                }
            });
        },
        eventAfterAllRender: function (event, element, view) {

            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');

            if (current_tab == "agenda-view") {
                var $scope = angular.element($("#calendar")).scope();
                $scope.$parent.$parent.IND_loading = false;
                setTimeout(function () {
                    $.unblockUI();
                }, 1000);
            } else {
                $.unblockUI();
            }
            setTimeout(function () {
                jQuery.curCSS = function (element, prop, val) {
                    return jQuery(element).css(prop, val);
                };
                $('.fc-content').bstooltip({ html: true });
                $('.fc-timeline-event').bstooltip({ html: true });
                $('.fc-list-item').bstooltip({ html: true });
                $('.fc-day-grid-event').bstooltip({ html: true });
                $('.fc-time-grid-event').bstooltip({ html: true });
                setTimeout(function () {
                    $('#agenda-view div.calendar').fullCalendar('render');
                    $('#timeline-resource-view div.calendar').fullCalendar('render');
                    $('#vertical-resource-view div.calendar').fullCalendar('render');
                }, 150);
            }, 150);


            
        },

      //  eventDragStop: function (event, jsEvent, ui, view) {
      //      console.log($(jsEvent.target).closest('tr').attr('data-resource-id'));
      //}
        
    },




        // List View
    myOptions = {
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'listDay,listWeek,listMonth,listYear'
            },
            // customize the button names,
            // otherwise they'd all just say "list"
            views: {
                listDay: { buttonText: 'day' },
                listWeek: { buttonText: 'week' },
                listMonth: { buttonText: 'month' },
                listYear: { buttonText: 'year' }
            },
            defaultView: 'listDay',
            defaultDate: new Date(),
            // events: calenderData,
            events: function (start, end, timezone, callback) {

                var $scopeVar = angular.element($("#calendar")).scope();
                var param = {};
                param.action = 1;
                param.formId = $scopeVar.currentFormId;

                param.isCalender = 1;
                param.isEvent = 1;

                param.resourceFormId = $scopeVar.ySelection;
                param.ActivityFormId = $scopeVar.xSelection;
                var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
                var view = $('#list-view div.calendar').fullCalendar('getView');
                param.filter = {};
                param.filter = changeStateOfCalender(view, start, end);
                param.filter.field = "start";
                param.COMPANY_CODE = localStorage.getItem("COMPANY_CODE");
                param.CALENDAR_CODE = localStorage.getItem("CALENDAR_CODE");
                //showLoader();
                $.ajax({
                    method: 'POST',
                    url: BASE_URL + "/FormAPI/getReferralFormFields",
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify(param),
                    success: function (response) {
                        //$.unblockUI();
                        var calenderData = changeResourceIDByYSelection((response.events != undefined) ? response.events : response.events);
                        if (calenderData != undefined) {
                            if ($scopeVar.formDetailsDataInfo.searchByDate != undefined) {
                                $('#list-view div.calendar').fullCalendar('removeEvents');
                            }
                            assignEvents(calenderData);
                            callback(calenderData);                          
                        }
                        else
                            callback([]);
                    },
                    beforeSend: function () {
                        // showLoader();
                    },
                    complete: function () {
                        var _ScrollOffset = window["scrollOffset"];
                        window.scrollTo(0, _ScrollOffset);
                        $.unblockUI();
                        // $("#" + current_tab + " div.calendar").unblock();
                    }
                });
            },
            allDaySlot: true
        };
    var calendarOptions = $.extend({}, defaultOptions, myOptions);
    $('#list-view div.calendar').fullCalendar(calendarOptions);

    // Agenda View
    myOptions = {
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month'
        },
        defaultView: 'month',
        //events: [],  
        events: function (start, end, timezone, callback) {

            var $scopeVar = angular.element($("#calendar")).scope();
            var param = {};
            param.action = 1;
            param.formId = $scopeVar.currentFormId;

            param.isCalender = 1;
            param.isEvent = 1;

            param.resourceFormId = $scopeVar.ySelection;
            param.ActivityFormId = $scopeVar.xSelection;
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            var view = $('#agenda-view div.calendar').fullCalendar('getView');
            param.filter = {};
            start = $('#agenda-view div.calendar').fullCalendar('getDate');
            param.filter = changeStateOfCalender(view, start, end);
            param.filter.field = "start";           
            param.COMPANY_CODE = localStorage.getItem("COMPANY_CODE");
            param.CALENDAR_CODE = localStorage.getItem("CALENDAR_CODE");
            $.ajax({
                method: 'POST',
                url: BASE_URL + "/FormAPI/getReferralFormFields",
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(param),
                success: function (response) {
                    //$.unblockUI();
                    var calenderData = changeResourceIDByYSelection((response.events != undefined) ? response.events : response.events);
                    if (calenderData != undefined) {
                        if ($scopeVar.formDetailsDataInfo.searchByDate != undefined) {
                            $('#agenda-view div.calendar').fullCalendar('removeEvents');
                        }
                        assignEvents(angular.copy(calenderData));
                        callback(calenderData);
                        window["eventListTemp"] = calenderData;
                        window["eventListTempAgenda"] = calenderData;
                      
                    }
                    else
                        callback([]);
                },
                beforeSend: function () {
                    //showLoader();
                },
                complete: function () {
                    var _ScrollOffset = window["scrollOffset"];
                    window.scrollTo(0, _ScrollOffset);
                    $.unblockUI();
                  
                
                    // $("#" + current_tab + " div.calendar").unblock();
                }
            });
        },
        scrollTime: '00:00',
      
        allDaySlot: true,
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
            //dialog.find("form #tab_start").val(start.format());
            //dialog.find("form #tab_end").val(end.format());
            //dialog.find("form #allDay").val('false');
            //dialog.find("form #tab_color").val('#8500b2').change();
            //dialog.dialog("open");

            $("#agenda-view div.calendar").fullCalendar('unselect');
        },
        droppable: true, // this allows things to be dropped onto the calendar
        drop: function (date, jsEvent, ui, resourceId) {
            //console.log($(this));
            swal({
                title: 'Drag Calender Entry',
                text: 'Action is not allowed in this view',
                type: 'error'
            });
            $("#agenda-view div.calendar").fullCalendar('refetchEvents');
            return false;

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
            var allDayCustom = "false";
            var current_subtab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').find('.ui-state-active').attr('class');
            if (current_subtab) {
                allDayCustom = (current_subtab.contains('fc-agendaMonth-button') || current_subtab.contains('fc-timelineYear-button')).toString();
            }
            var defaultDuration = moment.duration(eventExtData.duration);
            var end = date.clone().add(defaultDuration);
            var activities = eventExtData.id;
            var $scope = angular.element($("#calendar")).scope();
            eventBasicData.resFormIdParam = $scope.ySelection;
            eventBasicData.actFormIdParam = eventExtData.formid;
            var param = {};
            param.action = eventBasicData.action;
            param.formId = eventBasicData.formId;
            param.userId = eventBasicData.userId;

            var defaultDuration = moment.duration(eventExtData.duration);
            var end = date.clone().add(defaultDuration);

            var startCustom = date.format();
            var endCustom = end.format();

            var exists = _.findWhere($scopeVar.calenderSettingsFormDetailsDataList, { activitiesForm: parseInt(eventExtData.formid) });
            if (exists != undefined) {
                if (exists.durationField == "0") {
                    allDayCustom = "true";
                } else {
                    allDayCustom = "false";
                }
            }
            var resourceValue = "0";
            var eventData = {
                id: eventExtData.id,
                title: eventExtData.groupingvaluesact,
                color: eventExtData.color,
                allDay: allDayCustom,
                start: startCustom,
                end: endCustom,
                resFormID: eventBasicData.resFormIdParam,
                actFormID: eventBasicData.actFormIdParam,
                resourceId: 0,
                resources: 0,
                activities: eventExtData.title,
                colActivityValue: "",
                colCategoryValue: "",
                colColorValue: "",
                dropin: eventExtData.dropin,
                dimensionType: eventExtData.dimensiontype,
                dropinTitle: eventExtData.title
            };
            if (allDayCustom == "true" || startCustom.length == 10) {
                startCustom = date.format("YYYY-MM-DD");
                startCustom = moment(startCustom + " 00:00:00");
                endCustom = date.format("YYYY-MM-DD");
                let initialdate = endCustom;
                let start_time = '23:59:59';
                endCustom = moment(initialdate + " " + start_time);
                allDayCustom = "true";
                startCustom = startCustom.format("YYYY-MM-DD HH:mm");
                endCustom = endCustom.format("YYYY-MM-DD HH:mm");
            }
            else {
                allDayCustom = "false";
                if (eventExtData.duration == null || eventExtData.duration == "" || eventExtData.duration == undefined || exists.duration == "0") {
                    allDayCustom = "true";
                    startCustom = date.format("YYYY-MM-DD");
                    startCustom = moment(startCustom + " 00:00:00");
                    endCustom = date.format("YYYY-MM-DD");
                    let initialdate = endCustom;
                    let start_time = '23:59:59';
                    endCustom = moment(initialdate + " " + start_time);
                }
            }
            if ($('#allDay-check').is(':checked')) {
                allDayCustom = "true";
                startCustom = date.format("YYYY-MM-DD");
                startCustom = moment(startCustom + " 00:00:00");
                endCustom = date.format("YYYY-MM-DD");
                let initialdate = endCustom;
                let start_time = '23:59:59';
                endCustom = moment(initialdate + " " + start_time);
                startCustom = startCustom.format("YYYY-MM-DD HH:mm");
                endCustom = endCustom.format("YYYY-MM-DD HH:mm");
            }
            else {
                if (current_subtab.contains("fc-timelineDay-button") || current_subtab.contains("fc-agendaDay-button") || current_subtab.contains("fc-agendaWeek-button")) {

                }
                else {
                    allDayCustom = "true";
                    startCustom = date.format("YYYY-MM-DD");
                    startCustom = moment(startCustom + " 00:00:00");
                    endCustom = date.format("YYYY-MM-DD");
                    let initialdate = endCustom;
                    let start_time = '23:59:59';
                    endCustom = moment(initialdate + " " + start_time);
                    startCustom = startCustom.format("YYYY-MM-DD HH:mm");
                    endCustom = endCustom.format("YYYY-MM-DD HH:mm");
                }

            }
            var formfieldDataListTempData = [];
            //console.log(eventExtData);


            if ($('#allDay-check').is(':checked')) {
                allDayCustom = "true";
                startCustom = date.format("YYYY-MM-DD");
                startCustom = moment(startCustom + " 00:00:00");
                endCustom = date.format("YYYY-MM-DD");
                let initialdate = endCustom;
                let start_time = '23:59:59';
                endCustom = moment(initialdate + " " + start_time);
                startCustom = startCustom.format("YYYY-MM-DD HH:mm");
                endCustom = endCustom.format("YYYY-MM-DD HH:mm");
            }
            eventData.allDay = allDayCustom;
            eventData.start = startCustom;
            eventData.end = endCustom;
            eventData.formGroupKey = eventBasicData.formGroupKey;
            formfieldDataListTempData = [

                { "name": "title", "value": title },
                { "name": "start", "value": startCustom },
                { "name": "end", "value": endCustom },
                { "name": "color", "value": color },
                { "name": "allDay", "value": allDayCustom },
                { "name": "service", "value": "" },
                { "name": "description", "value": "" },
                { "name": "activities", "value": activities },
                { "formGroupKey": eventBasicData.formGroupKey, "name": "formGroupKey", "value": eventBasicData.formGroupKey }
            ];


            var checkExists = window["eventListTemp"];
            var exists = _.filter(checkExists, function (item) {
                return compareEventStartEndDateTime(eventData, item) && (item.resourceId == eventData.resourceId ||
                    item.resources == eventData.resourceId);
            });
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            if (exists.length > 0) {
                var listExisting = angular.copy(exists);
                exists = exists[0];
                eventData.formGroupKey = exists.formGroupKey;
                var seperatedIds = exists.customFormIds;
                var comma = seperatedIds.split(',');
                var _droppedForms = exists.customForms;
                var _arr0 = _droppedForms.split(',');
                var _checkIfExists = true;
                _.each(_arr0, function (_row, _pos) {
                    if (_row.toString().trim() === eventBasicData.actFormIdParam.toString()) {
                        _checkIfExists = false;
                        //break;
                    }

                });
                var _checkIfExistsIds = false;
                var _droppedFormsIds = exists.customFormIds;
                var _arr1 = _droppedFormsIds.split(',');
                _.each(listExisting, function (item) {
                    var formlist = item.customForms.split(',');
                    var formIdslist = item.customFormIds.split(',');
                    //// 
                    var formExist = _.filter(formlist, function (formItem) { return formItem.toString().trim() === eventBasicData.actFormIdParam.toString() });
                    var formIdExist = _.filter(formIdslist, function (formIdItem) { return formIdItem.toString().trim() === eventData.id.toString() });
                    if (formExist.length > 0 && formIdExist.length > 0) {
                        _checkIfExistsIds = true;
                    }
                });
                if (!_checkIfExists) {
                    var checkOverlapping = _.where($scopeVar.calenderSettingsFormDetailsDataList, { resourceActivityForm: eventBasicData.actFormIdParam });
                    if (checkOverlapping.length > 0) {
                        var eventOverlapping = _.filter(checkOverlapping, function (item) {
                            return item.eventOverlap == "1" || item.activitiesOverlap == "1";
                        });
                        // 
                        if (eventOverlapping.length > 0 && _checkIfExistsIds) {
                            eventData.formGroupKey = undefined;
                            if (!_checkIfExistsIds) {
                                //$("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                                rebindCalenderWithEvents("deleteEvent");
                                swal({ type: 'error', title: '', text: 'cannot overlap same dimension entry in same timeslot' });
                                return false;
                            }
                            else {
                                generateEvent(eventData, eventExtData, date, end, resourceValue);
                            }
                        } else {
                            if (comma.length > 1 && !_checkIfExists && _checkIfExistsIds) {
                                //$("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                                rebindCalenderWithEvents("deleteEvent");
                                swal({ type: 'error', title: '', text: 'cannot drop same dimension more than once in same event' });
                                return false;
                            } else {
                                eventData.formGroupKey = undefined;
                                generateEvent(eventData, eventExtData, date, end, resourceValue);
                            }
                        }
                    } else {
                        //$("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                        rebindCalenderWithEvents("deleteEvent");
                        swal({ type: 'error', title: '', text: 'cannot drop same dimension more than once in same event' });
                        return false;
                    }
                }
                else if (_checkIfExists) {
                    if (resourceValue !== '') {
                    }
                    if (eventData.title !== '') {
                        addExternalEvent(eventData);
                    }
                }
            }
            else {
                generateEvent(eventData, eventExtData, date, end, resourceValue);
            }
            //if (title !== '') {
            //    var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            //    $.ajax({
            //        method: 'POST',
            //        url: "api/FormAPI/GeneratedFormData",
            //        dataType: 'json',
            //        contentType: "application/json",
            //        data: "{'action':" + eventBasicData.action + ",'userId':" + eventBasicData.userId + ",'formId':" + eventBasicData.formId +
            //            ",'topicId':" + eventBasicData.formData.topicId + ",'created_by':" + eventBasicData.created_by
            //            + ",'resourceFormId':" + eventBasicData.actFormIdParam + ",'ActivityFormId':" + eventBasicData.actFormIdParam + ",'updated_by':" + eventBasicData.update_by + ",'formGroupKey':'" + eventBasicData.formGroupKey
            //            + "','formfieldDataListTemp':'" + JSON.stringify(formfieldDataListTempData) + "'}", //$.param(formData)
            //        success: function (response) {
            //            if (response.res > 0) {
            //                param.created_by = eventBasicData.created_by;
            //                param.update_by = eventBasicData.update_by;
            //                param.formGroupKey = response.formGroupKey;
            //                param.resourceFormId = eventBasicData.resFormIdParam;
            //                param.activityFormId = eventBasicData.actFormIdParam;
            //                param.resourceId = eventBasicData.resourceId != undefined?eventBasicData.resourceId.toString():"0";
            //                param.activityId = activities.toString();
            //                manageOneToManyReferrenceForm(param);                           
            //                var calenderNewRow = {
            //                    Id: response.Id,
            //                    label: null,
            //                    selected: false,
            //                    value: response.Id,
            //                    color: color,
            //                    title: title,
            //                    start: start,
            //                    end: end,
            //                    allDay: allDayCustom,
            //                    activities: title,
            //                    customForms: param.activityFormId,
            //                    customFormIds: activities,
            //                    customTitle: title,
            //                    formGroupKey : param.formGroupKey
            //                };
            //                var activityNewRow = {
            //                    Id: response.Id,
            //                    label: null,
            //                    selected: false,
            //                    value: response.Id,
            //                    color: color,
            //                    title: title,
            //                    start: start,
            //                    end: end,
            //                    allDay: allDayCustom,
            //                    activities: title,
            //                    resourceId: activities,
            //                    customForms: param.activityFormId,
            //                    customFormIds: activities,
            //                    customTitle: title,
            //                    formGroupKey : param.formGroupKey
            //                };
            //                //eventBasicData.formGroupKey = create_UUID();
            //                window["EventBasicDetail"] = eventBasicData;

            //                var CalendarEventList = window["CalendarEventList"];
            //                var ActivityEventList = window["ActivityEventList"];
            //                //console.log('before insertion ');
            //                //console.log(CalendarEventList);

            //                CalendarEventList.push(calenderNewRow);
            //                ActivityEventList.push(activityNewRow);
            //                window["CalendarEventList"] = CalendarEventList;
            //                window["ActivityEventList"] = ActivityEventList;
            //                //console.log('after  insertion ');
            //                //console.log(CalendarEventList);
            //                console.log('hi5')
            //                // $('.calendar').fullCalendar('destroy');
            //                //loadCalendar('BasicView', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, ActivityEventList);
            //                refreshEventResourcesActivity('BasicView', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, ActivityEventList);
            //                //  loadCalendar('BasicView', CalendarEventList);
            //                //$('#basic-view div.calendar').fullCalendar('refetchEvents');

            //                //eventBasicData.formGroupKey = create_UUID();
            //                window["EventBasicDetail"] = eventBasicData;
            //                $.jGrowl(response.Message, { position: 'center' });
            //            }
            //            else {
            //                if (response.res == -1) {
            //                    var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            //                    $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
            //                    swal({ type: 'error', title: '', text: response.Message });

            //                } else {
            //                    swal({ type: 'error', title: '', text: response.overlapMessage });
            //                }
            //            }
            //        },
            //        beforeSend: function () {
            //            showLoader();
            //        },
            //        complete: function () {
            //            $.unblockUI();
            //        }
            //    });
            //}
        }
    };
    var calendarOptions = $.extend({}, defaultOptions, myOptions);
    $('#agenda-view div.calendar').fullCalendar(calendarOptions);
    
    var calendarDetails = angular.copy($scopeVar.calendarMaster);
    if ($scopeVar != undefined)
        if ($scopeVar.ySelection != 0) {
            if ($scopeVar.formDetailsDataInfo != null)
                if ($scopeVar.formDetailsDataInfo.calenderSettingsList != null)
                    if ($scopeVar.formDetailsDataInfo.calenderSettingsList.length > 0) {
                        var exists = _.findWhere($scopeVar.formDetailsDataInfo.calenderSettingsList, { resourceForm: $scopeVar.ySelection });
                        if (exists != undefined) {
                            if (exists.minTime != "" && exists.minTime != null && exists.minTime != undefined && exists.maxTime != null && exists.maxTime != undefined && exists.maxTime != "") {
                                var minTime = exists.minTime.trim().replace(' ', ':');
                                var maxTime = exists.maxTime.trim().replace(' ', ':');


                                if (calendarDetails.controlSheet.DISPLAY_START_TIME != "" && calendarDetails.controlSheet.DISPLAY_START_TIME != "null" && calendarDetails.controlSheet.DISPLAY_START_TIME != null) {
                                    minTime = calendarDetails.controlSheet.DISPLAY_START_TIME;
                                }

                                if (calendarDetails.controlSheet.DISPLAY_END_TIME != "" && calendarDetails.controlSheet.DISPLAY_END_TIME != "null" && calendarDetails.controlSheet.DISPLAY_END_TIME != null) {
                                    maxTime = calendarDetails.controlSheet.DISPLAY_END_TIME;
                                }

                                $('#agenda-view div.calendar').fullCalendar('option', 'minTime', minTime + ":00");
                                $('#agenda-view div.calendar').fullCalendar('option', 'maxTime', maxTime + ":00");
                            }
                        }
                    }
        }
    //tagyfiy on blur
    function onTagifyFocusBlur(e) {
        //console.log(e.type, "event fired")
    }
    // tag added callback
    function onAddTag(e) {
        var id = $("#newtag-inputHidden").val();
        var fieldName = $("#newtag-inputHidden" + id).val();
        var $scope = angular.element($("#calendar")).scope();
        var param = {};
        var list = [];
        param.fieldName = fieldName;
        _.each(e.detail.tagify.value, function (item) {
            list.push('"' + item.value + '"');
        });
        param.fieldDataText = "[" + list.join(',') + "]";
        param.formId = $scope.currentFormId;
        param.Id = id;
        $scope.updateRowDataRecord(param);
    }
    // tag remvoed callback
    function onRemoveTag(e) {
        var id = $("#newtag-inputHidden").val();
        var fieldName = $("#newtag-inputHidden" + id).val();
        var $scope = angular.element($("#calendar")).scope();
        var param = {};
        var list = [];
        param.fieldName = fieldName;
        _.each(e.detail.tagify.value, function (item) {
            list.push('"' + item.value + '"');
        });
        param.fieldDataText = "[" + list.join(',') + "]";
        param.Id = id;
        param.formId = $scope.currentFormId;
        $scope.updateRowDataRecord(param);
    }
    function onTagEdit(e) {
        //console.log("onTagEdit: ", e.detail);
    }
    // invalid tag added callback
    function onInvalidTag(e) {
        //console.log("onInvalidTag: ", e.detail);
    }
    // timeLine resource view
    function addExternalEvent(eventData) {
        window["scrollOffset"] = $(window).scrollTop();
        var eventBasicData = window["EventBasicDetail"];
        var checkExists = window["CalendarEventList"];
        var actFormIdParam = window["xSelected"];
        var resFormIdParam = window["ySelected"];
        var param = {};
        param.action = eventBasicData.action;
        param.formId = eventBasicData.formId;
        param.userId = eventBasicData.userId;
        param.isDyEvent = true;
        param.topicId = eventBasicData.formData.topicId;
        param.created_by = eventBasicData.created_by;
        param.update_by = eventBasicData.update_by;
        param.formGroupKey = eventBasicData.formGroupKey;
        var tempGroup = create_UUID();
        var service = ''; var description = '';
        if (activitiesCategory != null) {
            service = eventData.service;
            description = eventData.description;
        }
        var formfieldDataListTempData = [];
        formfieldDataListTempData = [
            { "name": "title", "value": "" },
            { "name": "start", "value": eventData.start },
            { "name": "end", "value": eventData.end },
            { "name": "color", "value": eventData.color },
            { "name": "allDay", "value": eventData.allDay },
            { "name": "service", "value": service },
            { "name": "description", "value": description },
            { "name": "resources", "value": eventData.resourceId },
            { "name": "resourcesTitle", "value": eventData.resources },
            { "name": "activities", "value": eventData.id },
            { "formGroupKey": eventBasicData.formGroupKey, "name": "formGroupKey", "value": eventBasicData.formGroupKey }
        ];
        var exists = _.filter(checkExists, function (item) {
            return compareEventStartEndDateTime(eventData, item)
                && (item.resourceId == eventData.resourceId ||
                    item.resources == eventData.resourceId);
        });

        if (exists.length > 0) {
            _.each(exists, function (item) {
                var tempformentryidList = item.customFormIds.split(",");
                item.customFormIdsSplit = tempformentryidList;
            });
            exists = _.filter(exists, function (item) { return item.customFormIdsSplit.length == 2 });
            if (exists.length > 0) {
                //make it ready for update
                param.isEventUpdatable = true;
                if (eventData.formGroupKey != undefined) {
                    param.action = 2;//for updte.
                } else {
                    param.action = 1;
                    param.formGroupKey = tempGroup;
                    param.isEventUpdatable = false;
                    var temp = _.findWhere(formfieldDataListTempData, { name: "formGroupKey" });
                    if (temp != null) {
                        temp.value = param.formGroupKey;
                        temp.formGroupKey = param.formGroupKey;
                    }
                }
                exists = exists[0];
                formfieldDataListTempData.push({ "name": "parentID", "value": exists.Id });
                param.parentID = exists.Id;
                var seperatedResColValues = exists.seperatedResColValues;
                var seperatedColorValues = exists.seperatedColorValues;
                if (seperatedResColValues != null && seperatedResColValues.toString() !== "") {
                    param.seperatedResColValues = seperatedResColValues + "," + eventData.resources.toString();
                }
                else {
                    param.seperatedResColValues = eventData.resources.toString();
                }
                // color values
                if (seperatedColorValues != null && seperatedColorValues.toString() !== "") {
                    param.seperatedColorValues = seperatedColorValues + "/" + eventData.color.toString();
                }
                else {
                    param.seperatedColorValues = eventData.colColorValue.toString()
                }
            }
            else {
                formfieldDataListTempData.push({ "name": "parentID", "value": 0 });
                param.parentID = 0;
                param.seperatedFormIDs = window["xSelected"].toString() + "," + window["ySelected"].toString();
                param.seperatedTitles = eventData.title + "," + eventData.dropinTitle //eventData.colActivityValue.toString() + " - " + eventData.colCategoryValue.toString() + " in " + eventData.dropin.toString();
                param.seperatedResFormIDs = window["ySelected"].toString() + "," + window["xSelected"].toString();
                param.seperatedResEntryIDs = eventData.resourceId.toString() + "," + eventData.id.toString();
                param.seperatedResColValues = eventData.resources.toString() + "," + eventData.activities.toString();
                param.seperatedColorValues = eventData.color.toString() + "/" + eventData.colColorValue.toString();
                param.seperatedIds = eventData.id.toString() + "," + eventData.resourceId.toString();
                param.isEventUpdatable = false;
                eventBasicData.formGroupKey = create_UUID();
            }
        }
        else {
            formfieldDataListTempData.push({ "name": "parentID", "value": 0 });
            param.parentID = 0;
            param.seperatedFormIDs = window["xSelected"].toString() + "," + window["ySelected"].toString();
            param.seperatedTitles = eventData.title + "," + eventData.dropinTitle //eventData.colActivityValue.toString() + " - " + eventData.colCategoryValue.toString() + " in " + eventData.dropin.toString();
            param.seperatedResFormIDs = window["ySelected"].toString() + "," + window["xSelected"].toString();
            param.seperatedResEntryIDs = eventData.resourceId.toString() + "," + eventData.id.toString();
            param.seperatedResColValues = eventData.resources.toString() + "," + eventData.activities.toString();
            param.seperatedColorValues = eventData.color.toString() + "/" + eventData.colColorValue.toString();
            param.seperatedIds = eventData.id.toString() + "," + eventData.resourceId.toString();
            param.isEventUpdatable = false;
            eventBasicData.formGroupKey = create_UUID();
        }
        param.formfieldDataListTemp = formfieldDataListTempData;
        var isAllowToUpdate = false;
        if (typeof seperatedTitles !== "undefined" && seperatedTitles !== "" && seperatedTitles !== null) {
        }

        $.ajax({
            method: 'POST',
            url: BASE_URL +"FormAPI/GeneratedFormData",
            dataType: 'json',
            contentType: "application/json",
            data: "{'action':" + param.action + ",'userId':" + param.userId + ",'formId':" + param.formId + ",'resourceFormId':" + resFormIdParam + ",'ActivityFormId':" + actFormIdParam + ",'parentID':" + param.parentID + ",'isDyEvent':" + param.isDyEvent + ",'isEventUpdatable':" + param.isEventUpdatable + ",'seperatedResColValues':'" + param.seperatedResColValues + "','seperatedColorValues':'" + param.seperatedColorValues + "',   'topicId':" + param.topicId + ",'created_by':" + param.created_by + ",'updated_by':" + param.update_by + ",'formGroupKey':'" + param.formGroupKey + "','formfieldDataListTemp':'" + JSON.stringify(param.formfieldDataListTemp) + "'}", //$.param(formData)
            beforeSend: function () {
                showLoader();
            },
            success: function (response) {
                if (response.res > 0 && param.action == 1) {
                    param.resourceFormId = resFormIdParam;
                    param.activityFormId = actFormIdParam;
                    param.resourceId = eventData.resourceId.toString();
                    param.activityId = eventData.id.toString();
                    manageOneToManyReferrenceForm(param);
                    param.activities = eventData.activities;
                    var calenderNewRow = {
                        Id: response.Id,
                        label: null,
                        selected: false,
                        value: response.Id,
                        color: eventData.color,
                        title: "",
                        start: eventData.start,
                        end: eventData.end,
                        allDay: eventData.allDay,
                        resourceId: eventData.resourceId,
                        resources: eventData.resources,
                        service: service,
                        description: description,
                        activities: eventData.activities,
                        customTitle: eventData.dropinTitle + ',' + param.activities.toString(),
                        customForms: eventData.resFormID + ',' + param.activityFormId.toString(),
                        customFormIds: eventData.resourceId + ',' + param.activityId.toString(),
                        parentID: 0,
                        formGroupKey: param.formGroupKey
                    };
                    //var activityNewRow = {
                    //    Id: response.Id,
                    //    label: null,
                    //    selected: false,
                    //    value: response.Id,
                    //    color: eventData.color,
                    //    title: "",
                    //    start: eventData.start,
                    //    end: eventData.end,
                    //    allDay: eventData.allDay,
                    //    resourceId: eventData.id,
                    //    resources: eventData.resources,
                    //    service: service,
                    //    description: description,
                    //    activities: eventData.activities,
                    //    customTitle: eventData.dropinTitle + ',' + param.activities.toString(),
                    //    customForms: eventData.resFormID + ',' + param.activityFormId.toString(),
                    //    customFormIds: eventData.resourceId + ',' + param.activityId.toString(),
                    //    parentID: 0,
                    //    formGroupKey: param.formGroupKey
                    //};
                    var oneToManyNewRow = {
                        Id: response.Id,
                        label: null,
                        selected: false,
                        value: response.Id,
                        color: eventData.color,
                        title: "",
                        start: eventData.start,
                        end: eventData.end,
                        allDay: eventData.allDay,
                        resourceId: eventData.resourceId,
                        resources: eventData.resources,
                        service: service,
                        description: description,
                        activities: eventData.activities,
                        customTitle: eventData.dropinTitle + ',' + param.activities.toString(),
                        customForms: eventData.resFormID + ',' + param.activityFormId.toString(),
                        customFormIds: eventData.resourceId + ',' + param.activityId.toString(),
                        parentID: 0,
                        formGroupKey: param.formGroupKey
                    };
                    var CalendarEventList = window["CalendarEventList"];
                    //var ActivityEventList = window["ActivityEventList"];
                    //eventBasicData.eventData.push(oneToManyNewRow);
                    if (CalendarEventList == undefined)
                        CalendarEventList = [];
                    CalendarEventList.push(calenderNewRow);
                    //ActivityEventList.push(activityNewRow);
                    window["CalendarEventList"] = CalendarEventList;
                    //window["ActivityEventList"] = ActivityEventList;
                    refreshEventResourcesActivityNew('deleteEvent', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, []);
                    window["EventBasicDetail"] = eventBasicData;
                    $.jGrowl(response.Message, { position: 'center' });
                    var _ScrollOffset = window["scrollOffset"];
                    window.scrollTo(0, _ScrollOffset);
                }
                else if (response.res > 0 && param.action == 2) {
                    try {
                        var CalendarEventList = window["CalendarEventList"];
                        //var ActivityEventList = window["ActivityEventList"];
                        var oneToManyList = eventBasicData.formData;
                        var CalenderEditableRow = $.grep(CalendarEventList, function (e) {
                            return e.Id == exists.Id;
                        });
                        if (CalenderEditableRow.length > 0) {
                            param.resourceFormId = resFormIdParam;
                            param.activityFormId = actFormIdParam;
                            param.resourceId = eventData.resourceId.toString();
                            param.activityId = eventData.id.toString();
                            param.formGroupKey = CalenderEditableRow[0].formGroupKey;
                            manageOneToManyReferrenceForm(param);
                        }
                        //var ActivityEditableRow = $.grep(ActivityEventList, function (e) {
                        //    return e.Id == exists.Id;
                        //});
                        var oneToManyListEditableRow = $.grep(oneToManyList, function (e) {
                            return e.Id == exists.Id;
                        });
                        CalenderEditableRow[0].customTitle += " ," + eventData.activities.toString();
                        CalenderEditableRow[0].customForms += " ," + eventData.actFormID.toString();
                        CalenderEditableRow[0].customFormIds += " ," + eventData.id.toString();
                        CalenderEditableRow[0].seperatedIds = param.seperatedIds;
                        CalenderEditableRow[0].seperatedTitles = param.seperatedTitles;
                        CalenderEditableRow[0].seperatedFormIDs = param.seperatedFormIDs;
                        CalenderEditableRow[0].parentID = param.parentID;
                        CalenderEditableRow[0].seperatedResFormIDs = param.seperatedResFormIDs;
                        CalenderEditableRow[0].seperatedResEntryIDs = param.seperatedResEntryIDs;
                        CalenderEditableRow[0].seperatedResColValues = param.seperatedResColValues;
                        CalenderEditableRow[0].seperatedColorValues = param.seperatedColorValues;
                        CalenderEditableRow[0].formGroupKey = param.formGroupKey;
                        //ActivityEditableRow[0].seperatedIds = param.seperatedIds;
                        //ActivityEditableRow[0].seperatedTitles = param.seperatedTitles;
                        //ActivityEditableRow[0].seperatedFormIDs = param.seperatedFormIDs;
                        //ActivityEditableRow[0].customTitle += " ," + eventData.activities.toString();
                        //ActivityEditableRow[0].customForms += " ," + eventData.actFormID.toString();
                        //ActivityEditableRow[0].customFormIds += " ," + eventData.id.toString();
                        //ActivityEditableRow[0].parentID = param.parentID;
                        //ActivityEditableRow[0].seperatedResFormIDs = param.seperatedResFormIDs;
                        //ActivityEditableRow[0].seperatedResEntryIDs = param.seperatedResEntryIDs;
                        //ActivityEditableRow[0].seperatedResColValues = param.seperatedResColValues;
                        //ActivityEditableRow[0].seperatedColorValues = param.seperatedColorValues;
                        //ActivityEditableRow[0].formGroupKey = param.formGroupKey;
                        //oneToManyListEditableRow[0].seperatedIds = param.seperatedIds;
                        //oneToManyListEditableRow[0].seperatedTitles = param.seperatedTitles;
                        //oneToManyListEditableRow[0].seperatedFormIDs = param.seperatedFormIDs;
                        //oneToManyListEditableRow[0].customTitle += " ," + eventData.activities.toString();
                        //oneToManyListEditableRow[0].customForms += " ," + eventData.actFormID.toString();
                        //oneToManyListEditableRow[0].customFormIds += " ," + eventData.id.toString();
                        //oneToManyListEditableRow[0].parentID = param.parentID;
                        //oneToManyListEditableRow[0].seperatedResFormIDs = param.seperatedResFormIDs;
                        //oneToManyListEditableRow[0].seperatedResEntryIDs = param.seperatedResEntryIDs;
                        //oneToManyListEditableRow[0].seperatedResColValues = param.seperatedResColValues;
                        //oneToManyListEditableRow[0].seperatedColorValues = param.seperatedColorValues;
                        //oneToManyListEditableRow[0].formGroupKey = param.formGroupKey;
                        var filteredEventsCalender = $.grep(CalendarEventList, function (e) {
                            return e.Id != exists.Id;
                        });
                        //var filteredEventsActivity = $.grep(ActivityEventList, function (e) {
                        //    return e.Id != exists.Id;
                        //});
                        //var filteredoneToManyList = $.grep(oneToManyList, function (e) {
                        //    return e.Id != exists.Id;
                        //});
                        filteredEventsCalender.push(CalenderEditableRow[0]);
                        //filteredEventsActivity.push(ActivityEditableRow[0]);
                        //filteredoneToManyList.push(oneToManyListEditableRow[0]);
                        //eventBasicData.eventData = filteredoneToManyList;
                        _.each(filteredEventsCalender, function (dataRow, position) {
                            var rowRecord = dataRow;
                            var seperatedFormIDsParam = dataRow.customForms;
                            var seperatedIdsParam = dataRow.customFormIds != undefined ? dataRow.customFormIds : dataRow.customFormIds;
                            var seperatedTitleParam = dataRow.customTitle;
                            var commaIDs = seperatedIdsParam.split(',');
                            var commaVals = seperatedFormIDsParam.split(',');
                            var ySelected = window["ySelected"];
                            _.each(commaVals, function (idVal, pos) {
                                if (idVal.trim() == ySelected.toString()) {
                                    dataRow.resFormID = idVal;
                                    dataRow.resources = commaIDs[pos];
                                    dataRow.resourceId = commaIDs[pos];
                                }
                            })
                        });
                        window["CalendarEventList"] = angular.copy(filteredEventsCalender);
                        //window["ActivityEventList"] = filteredEventsActivity;
                        refreshEventResourcesActivityNew('deleteEvent', filteredEventsCalender, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, []);
                        window["EventBasicDetail"] = eventBasicData;
                        $.jGrowl(response.Message, { position: 'center' });
                    }
                    catch (e) {
                        $.jGrowl(response.Message, { position: 'center' });
                        var _ScrollOffset = window["scrollOffset"];
                        window.scrollTo(0, _ScrollOffset);
                        $.unblockUI();
                    }
                }
                else {
                    var _ScrollOffset = window["scrollOffset"];
                    window.scrollTo(0, _ScrollOffset);
                    if (response.res == -1) {
                        var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
                        var CalendarEventList = window["CalendarEventList"];
                        refreshEventResourcesActivityNew('deleteEvent', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, []);
                        //$("#" + current_tab + " .calendar").fullCalendar('refetchEvents');                   
                        //$("#" + current_tab + " div.calendar").fullCalendar('rerenderEvents');
                        swal({ type: 'error', title: '', text: response.Message });

                    } else {
                        swal({ type: 'error', title: '', text: "failed" });
                    }

                }
            },
            complete: function () {
                var _ScrollOffset = window["scrollOffset"];
                window.scrollTo(0, _ScrollOffset);
                $.unblockUI();
            }
        });
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
            if (dialog.length > 2) {
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
            }

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
            var current_subtab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').find('.ui-state-active').attr('class');
            var allDayCustom = "false";
            if (current_subtab) {
                allDayCustom = (current_subtab.contains('fc-timelineMonth-button') || current_subtab.contains('fc-timelineYear-button')).toString();
            }
            var $scope = angular.element($("#calendar")).scope();
            var eventExtData = $(this).data('event');
            var resource = $("#" + current_tab + " .calendar").fullCalendar('getResourceById', resourceId);

            //if (parseInt(eventExtData.formid) == $scope.courseFormId && ($scope.currentUserFormRole == 0 || $scope.currentUserFormRole == 1))
            if ($scope.currentUserFormRole == 0 || $scope.currentUserFormRole == 1)
            {
                swal({
                    title: 'Add / Edit Access',
                    text: "User can't access it",
                    type: 'error'
                });
                rebindCalenderWithEvents("deleteEvent");
                //$("#timeline-resource-view div.calendar").fullCalendar('refetchEvents');            
                return false;
            }




            var title = eventExtData.title ? eventExtData.title : '';
            var id = eventExtData.id ? eventExtData.id : '';
            var resFormIdParam = window["ySelected"];
            var actFormIdParam = window["xSelected"];
            var resourceColumn = window["currResColumn"];
            var majorColumn = window["currMajorColumn"];
            var resourceValue = '', activityValue = title;
            var titleColActivity = eventExtData.activityfield;
            var titleColCategory = eventExtData.categoryfield;
            var titleColColor = eventExtData.colorfield;
            var dropin = eventExtData.dropin;
            var groupingfieldsresParam = eventExtData.groupingfieldsres;
            var dropinTitle = ""; var isAllowService = false;
            if (groupingfieldsresParam !== undefined && groupingfieldsresParam.length > 0) {
                groupingfieldsresParam = groupingfieldsresParam.split('-');
                _.each(groupingfieldsresParam, function (value, key) {
                    if (dropinTitle === "") {
                        dropinTitle = resource[value.trim()];
                    }
                    else
                        dropinTitle += " - " + resource[value.trim()];
                });
            }
            if (eventExtData.dimensiontype == "2D") {
                eventExtData.groupingvaluesact = eventExtData.title;
            }
            var colActivityValue = ""; var colCategoryValue = ""; var colColorValue = "";
            if (typeof resource[resourceColumn] != 'undefined') {
                resourceValue = resource[resourceColumn];
                if (eventExtData.dimensiontype == "2D")
                    dropinTitle = resourceValue;
            }
            if (typeof resource[titleColActivity] != 'undefined') {
                colActivityValue = resource[titleColActivity];
            }
            if (typeof resource[titleColCategory] != 'undefined') {
                colCategoryValue = resource[titleColCategory];
            }
            if (typeof resource[titleColColor] != 'undefined') {
                colColorValue = resource[titleColColor];
            }
            var defaultDuration = moment.duration(eventExtData.duration);
            var end = date.clone().add(defaultDuration);



            var exists = _.findWhere($scopeVar.calenderSettingsFormDetailsDataList, { activitiesForm: parseInt(eventExtData.formid) });
            if (exists != undefined) {
                if (exists.durationField == "0") {
                    allDayCustom = "true";
                } else {
                    allDayCustom = "false";
                }
            }
            var startCustom = date.format();
            var endCustom = end.format();
            if (allDayCustom == "true") {
                startCustom = date.format("YYYY-MM-DD");
                startCustom = moment(startCustom + " 00:00:00");
                endCustom = date.format("YYYY-MM-DD");
                let initialdate = endCustom;
                let start_time = '23:59:59';
                endCustom = moment(initialdate + " " + start_time);
            }
            else {
                allDayCustom = "false";
                if (eventExtData.duration == null || eventExtData.duration == "" || eventExtData.duration == undefined || exists.duration == "0") {
                    allDayCustom = "true";
                    startCustom = date.format("YYYY-MM-DD");
                    startCustom = moment(startCustom + " 00:00:00");
                    endCustom = date.format("YYYY-MM-DD");
                    let initialdate = endCustom;
                    let start_time = '23:59:59';
                    endCustom = moment(initialdate + " " + start_time);
                }
            }
            if ($('#allDay-check').is(':checked')) {
                allDayCustom = "true";
                startCustom = date.format("YYYY-MM-DD");
                startCustom = moment(startCustom + " 00:00:00");
                endCustom = date.format("YYYY-MM-DD");
                let initialdate = endCustom;
                let start_time = '23:59:59';
                endCustom = moment(initialdate + " " + start_time);
            }
            else {
                if (current_subtab.contains("fc-timelineDay-button") || current_subtab.contains("fc-agendaDay-button")) {

                }
                else {
                    allDayCustom = "true";
                    startCustom = date.format("YYYY-MM-DD");
                    startCustom = moment(startCustom + " 00:00:00");
                    endCustom = date.format("YYYY-MM-DD");
                    let initialdate = endCustom;
                    let start_time = '23:59:59';

                    endCustom = moment(initialdate + " " + start_time);
                }

            }
            var eventData = {
                id: id,
                title: eventExtData.groupingvaluesact,
                color: eventExtData.color,
                allDay: allDayCustom,
                start: startCustom,
                end: endCustom,
                resFormID: resFormIdParam,
                actFormID: actFormIdParam,
                resourceId: resourceId,
                resources: resourceValue,
                activities: activityValue,
                colActivityValue: colActivityValue,
                colCategoryValue: colCategoryValue,
                colColorValue: colColorValue,
                dropin: dropin,
                dimensionType: eventExtData.dimensiontype,
                dropinTitle: dropinTitle
            };
            var checkExists = window["eventListTemp"];
            //var exists = _.filter(checkExists, function (item) {
            //    return compareEventStartEndDateTime(eventData, item) && (item.resourceId == eventData.resourceId ||
            //        item.resources == eventData.resourceId);
            //});
            //var exists = _.filter(checkExists, function (item) {
            //    return compareEventStartEndDateTime(eventData, item);
            //});
            if (exists.eventOverlap == "0" || exists.eventOverlap == null) {

                JSON.stringify(checkExists.map(x => x.start));
                JSON.stringify(checkExists.map(x => x.end));
                exists = _.filter(checkExists, function (item) {
                    return compareEventStartEndDateTime_noOverlap(eventData, item);
                });
            } else {
                exists = _.filter(checkExists, function (item) {
                    return compareEventStartEndDateTime(eventData, item);
                });
            }
            var isAllowBooking = false;
            var isExistsBooking = _.filter($scope.allFormsList, function (item) {
                return item.formTag != undefined ? item.formTag.toLowerCase().contains('slot') : false;
            });

            var isExistsSlot = _.filter($scope.allFormsList, function (item) {
                return (item.formTag != undefined ? item.formTag.toLowerCase().contains('booking') : false) && item.formId == eventData.actFormID;
            });

            


            if (exists.length > 0) {
                exists = _.filter(exists, function (item) { return item.customFormIdsSplit.length == 2 });
                if (exists.length > 0) {
                    
                    var listExisting = angular.copy(exists);
                    exists = exists[0];
                    eventData.formGroupKey = exists.formGroupKey;
                    var seperatedIds = exists.customFormIds;
                    var comma = seperatedIds.split(',');
                    var _droppedForms = exists.customForms;
                    var _arr0 = _droppedForms.split(',');
                    var _checkIfExists = true;
                    _.each(_arr0, function (_row, _pos) {
                        if (_row.toString().trim() === actFormIdParam.toString()) {
                            _checkIfExists = false;
                            //break;
                        }
                        var checkBooking = _.findWhere(isExistsBooking, { formId: parseInt(_row) });
                        if (checkBooking != undefined) {
                            isAllowBooking = true;
                        }
                    });
                    var _checkIfExistsIds = false;
                    var _droppedFormsIds = exists.customFormIds;
                    var _arr1 = _droppedFormsIds.split(',');
                    _.each(listExisting, function (item) {
                        var formlist = item.customForms.split(',');
                        var formIdslist = item.customFormIds.split(',');                        
                        var formExist = _.filter(formlist, function (formItem) { return formItem.toString().trim() === actFormIdParam.toString() });
                        //var formIdExist = _.filter(formIdslist, function (formIdItem) { return formIdItem.toString().trim() === eventData.id.toString() });
                        //if (formExist.length > 0 && formIdExist.length > 0) {
                        //    _checkIfExistsIds = true;
                        //}
                        if (formExist.length > 0) {
                            _checkIfExistsIds = true;
                        }

                    });
                    if (!isAllowBooking && isExistsBooking.length > 0) {
                        rebindCalenderWithEvents("deleteEvent");
                        swal({ type: 'error', title: '', text: 'Booking cannot be dropped without slot details activity.' });
                        return false;
                    }


                    if (!_checkIfExists) {
                        var checkOverlapping = _.where($scopeVar.calenderSettingsFormDetailsDataList, { resourceActivityForm: actFormIdParam });
                        if (checkOverlapping.length > 0) {
                            var eventOverlapping = _.filter(checkOverlapping, function (item) {
                                return item.eventOverlap == "1" || item.activitiesOverlap == "1";
                            });
                            // 
                            if (eventOverlapping.length > 0 && _checkIfExistsIds) {
                                eventData.formGroupKey = undefined;
                                if (!_checkIfExistsIds) {
                                    //$("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                                    rebindCalenderWithEvents("deleteEvent");
                                    swal({ type: 'error', title: '', text: 'cannot overlap same dimension entry in same timeslot' });
                                    return false;
                                }
                                else {
                                    generateEvent(eventData, eventExtData, date, end, resourceValue);
                                }
                            } else {
                                if (comma.length > 1 && !_checkIfExists && _checkIfExistsIds) {
                                    //$('#' + current_tab + ' div.calendar').fullCalendar('removeEvents');
                                    //$("#" + current_tab + " .calendar").fullCalendar('refetchEvents');                              
                                    rebindCalenderWithEvents("deleteEvent");
                                    swal({ type: 'error', title: '', text: 'cannot drop same dimension more than once in same event' });
                                    return false;
                                } else {
                                    eventData.formGroupKey = undefined;
                                    generateEvent(eventData, eventExtData, date, end, resourceValue);
                                }
                            }
                        } else {
                            //$("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                            rebindCalenderWithEvents("deleteEvent");
                            swal({ type: 'error', title: '', text: 'cannot drop same dimension more than once in same event' });
                            return false;
                        }
                    }
                    else if (_checkIfExists) {
                        if (resourceValue !== '') {
                        }
                        if (eventData.title !== '') {
                            addExternalEvent(eventData);
                        }
                    }
                }
                else {
                    if (isAllowBooking == false && isExistsSlot.length > 0) {
                        rebindCalenderWithEvents("deleteEvent");
                        swal({ type: 'error', title: '', text: 'Booking cannot be dropped without slot details activity.' });
                        return false;
                    }
                    generateEvent(eventData, eventExtData, date, end, resourceValue);
                }
                //var comma = seperatedIds.split(',');
                //if (comma.length > 2) {
                //    $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                //    return false;
                //}
                //else {
                //    var _droppedForms = exists.customForms;
                //    var _arr0 = _droppedForms.split(',');
                //    var _checkIfExists = true;
                //    angular.forEach(_arr0, function (_row, _pos) {
                //        if (_row.toString().trim() === actFormIdParam.toString()) {
                //            _checkIfExists = false;
                //            //break;
                //        }

                //    });
                //    var _checkIfExistsIds = false;
                //    var _droppedFormsIds = exists.customFormIds;
                //    var _arr1 = _droppedFormsIds.split(',');
                //   _.each(listExisting, function (item) {
                //        var formlist = item.customForms.split(',');
                //        var formIdslist = item.customFormIds.split(',');
                //        var formExist = _.filter(formlist, function (formItem) { return formItem.toString().trim() === actFormIdParam.toString() });
                //        var formIdExist = _.filter(formIdslist, function (formIdItem) { return formIdItem.toString().trim() === eventData.id.toString() });
                //        if (formExist.length > 0 && formIdExist.length > 0) {
                //            _checkIfExistsIds = true;
                //        }
                //    });                
                //    if (!_checkIfExists) {
                //        var checkOverlapping = _.where($scopeVar.calenderSettingsFormDetailsDataList, { resourceActivityForm: actFormIdParam });
                //        if (checkOverlapping.length > 0) {
                //            var eventOverlapping = _.filter(checkOverlapping, function (item) {
                //                return item.eventOverlap == "1" || item.activitiesOverlap == "1";
                //            });
                //            if (eventOverlapping.length > 0 && _checkIfExistsIds) {
                //                eventData.formGroupKey = undefined;
                //                if (!_checkIfExistsIds) {
                //                    $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                //                    swal({ type: 'error', title: '', text: 'cannot overlap same dimension entry in same timeslot' });
                //                    return false;
                //                }
                //                else {
                //                    generateEvent(eventData, eventExtData, date, end, resourceValue);
                //                }
                //            } else {
                //                if (comma.length > 1 && !_checkIfExists && _checkIfExistsIds) {
                //                    $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                //                    swal({ type: 'error', title: '', text: 'cannot drop same dimension more than once in same event' });
                //                    return false;
                //                } else {
                //                    eventData.formGroupKey = undefined;
                //                    generateEvent(eventData, eventExtData, date, end, resourceValue);
                //                }
                //            }
                //        } else {
                //            $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                //            swal({ type: 'error', title: '', text: 'cannot drop same dimension more than once in same event' });
                //            return false;
                //        }
                //    }                  
                //    else if (_checkIfExists) {
                //        if (resourceValue !== '') {                           
                //        }
                //        if (eventData.title !== '') {
                //            addExternalEvent(eventData);
                //        }
                //    }                   
                //}
            }
            else {
                if (isAllowBooking == false && isExistsSlot.length > 0) {
                    rebindCalenderWithEvents("deleteEvent");
                    swal({ type: 'error', title: '', text: 'Booking cannot be dropped without slot details activity.' });
                    return false;
                }
                generateEvent(eventData, eventExtData, date, end, resourceValue);
            }
        }
    };
    function generateEvent(eventData, eventExtData, date, end, resourceValue) {
        var dropinTitle = ""; var isAllowService = false;
        //for activity category && overlap check.
        var postData = {
            action: 33,
            userId: eventData.userid,
            formId: eventData.formID,
            ActivityFormId: eventExtData.formid,
            ActivityId: eventExtData.id,
            ActivityFields: eventExtData.servicefield,
            resourceId: eventData.resourceId,
            isActivityCategory: 1,
            resEntryColumn: eventData.activitiesCategory,
            compareColumn: eventData.activityField,
            compareValue: eventExtData.title,
            startDate: date.format(),
            endDate: end.format(),
            eventOverlap: eventData.eventOverlap,
            activitiesOverlap: eventData.activitiesOverlap,
            isResourceExternalDrop: true

        }
        // select a category    eventExtData.servicefield !== '' && eventExtData.servicefield != null
        if (isAllowService) {
            async function callCategory(eventData) {
                // inputOptions can be an object or Promise
                const inputOptions = new Promise((resolve) => {
                    $.post(BASE_URL + "/FormAPI/getReferralFormFields", postData, function (response) {
                        if (typeof response.overlapMesage !== 'undefined') {
                            swal({ type: 'error', title: '', text: response.overlapMesage });
                            rebindCalenderWithEvents("deleteEvent");
                            //alert(current_tab)
                            //$("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
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
                                }
                            }
                            if (Object.keys(resolveCategory).length > 1) {
                                resolve(resolveCategory);
                            } else {
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
                                    if (result.value) {
                                        var service = $.trim(result.value[0]), description = $.trim(result.value[1]);
                                        if (resourceValue !== '')
                                            if (eventData.title !== '') {
                                                eventData['service'] = service;
                                                eventData['description'] = description;
                                                addExternalEvent(eventData);
                                            }
                                    } else if (result.dismiss === 'close' || result.dismiss === 'esc' || result.dismiss === 'overlay') {
                                        //$("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                                        rebindCalenderWithEvents("deleteEvent");
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
                    if (result.value) {
                        var service = $.trim(result.value[0]), description = $.trim(result.value[1]);
                        if (eventData.resources !== '') {
                        }
                        if (eventData.title !== '') {
                            eventData['service'] = service;
                            eventData['description'] = description;
                            addExternalEvent(eventData);
                        }
                    } else if (result.dismiss === 'close' || result.dismiss === 'esc' || result.dismiss === 'overlay') {
                       // $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                        rebindCalenderWithEvents("deleteEvent");
                    }
                });
            }
            callCategory(eventData);
        }
        else {
            if (resourceValue !== '') {
            }
            if (eventData.title !== '') {
                addExternalEvent(eventData);
            }
        }
    };
    function GetCalendarDateRange() {
        var calendar = $('#timeline-resource-view div.calendar').fullCalendar('getCalendar');
        var view = calendar.view;
        var start = view.start._d;
        var end = view.end._d;
        var dates = { start: start, end: end };
        return dates;
    }
    
    var myOptions1 = {
        //defaultDate: '2017-12-07',
        scrollTime: '00:00', // undo default 6am scrollTime
        header: {
            left: 'myCustomButton prev,next today',
            center: 'title',
            right: 'timelineDay,timelineMonth'
        },
        customButtons: {
            myCustomButton: {
                text: "Export To Excel",
                click: function () {
                    alert('Export To Excel')
                    var resourceFormId = window["ySelected"];
                    var formId = $scopeVar.currentFormId;
                    var userId = $scopeVar.userDetail.Id;
                    var typeView = 0;
                    var current_subtab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').find('.ui-state-active').attr('class');
                    if (current_subtab.contains('fc-timelineMonth-button'))
                        typeView = 1;
                    else if (current_subtab.contains('fc-timelineYear-button'))
                        typeView = 2;
                    var dates = GetCalendarDateRange();
                    var currentDate = moment(dates.start).format("YYYY-MM-DD");
                    var newpath = $scopeVar.EndPointUrl + '/downloadCalenderExcel?formId=' + formId + '&resourceFormId=' + resourceFormId + '&userId=' + userId + '&typeView=' + typeView + '&currentDate=' + currentDate + '';
                    window.location.href = $scopeVar.EndPointUrl + '/downloadCalenderExcel?formId=' + formId + '&resourceFormId=' + resourceFormId + '&userId=' + userId + '&typeView=' + typeView + '&currentDate=' + currentDate + '';
                }
            }
        },
        defaultView: 'timelineMonth',
        views: {
            timelineThreeDays: {
                type: 'timeline',
                duration: { days: 3 }
            },
            timelineMonth: { buttonText: 'month' },
            timelineWeek: { buttonText: 'week' },
            timelineDay: { buttonText: 'day' },
        },

        resourceAreaWidth: '25%',
        dayMaxEventRows: true, // for all non-TimeGrid views
        views: {
            timeGrid: {
                dayMaxEventRows: 2 // adjust to 6 only for timeGridWeek/timeGridDay
            }
        },
        //events: [],
        events: function (start, end, timezone, callback) {

            var $scopeVar = angular.element($("#calendar")).scope();
            var param = {};
            param.action = 1;
            param.formId = $scopeVar.currentFormId;

            param.isCalender = 1;
            param.isEvent = 1;

            param.resourceFormId = $scopeVar.ySelection;
            param.ActivityFormId = $scopeVar.xSelection;
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            var view = $('#timeline-resource-view div.calendar').fullCalendar('getView');
            param.filter = {};
            param.filter = changeStateOfCalender(view, start, end);
            param.filter.field = "start";
            param.COMPANY_CODE = localStorage.getItem("COMPANY_CODE");
            param.CALENDAR_CODE = localStorage.getItem("CALENDAR_CODE");
      
            $.ajax({
                method: 'POST',
                url: BASE_URL + "/FormAPI/getReferralFormFields",
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(param),
                success: function (response) {
                    //$.unblockUI();
                    var calenderData = changeResourceIDByYSelection((response.events != undefined) ? response.events : response.events);
                    if (calenderData != undefined) {
                        if ($scopeVar.formDetailsDataInfo.searchByDate != undefined) {
                            $('#timeline-resource-view div.calendar').fullCalendar('removeEvents');
                        }
                        assignEvents(calenderData);
                        callback(calenderData);
                        window["eventListTemp"] = calenderData;
                        window["CalendarEventListTimeLine"] = calenderData;
                    }
                    else
                        callback([]);
                },
                beforeSend: function () {
                    //showLoader();
                },
                complete: function () {
                    var _ScrollOffset = window["scrollOffset"];
                    window.scrollTo(0, _ScrollOffset);
                    $.unblockUI();
                    // $("#" + current_tab + " div.calendar").unblock();
                }
            });
        },
        // resourceLabelText: "Client",

        resourceOrder: resourceOrder,
        resourceColumns: resColumns,
        resources: resourceData,
        height: 'auto', // will activate stickyHeaderDates automatically!
        allDaySlot: true,
        resourceRender: function (resourceObj, labelTds, bodyTds) {
            var cellText = '';
            for (i = 0; i < labelTds.length; i++) {
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
        selectable: true,
        select: function (startDate, endDate, jsEvent, view, resource) {          
      

            var $scopeVar = angular.element($("#calendar")).scope();
            $scopeVar.createEventDetails = {};
            $scopeVar.createEventDetails.description = "";
            $scopeVar.createEventDetails.formID = $scopeVar.currentFormId;            
            $scopeVar.createEventDetails.resourceFormId = $scopeVar.ySelection;
            $scopeVar.createEventDetails.resourceId = resource;
            $scopeVar.createEventDetails.startDate = startDate;
            $scopeVar.createEventDetails.endDate = endDate;
            $scopeVar.createEventDetails.jsEvent = jsEvent;
            $scopeVar.createEventDetails.view = view;
            $scopeVar.createEventDetails.ActivityFormId = $scopeVar.xSelection;
            $scopeVar.createEventDetails.start = customDate(startDate.format());
            $scopeVar.createEventDetails.end = customDate(endDate.format());
            $scopeVar.createEventDetails.customDate = DateWithDayName($scopeVar.createEventDetails, true);           
            $scopeVar.createEventDetails.customTime = TimeFormatCalender($scopeVar.createEventDetails, true);    
            $scopeVar.freshEntryformGroupKey = create_UUID();
          
            var listActivities = _.filter($scopeVar.xaxisFormList, function (item) { return item.activitiesForm != $scopeVar.ySelection; });
            $scopeVar.createEventDetails.dropdownList = [];
                _.each(listActivities, function (item, key) {
                    var tempDrop = {};                
                        tempDrop.formId = item.activitiesForm.toString();
                        tempDrop.Id = "0";
                        tempDrop.formTitle = item.title;
                        tempDrop.dropdownListData = item;
                        tempDrop.customClass = "true";                    
                    $scopeVar.createEventDetails.dropdownList.push(tempDrop);
                });
               

            $scopeVar.rootScopeSafe(); 
            setTimeout(function () {               
                createCustomEventDetailsModelPopUp.modal('show');
                createCustomEventDetailsModelPopUp.css({ "z-index": "9999" });

                _.each($scopeVar.totalSelectListTagify, function (item, key) {
                    var param = {};

                    // init Tagify script on the above inputs     
                    var input = document.getElementById('createnewtag-input' + item.name);


                    input.value = [];

                    if (input != null) {
                        var tempWhiteList = [];
                        var tempWh2 = [];
                        $scopeVar.createEventDetails[item.name] = {};

                        $scopeVar.createEventDetails[item.name].tagify = new Tagify(input, {
                            whitelist: tempWh2,
                            maxTags: 10,
                            dropdown: {
                                maxItems: 20,           // <- mixumum allowed rendered suggestions
                                classname: "tags-look", // <- custom classname for this dropdown, so it could be targeted
                                enabled: 0,             // <- show suggestions on focus
                                closeOnSelect: false    // <- do not hide the suggestions dropdown once an item has been selected
                            }
                        });
                    }
                });
                $(".serchselectChossen").chosen();
            }, 250);


            var monthsEvents = window["eventListTempAgenda"];
            if (monthsEvents.length > 0) {
                var lastMonthEvents = monthsEvents[monthsEvents.length - 1];
                $.each($scopeVar.createEventDetails.dropdownList, function (i, dropdwn) {
                    var idIndex = lastMonthEvents.customFormsSplit.findIndex(x => x == dropdwn.formId);
                    if (idIndex != -1) {
                        $scopeVar.createEventDetails.dropdownList[i].selectionDropdown = lastMonthEvents.customFormIdsSplit[idIndex];
                        $('[data-id="dropdwn_' + dropdwn.formId + '"]').val(lastMonthEvents.customFormIdsSplit[idIndex]);
                    }
                });

                if ($scopeVar.formDetailsDataInfo.otherformid && $scopeVar.formDetailsDataInfo.otherformid != 0) {
                    if (lastMonthEvents.customFourthTitle && lastMonthEvents.customFourthTitle != "") {
                        var splitTitle = lastMonthEvents.customFourthTitle.split(',');
                        splitTitle = splitTitle[0];
                        $("select#otherformDropDwn option").filter(function () {
                            //may want to use $.trim in here
                            if ($(this).text() == splitTitle) {
                                $scopeVar.otherformSelectionDropdown = $(this).attr("value");
                            }
                            return $(this).text() == splitTitle;
                        }).prop('selected', true);

                    } else {
                        $("select#otherformDropDwn").val('');
                    }
                } else {
                    $("select#otherformDropDwn").val('');
                }
            }

           // alert('selected ' + startDate.format() + ' to ' + endDate.format() + ' on resource ' + resource.id);
        }
    };
    countLoader = 0;
    calendarOptions = $.extend({}, defaultOptions, resourceOptions, myOptions1);
    
    $('#timeline-resource-view div.calendar').fullCalendar(calendarOptions);
   
    if ($scopeVar != undefined)
        if ($scopeVar.ySelection != 0) {
            if ($scopeVar.formDetailsDataInfo != null)
                if ($scopeVar.formDetailsDataInfo.calenderSettingsList != null)
                    if ($scopeVar.formDetailsDataInfo.calenderSettingsList.length > 0) {
                        var exists = _.findWhere($scopeVar.formDetailsDataInfo.calenderSettingsList, { resourceForm: $scopeVar.ySelection });
                        if (exists != undefined) {
                            if (exists.minTime != "" && exists.minTime != null && exists.minTime != undefined && exists.maxTime != null && exists.maxTime != undefined && exists.maxTime != "") {
                                var minTime = exists.minTime.trim().replace(' ', ':');
                                var maxTime = exists.maxTime.trim().replace(' ', ':');
                                if (Check_EXIST_FIXED_OPERATING_HOURS(calendarDetails)) {
                                    $('#timeline-resource-view div.calendar').fullCalendar('option', 'minTime', minTime + ":00");
                                    $('#timeline-resource-view div.calendar').fullCalendar('option', 'maxTime', maxTime + ":00");
                                }
                                
                            }
                        }
                    }
        }
    if ($scopeVar != undefined)
        if ($scopeVar.isFilterApply) {
            var uniqEvents = _.uniq(calenderData, "resourceId");
            var tempFormData = [];
            _.each(resourceData, function (item) {
                var exists = _.findWhere(uniqEvents, { resourceId: item.id });
                if (exists != undefined) {
                    tempFormData.push(item);
                }
            });
            resourceData = tempFormData;
        }
    /// vertical resource view.

    var myOptions2 = {
        //defaultDate: '2017-12-07',
        scrollTime: '00:00', // undo default 6am scrollTime    
        header: {
            left: 'myCustomButton prev,next today',
            center: 'title',
            right: 'agendaDay,agendaTwoDays,agendaThreeDays,agendaWeek'
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
            },
            agendaWeek: {
                type: 'agenda',
                duration: { days: 7 },
                groupByResource: true,
            }
        },
        dayMinWidth: 150, // will cause horizontal scrollbars      
        defaultView: 'agendaDay',
        //events: [],
        aspectRation: 1.35,
        events: function (start, end, timezone, callback) {
            var $scopeVar = angular.element($("#calendar")).scope();
            var param = {};
            param.action = 1;
            param.formId = $scopeVar.currentFormId;
            param.isCalender = 1;
            param.isEvent = 1;
            param.resourceFormId = $scopeVar.ySelection;
            param.ActivityFormId = $scopeVar.xSelection;
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            var view = $('#vertical-resource-view div.calendar').fullCalendar('getView');
            param.filter = {};
            param.filter = changeStateOfCalender(view, start, end);
            param.filter.field = "start";        
            param.COMPANY_CODE = localStorage.getItem("COMPANY_CODE");
            param.CALENDAR_CODE = localStorage.getItem("CALENDAR_CODE");
            $.ajax({
                method: 'POST',
                url: BASE_URL + "/FormAPI/getReferralFormFields",
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(param),
                success: function (response) {
                    //$.unblockUI();
                    var calenderData = changeResourceIDByYSelection((response.events != undefined) ? response.events : response.events);
                    if (calenderData != undefined) {     
                        if ($scopeVar.formDetailsDataInfo.searchByDate != undefined) {
                            $('#vertical-resource-view div.calendar').fullCalendar('removeEvents');
                        }
                        assignEvents(calenderData);
                        callback(calenderData);                    
                    }
                    else
                        callback([]);
                },
                beforeSend: function () {
                    //showLoader();
                },
                complete: function () {
                    var _ScrollOffset = window["scrollOffset"];
                    window.scrollTo(0, _ScrollOffset);
                    $.unblockUI();
                    // $("#" + current_tab + " div.calendar").unblock();
                }
            });
        },
        resources: resourceData,
        allDaySlot: true,
        selectable: true,
        select: function (startDate, endDate, jsEvent, view, resource) {


            var $scopeVar = angular.element($("#calendar")).scope();
            $scopeVar.createEventDetails = {};
            $scopeVar.createEventDetails.description = "";
            $scopeVar.createEventDetails.formID = $scopeVar.currentFormId;
            $scopeVar.createEventDetails.resourceFormId = $scopeVar.ySelection;
            $scopeVar.createEventDetails.resourceId = resource;
            $scopeVar.createEventDetails.startDate = startDate;
            $scopeVar.createEventDetails.endDate = endDate;
            $scopeVar.createEventDetails.jsEvent = jsEvent;
            $scopeVar.createEventDetails.view = view;
            $scopeVar.createEventDetails.ActivityFormId = $scopeVar.xSelection;
            $scopeVar.createEventDetails.start = customDate(startDate.format());
            $scopeVar.createEventDetails.end = customDate(endDate.format());
            $scopeVar.createEventDetails.customDate = DateWithDayName($scopeVar.createEventDetails, true);
            $scopeVar.createEventDetails.customTime = TimeFormatCalender($scopeVar.createEventDetails, true);
            $scopeVar.freshEntryformGroupKey = create_UUID();

            var listActivities = _.filter($scopeVar.xaxisFormList, function (item) { return item.activitiesForm != $scopeVar.ySelection; });
            $scopeVar.createEventDetails.dropdownList = [];
            _.each(listActivities, function (item, key) {
                var tempDrop = {};
                tempDrop.formId = item.activitiesForm.toString();
                tempDrop.Id = "0";
                tempDrop.formTitle = item.title;
                tempDrop.dropdownListData = item;
                tempDrop.customClass = "true";
                $scopeVar.createEventDetails.dropdownList.push(tempDrop);
            });
            

            $scopeVar.rootScopeSafe();
            setTimeout(function () {                
                createCustomEventDetailsModelPopUp.modal('show');
                createCustomEventDetailsModelPopUp.css({ "z-index": "9999" });

                _.each($scopeVar.totalSelectListTagify, function (item, key) {
                    var param = {};

                    // init Tagify script on the above inputs     
                    var input = document.getElementById('createnewtag-input' + item.name);


                    input.value = [];

                    if (input != null) {
                        var tempWhiteList = [];
                        var tempWh2 = [];
                        $scopeVar.createEventDetails[item.name] = {};

                        $scopeVar.createEventDetails[item.name].tagify = new Tagify(input, {
                            whitelist: tempWh2,
                            maxTags: 10,
                            dropdown: {
                                maxItems: 20,           // <- mixumum allowed rendered suggestions
                                classname: "tags-look", // <- custom classname for this dropdown, so it could be targeted
                                enabled: 0,             // <- show suggestions on focus
                                closeOnSelect: false    // <- do not hide the suggestions dropdown once an item has been selected
                            }
                        });
                    }
                });
                $(".serchselectChossen").chosen();
            }, 250);

            var monthsEvents = window["eventListTempAgenda"];
            if (monthsEvents.length > 0) {
                var lastMonthEvents = monthsEvents[monthsEvents.length - 1];
                $.each($scopeVar.createEventDetails.dropdownList, function (i, dropdwn) {
                    var idIndex = lastMonthEvents.customFormsSplit.findIndex(x => x == dropdwn.formId);
                    if (idIndex != -1) {
                        $scopeVar.createEventDetails.dropdownList[i].selectionDropdown = lastMonthEvents.customFormIdsSplit[idIndex];
                        $('[data-id="dropdwn_' + dropdwn.formId + '"]').val(lastMonthEvents.customFormIdsSplit[idIndex]);
                    }
                });

                //if ($scopeVar.formDetailsDataInfo.otherformid && $scopeVar.formDetailsDataInfo.otherformid != 0) {
                if (false) {
                    if (lastMonthEvents.customFourthTitle && lastMonthEvents.customFourthTitle != "") {
                        var splitTitle = lastMonthEvents.customFourthTitle.split(',');
                        splitTitle = splitTitle[0];
                        $("select#otherformDropDwn option").filter(function () {
                            //may want to use $.trim in here
                            if ($(this).text() == splitTitle) {
                                $scopeVar.otherformSelectionDropdown = $(this).attr("value");
                            }
                            return $(this).text() == splitTitle;


                        }).prop('selected', true);

                    } else {
                        $("select#otherformDropDwn").val('');
                    }
                } else {
                    $("select#otherformDropDwn").val('');
                }
            }

            // alert('selected ' + startDate.format() + ' to ' + endDate.format() + ' on resource ' + resource.id);
        }
    };
    if ($scopeVar.formDetailsDataInfo.calenderSettingsList?.length > 0) {
        var exists = _.findWhere($scopeVar.formDetailsDataInfo.calenderSettingsList, { resourceForm: $scopeVar.ySelection });
        if (exists != undefined) {
            if (exists.minTime != "" && exists.minTime != null && exists.minTime != undefined && exists.maxTime != null && exists.maxTime != undefined && exists.maxTime != "") {
                var minTime = exists.minTime.trim().replace(' ', ':');
                var maxTime = exists.maxTime.trim().replace(' ', ':');


                if (calendarDetails.controlSheet.DISPLAY_START_TIME != "" && calendarDetails.controlSheet.DISPLAY_START_TIME != "null" && calendarDetails.controlSheet.DISPLAY_START_TIME != null) {
                    minTime = calendarDetails.controlSheet.DISPLAY_START_TIME;
                }

                if (calendarDetails.controlSheet.DISPLAY_END_TIME != "" && calendarDetails.controlSheet.DISPLAY_END_TIME != "null" && calendarDetails.controlSheet.DISPLAY_END_TIME != null) {
                    maxTime = calendarDetails.controlSheet.DISPLAY_END_TIME;
                }

                if (Check_EXIST_FIXED_OPERATING_HOURS(calendarDetails)) {
                    myOptions2.minTime = minTime + ":00";
                    myOptions2.maxTime = maxTime + ":00";
                }
            }
        }
    }

    countLoader = 0;
    calendarOptions = $.extend({}, defaultOptions, resourceOptions, myOptions2);
    $('#vertical-resource-view div.calendar').fullCalendar(calendarOptions);
    setTimeout(function () {
        $.unblockUI();
    }, 500);
}

function loadCalendarWithOutEventFunction(calenderType, calenderData, resourceData, resColumns, activityFormData, activityColumn, activityEvents) {
    try {
        if (calenderData.length > 0)
            showLoader();
        else
            $.unblockUI();
    }
    catch (e) {
        $.unblockUI();
    }
    calenderData = changeResourceIDByYSelection((calenderData.data != undefined) ? calenderData.data : calenderData);
    window["eventListTemp"] = calenderData;
    var $scopeVar = angular.element($("#calendar")).scope();



    var basicDetails = window["EventBasicDetail"];

    var GroupingData = window["colGrouping"];
    var $scopeVar = angular.element($("#calendar")).scope();
    var formID = basicDetails.formData.formId;
    var resourceColumn = '';
    var activitiesForm = basicDetails.formData.activitiesForm;
    var majorGroup = "";
    var minorGroup = "";
    var dialog = "";
    if (typeof GroupingData !== "undefined") {
        majorGroup = GroupingData[0].majorGroup;
        if (majorGroup != undefined) {
            majorGroup = majorGroup.replace('[', '').trim();
            majorGroup = majorGroup.replace(']', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
        }
        minorGroup = GroupingData[0].minorGroup;
        resourceColumn = GroupingData[0].minorGroup;
        window["currResColumn"] = resourceColumn;
        window["currMajorColumn"] = GroupingData[0].activitiesCategory;
    }
    else {
        majorGroup = basicDetails.formData.majorGroup;
        if (majorGroup != undefined) {
            majorGroup = majorGroup.replace('[', '').trim();
            majorGroup = majorGroup.replace(']', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
        }
        minorGroup = basicDetails.formData.minorGroup;
        resourceColumn = basicDetails.formData.minorGroup;
        window["currResColumn"] = resourceColumn;
    }
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
    var userid = 0;
    if (localStorage.detail != undefined && localStorage.detail != "")
        userid = JSON.parse(localStorage.detail).Id;
    var activitiesCategory = basicDetails.formData.activitiesCategory;
    if (activitiesCategory == '' || activitiesCategory == null)
        activitiesCategory = '0';
    var overlapField = basicDetails.formData.overlapField; // value of activity radioButton field   (for overlap)
    var calendarOptions = '';
    var resourceOrder = majorGroup + ',' + minorGroup;
    // managing resource ordering  data .
    var _ColumnResults = [];
    var _orderedArr = resourceOrder.split(',');
    $.each(_orderedArr, function (index, value1) {
        $.each(resColumns, function (index, value2) {
            if (value2.field == value1)
                _ColumnResults.push(value2);
        });
    });
    resColumns = _ColumnResults;
    var tagify = "";




    var defaultOptions = {
        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
        theme: true,
        themeSystem: 'jquery-ui',
        //  themeSystem:'bootstrap4',
        nowIndicator: true,
        slotDuration: '00:15:00',
        // defaultTimedEventDuration: defaultDuration,
        //aspectRatio: 1.5,
        defaultDate: new Date(),
        eventMouseover: function (event, jsEvent, view) {
            if (view.name !== 'agendaDay') {
                ////console.log(event);
                $(jsEvent.target).attr('title', event.title);
            }
        },
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
            //  revertFunc();

            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            if (current_tab === "vertical-activities-view") {
                revertFunc();
                return;
            }


            //console.log('event is');
            //console.log(event);
            var isInternalDropParam = true;
            window["scrollOffset"] = $(window).scrollTop();
            var eventBasicData = window["EventBasicDetail"];
            var eventExtData = $(this).data('event');
            var resourceValue = '', title = '';
            var Id = 0;
            if (typeof event.Id === "undefined")
                Id = event.value;
            else
                Id = event.Id;
            title = event.title;
            var actFormId = event.formId;
            var resFormId = window["ySelected"];
            var activityFormId = window["xSelected"];
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
            var allDay = event.allDay;
            var formfieldDataListTempData = [];
            //console.log(eventExtData);

            var $scope = angular.element($("#calendar")).scope();

            ////console.log(event);
            //alert(event.title + " end is now " + event.end.format());
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            if (!confirm("Are you sure about this change?")) {
                revertFunc();
            } else {
                if (event.resourceId) {
                    var resource = $("#" + current_tab + " .calendar").fullCalendar('getResourceById', event.resourceId);
                    var activity = $("#vertical - activities - view" + " .calendar").fullCalendar('getResourceById', event.activities);
                    var titleModifiedPart = ""; var majorGroupSplits = [];
                    if (resource && typeof resource[resourceColumn] != 'undefined') {
                        resourceValue = resource[resourceColumn];
                        titleModifiedPart = resourceValue;
                        if (typeof majorGroup !== undefined)
                            majorGroupSplits = majorGroup.split(',');
                        if (majorGroupSplits.length > 0) {
                            _.each(majorGroupSplits, function (value, pos) {
                                if (value != "") {
                                    if (titleModifiedPart !== "")
                                        titleModifiedPart += "-" + resource[value].toString();
                                    else
                                        titleModifiedPart = resource[value].toString();
                                }
                            });
                        }
                        var _currResFormId = window["ySelected"];
                        var _seperatedTitles = event.customTitle;
                        var _seperatedFormIDs = event.customForms;
                        var _seperatedIds = event.customFormIds;

                        //var _seperatedResFormIDs = event.seperatedResFormIDs;
                        //var _seperatedResEntryIDs = event.seperatedResEntryIDs;
                        //var _seperatedResColValues = event.seperatedResColValues;


                        if (typeof _seperatedTitles !== undefined)
                            _seperatedTitles = _seperatedTitles.split(',');
                        if (typeof _seperatedFormIDs !== undefined)
                            _seperatedFormIDs = _seperatedFormIDs.split(',');
                        if (typeof _seperatedIds !== undefined)
                            _seperatedIds = _seperatedIds.split(',');
                        //if (typeof _seperatedResFormIDs !== undefined)
                        //    _seperatedResFormIDs = _seperatedResFormIDs.split(',');
                        //if (typeof _seperatedResEntryIDs !== undefined)
                        //    _seperatedResEntryIDs = _seperatedResEntryIDs.split(',');
                        //if (typeof _seperatedResColValues !== undefined)
                        //    _seperatedResColValues = _seperatedResColValues.split(',');




                        _.each(_seperatedFormIDs, function (value, key) {
                            if (value.trim() === _currResFormId.toString().trim()) {
                                _seperatedTitles[key] = titleModifiedPart;
                                _seperatedIds[key] = event.resourceId;
                            }
                        });
                        //_.each(_seperatedResFormIDs, function (value, key) {
                        //    if (value === _currResFormId.toString()) {
                        //        _seperatedResEntryIDs[key] = event.resourceId;
                        //        _seperatedResColValues[key] = resourceValue;
                        //    }
                        //});

                        var _newseperatedTitles = ""; var _newseperatedIds = ""; var _newseperatedResEntryIDs = ""; var _newseperatedResColValues = "";
                        _.each(_seperatedFormIDs, function (value, key) {
                            if (_newseperatedTitles === "")
                                _newseperatedTitles = _seperatedTitles[key].toString();
                            else
                                _newseperatedTitles += " , " + _seperatedTitles[key].toString();


                            if (_newseperatedIds === "")
                                _newseperatedIds = _seperatedIds[key].toString();
                            else
                                _newseperatedIds += " , " + _seperatedIds[key].toString();

                            //if (_newseperatedResEntryIDs === "")
                            //    _newseperatedResEntryIDs = _seperatedResEntryIDs[key].toString();
                            //else
                            //    _newseperatedResEntryIDs += " , " + _seperatedResEntryIDs[key].toString();


                            //if (_newseperatedResColValues === "")
                            //    _newseperatedResColValues = _seperatedResColValues[key].toString();
                            //else
                            //    _newseperatedResColValues += " , " + _seperatedResColValues[key].toString();

                        });




                        var activityValue = activity[activityField];
                        //if (event.activities != 'undefined')
                        //   // title = event.activities + ' in ' + resourceValue;
                        //else
                        //   // title = ' in ' + resourceValue;
                    }
                }
                var indx = _.findIndex(event.customFormsSplit, function (formIdString) { return formIdString.toString().trim() == $scope.xSelection.toString() });
                if (indx != -1) {
                    activities = event.customFormIdsSplit[indx].toString().trim();
                }
                formfieldDataListTempData = [
                    { "name": "Id", "value": parseInt(Id) },
                    { "name": "title", "value": title },
                    { "name": "start", "value": start },
                    { "name": "end", "value": end },
                    { "name": "allDay", "value": allDay },
                    { "name": "activities", "value": activities },
                    { "name": "resources", "value": resourceId },
                ];

                $.ajax({
                    method: 'POST',
                    url: BASE_URL+"FormAPI/EditEventData",
                    dataType: 'json',
                    contentType: "application/json",
                    data: "{'action':2,'resourceFormId':" + resFormId + ",'ActivityFormId':" + activityFormId + ",'userid':" + eventBasicData.userId + ",'Id':" + parseInt(Id) + ", 'formId':" + eventBasicData.formId + ",'topicId':" + eventBasicData.formData.topicId + ",'created_by':" + eventBasicData.created_by + ",'updated_by':" + eventBasicData.update_by + ",'formfieldDataListTemp':'" + JSON.stringify(formfieldDataListTempData) + "' ,'isInternalDrop':" + isInternalDropParam + ",startDate:'" + start + "','endDate':'" + end + "','eventOverlap': '','activitiesOverlap':" + activitiesOverlap + "}", //$.param(formData)
                    success: function (response) {
                        if (response.res > 0) {
                            //else if (response.res > 0 && param.action == 2) {
                            try {
                                var CalendarEventList = window["CalendarEventList"];
                                var ActivityEventList = window["ActivityEventList"];
                                var oneToManyList = eventBasicData.formData.FormDataToOneListDynamic;

                                var CalenderEditableRow = $.grep(CalendarEventList, function (e) {
                                    return e.Id == event.Id;
                                });
                                var ActivityEditableRow = $.grep(ActivityEventList, function (e) {
                                    return e.Id == event.Id;
                                });
                                var oneToManyListEditableRow = $.grep(oneToManyList, function (e) {
                                    return e.Id == event.Id;
                                });

                                CalenderEditableRow[0].start = start;
                                CalenderEditableRow[0].end = end;
                                CalenderEditableRow[0].seperatedTitles = _newseperatedTitles;
                                CalenderEditableRow[0].seperatedIds = _newseperatedIds;
                                CalenderEditableRow[0].seperatedResColValues = _newseperatedResColValues;
                                CalenderEditableRow[0].seperatedResEntryIDs = _newseperatedResEntryIDs;




                                ActivityEditableRow[0].start = start;
                                ActivityEditableRow[0].end = end;
                                ActivityEditableRow[0].seperatedTitles = _newseperatedTitles;
                                ActivityEditableRow[0].seperatedIds = _newseperatedIds;
                                ActivityEditableRow[0].seperatedResColValues = _newseperatedResColValues;
                                ActivityEditableRow[0].seperatedResEntryIDs = _newseperatedResEntryIDs;

                                oneToManyListEditableRow[0].start = start;
                                oneToManyListEditableRow[0].end = end;
                                oneToManyListEditableRow[0].seperatedTitles = _newseperatedTitles;
                                oneToManyListEditableRow[0].seperatedIds = _newseperatedIds;
                                oneToManyListEditableRow[0].seperatedResColValues = _newseperatedResColValues;
                                oneToManyListEditableRow[0].seperatedResEntryIDs = _newseperatedResEntryIDs;
                                //var  filteredItems = CalendarEventList.filter((item) => item.Id !== response.Id);

                                //console.log('ffffff');
                                //console.log(CalenderEditableRow);

                                var filteredEventsCalender = $.grep(CalendarEventList, function (e) {
                                    return e.Id != event.Id;
                                });
                                var filteredEventsActivity = $.grep(ActivityEventList, function (e) {
                                    return e.Id != event.Id;
                                });
                                var filteredoneToManyList = $.grep(oneToManyList, function (e) {
                                    return e.Id != event.Id;
                                });
                                filteredEventsCalender.push(CalenderEditableRow[0]);
                                filteredEventsActivity.push(ActivityEditableRow[0]);
                                filteredoneToManyList.push(oneToManyListEditableRow[0]);
                                eventBasicData.formData.FormDataToOneListDynamic = filteredoneToManyList;



                                _.each(filteredEventsCalender, function (dataRow, position) {

                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;

                                    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;


                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    _.each(commaVals, function (idVal, pos) {
                                        //console.log(commaVals + "," + commaIDs[pos].toString())
                                        if (idVal == ySelected.toString()) {
                                            dataRow.resFormID = idVal;
                                            dataRow.resources = commaIDs[pos];
                                            dataRow.resourceId = commaIDs[pos];
                                            dataRow.title = "";
                                        }

                                    })



                                });

                                _.each(filteredEventsActivity, function (dataRow, position) {

                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;
                                    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;
                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    _.each(commaVals, function (idVal, pos) {
                                        //console.log(commaVals + "," + commaIDs[pos].toString())
                                        if (idVal == ySelected.toString()) {
                                            dataRow.resFormID = idVal;
                                            dataRow.resources = commaIDs[pos];
                                            dataRow.resourceId = commaIDs[pos];
                                            dataRow.title = "";
                                        }

                                    })



                                });

                                _.each(filteredoneToManyList, function (dataRow, position) {

                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;

                                    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;


                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    _.each(commaVals, function (idVal, pos) {
                                        //console.log(commaVals + "," + commaIDs[pos].toString())
                                        if (idVal == ySelected.toString()) {
                                            dataRow.resFormID = idVal;
                                            dataRow.resources = commaIDs[pos];
                                            dataRow.resourceId = commaIDs[pos];
                                            dataRow.title = "";
                                        }

                                    })



                                });


                                window["CalendarEventList"] = angular.copy(filteredEventsCalender);
                                window["ActivityEventList"] = filteredEventsActivity;
                                console.log('hi3')
                                //$('.calendar').fullCalendar('destroy');
                                //loadCalendar('BasicView', filteredEventsCalender, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, filteredEventsActivity);
                                refreshEventResourcesActivity('BasicView', filteredEventsCalender, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, filteredEventsActivity);
                                //$('#timeline-resource-view div.calendar').fullCalendar('refetchEvents');


                                //eventBasicData.formGroupKey = create_UUID();
                                window["EventBasicDetail"] = eventBasicData;
                                $.jGrowl(response.Message, { position: 'center' });
                                // $scope.bindDraggable();
                            }
                            catch (e) {
                                //console.log(e);
                                $.jGrowl(response.Message, { position: 'center' });

                                var _ScrollOffset = window["scrollOffset"];
                                window.scrollTo(0, _ScrollOffset);
                                $.unblockUI();
                            }

                        } else {
                            revertFunc();
                            if (response.res == -1) {
                                swal({ type: 'error', title: '', text: response.Message });

                            } else {
                                swal({ type: 'error', title: '', text: response.overlapMessage });
                            }


                        }

                    },

                    beforeSend: function () {
                        showLoader();
                    },

                    complete: function () {

                        var _ScrollOffset = window["scrollOffset"];
                        window.scrollTo(0, _ScrollOffset);
                        $.unblockUI();
                        // $("#" + current_tab + " div.calendar").unblock();
                    }
                });



            }

        },
        //  resize event's duration inside calendar view
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
            window["scrollOffset"] = $(window).scrollTop();
            var resourceId = (event.resourceId) ? event.resourceId : '';
            var resources = (event.resources) ? event.resources : '';
            var activities = (event.activities) ? event.activities : '';
            var allDay = event.allDay;
            var formfieldDataListTempData = [];
            var activityName = '';
            var resFormId = window["ySelected"];
            var activityFormId = window["xSelected"];
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
                    url: BASE_URL + "FormAPI/EditEventData",
                    dataType: 'json',
                    contentType: "application/json",
                    data: "{'action':2,'resourceFormId':" + resFormId + ",'ActivityFormId':" + activityFormId + ",'userid':" + eventBasicData.userId + ",'Id':" + parseInt(Id) + ", 'formId':" + eventBasicData.formId + ",'topicId':" + eventBasicData.formData.topicId + ",'created_by':" + eventBasicData.created_by + ",'updated_by':" + eventBasicData.update_by + ",'formfieldDataListTemp':'" + JSON.stringify(formfieldDataListTempData) + "' ,'isResizedEvent':" + parseInt(isResizedEvent) + ",startDate:'" + start + "','endDate':'" + end + "','eventOverlap':" + eventOverlap + ",'activitiesOverlap':" + activitiesOverlap + "}", //$.param(formData)
                    success: function (response) {
                        if (response.res > 0) {

                            try {
                                var CalendarEventList = window["CalendarEventList"];
                                var ActivityEventList = window["ActivityEventList"];
                                var oneToManyList = eventBasicData.formData.FormDataToOneListDynamic;
                                var CalenderEditableRow = $.grep(CalendarEventList, function (e) {
                                    return e.Id == event.Id;
                                });
                                var ActivityEditableRow = $.grep(ActivityEventList, function (e) {
                                    return e.Id == event.Id;
                                });
                                var oneToManyListEditableRow = $.grep(oneToManyList, function (e) {
                                    return e.Id == event.Id;
                                });
                                CalenderEditableRow[0].start = start;
                                CalenderEditableRow[0].end = end;
                                ActivityEditableRow[0].start = start;
                                ActivityEditableRow[0].end = end;
                                oneToManyListEditableRow[0].start = start;
                                oneToManyListEditableRow[0].end = end;
                                var filteredEventsCalender = $.grep(CalendarEventList, function (e) {
                                    return e.Id != event.Id;
                                });
                                var filteredEventsActivity = $.grep(ActivityEventList, function (e) {
                                    return e.Id != event.Id;
                                });
                                var filteredoneToManyList = $.grep(oneToManyList, function (e) {
                                    return e.Id != event.value;
                                });
                                filteredEventsCalender.push(CalenderEditableRow[0]);
                                filteredEventsActivity.push(ActivityEditableRow[0]);
                                filteredoneToManyList.push(oneToManyListEditableRow[0]);
                                eventBasicData.formData.FormDataToOneListDynamic = filteredoneToManyList;
                                _.each(filteredEventsCalender, function (dataRow, position) {

                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;

                                    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;


                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    _.each(commaVals, function (idVal, pos) {
                                        //console.log(commaVals + "," + commaIDs[pos].toString())
                                        if (idVal == ySelected.toString()) {
                                            dataRow.resFormID = idVal;
                                            dataRow.resources = commaIDs[pos];
                                            dataRow.resourceId = commaIDs[pos];
                                            dataRow.title = "";
                                        }

                                    })



                                });
                                _.each(filteredEventsActivity, function (dataRow, position) {

                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;
                                    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;
                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    _.each(commaVals, function (idVal, pos) {
                                        //console.log(commaVals + "," + commaIDs[pos].toString())
                                        if (idVal == ySelected.toString()) {
                                            dataRow.resFormID = idVal;
                                            dataRow.resources = commaIDs[pos];
                                            dataRow.resourceId = commaIDs[pos];
                                            dataRow.title = "";
                                        }

                                    })



                                });
                                _.each(filteredoneToManyList, function (dataRow, position) {

                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;

                                    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;


                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    _.each(commaVals, function (idVal, pos) {
                                        //console.log(commaVals + "," + commaIDs[pos].toString())
                                        if (idVal == ySelected.toString()) {
                                            dataRow.resFormID = idVal;
                                            dataRow.resources = commaIDs[pos];
                                            dataRow.resourceId = commaIDs[pos];
                                            dataRow.title = "";
                                        }

                                    })



                                });
                                window["CalendarEventList"] = filteredEventsCalender;
                                window["ActivityEventList"] = filteredEventsActivity;
                                refreshEventResourcesActivity('BasicView', filteredEventsCalender, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, filteredEventsActivity);
                                window["EventBasicDetail"] = eventBasicData;
                                $.jGrowl(response.Message, { position: 'center' });
                            }
                            catch (e) {
                                $.jGrowl(response.Message, { position: 'center' });
                                var _ScrollOffset = window["scrollOffset"];
                                window.scrollTo(0, _ScrollOffset);
                                $.unblockUI();
                            }
                        } else {
                            revertFunc();
                            if (response.res == -1) {
                                swal({ type: 'error', title: '', text: response.Message });

                            } else {
                                swal({ type: 'error', title: '', text: response.overlapMessage });
                            }
                        }
                    },
                    beforeSend: function () {
                        showLoader();
                    },
                    complete: function () {
                        var _ScrollOffset = window["scrollOffset"];
                        window.scrollTo(0, _ScrollOffset);
                        $.unblockUI();
                    }
                });
            }
        },
        eventRender: function (event, element) {

            if (countLoader == 0) {
                showLoader();
                countLoader++;
            }
            var $scope = angular.element($("#calendar")).scope();
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            var current_subtab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').find('.ui-state-active').attr('class');
            if (current_tab == "agenda-view") {
                // $scope.$parent.$parent.IND_loading = true;
                //if ($scope.counterLoader == undefined)
                //showLoader();
                $scope.counterLoader = 1;
            }
            var rowTooltipDisplay = "";
            var rowTooltipTitleDisplay = "";
            var rowRecord = "";
            var _associatedTitles = event.customTitle;
            var _associatedFormIDs = event.customForms;
            var _allSelectables = $scope.xaxisFormList; // x options has all selectable options .
            var _ySelected = window["ySelected"]; // get y selected option.
            var _xSelected = window["xSelected"];
            var _lablesToShow = []; var _colorToShow = [];
            var _tempTitle = "";
            var _tempTitleSecond = "";
            var _mainTempHtml = "";
            var eventData = {
                Id: event.Id,
                Images: event.files,
                title: "Text",
                start: event.start != null && event.start != undefined && event.start != '' ? customDate(event.start.format()) : '',
                end: event.end != null && event.end != undefined && event.end != '' ? customDate(event.end.format()) : '',
                allDay: event.allDay,
                service: event.service,
                description: event.description,
                resources: event.resources,
                activities: event.activities,
                activityName: event.activityName,
                formGroupKey: event.formGroupKey
            };
            eventData.title = _tempTitle;
            eventData.Images = event.files;



            if (typeof _associatedTitles !== "undefined" && _associatedTitles !== null && _associatedTitles !== "") {
                var _arrTitles = _associatedTitles.split(',');
                var _arrColor = [];
                var _arrFormIDs = _associatedFormIDs.split(",");

                ////getting index of x selected form  from  associated formIDs arr
                //var _xPos = _arrFormIDs.indexOf(_xSelected.toString());
                ////swapping position of x occurance  with 0 index;
                //if (_xPos !== undefined && _xPos !== null && _xPos !== -1) {
                //    var _temp = "";
                //    //for titles
                //    _temp = _arrTitles[0];
                //    _arrTitles[0] = _arrTitles[_xPos];
                //    _arrTitles[_xPos] = _temp;
                //    //for color
                //    if (_arrColor.length > 0) {
                //        _temp = _arrColor[0];
                //        _arrColor[0] = _arrColor[_xPos];
                //        _arrColor[_xPos] = _temp;
                //    }
                //    //for formIDs
                //    _temp = _arrFormIDs[0];
                //    _arrFormIDs[0] = _arrFormIDs[_xPos];
                //    _arrFormIDs[_xPos] = _temp;
                //}
                //var eventTemp = angular.copy(event);
                if (!eventData.allDay) {
                    eventData.start = eventData.start != null && eventData.start != undefined && eventData.start != '' ? eventData.start : '';
                    if (eventData.end != "" && eventData.end != null) {
                        eventData.end = eventData.end != null && eventData.end != undefined && eventData.end != '' ? eventData.end : '';
                        rowTooltipDisplay += DateWithDayName(eventData, true) + " <br/> "
                        rowTooltipDisplay += TimeFormatCalender(eventData, true) + " "
                    } else {
                        rowTooltipDisplay += moment(eventData.start).format("YYYY-MM-DD") + " "
                    }
                }
                else {
                    rowTooltipDisplay += moment(eventData.start).format("YYYY-MM-DD") + " "
                }
                //element.find('.fc-content').remove();
                //if (eventData.description != "" && eventData.description != null) {
                //    _tempTitle += "<label class='pr-2'>" + eventData.description + "</label>";
                //}
                var tempHtml = "";

                if (eventData.title != null && eventData.title.length > 0)
                    rowRecord += "<div class='title " + _tempTitleSecond + "'>" + eventData.title + "</div>";
                if (!eventData.allDay) {
                    if (eventData.start != null && eventData.start.length > 0)
                        rowRecord += "<div class='" + eventData.start + "'>" + DateWithDayName(eventData, true) + "</div>";
                    rowRecord += "<div>" + TimeFormatCalender(eventData, true) + "</div>";
                    if (current_tab == "list-view") {
                        var _associatedFormIDsTemp = _associatedFormIDs.split(",");
                        var _associatedTitlestemp = _associatedTitles.split(",").map(function (item) {
                            return item.trim();
                        });
                        var _associatedCustomFormIdsTemp = event.customFormIds.split(",");
                        var exists = _.findIndex(_associatedFormIDsTemp, function (item) { return item == $scope.ySelection.toString() });
                        var lblColor = undefined;
                        var customLocationTitle = "";
                        if (exists >= 0) {
                            customLocationTitle = _associatedTitlestemp[exists];
                            var tempColor = "";
                            var colorExists = _.findWhere($scopeVar.xaxisFormList, { resourceActivityForm: $scope.ySelection });
                            var currentId = _associatedCustomFormIdsTemp[exists].toString();
                            if (colorExists != undefined) {
                                var colorRow = _.findWhere(colorExists.formDataList, { id: currentId });
                                if (colorRow != undefined) {
                                    tempColor = colorRow[colorExists.colorField];
                                }
                            }
                            lblColor = tempColor;
                        }
                        if (customLocationTitle != "" && customLocationTitle != null && customLocationTitle != undefined) {
                            var tempHtml = "<div class='fc-content' id='customLocationTitle' style = 'background:" + (lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor) + ";borderRadius: 3;'><span class='fc-title' title='' > " + customLocationTitle + "</span></div> ";
                            _mainTempHtml += tempHtml;
                        }
                        //var tempHtml = "";
                        tempHtml = "<div class='fc-content fcTime' id='" + event.Id + "_Time'><small class='time' title=''>" + TimeFormatCalender(eventData, true) + "</small></div>" + _mainTempHtml;
                        // element.prepend(tempHtml);

                        _mainTempHtml = tempHtml;

                    } else {
                        if (current_subtab != undefined) {
                            if ((current_tab == "agenda-view" || current_tab == "timeline-resource-view") && (current_subtab.contains("fc-month-button") || current_subtab.contains("fc-timelineYear-button") || current_subtab.contains("fc-timelineMonth-button"))) {
                                var tempHtml = "";
                                tempHtml = "<div class='fc-content'><span class='text-dark small' title=''>" + TimeFormatCalender(eventData, true) + "</span></div>" + tempHtml;
                                _mainTempHtml += tempHtml;
                            }
                        }

                    }
                }
                else {
                    if (current_tab == "list-view") {
                        var _associatedFormIDsTemp = _associatedFormIDs.split(",");
                        var _associatedTitlestemp = _associatedTitles.split(",").map(function (item) {
                            return item.trim();
                        });
                        var _associatedCustomFormIdsTemp = event.customFormIds.split(",");
                        var exists = _.findIndex(_associatedFormIDsTemp, function (item) { return item == $scope.ySelection.toString() });
                        var lblColor = undefined;
                        var customLocationTitle = "";
                        if (exists >= 0) {
                            customLocationTitle = _associatedTitlestemp[exists];
                            var tempColor = "";
                            var colorExists = _.findWhere($scopeVar.xaxisFormList, { resourceActivityForm: $scope.ySelection });
                            var currentId = _associatedCustomFormIdsTemp[exists].toString();
                            if (colorExists != undefined) {
                                var colorRow = _.findWhere(colorExists.formDataList, { id: currentId });
                                if (colorRow != undefined) {
                                    tempColor = colorRow[colorExists.colorField];
                                }
                            }
                            lblColor = tempColor;
                        }
                        if (customLocationTitle != "" && customLocationTitle != null && customLocationTitle != undefined) {
                            var tempHtml = "<div class='fc-content' id='dd' style = 'background:" + (lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor) + ";borderRadius: 3;'><span class='fc-title' title='' > " + customLocationTitle + "</span></div > ";
                            _mainTempHtml += tempHtml;
                        }
                    }
                    rowRecord += "<div class='" + moment(eventData.start).format("YYYY-MM-DD") + "'>" + moment(eventData.start).format("MMMM D, YYYY (dddd)") + "</div>";
                }



                //var newLabelList = _.filter(_associatedFormIDsTemp, function (item) { return item != $scope.ySelection.toString() });
                listids = event.customFormIds.split(',');
                var currentId = 0;
                tempHtml = "";
                _.each(_arrFormIDs, function (dataRow, position) {
                    if (dataRow !== _ySelected.toString()) {
                        var lblColor = "";
                        _lablesToShow.push(dataRow.toString());
                        var _arrRowData = _arrTitles[position];
                        currentId = listids[position].toString().trim();
                        var tempColor = "";
                        var colorExists = _.findWhere($scopeVar.xaxisFormList, { resourceActivityForm: parseInt(dataRow.toString().trim()) });
                        if (colorExists != undefined) {
                            var colorRow = _.findWhere(colorExists.formDataList, { id: currentId.toString() });
                            if (colorRow != undefined) {
                                tempColor = colorRow[colorExists.colorField];
                            }
                            lblColor = tempColor;
                        }
                        _arrRowData = _arrRowData.split('-');
                        var slipTitle = "";
                        if (_arrRowData.length == 1)
                            slipTitle = _arrRowData[0];
                        else if (_arrRowData.length > 1)
                            slipTitle = _arrRowData[0] + " - " + _arrRowData[1];
                        rowTooltipTitleDisplay += slipTitle + " <br/> ";
                        tempHtml += "<div class='fc-content' id='" + event.Id + "_" + position + "_" + currentId + "' style='background:" + (lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor) + ";borderRadius: 3;'><span class='fc-title'>" + slipTitle + "</span></div>"
                    }
                });


                //_.each(_arrTitles, function (_arrRowData, position) {
                //    _tempTitle += "<div class='temp'>";
                //    var _isAllowToRender = false;
                //    var TitleFormId = _arrFormIDs[position];
                //    var lblColor = "";
                //    if (TitleFormId != undefined) {
                //        //_.each(_lablesToShow, function (dataRow2, position2) {
                //        //    if (TitleFormId.toString().trim() === dataRow2)
                //        //        _isAllowToRender = true;
                //        //});
                //        var checkExists = _.filter(_lablesToShow, function (dataRow2) { return TitleFormId.toString().trim() === dataRow2; });
                //        if (checkExists.length > 0)
                //            _isAllowToRender = true;
                //    }
                //    var count = 0;
                //    var currentId = 0;
                //    var list = [];
                //    list = event.customForms.split(',');
                //    var listids = [];
                //    var listDrop = "";
                //    var listDropdownTemp = {};
                //    //if (TitleFormId != undefined)
                //    //    if (TitleFormId.toString().trim() != "") {
                //    //        listDropdownTemp = _.findWhere($scopeVar.yaxisFormListCopy, { resourceActivityForm: parseInt(TitleFormId.toString().trim()) });
                //    //        if (listDropdownTemp != undefined) {
                //    //            listDrop = "<div class='d-none popoverSelect'>";
                //    //            listDrop+="<select class='form-control form-control-sm w-50' onchange =\"changeDimension(\'" + TitleFormId.toString().trim() + "\',\'" + event.formGroupKey.toString() + "\',\'" + event.Id.toString() + "\',this);\" >"
                //    //            var col1 = ""
                //    //            var col2 = ""
                //    //            col2 = listDropdownTemp.minorGroup;
                //    //            if (listDropdownTemp.majorGroup == "[]") {
                //    //                col1 = "blank";
                //    //            } else {
                //    //                if (listDropdownTemp.majorGroup.contains('[')) {
                //    //                    col1 = JSON.parse(listDropdownTemp.majorGroup)[0];
                //    //                }
                //    //            }
                //    //            if (event.customForms != "") {
                //    //                list = event.customForms.split(',');
                //    //                for (var i = 0; i < list.length; i++) {
                //    //                    if (list[i].toString().trim() == listDropdownTemp.resourceActivityForm.toString()) {
                //    //                        count = i;
                //    //                        break;
                //    //                    }
                //    //                }
                //    //                listids = event.customFormIds.split(',');
                //    //                currentId = listids[count].toString().trim();
                //    //            }
                //    //            _.each(listDropdownTemp.formDataList, function (item) {
                //    //                var text = "";
                //    //                if (item[col1] != undefined && item[col2] != undefined) {
                //    //                    text = item[col1] + " - " + item[col2];
                //    //                }
                //    //                else if (item[col1] == undefined) {
                //    //                    text += item[col2];
                //    //                }
                //    //                var cId = (item.Id != undefined ? item.Id : item.id);
                //    //                if (currentId.toString() == cId) {
                //    //                    var tempColor = "";
                //    //                    var colorExists = _.findWhere($scopeVar.xaxisFormList, { resourceActivityForm: parseInt(TitleFormId.toString().trim()) });
                //    //                    if (colorExists != undefined) {
                //    //                        var colorRow = _.findWhere(colorExists.formDataList, { id: currentId.toString() });
                //    //                        if (colorRow != undefined) {
                //    //                            tempColor = colorRow[colorExists.colorField];
                //    //                        }
                //    //                    }
                //    //                    lblColor = tempColor;
                //    //                    listDrop += "<option selected value='" + cId + "'>" + text + "</option>";
                //    //                } else {
                //    //                    listDrop += "<option value='" + cId + "'>" + text + "</option>";
                //    //                }
                //    //            });
                //    //            listDrop += "</select><i class='fa fa-times closeSelect cursor-pointer ml-2 fa-sm'></i></div>"
                //    //        }
                //    //    }
                //    if (_arrRowData != undefined) {
                //        _arrRowData = _arrRowData.split('-');
                //        //label render.
                //        if (_isAllowToRender) {
                //            if (_tempTitle === "") {
                //                if (_arrRowData.length > 1)
                //                    _tempTitle = "<span class='titleContainer'><span class='title1'> " + _arrRowData[1].toString() + " - " + _arrRowData[0].toString() + "</span><i class='fa fa-pencil editTitle ml-2 cursor-pointer fa-sm'></i><i class='fa fa-trash deleteTitle ml-2 cursor-pointer fa-sm' onclick=\"deleteDimension(\'" + currentId + "\',\'" + list[count] + "\',\'" + event.formGroupKey + "\',this);\"></i></span>";
                //                else
                //                    _tempTitle = "<span class='titleContainer'><span class='title1'>  " + _arrRowData[0].toString() + "</span><i class='fa fa-pencil editTitle ml-2 cursor-pointer fa-sm'></i> <i class='fa fa-trash deleteTitle ml-2 cursor-pointer fa-sm' onclick=\"deleteDimension(\'" + currentId + "\',\'" + list[count] + "\',\'" + event.formGroupKey + "\',this);\"></i></span>";
                //                _tempTitleSecond = _arrRowData[0].toString();
                //                _tempTitle += listDrop;
                //            }
                //            else {
                //                if (_arrRowData.length > 1)
                //                    _tempTitle += "<span class='titleContainer'><span class='title1'> " + _arrRowData[1].toString() + " - " + _arrRowData[0].toString() + "</span><i class='fa fa-pencil editTitle ml-2 cursor-pointer fa-sm'></i><i class='fa fa-trash deleteTitle ml-2 cursor-pointer fa-sm' onclick=\"deleteDimension(\'" + currentId + "\',\'" + list[count] + "\',\'" + event.formGroupKey + "\',this);\"></i></span>";
                //                else
                //                    _tempTitle += "<span class='titleContainer'><span class='title1'> " + _arrRowData[0].toString() + "</span><i class='fa fa-pencil editTitle ml-2 cursor-pointer fa-sm'></i><i class='fa fa-trash deleteTitle ml-2 cursor-pointer fa-sm' onclick=\"deleteDimension(\'" + currentId + "\',\'" + list[count] + "\',\'" + event.formGroupKey + "\',this);\"></i></span>";
                //                _tempTitleSecond += _arrRowData[0].toString();
                //                _tempTitle += listDrop;
                //            }
                //            var slipTitle = "";
                //            if (_arrRowData.length == 1)
                //                slipTitle = _arrRowData[0];
                //            else if (_arrRowData.length > 1)
                //                slipTitle = _arrRowData[0] + " - " + _arrRowData[1];
                //            rowTooltipTitleDisplay += slipTitle + " <br/> ";

                //            //element.append(
                //            //    $('<div>', {
                //            //        class: 'fc-content', "
                //            //    }).append(
                //            //        $('<span>', { class: 'fc-title', "title": "" }).text(slipTitle)
                //            //    ).css({
                //            //        background: lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor,
                //            //        //width: "200px",
                //            //        borderRadius: 3,
                //            //    })

                //            //);
                //            tempHtml += "<div class='fc-content' id='" + event.Id + "_" + list[count].trim() + "_" + currentId + "'><span class='fc-title' style='background:" + (lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor) + ";borderRadius: 3;'>" + slipTitle + "</span></div>"


                //        }
                //    }

                //    _tempTitle += "</div>";
                //});
                //element.append(tempHtml);
                _mainTempHtml += tempHtml;


            }





            if ($scope.formDetailsDataInfo.otherFormIsShow != null && $scope.formDetailsDataInfo.otherFormIsShow == true) {
                if (event.customFourthTitle != null && event.customFourthTitle != "") {
                    var tempHtml = "<div class='fc-content fcTime' id='" + event.Id + "_Time'><small class='time' title=''> " + event.customFourthTitle + "</small></div> ";
                    _mainTempHtml += tempHtml;
                    rowTooltipDisplay += event.customFourthTitle + " <br/> "
                }
            }
            // For Tag view  //
            //static tagify
            rowRecord += '<div>  <input value="' + eventData.Id + '" id="tag-inputHidden" type="hidden"> ';
            //dynamic tagify
            _.each($scope.totalSelectListTagify, function (item) {
                var taglist = [];
                var tempTag = eventData[item.fieldName];
                if (tempTag != undefined && tempTag != null && tempTag != "") {
                    taglist = tempTag.replace(/"/g, "'");
                }
                rowRecord += '<input value="' + item.fieldName + '" id="tag-inputHidden' + eventData.Id + '" type="hidden"> <input value="' + taglist + '" id="tag-inputHidden' + item.fieldName + '" type="hidden"><input id="tag-input' + item.fieldName + '" type="text"  value="' + taglist + '" placeholder="Add tags">';
            });
            rowRecord += '</div>';


            $scope.counterLoader = undefined;
            var tableTempHtml = "<div class='event-detail div-flex'><div class='div-flex'>" + rowRecord + "</div></div>";
            var basicDetails = window["EventBasicDetail"];
            var actionRow = "";
            actionRow += "<div id='eventCopy' class='mr-10 cursor-pointer' data-formId='" + basicDetails.formId + "' data-formGroupKey='" + eventData.formGroupKey + "' data-eventId='" + event.Id + "'><a> <i class='fa fa-copy'></i></a></div>" + "<div id='eventEdit' class='mr-10 cursor-pointer' data-formId='" + basicDetails.formId + "' data-formGroupKey='" + eventData.formGroupKey + "' data-eventId='" + event.Id + "'><a> <i class='fa fa-pencil'></i></a></div>" + "<div id='eventDelete' data-formId='" + basicDetails.formId + "'    data-formGroupKey='" + eventData.formGroupKey + "' data-eventId='" + event.Id + "' class='delete-event cursor-pointer'><i class='fa fa-trash'></i></div>" + "<a class='btn close-event cursor-pointer' title='close'> <i class='fa fa-times'></i></a>";
            tableTempHtml = "<div class='event-detail div-flex'><div class='div-flex'>" + rowRecord + "</div><div class='btn-box'>" + actionRow + "</div><div class='div-flex div-list-bar'></div></div>";
            var tempHtmlTable = "";
            if ($scope.listTabulator.length > 0) {
                tempHtmlTable = `<div class="div-flex div-list">
                            <div class="d-flex justify-content-between align-items-center p-0">
                                <h5 class="list-title mb-0" id="tabuList"></h5>
                                <div class="d-block">
                                    <div id="addTransactionRecord" class="edit-event-student cursor-pointer d-inline-block"><i class="fa fa-plus"></i></div> <div id="tabuListLink" class="edit-event-student mr-0 ml-1 cursor-pointer d-inline-block"  title="Edit"><i class="fa fa-pencil"></i></div> </div>  </div>   <ul id="tabuListUl">  </ul></div>`;
            }
            else {
                tempHtmlTable = `<div class="div-flex div-list">
                            <div class="d-flex justify-content-between align-items-center p-0">
                                <h5 class="list-title mb-0" id="tabuList"></h5>
                                <div class="d-block">
                                    <div id="addTransactionRecord" class="edit-event-student cursor-pointer d-inline-block"><i class="fa fa-plus"></i></div>  </div>  </div>   <ul id="tabuListUl">  </ul></div>`

            }
            element.append(_mainTempHtml)
            tableTempHtml = "<div class='event-detail div-flex'><div class='div-flex'>" + rowRecord + "</div><div class='btn-box'>" + actionRow + "</div><div class='div-flex div-list-bar'></div>" + tempHtmlTable + "</div>";
            let $fcContent = element.find(".fc-content").detach(),
                $resize = element.find(".fc-resizer").detach();
            element.attr('title', rowTooltipTitleDisplay + "  " + rowTooltipDisplay);
            element.attr('data-html', 'true');
            element.css({
                background: "rgb(255, 255, 255)",
                borderColor: "#aaa",
                padding: 2,
                borderRadius: 5,

                "z-index": 1
            })
                .droppable({
                    drop: function (event, ui) {
                    },
                }).empty().append($fcContent.css({
                    borderRadius: 3,
                }), $resize);


        },
        eventClick: function (calEvent, jsEvent, view) {

            var $scope = angular.element($("#calendar")).scope();


            $scope.selectEventDetails = calEvent;
            $("#customEventDetailsModelPopUp").modal("show");
            $scope.selectEventDetails.resourceFormId = $scope.ySelection;
            $scope.selectEventDetails.ActivityFormId = $scope.xSelection;
            $scope.selectEventDetails.start = $scope.selectEventDetails.start != null && $scope.selectEventDetails.start != undefined && $scope.selectEventDetails.start != '' ? customDate($scope.selectEventDetails.start.format()) : ''
            $scope.selectEventDetails.end = $scope.selectEventDetails.end != null && $scope.selectEventDetails.end != undefined && $scope.selectEventDetails.end != '' ? customDate($scope.selectEventDetails.end.format()) : ''
            $scope.selectEventDetails.customDate = DateWithDayName($scope.selectEventDetails, true);
            if (!$scope.selectEventDetails.allDay) {
                $scope.selectEventDetails.customTime = TimeFormatCalender($scope.selectEventDetails, true);
            }
            else {
                $scope.selectEventDetails.customDate = moment($scope.selectEventDetails.start).format("YYYY-MM-DD");
            }
            //$scope.selectEventDetails.customFormIdsSplit
            //$scope.selectEventDetails.customFormsSplit
            $scope.selectEventDetails.customTitleSplit = $scope.selectEventDetails.customTitle.split(',');
            var listFormDropdown = _.filter($scope.selectEventDetails.customFormsSplit, function (item) { return item != $scope.ySelection.toString(); });
            if (listFormDropdown.length > 0) {
                $scope.selectEventDetails.dropdownList = [];
                _.each(listFormDropdown, function (item, key) {
                    var tempDrop = {};
                    tempDrop.formId = item;
                    tempDrop.Id = $scope.selectEventDetails.customFormIdsSplit[key];
                    tempDrop.formTitle = $scope.selectEventDetails.customTitleSplit[key];
                    var exists = _.filter($scope.xaxisFormList, { activitiesForm: parseInt(tempDrop.formId) });
                    if (exists.length > 0) {
                        tempDrop.dropdownListData = exists[0];
                    }
                    $scope.selectEventDetails.dropdownList.push(tempDrop);
                });
            }

            $('.close-event').on('click', function () {
                $("body .popover").addClass('isPopoverLoaded');
                $("body .popover").popover('hide');
                $("#tabuListUl").empty();
                var $scope = angular.element($("#calendar")).scope();
                $('.temp').find('.titleContainer').removeClass('d-none');
                $('.popoverSelect').addClass('d-none');

            });
            setTimeout(function () {
                removeTitle();


                _.each($scope.totalSelectListTagify, function (item, key) {
                    var param = {};

                    // init Tagify script on the above inputs     
                    var input = document.getElementById('tag-input' + item.fieldName);
                    input.value = [];
                    if (item.tagify != undefined)
                        item.tagify.destroy();
                    if (input != null) {
                        var tempWhiteControl = $scope.selectEventDetails[item.fieldName];
                        var tempWhiteList = [];
                        var tempWh2 = [];
                        if (tempWhiteControl != undefined && tempWhiteControl != "") {
                            tempWhiteList = tempWhiteControl;
                            tempWhiteList = tempWhiteList.replace(/'/g, '"');
                            tempWhiteList = JSON.parse(tempWhiteList);
                            var newList = [];
                            if (tempWhiteList.length > 0) {
                                if (tempWhiteList[0].value != undefined) {
                                    _.each(tempWhiteList, function (itemtag) {
                                        newList.push(itemtag.value);
                                    });
                                } else {
                                    newList = tempWhiteList;
                                }
                            }
                            tempWhiteList = newList.join();
                            tempWh2 = tempWhiteList.split(",");
                            input.value = tempWhiteList;
                            var tmp = [tempWhiteList];
                        }

                        item.tagify = new Tagify(input, {
                            whitelist: tempWh2,
                            maxTags: 10,
                            dropdown: {
                                maxItems: 20,           // <- mixumum allowed rendered suggestions
                                classname: "tags-look", // <- custom classname for this dropdown, so it could be targeted
                                enabled: 0,             // <- show suggestions on focus
                                closeOnSelect: false    // <- do not hide the suggestions dropdown once an item has been selected
                            }
                        });
                        if (item.tagify.on != undefined) {
                            item.tagify.on('add', onAddTag)
                            item.tagify.on('invalid', onInvalidTag)
                            item.tagify.on('remove', onRemoveTag)
                            item.tagify.on('edit', onTagEdit)
                        }
                    }
                });
                var param = {};
                var selectedId = $("#tag-inputHidden").val();
                param.selectedId = selectedId;
                $scope.getTabulatorListFromEvents(param);
                $scope.rootScopeSafe();
            }, 800);
            $(document).on('click', function (e) {
                if ($('.favicon-loader-overlay.active').length) {
                }
                else {
                    if (!$(e.target).closest('.popover.show').length && !$(e.target).closest('.fc-content').length) {
                        //$(document).find('.popover.show').remove()
                        //$("body .popover").addClass('isPopoverLoaded');
                        //$("body .popover").popover('hide');
                        //$("#tabuListUl").empty();
                        //var $scope = angular.element($("#calendar")).scope();
                        //$('.temp').find('.titleContainer').removeClass('d-none');
                        //$('.popoverSelect').addClass('d-none');
                    }
                }
            });
        },
        eventAfterAllRender: function (event, element, view) {

            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');

            if (current_tab == "agenda-view") {
                var $scope = angular.element($("#calendar")).scope();
                $scope.$parent.$parent.IND_loading = false;
                setTimeout(function () {
                    $.unblockUI();
                }, 1000);
            } else {
                $.unblockUI();
            }
            setTimeout(function () {
                jQuery.curCSS = function (element, prop, val) {
                    return jQuery(element).css(prop, val);
                };
                $('.fc-content').bstooltip();
                $('.fc-timeline-event').bstooltip();
                $('.fc-list-item').bstooltip();
                $('.fc-day-grid-event').bstooltip();
                $('.fc-time-grid-event').bstooltip();
                setTimeout(function () {
                    $('#agenda-view div.calendar').fullCalendar('render');
                    $('#timeline-resource-view div.calendar').fullCalendar('render');
                    $('#vertical-resource-view div.calendar').fullCalendar('render');
                }, 150);
            }, 150);
        }


    },


        // List View
        myOptions = {
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'listDay,listWeek,listMonth,listYear'
            },
            // customize the button names,
            // otherwise they'd all just say "list"
            views: {
                listDay: { buttonText: 'day' },
                listWeek: { buttonText: 'week' },
                listMonth: { buttonText: 'month' },
                listYear: { buttonText: 'year' }
            },
            defaultView: 'listDay',
            defaultDate: new Date(),
            // events: calenderData,
            events: function (start, end, timezone, callback) {

                var $scopeVar = angular.element($("#calendar")).scope();
                var param = {};
                param.action = 1;
                param.formId = $scopeVar.currentFormId;

                param.isCalender = 1;
                param.isEvent = 1;

                param.resourceFormId = $scopeVar.ySelection;
                param.ActivityFormId = $scopeVar.xSelection;
                var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
                var view = $('#list-view div.calendar').fullCalendar('getView');
                param.filter = {};
                param.filter = changeStateOfCalender(view, start, end);
                param.filter.field = "start";
                showLoader();
                $.ajax({
                    method: 'POST',
                    url: BASE_URL+ "/FormAPI/getReferralFormFields",
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify(param),
                    success: function (response) {
                        //$.unblockUI();
                        var calenderData = changeResourceIDByYSelection((response.events != undefined) ? response.events : response.events);
                        if (calenderData != undefined) {
                            callback(calenderData);
                            renderEventHtml(calenderType, calenderData, resourceData, resColumns, activityFormData, activityColumn, activityEvents, defaultOptions, resourceOrder, resColumns, resourceData, activitiesCategory);
                        }
                        else
                            callback([]);
                    },
                    beforeSend: function () {
                        // showLoader();
                    },
                    complete: function () {
                        var _ScrollOffset = window["scrollOffset"];
                        window.scrollTo(0, _ScrollOffset);
                        $.unblockUI();
                        // $("#" + current_tab + " div.calendar").unblock();
                    }
                });
            },
            allDaySlot: true
        };
    var calendarOptions = $.extend({}, defaultOptions, myOptions);
    $('#list-view div.calendar').fullCalendar(calendarOptions);

    // Agenda View
    myOptions = {
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month'
        },
        defaultView: 'month',
        events: [],
        scrollTime: '00:00',
        allDaySlot: true,
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
            //dialog.find("form #tab_start").val(start.format());
            //dialog.find("form #tab_end").val(end.format());
            //dialog.find("form #allDay").val('false');
            //dialog.find("form #tab_color").val('#8500b2').change();
            //dialog.dialog("open");

            $("#agenda-view div.calendar").fullCalendar('unselect');
        },
        droppable: true, // this allows things to be dropped onto the calendar
        drop: function (date, jsEvent, ui, resourceId) {
            //console.log($(this));
            swal({
                title: 'Drag Calender Entry',
                text: 'Action is not allowed in this view',
                type: 'error'
            });
            rebindCalenderWithEvents("deleteEvent");
           // $("#agenda-view div.calendar").fullCalendar('refetchEvents');
            return false;

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
            var allDayCustom = "false";
            var current_subtab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').find('.ui-state-active').attr('class');
            if (current_subtab) {
                allDayCustom = (current_subtab.contains('fc-agendaMonth-button') || current_subtab.contains('fc-timelineYear-button')).toString();
            }
            var defaultDuration = moment.duration(eventExtData.duration);
            var end = date.clone().add(defaultDuration);
            var activities = eventExtData.id;
            var $scope = angular.element($("#calendar")).scope();
            eventBasicData.resFormIdParam = $scope.ySelection;
            eventBasicData.actFormIdParam = eventExtData.formid;
            var param = {};
            param.action = eventBasicData.action;
            param.formId = eventBasicData.formId;
            param.userId = eventBasicData.userId;

            var defaultDuration = moment.duration(eventExtData.duration);
            var end = date.clone().add(defaultDuration);

            var startCustom = date.format();
            var endCustom = end.format();

            var exists = _.findWhere($scopeVar.calenderSettingsFormDetailsDataList, { activitiesForm: parseInt(eventExtData.formid) });
            if (exists != undefined) {
                if (exists.durationField == "0") {
                    allDayCustom = "true";
                } else {
                    allDayCustom = "false";
                }
            }
            var resourceValue = "0";
            var eventData = {
                id: eventExtData.id,
                title: eventExtData.groupingvaluesact,
                color: eventExtData.color,
                allDay: allDayCustom,
                start: startCustom,
                end: endCustom,
                resFormID: eventBasicData.resFormIdParam,
                actFormID: eventBasicData.actFormIdParam,
                resourceId: 0,
                resources: 0,
                activities: eventExtData.title,
                colActivityValue: "",
                colCategoryValue: "",
                colColorValue: "",
                dropin: eventExtData.dropin,
                dimensionType: eventExtData.dimensiontype,
                dropinTitle: eventExtData.title
            };
            if (allDayCustom == "true" || startCustom.length == 10) {
                startCustom = date.format("YYYY-MM-DD");
                startCustom = moment(startCustom + " 00:00:00");
                endCustom = date.format("YYYY-MM-DD");
                let initialdate = endCustom;
                let start_time = '23:59:59';
                endCustom = moment(initialdate + " " + start_time);
                allDayCustom = "true";
                startCustom = startCustom.format("YYYY-MM-DD HH:mm");
                endCustom = endCustom.format("YYYY-MM-DD HH:mm");
            }
            else {
                allDayCustom = "false";
                if (eventExtData.duration == null || eventExtData.duration == "" || eventExtData.duration == undefined || exists.duration == "0") {
                    allDayCustom = "true";
                    startCustom = date.format("YYYY-MM-DD");
                    startCustom = moment(startCustom + " 00:00:00");
                    endCustom = date.format("YYYY-MM-DD");
                    let initialdate = endCustom;
                    let start_time = '23:59:59';
                    endCustom = moment(initialdate + " " + start_time);
                }
            }
            if ($('#allDay-check').is(':checked')) {
                allDayCustom = "true";
                startCustom = date.format("YYYY-MM-DD");
                startCustom = moment(startCustom + " 00:00:00");
                endCustom = date.format("YYYY-MM-DD");
                let initialdate = endCustom;
                let start_time = '23:59:59';
                endCustom = moment(initialdate + " " + start_time);
                startCustom = startCustom.format("YYYY-MM-DD HH:mm");
                endCustom = endCustom.format("YYYY-MM-DD HH:mm");
            }
            else {
                if (current_subtab.contains("fc-timelineDay-button") || current_subtab.contains("fc-agendaDay-button") || current_subtab.contains("fc-agendaWeek-button")) {

                }
                else {
                    allDayCustom = "true";
                    startCustom = date.format("YYYY-MM-DD");
                    startCustom = moment(startCustom + " 00:00:00");
                    endCustom = date.format("YYYY-MM-DD");
                    let initialdate = endCustom;
                    let start_time = '23:59:59';
                    endCustom = moment(initialdate + " " + start_time);
                    startCustom = startCustom.format("YYYY-MM-DD HH:mm");
                    endCustom = endCustom.format("YYYY-MM-DD HH:mm");
                }

            }
            var formfieldDataListTempData = [];
            //console.log(eventExtData);


            if ($('#allDay-check').is(':checked')) {
                allDayCustom = "true";
                startCustom = date.format("YYYY-MM-DD");
                startCustom = moment(startCustom + " 00:00:00");
                endCustom = date.format("YYYY-MM-DD");
                let initialdate = endCustom;
                let start_time = '23:59:59';
                endCustom = moment(initialdate + " " + start_time);
                startCustom = startCustom.format("YYYY-MM-DD HH:mm");
                endCustom = endCustom.format("YYYY-MM-DD HH:mm");
            }
            eventData.allDay = allDayCustom;
            eventData.start = startCustom;
            eventData.end = endCustom;
            eventData.formGroupKey = eventBasicData.formGroupKey;
            formfieldDataListTempData = [

                { "name": "title", "value": title },
                { "name": "start", "value": startCustom },
                { "name": "end", "value": endCustom },
                { "name": "color", "value": color },
                { "name": "allDay", "value": allDayCustom },
                { "name": "service", "value": "" },
                { "name": "description", "value": "" },
                { "name": "activities", "value": activities },
                { "formGroupKey": eventBasicData.formGroupKey, "name": "formGroupKey", "value": eventBasicData.formGroupKey }
            ];


            var checkExists = window["eventListTemp"];
            var exists = _.filter(checkExists, function (item) {
                return compareEventStartEndDateTime(eventData, item) && (item.resourceId == eventData.resourceId ||
                    item.resources == eventData.resourceId);
            });
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            if (exists.length > 0) {
                var listExisting = angular.copy(exists);
                exists = exists[0];
                eventData.formGroupKey = exists.formGroupKey;
                var seperatedIds = exists.customFormIds;
                var comma = seperatedIds.split(',');
                var _droppedForms = exists.customForms;
                var _arr0 = _droppedForms.split(',');
                var _checkIfExists = true;
                _.each(_arr0, function (_row, _pos) {
                    if (_row.toString().trim() === eventBasicData.actFormIdParam.toString()) {
                        _checkIfExists = false;
                        //break;
                    }

                });
                var _checkIfExistsIds = false;
                var _droppedFormsIds = exists.customFormIds;
                var _arr1 = _droppedFormsIds.split(',');
                _.each(listExisting, function (item) {
                    var formlist = item.customForms.split(',');
                    var formIdslist = item.customFormIds.split(',');
                    //// 
                    var formExist = _.filter(formlist, function (formItem) { return formItem.toString().trim() === eventBasicData.actFormIdParam.toString() });
                    var formIdExist = _.filter(formIdslist, function (formIdItem) { return formIdItem.toString().trim() === eventData.id.toString() });
                    if (formExist.length > 0 && formIdExist.length > 0) {
                        _checkIfExistsIds = true;
                    }
                });
                if (!_checkIfExists) {
                    var checkOverlapping = _.where($scopeVar.calenderSettingsFormDetailsDataList, { resourceActivityForm: eventBasicData.actFormIdParam });
                    if (checkOverlapping.length > 0) {
                        var eventOverlapping = _.filter(checkOverlapping, function (item) {
                            return item.eventOverlap == "1" || item.activitiesOverlap == "1";
                        });
                        // 
                        if (eventOverlapping.length > 0 && _checkIfExistsIds) {
                            eventData.formGroupKey = undefined;
                            if (!_checkIfExistsIds) {
                                $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                                swal({ type: 'error', title: '', text: 'cannot overlap same dimension entry in same timeslot' });
                                return false;
                            }
                            else {
                                generateEvent(eventData, eventExtData, date, end, resourceValue);
                            }
                        } else {
                            if (comma.length > 1 && !_checkIfExists && _checkIfExistsIds) {
                                $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                                swal({ type: 'error', title: '', text: 'cannot drop same dimension more than once in same event' });
                                return false;
                            } else {
                                eventData.formGroupKey = undefined;
                                generateEvent(eventData, eventExtData, date, end, resourceValue);
                            }
                        }
                    } else {
                        $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                        swal({ type: 'error', title: '', text: 'cannot drop same dimension more than once in same event' });
                        return false;
                    }
                }
                else if (_checkIfExists) {
                    if (resourceValue !== '') {
                    }
                    if (eventData.title !== '') {
                        addExternalEvent(eventData);
                    }
                }
            }
            else {
                generateEvent(eventData, eventExtData, date, end, resourceValue);
            }
            //if (title !== '') {
            //    var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            //    $.ajax({
            //        method: 'POST',
            //        url: "api/FormAPI/GeneratedFormData",
            //        dataType: 'json',
            //        contentType: "application/json",
            //        data: "{'action':" + eventBasicData.action + ",'userId':" + eventBasicData.userId + ",'formId':" + eventBasicData.formId +
            //            ",'topicId':" + eventBasicData.formData.topicId + ",'created_by':" + eventBasicData.created_by
            //            + ",'resourceFormId':" + eventBasicData.actFormIdParam + ",'ActivityFormId':" + eventBasicData.actFormIdParam + ",'updated_by':" + eventBasicData.update_by + ",'formGroupKey':'" + eventBasicData.formGroupKey
            //            + "','formfieldDataListTemp':'" + JSON.stringify(formfieldDataListTempData) + "'}", //$.param(formData)
            //        success: function (response) {
            //            if (response.res > 0) {
            //                param.created_by = eventBasicData.created_by;
            //                param.update_by = eventBasicData.update_by;
            //                param.formGroupKey = response.formGroupKey;
            //                param.resourceFormId = eventBasicData.resFormIdParam;
            //                param.activityFormId = eventBasicData.actFormIdParam;
            //                param.resourceId = eventBasicData.resourceId != undefined?eventBasicData.resourceId.toString():"0";
            //                param.activityId = activities.toString();
            //                manageOneToManyReferrenceForm(param);                           
            //                var calenderNewRow = {
            //                    Id: response.Id,
            //                    label: null,
            //                    selected: false,
            //                    value: response.Id,
            //                    color: color,
            //                    title: title,
            //                    start: start,
            //                    end: end,
            //                    allDay: allDayCustom,
            //                    activities: title,
            //                    customForms: param.activityFormId,
            //                    customFormIds: activities,
            //                    customTitle: title,
            //                    formGroupKey : param.formGroupKey
            //                };
            //                var activityNewRow = {
            //                    Id: response.Id,
            //                    label: null,
            //                    selected: false,
            //                    value: response.Id,
            //                    color: color,
            //                    title: title,
            //                    start: start,
            //                    end: end,
            //                    allDay: allDayCustom,
            //                    activities: title,
            //                    resourceId: activities,
            //                    customForms: param.activityFormId,
            //                    customFormIds: activities,
            //                    customTitle: title,
            //                    formGroupKey : param.formGroupKey
            //                };
            //                //eventBasicData.formGroupKey = create_UUID();
            //                window["EventBasicDetail"] = eventBasicData;

            //                var CalendarEventList = window["CalendarEventList"];
            //                var ActivityEventList = window["ActivityEventList"];
            //                //console.log('before insertion ');
            //                //console.log(CalendarEventList);

            //                CalendarEventList.push(calenderNewRow);
            //                ActivityEventList.push(activityNewRow);
            //                window["CalendarEventList"] = CalendarEventList;
            //                window["ActivityEventList"] = ActivityEventList;
            //                //console.log('after  insertion ');
            //                //console.log(CalendarEventList);
            //                console.log('hi5')
            //                // $('.calendar').fullCalendar('destroy');
            //                //loadCalendar('BasicView', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, ActivityEventList);
            //                refreshEventResourcesActivity('BasicView', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, ActivityEventList);
            //                //  loadCalendar('BasicView', CalendarEventList);
            //                //$('#basic-view div.calendar').fullCalendar('refetchEvents');

            //                //eventBasicData.formGroupKey = create_UUID();
            //                window["EventBasicDetail"] = eventBasicData;
            //                $.jGrowl(response.Message, { position: 'center' });
            //            }
            //            else {
            //                if (response.res == -1) {
            //                    var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            //                    $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
            //                    swal({ type: 'error', title: '', text: response.Message });

            //                } else {
            //                    swal({ type: 'error', title: '', text: response.overlapMessage });
            //                }
            //            }
            //        },
            //        beforeSend: function () {
            //            showLoader();
            //        },
            //        complete: function () {
            //            $.unblockUI();
            //        }
            //    });
            //}
        }
    };
    var calendarOptions = $.extend({}, defaultOptions, myOptions);
    $('#agenda-view div.calendar').fullCalendar(calendarOptions);

    if ($scopeVar != undefined)
        if ($scopeVar.ySelection != 0) {
            if ($scopeVar.formDetailsDataInfo != null)
                if ($scopeVar.formDetailsDataInfo.calenderSettingsList != null)
                    if ($scopeVar.formDetailsDataInfo.calenderSettingsList.length > 0) {
                        var exists = _.findWhere($scopeVar.formDetailsDataInfo.calenderSettingsList, { resourceForm: $scopeVar.ySelection });
                        if (exists != undefined) {
                            if (exists.minTime != "" && exists.minTime != null && exists.minTime != undefined && exists.maxTime != null && exists.maxTime != undefined && exists.maxTime != "") {
                                var minTime = exists.minTime.trim().replace(' ', ':');
                                var maxTime = exists.maxTime.trim().replace(' ', ':');
                                $('#agenda-view div.calendar').fullCalendar('option', 'minTime', minTime + ":00");
                                $('#agenda-view div.calendar').fullCalendar('option', 'maxTime', maxTime + ":00");
                            }
                        }
                    }
        }
    //tagyfiy on blur
    function onTagifyFocusBlur(e) {
        //console.log(e.type, "event fired")
    }
    // tag added callback
    function onAddTag(e) {
        var id = $("#tag-inputHidden").val();
        var fieldName = $("#tag-inputHidden" + id).val();
        var $scope = angular.element($("#calendar")).scope();
        var param = {};
        var list = [];
        param.fieldName = fieldName;
        _.each(e.detail.tagify.value, function (item) {
            list.push('"' + item.value + '"');
        });
        param.fieldDataText = "[" + list.join(',') + "]";
        param.formId = $scope.currentFormId;
        param.Id = id;
        $scope.updateRowDataRecord(param);
    }
    // tag remvoed callback
    function onRemoveTag(e) {
        var id = $("#tag-inputHidden").val();
        var fieldName = $("#tag-inputHidden" + id).val();
        var $scope = angular.element($("#calendar")).scope();
        var param = {};
        var list = [];
        param.fieldName = fieldName;
        _.each(e.detail.tagify.value, function (item) {
            list.push('"' + item.value + '"');
        });
        param.fieldDataText = "[" + list.join(',') + "]";
        param.Id = id;
        param.formId = $scope.currentFormId;
        $scope.updateRowDataRecord(param);
    }
    function onTagEdit(e) {
        //console.log("onTagEdit: ", e.detail);
    }
    // invalid tag added callback
    function onInvalidTag(e) {
        //console.log("onInvalidTag: ", e.detail);
    }
    // timeLine resource view
    function addExternalEvent(eventData) {
        window["scrollOffset"] = $(window).scrollTop();
        var eventBasicData = window["EventBasicDetail"];
        var checkExists = window["CalendarEventList"];
        var actFormIdParam = window["xSelected"];
        var resFormIdParam = window["ySelected"];
        var param = {};
        param.action = eventBasicData.action;
        param.formId = eventBasicData.formId;
        param.userId = eventBasicData.userId;
        param.isDyEvent = true;
        param.topicId = eventBasicData.formData.topicId;
        param.created_by = eventBasicData.created_by;
        param.update_by = eventBasicData.update_by;
        param.formGroupKey = eventBasicData.formGroupKey;
        var tempGroup = create_UUID();
        var service = ''; var description = '';
        if (activitiesCategory != null) {
            service = eventData.service;
            description = eventData.description;
        }
        var formfieldDataListTempData = [];
        formfieldDataListTempData = [
            { "name": "title", "value": "" },
            { "name": "start", "value": eventData.start },
            { "name": "end", "value": eventData.end },
            { "name": "color", "value": eventData.color },
            { "name": "allDay", "value": eventData.allDay },
            { "name": "service", "value": service },
            { "name": "description", "value": description },
            { "name": "resources", "value": eventData.resourceId },
            { "name": "resourcesTitle", "value": eventData.resources },
            { "name": "activities", "value": eventData.id },
            { "formGroupKey": eventBasicData.formGroupKey, "name": "formGroupKey", "value": eventBasicData.formGroupKey }
        ];
        var exists = _.filter(checkExists, function (item) {
            return compareEventStartEndDateTime(eventData, item)
                && (item.resourceId == eventData.resourceId ||
                    item.resources == eventData.resourceId);
        });

        if (exists.length > 0) {
            _.each(exists, function (item) {
                var tempformentryidList = item.customFormIds.split(",");
                item.customFormIdsSplit = tempformentryidList;
            });
            exists = _.filter(exists, function (item) { return item.customFormIdsSplit.length == 2 });
            if (exists.length > 0) {
                //make it ready for update
                param.isEventUpdatable = true;
                if (eventData.formGroupKey != undefined) {
                    param.action = 2;//for updte.
                } else {
                    param.action = 1;
                    param.formGroupKey = tempGroup;
                    param.isEventUpdatable = false;
                    var temp = _.findWhere(formfieldDataListTempData, { name: "formGroupKey" });
                    if (temp != null) {
                        temp.value = param.formGroupKey;
                        temp.formGroupKey = param.formGroupKey;
                    }
                }
                exists = exists[0];
                formfieldDataListTempData.push({ "name": "parentID", "value": exists.Id });
                param.parentID = exists.Id;
                var seperatedResColValues = exists.seperatedResColValues;
                var seperatedColorValues = exists.seperatedColorValues;
                if (seperatedResColValues != null && seperatedResColValues.toString() !== "") {
                    param.seperatedResColValues = seperatedResColValues + "," + eventData.resources.toString();
                }
                else {
                    param.seperatedResColValues = eventData.resources.toString();
                }
                // color values
                if (seperatedColorValues != null && seperatedColorValues.toString() !== "") {
                    param.seperatedColorValues = seperatedColorValues + "/" + eventData.color.toString();
                }
                else {
                    param.seperatedColorValues = eventData.colColorValue.toString()
                }
            }
            else {
                formfieldDataListTempData.push({ "name": "parentID", "value": 0 });
                param.parentID = 0;
                param.seperatedFormIDs = window["xSelected"].toString() + "," + window["ySelected"].toString();
                param.seperatedTitles = eventData.title + "," + eventData.dropinTitle //eventData.colActivityValue.toString() + " - " + eventData.colCategoryValue.toString() + " in " + eventData.dropin.toString();
                param.seperatedResFormIDs = window["ySelected"].toString() + "," + window["xSelected"].toString();
                param.seperatedResEntryIDs = eventData.resourceId.toString() + "," + eventData.id.toString();
                param.seperatedResColValues = eventData.resources.toString() + "," + eventData.activities.toString();
                param.seperatedColorValues = eventData.color.toString() + "/" + eventData.colColorValue.toString();
                param.seperatedIds = eventData.id.toString() + "," + eventData.resourceId.toString();
                param.isEventUpdatable = false;
                eventBasicData.formGroupKey = create_UUID();
            }
        }
        else {
            formfieldDataListTempData.push({ "name": "parentID", "value": 0 });
            param.parentID = 0;
            param.seperatedFormIDs = window["xSelected"].toString() + "," + window["ySelected"].toString();
            param.seperatedTitles = eventData.title + "," + eventData.dropinTitle //eventData.colActivityValue.toString() + " - " + eventData.colCategoryValue.toString() + " in " + eventData.dropin.toString();
            param.seperatedResFormIDs = window["ySelected"].toString() + "," + window["xSelected"].toString();
            param.seperatedResEntryIDs = eventData.resourceId.toString() + "," + eventData.id.toString();
            param.seperatedResColValues = eventData.resources.toString() + "," + eventData.activities.toString();
            param.seperatedColorValues = eventData.color.toString() + "/" + eventData.colColorValue.toString();
            param.seperatedIds = eventData.id.toString() + "," + eventData.resourceId.toString();
            param.isEventUpdatable = false;
            eventBasicData.formGroupKey = create_UUID();
        }
        param.formfieldDataListTemp = formfieldDataListTempData;
        var isAllowToUpdate = false;
        if (typeof seperatedTitles !== "undefined" && seperatedTitles !== "" && seperatedTitles !== null) {
        }

        $.ajax({
            method: 'POST',
            url: BASE_URL+"FormAPI/GeneratedFormData",
            dataType: 'json',
            contentType: "application/json",
            data: "{'action':" + param.action + ",'userId':" + param.userId + ",'formId':" + param.formId + ",'resourceFormId':" + resFormIdParam + ",'ActivityFormId':" + actFormIdParam + ",'parentID':" + param.parentID + ",'isDyEvent':" + param.isDyEvent + ",'isEventUpdatable':" + param.isEventUpdatable + ",'seperatedResColValues':'" + param.seperatedResColValues + "','seperatedColorValues':'" + param.seperatedColorValues + "',   'topicId':" + param.topicId + ",'created_by':" + param.created_by + ",'updated_by':" + param.update_by + ",'formGroupKey':'" + param.formGroupKey + "','formfieldDataListTemp':'" + JSON.stringify(param.formfieldDataListTemp) + "'}", //$.param(formData)
            beforeSend: function () {
                showLoader();
            },
            success: function (response) {
                if (response.res > 0 && param.action == 1) {
                    param.resourceFormId = resFormIdParam;
                    param.activityFormId = actFormIdParam;
                    param.resourceId = eventData.resourceId.toString();
                    param.activityId = eventData.id.toString();
                    manageOneToManyReferrenceForm(param);
                    param.activities = eventData.activities;
                    var calenderNewRow = {
                        Id: response.Id,
                        label: null,
                        selected: false,
                        value: response.Id,
                        color: eventData.color,
                        title: "",
                        start: eventData.start,
                        end: eventData.end,
                        allDay: eventData.allDay,
                        resourceId: eventData.resourceId,
                        resources: eventData.resources,
                        service: service,
                        description: description,
                        activities: eventData.activities,
                        customTitle: eventData.dropinTitle + ',' + param.activities.toString(),
                        customForms: eventData.resFormID + ',' + param.activityFormId.toString(),
                        customFormIds: eventData.resourceId + ',' + param.activityId.toString(),
                        parentID: 0,
                        formGroupKey: param.formGroupKey
                    };
                    var activityNewRow = {
                        Id: response.Id,
                        label: null,
                        selected: false,
                        value: response.Id,
                        color: eventData.color,
                        title: "",
                        start: eventData.start,
                        end: eventData.end,
                        allDay: eventData.allDay,
                        resourceId: eventData.id,
                        resources: eventData.resources,
                        service: service,
                        description: description,
                        activities: eventData.activities,
                        customTitle: eventData.dropinTitle + ',' + param.activities.toString(),
                        customForms: eventData.resFormID + ',' + param.activityFormId.toString(),
                        customFormIds: eventData.resourceId + ',' + param.activityId.toString(),
                        parentID: 0,
                        formGroupKey: param.formGroupKey
                    };
                    var oneToManyNewRow = {
                        Id: response.Id,
                        label: null,
                        selected: false,
                        value: response.Id,
                        color: eventData.color,
                        title: "",
                        start: eventData.start,
                        end: eventData.end,
                        allDay: eventData.allDay,
                        resourceId: eventData.resourceId,
                        resources: eventData.resources,
                        service: service,
                        description: description,
                        activities: eventData.activities,
                        customTitle: eventData.dropinTitle + ',' + param.activities.toString(),
                        customForms: eventData.resFormID + ',' + param.activityFormId.toString(),
                        customFormIds: eventData.resourceId + ',' + param.activityId.toString(),
                        parentID: 0,
                        formGroupKey: param.formGroupKey
                    };
                    var CalendarEventList = window["CalendarEventList"];
                    var ActivityEventList = window["ActivityEventList"];
                    eventBasicData.formData.FormDataToOneListDynamic.push(oneToManyNewRow);
                    CalendarEventList.push(calenderNewRow);
                    ActivityEventList.push(activityNewRow);
                    window["CalendarEventList"] = CalendarEventList;
                    window["ActivityEventList"] = ActivityEventList;
                    refreshEventResourcesActivity('BasicView', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, ActivityEventList);
                    window["EventBasicDetail"] = eventBasicData;
                    $.jGrowl(response.Message, { position: 'center' });
                    var _ScrollOffset = window["scrollOffset"];
                    window.scrollTo(0, _ScrollOffset);
                }
                else if (response.res > 0 && param.action == 2) {
                    try {
                        var CalendarEventList = window["CalendarEventList"];
                        var ActivityEventList = window["ActivityEventList"];
                        var oneToManyList = eventBasicData.formData.FormDataToOneListDynamic;
                        var CalenderEditableRow = $.grep(CalendarEventList, function (e) {
                            return e.Id == exists.Id;
                        });
                        if (CalenderEditableRow.length > 0) {
                            param.resourceFormId = resFormIdParam;
                            param.activityFormId = actFormIdParam;
                            param.resourceId = eventData.resourceId.toString();
                            param.activityId = eventData.id.toString();
                            param.formGroupKey = CalenderEditableRow[0].formGroupKey;
                            manageOneToManyReferrenceForm(param);
                        }
                        var ActivityEditableRow = $.grep(ActivityEventList, function (e) {
                            return e.Id == exists.Id;
                        });
                        var oneToManyListEditableRow = $.grep(oneToManyList, function (e) {
                            return e.Id == exists.Id;
                        });
                        CalenderEditableRow[0].customTitle += " ," + eventData.activities.toString();
                        CalenderEditableRow[0].customForms += " ," + eventData.actFormID.toString();
                        CalenderEditableRow[0].customFormIds += " ," + eventData.id.toString();
                        CalenderEditableRow[0].seperatedIds = param.seperatedIds;
                        CalenderEditableRow[0].seperatedTitles = param.seperatedTitles;
                        CalenderEditableRow[0].seperatedFormIDs = param.seperatedFormIDs;
                        CalenderEditableRow[0].parentID = param.parentID;
                        CalenderEditableRow[0].seperatedResFormIDs = param.seperatedResFormIDs;
                        CalenderEditableRow[0].seperatedResEntryIDs = param.seperatedResEntryIDs;
                        CalenderEditableRow[0].seperatedResColValues = param.seperatedResColValues;
                        CalenderEditableRow[0].seperatedColorValues = param.seperatedColorValues;
                        CalenderEditableRow[0].formGroupKey = param.formGroupKey;
                        ActivityEditableRow[0].seperatedIds = param.seperatedIds;
                        ActivityEditableRow[0].seperatedTitles = param.seperatedTitles;
                        ActivityEditableRow[0].seperatedFormIDs = param.seperatedFormIDs;
                        ActivityEditableRow[0].customTitle += " ," + eventData.activities.toString();
                        ActivityEditableRow[0].customForms += " ," + eventData.actFormID.toString();
                        ActivityEditableRow[0].customFormIds += " ," + eventData.id.toString();
                        ActivityEditableRow[0].parentID = param.parentID;
                        ActivityEditableRow[0].seperatedResFormIDs = param.seperatedResFormIDs;
                        ActivityEditableRow[0].seperatedResEntryIDs = param.seperatedResEntryIDs;
                        ActivityEditableRow[0].seperatedResColValues = param.seperatedResColValues;
                        ActivityEditableRow[0].seperatedColorValues = param.seperatedColorValues;
                        ActivityEditableRow[0].formGroupKey = param.formGroupKey;
                        oneToManyListEditableRow[0].seperatedIds = param.seperatedIds;
                        oneToManyListEditableRow[0].seperatedTitles = param.seperatedTitles;
                        oneToManyListEditableRow[0].seperatedFormIDs = param.seperatedFormIDs;
                        oneToManyListEditableRow[0].customTitle += " ," + eventData.activities.toString();
                        oneToManyListEditableRow[0].customForms += " ," + eventData.actFormID.toString();
                        oneToManyListEditableRow[0].customFormIds += " ," + eventData.id.toString();
                        oneToManyListEditableRow[0].parentID = param.parentID;
                        oneToManyListEditableRow[0].seperatedResFormIDs = param.seperatedResFormIDs;
                        oneToManyListEditableRow[0].seperatedResEntryIDs = param.seperatedResEntryIDs;
                        oneToManyListEditableRow[0].seperatedResColValues = param.seperatedResColValues;
                        oneToManyListEditableRow[0].seperatedColorValues = param.seperatedColorValues;
                        oneToManyListEditableRow[0].formGroupKey = param.formGroupKey;
                        var filteredEventsCalender = $.grep(CalendarEventList, function (e) {
                            return e.Id != exists.Id;
                        });
                        var filteredEventsActivity = $.grep(ActivityEventList, function (e) {
                            return e.Id != exists.Id;
                        });
                        var filteredoneToManyList = $.grep(oneToManyList, function (e) {
                            return e.Id != exists.Id;
                        });
                        filteredEventsCalender.push(CalenderEditableRow[0]);
                        filteredEventsActivity.push(ActivityEditableRow[0]);
                        filteredoneToManyList.push(oneToManyListEditableRow[0]);
                        eventBasicData.formData.FormDataToOneListDynamic = filteredoneToManyList;
                        _.each(filteredEventsCalender, function (dataRow, position) {
                            var rowRecord = dataRow;
                            var seperatedFormIDsParam = dataRow.customForms;
                            var seperatedIdsParam = dataRow.customFormIds != undefined ? dataRow.customFormIds : dataRow.customFormIds;
                            var seperatedTitleParam = dataRow.customTitle;
                            var commaIDs = seperatedIdsParam.split(',');
                            var commaVals = seperatedFormIDsParam.split(',');
                            var ySelected = window["ySelected"];
                            _.each(commaVals, function (idVal, pos) {
                                if (idVal.trim() == ySelected.toString()) {
                                    dataRow.resFormID = idVal;
                                    dataRow.resources = commaIDs[pos];
                                    dataRow.resourceId = commaIDs[pos];
                                }
                            })
                        });
                        window["CalendarEventList"] = filteredEventsCalender;
                        window["ActivityEventList"] = filteredEventsActivity;
                        refreshEventResourcesActivity('BasicView', filteredEventsCalender, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, filteredEventsActivity);
                        window["EventBasicDetail"] = eventBasicData;
                        $.jGrowl(response.Message, { position: 'center' });
                    }
                    catch (e) {
                        $.jGrowl(response.Message, { position: 'center' });
                        var _ScrollOffset = window["scrollOffset"];
                        window.scrollTo(0, _ScrollOffset);
                        $.unblockUI();
                    }
                }
                else {
                    var _ScrollOffset = window["scrollOffset"];
                    window.scrollTo(0, _ScrollOffset);
                    if (response.res == -1) {
                        var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
                        $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                        swal({ type: 'error', title: '', text: response.Message });

                    } else {
                        swal({ type: 'error', title: '', text: "failed" });
                    }

                }
            },
            complete: function () {
                var _ScrollOffset = window["scrollOffset"];
                window.scrollTo(0, _ScrollOffset);
                $.unblockUI();
            }
        });
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
            if (dialog.length > 2) {
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
            }

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
            var current_subtab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').find('.ui-state-active').attr('class');
            var allDayCustom = "false";
            if (current_subtab) {
                allDayCustom = (current_subtab.contains('fc-timelineMonth-button') || current_subtab.contains('fc-timelineYear-button')).toString();
            }
            var eventExtData = $(this).data('event');
            var resource = $("#" + current_tab + " .calendar").fullCalendar('getResourceById', resourceId);
            var title = eventExtData.title ? eventExtData.title : '';
            var id = eventExtData.id ? eventExtData.id : '';
            var resFormIdParam = window["ySelected"];
            var actFormIdParam = window["xSelected"];
            var resourceColumn = window["currResColumn"];
            var majorColumn = window["currMajorColumn"];
            var resourceValue = '', activityValue = title;
            var titleColActivity = eventExtData.activityfield;
            var titleColCategory = eventExtData.categoryfield;
            var titleColColor = eventExtData.colorfield;
            var dropin = eventExtData.dropin;
            var groupingfieldsresParam = eventExtData.groupingfieldsres;
            var dropinTitle = ""; var isAllowService = false;
            if (groupingfieldsresParam !== undefined && groupingfieldsresParam.length > 0) {
                groupingfieldsresParam = groupingfieldsresParam.split('-');
                _.each(groupingfieldsresParam, function (value, key) {
                    if (dropinTitle === "") {
                        dropinTitle = resource[value.trim()];
                    }
                    else
                        dropinTitle += " - " + resource[value.trim()];
                });
            }
            if (eventExtData.dimensiontype == "2D") {
                eventExtData.groupingvaluesact = eventExtData.title;
            }
            var colActivityValue = ""; var colCategoryValue = ""; var colColorValue = "";
            if (typeof resource[resourceColumn] != 'undefined') {
                resourceValue = resource[resourceColumn];
                if (eventExtData.dimensiontype == "2D")
                    dropinTitle = resourceValue;
            }
            if (typeof resource[titleColActivity] != 'undefined') {
                colActivityValue = resource[titleColActivity];
            }
            if (typeof resource[titleColCategory] != 'undefined') {
                colCategoryValue = resource[titleColCategory];
            }
            if (typeof resource[titleColColor] != 'undefined') {
                colColorValue = resource[titleColColor];
            }
            var defaultDuration = moment.duration(eventExtData.duration);
            var end = date.clone().add(defaultDuration);
            var exists = _.findWhere($scopeVar.calenderSettingsFormDetailsDataList, { activitiesForm: parseInt(eventExtData.formid) });
            if (exists != undefined) {
                if (exists.durationField == "0") {
                    allDayCustom = "true";
                } else {
                    allDayCustom = "false";
                }
            }
            var startCustom = date.format();
            var endCustom = end.format();
            if (allDayCustom == "true") {
                startCustom = date.format("YYYY-MM-DD");
                startCustom = moment(startCustom + " 00:00:00");
                endCustom = date.format("YYYY-MM-DD");
                let initialdate = endCustom;
                let start_time = '23:59:59';
                endCustom = moment(initialdate + " " + start_time);
            }
            else {
                allDayCustom = "false";
                if (eventExtData.duration == null || eventExtData.duration == "" || eventExtData.duration == undefined || exists.duration == "0") {
                    allDayCustom = "true";
                    startCustom = date.format("YYYY-MM-DD");
                    startCustom = moment(startCustom + " 00:00:00");
                    endCustom = date.format("YYYY-MM-DD");
                    let initialdate = endCustom;
                    let start_time = '23:59:59';
                    endCustom = moment(initialdate + " " + start_time);
                }
            }
            if ($('#allDay-check').is(':checked')) {
                allDayCustom = "true";
                startCustom = date.format("YYYY-MM-DD");
                startCustom = moment(startCustom + " 00:00:00");
                endCustom = date.format("YYYY-MM-DD");
                let initialdate = endCustom;
                let start_time = '23:59:59';
                endCustom = moment(initialdate + " " + start_time);
            }
            else {
                if (current_subtab.contains("fc-timelineDay-button") || current_subtab.contains("fc-agendaDay-button")) {

                }
                else {
                    allDayCustom = "true";
                    startCustom = date.format("YYYY-MM-DD");
                    startCustom = moment(startCustom + " 00:00:00");
                    endCustom = date.format("YYYY-MM-DD");
                    let initialdate = endCustom;
                    let start_time = '23:59:59';

                    endCustom = moment(initialdate + " " + start_time);
                }

            }
            var eventData = {
                id: id,
                title: eventExtData.groupingvaluesact,
                color: eventExtData.color,
                allDay: allDayCustom,
                start: startCustom,
                end: endCustom,
                resFormID: resFormIdParam,
                actFormID: actFormIdParam,
                resourceId: resourceId,
                resources: resourceValue,
                activities: activityValue,
                colActivityValue: colActivityValue,
                colCategoryValue: colCategoryValue,
                colColorValue: colColorValue,
                dropin: dropin,
                dimensionType: eventExtData.dimensiontype,
                dropinTitle: dropinTitle
            };
            var checkExists = window["eventListTemp"];
            var exists = _.filter(checkExists, function (item) {
                return compareEventStartEndDateTime(eventData, item) && (item.resourceId == eventData.resourceId ||
                    item.resources == eventData.resourceId);
            });
            if (exists.length > 0) {
                exists = _.filter(exists, function (item) { return item.customFormIdsSplit.length == 2 });
                if (exists.length > 0) {
                    var listExisting = angular.copy(exists);
                    exists = exists[0];
                    eventData.formGroupKey = exists.formGroupKey;
                    var seperatedIds = exists.customFormIds;
                    var comma = seperatedIds.split(',');
                    var _droppedForms = exists.customForms;
                    var _arr0 = _droppedForms.split(',');
                    var _checkIfExists = true;
                    _.each(_arr0, function (_row, _pos) {
                        if (_row.toString().trim() === actFormIdParam.toString()) {
                            _checkIfExists = false;
                            //break;
                        }

                    });
                    var _checkIfExistsIds = false;
                    var _droppedFormsIds = exists.customFormIds;
                    var _arr1 = _droppedFormsIds.split(',');
                    _.each(listExisting, function (item) {
                        var formlist = item.customForms.split(',');
                        var formIdslist = item.customFormIds.split(',');
                        // 
                        var formExist = _.filter(formlist, function (formItem) { return formItem.toString().trim() === actFormIdParam.toString() });
                        var formIdExist = _.filter(formIdslist, function (formIdItem) { return formIdItem.toString().trim() === eventData.id.toString() });
                        if (formExist.length > 0 && formIdExist.length > 0) {
                            _checkIfExistsIds = true;
                        }
                    });
                    if (!_checkIfExists) {
                        var checkOverlapping = _.where($scopeVar.calenderSettingsFormDetailsDataList, { resourceActivityForm: actFormIdParam });
                        if (checkOverlapping.length > 0) {
                            var eventOverlapping = _.filter(checkOverlapping, function (item) {
                                return item.eventOverlap == "1" || item.activitiesOverlap == "1";
                            });
                            // 
                            if (eventOverlapping.length > 0 && _checkIfExistsIds) {
                                eventData.formGroupKey = undefined;
                                if (!_checkIfExistsIds) {
                                    $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                                    swal({ type: 'error', title: '', text: 'cannot overlap same dimension entry in same timeslot' });
                                    return false;
                                }
                                else {
                                    generateEvent(eventData, eventExtData, date, end, resourceValue);
                                }
                            } else {
                                if (comma.length > 1 && !_checkIfExists && _checkIfExistsIds) {
                                    $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                                    swal({ type: 'error', title: '', text: 'cannot drop same dimension more than once in same event' });
                                    return false;
                                } else {
                                    eventData.formGroupKey = undefined;
                                    generateEvent(eventData, eventExtData, date, end, resourceValue);
                                }
                            }
                        } else {
                            $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                            swal({ type: 'error', title: '', text: 'cannot drop same dimension more than once in same event' });
                            return false;
                        }
                    }
                    else if (_checkIfExists) {
                        if (resourceValue !== '') {
                        }
                        if (eventData.title !== '') {
                            addExternalEvent(eventData);
                        }
                    }
                }
                else {
                    generateEvent(eventData, eventExtData, date, end, resourceValue);
                }
                //var comma = seperatedIds.split(',');
                //if (comma.length > 2) {
                //    $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                //    return false;
                //}
                //else {
                //    var _droppedForms = exists.customForms;
                //    var _arr0 = _droppedForms.split(',');
                //    var _checkIfExists = true;
                //    angular.forEach(_arr0, function (_row, _pos) {
                //        if (_row.toString().trim() === actFormIdParam.toString()) {
                //            _checkIfExists = false;
                //            //break;
                //        }

                //    });
                //    var _checkIfExistsIds = false;
                //    var _droppedFormsIds = exists.customFormIds;
                //    var _arr1 = _droppedFormsIds.split(',');
                //   _.each(listExisting, function (item) {
                //        var formlist = item.customForms.split(',');
                //        var formIdslist = item.customFormIds.split(',');
                //        var formExist = _.filter(formlist, function (formItem) { return formItem.toString().trim() === actFormIdParam.toString() });
                //        var formIdExist = _.filter(formIdslist, function (formIdItem) { return formIdItem.toString().trim() === eventData.id.toString() });
                //        if (formExist.length > 0 && formIdExist.length > 0) {
                //            _checkIfExistsIds = true;
                //        }
                //    });                
                //    if (!_checkIfExists) {
                //        var checkOverlapping = _.where($scopeVar.calenderSettingsFormDetailsDataList, { resourceActivityForm: actFormIdParam });
                //        if (checkOverlapping.length > 0) {
                //            var eventOverlapping = _.filter(checkOverlapping, function (item) {
                //                return item.eventOverlap == "1" || item.activitiesOverlap == "1";
                //            });
                //            if (eventOverlapping.length > 0 && _checkIfExistsIds) {
                //                eventData.formGroupKey = undefined;
                //                if (!_checkIfExistsIds) {
                //                    $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                //                    swal({ type: 'error', title: '', text: 'cannot overlap same dimension entry in same timeslot' });
                //                    return false;
                //                }
                //                else {
                //                    generateEvent(eventData, eventExtData, date, end, resourceValue);
                //                }
                //            } else {
                //                if (comma.length > 1 && !_checkIfExists && _checkIfExistsIds) {
                //                    $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                //                    swal({ type: 'error', title: '', text: 'cannot drop same dimension more than once in same event' });
                //                    return false;
                //                } else {
                //                    eventData.formGroupKey = undefined;
                //                    generateEvent(eventData, eventExtData, date, end, resourceValue);
                //                }
                //            }
                //        } else {
                //            $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                //            swal({ type: 'error', title: '', text: 'cannot drop same dimension more than once in same event' });
                //            return false;
                //        }
                //    }                  
                //    else if (_checkIfExists) {
                //        if (resourceValue !== '') {                           
                //        }
                //        if (eventData.title !== '') {
                //            addExternalEvent(eventData);
                //        }
                //    }                   
                //}
            }
            else {
                generateEvent(eventData, eventExtData, date, end, resourceValue);
            }
        }
    };
    function generateEvent(eventData, eventExtData, date, end, resourceValue) {
        var dropinTitle = ""; var isAllowService = false;
        //for activity category && overlap check.
        var postData = {
            action: 33,
            userId: eventData.userid,
            formId: eventData.formID,
            ActivityFormId: eventExtData.formid,
            ActivityId: eventExtData.id,
            ActivityFields: eventExtData.servicefield,
            resourceId: eventData.resourceId,
            isActivityCategory: 1,
            resEntryColumn: eventData.activitiesCategory,
            compareColumn: eventData.activityField,
            compareValue: eventExtData.title,
            startDate: date.format(),
            endDate: end.format(),
            eventOverlap: eventData.eventOverlap,
            activitiesOverlap: eventData.activitiesOverlap,
            isResourceExternalDrop: true

        }
        // select a category    eventExtData.servicefield !== '' && eventExtData.servicefield != null
        if (isAllowService) {
            async function callCategory(eventData) {
                // inputOptions can be an object or Promise
                const inputOptions = new Promise((resolve) => {
                    $.post(BASE_URL + "/FormAPI/getReferralFormFields", postData, function (response) {
                        if (typeof response.overlapMesage !== 'undefined') {
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
                                }
                            }
                            if (Object.keys(resolveCategory).length > 1) {
                                resolve(resolveCategory);
                            } else {
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
                                    if (result.value) {
                                        var service = $.trim(result.value[0]), description = $.trim(result.value[1]);
                                        if (resourceValue !== '')
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
                    if (result.value) {
                        var service = $.trim(result.value[0]), description = $.trim(result.value[1]);
                        if (eventData.resources !== '') {
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
        }
        else {
            if (resourceValue !== '') {
            }
            if (eventData.title !== '') {
                addExternalEvent(eventData);
            }
        }
    };
    function GetCalendarDateRange() {
        var calendar = $('#timeline-resource-view div.calendar').fullCalendar('getCalendar');
        var view = calendar.view;
        var start = view.start._d;
        var end = view.end._d;
        var dates = { start: start, end: end };
        return dates;
    }

    var myOptions1 = {
        //defaultDate: '2017-12-07',
        scrollTime: '00:00', // undo default 6am scrollTime
        header: {
            left: 'myCustomButton prev,next today',
            center: 'title',
            right: 'timelineDay,timelineMonth'
        },
        customButtons: {
            myCustomButton: {
                text: "Export To Excel",
                click: function () {
                    alert('Export To Excel')
                    var resourceFormId = window["ySelected"];
                    var formId = $scopeVar.currentFormId;
                    var userId = $scopeVar.userDetail.Id;
                    var typeView = 0;
                    var current_subtab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').find('.ui-state-active').attr('class');
                    if (current_subtab.contains('fc-timelineMonth-button'))
                        typeView = 1;
                    else if (current_subtab.contains('fc-timelineYear-button'))
                        typeView = 2;
                    var dates = GetCalendarDateRange();
                    var currentDate = moment(dates.start).format("YYYY-MM-DD");
                    var newpath = $scopeVar.EndPointUrl + '/downloadCalenderExcel?formId=' + formId + '&resourceFormId=' + resourceFormId + '&userId=' + userId + '&typeView=' + typeView + '&currentDate=' + currentDate + '';
                    window.location.href = $scopeVar.EndPointUrl + '/downloadCalenderExcel?formId=' + formId + '&resourceFormId=' + resourceFormId + '&userId=' + userId + '&typeView=' + typeView + '&currentDate=' + currentDate + '';
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

        resourceAreaWidth: '25%',

        events: [],
        events: function (start, end, timezone, callback) {

            var $scopeVar = angular.element($("#calendar")).scope();
            var param = {};
            param.action = 1;
            param.formId = $scopeVar.currentFormId;

            param.isCalender = 1;
            param.isEvent = 1;

            param.resourceFormId = $scopeVar.ySelection;
            param.ActivityFormId = $scopeVar.xSelection;
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            var view = $('#timeline-resource-view div.calendar').fullCalendar('getView');
            param.filter = {};
            param.filter = changeStateOfCalender(view, start, end);
            param.filter.field = "start";
            showLoader();
            $.ajax({
                method: 'POST',
                url: BASE_URL + "/FormAPI/getReferralFormFields",
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(param),
                success: function (response) {
                    //$.unblockUI();
                    var calenderData = changeResourceIDByYSelection((response.events != undefined) ? response.events : response.events);
                    if (calenderData != undefined)
                        callback(calenderData);
                    else
                        callback([]);
                },
                beforeSend: function () {
                    showLoader();
                },
                complete: function () {
                    var _ScrollOffset = window["scrollOffset"];
                    window.scrollTo(0, _ScrollOffset);
                    $.unblockUI();
                    // $("#" + current_tab + " div.calendar").unblock();
                }
            });
        },
        // resourceLabelText: "Client",
        resourceOrder: resourceOrder,
        resourceColumns: resColumns,
        resources: resourceData,
        allDaySlot: true,
        resourceRender: function (resourceObj, labelTds, bodyTds) {
            var cellText = '';
            for (i = 0; i < labelTds.length; i++) {
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
    countLoader = 0;
    calendarOptions = $.extend({}, defaultOptions, resourceOptions, myOptions1);
    $('#timeline-resource-view div.calendar').fullCalendar(calendarOptions);
    if ($scopeVar != undefined)
        if ($scopeVar.ySelection != 0) {
            if ($scopeVar.formDetailsDataInfo != null)
                if ($scopeVar.formDetailsDataInfo.calenderSettingsList != null)
                    if ($scopeVar.formDetailsDataInfo.calenderSettingsList.length > 0) {
                        var exists = _.findWhere($scopeVar.formDetailsDataInfo.calenderSettingsList, { resourceForm: $scopeVar.ySelection });
                        if (exists != undefined) {
                            if (exists.minTime != "" && exists.minTime != null && exists.minTime != undefined && exists.maxTime != null && exists.maxTime != undefined && exists.maxTime != "") {
                                var minTime = exists.minTime.trim().replace(' ', ':');
                                var maxTime = exists.maxTime.trim().replace(' ', ':');
                                $('#timeline-resource-view div.calendar').fullCalendar('option', 'minTime', minTime + ":00");
                                $('#timeline-resource-view div.calendar').fullCalendar('option', 'maxTime', maxTime + ":00");
                            }
                        }
                    }
        }
    if ($scopeVar != undefined)
        if ($scopeVar.isFilterApply) {
            var uniqEvents = _.uniq(calenderData, "resourceId");
            var tempFormData = [];
            _.each(resourceData, function (item) {
                var exists = _.findWhere(uniqEvents, { resourceId: item.id });
                if (exists != undefined) {
                    tempFormData.push(item);
                }
            });
            resourceData = tempFormData;
        }
    /// vertical resource view.

    var myOptions2 = {
        //defaultDate: '2017-12-07',
        scrollTime: '00:00', // undo default 6am scrollTime    
        header: {
            left: 'myCustomButton prev,next today',
            center: 'title',
            right: 'agendaDay,agendaTwoDays,agendaThreeDays,agendaWeek'
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
            },
            agendaWeek: {
                type: 'agenda',
                duration: { days: 7 },
                groupByResource: true,
            }
        },
        dayMinWidth: 150, // will cause horizontal scrollbars      
        defaultView: 'agendaDay',
        events: [],

        resources: resourceData,
        allDaySlot: true
    };
    countLoader = 0;
    calendarOptions = $.extend({}, defaultOptions, resourceOptions, myOptions2);
    $('#vertical-resource-view div.calendar').fullCalendar(calendarOptions);
    setTimeout(function () {
        $.unblockUI();
    }, 500);
}

function loadCalendartemp(calenderType, calenderData, resourceData, resColumns, activityFormData, activityColumn, activityEvents) {
    try {
        if (calenderData.length > 0)
            showLoader();
        else
            $.unblockUI();
    }
    catch (e) {
        $.unblockUI();
    }
    calenderData = changeResourceIDByYSelection((calenderData.data != undefined) ? calenderData.data : calenderData);
    window["eventListTemp"] = calenderData;
    var $scopeVar = angular.element($("#calendar")).scope();
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
    var userid = 0;
    if (localStorage.detail != undefined && localStorage.detail != "")
        userid = JSON.parse(localStorage.detail).Id;
    var activitiesCategory = basicDetails.formData.activitiesCategory;
    if (activitiesCategory == '' || activitiesCategory == null)
        activitiesCategory = '0';
    var overlapField = basicDetails.formData.overlapField; // value of activity radioButton field   (for overlap)
    var calendarOptions = '';

    // managing resource ordering  data .
    var _ColumnResults = [];

    var tagify = "";



    var defaultOptions = {
        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
        theme: true,
        themeSystem: 'jquery-ui',
        //  themeSystem:'bootstrap4',
        nowIndicator: true,
        slotDuration: '00:15:00',
        // defaultTimedEventDuration: defaultDuration,
        //aspectRatio: 1.5,
        defaultDate: new Date(),
        eventMouseover: function (event, jsEvent, view) {
            if (view.name !== 'agendaDay') {
                ////console.log(event);
                $(jsEvent.target).attr('title', event.title);
            }
        },
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
            //  revertFunc();

            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            if (current_tab === "vertical-activities-view") {
                revertFunc();
                return;
            }


            //console.log('event is');
            //console.log(event);
            var isInternalDropParam = true;
            window["scrollOffset"] = $(window).scrollTop();
            var eventBasicData = window["EventBasicDetail"];
            var eventExtData = $(this).data('event');
            var resourceValue = '', title = '';
            var Id = 0;
            if (typeof event.Id === "undefined")
                Id = event.value;
            else
                Id = event.Id;
            title = event.title;
            var actFormId = event.formId;
            var resFormId = window["ySelected"];
            var activityFormId = window["xSelected"];
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
            var allDay = event.allDay;
            var formfieldDataListTempData = [];
            //console.log(eventExtData);

            var $scope = angular.element($("#calendar")).scope();

            ////console.log(event);
            //alert(event.title + " end is now " + event.end.format());
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            if (!confirm("Are you sure about this change?")) {
                revertFunc();
            } else {
                if (event.resourceId) {
                    var resource = $("#" + current_tab + " .calendar").fullCalendar('getResourceById', event.resourceId);
                    var activity = $("#vertical - activities - view" + " .calendar").fullCalendar('getResourceById', event.activities);
                    var titleModifiedPart = ""; var majorGroupSplits = [];
                    if (resource && typeof resource[resourceColumn] != 'undefined') {
                        resourceValue = resource[resourceColumn];
                        titleModifiedPart = resourceValue;
                        if (typeof majorGroup !== undefined)
                            majorGroupSplits = majorGroup.split(',');
                        if (majorGroupSplits.length > 0) {
                            _.each(majorGroupSplits, function (value, pos) {
                                if (value != "") {
                                    if (titleModifiedPart !== "")
                                        titleModifiedPart += "-" + resource[value].toString();
                                    else
                                        titleModifiedPart = resource[value].toString();
                                }
                            });
                        }
                        var _currResFormId = window["ySelected"];
                        var _seperatedTitles = event.customTitle;
                        var _seperatedFormIDs = event.customForms;
                        var _seperatedIds = event.customFormIds;

                        //var _seperatedResFormIDs = event.seperatedResFormIDs;
                        //var _seperatedResEntryIDs = event.seperatedResEntryIDs;
                        //var _seperatedResColValues = event.seperatedResColValues;


                        if (typeof _seperatedTitles !== undefined)
                            _seperatedTitles = _seperatedTitles.split(',');
                        if (typeof _seperatedFormIDs !== undefined)
                            _seperatedFormIDs = _seperatedFormIDs.split(',');
                        if (typeof _seperatedIds !== undefined)
                            _seperatedIds = _seperatedIds.split(',');
                        //if (typeof _seperatedResFormIDs !== undefined)
                        //    _seperatedResFormIDs = _seperatedResFormIDs.split(',');
                        //if (typeof _seperatedResEntryIDs !== undefined)
                        //    _seperatedResEntryIDs = _seperatedResEntryIDs.split(',');
                        //if (typeof _seperatedResColValues !== undefined)
                        //    _seperatedResColValues = _seperatedResColValues.split(',');




                        _.each(_seperatedFormIDs, function (value, key) {
                            if (value.trim() === _currResFormId.toString().trim()) {
                                _seperatedTitles[key] = titleModifiedPart;
                                _seperatedIds[key] = event.resourceId;
                            }
                        });
                        //_.each(_seperatedResFormIDs, function (value, key) {
                        //    if (value === _currResFormId.toString()) {
                        //        _seperatedResEntryIDs[key] = event.resourceId;
                        //        _seperatedResColValues[key] = resourceValue;
                        //    }
                        //});

                        var _newseperatedTitles = ""; var _newseperatedIds = ""; var _newseperatedResEntryIDs = ""; var _newseperatedResColValues = "";
                        _.each(_seperatedFormIDs, function (value, key) {
                            if (_newseperatedTitles === "")
                                _newseperatedTitles = _seperatedTitles[key].toString();
                            else
                                _newseperatedTitles += " , " + _seperatedTitles[key].toString();


                            if (_newseperatedIds === "")
                                _newseperatedIds = _seperatedIds[key].toString();
                            else
                                _newseperatedIds += " , " + _seperatedIds[key].toString();

                            //if (_newseperatedResEntryIDs === "")
                            //    _newseperatedResEntryIDs = _seperatedResEntryIDs[key].toString();
                            //else
                            //    _newseperatedResEntryIDs += " , " + _seperatedResEntryIDs[key].toString();


                            //if (_newseperatedResColValues === "")
                            //    _newseperatedResColValues = _seperatedResColValues[key].toString();
                            //else
                            //    _newseperatedResColValues += " , " + _seperatedResColValues[key].toString();

                        });




                        var activityValue = activity[activityField];
                        //if (event.activities != 'undefined')
                        //   // title = event.activities + ' in ' + resourceValue;
                        //else
                        //   // title = ' in ' + resourceValue;
                    }
                }
                var indx = _.findIndex(event.customFormsSplit, function (formIdString) { return formIdString.toString().trim() == $scope.xSelection.toString() });
                if (indx != -1) {
                    activities = event.customFormIdsSplit[indx].toString().trim();
                }
                formfieldDataListTempData = [
                    { "name": "Id", "value": parseInt(Id) },
                    { "name": "title", "value": title },
                    { "name": "start", "value": start },
                    { "name": "end", "value": end },
                    { "name": "allDay", "value": allDay },
                    { "name": "activities", "value": activities },
                    { "name": "resources", "value": resourceId },
                ];

                $.ajax({
                    method: 'POST',
                    url: BASE_URL + "FormAPI/EditEventData",
                    dataType: 'json',
                    contentType: "application/json",
                    data: "{'action':2,'resourceFormId':" + resFormId + ",'ActivityFormId':" + activityFormId + ",'userid':" + eventBasicData.userId + ",'Id':" + parseInt(Id) + ", 'formId':" + eventBasicData.formId + ",'topicId':" + eventBasicData.formData.topicId + ",'created_by':" + eventBasicData.created_by + ",'updated_by':" + eventBasicData.update_by + ",'formfieldDataListTemp':'" + JSON.stringify(formfieldDataListTempData) + "' ,'isInternalDrop':" + isInternalDropParam + ",startDate:'" + start + "','endDate':'" + end + "','eventOverlap': '','activitiesOverlap':" + activitiesOverlap + "}", //$.param(formData)
                    success: function (response) {
                        if (response.res > 0) {
                            //else if (response.res > 0 && param.action == 2) {
                            try {
                                var CalendarEventList = window["CalendarEventList"];
                                var ActivityEventList = window["ActivityEventList"];
                                var oneToManyList = eventBasicData.formData.FormDataToOneListDynamic;

                                var CalenderEditableRow = $.grep(CalendarEventList, function (e) {
                                    return e.Id == event.Id;
                                });
                                var ActivityEditableRow = $.grep(ActivityEventList, function (e) {
                                    return e.Id == event.Id;
                                });
                                var oneToManyListEditableRow = $.grep(oneToManyList, function (e) {
                                    return e.Id == event.Id;
                                });

                                CalenderEditableRow[0].start = start;
                                CalenderEditableRow[0].end = end;
                                CalenderEditableRow[0].seperatedTitles = _newseperatedTitles;
                                CalenderEditableRow[0].seperatedIds = _newseperatedIds;
                                CalenderEditableRow[0].seperatedResColValues = _newseperatedResColValues;
                                CalenderEditableRow[0].seperatedResEntryIDs = _newseperatedResEntryIDs;




                                ActivityEditableRow[0].start = start;
                                ActivityEditableRow[0].end = end;
                                ActivityEditableRow[0].seperatedTitles = _newseperatedTitles;
                                ActivityEditableRow[0].seperatedIds = _newseperatedIds;
                                ActivityEditableRow[0].seperatedResColValues = _newseperatedResColValues;
                                ActivityEditableRow[0].seperatedResEntryIDs = _newseperatedResEntryIDs;

                                oneToManyListEditableRow[0].start = start;
                                oneToManyListEditableRow[0].end = end;
                                oneToManyListEditableRow[0].seperatedTitles = _newseperatedTitles;
                                oneToManyListEditableRow[0].seperatedIds = _newseperatedIds;
                                oneToManyListEditableRow[0].seperatedResColValues = _newseperatedResColValues;
                                oneToManyListEditableRow[0].seperatedResEntryIDs = _newseperatedResEntryIDs;
                                //var  filteredItems = CalendarEventList.filter((item) => item.Id !== response.Id);

                                //console.log('ffffff');
                                //console.log(CalenderEditableRow);

                                var filteredEventsCalender = $.grep(CalendarEventList, function (e) {
                                    return e.Id != event.Id;
                                });
                                var filteredEventsActivity = $.grep(ActivityEventList, function (e) {
                                    return e.Id != event.Id;
                                });
                                var filteredoneToManyList = $.grep(oneToManyList, function (e) {
                                    return e.Id != event.Id;
                                });
                                filteredEventsCalender.push(CalenderEditableRow[0]);
                                filteredEventsActivity.push(ActivityEditableRow[0]);
                                filteredoneToManyList.push(oneToManyListEditableRow[0]);
                                eventBasicData.formData.FormDataToOneListDynamic = filteredoneToManyList;



                                _.each(filteredEventsCalender, function (dataRow, position) {

                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;

                                    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;


                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    _.each(commaVals, function (idVal, pos) {
                                        //console.log(commaVals + "," + commaIDs[pos].toString())
                                        if (idVal == ySelected.toString()) {
                                            dataRow.resFormID = idVal;
                                            dataRow.resources = commaIDs[pos];
                                            dataRow.resourceId = commaIDs[pos];
                                            dataRow.title = "";
                                        }

                                    })



                                });

                                _.each(filteredEventsActivity, function (dataRow, position) {

                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;
                                    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;
                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    _.each(commaVals, function (idVal, pos) {
                                        //console.log(commaVals + "," + commaIDs[pos].toString())
                                        if (idVal == ySelected.toString()) {
                                            dataRow.resFormID = idVal;
                                            dataRow.resources = commaIDs[pos];
                                            dataRow.resourceId = commaIDs[pos];
                                            dataRow.title = "";
                                        }

                                    })



                                });

                                _.each(filteredoneToManyList, function (dataRow, position) {

                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;

                                    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;


                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    _.each(commaVals, function (idVal, pos) {
                                        //console.log(commaVals + "," + commaIDs[pos].toString())
                                        if (idVal == ySelected.toString()) {
                                            dataRow.resFormID = idVal;
                                            dataRow.resources = commaIDs[pos];
                                            dataRow.resourceId = commaIDs[pos];
                                            dataRow.title = "";
                                        }

                                    })



                                });


                                window["CalendarEventList"] = filteredEventsCalender;
                                window["ActivityEventList"] = filteredEventsActivity;
                                console.log('hi3')
                                //$('.calendar').fullCalendar('destroy');
                                //loadCalendar('BasicView', filteredEventsCalender, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, filteredEventsActivity);
                                refreshEventResourcesActivity('BasicView', filteredEventsCalender, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, filteredEventsActivity);
                                //$('#timeline-resource-view div.calendar').fullCalendar('refetchEvents');


                                //eventBasicData.formGroupKey = create_UUID();
                                window["EventBasicDetail"] = eventBasicData;
                                $.jGrowl(response.Message, { position: 'center' });
                                // $scope.bindDraggable();
                            }
                            catch (e) {
                                //console.log(e);
                                $.jGrowl(response.Message, { position: 'center' });

                                var _ScrollOffset = window["scrollOffset"];
                                window.scrollTo(0, _ScrollOffset);
                                $.unblockUI();
                            }

                        } else {
                            revertFunc();
                            if (response.res == -1) {
                                swal({ type: 'error', title: '', text: response.Message });

                            } else {
                                swal({ type: 'error', title: '', text: response.overlapMessage });
                            }


                        }

                    },

                    beforeSend: function () {
                        showLoader();
                    },

                    complete: function () {

                        var _ScrollOffset = window["scrollOffset"];
                        window.scrollTo(0, _ScrollOffset);
                        $.unblockUI();
                        // $("#" + current_tab + " div.calendar").unblock();
                    }
                });



            }

        },
        //  resize event's duration inside calendar view
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
            window["scrollOffset"] = $(window).scrollTop();
            var resourceId = (event.resourceId) ? event.resourceId : '';
            var resources = (event.resources) ? event.resources : '';
            var activities = (event.activities) ? event.activities : '';
            var allDay = event.allDay;
            var formfieldDataListTempData = [];
            var activityName = '';
            var resFormId = window["ySelected"];
            var activityFormId = window["xSelected"];
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
                    url: BASE_URL + "FormAPI/EditEventData",
                    dataType: 'json',
                    contentType: "application/json",
                    data: "{'action':2,'resourceFormId':" + resFormId + ",'ActivityFormId':" + activityFormId + ",'userid':" + eventBasicData.userId + ",'Id':" + parseInt(Id) + ", 'formId':" + eventBasicData.formId + ",'topicId':" + eventBasicData.formData.topicId + ",'created_by':" + eventBasicData.created_by + ",'updated_by':" + eventBasicData.update_by + ",'formfieldDataListTemp':'" + JSON.stringify(formfieldDataListTempData) + "' ,'isResizedEvent':" + parseInt(isResizedEvent) + ",startDate:'" + start + "','endDate':'" + end + "','eventOverlap':" + eventOverlap + ",'activitiesOverlap':" + activitiesOverlap + "}", //$.param(formData)
                    success: function (response) {
                        if (response.res > 0) {

                            try {
                                var CalendarEventList = window["CalendarEventList"];
                                var ActivityEventList = window["ActivityEventList"];
                                var oneToManyList = eventBasicData.formData.FormDataToOneListDynamic;
                                var CalenderEditableRow = $.grep(CalendarEventList, function (e) {
                                    return e.Id == event.Id;
                                });
                                var ActivityEditableRow = $.grep(ActivityEventList, function (e) {
                                    return e.Id == event.Id;
                                });
                                var oneToManyListEditableRow = $.grep(oneToManyList, function (e) {
                                    return e.Id == event.Id;
                                });
                                CalenderEditableRow[0].start = start;
                                CalenderEditableRow[0].end = end;
                                ActivityEditableRow[0].start = start;
                                ActivityEditableRow[0].end = end;
                                oneToManyListEditableRow[0].start = start;
                                oneToManyListEditableRow[0].end = end;
                                var filteredEventsCalender = $.grep(CalendarEventList, function (e) {
                                    return e.Id != event.Id;
                                });
                                var filteredEventsActivity = $.grep(ActivityEventList, function (e) {
                                    return e.Id != event.Id;
                                });
                                var filteredoneToManyList = $.grep(oneToManyList, function (e) {
                                    return e.Id != event.value;
                                });
                                filteredEventsCalender.push(CalenderEditableRow[0]);
                                filteredEventsActivity.push(ActivityEditableRow[0]);
                                filteredoneToManyList.push(oneToManyListEditableRow[0]);
                                eventBasicData.formData.FormDataToOneListDynamic = filteredoneToManyList;
                                _.each(filteredEventsCalender, function (dataRow, position) {

                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;

                                    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;


                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    _.each(commaVals, function (idVal, pos) {
                                        //console.log(commaVals + "," + commaIDs[pos].toString())
                                        if (idVal == ySelected.toString()) {
                                            dataRow.resFormID = idVal;
                                            dataRow.resources = commaIDs[pos];
                                            dataRow.resourceId = commaIDs[pos];
                                            dataRow.title = "";
                                        }

                                    })



                                });
                                _.each(filteredEventsActivity, function (dataRow, position) {

                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;
                                    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;
                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    _.each(commaVals, function (idVal, pos) {
                                        //console.log(commaVals + "," + commaIDs[pos].toString())
                                        if (idVal == ySelected.toString()) {
                                            dataRow.resFormID = idVal;
                                            dataRow.resources = commaIDs[pos];
                                            dataRow.resourceId = commaIDs[pos];
                                            dataRow.title = "";
                                        }

                                    })



                                });
                                _.each(filteredoneToManyList, function (dataRow, position) {

                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;

                                    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;


                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    _.each(commaVals, function (idVal, pos) {
                                        //console.log(commaVals + "," + commaIDs[pos].toString())
                                        if (idVal == ySelected.toString()) {
                                            dataRow.resFormID = idVal;
                                            dataRow.resources = commaIDs[pos];
                                            dataRow.resourceId = commaIDs[pos];
                                            dataRow.title = "";
                                        }

                                    })



                                });
                                window["CalendarEventList"] = filteredEventsCalender;
                                window["ActivityEventList"] = filteredEventsActivity;
                                refreshEventResourcesActivity('BasicView', filteredEventsCalender, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, filteredEventsActivity);
                                window["EventBasicDetail"] = eventBasicData;
                                $.jGrowl(response.Message, { position: 'center' });
                            }
                            catch (e) {
                                $.jGrowl(response.Message, { position: 'center' });
                                var _ScrollOffset = window["scrollOffset"];
                                window.scrollTo(0, _ScrollOffset);
                                $.unblockUI();
                            }
                        } else {
                            revertFunc();
                            if (response.res == -1) {
                                swal({ type: 'error', title: '', text: response.Message });

                            } else {
                                swal({ type: 'error', title: '', text: response.overlapMessage });
                            }
                        }
                    },
                    beforeSend: function () {
                        showLoader();
                    },
                    complete: function () {
                        var _ScrollOffset = window["scrollOffset"];
                        window.scrollTo(0, _ScrollOffset);
                        $.unblockUI();
                    }
                });
            }
        },
        eventRender: function (event, element) {

            if (countLoader == 0) {
                showLoader();
                countLoader++;
            }
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            if (current_tab == "agenda-view") {
                var $scope = angular.element($("#calendar")).scope();
                $scope.$parent.$parent.IND_loading = true;
                if ($scope.counterLoader == undefined)
                    showLoader();
                $scope.counterLoader = 1;
            }
            var rowTooltipDisplay = "";
            var rowTooltipTitleDisplay = "";
            //var table = $("<div class='event-detail div-flex'></div>"), deleteParams;
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            var current_subtab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').find('.ui-state-active').attr('class');
            var resourceA = $("#" + current_tab + " .calendar").fullCalendar('getResourceById', event.resourceId);
            var events = $("#" + current_tab + " .calendar").fullCalendar('clientEvents');

            var rowRecord = "";
            var _associatedTitles = event.customTitle;
            var _associatedFormIDs = event.customForms;
            var $scope = angular.element($("#calendar")).scope();
            var _allSelectables = $scope.xaxisFormList; // x options has all selectable options .
            var _ySelected = window["ySelected"]; // get y selected option.
            var _xSelected = window["xSelected"];
            var _lablesToShow = []; var _colorToShow = [];
            var _tempTitle = "";
            var _tempTitleSecond = "";


            var _mainTempHtml = "";
            _.each(_allSelectables, function (dataRow, position) {
                if (dataRow.resourceActivityForm !== _ySelected) {
                    _lablesToShow.push(dataRow.resourceActivityForm.toString());

                }
            });
            if (typeof _associatedTitles !== "undefined" && _associatedTitles !== null && _associatedTitles !== "") {
                var _arrTitles = _associatedTitles.split(',');
                var _arrColor = [];
                var _arrFormIDs = _associatedFormIDs.split(",");

                //getting index of x selected form  from  associated formIDs arr
                var _xPos = _arrFormIDs.indexOf(_xSelected.toString());
                //swapping position of x occurance  with 0 index;
                if (_xPos !== undefined && _xPos !== null && _xPos !== -1) {
                    var _temp = "";
                    //for titles
                    _temp = _arrTitles[0];
                    _arrTitles[0] = _arrTitles[_xPos];
                    _arrTitles[_xPos] = _temp;
                    //for color
                    if (_arrColor.length > 0) {
                        _temp = _arrColor[0];
                        _arrColor[0] = _arrColor[_xPos];
                        _arrColor[_xPos] = _temp;
                    }
                    //for formIDs
                    _temp = _arrFormIDs[0];
                    _arrFormIDs[0] = _arrFormIDs[_xPos];
                    _arrFormIDs[_xPos] = _temp;
                }
                var eventTemp = angular.copy(event);
                if (!eventTemp.allDay) {
                    eventTemp.start = eventTemp.start != null && eventTemp.start != undefined && eventTemp.start != '' ? customDate(eventTemp.start.format()) : '';
                    if (eventTemp.end != "" && eventTemp.end != null) {
                        eventTemp.end = eventTemp.end != null && eventTemp.end != undefined && eventTemp.end != '' ? customDate(eventTemp.end.format()) : '';
                        rowTooltipDisplay += DateWithDayName(eventTemp, true) + " <br/> "
                        rowTooltipDisplay += TimeFormatCalender(eventTemp, true) + " "
                    } else {
                        rowTooltipDisplay += moment(eventTemp.start).format("YYYY-MM-DD") + " "
                    }
                }
                else {
                    rowTooltipDisplay += moment(eventTemp.start).format("YYYY-MM-DD") + " "
                }
                element.find('.fc-content').remove();
                if (eventTemp.description != "" && eventTemp.description != null) {
                    _tempTitle += "<label class='pr-2'>" + eventTemp.description + "</label>";
                }
                var tempHtml = "";
                _.each(_arrTitles, function (_arrRowData, position) {
                    _tempTitle += "<div class='temp'>";
                    var _isAllowToRender = false;
                    var TitleFormId = _arrFormIDs[position];
                    var lblColor = "";
                    if (TitleFormId != undefined) {
                        _.each(_lablesToShow, function (dataRow2, position2) {
                            if (TitleFormId.toString().trim() === dataRow2)
                                _isAllowToRender = true;
                        });
                    }
                    var count = 0;
                    var currentId = 0;
                    var list = [];
                    var listids = [];
                    var listDrop = "";
                    var listDropdownTemp = {};
                    if (TitleFormId != undefined)
                        if (TitleFormId.toString().trim() != "") {
                            listDropdownTemp = _.findWhere($scopeVar.yaxisFormListCopy, { resourceActivityForm: parseInt(TitleFormId.toString().trim()) });
                            if (listDropdownTemp != undefined) {
                                listDrop = "<div class='d-none popoverSelect'><select class='form-control form-control-sm w-50' onchange=\"changeDimension(\'" + TitleFormId.toString().trim() + "\',\'" + event.formGroupKey.toString() + "\',\'" + event.Id.toString() + "\',this);\" >"
                                var col1 = ""
                                var col2 = ""
                                col2 = listDropdownTemp.minorGroup;
                                if (listDropdownTemp.majorGroup == "[]") {
                                    col1 = "blank";
                                } else {
                                    if (listDropdownTemp.majorGroup.contains('[')) {
                                        col1 = JSON.parse(listDropdownTemp.majorGroup)[0];
                                    }
                                }
                                if (event.customForms != "") {
                                    list = event.customForms.split(',');
                                    for (var i = 0; i < list.length; i++) {
                                        if (list[i].toString().trim() == listDropdownTemp.resourceActivityForm.toString()) {
                                            count = i;
                                            break;
                                        }
                                    }
                                    listids = event.customFormIds.split(',');
                                    currentId = listids[count].toString().trim();
                                }
                                _.each(listDropdownTemp.formDataList, function (item) {
                                    var text = "";
                                    if (item[col1] != undefined && item[col2] != undefined) {
                                        text = item[col1] + " - " + item[col2];
                                    }
                                    else if (item[col1] == undefined) {
                                        text += item[col2];
                                    }
                                    var cId = (item.Id != undefined ? item.Id : item.id);
                                    if (currentId.toString() == cId) {
                                        var tempColor = "";
                                        var colorExists = _.findWhere($scopeVar.xaxisFormList, { resourceActivityForm: parseInt(TitleFormId.toString().trim()) });
                                        if (colorExists != undefined) {
                                            var colorRow = _.findWhere(colorExists.formDataList, { id: currentId.toString() });
                                            if (colorRow != undefined) {
                                                tempColor = colorRow[colorExists.colorField];
                                            }
                                        }
                                        lblColor = tempColor;
                                        listDrop += "<option selected value='" + cId + "'>" + text + "</option>";
                                    } else {
                                        listDrop += "<option value='" + cId + "'>" + text + "</option>";
                                    }
                                });
                                listDrop += "</select><i class='fa fa-times closeSelect cursor-pointer ml-2 fa-sm'></i></div>"
                            }
                        }
                    if (_arrRowData != undefined) {
                        _arrRowData = _arrRowData.split('-');
                        //label render.
                        if (_isAllowToRender) {
                            if (_tempTitle === "") {
                                if (_arrRowData.length > 1)
                                    _tempTitle = "<span class='titleContainer'><span class='title1'> " + _arrRowData[1].toString() + " - " + _arrRowData[0].toString() + "</span><i class='fa fa-pencil editTitle ml-2 cursor-pointer fa-sm'></i><i class='fa fa-trash deleteTitle ml-2 cursor-pointer fa-sm' onclick=\"deleteDimension(\'" + currentId + "\',\'" + list[count] + "\',\'" + event.formGroupKey + "\',this);\"></i></span>";
                                else
                                    _tempTitle = "<span class='titleContainer'><span class='title1'>  " + _arrRowData[0].toString() + "</span><i class='fa fa-pencil editTitle ml-2 cursor-pointer fa-sm'></i> <i class='fa fa-trash deleteTitle ml-2 cursor-pointer fa-sm' onclick=\"deleteDimension(\'" + currentId + "\',\'" + list[count] + "\',\'" + event.formGroupKey + "\',this);\"></i></span>";
                                _tempTitleSecond = _arrRowData[0].toString();
                                _tempTitle += listDrop;
                            }
                            else {
                                if (_arrRowData.length > 1)
                                    _tempTitle += "<span class='titleContainer'><span class='title1'> " + _arrRowData[1].toString() + " - " + _arrRowData[0].toString() + "</span><i class='fa fa-pencil editTitle ml-2 cursor-pointer fa-sm'></i><i class='fa fa-trash deleteTitle ml-2 cursor-pointer fa-sm' onclick=\"deleteDimension(\'" + currentId + "\',\'" + list[count] + "\',\'" + event.formGroupKey + "\',this);\"></i></span>";
                                else
                                    _tempTitle += "<span class='titleContainer'><span class='title1'> " + _arrRowData[0].toString() + "</span><i class='fa fa-pencil editTitle ml-2 cursor-pointer fa-sm'></i><i class='fa fa-trash deleteTitle ml-2 cursor-pointer fa-sm' onclick=\"deleteDimension(\'" + currentId + "\',\'" + list[count] + "\',\'" + event.formGroupKey + "\',this);\"></i></span>";
                                _tempTitleSecond += _arrRowData[0].toString();
                                _tempTitle += listDrop;
                            }
                            var slipTitle = "";
                            if (_arrRowData.length == 1)
                                slipTitle = _arrRowData[0];
                            else if (_arrRowData.length > 1)
                                slipTitle = _arrRowData[0] + " - " + _arrRowData[1];
                            rowTooltipTitleDisplay += slipTitle + " <br/> ";

                            //element.append(
                            //    $('<div>', {
                            //        class: 'fc-content', "
                            //    }).append(
                            //        $('<span>', { class: 'fc-title', "title": "" }).text(slipTitle)
                            //    ).css({
                            //        background: lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor,
                            //        //width: "200px",
                            //        borderRadius: 3,
                            //    })

                            //);
                            tempHtml += "<div class='fc-content' id='" + event.Id + "_" + list[count].trim() + "_" + currentId + "'><span class='fc-title' style='background:" + (lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor) + ";borderRadius: 3;'>" + slipTitle + "</span></div>"


                        }
                    }

                    _tempTitle += "</div>";
                });
                //element.append(tempHtml);
                _mainTempHtml += tempHtml;
                _.each($scopeVar.yaxisFormListCopy, function (listDropdownTemp) {
                    var exists = _.filter(_arrFormIDs, function (flitem) { return flitem == listDropdownTemp.resourceActivityForm.toString() });
                    if (exists.length == 0) {
                        _tempTitle += "<div class='temp'>";
                        var listDrop = "";
                        var currentId = 0;
                        listDrop = "<div class='d-none popoverSelect'><select class='form-control form-control-sm w-50' onchange=\"changeDimension(\'" + listDropdownTemp.resourceActivityForm.toString().trim() + "\',\'" + event.formGroupKey.toString() + "\',\'" + event.Id.toString() + "\',this);\" >"
                        var col1 = ""
                        var col2 = ""
                        col2 = listDropdownTemp.minorGroup;
                        if (listDropdownTemp.majorGroup == "[]") {
                            col1 = "blank";
                        } else {
                            if (listDropdownTemp.majorGroup.contains('[')) {
                                col1 = JSON.parse(listDropdownTemp.majorGroup)[0];
                            }
                        }
                        listDrop += "<option value='0' selected></option>";
                        _.each(listDropdownTemp.formDataList, function (item) {
                            var text = "";
                            if (item[col1] != undefined && item[col2] != undefined) {
                                text = item[col1] + " - " + item[col2];
                            }
                            else if (item[col1] == undefined) {
                                text += item[col2];
                            }
                            var cId = (item.Id != undefined ? item.Id : item.id);
                            listDrop += "<option value='" + cId + "'>" + text + "</option>";

                        });
                        listDrop += "</select><i class='fa fa-times closeSelect cursor-pointer ml-2 fa-sm'></i></div>"
                        _tempTitle += "<span class='titleContainer'><span class='text-muted'> " + listDropdownTemp.title + "</span><i class='fa fa-plus editTitle ml-2 cursor-pointer fa-sm'></i></span>";
                        _tempTitle += listDrop;
                        _tempTitle += "</div>";
                    }
                });

            }
            var eventData = {
                Id: event.Id,
                Images: event.files,
                title: _tempTitle,
                start: event.start != null && event.start != undefined && event.start != '' ? customDate(event.start.format()) : '',
                end: event.end != null && event.end != undefined && event.end != '' ? customDate(event.end.format()) : '',
                allDay: event.allDay,
                service: event.service,
                description: event.description,
                resources: event.resources,
                activities: event.activities,
                activityName: event.activityName,
            };
            var eventData = angular.copy(event);
            eventData.title = _tempTitle;
            eventData.Images = event.files;
            eventData.start = event.start != null && event.start != undefined && event.start != '' ? customDate(eventData.start.format()) : ''
            eventData.end = event.end != null && event.end != undefined && event.end != '' ? customDate(eventData.end.format()) : ''
            var imageFound = 0; var ImgString = ''; var showAllFiles = '';

            if (eventData.title != null && eventData.title.length > 0)
                rowRecord += "<div class='title " + _tempTitleSecond + "'>" + eventData.title + "</div>";
            if (!eventData.allDay) {
                if (eventData.start != null && eventData.start.length > 0)
                    rowRecord += "<div class='" + eventData.start + "'>" + DateWithDayName(eventData, true) + "</div>";
                rowRecord += "<div>" + TimeFormatCalender(eventData, true) + "</div>";
                if (current_tab == "list-view") {


                    var _associatedFormIDsTemp = _associatedFormIDs.split(",");

                    var _associatedTitlestemp = _associatedTitles.split(",").map(function (item) {
                        return item.trim();
                    });
                    var _associatedCustomFormIdsTemp = event.customFormIds.split(",");



                    var exists = _.findIndex(_associatedFormIDsTemp, function (item) { return item == $scope.ySelection.toString() });
                    var lblColor = undefined;
                    var customLocationTitle = "";
                    if (exists >= 0) {
                        customLocationTitle = _associatedTitlestemp[exists];
                        var tempColor = "";
                        var colorExists = _.findWhere($scopeVar.xaxisFormList, { resourceActivityForm: $scope.ySelection });
                        var currentId = _associatedCustomFormIdsTemp[exists].toString();
                        if (colorExists != undefined) {
                            var colorRow = _.findWhere(colorExists.formDataList, { id: currentId });
                            if (colorRow != undefined) {
                                tempColor = colorRow[colorExists.colorField];
                            }
                        }
                        lblColor = tempColor;
                    }
                    if (customLocationTitle != "" && customLocationTitle != null && customLocationTitle != undefined) {
                        var tempHtml = "<div class='fc-content' id='customLocationTitle'><span class='fc-title' title='' style = 'background:" + (lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor) + ";borderRadius: 3;'> " + customLocationTitle + "</span></div > ";
                        //element.append(tempHtml);
                        _mainTempHtml += tempHtml;
                        //element.append(
                        //    $('<div>', {
                        //        class: 'fc-content', "id": "customLocationTitle"
                        //    }).append(
                        //        $('<span>', { class: 'fc-title', "title": "" }).text(customLocationTitle)
                        //    ).css({
                        //        background: lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor,
                        //        //width: "200px",
                        //        borderRadius: 3,
                        //    }));


                    }
                    //element.prepend(
                    //    $('<div>', {
                    //        class: 'fc-content fcTime', 

                    //    }).append(
                    //        $('<small>', { class: 'time', "title": "" }).text(TimeFormatCalender(eventData, true))
                    //    )
                    //);
                    var tempHtml = "";
                    tempHtml = "<div class='fc-content fcTime' id='" + event.Id + "_Time'><small class='time' title=''>" + TimeFormatCalender(eventData, true) + "<small></div>" + tempHtml;
                    // element.prepend(tempHtml);

                } else {
                    if (current_subtab != undefined) {
                        if ((current_tab == "agenda-view" || current_tab == "timeline-resource-view") && (current_subtab.contains("fc-month-button") || current_subtab.contains("fc-timelineYear-button") || current_subtab.contains("fc-timelineMonth-button"))) {
                            var tempHtml = "";
                            tempHtml = "<div class='fc-content' ><span class='text-dark small' title=''>" + TimeFormatCalender(eventData, true) + "<span></div>" + tempHtml;
                            //element.prepend(tempHtml);

                            //element.prepend($('<div>', { class: 'fc-content' }).append(
                            //    $('<span class="text-dark small">').text(TimeFormatCalender(eventData, true))
                            //));

                        }
                    }

                }
            }
            else {
                if (current_tab == "list-view") {

                    var _associatedFormIDsTemp = _associatedFormIDs.split(",");

                    var _associatedTitlestemp = _associatedTitles.split(",").map(function (item) {
                        return item.trim();
                    });
                    var _associatedCustomFormIdsTemp = event.customFormIds.split(",");

                    var exists = _.findIndex(_associatedFormIDsTemp, function (item) { return item == $scope.ySelection.toString() });
                    var lblColor = undefined;
                    var customLocationTitle = "";
                    if (exists >= 0) {
                        customLocationTitle = _associatedTitlestemp[exists];
                        var tempColor = "";
                        var colorExists = _.findWhere($scopeVar.xaxisFormList, { resourceActivityForm: $scope.ySelection });
                        var currentId = _associatedCustomFormIdsTemp[exists].toString();
                        if (colorExists != undefined) {
                            var colorRow = _.findWhere(colorExists.formDataList, { id: currentId });
                            if (colorRow != undefined) {
                                tempColor = colorRow[colorExists.colorField];
                            }
                        }
                        lblColor = tempColor;
                    }
                    if (customLocationTitle != "" && customLocationTitle != null && customLocationTitle != undefined) {
                        //element.append(
                        //    $('<div>', {
                        //        class: 'fc-content', "id": "dd"
                        //    }).append(
                        //        $('<span>', { class: 'fc-title', "title": "" }).text(customLocationTitle)
                        //    ).css({
                        //        background: lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor,
                        //        //width: "200px",
                        //        borderRadius: 3,
                        //    })
                        //);
                        var tempHtml = "<div class='fc-content' id='dd'><span class='fc-title' title='' style = 'background:" + (lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor) + ";borderRadius: 3;'> " + customLocationTitle + "</span></div > ";
                        //element.append(tempHtml);
                        _mainTempHtml += tempHtml;

                    }
                }
                rowRecord += "<div class='" + moment(eventData.start).format("YYYY-MM-DD") + "'>" + moment(eventData.start).format("MMMM D, YYYY (dddd)") + "</div>";
            }

            // For Tag view  //
            //static tagify
            rowRecord += '<div>  <input value="' + eventData.Id + '" id="tag-inputHidden" type="hidden"> ';
            //dynamic tagify
            _.each($scope.totalSelectListTagify, function (item) {
                var taglist = [];
                var tempTag = eventData[item.fieldName];
                if (tempTag != undefined && tempTag != null && tempTag != "") {
                    taglist = tempTag.replace(/"/g, "'");
                }
                rowRecord += '<input value="' + item.fieldName + '" id="tag-inputHidden' + eventData.Id + '" type="hidden"> <input value="' + taglist + '" id="tag-inputHidden' + item.fieldName + '" type="hidden"><input id="tag-input' + item.fieldName + '" type="text"  value="' + taglist + '" placeholder="Add tags">';
            });
            rowRecord += '</div>';


            var $scope = angular.element($("#calendar")).scope();
            if ($scope.formDetailsDataInfo.otherFormIsShow != null && $scope.formDetailsDataInfo.otherFormIsShow == true) {

                if (event.customFourthTitle != null && event.customFourthTitle != "") {

                    //element.append(
                    //    $('<div>', {
                    //        class: 'fc-content fcTime', "id": event.Id + "_Time"

                    //    }).append(
                    //        $('<small>', { class: 'time', "title": "" }).text(event.customFourthTitle)
                    //    )
                    //);
                    var tempHtml = "<div class='fc-content fcTime' id='" + event.Id + "_Time'><small class='time' title=''> " + event.customFourthTitle + "</small></div > ";
                    //element.append(tempHtml);
                    _mainTempHtml += tempHtml;

                    rowTooltipDisplay += event.customFourthTitle + " <br/> "
                }
            }
            $scope.counterLoader = undefined;
            //element.append(_mainTempHtml);
            var tableTempHtml = "<div class='event-detail div-flex'><div class='div-flex'>" + rowRecord + "</div></div>";
            var basicDetails = window["EventBasicDetail"];
            var actionRow = "";
            actionRow += "<div id='eventCopy' class='mr-10 cursor-pointer' data-formId='" + basicDetails.formId + "' data-formGroupKey='" + eventData.formGroupKey + "' data-eventId='" + event.Id + "'><a> <i class='fa fa-copy'></i></a></div>"
            actionRow += "<div id='eventEdit' class='mr-10 cursor-pointer' data-formId='" + basicDetails.formId + "' data-formGroupKey='" + eventData.formGroupKey + "' data-eventId='" + event.Id + "'><a> <i class='fa fa-pencil'></i></a></div>"
            actionRow += "<div id='eventDelete' data-formId='" + basicDetails.formId + "'    data-formGroupKey='" + eventData.formGroupKey + "' data-eventId='" + event.Id + "' class='delete-event cursor-pointer'><i class='fa fa-trash'></i></div>"
            actionRow += "<a class='btn close-event cursor-pointer' title='close'> <i class='fa fa-times'></i></a>";
            tableTempHtml = "<div class='event-detail div-flex'><div class='div-flex'>" + rowRecord + "</div><div class='btn-box'>" + actionRow + "</div><div class='div-flex div-list-bar'></div></div>";

            //table.append("<div class='btn-box'>" + actionRow + "</div>");
            //table.append('<div class="div-flex div-list-bar"></div>');
            var tempHtmlTable = "";
            if ($scope.listTabulator.length > 0) {
                //table.append(`<div class="div-flex div-list">
                //            <div class="d-flex justify-content-between align-items-center p-0">
                //                <h5 class="list-title mb-0" id="tabuList"></h5>
                //                <div class="d-block">
                //                    <div id="addTransactionRecord" class="edit-event-student cursor-pointer d-inline-block"><i class="fa fa-plus"></i></div> <div id="tabuListLink" class="edit-event-student mr-0 ml-1 cursor-pointer d-inline-block"  title="Edit"><i class="fa fa-pencil"></i></div> </div>  </div>   <ul id="tabuListUl">  </ul></div>`);
                tempHtmlTable = `<div class="div-flex div-list">
                            <div class="d-flex justify-content-between align-items-center p-0">
                                <h5 class="list-title mb-0" id="tabuList"></h5>
                                <div class="d-block">
                                    <div id="addTransactionRecord" class="edit-event-student cursor-pointer d-inline-block"><i class="fa fa-plus"></i></div> <div id="tabuListLink" class="edit-event-student mr-0 ml-1 cursor-pointer d-inline-block"  title="Edit"><i class="fa fa-pencil"></i></div> </div>  </div>   <ul id="tabuListUl">  </ul></div>`;
            }
            else {
                //table.append(`<div class="div-flex div-list">
                //            <div class="d-flex justify-content-between align-items-center p-0">
                //                <h5 class="list-title mb-0" id="tabuList"></h5>
                //                <div class="d-block">
                //                    <div id="addTransactionRecord" class="edit-event-student cursor-pointer d-inline-block"><i class="fa fa-plus"></i></div>  </div>  </div>   <ul id="tabuListUl">  </ul></div>`);

                tempHtmlTable = `<div class="div-flex div-list">
                            <div class="d-flex justify-content-between align-items-center p-0">
                                <h5 class="list-title mb-0" id="tabuList"></h5>
                                <div class="d-block">
                                    <div id="addTransactionRecord" class="edit-event-student cursor-pointer d-inline-block"><i class="fa fa-plus"></i></div>  </div>  </div>   <ul id="tabuListUl">  </ul></div>`

            }
            tableTempHtml = "<div class='event-detail div-flex'><div class='div-flex'>" + rowRecord + "</div><div class='btn-box'>" + actionRow + "</div><div class='div-flex div-list-bar'></div>" + tempHtmlTable + "</div>";
            let $fcContent = element.find(".fc-content").detach(),
                $resize = element.find(".fc-resizer").detach();
            element.attr('title', rowTooltipTitleDisplay + "  " + rowTooltipDisplay);
            element.attr('data-html', 'true');
            element.popover({
                container: 'body',
                animation: true,
                //delay: 300,
                //content: table,
                trigger: 'click',
                html: true,
                placement: 'top',
                content: function () {
                    $("body .popover").popover('hide');
                    return $(tableTempHtml);
                }

            }).css({
                background: "rgb(255, 255, 255)",
                borderColor: "#aaa",
                padding: 2,
                borderRadius: 5,
                //min-height: 44,
                "z-index": 1
            })
                .droppable({
                    drop: function (event, ui) {
                    },
                }).empty().append($fcContent.css({
                    borderRadius: 3,
                }), $resize);


        },
        eventClick: function (calEvent, jsEvent, view) {
            function removeTitle() {
                $('body .popover-header').remove();
            }
            $('.close-event').on('click', function () {
                $("body .popover").addClass('isPopoverLoaded');
                $("body .popover").popover('hide');
                $("#tabuListUl").empty();
                var $scope = angular.element($("#calendar")).scope();
                $('.temp').find('.titleContainer').removeClass('d-none');
                $('.popoverSelect').addClass('d-none');

            });
            setTimeout(function () {
                removeTitle();
                if (!$("body .popover").hasClass("isPopoverLoaded")) {
                    $('.editTitle').on('click', function () {
                        $(this).closest('.temp').find('.popoverSelect').removeClass('d-none');
                        $(this).closest('.titleContainer').addClass('d-none');
                    });
                    $('#eventCopy').on('click', function () {
                        var $scope = angular.element($("#calendar")).scope();
                        var formId = $(this).data('formId');
                        var formGroupKey = $(this).data('formGroupkey');
                        var rowId = $(this).data('eventId');
                        var eventData = _.findWhere(window["CalendarEventList"], { formGroupKey: formGroupKey.toString() });
                        var param = {};
                        param.formGroupKey = formGroupKey;
                        if ($scope.listTabulator.length > 0) {
                            var temp = $scope.listTabulator[0];
                            param.formId = temp.fieldValidationRuleParse.reference_form;
                            param.isInternalDrop = true;
                        } else {
                            param.formId = $scope.formDetailsDataInfo.otherformid;
                            param.isInternalDrop = false;
                        }
                        param.Id = rowId;
                        param.action = 10;
                        param.parentID = formId;
                        param.newFormGroupKey = "";
                        $scope.copyCalenderEventFunction(param);
                    });
                    $('.closeSelect').on('click', function () {
                        $(this).closest('.temp').find('.titleContainer').removeClass('d-none');
                        $(this).closest('.popoverSelect').addClass('d-none');

                        $("body .popover").addClass('isPopoverLoaded');
                        $("body .popover").popover('hide');
                        $("#tabuListUl").empty();
                        var $scope = angular.element($("#calendar")).scope();
                        $('.temp').find('.titleContainer').removeClass('d-none');
                        $('.popoverSelect').addClass('d-none');

                    });
                }
                var $scope = angular.element($("#calendar")).scope();
                _.each($scope.totalSelectListTagify, function (item, key) {
                    var param = {};
                    var input = document.getElementById('tag-input' + item.fieldName);
                    if (input != null) {
                        // init Tagify script on the above inputs                     
                        var tempWhiteControl = $("#tag-inputHidden" + item.fieldName).val();
                        var tempWhiteList = [];
                        var tempWh2 = [];
                        if (tempWhiteControl != undefined && tempWhiteControl != "") {
                            tempWhiteList = tempWhiteControl;
                            tempWhiteList = tempWhiteList.replace(/'/g, '"');
                            tempWhiteList = JSON.parse(tempWhiteList);
                            var newList = [];
                            if (tempWhiteList.length > 0) {
                                if (tempWhiteList[0].value != undefined) {
                                    _.each(tempWhiteList, function (itemtag) {
                                        newList.push(itemtag.value);
                                    });
                                } else {
                                    newList = tempWhiteList;
                                }
                            }
                            tempWhiteList = newList.join();
                            tempWh2 = tempWhiteList.split(",");
                            input.value = tempWhiteList;
                            var tmp = [tempWhiteList];
                        }
                        item.tagify = new Tagify(input, {
                            whitelist: tempWh2,
                            maxTags: 10,
                            dropdown: {
                                maxItems: 20,           // <- mixumum allowed rendered suggestions
                                classname: "tags-look", // <- custom classname for this dropdown, so it could be targeted
                                enabled: 0,             // <- show suggestions on focus
                                closeOnSelect: false    // <- do not hide the suggestions dropdown once an item has been selected
                            }
                        });
                        if (item.tagify.on != undefined) {
                            item.tagify.on('add', onAddTag)
                            item.tagify.on('invalid', onInvalidTag)
                            item.tagify.on('remove', onRemoveTag)
                            item.tagify.on('edit', onTagEdit)
                        }
                    }
                });
                var param = {};
                var selectedId = $("#tag-inputHidden").val();
                param.selectedId = selectedId;
                $scope.getTabulatorListFromEvents(param);
                $scope.rootScopeSafe();
            }, 800);
            $(document).on('click', function (e) {
                if ($('.favicon-loader-overlay.active').length) {
                }
                else {
                    if (!$(e.target).closest('.popover.show').length && !$(e.target).closest('.fc-content').length) {
                        //$(document).find('.popover.show').remove()
                        $("body .popover").addClass('isPopoverLoaded');
                        $("body .popover").popover('hide');
                        $("#tabuListUl").empty();
                        var $scope = angular.element($("#calendar")).scope();
                        $('.temp').find('.titleContainer').removeClass('d-none');
                        $('.popoverSelect').addClass('d-none');
                    }
                }
            });
        },
        eventAfterAllRender: function (event, element, view) {

            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');

            if (current_tab == "agenda-view") {
                var $scope = angular.element($("#calendar")).scope();
                $scope.$parent.$parent.IND_loading = false;
                setTimeout(function () {
                    $.unblockUI();
                }, 1000);
            } else {
                $.unblockUI();
            }
            setTimeout(function () {
                jQuery.curCSS = function (element, prop, val) {
                    return jQuery(element).css(prop, val);
                };
                $('.fc-content').bstooltip();
                $('.fc-timeline-event').bstooltip();
                $('.fc-list-item').bstooltip();
                $('.fc-day-grid-event').bstooltip();
                $('.fc-time-grid-event').bstooltip();
            }, 500);
        },
    },


        // List View
        myOptions = {
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'listDay,listWeek,listMonth,listYear'
            },
            // customize the button names,
            // otherwise they'd all just say "list"
            views: {
                listDay: { buttonText: 'day' },
                listWeek: { buttonText: 'week' },
                listMonth: { buttonText: 'month' },
                listYear: { buttonText: 'year' }
            },
            defaultView: 'listDay',
            defaultDate: new Date(),
            // events: calenderData,
            events: function (start, end, timezone, callback) {

                var $scopeVar = angular.element($("#calendar")).scope();
                var param = {};
                param.action = 1;
                param.formId = $scopeVar.currentFormId;

                param.isCalender = 1;
                param.isEvent = 1;

                param.resourceFormId = $scopeVar.ySelection;
                param.ActivityFormId = $scopeVar.xSelection;
                var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
                var view = $('#' + current_tab + ' div.calendar').fullCalendar('getView');
                param.filter = {};
                param.filter = changeStateOfCalender(view, start, end);
                param.filter.field = "start";
                $.ajax({
                    method: 'POST',
                    url: BASE_URL + "/FormAPI/getReferralFormFields",
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify(param),
                    success: function (response) {
                        $.unblockUI();
                        var calenderData = changeResourceIDByYSelection((response.events != undefined) ? response.events : response.events);
                        callback(calenderData);
                    },
                    beforeSend: function () {
                        showLoader();
                    },
                    complete: function () {
                        var _ScrollOffset = window["scrollOffset"];
                        window.scrollTo(0, _ScrollOffset);
                        $.unblockUI();
                        // $("#" + current_tab + " div.calendar").unblock();
                    }
                });
            },
            allDaySlot: true
        };
    var calendarOptions = $.extend({}, defaultOptions, myOptions);
    $('#list-view div.calendar').fullCalendar(calendarOptions);

    


    //new FullCalendar.Calendar($('#list-view div.calendar'), calendarOptions);
    //tagyfiy on blur
    function onTagifyFocusBlur(e) {
        //console.log(e.type, "event fired")
    }
    // tag added callback
    function onAddTag(e) {
        var id = $("#tag-inputHidden").val();
        var fieldName = $("#tag-inputHidden" + id).val();
        var $scope = angular.element($("#calendar")).scope();
        var param = {};
        var list = [];
        param.fieldName = fieldName;
        _.each(e.detail.tagify.value, function (item) {
            list.push('"' + item.value + '"');
        });
        param.fieldDataText = "[" + list.join(',') + "]";
        param.formId = $scope.currentFormId;
        param.Id = id;
        $scope.updateRowDataRecord(param);
    }
    // tag remvoed callback
    function onRemoveTag(e) {
        var id = $("#tag-inputHidden").val();
        var fieldName = $("#tag-inputHidden" + id).val();
        var $scope = angular.element($("#calendar")).scope();
        var param = {};
        var list = [];
        param.fieldName = fieldName;
        _.each(e.detail.tagify.value, function (item) {
            list.push('"' + item.value + '"');
        });
        param.fieldDataText = "[" + list.join(',') + "]";
        param.Id = id;
        param.formId = $scope.currentFormId;
        $scope.updateRowDataRecord(param);
    }
    function onTagEdit(e) {
        //console.log("onTagEdit: ", e.detail);
    }
    // invalid tag added callback
    function onInvalidTag(e) {
        //console.log("onInvalidTag: ", e.detail);
    }
    // timeLine resource view
    function addExternalEvent(eventData) {
        window["scrollOffset"] = $(window).scrollTop();
        var eventBasicData = window["EventBasicDetail"];
        var checkExists = window["CalendarEventList"];
        var actFormIdParam = window["xSelected"];
        var resFormIdParam = window["ySelected"];
        var param = {};
        param.action = eventBasicData.action;
        param.formId = eventBasicData.formId;
        param.userId = eventBasicData.userId;
        param.isDyEvent = true;
        param.topicId = eventBasicData.formData.topicId;
        param.created_by = eventBasicData.created_by;
        param.update_by = eventBasicData.update_by;
        param.formGroupKey = eventBasicData.formGroupKey;
        var tempGroup = create_UUID();
        var service = ''; var description = '';
        if (activitiesCategory != null) {
            service = eventData.service;
            description = eventData.description;
        }
        var formfieldDataListTempData = [];
        formfieldDataListTempData = [
            { "name": "title", "value": "" },
            { "name": "start", "value": eventData.start },
            { "name": "end", "value": eventData.end },
            { "name": "color", "value": eventData.color },
            { "name": "allDay", "value": eventData.allDay },
            { "name": "service", "value": service },
            { "name": "description", "value": description },
            { "name": "resources", "value": eventData.resourceId },
            { "name": "resourcesTitle", "value": eventData.resources },
            { "name": "activities", "value": eventData.id },
            { "formGroupKey": eventBasicData.formGroupKey, "name": "formGroupKey", "value": eventBasicData.formGroupKey }
        ];
        var exists = _.filter(checkExists, function (item) {
            return compareEventStartEndDateTime(eventData, item)
                && (item.resourceId == eventData.resourceId ||
                    item.resources == eventData.resourceId);
        });

        if (exists.length > 0) {
            _.each(exists, function (item) {
                var tempformentryidList = item.customFormIds.split(",");
                item.customFormIdsSplit = tempformentryidList;
            });
            exists = _.filter(exists, function (item) { return item.customFormIdsSplit.length == 2 });
            if (exists.length > 0) {
                //make it ready for update
                param.isEventUpdatable = true;
                if (eventData.formGroupKey != undefined) {
                    param.action = 2;//for updte.
                } else {
                    param.action = 1;
                    param.formGroupKey = tempGroup;
                    param.isEventUpdatable = false;
                    var temp = _.findWhere(formfieldDataListTempData, { name: "formGroupKey" });
                    if (temp != null) {
                        temp.value = param.formGroupKey;
                        temp.formGroupKey = param.formGroupKey;
                    }
                }
                exists = exists[0];
                formfieldDataListTempData.push({ "name": "parentID", "value": exists.Id });
                param.parentID = exists.Id;
                var seperatedResColValues = exists.seperatedResColValues;
                var seperatedColorValues = exists.seperatedColorValues;
                if (seperatedResColValues != null && seperatedResColValues.toString() !== "") {
                    param.seperatedResColValues = seperatedResColValues + "," + eventData.resources.toString();
                }
                else {
                    param.seperatedResColValues = eventData.resources.toString();
                }
                // color values
                if (seperatedColorValues != null && seperatedColorValues.toString() !== "") {
                    param.seperatedColorValues = seperatedColorValues + "/" + eventData.color.toString();
                }
                else {
                    param.seperatedColorValues = eventData.colColorValue.toString()
                }
            }
            else {
                formfieldDataListTempData.push({ "name": "parentID", "value": 0 });
                param.parentID = 0;
                param.seperatedFormIDs = window["xSelected"].toString() + "," + window["ySelected"].toString();
                param.seperatedTitles = eventData.title + "," + eventData.dropinTitle //eventData.colActivityValue.toString() + " - " + eventData.colCategoryValue.toString() + " in " + eventData.dropin.toString();
                param.seperatedResFormIDs = window["ySelected"].toString() + "," + window["xSelected"].toString();
                param.seperatedResEntryIDs = eventData.resourceId.toString() + "," + eventData.id.toString();
                param.seperatedResColValues = eventData.resources.toString() + "," + eventData.activities.toString();
                param.seperatedColorValues = eventData.color.toString() + "/" + eventData.colColorValue.toString();
                param.seperatedIds = eventData.id.toString() + "," + eventData.resourceId.toString();
                param.isEventUpdatable = false;
                eventBasicData.formGroupKey = create_UUID();
            }
        }
        else {
            formfieldDataListTempData.push({ "name": "parentID", "value": 0 });
            param.parentID = 0;
            param.seperatedFormIDs = window["xSelected"].toString() + "," + window["ySelected"].toString();
            param.seperatedTitles = eventData.title + "," + eventData.dropinTitle //eventData.colActivityValue.toString() + " - " + eventData.colCategoryValue.toString() + " in " + eventData.dropin.toString();
            param.seperatedResFormIDs = window["ySelected"].toString() + "," + window["xSelected"].toString();
            param.seperatedResEntryIDs = eventData.resourceId.toString() + "," + eventData.id.toString();
            param.seperatedResColValues = eventData.resources.toString() + "," + eventData.activities.toString();
            param.seperatedColorValues = eventData.color.toString() + "/" + eventData.colColorValue.toString();
            param.seperatedIds = eventData.id.toString() + "," + eventData.resourceId.toString();
            param.isEventUpdatable = false;
            eventBasicData.formGroupKey = create_UUID();
        }
        param.formfieldDataListTemp = formfieldDataListTempData;
        var isAllowToUpdate = false;
        if (typeof seperatedTitles !== "undefined" && seperatedTitles !== "" && seperatedTitles !== null) {
        }

        $.ajax({
            method: 'POST',
            url: BASE_URL +"FormAPI/GeneratedFormData",
            dataType: 'json',
            contentType: "application/json",
            data: "{'action':" + param.action + ",'userId':" + param.userId + ",'formId':" + param.formId + ",'resourceFormId':" + resFormIdParam + ",'ActivityFormId':" + actFormIdParam + ",'parentID':" + param.parentID + ",'isDyEvent':" + param.isDyEvent + ",'isEventUpdatable':" + param.isEventUpdatable + ",'seperatedResColValues':'" + param.seperatedResColValues + "','seperatedColorValues':'" + param.seperatedColorValues + "',   'topicId':" + param.topicId + ",'created_by':" + param.created_by + ",'updated_by':" + param.update_by + ",'formGroupKey':'" + param.formGroupKey + "','formfieldDataListTemp':'" + JSON.stringify(param.formfieldDataListTemp) + "'}", //$.param(formData)
            beforeSend: function () {
                showLoader();
            },
            success: function (response) {
                if (response.res > 0 && param.action == 1) {
                    param.resourceFormId = resFormIdParam;
                    param.activityFormId = actFormIdParam;
                    param.resourceId = eventData.resourceId.toString();
                    param.activityId = eventData.id.toString();
                    manageOneToManyReferrenceForm(param);
                    param.activities = eventData.activities;
                    var calenderNewRow = {
                        Id: response.Id,
                        label: null,
                        selected: false,
                        value: response.Id,
                        color: eventData.color,
                        title: "",
                        start: eventData.start,
                        end: eventData.end,
                        allDay: eventData.allDay,
                        resourceId: eventData.resourceId,
                        resources: eventData.resources,
                        service: service,
                        description: description,
                        activities: eventData.activities,
                        customTitle: eventData.dropinTitle + ',' + param.activities.toString(),
                        customForms: eventData.resFormID + ',' + param.activityFormId.toString(),
                        customFormIds: eventData.resourceId + ',' + param.activityId.toString(),
                        parentID: 0,
                        formGroupKey: param.formGroupKey
                    };
                    var activityNewRow = {
                        Id: response.Id,
                        label: null,
                        selected: false,
                        value: response.Id,
                        color: eventData.color,
                        title: "",
                        start: eventData.start,
                        end: eventData.end,
                        allDay: eventData.allDay,
                        resourceId: eventData.id,
                        resources: eventData.resources,
                        service: service,
                        description: description,
                        activities: eventData.activities,
                        customTitle: eventData.dropinTitle + ',' + param.activities.toString(),
                        customForms: eventData.resFormID + ',' + param.activityFormId.toString(),
                        customFormIds: eventData.resourceId + ',' + param.activityId.toString(),
                        parentID: 0,
                        formGroupKey: param.formGroupKey
                    };
                    var oneToManyNewRow = {
                        Id: response.Id,
                        label: null,
                        selected: false,
                        value: response.Id,
                        color: eventData.color,
                        title: "",
                        start: eventData.start,
                        end: eventData.end,
                        allDay: eventData.allDay,
                        resourceId: eventData.resourceId,
                        resources: eventData.resources,
                        service: service,
                        description: description,
                        activities: eventData.activities,
                        customTitle: eventData.dropinTitle + ',' + param.activities.toString(),
                        customForms: eventData.resFormID + ',' + param.activityFormId.toString(),
                        customFormIds: eventData.resourceId + ',' + param.activityId.toString(),
                        parentID: 0,
                        formGroupKey: param.formGroupKey
                    };
                    var CalendarEventList = window["CalendarEventList"];
                    var ActivityEventList = window["ActivityEventList"];
                    eventBasicData.formData.FormDataToOneListDynamic.push(oneToManyNewRow);
                    CalendarEventList.push(calenderNewRow);
                    ActivityEventList.push(activityNewRow);
                    window["CalendarEventList"] = CalendarEventList;
                    window["ActivityEventList"] = ActivityEventList;
                    refreshEventResourcesActivity('BasicView', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, ActivityEventList);
                    window["EventBasicDetail"] = eventBasicData;
                    $.jGrowl(response.Message, { position: 'center' });
                    var _ScrollOffset = window["scrollOffset"];
                    window.scrollTo(0, _ScrollOffset);
                }
                else if (response.res > 0 && param.action == 2) {
                    try {
                        var CalendarEventList = window["CalendarEventList"];
                        var ActivityEventList = window["ActivityEventList"];
                        var oneToManyList = eventBasicData.formData.FormDataToOneListDynamic;
                        var CalenderEditableRow = $.grep(CalendarEventList, function (e) {
                            return e.Id == exists.Id;
                        });
                        if (CalenderEditableRow.length > 0) {
                            param.resourceFormId = resFormIdParam;
                            param.activityFormId = actFormIdParam;
                            param.resourceId = eventData.resourceId.toString();
                            param.activityId = eventData.id.toString();
                            param.formGroupKey = CalenderEditableRow[0].formGroupKey;
                            manageOneToManyReferrenceForm(param);
                        }
                        var ActivityEditableRow = $.grep(ActivityEventList, function (e) {
                            return e.Id == exists.Id;
                        });
                        var oneToManyListEditableRow = $.grep(oneToManyList, function (e) {
                            return e.Id == exists.Id;
                        });
                        CalenderEditableRow[0].customTitle += " ," + eventData.activities.toString();
                        CalenderEditableRow[0].customForms += " ," + eventData.actFormID.toString();
                        CalenderEditableRow[0].customFormIds += " ," + eventData.id.toString();
                        CalenderEditableRow[0].seperatedIds = param.seperatedIds;
                        CalenderEditableRow[0].seperatedTitles = param.seperatedTitles;
                        CalenderEditableRow[0].seperatedFormIDs = param.seperatedFormIDs;
                        CalenderEditableRow[0].parentID = param.parentID;
                        CalenderEditableRow[0].seperatedResFormIDs = param.seperatedResFormIDs;
                        CalenderEditableRow[0].seperatedResEntryIDs = param.seperatedResEntryIDs;
                        CalenderEditableRow[0].seperatedResColValues = param.seperatedResColValues;
                        CalenderEditableRow[0].seperatedColorValues = param.seperatedColorValues;
                        CalenderEditableRow[0].formGroupKey = param.formGroupKey;
                        ActivityEditableRow[0].seperatedIds = param.seperatedIds;
                        ActivityEditableRow[0].seperatedTitles = param.seperatedTitles;
                        ActivityEditableRow[0].seperatedFormIDs = param.seperatedFormIDs;
                        ActivityEditableRow[0].customTitle += " ," + eventData.activities.toString();
                        ActivityEditableRow[0].customForms += " ," + eventData.actFormID.toString();
                        ActivityEditableRow[0].customFormIds += " ," + eventData.id.toString();
                        ActivityEditableRow[0].parentID = param.parentID;
                        ActivityEditableRow[0].seperatedResFormIDs = param.seperatedResFormIDs;
                        ActivityEditableRow[0].seperatedResEntryIDs = param.seperatedResEntryIDs;
                        ActivityEditableRow[0].seperatedResColValues = param.seperatedResColValues;
                        ActivityEditableRow[0].seperatedColorValues = param.seperatedColorValues;
                        ActivityEditableRow[0].formGroupKey = param.formGroupKey;
                        oneToManyListEditableRow[0].seperatedIds = param.seperatedIds;
                        oneToManyListEditableRow[0].seperatedTitles = param.seperatedTitles;
                        oneToManyListEditableRow[0].seperatedFormIDs = param.seperatedFormIDs;
                        oneToManyListEditableRow[0].customTitle += " ," + eventData.activities.toString();
                        oneToManyListEditableRow[0].customForms += " ," + eventData.actFormID.toString();
                        oneToManyListEditableRow[0].customFormIds += " ," + eventData.id.toString();
                        oneToManyListEditableRow[0].parentID = param.parentID;
                        oneToManyListEditableRow[0].seperatedResFormIDs = param.seperatedResFormIDs;
                        oneToManyListEditableRow[0].seperatedResEntryIDs = param.seperatedResEntryIDs;
                        oneToManyListEditableRow[0].seperatedResColValues = param.seperatedResColValues;
                        oneToManyListEditableRow[0].seperatedColorValues = param.seperatedColorValues;
                        oneToManyListEditableRow[0].formGroupKey = param.formGroupKey;
                        var filteredEventsCalender = $.grep(CalendarEventList, function (e) {
                            return e.Id != exists.Id;
                        });
                        var filteredEventsActivity = $.grep(ActivityEventList, function (e) {
                            return e.Id != exists.Id;
                        });
                        var filteredoneToManyList = $.grep(oneToManyList, function (e) {
                            return e.Id != exists.Id;
                        });
                        filteredEventsCalender.push(CalenderEditableRow[0]);
                        filteredEventsActivity.push(ActivityEditableRow[0]);
                        filteredoneToManyList.push(oneToManyListEditableRow[0]);
                        eventBasicData.formData.FormDataToOneListDynamic = filteredoneToManyList;
                        _.each(filteredEventsCalender, function (dataRow, position) {
                            var rowRecord = dataRow;
                            var seperatedFormIDsParam = dataRow.customForms;
                            var seperatedIdsParam = dataRow.customFormIds != undefined ? dataRow.customFormIds : dataRow.customFormIds;
                            var seperatedTitleParam = dataRow.customTitle;
                            var commaIDs = seperatedIdsParam.split(',');
                            var commaVals = seperatedFormIDsParam.split(',');
                            var ySelected = window["ySelected"];
                            _.each(commaVals, function (idVal, pos) {
                                if (idVal.trim() == ySelected.toString()) {
                                    dataRow.resFormID = idVal;
                                    dataRow.resources = commaIDs[pos];
                                    dataRow.resourceId = commaIDs[pos];
                                }
                            })
                        });
                        window["CalendarEventList"] = filteredEventsCalender;
                        window["ActivityEventList"] = filteredEventsActivity;
                        refreshEventResourcesActivity('BasicView', filteredEventsCalender, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, filteredEventsActivity);
                        window["EventBasicDetail"] = eventBasicData;
                        $.jGrowl(response.Message, { position: 'center' });
                    }
                    catch (e) {
                        $.jGrowl(response.Message, { position: 'center' });
                        var _ScrollOffset = window["scrollOffset"];
                        window.scrollTo(0, _ScrollOffset);
                        $.unblockUI();
                    }
                }
                else {
                    var _ScrollOffset = window["scrollOffset"];
                    window.scrollTo(0, _ScrollOffset);
                    if (response.res == -1) {
                        var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
                        $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                        swal({ type: 'error', title: '', text: response.Message });

                    } else {
                        swal({ type: 'error', title: '', text: "failed" });
                    }

                }
            },
            complete: function () {
                var _ScrollOffset = window["scrollOffset"];
                window.scrollTo(0, _ScrollOffset);
                $.unblockUI();
            }
        });
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
            if (dialog.length > 2) {
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
            }

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
            var current_subtab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').find('.ui-state-active').attr('class');
            var allDayCustom = "false";
            if (current_subtab) {
                allDayCustom = (current_subtab.contains('fc-timelineMonth-button') || current_subtab.contains('fc-timelineYear-button')).toString();
            }
            var eventExtData = $(this).data('event');
            var resource = $("#" + current_tab + " .calendar").fullCalendar('getResourceById', resourceId);
            var title = eventExtData.title ? eventExtData.title : '';
            var id = eventExtData.id ? eventExtData.id : '';
            var resFormIdParam = window["ySelected"];
            var actFormIdParam = window["xSelected"];
            var resourceColumn = window["currResColumn"];
            var majorColumn = window["currMajorColumn"];
            var resourceValue = '', activityValue = title;
            var titleColActivity = eventExtData.activityfield;
            var titleColCategory = eventExtData.categoryfield;
            var titleColColor = eventExtData.colorfield;
            var dropin = eventExtData.dropin;
            var groupingfieldsresParam = eventExtData.groupingfieldsres;
            var dropinTitle = ""; var isAllowService = false;
            if (groupingfieldsresParam !== undefined && groupingfieldsresParam.length > 0) {
                groupingfieldsresParam = groupingfieldsresParam.split('-');
                _.each(groupingfieldsresParam, function (value, key) {
                    if (dropinTitle === "") {
                        dropinTitle = resource[value.trim()];
                    }
                    else
                        dropinTitle += " - " + resource[value.trim()];
                });
            }
            if (eventExtData.dimensiontype == "2D") {
                eventExtData.groupingvaluesact = eventExtData.title;
            }
            var colActivityValue = ""; var colCategoryValue = ""; var colColorValue = "";
            if (typeof resource[resourceColumn] != 'undefined') {
                resourceValue = resource[resourceColumn];
                if (eventExtData.dimensiontype == "2D")
                    dropinTitle = resourceValue;
            }
            if (typeof resource[titleColActivity] != 'undefined') {
                colActivityValue = resource[titleColActivity];
            }
            if (typeof resource[titleColCategory] != 'undefined') {
                colCategoryValue = resource[titleColCategory];
            }
            if (typeof resource[titleColColor] != 'undefined') {
                colColorValue = resource[titleColColor];
            }
            var defaultDuration = moment.duration(eventExtData.duration);
            var end = date.clone().add(defaultDuration);
            var exists = _.findWhere($scopeVar.calenderSettingsFormDetailsDataList, { activitiesForm: parseInt(eventExtData.formid) });
            if (exists != undefined) {
                if (exists.durationField == "0") {
                    allDayCustom = "true";
                } else {
                    allDayCustom = "false";
                }
            }
            var startCustom = date.format();
            var endCustom = end.format();
            if (allDayCustom == "true") {
                startCustom = date.format("YYYY-MM-DD");
                startCustom = moment(startCustom + " 00:00:00");
                endCustom = date.format("YYYY-MM-DD");
                let initialdate = endCustom;
                let start_time = '23:59:59';
                endCustom = moment(initialdate + " " + start_time);
            }
            else {
                allDayCustom = "false";
                if (eventExtData.duration == null || eventExtData.duration == "" || eventExtData.duration == undefined || exists.duration == "0") {
                    allDayCustom = "true";
                    startCustom = date.format("YYYY-MM-DD");
                    startCustom = moment(startCustom + " 00:00:00");
                    endCustom = date.format("YYYY-MM-DD");
                    let initialdate = endCustom;
                    let start_time = '23:59:59';
                    endCustom = moment(initialdate + " " + start_time);
                }
            }
            if ($('#allDay-check').is(':checked')) {
                allDayCustom = "true";
                startCustom = date.format("YYYY-MM-DD");
                startCustom = moment(startCustom + " 00:00:00");
                endCustom = date.format("YYYY-MM-DD");
                let initialdate = endCustom;
                let start_time = '23:59:59';
                endCustom = moment(initialdate + " " + start_time);
            }
            else {
                if (current_subtab.contains("fc-timelineDay-button") || current_subtab.contains("fc-agendaDay-button")) {

                }
                else {
                    allDayCustom = "true";
                    startCustom = date.format("YYYY-MM-DD");
                    startCustom = moment(startCustom + " 00:00:00");
                    endCustom = date.format("YYYY-MM-DD");
                    let initialdate = endCustom;
                    let start_time = '23:59:59';

                    endCustom = moment(initialdate + " " + start_time);
                }

            }
            var eventData = {
                id: id,
                title: eventExtData.groupingvaluesact,
                color: eventExtData.color,
                allDay: allDayCustom,
                start: startCustom,
                end: endCustom,
                resFormID: resFormIdParam,
                actFormID: actFormIdParam,
                resourceId: resourceId,
                resources: resourceValue,
                activities: activityValue,
                colActivityValue: colActivityValue,
                colCategoryValue: colCategoryValue,
                colColorValue: colColorValue,
                dropin: dropin,
                dimensionType: eventExtData.dimensiontype,
                dropinTitle: dropinTitle
            };
            var checkExists = window["eventListTemp"];
            var exists = _.filter(checkExists, function (item) {
                return compareEventStartEndDateTime(eventData, item) && (item.resourceId == eventData.resourceId ||
                    item.resources == eventData.resourceId);
            });
            if (exists.length > 0) {
                exists = _.filter(exists, function (item) { return item.customFormIdsSplit.length == 2 });
                if (exists.length > 0) {
                    var listExisting = angular.copy(exists);
                    exists = exists[0];
                    eventData.formGroupKey = exists.formGroupKey;
                    var seperatedIds = exists.customFormIds;
                    var comma = seperatedIds.split(',');
                    var _droppedForms = exists.customForms;
                    var _arr0 = _droppedForms.split(',');
                    var _checkIfExists = true;
                    _.each(_arr0, function (_row, _pos) {
                        if (_row.toString().trim() === actFormIdParam.toString()) {
                            _checkIfExists = false;
                            //break;
                        }

                    });
                    var _checkIfExistsIds = false;
                    var _droppedFormsIds = exists.customFormIds;
                    var _arr1 = _droppedFormsIds.split(',');
                    _.each(listExisting, function (item) {
                        var formlist = item.customForms.split(',');
                        var formIdslist = item.customFormIds.split(',');
                        // 
                        var formExist = _.filter(formlist, function (formItem) { return formItem.toString().trim() === actFormIdParam.toString() });
                        var formIdExist = _.filter(formIdslist, function (formIdItem) { return formIdItem.toString().trim() === eventData.id.toString() });
                        if (formExist.length > 0 && formIdExist.length > 0) {
                            _checkIfExistsIds = true;
                        }
                    });
                    if (!_checkIfExists) {
                        var checkOverlapping = _.where($scopeVar.calenderSettingsFormDetailsDataList, { resourceActivityForm: actFormIdParam });
                        if (checkOverlapping.length > 0) {
                            var eventOverlapping = _.filter(checkOverlapping, function (item) {
                                return item.eventOverlap == "1" || item.activitiesOverlap == "1";
                            });
                            // 
                            if (eventOverlapping.length > 0 && _checkIfExistsIds) {
                                eventData.formGroupKey = undefined;
                                if (!_checkIfExistsIds) {
                                    $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                                    swal({ type: 'error', title: '', text: 'cannot overlap same dimension entry in same timeslot' });
                                    return false;
                                }
                                else {
                                    generateEvent(eventData, eventExtData, date, end, resourceValue);
                                }
                            } else {
                                if (comma.length > 1 && !_checkIfExists && _checkIfExistsIds) {
                                    $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                                    swal({ type: 'error', title: '', text: 'cannot drop same dimension more than once in same event' });
                                    return false;
                                } else {
                                    eventData.formGroupKey = undefined;
                                    generateEvent(eventData, eventExtData, date, end, resourceValue);
                                }
                            }
                        } else {
                            $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                            swal({ type: 'error', title: '', text: 'cannot drop same dimension more than once in same event' });
                            return false;
                        }
                    }
                    else if (_checkIfExists) {
                        if (resourceValue !== '') {
                        }
                        if (eventData.title !== '') {
                            addExternalEvent(eventData);
                        }
                    }
                }
                else {
                    generateEvent(eventData, eventExtData, date, end, resourceValue);
                }
                //var comma = seperatedIds.split(',');
                //if (comma.length > 2) {
                //    $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                //    return false;
                //}
                //else {
                //    var _droppedForms = exists.customForms;
                //    var _arr0 = _droppedForms.split(',');
                //    var _checkIfExists = true;
                //    angular.forEach(_arr0, function (_row, _pos) {
                //        if (_row.toString().trim() === actFormIdParam.toString()) {
                //            _checkIfExists = false;
                //            //break;
                //        }

                //    });
                //    var _checkIfExistsIds = false;
                //    var _droppedFormsIds = exists.customFormIds;
                //    var _arr1 = _droppedFormsIds.split(',');
                //   _.each(listExisting, function (item) {
                //        var formlist = item.customForms.split(',');
                //        var formIdslist = item.customFormIds.split(',');
                //        var formExist = _.filter(formlist, function (formItem) { return formItem.toString().trim() === actFormIdParam.toString() });
                //        var formIdExist = _.filter(formIdslist, function (formIdItem) { return formIdItem.toString().trim() === eventData.id.toString() });
                //        if (formExist.length > 0 && formIdExist.length > 0) {
                //            _checkIfExistsIds = true;
                //        }
                //    });                
                //    if (!_checkIfExists) {
                //        var checkOverlapping = _.where($scopeVar.calenderSettingsFormDetailsDataList, { resourceActivityForm: actFormIdParam });
                //        if (checkOverlapping.length > 0) {
                //            var eventOverlapping = _.filter(checkOverlapping, function (item) {
                //                return item.eventOverlap == "1" || item.activitiesOverlap == "1";
                //            });
                //            if (eventOverlapping.length > 0 && _checkIfExistsIds) {
                //                eventData.formGroupKey = undefined;
                //                if (!_checkIfExistsIds) {
                //                    $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                //                    swal({ type: 'error', title: '', text: 'cannot overlap same dimension entry in same timeslot' });
                //                    return false;
                //                }
                //                else {
                //                    generateEvent(eventData, eventExtData, date, end, resourceValue);
                //                }
                //            } else {
                //                if (comma.length > 1 && !_checkIfExists && _checkIfExistsIds) {
                //                    $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                //                    swal({ type: 'error', title: '', text: 'cannot drop same dimension more than once in same event' });
                //                    return false;
                //                } else {
                //                    eventData.formGroupKey = undefined;
                //                    generateEvent(eventData, eventExtData, date, end, resourceValue);
                //                }
                //            }
                //        } else {
                //            $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                //            swal({ type: 'error', title: '', text: 'cannot drop same dimension more than once in same event' });
                //            return false;
                //        }
                //    }                  
                //    else if (_checkIfExists) {
                //        if (resourceValue !== '') {                           
                //        }
                //        if (eventData.title !== '') {
                //            addExternalEvent(eventData);
                //        }
                //    }                   
                //}
            }
            else {
                generateEvent(eventData, eventExtData, date, end, resourceValue);
            }
        }
    };
    function generateEvent(eventData, eventExtData, date, end, resourceValue) {
        var dropinTitle = ""; var isAllowService = false;
        //for activity category && overlap check.
        var postData = {
            action: 33,
            userId: eventData.userid,
            formId: eventData.formID,
            ActivityFormId: eventExtData.formid,
            ActivityId: eventExtData.id,
            ActivityFields: eventExtData.servicefield,
            resourceId: eventData.resourceId,
            isActivityCategory: 1,
            resEntryColumn: eventData.activitiesCategory,
            compareColumn: eventData.activityField,
            compareValue: eventExtData.title,
            startDate: date.format(),
            endDate: end.format(),
            eventOverlap: eventData.eventOverlap,
            activitiesOverlap: eventData.activitiesOverlap,
            isResourceExternalDrop: true

        }
        // select a category    eventExtData.servicefield !== '' && eventExtData.servicefield != null
        if (isAllowService) {
            async function callCategory(eventData) {
                // inputOptions can be an object or Promise
                const inputOptions = new Promise((resolve) => {
                    $.post(BASE_URL + "/FormAPI/getReferralFormFields", postData, function (response) {
                        if (typeof response.overlapMesage !== 'undefined') {
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
                                }
                            }
                            if (Object.keys(resolveCategory).length > 1) {
                                resolve(resolveCategory);
                            } else {
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
                                    if (result.value) {
                                        var service = $.trim(result.value[0]), description = $.trim(result.value[1]);
                                        if (resourceValue !== '')
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
                    if (result.value) {
                        var service = $.trim(result.value[0]), description = $.trim(result.value[1]);
                        if (eventData.resources !== '') {
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
        }
        else {
            if (resourceValue !== '') {
            }
            if (eventData.title !== '') {
                addExternalEvent(eventData);
            }
        }
    };
    function GetCalendarDateRange() {
        var calendar = $('#timeline-resource-view div.calendar').fullCalendar('getCalendar');
        var view = calendar.view;
        var start = view.start._d;
        var end = view.end._d;
        var dates = { start: start, end: end };
        return dates;
    }
    setTimeout(function () {
        $.unblockUI();
    }, 500);
}

function loadCalendarold1(calenderType, calenderData, resourceData, resColumns, activityFormData, activityColumn, activityEvents) {
    try {
        if (calenderData.length > 0)
            showLoader();
        else
            $.unblockUI();
    }
    catch (e) {
        $.unblockUI();
    }
    calenderData = changeResourceIDByYSelection((calenderData.data != undefined) ? calenderData.data : calenderData);
    window["eventListTemp"] = calenderData;
    var $scopeVar = angular.element($("#calendar")).scope();
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
    var userid = 0;
    if (localStorage.detail != undefined && localStorage.detail != "")
        userid = JSON.parse(localStorage.detail).Id;
    var activitiesCategory = basicDetails.formData.activitiesCategory;
    if (activitiesCategory == '' || activitiesCategory == null)
        activitiesCategory = '0';
    var overlapField = basicDetails.formData.overlapField; // value of activity radioButton field   (for overlap)
    var calendarOptions = '';
 
    // managing resource ordering  data .
    var _ColumnResults = [];
 
    var tagify = "";

    var defaultOptions = {
        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
        theme: true,
        themeSystem: 'jquery-ui',
        //  themeSystem:'bootstrap4',
        nowIndicator: true,
        slotDuration: '00:15:00',
        // defaultTimedEventDuration: defaultDuration,
        //aspectRatio: 1.5,
        defaultDate: new Date(),
        eventMouseover: function (event, jsEvent, view) {
            if (view.name !== 'agendaDay') {
                ////console.log(event);
                $(jsEvent.target).attr('title', event.title);
            }
        },
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
            //  revertFunc();

            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            if (current_tab === "vertical-activities-view") {
                revertFunc();
                return;
            }


            //console.log('event is');
            //console.log(event);
            var isInternalDropParam = true;
            window["scrollOffset"] = $(window).scrollTop();
            var eventBasicData = window["EventBasicDetail"];
            var eventExtData = $(this).data('event');
            var resourceValue = '', title = '';
            var Id = 0;
            if (typeof event.Id === "undefined")
                Id = event.value;
            else
                Id = event.Id;
            title = event.title;
            var actFormId = event.formId;
            var resFormId = window["ySelected"];
            var activityFormId = window["xSelected"];
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
            var allDay = event.allDay;
            var formfieldDataListTempData = [];
            //console.log(eventExtData);

            var $scope = angular.element($("#calendar")).scope();

            ////console.log(event);
            //alert(event.title + " end is now " + event.end.format());
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            if (!confirm("Are you sure about this change?")) {
                revertFunc();
            } else {
                if (event.resourceId) {
                    var resource = $("#" + current_tab + " .calendar").fullCalendar('getResourceById', event.resourceId);
                    var activity = $("#vertical - activities - view" + " .calendar").fullCalendar('getResourceById', event.activities);
                    var titleModifiedPart = ""; var majorGroupSplits = [];
                    if (resource && typeof resource[resourceColumn] != 'undefined') {
                        resourceValue = resource[resourceColumn];
                        titleModifiedPart = resourceValue;
                        if (typeof majorGroup !== undefined)
                            majorGroupSplits = majorGroup.split(',');
                        if (majorGroupSplits.length > 0) {
                            _.each(majorGroupSplits, function (value, pos) {
                                if (value != "") {
                                    if (titleModifiedPart !== "")
                                        titleModifiedPart += "-" + resource[value].toString();
                                    else
                                        titleModifiedPart = resource[value].toString();
                                }
                            });
                        }
                        var _currResFormId = window["ySelected"];
                        var _seperatedTitles = event.customTitle;
                        var _seperatedFormIDs = event.customForms;
                        var _seperatedIds = event.customFormIds;

                        //var _seperatedResFormIDs = event.seperatedResFormIDs;
                        //var _seperatedResEntryIDs = event.seperatedResEntryIDs;
                        //var _seperatedResColValues = event.seperatedResColValues;


                        if (typeof _seperatedTitles !== undefined)
                            _seperatedTitles = _seperatedTitles.split(',');
                        if (typeof _seperatedFormIDs !== undefined)
                            _seperatedFormIDs = _seperatedFormIDs.split(',');
                        if (typeof _seperatedIds !== undefined)
                            _seperatedIds = _seperatedIds.split(',');
                        //if (typeof _seperatedResFormIDs !== undefined)
                        //    _seperatedResFormIDs = _seperatedResFormIDs.split(',');
                        //if (typeof _seperatedResEntryIDs !== undefined)
                        //    _seperatedResEntryIDs = _seperatedResEntryIDs.split(',');
                        //if (typeof _seperatedResColValues !== undefined)
                        //    _seperatedResColValues = _seperatedResColValues.split(',');




                        _.each(_seperatedFormIDs, function (value, key) {
                            if (value.trim() === _currResFormId.toString().trim()) {
                                _seperatedTitles[key] = titleModifiedPart;
                                _seperatedIds[key] = event.resourceId;
                            }
                        });
                        //_.each(_seperatedResFormIDs, function (value, key) {
                        //    if (value === _currResFormId.toString()) {
                        //        _seperatedResEntryIDs[key] = event.resourceId;
                        //        _seperatedResColValues[key] = resourceValue;
                        //    }
                        //});

                        var _newseperatedTitles = ""; var _newseperatedIds = ""; var _newseperatedResEntryIDs = ""; var _newseperatedResColValues = "";
                        _.each(_seperatedFormIDs, function (value, key) {
                            if (_newseperatedTitles === "")
                                _newseperatedTitles = _seperatedTitles[key].toString();
                            else
                                _newseperatedTitles += " , " + _seperatedTitles[key].toString();


                            if (_newseperatedIds === "")
                                _newseperatedIds = _seperatedIds[key].toString();
                            else
                                _newseperatedIds += " , " + _seperatedIds[key].toString();

                            //if (_newseperatedResEntryIDs === "")
                            //    _newseperatedResEntryIDs = _seperatedResEntryIDs[key].toString();
                            //else
                            //    _newseperatedResEntryIDs += " , " + _seperatedResEntryIDs[key].toString();


                            //if (_newseperatedResColValues === "")
                            //    _newseperatedResColValues = _seperatedResColValues[key].toString();
                            //else
                            //    _newseperatedResColValues += " , " + _seperatedResColValues[key].toString();

                        });




                        var activityValue = activity[activityField];
                        //if (event.activities != 'undefined')
                        //   // title = event.activities + ' in ' + resourceValue;
                        //else
                        //   // title = ' in ' + resourceValue;
                    }
                }
                var indx = _.findIndex(event.customFormsSplit, function (formIdString) { return formIdString.toString().trim() == $scope.xSelection.toString() });
                if (indx != -1) {
                    activities = event.customFormIdsSplit[indx].toString().trim();
                }
                formfieldDataListTempData = [
                    { "name": "Id", "value": parseInt(Id) },
                    { "name": "title", "value": title },
                    { "name": "start", "value": start },
                    { "name": "end", "value": end },
                    { "name": "allDay", "value": allDay },
                    { "name": "activities", "value": activities },
                    { "name": "resources", "value": resourceId },
                ];

                $.ajax({
                    method: 'POST',
                    url: BASE_URL + "FormAPI/EditEventData",
                    dataType: 'json',
                    contentType: "application/json",
                    data: "{'action':2,'resourceFormId':" + resFormId + ",'ActivityFormId':" + activityFormId + ",'userid':" + eventBasicData.userId + ",'Id':" + parseInt(Id) + ", 'formId':" + eventBasicData.formId + ",'topicId':" + eventBasicData.formData.topicId + ",'created_by':" + eventBasicData.created_by + ",'updated_by':" + eventBasicData.update_by + ",'formfieldDataListTemp':'" + JSON.stringify(formfieldDataListTempData) + "' ,'isInternalDrop':" + isInternalDropParam + ",startDate:'" + start + "','endDate':'" + end + "','eventOverlap': '','activitiesOverlap':" + activitiesOverlap + "}", //$.param(formData)
                    success: function (response) {
                        if (response.res > 0) {
                            //else if (response.res > 0 && param.action == 2) {
                            try {
                                var CalendarEventList = window["CalendarEventList"];
                                var ActivityEventList = window["ActivityEventList"];
                                var oneToManyList = eventBasicData.formData.FormDataToOneListDynamic;

                                var CalenderEditableRow = $.grep(CalendarEventList, function (e) {
                                    return e.Id == event.Id;
                                });
                                var ActivityEditableRow = $.grep(ActivityEventList, function (e) {
                                    return e.Id == event.Id;
                                });
                                var oneToManyListEditableRow = $.grep(oneToManyList, function (e) {
                                    return e.Id == event.Id;
                                });

                                CalenderEditableRow[0].start = start;
                                CalenderEditableRow[0].end = end;
                                CalenderEditableRow[0].seperatedTitles = _newseperatedTitles;
                                CalenderEditableRow[0].seperatedIds = _newseperatedIds;
                                CalenderEditableRow[0].seperatedResColValues = _newseperatedResColValues;
                                CalenderEditableRow[0].seperatedResEntryIDs = _newseperatedResEntryIDs;




                                ActivityEditableRow[0].start = start;
                                ActivityEditableRow[0].end = end;
                                ActivityEditableRow[0].seperatedTitles = _newseperatedTitles;
                                ActivityEditableRow[0].seperatedIds = _newseperatedIds;
                                ActivityEditableRow[0].seperatedResColValues = _newseperatedResColValues;
                                ActivityEditableRow[0].seperatedResEntryIDs = _newseperatedResEntryIDs;

                                oneToManyListEditableRow[0].start = start;
                                oneToManyListEditableRow[0].end = end;
                                oneToManyListEditableRow[0].seperatedTitles = _newseperatedTitles;
                                oneToManyListEditableRow[0].seperatedIds = _newseperatedIds;
                                oneToManyListEditableRow[0].seperatedResColValues = _newseperatedResColValues;
                                oneToManyListEditableRow[0].seperatedResEntryIDs = _newseperatedResEntryIDs;
                                //var  filteredItems = CalendarEventList.filter((item) => item.Id !== response.Id);

                                //console.log('ffffff');
                                //console.log(CalenderEditableRow);

                                var filteredEventsCalender = $.grep(CalendarEventList, function (e) {
                                    return e.Id != event.Id;
                                });
                                var filteredEventsActivity = $.grep(ActivityEventList, function (e) {
                                    return e.Id != event.Id;
                                });
                                var filteredoneToManyList = $.grep(oneToManyList, function (e) {
                                    return e.Id != event.Id;
                                });
                                filteredEventsCalender.push(CalenderEditableRow[0]);
                                filteredEventsActivity.push(ActivityEditableRow[0]);
                                filteredoneToManyList.push(oneToManyListEditableRow[0]);
                                eventBasicData.formData.FormDataToOneListDynamic = filteredoneToManyList;



                                _.each(filteredEventsCalender, function (dataRow, position) {

                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;

                                    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;


                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    _.each(commaVals, function (idVal, pos) {
                                        //console.log(commaVals + "," + commaIDs[pos].toString())
                                        if (idVal == ySelected.toString()) {
                                            dataRow.resFormID = idVal;
                                            dataRow.resources = commaIDs[pos];
                                            dataRow.resourceId = commaIDs[pos];
                                            dataRow.title = "";
                                        }

                                    })



                                });

                                _.each(filteredEventsActivity, function (dataRow, position) {

                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;
                                    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;
                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    _.each(commaVals, function (idVal, pos) {
                                        //console.log(commaVals + "," + commaIDs[pos].toString())
                                        if (idVal == ySelected.toString()) {
                                            dataRow.resFormID = idVal;
                                            dataRow.resources = commaIDs[pos];
                                            dataRow.resourceId = commaIDs[pos];
                                            dataRow.title = "";
                                        }

                                    })



                                });

                                _.each(filteredoneToManyList, function (dataRow, position) {

                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;

                                    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;


                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    _.each(commaVals, function (idVal, pos) {
                                        //console.log(commaVals + "," + commaIDs[pos].toString())
                                        if (idVal == ySelected.toString()) {
                                            dataRow.resFormID = idVal;
                                            dataRow.resources = commaIDs[pos];
                                            dataRow.resourceId = commaIDs[pos];
                                            dataRow.title = "";
                                        }

                                    })



                                });


                                window["CalendarEventList"] = filteredEventsCalender;
                                window["ActivityEventList"] = filteredEventsActivity;
                                console.log('hi3')
                                //$('.calendar').fullCalendar('destroy');
                                //loadCalendar('BasicView', filteredEventsCalender, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, filteredEventsActivity);
                                refreshEventResourcesActivity('BasicView', filteredEventsCalender, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, filteredEventsActivity);
                                //$('#timeline-resource-view div.calendar').fullCalendar('refetchEvents');


                                //eventBasicData.formGroupKey = create_UUID();
                                window["EventBasicDetail"] = eventBasicData;
                                $.jGrowl(response.Message, { position: 'center' });
                                // $scope.bindDraggable();
                            }
                            catch (e) {
                                //console.log(e);
                                $.jGrowl(response.Message, { position: 'center' });

                                var _ScrollOffset = window["scrollOffset"];
                                window.scrollTo(0, _ScrollOffset);
                                $.unblockUI();
                            }

                        } else {
                            revertFunc();
                            if (response.res == -1) {
                                swal({ type: 'error', title: '', text: response.Message });

                            } else {
                                swal({ type: 'error', title: '', text: response.overlapMessage });
                            }


                        }

                    },

                    beforeSend: function () {
                        showLoader();
                    },

                    complete: function () {

                        var _ScrollOffset = window["scrollOffset"];
                        window.scrollTo(0, _ScrollOffset);
                        $.unblockUI();
                        // $("#" + current_tab + " div.calendar").unblock();
                    }
                });



            }

        },
        //  resize event's duration inside calendar view
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
            window["scrollOffset"] = $(window).scrollTop();
            var resourceId = (event.resourceId) ? event.resourceId : '';
            var resources = (event.resources) ? event.resources : '';
            var activities = (event.activities) ? event.activities : '';
            var allDay = event.allDay;
            var formfieldDataListTempData = [];
            var activityName = '';
            var resFormId = window["ySelected"];
            var activityFormId = window["xSelected"];
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
                    url: BASE_URL + "FormAPI/EditEventData",
                    dataType: 'json',
                    contentType: "application/json",
                    data: "{'action':2,'resourceFormId':" + resFormId + ",'ActivityFormId':" + activityFormId + ",'userid':" + eventBasicData.userId + ",'Id':" + parseInt(Id) + ", 'formId':" + eventBasicData.formId + ",'topicId':" + eventBasicData.formData.topicId + ",'created_by':" + eventBasicData.created_by + ",'updated_by':" + eventBasicData.update_by + ",'formfieldDataListTemp':'" + JSON.stringify(formfieldDataListTempData) + "' ,'isResizedEvent':" + parseInt(isResizedEvent) + ",startDate:'" + start + "','endDate':'" + end + "','eventOverlap':" + eventOverlap + ",'activitiesOverlap':" + activitiesOverlap + "}", //$.param(formData)
                    success: function (response) {
                        if (response.res > 0) {

                            try {
                                var CalendarEventList = window["CalendarEventList"];
                                var ActivityEventList = window["ActivityEventList"];
                                var oneToManyList = eventBasicData.formData.FormDataToOneListDynamic;
                                var CalenderEditableRow = $.grep(CalendarEventList, function (e) {
                                    return e.Id == event.Id;
                                });
                                var ActivityEditableRow = $.grep(ActivityEventList, function (e) {
                                    return e.Id == event.Id;
                                });
                                var oneToManyListEditableRow = $.grep(oneToManyList, function (e) {
                                    return e.Id == event.Id;
                                });
                                CalenderEditableRow[0].start = start;
                                CalenderEditableRow[0].end = end;
                                ActivityEditableRow[0].start = start;
                                ActivityEditableRow[0].end = end;
                                oneToManyListEditableRow[0].start = start;
                                oneToManyListEditableRow[0].end = end;
                                var filteredEventsCalender = $.grep(CalendarEventList, function (e) {
                                    return e.Id != event.Id;
                                });
                                var filteredEventsActivity = $.grep(ActivityEventList, function (e) {
                                    return e.Id != event.Id;
                                });
                                var filteredoneToManyList = $.grep(oneToManyList, function (e) {
                                    return e.Id != event.value;
                                });
                                filteredEventsCalender.push(CalenderEditableRow[0]);
                                filteredEventsActivity.push(ActivityEditableRow[0]);
                                filteredoneToManyList.push(oneToManyListEditableRow[0]);
                                eventBasicData.formData.FormDataToOneListDynamic = filteredoneToManyList;
                                _.each(filteredEventsCalender, function (dataRow, position) {

                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;

                                    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;


                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    _.each(commaVals, function (idVal, pos) {
                                        //console.log(commaVals + "," + commaIDs[pos].toString())
                                        if (idVal == ySelected.toString()) {
                                            dataRow.resFormID = idVal;
                                            dataRow.resources = commaIDs[pos];
                                            dataRow.resourceId = commaIDs[pos];
                                            dataRow.title = "";
                                        }

                                    })



                                });
                                _.each(filteredEventsActivity, function (dataRow, position) {

                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;
                                    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;
                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    _.each(commaVals, function (idVal, pos) {
                                        //console.log(commaVals + "," + commaIDs[pos].toString())
                                        if (idVal == ySelected.toString()) {
                                            dataRow.resFormID = idVal;
                                            dataRow.resources = commaIDs[pos];
                                            dataRow.resourceId = commaIDs[pos];
                                            dataRow.title = "";
                                        }

                                    })



                                });
                                _.each(filteredoneToManyList, function (dataRow, position) {

                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;

                                    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;


                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    _.each(commaVals, function (idVal, pos) {
                                        //console.log(commaVals + "," + commaIDs[pos].toString())
                                        if (idVal == ySelected.toString()) {
                                            dataRow.resFormID = idVal;
                                            dataRow.resources = commaIDs[pos];
                                            dataRow.resourceId = commaIDs[pos];
                                            dataRow.title = "";
                                        }

                                    })



                                });
                                window["CalendarEventList"] = filteredEventsCalender;
                                window["ActivityEventList"] = filteredEventsActivity;
                                refreshEventResourcesActivity('BasicView', filteredEventsCalender, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, filteredEventsActivity);
                                window["EventBasicDetail"] = eventBasicData;
                                $.jGrowl(response.Message, { position: 'center' });
                            }
                            catch (e) {
                                $.jGrowl(response.Message, { position: 'center' });
                                var _ScrollOffset = window["scrollOffset"];
                                window.scrollTo(0, _ScrollOffset);
                                $.unblockUI();
                            }
                        } else {
                            revertFunc();
                            if (response.res == -1) {
                                swal({ type: 'error', title: '', text: response.Message });

                            } else {
                                swal({ type: 'error', title: '', text: response.overlapMessage });
                            }
                        }
                    },
                    beforeSend: function () {
                        showLoader();
                    },
                    complete: function () {
                        var _ScrollOffset = window["scrollOffset"];
                        window.scrollTo(0, _ScrollOffset);
                        $.unblockUI();
                    }
                });
            }
        },
        eventRender: function (event, element) {
            var rowTooltipDisplay = "";
            var rowTooltipTitleDisplay = "";
            var table = $("<div class='event-detail div-flex'></div>"), deleteParams;
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            var current_subtab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').find('.ui-state-active').attr('class');
            var resourceA = $("#" + current_tab + " .calendar").fullCalendar('getResourceById', event.resourceId);
            var events = $("#" + current_tab + " .calendar").fullCalendar('clientEvents');
            var _tempTitle = "text";
            rowRecord = "", data = event.data;
            var eventData = {
                Id: event.Id,
                Images: event.files,
                title: _tempTitle,
                start: event.start != null && event.start != undefined && event.start != '' ? customDate(event.start.format()) : '',
                end: event.end != null && event.end != undefined && event.end != '' ? customDate(event.end.format()) : '',
                allDay: event.allDay,
                service: event.service,
                description: event.description,
                resources: event.resources,
                activities: event.activities,
                activityName: event.activityName,
            };
            var eventData = angular.copy(event);
            eventData.title = _tempTitle;
            eventData.Images = event.files;
            eventData.start = event.start != null && event.start != undefined && event.start != '' ? customDate(eventData.start.format()) : ''
            eventData.end = event.end != null && event.end != undefined && event.end != '' ? customDate(eventData.end.format()) : ''
            var $scope = angular.element($("#calendar")).scope();
            if ($scope.formDetailsDataInfo.otherFormIsShow != null && $scope.formDetailsDataInfo.otherFormIsShow == true) {

                if (event.customFourthTitle != null && event.customFourthTitle != "") {
                    element.append(
                        $('<div>', {
                            class: 'fc-content fcTime', "id": event.Id + "_Time"

                        }).append(
                            $('<small>', { class: 'time', "title": "" }).text(event.customFourthTitle)
                        )
                    );
                    rowTooltipDisplay += event.customFourthTitle + " <br/> "
                }
            }
            $scope.counterLoader = undefined;
            table.append("<div class='div-flex'>" + rowRecord + "</div>");
            var basicDetails = window["EventBasicDetail"];
            var actionRow = "";
            actionRow += "<div id='eventCopy' class='mr-10 cursor-pointer' data-formId=" + basicDetails.formId + " data-formGroupKey='" + eventData.formGroupKey + "' data-eventId='" + event.Id + "'><a> <i class='fa fa-copy'></i></a></div>"
            actionRow += "<div id='eventEdit' class='mr-10 cursor-pointer' data-formId=" + basicDetails.formId + " data-formGroupKey='" + eventData.formGroupKey + "' data-eventId='" + event.Id + "'><a> <i class='fa fa-pencil'></i></a></div>"
            actionRow += "<div id='eventDelete' data-formId=" + basicDetails.formId + " data-formGroupKey='" + eventData.formGroupKey + "' data-eventId='" + event.Id + "' class='delete-event cursor-pointer'><i class='fa fa-trash'></i></div>"
            actionRow += "<a class='btn close-event cursor-pointer' title='close'> <i class='fa fa-times'></i></a>";
            table.append("<div class='btn-box'>" + actionRow + "</div>");
            table.append('<div class="div-flex div-list-bar"></div>');
            if ($scope.listTabulator.length > 0) {
                table.append(`<div class="div-flex div-list">
                            <div class="d-flex justify-content-between align-items-center p-0">
                                <h5 class="list-title mb-0" id="tabuList"></h5>
                                <div class="d-block">
                                    <div id="addTransactionRecord" class="edit-event-student cursor-pointer d-inline-block"><i class="fa fa-plus"></i></div> <div id="tabuListLink" class="edit-event-student mr-0 ml-1 cursor-pointer d-inline-block"  title="Edit"><i class="fa fa-pencil"></i></div> </div>  </div>   <ul id="tabuListUl">  </ul></div>`);
            }
            else {
                table.append(`<div class="div-flex div-list">
                            <div class="d-flex justify-content-between align-items-center p-0">
                                <h5 class="list-title mb-0" id="tabuList"></h5>
                                <div class="d-block">
                                    <div id="addTransactionRecord" class="edit-event-student cursor-pointer d-inline-block"><i class="fa fa-plus"></i></div>  </div>  </div>   <ul id="tabuListUl">  </ul></div>`);
            }
            let $fcContent = element.find(".fc-content").detach(),
                $resize = element.find(".fc-resizer").detach();
            element.attr('title', rowTooltipTitleDisplay + "  " + rowTooltipDisplay);
            element.attr('data-html', 'true');
            element.popover({
                container: 'body',
                animation: true,
                //delay: 300,
                //content: table,
                trigger: 'click',
                html: true,
                placement: 'top',
                content: function () {
                    $("body .popover").popover('hide');
                    return table;
                }

            }).css({
                background: "rgb(255, 255, 255)",
                borderColor: "#aaa",
                padding: 2,
                borderRadius: 5,
                //min-height: 44,
                "z-index": 1
            })
                .droppable({
                    drop: function (event, ui) {
                    },
                }).empty().append($fcContent.css({
                    borderRadius: 3,
                }), $resize);


        },
        eventClick: function (calEvent, jsEvent, view) {
            function removeTitle() {
                $('body .popover-header').remove();
            }
            $('.close-event').on('click', function () {
                $("body .popover").addClass('isPopoverLoaded');
                $("body .popover").popover('hide');
                $("#tabuListUl").empty();
                var $scope = angular.element($("#calendar")).scope();
                $('.temp').find('.titleContainer').removeClass('d-none');
                $('.popoverSelect').addClass('d-none');

            });
            setTimeout(function () {
                removeTitle();
                if (!$("body .popover").hasClass("isPopoverLoaded")) {
                    $('.editTitle').on('click', function () {
                        $(this).closest('.temp').find('.popoverSelect').removeClass('d-none');
                        $(this).closest('.titleContainer').addClass('d-none');
                    });
                    $('#eventCopy').on('click', function () {
                        var $scope = angular.element($("#calendar")).scope();
                        var formId = $(this).data('formid');
                        var formGroupKey = $(this).data('formgroupkey');
                        var rowId = $(this).data('eventid');
                        var eventData = _.findWhere(window["CalendarEventList"], { formGroupKey: formGroupKey.toString() });
                        var param = {};
                        param.formGroupKey = formGroupKey;
                        if ($scope.listTabulator.length > 0) {
                            var temp = $scope.listTabulator[0];
                            param.formId = temp.fieldValidationRuleParse.reference_form;
                            param.isInternalDrop = true;
                        } else {
                            param.formId = $scope.formDetailsDataInfo.otherformid;
                            param.isInternalDrop = false;
                        }
                        param.Id = rowId;
                        param.action = 10;
                        param.parentID = formId;
                        param.newFormGroupKey = "";
                        $scope.copyCalenderEventFunction(param);
                    });
                    $('.closeSelect').on('click', function () {
                        $(this).closest('.temp').find('.titleContainer').removeClass('d-none');
                        $(this).closest('.popoverSelect').addClass('d-none');

                        $("body .popover").addClass('isPopoverLoaded');
                        $("body .popover").popover('hide');
                        $("#tabuListUl").empty();
                        var $scope = angular.element($("#calendar")).scope();
                        $('.temp').find('.titleContainer').removeClass('d-none');
                        $('.popoverSelect').addClass('d-none');

                    });
                }
                var $scope = angular.element($("#calendar")).scope();
                _.each($scope.totalSelectListTagify, function (item, key) {
                    var param = {};
                    var input = document.getElementById('tag-input' + item.fieldName);
                    if (input != null) {
                        // init Tagify script on the above inputs                     
                        var tempWhiteControl = $("#tag-inputHidden" + item.fieldName).val();
                        var tempWhiteList = [];
                        var tempWh2 = [];
                        if (tempWhiteControl != undefined && tempWhiteControl != "") {
                            tempWhiteList = tempWhiteControl;
                            tempWhiteList = tempWhiteList.replace(/'/g, '"');
                            tempWhiteList = JSON.parse(tempWhiteList);
                            var newList = [];
                            if (tempWhiteList.length > 0) {
                                if (tempWhiteList[0].value != undefined) {
                                    _.each(tempWhiteList, function (itemtag) {
                                        newList.push(itemtag.value);
                                    });
                                } else {
                                    newList = tempWhiteList;
                                }
                            }
                            tempWhiteList = newList.join();
                            tempWh2 = tempWhiteList.split(",");
                            input.value = tempWhiteList;
                            var tmp = [tempWhiteList];
                        }
                        item.tagify = new Tagify(input, {
                            whitelist: tempWh2,
                            maxTags: 10,
                            dropdown: {
                                maxItems: 20,           // <- mixumum allowed rendered suggestions
                                classname: "tags-look", // <- custom classname for this dropdown, so it could be targeted
                                enabled: 0,             // <- show suggestions on focus
                                closeOnSelect: false    // <- do not hide the suggestions dropdown once an item has been selected
                            }
                        });
                        if (item.tagify.on != undefined) {
                            item.tagify.on('add', onAddTag)
                            item.tagify.on('invalid', onInvalidTag)
                            item.tagify.on('remove', onRemoveTag)
                            item.tagify.on('edit', onTagEdit)
                        }
                    }
                });
                var param = {};
                var selectedId = $("#tag-inputHidden").val();
                param.selectedId = selectedId;
                $scope.getTabulatorListFromEvents(param);
                $scope.rootScopeSafe();
            }, 800);
            $(document).on('click', function (e) {
                if ($('.favicon-loader-overlay.active').length) {
                }
                else {
                    if (!$(e.target).closest('.popover.show').length && !$(e.target).closest('.fc-content').length) {
                        //$(document).find('.popover.show').remove()
                        $("body .popover").addClass('isPopoverLoaded');
                        $("body .popover").popover('hide');
                        $("#tabuListUl").empty();
                        var $scope = angular.element($("#calendar")).scope();
                        $('.temp').find('.titleContainer').removeClass('d-none');
                        $('.popoverSelect').addClass('d-none');
                    }
                }
            });
        },
        eventAfterAllRender: function (event, element, view) {

            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');

            if (current_tab == "agenda-view") {
                var $scope = angular.element($("#calendar")).scope();
                $scope.$parent.$parent.IND_loading = false;
                setTimeout(function () {
                    $.unblockUI();
                }, 1000);
            } else {
                $.unblockUI();
            }
            setTimeout(function () {
                jQuery.curCSS = function (element, prop, val) {
                    return jQuery(element).css(prop, val);
                };
                $('.fc-content').bstooltip();
                $('.fc-timeline-event').bstooltip();
                $('.fc-list-item').bstooltip();
                $('.fc-day-grid-event').bstooltip();
                $('.fc-time-grid-event').bstooltip();
            }, 500);
        },
    };


    // List View
    myOptions = {
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'listDay,listWeek,listMonth,listYear'
        },
        // customize the button names,
        // otherwise they'd all just say "list"
        views: {
            listDay: { buttonText: 'day' },
            listWeek: { buttonText: 'week' },
            listMonth: { buttonText: 'month' },
            listYear: { buttonText: 'year' }
        },
        defaultView: 'listDay',
        defaultDate: new Date(),
        events: calenderData,
        allDaySlot: true
    };
    calendarOptions = $.extend({}, defaultOptions, myOptions);
    $('#list-view div.calendar').fullCalendar(calendarOptions);
    //listCalenderView = new FullCalendar.Calendar($('#list-view div.calendar'), calendarOptions);
    // Agenda View

    myOptions = {
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month'
        },
        defaultView: 'month',
        events: calenderData,
        scrollTime: '00:00',
        allDaySlot: true,
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
            //console.log($(this));
            swal({
                title: 'Drag Calender Entry',
                text: 'Action is not allowed in this view',
                type: 'error'
            });
            $("#agenda-view div.calendar").fullCalendar('refetchEvents');
            return false;

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
            var allDayCustom = "false";
            var current_subtab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').find('.ui-state-active').attr('class');
            if (current_subtab) {
                allDayCustom = (current_subtab.contains('fc-agendaMonth-button') || current_subtab.contains('fc-timelineYear-button')).toString();
            }
            var defaultDuration = moment.duration(eventExtData.duration);
            var end = date.clone().add(defaultDuration);
            var activities = eventExtData.id;
            var $scope = angular.element($("#calendar")).scope();
            eventBasicData.resFormIdParam = $scope.ySelection;
            eventBasicData.actFormIdParam = eventExtData.formid;
            var param = {};
            param.action = eventBasicData.action;
            param.formId = eventBasicData.formId;
            param.userId = eventBasicData.userId;

            var defaultDuration = moment.duration(eventExtData.duration);
            var end = date.clone().add(defaultDuration);

            var startCustom = date.format();
            var endCustom = end.format();

            var exists = _.findWhere($scopeVar.calenderSettingsFormDetailsDataList, { activitiesForm: parseInt(eventExtData.formid) });
            if (exists != undefined) {
                if (exists.durationField == "0") {
                    allDayCustom = "true";
                } else {
                    allDayCustom = "false";
                }
            }
            var resourceValue = "0";
            var eventData = {
                id: eventExtData.id,
                title: eventExtData.groupingvaluesact,
                color: eventExtData.color,
                allDay: allDayCustom,
                start: startCustom,
                end: endCustom,
                resFormID: eventBasicData.resFormIdParam,
                actFormID: eventBasicData.actFormIdParam,
                resourceId: 0,
                resources: 0,
                activities: eventExtData.title,
                colActivityValue: "",
                colCategoryValue: "",
                colColorValue: "",
                dropin: eventExtData.dropin,
                dimensionType: eventExtData.dimensiontype,
                dropinTitle: eventExtData.title
            };
            if (allDayCustom == "true" || startCustom.length == 10) {
                startCustom = date.format("YYYY-MM-DD");
                startCustom = moment(startCustom + " 00:00:00");
                endCustom = date.format("YYYY-MM-DD");
                let initialdate = endCustom;
                let start_time = '23:59:59';
                endCustom = moment(initialdate + " " + start_time);
                allDayCustom = "true";
                startCustom = startCustom.format("YYYY-MM-DD HH:mm");
                endCustom = endCustom.format("YYYY-MM-DD HH:mm");
            }
            else {
                allDayCustom = "false";
                if (eventExtData.duration == null || eventExtData.duration == "" || eventExtData.duration == undefined || exists.duration == "0") {
                    allDayCustom = "true";
                    startCustom = date.format("YYYY-MM-DD");
                    startCustom = moment(startCustom + " 00:00:00");
                    endCustom = date.format("YYYY-MM-DD");
                    let initialdate = endCustom;
                    let start_time = '23:59:59';
                    endCustom = moment(initialdate + " " + start_time);
                }
            }
            if ($('#allDay-check').is(':checked')) {
                allDayCustom = "true";
                startCustom = date.format("YYYY-MM-DD");
                startCustom = moment(startCustom + " 00:00:00");
                endCustom = date.format("YYYY-MM-DD");
                let initialdate = endCustom;
                let start_time = '23:59:59';
                endCustom = moment(initialdate + " " + start_time);
                startCustom = startCustom.format("YYYY-MM-DD HH:mm");
                endCustom = endCustom.format("YYYY-MM-DD HH:mm");
            }
            else {
                if (current_subtab.contains("fc-timelineDay-button") || current_subtab.contains("fc-agendaDay-button") || current_subtab.contains("fc-agendaWeek-button")) {

                }
                else {
                    allDayCustom = "true";
                    startCustom = date.format("YYYY-MM-DD");
                    startCustom = moment(startCustom + " 00:00:00");
                    endCustom = date.format("YYYY-MM-DD");
                    let initialdate = endCustom;
                    let start_time = '23:59:59';
                    endCustom = moment(initialdate + " " + start_time);
                    startCustom = startCustom.format("YYYY-MM-DD HH:mm");
                    endCustom = endCustom.format("YYYY-MM-DD HH:mm");
                }

            }
            var formfieldDataListTempData = [];
            //console.log(eventExtData);


            if ($('#allDay-check').is(':checked')) {
                allDayCustom = "true";
                startCustom = date.format("YYYY-MM-DD");
                startCustom = moment(startCustom + " 00:00:00");
                endCustom = date.format("YYYY-MM-DD");
                let initialdate = endCustom;
                let start_time = '23:59:59';
                endCustom = moment(initialdate + " " + start_time);
                startCustom = startCustom.format("YYYY-MM-DD HH:mm");
                endCustom = endCustom.format("YYYY-MM-DD HH:mm");
            }
            eventData.allDay = allDayCustom;
            eventData.start = startCustom;
            eventData.end = endCustom;
            eventData.formGroupKey = eventBasicData.formGroupKey;
            formfieldDataListTempData = [

                { "name": "title", "value": title },
                { "name": "start", "value": startCustom },
                { "name": "end", "value": endCustom },
                { "name": "color", "value": color },
                { "name": "allDay", "value": allDayCustom },
                { "name": "service", "value": "" },
                { "name": "description", "value": "" },
                { "name": "activities", "value": activities },
                { "formGroupKey": eventBasicData.formGroupKey, "name": "formGroupKey", "value": eventBasicData.formGroupKey }
            ];


            var checkExists = window["eventListTemp"];
            var exists = _.filter(checkExists, function (item) {
                return compareEventStartEndDateTime(eventData, item) && (item.resourceId == eventData.resourceId ||
                    item.resources == eventData.resourceId);
            });
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            if (exists.length > 0) {
                var listExisting = angular.copy(exists);
                exists = exists[0];
                eventData.formGroupKey = exists.formGroupKey;
                var seperatedIds = exists.customFormIds;
                var comma = seperatedIds.split(',');
                var _droppedForms = exists.customForms;
                var _arr0 = _droppedForms.split(',');
                var _checkIfExists = true;
                _.each(_arr0, function (_row, _pos) {
                    if (_row.toString().trim() === eventBasicData.actFormIdParam.toString()) {
                        _checkIfExists = false;
                        //break;
                    }

                });
                var _checkIfExistsIds = false;
                var _droppedFormsIds = exists.customFormIds;
                var _arr1 = _droppedFormsIds.split(',');
                _.each(listExisting, function (item) {
                    var formlist = item.customForms.split(',');
                    var formIdslist = item.customFormIds.split(',');
                    //// 
                    var formExist = _.filter(formlist, function (formItem) { return formItem.toString().trim() === eventBasicData.actFormIdParam.toString() });
                    var formIdExist = _.filter(formIdslist, function (formIdItem) { return formIdItem.toString().trim() === eventData.id.toString() });
                    if (formExist.length > 0 && formIdExist.length > 0) {
                        _checkIfExistsIds = true;
                    }
                });
                if (!_checkIfExists) {
                    var checkOverlapping = _.where($scopeVar.calenderSettingsFormDetailsDataList, { resourceActivityForm: eventBasicData.actFormIdParam });
                    if (checkOverlapping.length > 0) {
                        var eventOverlapping = _.filter(checkOverlapping, function (item) {
                            return item.eventOverlap == "1" || item.activitiesOverlap == "1";
                        });
                        // 
                        if (eventOverlapping.length > 0 && _checkIfExistsIds) {
                            eventData.formGroupKey = undefined;
                            if (!_checkIfExistsIds) {
                                $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                                swal({ type: 'error', title: '', text: 'cannot overlap same dimension entry in same timeslot' });
                                return false;
                            }
                            else {
                                generateEvent(eventData, eventExtData, date, end, resourceValue);
                            }
                        } else {
                            if (comma.length > 1 && !_checkIfExists && _checkIfExistsIds) {
                                $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                                swal({ type: 'error', title: '', text: 'cannot drop same dimension more than once in same event' });
                                return false;
                            } else {
                                eventData.formGroupKey = undefined;
                                generateEvent(eventData, eventExtData, date, end, resourceValue);
                            }
                        }
                    } else {
                        $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                        swal({ type: 'error', title: '', text: 'cannot drop same dimension more than once in same event' });
                        return false;
                    }
                }
                else if (_checkIfExists) {
                    if (resourceValue !== '') {
                    }
                    if (eventData.title !== '') {
                        addExternalEvent(eventData);
                    }
                }
            }
            else {
                generateEvent(eventData, eventExtData, date, end, resourceValue);
            }
            //if (title !== '') {
            //    var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            //    $.ajax({
            //        method: 'POST',
            //        url: "api/FormAPI/GeneratedFormData",
            //        dataType: 'json',
            //        contentType: "application/json",
            //        data: "{'action':" + eventBasicData.action + ",'userId':" + eventBasicData.userId + ",'formId':" + eventBasicData.formId +
            //            ",'topicId':" + eventBasicData.formData.topicId + ",'created_by':" + eventBasicData.created_by
            //            + ",'resourceFormId':" + eventBasicData.actFormIdParam + ",'ActivityFormId':" + eventBasicData.actFormIdParam + ",'updated_by':" + eventBasicData.update_by + ",'formGroupKey':'" + eventBasicData.formGroupKey
            //            + "','formfieldDataListTemp':'" + JSON.stringify(formfieldDataListTempData) + "'}", //$.param(formData)
            //        success: function (response) {
            //            if (response.res > 0) {
            //                param.created_by = eventBasicData.created_by;
            //                param.update_by = eventBasicData.update_by;
            //                param.formGroupKey = response.formGroupKey;
            //                param.resourceFormId = eventBasicData.resFormIdParam;
            //                param.activityFormId = eventBasicData.actFormIdParam;
            //                param.resourceId = eventBasicData.resourceId != undefined?eventBasicData.resourceId.toString():"0";
            //                param.activityId = activities.toString();
            //                manageOneToManyReferrenceForm(param);                           
            //                var calenderNewRow = {
            //                    Id: response.Id,
            //                    label: null,
            //                    selected: false,
            //                    value: response.Id,
            //                    color: color,
            //                    title: title,
            //                    start: start,
            //                    end: end,
            //                    allDay: allDayCustom,
            //                    activities: title,
            //                    customForms: param.activityFormId,
            //                    customFormIds: activities,
            //                    customTitle: title,
            //                    formGroupKey : param.formGroupKey
            //                };
            //                var activityNewRow = {
            //                    Id: response.Id,
            //                    label: null,
            //                    selected: false,
            //                    value: response.Id,
            //                    color: color,
            //                    title: title,
            //                    start: start,
            //                    end: end,
            //                    allDay: allDayCustom,
            //                    activities: title,
            //                    resourceId: activities,
            //                    customForms: param.activityFormId,
            //                    customFormIds: activities,
            //                    customTitle: title,
            //                    formGroupKey : param.formGroupKey
            //                };
            //                //eventBasicData.formGroupKey = create_UUID();
            //                window["EventBasicDetail"] = eventBasicData;

            //                var CalendarEventList = window["CalendarEventList"];
            //                var ActivityEventList = window["ActivityEventList"];
            //                //console.log('before insertion ');
            //                //console.log(CalendarEventList);

            //                CalendarEventList.push(calenderNewRow);
            //                ActivityEventList.push(activityNewRow);
            //                window["CalendarEventList"] = CalendarEventList;
            //                window["ActivityEventList"] = ActivityEventList;
            //                //console.log('after  insertion ');
            //                //console.log(CalendarEventList);
            //                console.log('hi5')
            //                // $('.calendar').fullCalendar('destroy');
            //                //loadCalendar('BasicView', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, ActivityEventList);
            //                refreshEventResourcesActivity('BasicView', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, ActivityEventList);
            //                //  loadCalendar('BasicView', CalendarEventList);
            //                //$('#basic-view div.calendar').fullCalendar('refetchEvents');

            //                //eventBasicData.formGroupKey = create_UUID();
            //                window["EventBasicDetail"] = eventBasicData;
            //                $.jGrowl(response.Message, { position: 'center' });
            //            }
            //            else {
            //                if (response.res == -1) {
            //                    var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            //                    $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
            //                    swal({ type: 'error', title: '', text: response.Message });

            //                } else {
            //                    swal({ type: 'error', title: '', text: response.overlapMessage });
            //                }
            //            }
            //        },
            //        beforeSend: function () {
            //            showLoader();
            //        },
            //        complete: function () {
            //            $.unblockUI();
            //        }
            //    });
            //}
        }
    };
    var calendarOptions = $.extend({}, defaultOptions, myOptions);
   // $('#agenda-view div.calendar').fullCalendar(calendarOptions);
    if ($scopeVar != undefined)
        if ($scopeVar.ySelection != 0) {
            if ($scopeVar.formDetailsDataInfo != null)
                if ($scopeVar.formDetailsDataInfo.calenderSettingsList != null)
                    if ($scopeVar.formDetailsDataInfo.calenderSettingsList.length > 0) {
                        var exists = _.findWhere($scopeVar.formDetailsDataInfo.calenderSettingsList, { resourceForm: $scopeVar.ySelection });
                        if (exists != undefined) {
                            if (exists.minTime != "" && exists.minTime != null && exists.minTime != undefined && exists.maxTime != null && exists.maxTime != undefined && exists.maxTime != "") {
                                var minTime = exists.minTime.trim().replace(' ', ':');
                                var maxTime = exists.maxTime.trim().replace(' ', ':');
                                $('#agenda-view div.calendar').fullCalendar('option', 'minTime', minTime + ":00");
                                $('#agenda-view div.calendar').fullCalendar('option', 'maxTime', maxTime + ":00");
                            }
                        }
                    }
        }
    //tagyfiy on blur
    function onTagifyFocusBlur(e) {
        //console.log(e.type, "event fired")
    }
    // tag added callback
    function onAddTag(e) {
        var id = $("#tag-inputHidden").val();
        var fieldName = $("#tag-inputHidden" + id).val();
        var $scope = angular.element($("#calendar")).scope();
        var param = {};
        var list = [];
        param.fieldName = fieldName;
        _.each(e.detail.tagify.value, function (item) {
            list.push('"' + item.value + '"');
        });
        param.fieldDataText = "[" + list.join(',') + "]";
        param.formId = $scope.currentFormId;
        param.Id = id;
        $scope.updateRowDataRecord(param);
    }
    // tag remvoed callback
    function onRemoveTag(e) {
        var id = $("#tag-inputHidden").val();
        var fieldName = $("#tag-inputHidden" + id).val();
        var $scope = angular.element($("#calendar")).scope();
        var param = {};
        var list = [];
        param.fieldName = fieldName;
        _.each(e.detail.tagify.value, function (item) {
            list.push('"' + item.value + '"');
        });
        param.fieldDataText = "[" + list.join(',') + "]";
        param.Id = id;
        param.formId = $scope.currentFormId;
        $scope.updateRowDataRecord(param);
    }
    function onTagEdit(e) {
        //console.log("onTagEdit: ", e.detail);
    }
    // invalid tag added callback
    function onInvalidTag(e) {
        //console.log("onInvalidTag: ", e.detail);
    }
    // timeLine resource view
    function addExternalEvent(eventData) {
        window["scrollOffset"] = $(window).scrollTop();
        var eventBasicData = window["EventBasicDetail"];
        var checkExists = window["CalendarEventList"];
        var actFormIdParam = window["xSelected"];
        var resFormIdParam = window["ySelected"];
        var param = {};
        param.action = eventBasicData.action;
        param.formId = eventBasicData.formId;
        param.userId = eventBasicData.userId;
        param.isDyEvent = true;
        param.topicId = eventBasicData.formData.topicId;
        param.created_by = eventBasicData.created_by;
        param.update_by = eventBasicData.update_by;
        param.formGroupKey = eventBasicData.formGroupKey;
        var tempGroup = create_UUID();
        var service = ''; var description = '';
        if (activitiesCategory != null) {
            service = eventData.service;
            description = eventData.description;
        }
        var formfieldDataListTempData = [];
        formfieldDataListTempData = [
            { "name": "title", "value": "" },
            { "name": "start", "value": eventData.start },
            { "name": "end", "value": eventData.end },
            { "name": "color", "value": eventData.color },
            { "name": "allDay", "value": eventData.allDay },
            { "name": "service", "value": service },
            { "name": "description", "value": description },
            { "name": "resources", "value": eventData.resourceId },
            { "name": "resourcesTitle", "value": eventData.resources },
            { "name": "activities", "value": eventData.id },
            { "formGroupKey": eventBasicData.formGroupKey, "name": "formGroupKey", "value": eventBasicData.formGroupKey }
        ];
        var exists = _.filter(checkExists, function (item) {
            return compareEventStartEndDateTime(eventData, item)
                && (item.resourceId == eventData.resourceId ||
                    item.resources == eventData.resourceId);
        });

        if (exists.length > 0) {
            _.each(exists, function (item) {
                var tempformentryidList = item.customFormIds.split(",");
                item.customFormIdsSplit = tempformentryidList;
            });
            exists = _.filter(exists, function (item) { return item.customFormIdsSplit.length == 2 });
            if (exists.length > 0) {
                //make it ready for update
                param.isEventUpdatable = true;
                if (eventData.formGroupKey != undefined) {
                    param.action = 2;//for updte.
                } else {
                    param.action = 1;
                    param.formGroupKey = tempGroup;
                    param.isEventUpdatable = false;
                    var temp = _.findWhere(formfieldDataListTempData, { name: "formGroupKey" });
                    if (temp != null) {
                        temp.value = param.formGroupKey;
                        temp.formGroupKey = param.formGroupKey;
                    }
                }
                exists = exists[0];
                formfieldDataListTempData.push({ "name": "parentID", "value": exists.Id });
                param.parentID = exists.Id;
                var seperatedResColValues = exists.seperatedResColValues;
                var seperatedColorValues = exists.seperatedColorValues;
                if (seperatedResColValues != null && seperatedResColValues.toString() !== "") {
                    param.seperatedResColValues = seperatedResColValues + "," + eventData.resources.toString();
                }
                else {
                    param.seperatedResColValues = eventData.resources.toString();
                }
                // color values
                if (seperatedColorValues != null && seperatedColorValues.toString() !== "") {
                    param.seperatedColorValues = seperatedColorValues + "/" + eventData.color.toString();
                }
                else {
                    param.seperatedColorValues = eventData.colColorValue.toString()
                }
            }
            else {
                formfieldDataListTempData.push({ "name": "parentID", "value": 0 });
                param.parentID = 0;
                param.seperatedFormIDs = window["xSelected"].toString() + "," + window["ySelected"].toString();
                param.seperatedTitles = eventData.title + "," + eventData.dropinTitle //eventData.colActivityValue.toString() + " - " + eventData.colCategoryValue.toString() + " in " + eventData.dropin.toString();
                param.seperatedResFormIDs = window["ySelected"].toString() + "," + window["xSelected"].toString();
                param.seperatedResEntryIDs = eventData.resourceId.toString() + "," + eventData.id.toString();
                param.seperatedResColValues = eventData.resources.toString() + "," + eventData.activities.toString();
                param.seperatedColorValues = eventData.color.toString() + "/" + eventData.colColorValue.toString();
                param.seperatedIds = eventData.id.toString() + "," + eventData.resourceId.toString();
                param.isEventUpdatable = false;
                eventBasicData.formGroupKey = create_UUID();
            }
        }
        else {
            formfieldDataListTempData.push({ "name": "parentID", "value": 0 });
            param.parentID = 0;
            param.seperatedFormIDs = window["xSelected"].toString() + "," + window["ySelected"].toString();
            param.seperatedTitles = eventData.title + "," + eventData.dropinTitle //eventData.colActivityValue.toString() + " - " + eventData.colCategoryValue.toString() + " in " + eventData.dropin.toString();
            param.seperatedResFormIDs = window["ySelected"].toString() + "," + window["xSelected"].toString();
            param.seperatedResEntryIDs = eventData.resourceId.toString() + "," + eventData.id.toString();
            param.seperatedResColValues = eventData.resources.toString() + "," + eventData.activities.toString();
            param.seperatedColorValues = eventData.color.toString() + "/" + eventData.colColorValue.toString();
            param.seperatedIds = eventData.id.toString() + "," + eventData.resourceId.toString();
            param.isEventUpdatable = false;
            eventBasicData.formGroupKey = create_UUID();
        }
        param.formfieldDataListTemp = formfieldDataListTempData;
        var isAllowToUpdate = false;
        if (typeof seperatedTitles !== "undefined" && seperatedTitles !== "" && seperatedTitles !== null) {
        }

        $.ajax({
            method: 'POST',
            url: BASE_URL +"FormAPI/GeneratedFormData",
            dataType: 'json',
            contentType: "application/json",
            data: "{'action':" + param.action + ",'userId':" + param.userId + ",'formId':" + param.formId + ",'resourceFormId':" + resFormIdParam + ",'ActivityFormId':" + actFormIdParam + ",'parentID':" + param.parentID + ",'isDyEvent':" + param.isDyEvent + ",'isEventUpdatable':" + param.isEventUpdatable + ",'seperatedResColValues':'" + param.seperatedResColValues + "','seperatedColorValues':'" + param.seperatedColorValues + "',   'topicId':" + param.topicId + ",'created_by':" + param.created_by + ",'updated_by':" + param.update_by + ",'formGroupKey':'" + param.formGroupKey + "','formfieldDataListTemp':'" + JSON.stringify(param.formfieldDataListTemp) + "'}", //$.param(formData)
            beforeSend: function () {
                showLoader();
            },
            success: function (response) {
                if (response.res > 0 && param.action == 1) {
                    param.resourceFormId = resFormIdParam;
                    param.activityFormId = actFormIdParam;
                    param.resourceId = eventData.resourceId.toString();
                    param.activityId = eventData.id.toString();
                    manageOneToManyReferrenceForm(param);
                    param.activities = eventData.activities;
                    var calenderNewRow = {
                        Id: response.Id,
                        label: null,
                        selected: false,
                        value: response.Id,
                        color: eventData.color,
                        title: "",
                        start: eventData.start,
                        end: eventData.end,
                        allDay: eventData.allDay,
                        resourceId: eventData.resourceId,
                        resources: eventData.resources,
                        service: service,
                        description: description,
                        activities: eventData.activities,
                        customTitle: eventData.dropinTitle + ',' + param.activities.toString(),
                        customForms: eventData.resFormID + ',' + param.activityFormId.toString(),
                        customFormIds: eventData.resourceId + ',' + param.activityId.toString(),
                        parentID: 0,
                        formGroupKey: param.formGroupKey
                    };
                    var activityNewRow = {
                        Id: response.Id,
                        label: null,
                        selected: false,
                        value: response.Id,
                        color: eventData.color,
                        title: "",
                        start: eventData.start,
                        end: eventData.end,
                        allDay: eventData.allDay,
                        resourceId: eventData.id,
                        resources: eventData.resources,
                        service: service,
                        description: description,
                        activities: eventData.activities,
                        customTitle: eventData.dropinTitle + ',' + param.activities.toString(),
                        customForms: eventData.resFormID + ',' + param.activityFormId.toString(),
                        customFormIds: eventData.resourceId + ',' + param.activityId.toString(),
                        parentID: 0,
                        formGroupKey: param.formGroupKey
                    };
                    var oneToManyNewRow = {
                        Id: response.Id,
                        label: null,
                        selected: false,
                        value: response.Id,
                        color: eventData.color,
                        title: "",
                        start: eventData.start,
                        end: eventData.end,
                        allDay: eventData.allDay,
                        resourceId: eventData.resourceId,
                        resources: eventData.resources,
                        service: service,
                        description: description,
                        activities: eventData.activities,
                        customTitle: eventData.dropinTitle + ',' + param.activities.toString(),
                        customForms: eventData.resFormID + ',' + param.activityFormId.toString(),
                        customFormIds: eventData.resourceId + ',' + param.activityId.toString(),
                        parentID: 0,
                        formGroupKey: param.formGroupKey
                    };
                    var CalendarEventList = window["CalendarEventList"];
                    var ActivityEventList = window["ActivityEventList"];
                    eventBasicData.formData.FormDataToOneListDynamic.push(oneToManyNewRow);
                    CalendarEventList.push(calenderNewRow);
                    ActivityEventList.push(activityNewRow);
                    window["CalendarEventList"] = CalendarEventList;
                    window["ActivityEventList"] = ActivityEventList;
                    refreshEventResourcesActivity('BasicView', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, ActivityEventList);
                    window["EventBasicDetail"] = eventBasicData;
                    $.jGrowl(response.Message, { position: 'center' });
                    var _ScrollOffset = window["scrollOffset"];
                    window.scrollTo(0, _ScrollOffset);
                }
                else if (response.res > 0 && param.action == 2) {
                    try {
                        var CalendarEventList = window["CalendarEventList"];
                        var ActivityEventList = window["ActivityEventList"];
                        var oneToManyList = eventBasicData.formData.FormDataToOneListDynamic;
                        var CalenderEditableRow = $.grep(CalendarEventList, function (e) {
                            return e.Id == exists.Id;
                        });
                        if (CalenderEditableRow.length > 0) {
                            param.resourceFormId = resFormIdParam;
                            param.activityFormId = actFormIdParam;
                            param.resourceId = eventData.resourceId.toString();
                            param.activityId = eventData.id.toString();
                            param.formGroupKey = CalenderEditableRow[0].formGroupKey;
                            manageOneToManyReferrenceForm(param);
                        }
                        var ActivityEditableRow = $.grep(ActivityEventList, function (e) {
                            return e.Id == exists.Id;
                        });
                        var oneToManyListEditableRow = $.grep(oneToManyList, function (e) {
                            return e.Id == exists.Id;
                        });
                        CalenderEditableRow[0].customTitle += " ," + eventData.activities.toString();
                        CalenderEditableRow[0].customForms += " ," + eventData.actFormID.toString();
                        CalenderEditableRow[0].customFormIds += " ," + eventData.id.toString();
                        CalenderEditableRow[0].seperatedIds = param.seperatedIds;
                        CalenderEditableRow[0].seperatedTitles = param.seperatedTitles;
                        CalenderEditableRow[0].seperatedFormIDs = param.seperatedFormIDs;
                        CalenderEditableRow[0].parentID = param.parentID;
                        CalenderEditableRow[0].seperatedResFormIDs = param.seperatedResFormIDs;
                        CalenderEditableRow[0].seperatedResEntryIDs = param.seperatedResEntryIDs;
                        CalenderEditableRow[0].seperatedResColValues = param.seperatedResColValues;
                        CalenderEditableRow[0].seperatedColorValues = param.seperatedColorValues;
                        CalenderEditableRow[0].formGroupKey = param.formGroupKey;
                        ActivityEditableRow[0].seperatedIds = param.seperatedIds;
                        ActivityEditableRow[0].seperatedTitles = param.seperatedTitles;
                        ActivityEditableRow[0].seperatedFormIDs = param.seperatedFormIDs;
                        ActivityEditableRow[0].customTitle += " ," + eventData.activities.toString();
                        ActivityEditableRow[0].customForms += " ," + eventData.actFormID.toString();
                        ActivityEditableRow[0].customFormIds += " ," + eventData.id.toString();
                        ActivityEditableRow[0].parentID = param.parentID;
                        ActivityEditableRow[0].seperatedResFormIDs = param.seperatedResFormIDs;
                        ActivityEditableRow[0].seperatedResEntryIDs = param.seperatedResEntryIDs;
                        ActivityEditableRow[0].seperatedResColValues = param.seperatedResColValues;
                        ActivityEditableRow[0].seperatedColorValues = param.seperatedColorValues;
                        ActivityEditableRow[0].formGroupKey = param.formGroupKey;
                        oneToManyListEditableRow[0].seperatedIds = param.seperatedIds;
                        oneToManyListEditableRow[0].seperatedTitles = param.seperatedTitles;
                        oneToManyListEditableRow[0].seperatedFormIDs = param.seperatedFormIDs;
                        oneToManyListEditableRow[0].customTitle += " ," + eventData.activities.toString();
                        oneToManyListEditableRow[0].customForms += " ," + eventData.actFormID.toString();
                        oneToManyListEditableRow[0].customFormIds += " ," + eventData.id.toString();
                        oneToManyListEditableRow[0].parentID = param.parentID;
                        oneToManyListEditableRow[0].seperatedResFormIDs = param.seperatedResFormIDs;
                        oneToManyListEditableRow[0].seperatedResEntryIDs = param.seperatedResEntryIDs;
                        oneToManyListEditableRow[0].seperatedResColValues = param.seperatedResColValues;
                        oneToManyListEditableRow[0].seperatedColorValues = param.seperatedColorValues;
                        oneToManyListEditableRow[0].formGroupKey = param.formGroupKey;
                        var filteredEventsCalender = $.grep(CalendarEventList, function (e) {
                            return e.Id != exists.Id;
                        });
                        var filteredEventsActivity = $.grep(ActivityEventList, function (e) {
                            return e.Id != exists.Id;
                        });
                        var filteredoneToManyList = $.grep(oneToManyList, function (e) {
                            return e.Id != exists.Id;
                        });
                        filteredEventsCalender.push(CalenderEditableRow[0]);
                        filteredEventsActivity.push(ActivityEditableRow[0]);
                        filteredoneToManyList.push(oneToManyListEditableRow[0]);
                        eventBasicData.formData.FormDataToOneListDynamic = filteredoneToManyList;
                        _.each(filteredEventsCalender, function (dataRow, position) {
                            var rowRecord = dataRow;
                            var seperatedFormIDsParam = dataRow.customForms;
                            var seperatedIdsParam = dataRow.customFormIds != undefined ? dataRow.customFormIds : dataRow.customFormIds;
                            var seperatedTitleParam = dataRow.customTitle;
                            var commaIDs = seperatedIdsParam.split(',');
                            var commaVals = seperatedFormIDsParam.split(',');
                            var ySelected = window["ySelected"];
                            _.each(commaVals, function (idVal, pos) {
                                if (idVal.trim() == ySelected.toString()) {
                                    dataRow.resFormID = idVal;
                                    dataRow.resources = commaIDs[pos];
                                    dataRow.resourceId = commaIDs[pos];
                                }
                            })
                        });
                        window["CalendarEventList"] = filteredEventsCalender;
                        window["ActivityEventList"] = filteredEventsActivity;
                        refreshEventResourcesActivity('BasicView', filteredEventsCalender, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, filteredEventsActivity);
                        window["EventBasicDetail"] = eventBasicData;
                        $.jGrowl(response.Message, { position: 'center' });
                    }
                    catch (e) {
                        $.jGrowl(response.Message, { position: 'center' });
                        var _ScrollOffset = window["scrollOffset"];
                        window.scrollTo(0, _ScrollOffset);
                        $.unblockUI();
                    }
                }
                else {
                    var _ScrollOffset = window["scrollOffset"];
                    window.scrollTo(0, _ScrollOffset);
                    if (response.res == -1) {
                        var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
                        $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                        swal({ type: 'error', title: '', text: response.Message });

                    } else {
                        swal({ type: 'error', title: '', text: "failed" });
                    }

                }
            },
            complete: function () {
                var _ScrollOffset = window["scrollOffset"];
                window.scrollTo(0, _ScrollOffset);
                $.unblockUI();
            }
        });
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
            if (dialog.length > 2) {
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
            }

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
            var current_subtab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').find('.ui-state-active').attr('class');
            var allDayCustom = "false";
            if (current_subtab) {
                allDayCustom = (current_subtab.contains('fc-timelineMonth-button') || current_subtab.contains('fc-timelineYear-button')).toString();
            }
            var eventExtData = $(this).data('event');
            var resource = $("#" + current_tab + " .calendar").fullCalendar('getResourceById', resourceId);
            var title = eventExtData.title ? eventExtData.title : '';
            var id = eventExtData.id ? eventExtData.id : '';
            var resFormIdParam = window["ySelected"];
            var actFormIdParam = window["xSelected"];
            var resourceColumn = window["currResColumn"];
            var majorColumn = window["currMajorColumn"];
            var resourceValue = '', activityValue = title;
            var titleColActivity = eventExtData.activityfield;
            var titleColCategory = eventExtData.categoryfield;
            var titleColColor = eventExtData.colorfield;
            var dropin = eventExtData.dropin;
            var groupingfieldsresParam = eventExtData.groupingfieldsres;
            var dropinTitle = ""; var isAllowService = false;
            if (groupingfieldsresParam !== undefined && groupingfieldsresParam.length > 0) {
                groupingfieldsresParam = groupingfieldsresParam.split('-');
                _.each(groupingfieldsresParam, function (value, key) {
                    if (dropinTitle === "") {
                        dropinTitle = resource[value.trim()];
                    }
                    else
                        dropinTitle += " - " + resource[value.trim()];
                });
            }
            if (eventExtData.dimensiontype == "2D") {
                eventExtData.groupingvaluesact = eventExtData.title;
            }
            var colActivityValue = ""; var colCategoryValue = ""; var colColorValue = "";
            if (typeof resource[resourceColumn] != 'undefined') {
                resourceValue = resource[resourceColumn];
                if (eventExtData.dimensiontype == "2D")
                    dropinTitle = resourceValue;
            }
            if (typeof resource[titleColActivity] != 'undefined') {
                colActivityValue = resource[titleColActivity];
            }
            if (typeof resource[titleColCategory] != 'undefined') {
                colCategoryValue = resource[titleColCategory];
            }
            if (typeof resource[titleColColor] != 'undefined') {
                colColorValue = resource[titleColColor];
            }
            var defaultDuration = moment.duration(eventExtData.duration);
            var end = date.clone().add(defaultDuration);
            var exists = _.findWhere($scopeVar.calenderSettingsFormDetailsDataList, { activitiesForm: parseInt(eventExtData.formid) });
            if (exists != undefined) {
                if (exists.durationField == "0") {
                    allDayCustom = "true";
                } else {
                    allDayCustom = "false";
                }
            }
            var startCustom = date.format();
            var endCustom = end.format();
            if (allDayCustom == "true") {
                startCustom = date.format("YYYY-MM-DD");
                startCustom = moment(startCustom + " 00:00:00");
                endCustom = date.format("YYYY-MM-DD");
                let initialdate = endCustom;
                let start_time = '23:59:59';
                endCustom = moment(initialdate + " " + start_time);
            }
            else {
                allDayCustom = "false";
                if (eventExtData.duration == null || eventExtData.duration == "" || eventExtData.duration == undefined || exists.duration == "0") {
                    allDayCustom = "true";
                    startCustom = date.format("YYYY-MM-DD");
                    startCustom = moment(startCustom + " 00:00:00");
                    endCustom = date.format("YYYY-MM-DD");
                    let initialdate = endCustom;
                    let start_time = '23:59:59';
                    endCustom = moment(initialdate + " " + start_time);
                }
            }
            if ($('#allDay-check').is(':checked')) {
                allDayCustom = "true";
                startCustom = date.format("YYYY-MM-DD");
                startCustom = moment(startCustom + " 00:00:00");
                endCustom = date.format("YYYY-MM-DD");
                let initialdate = endCustom;
                let start_time = '23:59:59';
                endCustom = moment(initialdate + " " + start_time);
            }
            else {
                if (current_subtab.contains("fc-timelineDay-button") || current_subtab.contains("fc-agendaDay-button")) {

                }
                else {
                    allDayCustom = "true";
                    startCustom = date.format("YYYY-MM-DD");
                    startCustom = moment(startCustom + " 00:00:00");
                    endCustom = date.format("YYYY-MM-DD");
                    let initialdate = endCustom;
                    let start_time = '23:59:59';

                    endCustom = moment(initialdate + " " + start_time);
                }

            }
            var eventData = {
                id: id,
                title: eventExtData.groupingvaluesact,
                color: eventExtData.color,
                allDay: allDayCustom,
                start: startCustom,
                end: endCustom,
                resFormID: resFormIdParam,
                actFormID: actFormIdParam,
                resourceId: resourceId,
                resources: resourceValue,
                activities: activityValue,
                colActivityValue: colActivityValue,
                colCategoryValue: colCategoryValue,
                colColorValue: colColorValue,
                dropin: dropin,
                dimensionType: eventExtData.dimensiontype,
                dropinTitle: dropinTitle
            };
            var checkExists = window["eventListTemp"];
            var exists = _.filter(checkExists, function (item) {
                return compareEventStartEndDateTime(eventData, item) && (item.resourceId == eventData.resourceId ||
                    item.resources == eventData.resourceId);
            });
            if (exists.length > 0) {
                exists = _.filter(exists, function (item) { return item.customFormIdsSplit.length == 2 });
                if (exists.length > 0) {
                    var listExisting = angular.copy(exists);
                    exists = exists[0];
                    eventData.formGroupKey = exists.formGroupKey;
                    var seperatedIds = exists.customFormIds;
                    var comma = seperatedIds.split(',');
                    var _droppedForms = exists.customForms;
                    var _arr0 = _droppedForms.split(',');
                    var _checkIfExists = true;
                    _.each(_arr0, function (_row, _pos) {
                        if (_row.toString().trim() === actFormIdParam.toString()) {
                            _checkIfExists = false;
                            //break;
                        }

                    });
                    var _checkIfExistsIds = false;
                    var _droppedFormsIds = exists.customFormIds;
                    var _arr1 = _droppedFormsIds.split(',');
                    _.each(listExisting, function (item) {
                        var formlist = item.customForms.split(',');
                        var formIdslist = item.customFormIds.split(',');
                        // 
                        var formExist = _.filter(formlist, function (formItem) { return formItem.toString().trim() === actFormIdParam.toString() });
                        var formIdExist = _.filter(formIdslist, function (formIdItem) { return formIdItem.toString().trim() === eventData.id.toString() });
                        if (formExist.length > 0 && formIdExist.length > 0) {
                            _checkIfExistsIds = true;
                        }
                    });
                    if (!_checkIfExists) {
                        var checkOverlapping = _.where($scopeVar.calenderSettingsFormDetailsDataList, { resourceActivityForm: actFormIdParam });
                        if (checkOverlapping.length > 0) {
                            var eventOverlapping = _.filter(checkOverlapping, function (item) {
                                return item.eventOverlap == "1" || item.activitiesOverlap == "1";
                            });
                            // 
                            if (eventOverlapping.length > 0 && _checkIfExistsIds) {
                                eventData.formGroupKey = undefined;
                                if (!_checkIfExistsIds) {
                                    $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                                    swal({ type: 'error', title: '', text: 'cannot overlap same dimension entry in same timeslot' });
                                    return false;
                                }
                                else {
                                    generateEvent(eventData, eventExtData, date, end, resourceValue);
                                }
                            } else {
                                if (comma.length > 1 && !_checkIfExists && _checkIfExistsIds) {
                                    $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                                    swal({ type: 'error', title: '', text: 'cannot drop same dimension more than once in same event' });
                                    return false;
                                } else {
                                    eventData.formGroupKey = undefined;
                                    generateEvent(eventData, eventExtData, date, end, resourceValue);
                                }
                            }
                        } else {
                            $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                            swal({ type: 'error', title: '', text: 'cannot drop same dimension more than once in same event' });
                            return false;
                        }
                    }
                    else if (_checkIfExists) {
                        if (resourceValue !== '') {
                        }
                        if (eventData.title !== '') {
                            addExternalEvent(eventData);
                        }
                    }
                }
                else {
                    generateEvent(eventData, eventExtData, date, end, resourceValue);
                }
                //var comma = seperatedIds.split(',');
                //if (comma.length > 2) {
                //    $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                //    return false;
                //}
                //else {
                //    var _droppedForms = exists.customForms;
                //    var _arr0 = _droppedForms.split(',');
                //    var _checkIfExists = true;
                //    angular.forEach(_arr0, function (_row, _pos) {
                //        if (_row.toString().trim() === actFormIdParam.toString()) {
                //            _checkIfExists = false;
                //            //break;
                //        }

                //    });
                //    var _checkIfExistsIds = false;
                //    var _droppedFormsIds = exists.customFormIds;
                //    var _arr1 = _droppedFormsIds.split(',');
                //   _.each(listExisting, function (item) {
                //        var formlist = item.customForms.split(',');
                //        var formIdslist = item.customFormIds.split(',');
                //        var formExist = _.filter(formlist, function (formItem) { return formItem.toString().trim() === actFormIdParam.toString() });
                //        var formIdExist = _.filter(formIdslist, function (formIdItem) { return formIdItem.toString().trim() === eventData.id.toString() });
                //        if (formExist.length > 0 && formIdExist.length > 0) {
                //            _checkIfExistsIds = true;
                //        }
                //    });                
                //    if (!_checkIfExists) {
                //        var checkOverlapping = _.where($scopeVar.calenderSettingsFormDetailsDataList, { resourceActivityForm: actFormIdParam });
                //        if (checkOverlapping.length > 0) {
                //            var eventOverlapping = _.filter(checkOverlapping, function (item) {
                //                return item.eventOverlap == "1" || item.activitiesOverlap == "1";
                //            });
                //            if (eventOverlapping.length > 0 && _checkIfExistsIds) {
                //                eventData.formGroupKey = undefined;
                //                if (!_checkIfExistsIds) {
                //                    $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                //                    swal({ type: 'error', title: '', text: 'cannot overlap same dimension entry in same timeslot' });
                //                    return false;
                //                }
                //                else {
                //                    generateEvent(eventData, eventExtData, date, end, resourceValue);
                //                }
                //            } else {
                //                if (comma.length > 1 && !_checkIfExists && _checkIfExistsIds) {
                //                    $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                //                    swal({ type: 'error', title: '', text: 'cannot drop same dimension more than once in same event' });
                //                    return false;
                //                } else {
                //                    eventData.formGroupKey = undefined;
                //                    generateEvent(eventData, eventExtData, date, end, resourceValue);
                //                }
                //            }
                //        } else {
                //            $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                //            swal({ type: 'error', title: '', text: 'cannot drop same dimension more than once in same event' });
                //            return false;
                //        }
                //    }                  
                //    else if (_checkIfExists) {
                //        if (resourceValue !== '') {                           
                //        }
                //        if (eventData.title !== '') {
                //            addExternalEvent(eventData);
                //        }
                //    }                   
                //}
            }
            else {
                generateEvent(eventData, eventExtData, date, end, resourceValue);
            }
        }
    };
    function generateEvent(eventData, eventExtData, date, end, resourceValue) {
        var dropinTitle = ""; var isAllowService = false;
        //for activity category && overlap check.
        var postData = {
            action: 33,
            userId: eventData.userid,
            formId: eventData.formID,
            ActivityFormId: eventExtData.formid,
            ActivityId: eventExtData.id,
            ActivityFields: eventExtData.servicefield,
            resourceId: eventData.resourceId,
            isActivityCategory: 1,
            resEntryColumn: eventData.activitiesCategory,
            compareColumn: eventData.activityField,
            compareValue: eventExtData.title,
            startDate: date.format(),
            endDate: end.format(),
            eventOverlap: eventData.eventOverlap,
            activitiesOverlap: eventData.activitiesOverlap,
            isResourceExternalDrop: true

        }
        // select a category    eventExtData.servicefield !== '' && eventExtData.servicefield != null
        if (isAllowService) {
            async function callCategory(eventData) {
                // inputOptions can be an object or Promise
                const inputOptions = new Promise((resolve) => {
                    $.post(BASE_URL + "/FormAPI/getReferralFormFields", postData, function (response) {
                        if (typeof response.overlapMesage !== 'undefined') {
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
                                }
                            }
                            if (Object.keys(resolveCategory).length > 1) {
                                resolve(resolveCategory);
                            } else {
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
                                    if (result.value) {
                                        var service = $.trim(result.value[0]), description = $.trim(result.value[1]);
                                        if (resourceValue !== '')
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
                    if (result.value) {
                        var service = $.trim(result.value[0]), description = $.trim(result.value[1]);
                        if (eventData.resources !== '') {
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
        }
        else {
            if (resourceValue !== '') {
            }
            if (eventData.title !== '') {
                addExternalEvent(eventData);
            }
        }
    };
    function GetCalendarDateRange() {
        var calendar = $('#timeline-resource-view div.calendar').fullCalendar('getCalendar');
        var view = calendar.view;
        var start = view.start._d;
        var end = view.end._d;
        var dates = { start: start, end: end };
        return dates;
    }

    var myOptions1 = {
        //defaultDate: '2017-12-07',
        scrollTime: '00:00', // undo default 6am scrollTime
        header: {
            left: 'myCustomButton prev,next today',
            center: 'title',
            right: 'timelineDay,timelineMonth'
        },
        customButtons: {
            myCustomButton: {
                text: "Export To Excel",
                click: function () {
                    alert('Export To Excel')
                    var resourceFormId = window["ySelected"];
                    var formId = $scopeVar.currentFormId;
                    var userId = $scopeVar.userDetail.Id;
                    var typeView = 0;
                    var current_subtab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').find('.ui-state-active').attr('class');
                    if (current_subtab.contains('fc-timelineMonth-button'))
                        typeView = 1;
                    else if (current_subtab.contains('fc-timelineYear-button'))
                        typeView = 2;
                    var dates = GetCalendarDateRange();
                    var currentDate = moment(dates.start).format("YYYY-MM-DD");
                    var newpath = $scopeVar.EndPointUrl + '/downloadCalenderExcel?formId=' + formId + '&resourceFormId=' + resourceFormId + '&userId=' + userId + '&typeView=' + typeView + '&currentDate=' + currentDate + '';
                    window.location.href = $scopeVar.EndPointUrl + '/downloadCalenderExcel?formId=' + formId + '&resourceFormId=' + resourceFormId + '&userId=' + userId + '&typeView=' + typeView + '&currentDate=' + currentDate + '';
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

        resourceAreaWidth: '25%',
        events: calenderData,
        // resourceLabelText: "Client",
        //resourceOrder: resourceOrder,
        resourceColumns: resColumns,
        resources: resourceData,
        allDaySlot: true,
        resourceRender: function (resourceObj, labelTds, bodyTds) {
            var cellText = '';
            for (i = 0; i < labelTds.length; i++) {
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
    countLoader = 0;
    calendarOptions = $.extend({}, defaultOptions, resourceOptions, myOptions1);
    //$('#timeline-resource-view div.calendar').fullCalendar(calendarOptions);
    if ($scopeVar != undefined)
        if ($scopeVar.ySelection != 0) {
            if ($scopeVar.formDetailsDataInfo != null)
                if ($scopeVar.formDetailsDataInfo.calenderSettingsList != null)
                    if ($scopeVar.formDetailsDataInfo.calenderSettingsList.length > 0) {
                        var exists = _.findWhere($scopeVar.formDetailsDataInfo.calenderSettingsList, { resourceForm: $scopeVar.ySelection });
                        if (exists != undefined) {
                            if (exists.minTime != "" && exists.minTime != null && exists.minTime != undefined && exists.maxTime != null && exists.maxTime != undefined && exists.maxTime != "") {
                                var minTime = exists.minTime.trim().replace(' ', ':');
                                var maxTime = exists.maxTime.trim().replace(' ', ':');
                                $('#timeline-resource-view div.calendar').fullCalendar('option', 'minTime', minTime + ":00");
                                $('#timeline-resource-view div.calendar').fullCalendar('option', 'maxTime', maxTime + ":00");
                            }
                        }
                    }
        }
    if ($scopeVar != undefined)
        if ($scopeVar.isFilterApply) {
            var uniqEvents = _.uniq(calenderData, "resourceId");
            var tempFormData = [];
            _.each(resourceData, function (item) {
                var exists = _.findWhere(uniqEvents, { resourceId: item.id });
                if (exists != undefined) {
                    tempFormData.push(item);
                }
            });
            resourceData = tempFormData;
        }
    /// vertical resource view.

    var myOptions2 = {
        //defaultDate: '2017-12-07',
        scrollTime: '00:00', // undo default 6am scrollTime    
        header: {
            left: 'myCustomButton prev,next today',
            center: 'title',
            right: 'agendaDay,agendaTwoDays,agendaThreeDays,agendaWeek'
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
            },
            agendaWeek: {
                type: 'agenda',
                duration: { days: 7 },
                groupByResource: true,
            }
        },
        dayMinWidth: 150, // will cause horizontal scrollbars      
        defaultView: 'agendaDay',
        events: calenderData,
        resources: resourceData,
        allDaySlot: true
    };
   
    countLoader = 0;
    calendarOptions = $.extend({}, defaultOptions, resourceOptions, myOptions2);
    //$('#vertical-resource-view div.calendar').fullCalendar(calendarOptions);

    setTimeout(function () {
        $.unblockUI();
    }, 500);
}


var countLoader = 0;
function refreshEventResourcesActivity(calenderType, calenderData, resourceData, resColumns, activityFormData, activityColumn, activityEvents) {
    countLoader = 0;
    calenderData = changeResourceIDByYSelection((calenderData.data != undefined) ? calenderData.data : calenderData);
    window["eventListTemp"] = calenderData;
    var $scopeVar = angular.element($("#calendar")).scope();

    $('#basic-view div.calendar').fullCalendar('removeEvents');
    $('#basic-view div.calendar').fullCalendar('addEventSource', calenderData);


    $('#list-view div.calendar').fullCalendar('removeEvents');
    $('#list-view div.calendar').fullCalendar('addEventSource', calenderData);

    $('#agenda-view div.calendar').fullCalendar('removeEvents');
    $('#agenda-view div.calendar').fullCalendar('addEventSource', calenderData);

    $('#timeline-resource-view div.calendar').fullCalendar('removeEvents');
    $('#timeline-resource-view div.calendar').fullCalendar('addEventSource', calenderData);

    if ($scopeVar != undefined)
        if ($scopeVar.isFilterApply) {
            var uniqEvents = _.uniq(calenderData, "resourceId");
            var tempFormData = [];
            _.each(resourceData, function (item) {
                var exists = _.findWhere(uniqEvents, { resourceId: item.id });
                if (exists != undefined) {
                    tempFormData.push(item);
                }
            });
            resourceData = tempFormData;
        }
    $('#vertical-resource-view div.calendar').fullCalendar('removeEvents');
    $('#vertical-resource-view div.calendar').fullCalendar('addEventSource', calenderData);
    $('#vertical-resource-view div.calendar').fullCalendar('removeResource', resourceData);

    // Vertical Activities View
    activityEvents = changeResourceIDByXSelection(activityEvents)
    if ($scopeVar != undefined)
        if ($scopeVar.isFilterApply) {
            var uniqEvents = _.uniq(activityEvents, "resourceId");
            var tempFormData = [];
            _.each(activityFormData, function (item) {
                var exists = _.findWhere(uniqEvents, { resourceId: item.id });
                if (exists != undefined) {
                    tempFormData.push(item);
                }
            });
            activityFormData = tempFormData;
        }
    $('#vertical-activities-view div.calendar').fullCalendar('removeEvents');
    $('#vertical-activities-view div.calendar').fullCalendar('addEventSource', activityFormData);
}
function changeView(type) {
    alert(type);
};
function loadCalendar(calenderType, calenderData, resourceData, resColumns, activityFormData, activityColumn, activityEvents) {
    try {
        if (calenderData.length > 0)
            showLoader();
        else
            $.unblockUI();
    }
    catch (e) {
        $.unblockUI();
    }
    calenderData = changeResourceIDByYSelection((calenderData.data != undefined) ? calenderData.data : calenderData);
    window["eventListTemp"] = calenderData;
    var basicDetails = window["EventBasicDetail"];
    var GroupingData = window["colGrouping"];
    var $scopeVar = angular.element($("#calendar")).scope();
    var formID = basicDetails.formData.formId;
    var resourceColumn = '';
    var activitiesForm = basicDetails.formData.activitiesForm;
    var majorGroup = "";
    var minorGroup = "";
    var dialog = "";
    if (typeof GroupingData !== "undefined") {
        majorGroup = GroupingData[0].majorGroup;
        if (majorGroup != undefined) {
            majorGroup = majorGroup.replace('[', '').trim();
            majorGroup = majorGroup.replace(']', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
        }
        minorGroup = GroupingData[0].minorGroup;
        resourceColumn = GroupingData[0].minorGroup;
        window["currResColumn"] = resourceColumn;
        window["currMajorColumn"] = GroupingData[0].activitiesCategory;
    }
    else {
        majorGroup = basicDetails.formData.majorGroup;
        if (majorGroup != undefined) {
            majorGroup = majorGroup.replace('[', '').trim();
            majorGroup = majorGroup.replace(']', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
        }
        minorGroup = basicDetails.formData.minorGroup;
        resourceColumn = basicDetails.formData.minorGroup;
        window["currResColumn"] = resourceColumn;
    }
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
    var userid = 0;
    if (localStorage.detail != undefined && localStorage.detail != "")
        userid = JSON.parse(localStorage.detail).Id;
    var activitiesCategory = basicDetails.formData.activitiesCategory;
    if (activitiesCategory == '' || activitiesCategory == null)
        activitiesCategory = '0';
    var overlapField = basicDetails.formData.overlapField; // value of activity radioButton field   (for overlap)
    var calendarOptions = '';
    var resourceOrder = majorGroup + ',' + minorGroup;
    // managing resource ordering  data .
    var _ColumnResults = [];
    var _orderedArr = resourceOrder.split(',');
    $.each(_orderedArr, function (index, value1) {
        $.each(resColumns, function (index, value2) {
            if (value2.field == value1)
                _ColumnResults.push(value2);
        });
    });
    resColumns = _ColumnResults;
    var tagify = "";

    var defaultOptions = {
        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
        theme: true,
        themeSystem: 'jquery-ui',
        //  themeSystem:'bootstrap4',
        nowIndicator: true,
        slotDuration: '00:15:00',
        // defaultTimedEventDuration: defaultDuration,
        //aspectRatio: 1.5,
        defaultDate: new Date(),
        eventMouseover: function (event, jsEvent, view) {
            if (view.name !== 'agendaDay') {
                ////console.log(event);
                $(jsEvent.target).attr('title', event.title);
            }
        },
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
            //  revertFunc();

            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            if (current_tab === "vertical-activities-view") {
                revertFunc();
                return;
            }


            //console.log('event is');
            //console.log(event);
            var isInternalDropParam = true;
            window["scrollOffset"] = $(window).scrollTop();
            var eventBasicData = window["EventBasicDetail"];
            var eventExtData = $(this).data('event');
            var resourceValue = '', title = '';
            var Id = 0;
            if (typeof event.Id === "undefined")
                Id = event.value;
            else
                Id = event.Id;
            title = event.title;
            var actFormId = event.formId;
            var resFormId = window["ySelected"];
            var activityFormId = window["xSelected"];
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
            var allDay = event.allDay;
            var formfieldDataListTempData = [];
            //console.log(eventExtData);

            var $scope = angular.element($("#calendar")).scope();

            ////console.log(event);
            //alert(event.title + " end is now " + event.end.format());
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            if (!confirm("Are you sure about this change?")) {
                revertFunc();
            } else {
                if (event.resourceId) {
                    var resource = $("#" + current_tab + " .calendar").fullCalendar('getResourceById', event.resourceId);
                    var activity = $("#vertical - activities - view" + " .calendar").fullCalendar('getResourceById', event.activities);
                    var titleModifiedPart = ""; var majorGroupSplits = [];
                    if (resource && typeof resource[resourceColumn] != 'undefined') {
                        resourceValue = resource[resourceColumn];
                        titleModifiedPart = resourceValue;
                        if (typeof majorGroup !== undefined)
                            majorGroupSplits = majorGroup.split(',');
                        if (majorGroupSplits.length > 0) {
                            _.each(majorGroupSplits, function (value, pos) {
                                if (value != "") {
                                    if (titleModifiedPart !== "")
                                        titleModifiedPart += "-" + resource[value].toString();
                                    else
                                        titleModifiedPart = resource[value].toString();
                                }
                            });
                        }
                        var _currResFormId = window["ySelected"];
                        var _seperatedTitles = event.customTitle;
                        var _seperatedFormIDs = event.customForms;
                        var _seperatedIds = event.customFormIds;

                        //var _seperatedResFormIDs = event.seperatedResFormIDs;
                        //var _seperatedResEntryIDs = event.seperatedResEntryIDs;
                        //var _seperatedResColValues = event.seperatedResColValues;


                        if (typeof _seperatedTitles !== undefined)
                            _seperatedTitles = _seperatedTitles.split(',');
                        if (typeof _seperatedFormIDs !== undefined)
                            _seperatedFormIDs = _seperatedFormIDs.split(',');
                        if (typeof _seperatedIds !== undefined)
                            _seperatedIds = _seperatedIds.split(',');
                        //if (typeof _seperatedResFormIDs !== undefined)
                        //    _seperatedResFormIDs = _seperatedResFormIDs.split(',');
                        //if (typeof _seperatedResEntryIDs !== undefined)
                        //    _seperatedResEntryIDs = _seperatedResEntryIDs.split(',');
                        //if (typeof _seperatedResColValues !== undefined)
                        //    _seperatedResColValues = _seperatedResColValues.split(',');




                        _.each(_seperatedFormIDs, function (value, key) {
                            if (value.trim() === _currResFormId.toString().trim()) {
                                _seperatedTitles[key] = titleModifiedPart;
                                _seperatedIds[key] = event.resourceId;
                            }
                        });
                        //_.each(_seperatedResFormIDs, function (value, key) {
                        //    if (value === _currResFormId.toString()) {
                        //        _seperatedResEntryIDs[key] = event.resourceId;
                        //        _seperatedResColValues[key] = resourceValue;
                        //    }
                        //});

                        var _newseperatedTitles = ""; var _newseperatedIds = ""; var _newseperatedResEntryIDs = ""; var _newseperatedResColValues = "";
                        _.each(_seperatedFormIDs, function (value, key) {
                            if (_newseperatedTitles === "")
                                _newseperatedTitles = _seperatedTitles[key].toString();
                            else
                                _newseperatedTitles += " , " + _seperatedTitles[key].toString();


                            if (_newseperatedIds === "")
                                _newseperatedIds = _seperatedIds[key].toString();
                            else
                                _newseperatedIds += " , " + _seperatedIds[key].toString();

                            //if (_newseperatedResEntryIDs === "")
                            //    _newseperatedResEntryIDs = _seperatedResEntryIDs[key].toString();
                            //else
                            //    _newseperatedResEntryIDs += " , " + _seperatedResEntryIDs[key].toString();


                            //if (_newseperatedResColValues === "")
                            //    _newseperatedResColValues = _seperatedResColValues[key].toString();
                            //else
                            //    _newseperatedResColValues += " , " + _seperatedResColValues[key].toString();

                        });




                        var activityValue = activity[activityField];
                        //if (event.activities != 'undefined')
                        //   // title = event.activities + ' in ' + resourceValue;
                        //else
                        //   // title = ' in ' + resourceValue;
                    }
                }
                var indx = _.findIndex(event.customFormsSplit, function (formIdString) { return formIdString.toString().trim() == $scope.xSelection.toString() });
                if (indx != -1) {
                    activities = event.customFormIdsSplit[indx].toString().trim();
                }
                formfieldDataListTempData = [
                    { "name": "Id", "value": parseInt(Id) },
                    { "name": "title", "value": title },
                    { "name": "start", "value": start },
                    { "name": "end", "value": end },
                    { "name": "allDay", "value": allDay },
                    { "name": "activities", "value": activities },
                    { "name": "resources", "value": resourceId },
                ];

                $.ajax({
                    method: 'POST',
                    url: BASE_URL + "FormAPI/EditEventData",
                    dataType: 'json',
                    contentType: "application/json",
                    data: "{'action':2,'resourceFormId':" + resFormId + ",'ActivityFormId':" + activityFormId + ",'userid':" + eventBasicData.userId + ",'Id':" + parseInt(Id) + ", 'formId':" + eventBasicData.formId + ",'topicId':" + eventBasicData.formData.topicId + ",'created_by':" + eventBasicData.created_by + ",'updated_by':" + eventBasicData.update_by + ",'formfieldDataListTemp':'" + JSON.stringify(formfieldDataListTempData) + "' ,'isInternalDrop':" + isInternalDropParam + ",startDate:'" + start + "','endDate':'" + end + "','eventOverlap': '','activitiesOverlap':" + activitiesOverlap + "}", //$.param(formData)
                    success: function (response) {
                        if (response.res > 0) {
                            //else if (response.res > 0 && param.action == 2) {
                            try {
                                var CalendarEventList = window["CalendarEventList"];
                                var ActivityEventList = window["ActivityEventList"];
                                var oneToManyList = eventBasicData.formData.FormDataToOneListDynamic;

                                var CalenderEditableRow = $.grep(CalendarEventList, function (e) {
                                    return e.Id == event.Id;
                                });
                                var ActivityEditableRow = $.grep(ActivityEventList, function (e) {
                                    return e.Id == event.Id;
                                });
                                var oneToManyListEditableRow = $.grep(oneToManyList, function (e) {
                                    return e.Id == event.Id;
                                });

                                CalenderEditableRow[0].start = start;
                                CalenderEditableRow[0].end = end;
                                CalenderEditableRow[0].seperatedTitles = _newseperatedTitles;
                                CalenderEditableRow[0].seperatedIds = _newseperatedIds;
                                CalenderEditableRow[0].seperatedResColValues = _newseperatedResColValues;
                                CalenderEditableRow[0].seperatedResEntryIDs = _newseperatedResEntryIDs;




                                ActivityEditableRow[0].start = start;
                                ActivityEditableRow[0].end = end;
                                ActivityEditableRow[0].seperatedTitles = _newseperatedTitles;
                                ActivityEditableRow[0].seperatedIds = _newseperatedIds;
                                ActivityEditableRow[0].seperatedResColValues = _newseperatedResColValues;
                                ActivityEditableRow[0].seperatedResEntryIDs = _newseperatedResEntryIDs;

                                oneToManyListEditableRow[0].start = start;
                                oneToManyListEditableRow[0].end = end;
                                oneToManyListEditableRow[0].seperatedTitles = _newseperatedTitles;
                                oneToManyListEditableRow[0].seperatedIds = _newseperatedIds;
                                oneToManyListEditableRow[0].seperatedResColValues = _newseperatedResColValues;
                                oneToManyListEditableRow[0].seperatedResEntryIDs = _newseperatedResEntryIDs;
                                //var  filteredItems = CalendarEventList.filter((item) => item.Id !== response.Id);

                                //console.log('ffffff');
                                //console.log(CalenderEditableRow);

                                var filteredEventsCalender = $.grep(CalendarEventList, function (e) {
                                    return e.Id != event.Id;
                                });
                                var filteredEventsActivity = $.grep(ActivityEventList, function (e) {
                                    return e.Id != event.Id;
                                });
                                var filteredoneToManyList = $.grep(oneToManyList, function (e) {
                                    return e.Id != event.Id;
                                });
                                filteredEventsCalender.push(CalenderEditableRow[0]);
                                filteredEventsActivity.push(ActivityEditableRow[0]);
                                filteredoneToManyList.push(oneToManyListEditableRow[0]);
                                eventBasicData.formData.FormDataToOneListDynamic = filteredoneToManyList;



                                _.each(filteredEventsCalender, function (dataRow, position) {

                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;

                                    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;


                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    _.each(commaVals, function (idVal, pos) {
                                        //console.log(commaVals + "," + commaIDs[pos].toString())
                                        if (idVal == ySelected.toString()) {
                                            dataRow.resFormID = idVal;
                                            dataRow.resources = commaIDs[pos];
                                            dataRow.resourceId = commaIDs[pos];
                                            dataRow.title = "";
                                        }

                                    })



                                });

                                _.each(filteredEventsActivity, function (dataRow, position) {

                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;
                                    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;
                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    _.each(commaVals, function (idVal, pos) {
                                        //console.log(commaVals + "," + commaIDs[pos].toString())
                                        if (idVal == ySelected.toString()) {
                                            dataRow.resFormID = idVal;
                                            dataRow.resources = commaIDs[pos];
                                            dataRow.resourceId = commaIDs[pos];
                                            dataRow.title = "";
                                        }

                                    })



                                });

                                _.each(filteredoneToManyList, function (dataRow, position) {

                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;

                                    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;


                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    _.each(commaVals, function (idVal, pos) {
                                        //console.log(commaVals + "," + commaIDs[pos].toString())
                                        if (idVal == ySelected.toString()) {
                                            dataRow.resFormID = idVal;
                                            dataRow.resources = commaIDs[pos];
                                            dataRow.resourceId = commaIDs[pos];
                                            dataRow.title = "";
                                        }

                                    })



                                });


                                window["CalendarEventList"] = filteredEventsCalender;
                                window["ActivityEventList"] = filteredEventsActivity;
                                console.log('hi3')
                                //$('.calendar').fullCalendar('destroy');
                                //loadCalendar('BasicView', filteredEventsCalender, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, filteredEventsActivity);
                                refreshEventResourcesActivity('BasicView', filteredEventsCalender, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, filteredEventsActivity);
                                //$('#timeline-resource-view div.calendar').fullCalendar('refetchEvents');


                                //eventBasicData.formGroupKey = create_UUID();
                                window["EventBasicDetail"] = eventBasicData;
                                $.jGrowl(response.Message, { position: 'center' });
                                // $scope.bindDraggable();
                            }
                            catch (e) {
                                //console.log(e);
                                $.jGrowl(response.Message, { position: 'center' });

                                var _ScrollOffset = window["scrollOffset"];
                                window.scrollTo(0, _ScrollOffset);
                                $.unblockUI();
                            }

                        } else {
                            revertFunc();
                            if (response.res == -1) {
                                swal({ type: 'error', title: '', text: response.Message });

                            } else {
                                swal({ type: 'error', title: '', text: response.overlapMessage });
                            }


                        }

                    },

                    beforeSend: function () {
                        showLoader();
                    },

                    complete: function () {

                        var _ScrollOffset = window["scrollOffset"];
                        window.scrollTo(0, _ScrollOffset);
                        $.unblockUI();
                        // $("#" + current_tab + " div.calendar").unblock();
                    }
                });



            }

        },
        //  resize event's duration inside calendar view
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
            window["scrollOffset"] = $(window).scrollTop();
            var resourceId = (event.resourceId) ? event.resourceId : '';
            var resources = (event.resources) ? event.resources : '';
            var activities = (event.activities) ? event.activities : '';
            var allDay = event.allDay;
            var formfieldDataListTempData = [];
            var activityName = '';
            var resFormId = window["ySelected"];
            var activityFormId = window["xSelected"];
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
                    url: BASE_URL + "FormAPI/EditEventData",
                    dataType: 'json',
                    contentType: "application/json",
                    data: "{'action':2,'resourceFormId':" + resFormId + ",'ActivityFormId':" + activityFormId + ",'userid':" + eventBasicData.userId + ",'Id':" + parseInt(Id) + ", 'formId':" + eventBasicData.formId + ",'topicId':" + eventBasicData.formData.topicId + ",'created_by':" + eventBasicData.created_by + ",'updated_by':" + eventBasicData.update_by + ",'formfieldDataListTemp':'" + JSON.stringify(formfieldDataListTempData) + "' ,'isResizedEvent':" + parseInt(isResizedEvent) + ",startDate:'" + start + "','endDate':'" + end + "','eventOverlap':" + eventOverlap + ",'activitiesOverlap':" + activitiesOverlap + "}", //$.param(formData)
                    success: function (response) {
                        if (response.res > 0) {

                            try {
                                var CalendarEventList = window["CalendarEventList"];
                                var ActivityEventList = window["ActivityEventList"];
                                var oneToManyList = eventBasicData.formData.FormDataToOneListDynamic;
                                var CalenderEditableRow = $.grep(CalendarEventList, function (e) {
                                    return e.Id == event.Id;
                                });
                                var ActivityEditableRow = $.grep(ActivityEventList, function (e) {
                                    return e.Id == event.Id;
                                });
                                var oneToManyListEditableRow = $.grep(oneToManyList, function (e) {
                                    return e.Id == event.Id;
                                });
                                CalenderEditableRow[0].start = start;
                                CalenderEditableRow[0].end = end;
                                ActivityEditableRow[0].start = start;
                                ActivityEditableRow[0].end = end;
                                oneToManyListEditableRow[0].start = start;
                                oneToManyListEditableRow[0].end = end;
                                var filteredEventsCalender = $.grep(CalendarEventList, function (e) {
                                    return e.Id != event.Id;
                                });
                                var filteredEventsActivity = $.grep(ActivityEventList, function (e) {
                                    return e.Id != event.Id;
                                });
                                var filteredoneToManyList = $.grep(oneToManyList, function (e) {
                                    return e.Id != event.value;
                                });
                                filteredEventsCalender.push(CalenderEditableRow[0]);
                                filteredEventsActivity.push(ActivityEditableRow[0]);
                                filteredoneToManyList.push(oneToManyListEditableRow[0]);
                                eventBasicData.formData.FormDataToOneListDynamic = filteredoneToManyList;
                                _.each(filteredEventsCalender, function (dataRow, position) {

                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;

                                    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;


                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    _.each(commaVals, function (idVal, pos) {
                                        //console.log(commaVals + "," + commaIDs[pos].toString())
                                        if (idVal == ySelected.toString()) {
                                            dataRow.resFormID = idVal;
                                            dataRow.resources = commaIDs[pos];
                                            dataRow.resourceId = commaIDs[pos];
                                            dataRow.title = "";
                                        }

                                    })



                                });
                                _.each(filteredEventsActivity, function (dataRow, position) {

                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;
                                    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;
                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    _.each(commaVals, function (idVal, pos) {
                                        //console.log(commaVals + "," + commaIDs[pos].toString())
                                        if (idVal == ySelected.toString()) {
                                            dataRow.resFormID = idVal;
                                            dataRow.resources = commaIDs[pos];
                                            dataRow.resourceId = commaIDs[pos];
                                            dataRow.title = "";
                                        }

                                    })



                                });
                                _.each(filteredoneToManyList, function (dataRow, position) {

                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;

                                    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;


                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    _.each(commaVals, function (idVal, pos) {
                                        //console.log(commaVals + "," + commaIDs[pos].toString())
                                        if (idVal == ySelected.toString()) {
                                            dataRow.resFormID = idVal;
                                            dataRow.resources = commaIDs[pos];
                                            dataRow.resourceId = commaIDs[pos];
                                            dataRow.title = "";
                                        }

                                    })



                                });
                                window["CalendarEventList"] = filteredEventsCalender;
                                window["ActivityEventList"] = filteredEventsActivity;
                                refreshEventResourcesActivity('BasicView', filteredEventsCalender, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, filteredEventsActivity);
                                window["EventBasicDetail"] = eventBasicData;
                                $.jGrowl(response.Message, { position: 'center' });
                            }
                            catch (e) {
                                $.jGrowl(response.Message, { position: 'center' });
                                var _ScrollOffset = window["scrollOffset"];
                                window.scrollTo(0, _ScrollOffset);
                                $.unblockUI();
                            }
                        } else {
                            revertFunc();
                            if (response.res == -1) {
                                swal({ type: 'error', title: '', text: response.Message });

                            } else {
                                swal({ type: 'error', title: '', text: response.overlapMessage });
                            }
                        }
                    },
                    beforeSend: function () {
                        showLoader();
                    },
                    complete: function () {
                        var _ScrollOffset = window["scrollOffset"];
                        window.scrollTo(0, _ScrollOffset);
                        $.unblockUI();
                    }
                });
            }
        },
        eventRender: function (event, element) {

            if (countLoader == 0) {
                showLoader();
                countLoader++;
            }
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            if (current_tab == "agenda-view") {
                var $scope = angular.element($("#calendar")).scope();
                $scope.$parent.$parent.IND_loading = true;
                if ($scope.counterLoader == undefined)
                    showLoader();
                $scope.counterLoader = 1;
            }
            var rowTooltipDisplay = "";
            var rowTooltipTitleDisplay = "";
            var table = $("<div class='event-detail div-flex'></div>"), deleteParams;
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            var current_subtab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').find('.ui-state-active').attr('class');
            var resourceA = $("#" + current_tab + " .calendar").fullCalendar('getResourceById', event.resourceId);
            var events = $("#" + current_tab + " .calendar").fullCalendar('clientEvents');
            if (event.data) {
                //add row data on right hand side
                var imageFound = 0, rowRecord = "", data = event.data;
                console.log(data);
                $.each(columns, function (field, text) {
                    if (typeof (data[field]) !== 'undefined' && $.inArray(field, ['current_status', 'title', 'color']) === -1) {
                        var value = data[field];
                        var result = value.toString().indexOf("uploads");

                        if (result < 0) {
                            // No image found
                            if (data[field] !== "") { rowRecord += "<div class='" + field + "'><strong>" + text + ":</strong> " + data[field] + "</div>"; }
                        } else {
                            // Image found                        
                            imageFound++;
                            if (/\.(jpe?g|png|gif)$/i.test(value)) {
                                if (value.startsWith("uploads"))
                                    img = "<img class='img-responsive' src='{{asset('')}}/" + value + "'/>";
                                else
                                    img = "<img class='img-responsive' src='{{asset('/uploads/users/'.$uid)}}/" + value + "'/>";
                                $(img).on("load", function () {
                                }).on("error", function () {
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
                            table.append("<div class='div-flex'><div class='media'>" + img + "</div></div>");
                        }
                    }
                });
            }
            else {
                var rowRecord = "";
                var _associatedTitles = event.customTitle;
                var _associatedFormIDs = event.customForms;
                var $scope = angular.element($("#calendar")).scope();
                var _allSelectables = $scope.xaxisFormList; // x options has all selectable options .
                var _ySelected = window["ySelected"]; // get y selected option.
                var _xSelected = window["xSelected"];
                var _lablesToShow = []; var _colorToShow = [];
                var _tempTitle = "";
                var _tempTitleSecond = "";
                _.each(_allSelectables, function (dataRow, position) {
                    if (dataRow.resourceActivityForm !== _ySelected) {
                        _lablesToShow.push(dataRow.resourceActivityForm.toString());

                    }
                });
                if (typeof _associatedTitles !== "undefined" && _associatedTitles !== null && _associatedTitles !== "") {
                    var _arrTitles = _associatedTitles.split(',');
                    var _arrFormIDs = _associatedFormIDs.split(',');
                    var _arrColor = [];
                    var formIdTemp = [];
                    _.each(_arrFormIDs, function (item) {
                        formIdTemp.push(item.trim());
                    });
                    _arrFormIDs = formIdTemp;
                    //getting index of x selected form  from  associated formIDs arr
                    var _xPos = _arrFormIDs.indexOf(_xSelected.toString());
                    //swapping position of x occurance  with 0 index;
                    if (_xPos !== undefined && _xPos !== null && _xPos !== -1) {
                        var _temp = "";
                        //for titles
                        _temp = _arrTitles[0];
                        _arrTitles[0] = _arrTitles[_xPos];
                        _arrTitles[_xPos] = _temp;
                        //for color
                        if (_arrColor.length > 0) {
                            _temp = _arrColor[0];
                            _arrColor[0] = _arrColor[_xPos];
                            _arrColor[_xPos] = _temp;
                        }
                        //for formIDs
                        _temp = _arrFormIDs[0];
                        _arrFormIDs[0] = _arrFormIDs[_xPos];
                        _arrFormIDs[_xPos] = _temp;
                    }
                    var eventTemp = angular.copy(event);
                    if (!eventTemp.allDay) {
                        eventTemp.start = eventTemp.start != null && eventTemp.start != undefined && eventTemp.start != '' ? customDate(eventTemp.start.format()) : '';
                        if (eventTemp.end != "" && eventTemp.end != null) {
                            eventTemp.end = eventTemp.end != null && eventTemp.end != undefined && eventTemp.end != '' ? customDate(eventTemp.end.format()) : '';
                            rowTooltipDisplay += DateWithDayName(eventTemp, true) + " <br/> "
                            rowTooltipDisplay += TimeFormatCalender(eventTemp, true) + " "
                        } else {
                            rowTooltipDisplay += moment(eventTemp.start).format("YYYY-MM-DD") + " "
                        }
                    }
                    else {
                        rowTooltipDisplay += moment(eventTemp.start).format("YYYY-MM-DD") + " "
                    }
                    element.find('.fc-content').remove();
                    if (eventTemp.description != "" && eventTemp.description != null) {
                        _tempTitle += "<label class='pr-2'>" + eventTemp.description + "</label>";
                    }
                    _.each(_arrTitles, function (_arrRowData, position) {
                        _tempTitle += "<div class='temp'>";
                        var _isAllowToRender = false;
                        var TitleFormId = _arrFormIDs[position];
                        var lblColor = "";
                        if (TitleFormId != undefined) {
                            _.each(_lablesToShow, function (dataRow2, position2) {
                                if (TitleFormId.toString().trim() === dataRow2)
                                    _isAllowToRender = true;
                            });
                        }
                        var count = 0;
                        var currentId = 0;
                        var list = [];
                        var listids = [];
                        var listDrop = "";
                        var listDropdownTemp = {};
                        if (TitleFormId != undefined)
                            if (TitleFormId.toString().trim() != "") {
                                listDropdownTemp = _.findWhere($scopeVar.yaxisFormListCopy, { resourceActivityForm: parseInt(TitleFormId.toString().trim()) });
                                if (listDropdownTemp != undefined) {
                                    listDrop = "<div class='d-none popoverSelect'><select class='form-control form-control-sm w-50' onchange=\"changeDimension(\'" + TitleFormId.toString().trim() + "\',\'" + event.formGroupKey.toString() + "\',\'" + event.Id.toString() + "\',this);\" >"
                                    var col1 = ""
                                    var col2 = ""
                                    col2 = listDropdownTemp.minorGroup;
                                    if (listDropdownTemp.majorGroup == "[]") {
                                        col1 = "blank";
                                    } else {
                                        if (listDropdownTemp.majorGroup.contains('[')) {
                                            col1 = JSON.parse(listDropdownTemp.majorGroup)[0];
                                        }
                                    }
                                    if (event.customForms != "") {
                                        list = event.customForms.split(',');
                                        for (var i = 0; i < list.length; i++) {
                                            if (list[i].toString().trim() == listDropdownTemp.resourceActivityForm.toString()) {
                                                count = i;
                                                break;
                                            }
                                        }
                                        listids = event.customFormIds.split(',');
                                        currentId = listids[count].toString().trim();
                                    }
                                    _.each(listDropdownTemp.formDataList, function (item) {
                                        var text = "";
                                        if (item[col1] != undefined && item[col2] != undefined) {
                                            text = item[col1] + " - " + item[col2];
                                        }
                                        else if (item[col1] == undefined) {
                                            text += item[col2];
                                        }
                                        var cId = (item.Id != undefined ? item.Id : item.id);
                                        if (currentId.toString() == cId) {
                                            var tempColor = "";
                                            var colorExists = _.findWhere($scopeVar.xaxisFormList, { resourceActivityForm: parseInt(TitleFormId.toString().trim()) });
                                            if (colorExists != undefined) {
                                                var colorRow = _.findWhere(colorExists.formDataList, { id: currentId.toString() });
                                                if (colorRow != undefined) {
                                                    tempColor = colorRow[colorExists.colorField];
                                                }
                                            }
                                            lblColor = tempColor;
                                            listDrop += "<option selected value='" + cId + "'>" + text + "</option>";
                                        } else {
                                            listDrop += "<option value='" + cId + "'>" + text + "</option>";
                                        }
                                    });
                                    listDrop += "</select><i class='fa fa-times closeSelect cursor-pointer ml-2 fa-sm'></i></div>"
                                }
                            }
                        if (_arrRowData != undefined) {
                            _arrRowData = _arrRowData.split('-');
                            //label render.
                            if (_isAllowToRender) {
                                if (_tempTitle === "") {
                                    if (_arrRowData.length > 1)
                                        _tempTitle = "<span class='titleContainer'><span class='title1'> " + _arrRowData[1].toString() + " - " + _arrRowData[0].toString() + "</span><i class='fa fa-pencil editTitle ml-2 cursor-pointer fa-sm'></i><i class='fa fa-trash deleteTitle ml-2 cursor-pointer fa-sm' onclick=\"deleteDimension(\'" + currentId + "\',\'" + list[count] + "\',\'" + event.formGroupKey + "\',this);\"></i></span>";
                                    else
                                        _tempTitle = "<span class='titleContainer'><span class='title1'>  " + _arrRowData[0].toString() + "</span><i class='fa fa-pencil editTitle ml-2 cursor-pointer fa-sm'></i> <i class='fa fa-trash deleteTitle ml-2 cursor-pointer fa-sm' onclick=\"deleteDimension(\'" + currentId + "\',\'" + list[count] + "\',\'" + event.formGroupKey + "\',this);\"></i></span>";
                                    _tempTitleSecond = _arrRowData[0].toString();
                                    _tempTitle += listDrop;
                                }
                                else {
                                    if (_arrRowData.length > 1)
                                        _tempTitle += "<span class='titleContainer'><span class='title1'> " + _arrRowData[1].toString() + " - " + _arrRowData[0].toString() + "</span><i class='fa fa-pencil editTitle ml-2 cursor-pointer fa-sm'></i><i class='fa fa-trash deleteTitle ml-2 cursor-pointer fa-sm' onclick=\"deleteDimension(\'" + currentId + "\',\'" + list[count] + "\',\'" + event.formGroupKey + "\',this);\"></i></span>";
                                    else
                                        _tempTitle += "<span class='titleContainer'><span class='title1'> " + _arrRowData[0].toString() + "</span><i class='fa fa-pencil editTitle ml-2 cursor-pointer fa-sm'></i><i class='fa fa-trash deleteTitle ml-2 cursor-pointer fa-sm' onclick=\"deleteDimension(\'" + currentId + "\',\'" + list[count] + "\',\'" + event.formGroupKey + "\',this);\"></i></span>";
                                    _tempTitleSecond += _arrRowData[0].toString();
                                    _tempTitle += listDrop;
                                }
                                var slipTitle = "";
                                if (_arrRowData.length == 1)
                                    slipTitle = _arrRowData[0];
                                else if (_arrRowData.length > 1)
                                    slipTitle = _arrRowData[0] + " - " + _arrRowData[1];
                                rowTooltipTitleDisplay += slipTitle + " <br/> ";
                                element.append(
                                    $('<div>', {
                                        class: 'fc-content', "id": event.Id + "_" + list[count].trim() + "_" + currentId
                                    }).append(
                                        $('<span>', { class: 'fc-title', "title": "" }).text(slipTitle)
                                    ).css({
                                        background: lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor,
                                        //width: "200px",
                                        borderRadius: 3,
                                    })
                                );
                            }
                        }

                        _tempTitle += "</div>";
                    });

                    _.each($scopeVar.yaxisFormListCopy, function (listDropdownTemp) {
                        var exists = _.filter(_arrFormIDs, function (flitem) { return flitem == listDropdownTemp.resourceActivityForm.toString() });
                        if (exists.length == 0) {
                            _tempTitle += "<div class='temp'>";
                            var listDrop = "";
                            var currentId = 0;
                            listDrop = "<div class='d-none popoverSelect'><select class='form-control form-control-sm w-50' onchange=\"changeDimension(\'" + listDropdownTemp.resourceActivityForm.toString().trim() + "\',\'" + event.formGroupKey.toString() + "\',\'" + event.Id.toString() + "\',this);\" >"
                            var col1 = ""
                            var col2 = ""
                            col2 = listDropdownTemp.minorGroup;
                            if (listDropdownTemp.majorGroup == "[]") {
                                col1 = "blank";
                            } else {
                                if (listDropdownTemp.majorGroup.contains('[')) {
                                    col1 = JSON.parse(listDropdownTemp.majorGroup)[0];
                                }
                            }
                            listDrop += "<option value='0' selected></option>";
                            _.each(listDropdownTemp.formDataList, function (item) {
                                var text = "";
                                if (item[col1] != undefined && item[col2] != undefined) {
                                    text = item[col1] + " - " + item[col2];
                                }
                                else if (item[col1] == undefined) {
                                    text += item[col2];
                                }
                                var cId = (item.Id != undefined ? item.Id : item.id);
                                listDrop += "<option value='" + cId + "'>" + text + "</option>";

                            });
                            listDrop += "</select><i class='fa fa-times closeSelect cursor-pointer ml-2 fa-sm'></i></div>"
                            _tempTitle += "<span class='titleContainer'><span class='text-muted'> " + listDropdownTemp.title + "</span><i class='fa fa-plus editTitle ml-2 cursor-pointer fa-sm'></i></span>";
                            _tempTitle += listDrop;
                            _tempTitle += "</div>";
                        }
                    });

                }
                var eventData = {
                    Id: event.Id,
                    Images: event.files,
                    title: _tempTitle,
                    start: event.start != null && event.start != undefined && event.start != '' ? customDate(event.start.format()) : '',
                    end: event.end != null && event.end != undefined && event.end != '' ? customDate(event.end.format()) : '',
                    allDay: event.allDay,
                    service: event.service,
                    description: event.description,
                    resources: event.resources,
                    activities: event.activities,
                    activityName: event.activityName,
                };
                var eventData = angular.copy(event);
                eventData.title = _tempTitle;
                eventData.Images = event.files;
                eventData.start = event.start != null && event.start != undefined && event.start != '' ? customDate(eventData.start.format()) : ''
                eventData.end = event.end != null && event.end != undefined && event.end != '' ? customDate(eventData.end.format()) : ''
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
                    rowRecord += "<div class='title " + _tempTitleSecond + "'>" + eventData.title + "</div>";
                if (!eventData.allDay) {
                    if (eventData.start != null && eventData.start.length > 0)
                        rowRecord += "<div class='" + eventData.start + "'>" + DateWithDayName(eventData, true) + "</div>";
                    rowRecord += "<div>" + TimeFormatCalender(eventData, true) + "</div>";
                    if (current_tab == "list-view") {
                        //console.log(window.ySelected)
                        //console.log(event, eventData, 'list-view')
                        var _associatedTitlestemp = _associatedTitles.split(",");
                        var _associatedFormIDsTemp = _associatedFormIDs.split(",");
                        var formIdTemp = [];
                        _.each(_associatedFormIDsTemp, function (item) {
                            formIdTemp.push(item.trim());
                        });
                        _associatedFormIDsTemp = formIdTemp;
                        formIdTemp = [];
                        _.each(_associatedTitlestemp, function (item) {
                            formIdTemp.push(item.trim());
                        });
                        _associatedTitlestemp = formIdTemp;
                        var _associatedCustomFormIdsTemp = event.customFormIds.split(',');
                        formIdTemp = [];
                        _.each(_associatedCustomFormIdsTemp, function (item) {
                            formIdTemp.push(item.trim());
                        });
                        _associatedCustomFormIdsTemp = formIdTemp;
                        if ($scope.ySelection != undefined)
                        var exists = _.findIndex(_associatedFormIDsTemp, function (item) { return item == $scope.ySelection.toString() });
                        var lblColor = undefined;
                        var customLocationTitle = "";
                        if (exists >= 0) {
                            customLocationTitle = _associatedTitlestemp[exists];
                            var tempColor = "";
                            var colorExists = _.findWhere($scopeVar.xaxisFormList, { resourceActivityForm: $scope.ySelection });
                            var currentId = _associatedCustomFormIdsTemp[exists].toString();
                            if (colorExists != undefined) {
                                var colorRow = _.findWhere(colorExists.formDataList, { id: currentId });
                                if (colorRow != undefined) {
                                    tempColor = colorRow[colorExists.colorField];
                                }
                            }
                            lblColor = tempColor;
                        }
                        if (customLocationTitle != "" && customLocationTitle != null && customLocationTitle != undefined) {
                            element.append(
                                $('<div>', {
                                    class: 'fc-content', "id": "customLocationTitle"
                                }).append(
                                    $('<span>', { class: 'fc-title', "title": "" }).text(customLocationTitle)
                                ).css({
                                    background: lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor,
                                    //width: "200px",
                                    borderRadius: 3,
                                }));
                        }
                        element.prepend(
                            $('<div>', {
                                class: 'fc-content fcTime', "id": event.Id + "_Time"

                            }).append(
                                $('<small>', { class: 'time', "title": "" }).text(TimeFormatCalender(eventData, true))
                            )
                        );

                    } else {
                        if (current_subtab != undefined) {
                            if ((current_tab == "agenda-view" || current_tab == "timeline-resource-view") && (current_subtab.contains("fc-month-button") || current_subtab.contains("fc-timelineYear-button") || current_subtab.contains("fc-timelineMonth-button"))) {
                                element.prepend($('<div>', { class: 'fc-content' }).append(
                                    $('<span class="text-dark small">').text(TimeFormatCalender(eventData, true))
                                ));
                            }
                        }

                    }
                }
                else {
                    if (current_tab == "list-view") {
                        var _associatedTitlestemp = _associatedTitles.split(",");
                        var _associatedFormIDsTemp = _associatedFormIDs.split(",");
                        var formIdTemp = [];
                        _.each(_associatedFormIDsTemp, function (item) {
                            formIdTemp.push(item.trim());
                        });
                        _associatedFormIDsTemp = formIdTemp;
                        formIdTemp = [];
                        _.each(_associatedTitlestemp, function (item) {
                            formIdTemp.push(item.trim());
                        });
                        _associatedTitlestemp = formIdTemp;
                        var _associatedCustomFormIdsTemp = event.customFormIds.split(',');
                        formIdTemp = [];
                        _.each(_associatedCustomFormIdsTemp, function (item) {
                            formIdTemp.push(item.trim());
                        });
                        _associatedCustomFormIdsTemp = formIdTemp;
                        var exists = _.findIndex(_associatedFormIDsTemp, function (item) { return item == $scope.ySelection.toString() });
                        var lblColor = undefined;
                        var customLocationTitle = "";
                        if (exists >= 0) {
                            customLocationTitle = _associatedTitlestemp[exists];
                            var tempColor = "";
                            var colorExists = _.findWhere($scopeVar.xaxisFormList, { resourceActivityForm: $scope.ySelection });
                            var currentId = _associatedCustomFormIdsTemp[exists].toString();
                            if (colorExists != undefined) {
                                var colorRow = _.findWhere(colorExists.formDataList, { id: currentId });
                                if (colorRow != undefined) {
                                    tempColor = colorRow[colorExists.colorField];
                                }
                            }
                            lblColor = tempColor;
                        }
                        if (customLocationTitle != "" && customLocationTitle != null && customLocationTitle != undefined) {
                            element.append(
                                $('<div>', {
                                    class: 'fc-content', "id": "dd"
                                }).append(
                                    $('<span>', { class: 'fc-title', "title": "" }).text(customLocationTitle)
                                ).css({
                                    background: lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor,
                                    //width: "200px",
                                    borderRadius: 3,
                                })
                            );
                        }
                    }
                    rowRecord += "<div class='" + moment(eventData.start).format("YYYY-MM-DD") + "'>" + moment(eventData.start).format("MMMM D, YYYY (dddd)") + "</div>";
                }

                // For Tag view  //
                //static tagify
                rowRecord += '<div>  <input value="' + eventData.Id + '" id="tag-inputHidden" type="hidden"> ';
                //dynamic tagify
                _.each($scope.totalSelectListTagify, function (item) {
                    var taglist = [];
                    var tempTag = eventData[item.fieldName];
                    if (tempTag != undefined && tempTag != null && tempTag != "") {
                        taglist = tempTag.replace(/"/g, "'");
                    }
                    rowRecord += '<input value="' + item.fieldName + '" id="tag-inputHidden' + eventData.Id + '" type="hidden"> <input value="' + taglist + '" id="tag-inputHidden' + item.fieldName + '" type="hidden"><input id="tag-input' + item.fieldName + '" type="text"  value="' + taglist + '" placeholder="Add tags">';
                });
                rowRecord += '</div>';
                if (imageFound > 1) {
                    showAllFiles = "<a  class='btn btn-xs btn-default' data-toggle='modal' data-target='#galleryModal' title='Show all files'   data-files='" + eventData.Images + "'>Show all files</a>";
                    rowRecord += "<div class='" + eventData.Images + "'><strong>File Uploads:</strong> " + showAllFiles + "</div>";
                }
            }
            var $scope = angular.element($("#calendar")).scope();
            if ($scope.formDetailsDataInfo != undefined)
            if ($scope.formDetailsDataInfo.otherFormIsShow != null && $scope.formDetailsDataInfo.otherFormIsShow == true) {

                if (event.customFourthTitle != null && event.customFourthTitle != "") {
                    element.append(
                        $('<div>', {
                            class: 'fc-content fcTime', "id": event.Id + "_Time"

                        }).append(
                            $('<small>', { class: 'time', "title": "" }).text(event.customFourthTitle)
                        )
                    );
                    rowTooltipDisplay += event.customFourthTitle + " <br/> "
                }
            }
            $scope.counterLoader = undefined;
            table.append("<div class='div-flex'>" + rowRecord + "</div>");
            var basicDetails = window["EventBasicDetail"];
            var actionRow = "";
            actionRow += "<div id='eventCopy' class='mr-10 cursor-pointer' data-formId=" + basicDetails.formId + " data-formGroupKey='" + eventData.formGroupKey + "' data-eventId='" + event.Id + "'><a> <i class='fa fa-copy'></i></a></div>"
            actionRow += "<div id='eventEdit' class='mr-10 cursor-pointer' data-formId=" + basicDetails.formId + " data-formGroupKey='" + eventData.formGroupKey + "' data-eventId='" + event.Id + "'><a> <i class='fa fa-pencil'></i></a></div>"
            actionRow += "<div id='eventDelete' data-formId=" + basicDetails.formId + " data-formGroupKey='" + eventData.formGroupKey + "' data-eventId='" + event.Id + "' class='delete-event cursor-pointer'><i class='fa fa-trash'></i></div>"
            actionRow += "<a class='btn close-event cursor-pointer' title='close'> <i class='fa fa-times'></i></a>";
            table.append("<div class='btn-box'>" + actionRow + "</div>");
            table.append('<div class="div-flex div-list-bar"></div>');
            if ($scope.listTabulator != undefined)
            if ($scope.listTabulator.length > 0) {
                table.append(`<div class="div-flex div-list">
                            <div class="d-flex justify-content-between align-items-center p-0">
                                <h5 class="list-title mb-0" id="tabuList"></h5>
                                <div class="d-block">
                                    <div id="addTransactionRecord" class="edit-event-student cursor-pointer d-inline-block"><i class="fa fa-plus"></i></div> <div id="tabuListLink" class="edit-event-student mr-0 ml-1 cursor-pointer d-inline-block"  title="Edit"><i class="fa fa-pencil"></i></div> </div>  </div>   <ul id="tabuListUl">  </ul></div>`);
            }
            else {
                table.append(`<div class="div-flex div-list">
                            <div class="d-flex justify-content-between align-items-center p-0">
                                <h5 class="list-title mb-0" id="tabuList"></h5>
                                <div class="d-block">
                                    <div id="addTransactionRecord" class="edit-event-student cursor-pointer d-inline-block"><i class="fa fa-plus"></i></div>  </div>  </div>   <ul id="tabuListUl">  </ul></div>`);
            }
            let $fcContent = element.find(".fc-content").detach(),
                $resize = element.find(".fc-resizer").detach();
            element.attr('title', rowTooltipTitleDisplay + "  " + rowTooltipDisplay);
            element.attr('data-html', 'true');
            element.popover({
                container: 'body',
                animation: true,
                //delay: 300,
                //content: table,
                trigger: 'click',
                html: true,
                placement: 'top',
                content: function () {
                    $("body .popover").popover('hide');
                    return table;
                }

            })
                .css({
                background: "rgb(255, 255, 255)",
                borderColor: "#aaa",
                padding: 2,
                borderRadius: 5,
                //min-height: 44,
                "z-index": 1
            })
                .droppable({
                    drop: function (event, ui) {
                    },
                })
                .empty()
                .append($fcContent.css({
                    borderRadius: 3,
                }), $resize);


        },
        eventClick: function (calEvent, jsEvent, view) {
            function removeTitle() {
                $('body .popover-header').remove();
            }
            $('.close-event').on('click', function () {
                $("body .popover").addClass('isPopoverLoaded');
                $("body .popover").popover('hide');
                $("#tabuListUl").empty();
                var $scope = angular.element($("#calendar")).scope();
                $('.temp').find('.titleContainer').removeClass('d-none');
                $('.popoverSelect').addClass('d-none');

            });
            setTimeout(function () {
                removeTitle();
                if (!$("body .popover").hasClass("isPopoverLoaded")) {
                    $('.editTitle').on('click', function () {
                        $(this).closest('.temp').find('.popoverSelect').removeClass('d-none');
                        $(this).closest('.titleContainer').addClass('d-none');
                    });
                    $('#eventCopy').on('click', function () {
                        var $scope = angular.element($("#calendar")).scope();
                        var formId = $(this).data('formid');
                        var formGroupKey = $(this).data('formgroupkey');
                        var rowId = $(this).data('eventid');
                        var eventData = _.findWhere(window["CalendarEventList"], { formGroupKey: formGroupKey.toString() });
                        var param = {};
                        param.formGroupKey = formGroupKey;
                        if ($scope.listTabulator.length > 0) {
                            var temp = $scope.listTabulator[0];
                            param.formId = temp.fieldValidationRuleParse.reference_form;
                            param.isInternalDrop = true;
                        } else {
                            param.formId = $scope.formDetailsDataInfo.otherformid;
                            param.isInternalDrop = false;
                        }
                        param.Id = rowId;
                        param.action = 10;
                        param.parentID = formId;
                        param.newFormGroupKey = "";
                        $scope.copyCalenderEventFunction(param);
                    });
                    $('.closeSelect').on('click', function () {
                        $(this).closest('.temp').find('.titleContainer').removeClass('d-none');
                        $(this).closest('.popoverSelect').addClass('d-none');

                        $("body .popover").addClass('isPopoverLoaded');
                        $("body .popover").popover('hide');
                        $("#tabuListUl").empty();
                        var $scope = angular.element($("#calendar")).scope();
                        $('.temp').find('.titleContainer').removeClass('d-none');
                        $('.popoverSelect').addClass('d-none');

                    });
                }
                var $scope = angular.element($("#calendar")).scope();
                _.each($scope.totalSelectListTagify, function (item, key) {
                    var param = {};
                    var input = document.getElementById('tag-input' + item.fieldName);
                    if (input != null) {
                        // init Tagify script on the above inputs                     
                        var tempWhiteControl = $("#tag-inputHidden" + item.fieldName).val();
                        var tempWhiteList = [];
                        var tempWh2 = [];
                        if (tempWhiteControl != undefined && tempWhiteControl != "") {
                            tempWhiteList = tempWhiteControl;
                            tempWhiteList = tempWhiteList.replace(/'/g, '"');
                            tempWhiteList = JSON.parse(tempWhiteList);
                            var newList = [];
                            if (tempWhiteList.length > 0) {
                                if (tempWhiteList[0].value != undefined) {
                                    _.each(tempWhiteList, function (itemtag) {
                                        newList.push(itemtag.value);
                                    });
                                } else {
                                    newList = tempWhiteList;
                                }
                            }
                            tempWhiteList = newList.join();
                            tempWh2 = tempWhiteList.split(",");
                            input.value = tempWhiteList;
                            var tmp = [tempWhiteList];
                        }
                        item.tagify = new Tagify(input, {
                            whitelist: tempWh2,
                            maxTags: 10,
                            dropdown: {
                                maxItems: 20,           // <- mixumum allowed rendered suggestions
                                classname: "tags-look", // <- custom classname for this dropdown, so it could be targeted
                                enabled: 0,             // <- show suggestions on focus
                                closeOnSelect: false    // <- do not hide the suggestions dropdown once an item has been selected
                            }
                        });
                        if (item.tagify.on != undefined) {
                            item.tagify.on('add', onAddTag)
                            item.tagify.on('invalid', onInvalidTag)
                            item.tagify.on('remove', onRemoveTag)
                            item.tagify.on('edit', onTagEdit)
                        }
                    }
                });
                var param = {};
                var selectedId = $("#tag-inputHidden").val();
                param.selectedId = selectedId;
                $scope.getTabulatorListFromEvents(param);
                $scope.rootScopeSafe();
            }, 800);
            $(document).on('click', function (e) {
                if ($('.favicon-loader-overlay.active').length) {
                }
                else {
                    if (!$(e.target).closest('.popover.show').length && !$(e.target).closest('.fc-content').length) {
                        //$(document).find('.popover.show').remove()
                        $("body .popover").addClass('isPopoverLoaded');
                        $("body .popover").popover('hide');
                        $("#tabuListUl").empty();
                        var $scope = angular.element($("#calendar")).scope();
                        $('.temp').find('.titleContainer').removeClass('d-none');
                        $('.popoverSelect').addClass('d-none');
                    }
                }
            });
        },

        eventAfterAllRender: function (event, element, view) {

            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');

            if (current_tab == "agenda-view") {
                var $scope = angular.element($("#calendar")).scope();
                $scope.$parent.$parent.IND_loading = false;
                setTimeout(function () {
                    $.unblockUI();
                }, 1000);
            } else {
                $.unblockUI();
            }
            setTimeout(function () {
                jQuery.curCSS = function (element, prop, val) {
                    return jQuery(element).css(prop, val);
                };
                $('.fc-content').bstooltip();
                $('.fc-timeline-event').bstooltip();
                $('.fc-list-item').bstooltip();
                $('.fc-day-grid-event').bstooltip();
                $('.fc-time-grid-event').bstooltip();
            }, 500);
        },
    },
        // Basic View
        myOptions = {

            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,basicWeek,basicDay'
            },
            events: calenderData,
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
                dialog.find("form #tab_end").val(start.format());
                dialog.find("form #allDay").val('true');
                dialog.find("form #tab_color").val('#8500b2').change();
                dialog.dialog("open");
                $("body .popover").popover('hide');
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
            right: 'listDay,listWeek,listMonth,listYear'
        },
        // customize the button names,
        // otherwise they'd all just say "list"
        views: {
            listDay: { buttonText: 'day' },
            listWeek: { buttonText: 'week' },
            listMonth: { buttonText: 'month' },
            listYear: { buttonText: 'year' }
        },
        defaultView: 'listDay',
        defaultDate: new Date(),
        events: calenderData,
        allDaySlot: true
    };
    calendarOptions = $.extend({}, defaultOptions, myOptions);
    $('#list-view div.calendar').fullCalendar(calendarOptions);

    // Agenda View
    myOptions = {
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month'
        },
        defaultView: 'month',
        events: calenderData,
        scrollTime: '00:00',
        allDaySlot: true,
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
            //console.log($(this));
            swal({
                title: 'Drag Calender Entry',
                text: 'Action is not allowed in this view',
                type: 'error'
            });
            $("#agenda-view div.calendar").fullCalendar('refetchEvents');
            return false;

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
            var allDayCustom = "false";
            var current_subtab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').find('.ui-state-active').attr('class');
            if (current_subtab) {
                allDayCustom = (current_subtab.contains('fc-agendaMonth-button') || current_subtab.contains('fc-timelineYear-button')).toString();
            }
            var defaultDuration = moment.duration(eventExtData.duration);
            var end = date.clone().add(defaultDuration);
            var activities = eventExtData.id;
            var $scope = angular.element($("#calendar")).scope();
            eventBasicData.resFormIdParam = $scope.ySelection;
            eventBasicData.actFormIdParam = eventExtData.formid;
            var param = {};
            param.action = eventBasicData.action;
            param.formId = eventBasicData.formId;
            param.userId = eventBasicData.userId;

            var defaultDuration = moment.duration(eventExtData.duration);
            var end = date.clone().add(defaultDuration);

            var startCustom = date.format();
            var endCustom = end.format();

            var exists = _.findWhere($scopeVar.calenderSettingsFormDetailsDataList, { activitiesForm: parseInt(eventExtData.formid) });
            if (exists != undefined) {
                if (exists.durationField == "0") {
                    allDayCustom = "true";
                } else {
                    allDayCustom = "false";
                }
            }
            var resourceValue = "0";
            var eventData = {
                id: eventExtData.id,
                title: eventExtData.groupingvaluesact,
                color: eventExtData.color,
                allDay: allDayCustom,
                start: startCustom,
                end: endCustom,
                resFormID: eventBasicData.resFormIdParam,
                actFormID: eventBasicData.actFormIdParam,
                resourceId: 0,
                resources: 0,
                activities: eventExtData.title,
                colActivityValue: "",
                colCategoryValue: "",
                colColorValue: "",
                dropin: eventExtData.dropin,
                dimensionType: eventExtData.dimensiontype,
                dropinTitle: eventExtData.title
            };
            if (allDayCustom == "true" || startCustom.length == 10) {
                startCustom = date.format("YYYY-MM-DD");
                startCustom = moment(startCustom + " 00:00:00");
                endCustom = date.format("YYYY-MM-DD");
                let initialdate = endCustom;
                let start_time = '23:59:59';
                endCustom = moment(initialdate + " " + start_time);
                allDayCustom = "true";
                startCustom = startCustom.format("YYYY-MM-DD HH:mm");
                endCustom = endCustom.format("YYYY-MM-DD HH:mm");
            }
            else {
                allDayCustom = "false";
                if (eventExtData.duration == null || eventExtData.duration == "" || eventExtData.duration == undefined || exists.duration == "0") {
                    allDayCustom = "true";
                    startCustom = date.format("YYYY-MM-DD");
                    startCustom = moment(startCustom + " 00:00:00");
                    endCustom = date.format("YYYY-MM-DD");
                    let initialdate = endCustom;
                    let start_time = '23:59:59';
                    endCustom = moment(initialdate + " " + start_time);
                }
            }
            if ($('#allDay-check').is(':checked')) {
                allDayCustom = "true";
                startCustom = date.format("YYYY-MM-DD");
                startCustom = moment(startCustom + " 00:00:00");
                endCustom = date.format("YYYY-MM-DD");
                let initialdate = endCustom;
                let start_time = '23:59:59';
                endCustom = moment(initialdate + " " + start_time);
                startCustom = startCustom.format("YYYY-MM-DD HH:mm");
                endCustom = endCustom.format("YYYY-MM-DD HH:mm");
            }
            else {
                if (current_subtab.contains("fc-timelineDay-button") || current_subtab.contains("fc-agendaDay-button") || current_subtab.contains("fc-agendaWeek-button")) {

                }
                else {
                    allDayCustom = "true";
                    startCustom = date.format("YYYY-MM-DD");
                    startCustom = moment(startCustom + " 00:00:00");
                    endCustom = date.format("YYYY-MM-DD");
                    let initialdate = endCustom;
                    let start_time = '23:59:59';
                    endCustom = moment(initialdate + " " + start_time);
                    startCustom = startCustom.format("YYYY-MM-DD HH:mm");
                    endCustom = endCustom.format("YYYY-MM-DD HH:mm");
                }

            }
            var formfieldDataListTempData = [];
            //console.log(eventExtData);


            if ($('#allDay-check').is(':checked')) {
                allDayCustom = "true";
                startCustom = date.format("YYYY-MM-DD");
                startCustom = moment(startCustom + " 00:00:00");
                endCustom = date.format("YYYY-MM-DD");
                let initialdate = endCustom;
                let start_time = '23:59:59';
                endCustom = moment(initialdate + " " + start_time);
                startCustom = startCustom.format("YYYY-MM-DD HH:mm");
                endCustom = endCustom.format("YYYY-MM-DD HH:mm");
            }
            eventData.allDay = allDayCustom;
            eventData.start = startCustom;
            eventData.end = endCustom;
            eventData.formGroupKey = eventBasicData.formGroupKey;
            formfieldDataListTempData = [

                { "name": "title", "value": title },
                { "name": "start", "value": startCustom },
                { "name": "end", "value": endCustom },
                { "name": "color", "value": color },
                { "name": "allDay", "value": allDayCustom },
                { "name": "service", "value": "" },
                { "name": "description", "value": "" },
                { "name": "activities", "value": activities },
                { "formGroupKey": eventBasicData.formGroupKey, "name": "formGroupKey", "value": eventBasicData.formGroupKey }
            ];


            var checkExists = window["eventListTemp"];
            var exists = _.filter(checkExists, function (item) {
                return compareEventStartEndDateTime(eventData, item) && (item.resourceId == eventData.resourceId ||
                    item.resources == eventData.resourceId);
            });
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            if (exists.length > 0) {
                var listExisting = angular.copy(exists);
                exists = exists[0];
                eventData.formGroupKey = exists.formGroupKey;
                var seperatedIds = exists.customFormIds;
                var comma = seperatedIds.split(',');
                var _droppedForms = exists.customForms;
                var _arr0 = _droppedForms.split(',');
                var _checkIfExists = true;
                _.each(_arr0, function (_row, _pos) {
                    if (_row.toString().trim() === eventBasicData.actFormIdParam.toString()) {
                        _checkIfExists = false;
                        //break;
                    }

                });
                var _checkIfExistsIds = false;
                var _droppedFormsIds = exists.customFormIds;
                var _arr1 = _droppedFormsIds.split(',');
                _.each(listExisting, function (item) {
                    var formlist = item.customForms.split(',');
                    var formIdslist = item.customFormIds.split(',');
                    //// 
                    var formExist = _.filter(formlist, function (formItem) { return formItem.toString().trim() === eventBasicData.actFormIdParam.toString() });
                    var formIdExist = _.filter(formIdslist, function (formIdItem) { return formIdItem.toString().trim() === eventData.id.toString() });
                    if (formExist.length > 0 && formIdExist.length > 0) {
                        _checkIfExistsIds = true;
                    }
                });
                if (!_checkIfExists) {
                    var checkOverlapping = _.where($scopeVar.calenderSettingsFormDetailsDataList, { resourceActivityForm: eventBasicData.actFormIdParam });
                    if (checkOverlapping.length > 0) {
                        var eventOverlapping = _.filter(checkOverlapping, function (item) {
                            return item.eventOverlap == "1" || item.activitiesOverlap == "1";
                        });
                        // 
                        if (eventOverlapping.length > 0 && _checkIfExistsIds) {
                            eventData.formGroupKey = undefined;
                            if (!_checkIfExistsIds) {
                                $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                                swal({ type: 'error', title: '', text: 'cannot overlap same dimension entry in same timeslot' });
                                return false;
                            }
                            else {
                                generateEvent(eventData, eventExtData, date, end, resourceValue);
                            }
                        } else {
                            if (comma.length > 1 && !_checkIfExists && _checkIfExistsIds) {
                                $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                                swal({ type: 'error', title: '', text: 'cannot drop same dimension more than once in same event' });
                                return false;
                            } else {
                                eventData.formGroupKey = undefined;
                                generateEvent(eventData, eventExtData, date, end, resourceValue);
                            }
                        }
                    } else {
                        $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                        swal({ type: 'error', title: '', text: 'cannot drop same dimension more than once in same event' });
                        return false;
                    }
                }
                else if (_checkIfExists) {
                    if (resourceValue !== '') {
                    }
                    if (eventData.title !== '') {
                        addExternalEvent(eventData);
                    }
                }
            }
            else {
                generateEvent(eventData, eventExtData, date, end, resourceValue);
            }
            //if (title !== '') {
            //    var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            //    $.ajax({
            //        method: 'POST',
            //        url: "api/FormAPI/GeneratedFormData",
            //        dataType: 'json',
            //        contentType: "application/json",
            //        data: "{'action':" + eventBasicData.action + ",'userId':" + eventBasicData.userId + ",'formId':" + eventBasicData.formId +
            //            ",'topicId':" + eventBasicData.formData.topicId + ",'created_by':" + eventBasicData.created_by
            //            + ",'resourceFormId':" + eventBasicData.actFormIdParam + ",'ActivityFormId':" + eventBasicData.actFormIdParam + ",'updated_by':" + eventBasicData.update_by + ",'formGroupKey':'" + eventBasicData.formGroupKey
            //            + "','formfieldDataListTemp':'" + JSON.stringify(formfieldDataListTempData) + "'}", //$.param(formData)
            //        success: function (response) {
            //            if (response.res > 0) {
            //                param.created_by = eventBasicData.created_by;
            //                param.update_by = eventBasicData.update_by;
            //                param.formGroupKey = response.formGroupKey;
            //                param.resourceFormId = eventBasicData.resFormIdParam;
            //                param.activityFormId = eventBasicData.actFormIdParam;
            //                param.resourceId = eventBasicData.resourceId != undefined?eventBasicData.resourceId.toString():"0";
            //                param.activityId = activities.toString();
            //                manageOneToManyReferrenceForm(param);                           
            //                var calenderNewRow = {
            //                    Id: response.Id,
            //                    label: null,
            //                    selected: false,
            //                    value: response.Id,
            //                    color: color,
            //                    title: title,
            //                    start: start,
            //                    end: end,
            //                    allDay: allDayCustom,
            //                    activities: title,
            //                    customForms: param.activityFormId,
            //                    customFormIds: activities,
            //                    customTitle: title,
            //                    formGroupKey : param.formGroupKey
            //                };
            //                var activityNewRow = {
            //                    Id: response.Id,
            //                    label: null,
            //                    selected: false,
            //                    value: response.Id,
            //                    color: color,
            //                    title: title,
            //                    start: start,
            //                    end: end,
            //                    allDay: allDayCustom,
            //                    activities: title,
            //                    resourceId: activities,
            //                    customForms: param.activityFormId,
            //                    customFormIds: activities,
            //                    customTitle: title,
            //                    formGroupKey : param.formGroupKey
            //                };
            //                //eventBasicData.formGroupKey = create_UUID();
            //                window["EventBasicDetail"] = eventBasicData;

            //                var CalendarEventList = window["CalendarEventList"];
            //                var ActivityEventList = window["ActivityEventList"];
            //                //console.log('before insertion ');
            //                //console.log(CalendarEventList);

            //                CalendarEventList.push(calenderNewRow);
            //                ActivityEventList.push(activityNewRow);
            //                window["CalendarEventList"] = CalendarEventList;
            //                window["ActivityEventList"] = ActivityEventList;
            //                //console.log('after  insertion ');
            //                //console.log(CalendarEventList);
            //                console.log('hi5')
            //                // $('.calendar').fullCalendar('destroy');
            //                //loadCalendar('BasicView', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, ActivityEventList);
            //                refreshEventResourcesActivity('BasicView', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, ActivityEventList);
            //                //  loadCalendar('BasicView', CalendarEventList);
            //                //$('#basic-view div.calendar').fullCalendar('refetchEvents');

            //                //eventBasicData.formGroupKey = create_UUID();
            //                window["EventBasicDetail"] = eventBasicData;
            //                $.jGrowl(response.Message, { position: 'center' });
            //            }
            //            else {
            //                if (response.res == -1) {
            //                    var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            //                    $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
            //                    swal({ type: 'error', title: '', text: response.Message });

            //                } else {
            //                    swal({ type: 'error', title: '', text: response.overlapMessage });
            //                }
            //            }
            //        },
            //        beforeSend: function () {
            //            showLoader();
            //        },
            //        complete: function () {
            //            $.unblockUI();
            //        }
            //    });
            //}
        }
    };
    var calendarOptions = $.extend({}, defaultOptions, myOptions);
    $('#agenda-view div.calendar').fullCalendar(calendarOptions);
    if ($scopeVar != undefined)
        if ($scopeVar.ySelection != 0) {
            if ($scopeVar.formDetailsDataInfo != null)
                if ($scopeVar.formDetailsDataInfo.calenderSettingsList != null)
                    if ($scopeVar.formDetailsDataInfo.calenderSettingsList.length > 0) {
                        var exists = _.findWhere($scopeVar.formDetailsDataInfo.calenderSettingsList, { resourceForm: $scopeVar.ySelection });
                        if (exists != undefined) {
                            if (exists.minTime != "" && exists.minTime != null && exists.minTime != undefined && exists.maxTime != null && exists.maxTime != undefined && exists.maxTime != "") {
                                var minTime = exists.minTime.trim().replace(' ', ':');
                                var maxTime = exists.maxTime.trim().replace(' ', ':');
                                $('#agenda-view div.calendar').fullCalendar('option', 'minTime', minTime + ":00");
                                $('#agenda-view div.calendar').fullCalendar('option', 'maxTime', maxTime + ":00");
                            }
                        }
                    }
        }
    //tagyfiy on blur
    function onTagifyFocusBlur(e) {
        //console.log(e.type, "event fired")
    }
    // tag added callback
    function onAddTag(e) {
        var id = $("#tag-inputHidden").val();
        var fieldName = $("#tag-inputHidden" + id).val();
        var $scope = angular.element($("#calendar")).scope();
        var param = {};
        var list = [];
        param.fieldName = fieldName;
        _.each(e.detail.tagify.value, function (item) {
            list.push('"' + item.value + '"');
        });
        param.fieldDataText = "[" + list.join(',') + "]";
        param.formId = $scope.currentFormId;
        param.Id = id;
        $scope.updateRowDataRecord(param);
    }
    // tag remvoed callback
    function onRemoveTag(e) {
        var id = $("#tag-inputHidden").val();
        var fieldName = $("#tag-inputHidden" + id).val();
        var $scope = angular.element($("#calendar")).scope();
        var param = {};
        var list = [];
        param.fieldName = fieldName;
        _.each(e.detail.tagify.value, function (item) {
            list.push('"' + item.value + '"');
        });
        param.fieldDataText = "[" + list.join(',') + "]";
        param.Id = id;
        param.formId = $scope.currentFormId;
        $scope.updateRowDataRecord(param);
    }
    function onTagEdit(e) {
        //console.log("onTagEdit: ", e.detail);
    }
    // invalid tag added callback
    function onInvalidTag(e) {
        //console.log("onInvalidTag: ", e.detail);
    }
    // timeLine resource view
    function addExternalEvent(eventData) {
        window["scrollOffset"] = $(window).scrollTop();
        var eventBasicData = window["EventBasicDetail"];
        var checkExists = window["CalendarEventList"];
        var actFormIdParam = window["xSelected"];
        var resFormIdParam = window["ySelected"];
        var param = {};
        param.action = eventBasicData.action;
        param.formId = eventBasicData.formId;
        param.userId = eventBasicData.userId;
        param.isDyEvent = true;
        param.topicId = eventBasicData.formData.topicId;
        param.created_by = eventBasicData.created_by;
        param.update_by = eventBasicData.update_by;
        param.formGroupKey = eventBasicData.formGroupKey;
        var tempGroup = create_UUID();
        var service = ''; var description = '';
        if (activitiesCategory != null) {
            service = eventData.service;
            description = eventData.description;
        }
        var formfieldDataListTempData = [];
        formfieldDataListTempData = [
            { "name": "title", "value": "" },
            { "name": "start", "value": eventData.start },
            { "name": "end", "value": eventData.end },
            { "name": "color", "value": eventData.color },
            { "name": "allDay", "value": eventData.allDay },
            { "name": "service", "value": service },
            { "name": "description", "value": description },
            { "name": "resources", "value": eventData.resourceId },
            { "name": "resourcesTitle", "value": eventData.resources },
            { "name": "activities", "value": eventData.id },
            { "formGroupKey": eventBasicData.formGroupKey, "name": "formGroupKey", "value": eventBasicData.formGroupKey }
        ];
        var exists = _.filter(checkExists, function (item) {
            return compareEventStartEndDateTime(eventData, item)
                && (item.resourceId == eventData.resourceId ||
                    item.resources == eventData.resourceId);
        });

        if (exists.length > 0) {
            _.each(exists, function (item) {
                var tempformentryidList = item.customFormIds.split(",");
                item.customFormIdsSplit = tempformentryidList;
            });
            exists = _.filter(exists, function (item) { return item.customFormIdsSplit.length == 2 });
            if (exists.length > 0) {
                //make it ready for update
                param.isEventUpdatable = true;
                if (eventData.formGroupKey != undefined) {
                    param.action = 2;//for updte.
                } else {
                    param.action = 1;
                    param.formGroupKey = tempGroup;
                    param.isEventUpdatable = false;
                    var temp = _.findWhere(formfieldDataListTempData, { name: "formGroupKey" });
                    if (temp != null) {
                        temp.value = param.formGroupKey;
                        temp.formGroupKey = param.formGroupKey;
                    }
                }
                exists = exists[0];
                formfieldDataListTempData.push({ "name": "parentID", "value": exists.Id });
                param.parentID = exists.Id;
                var seperatedResColValues = exists.seperatedResColValues;
                var seperatedColorValues = exists.seperatedColorValues;
                if (seperatedResColValues != null && seperatedResColValues.toString() !== "") {
                    param.seperatedResColValues = seperatedResColValues + "," + eventData.resources.toString();
                }
                else {
                    param.seperatedResColValues = eventData.resources.toString();
                }
                // color values
                if (seperatedColorValues != null && seperatedColorValues.toString() !== "") {
                    param.seperatedColorValues = seperatedColorValues + "/" + eventData.color.toString();
                }
                else {
                    param.seperatedColorValues = eventData.colColorValue.toString()
                }
            }
            else {
                formfieldDataListTempData.push({ "name": "parentID", "value": 0 });
                param.parentID = 0;
                param.seperatedFormIDs = window["xSelected"].toString() + "," + window["ySelected"].toString();
                param.seperatedTitles = eventData.title + "," + eventData.dropinTitle //eventData.colActivityValue.toString() + " - " + eventData.colCategoryValue.toString() + " in " + eventData.dropin.toString();
                param.seperatedResFormIDs = window["ySelected"].toString() + "," + window["xSelected"].toString();
                param.seperatedResEntryIDs = eventData.resourceId.toString() + "," + eventData.id.toString();
                param.seperatedResColValues = eventData.resources.toString() + "," + eventData.activities.toString();
                param.seperatedColorValues = eventData.color.toString() + "/" + eventData.colColorValue.toString();
                param.seperatedIds = eventData.id.toString() + "," + eventData.resourceId.toString();
                param.isEventUpdatable = false;
                eventBasicData.formGroupKey = create_UUID();
            }
        }
        else {
            formfieldDataListTempData.push({ "name": "parentID", "value": 0 });
            param.parentID = 0;
            param.seperatedFormIDs = window["xSelected"].toString() + "," + window["ySelected"].toString();
            param.seperatedTitles = eventData.title + "," + eventData.dropinTitle //eventData.colActivityValue.toString() + " - " + eventData.colCategoryValue.toString() + " in " + eventData.dropin.toString();
            param.seperatedResFormIDs = window["ySelected"].toString() + "," + window["xSelected"].toString();
            param.seperatedResEntryIDs = eventData.resourceId.toString() + "," + eventData.id.toString();
            param.seperatedResColValues = eventData.resources.toString() + "," + eventData.activities.toString();
            param.seperatedColorValues = eventData.color.toString() + "/" + eventData.colColorValue.toString();
            param.seperatedIds = eventData.id.toString() + "," + eventData.resourceId.toString();
            param.isEventUpdatable = false;
            eventBasicData.formGroupKey = create_UUID();
        }
        param.formfieldDataListTemp = formfieldDataListTempData;
        var isAllowToUpdate = false;
        if (typeof seperatedTitles !== "undefined" && seperatedTitles !== "" && seperatedTitles !== null) {
        }

        $.ajax({
            method: 'POST',
            url: BASE_URL +"FormAPI/GeneratedFormData",
            dataType: 'json',
            contentType: "application/json",
            data: "{'action':" + param.action + ",'userId':" + param.userId + ",'formId':" + param.formId + ",'resourceFormId':" + resFormIdParam + ",'ActivityFormId':" + actFormIdParam + ",'parentID':" + param.parentID + ",'isDyEvent':" + param.isDyEvent + ",'isEventUpdatable':" + param.isEventUpdatable + ",'seperatedResColValues':'" + param.seperatedResColValues + "','seperatedColorValues':'" + param.seperatedColorValues + "',   'topicId':" + param.topicId + ",'created_by':" + param.created_by + ",'updated_by':" + param.update_by + ",'formGroupKey':'" + param.formGroupKey + "','formfieldDataListTemp':'" + JSON.stringify(param.formfieldDataListTemp) + "'}", //$.param(formData)
            beforeSend: function () {
                showLoader();
            },
            success: function (response) {
                if (response.res > 0 && param.action == 1) {
                    param.resourceFormId = resFormIdParam;
                    param.activityFormId = actFormIdParam;
                    param.resourceId = eventData.resourceId.toString();
                    param.activityId = eventData.id.toString();
                    manageOneToManyReferrenceForm(param);
                    param.activities = eventData.activities;
                    var calenderNewRow = {
                        Id: response.Id,
                        label: null,
                        selected: false,
                        value: response.Id,
                        color: eventData.color,
                        title: "",
                        start: eventData.start,
                        end: eventData.end,
                        allDay: eventData.allDay,
                        resourceId: eventData.resourceId,
                        resources: eventData.resources,
                        service: service,
                        description: description,
                        activities: eventData.activities,
                        customTitle: eventData.dropinTitle + ',' + param.activities.toString(),
                        customForms: eventData.resFormID + ',' + param.activityFormId.toString(),
                        customFormIds: eventData.resourceId + ',' + param.activityId.toString(),
                        parentID: 0,
                        formGroupKey: param.formGroupKey
                    };
                    var activityNewRow = {
                        Id: response.Id,
                        label: null,
                        selected: false,
                        value: response.Id,
                        color: eventData.color,
                        title: "",
                        start: eventData.start,
                        end: eventData.end,
                        allDay: eventData.allDay,
                        resourceId: eventData.id,
                        resources: eventData.resources,
                        service: service,
                        description: description,
                        activities: eventData.activities,
                        customTitle: eventData.dropinTitle + ',' + param.activities.toString(),
                        customForms: eventData.resFormID + ',' + param.activityFormId.toString(),
                        customFormIds: eventData.resourceId + ',' + param.activityId.toString(),
                        parentID: 0,
                        formGroupKey: param.formGroupKey
                    };
                    var oneToManyNewRow = {
                        Id: response.Id,
                        label: null,
                        selected: false,
                        value: response.Id,
                        color: eventData.color,
                        title: "",
                        start: eventData.start,
                        end: eventData.end,
                        allDay: eventData.allDay,
                        resourceId: eventData.resourceId,
                        resources: eventData.resources,
                        service: service,
                        description: description,
                        activities: eventData.activities,
                        customTitle: eventData.dropinTitle + ',' + param.activities.toString(),
                        customForms: eventData.resFormID + ',' + param.activityFormId.toString(),
                        customFormIds: eventData.resourceId + ',' + param.activityId.toString(),
                        parentID: 0,
                        formGroupKey: param.formGroupKey
                    };
                    var CalendarEventList = window["CalendarEventList"];
                    var ActivityEventList = window["ActivityEventList"];
                    eventBasicData.formData.FormDataToOneListDynamic.push(oneToManyNewRow);
                    CalendarEventList.push(calenderNewRow);
                    ActivityEventList.push(activityNewRow);
                    window["CalendarEventList"] = CalendarEventList;
                    window["ActivityEventList"] = ActivityEventList;
                    refreshEventResourcesActivity('BasicView', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, ActivityEventList);
                    window["EventBasicDetail"] = eventBasicData;
                    $.jGrowl(response.Message, { position: 'center' });
                    var _ScrollOffset = window["scrollOffset"];
                    window.scrollTo(0, _ScrollOffset);
                }
                else if (response.res > 0 && param.action == 2) {
                    try {
                        var CalendarEventList = window["CalendarEventList"];
                        var ActivityEventList = window["ActivityEventList"];
                        var oneToManyList = eventBasicData.formData.FormDataToOneListDynamic;
                        var CalenderEditableRow = $.grep(CalendarEventList, function (e) {
                            return e.Id == exists.Id;
                        });
                        if (CalenderEditableRow.length > 0) {
                            param.resourceFormId = resFormIdParam;
                            param.activityFormId = actFormIdParam;
                            param.resourceId = eventData.resourceId.toString();
                            param.activityId = eventData.id.toString();
                            param.formGroupKey = CalenderEditableRow[0].formGroupKey;
                            manageOneToManyReferrenceForm(param);
                        }
                        var ActivityEditableRow = $.grep(ActivityEventList, function (e) {
                            return e.Id == exists.Id;
                        });
                        var oneToManyListEditableRow = $.grep(oneToManyList, function (e) {
                            return e.Id == exists.Id;
                        });
                        CalenderEditableRow[0].customTitle += " ," + eventData.activities.toString();
                        CalenderEditableRow[0].customForms += " ," + eventData.actFormID.toString();
                        CalenderEditableRow[0].customFormIds += " ," + eventData.id.toString();
                        CalenderEditableRow[0].seperatedIds = param.seperatedIds;
                        CalenderEditableRow[0].seperatedTitles = param.seperatedTitles;
                        CalenderEditableRow[0].seperatedFormIDs = param.seperatedFormIDs;
                        CalenderEditableRow[0].parentID = param.parentID;
                        CalenderEditableRow[0].seperatedResFormIDs = param.seperatedResFormIDs;
                        CalenderEditableRow[0].seperatedResEntryIDs = param.seperatedResEntryIDs;
                        CalenderEditableRow[0].seperatedResColValues = param.seperatedResColValues;
                        CalenderEditableRow[0].seperatedColorValues = param.seperatedColorValues;
                        CalenderEditableRow[0].formGroupKey = param.formGroupKey;
                        ActivityEditableRow[0].seperatedIds = param.seperatedIds;
                        ActivityEditableRow[0].seperatedTitles = param.seperatedTitles;
                        ActivityEditableRow[0].seperatedFormIDs = param.seperatedFormIDs;
                        ActivityEditableRow[0].customTitle += " ," + eventData.activities.toString();
                        ActivityEditableRow[0].customForms += " ," + eventData.actFormID.toString();
                        ActivityEditableRow[0].customFormIds += " ," + eventData.id.toString();
                        ActivityEditableRow[0].parentID = param.parentID;
                        ActivityEditableRow[0].seperatedResFormIDs = param.seperatedResFormIDs;
                        ActivityEditableRow[0].seperatedResEntryIDs = param.seperatedResEntryIDs;
                        ActivityEditableRow[0].seperatedResColValues = param.seperatedResColValues;
                        ActivityEditableRow[0].seperatedColorValues = param.seperatedColorValues;
                        ActivityEditableRow[0].formGroupKey = param.formGroupKey;
                        oneToManyListEditableRow[0].seperatedIds = param.seperatedIds;
                        oneToManyListEditableRow[0].seperatedTitles = param.seperatedTitles;
                        oneToManyListEditableRow[0].seperatedFormIDs = param.seperatedFormIDs;
                        oneToManyListEditableRow[0].customTitle += " ," + eventData.activities.toString();
                        oneToManyListEditableRow[0].customForms += " ," + eventData.actFormID.toString();
                        oneToManyListEditableRow[0].customFormIds += " ," + eventData.id.toString();
                        oneToManyListEditableRow[0].parentID = param.parentID;
                        oneToManyListEditableRow[0].seperatedResFormIDs = param.seperatedResFormIDs;
                        oneToManyListEditableRow[0].seperatedResEntryIDs = param.seperatedResEntryIDs;
                        oneToManyListEditableRow[0].seperatedResColValues = param.seperatedResColValues;
                        oneToManyListEditableRow[0].seperatedColorValues = param.seperatedColorValues;
                        oneToManyListEditableRow[0].formGroupKey = param.formGroupKey;
                        var filteredEventsCalender = $.grep(CalendarEventList, function (e) {
                            return e.Id != exists.Id;
                        });
                        var filteredEventsActivity = $.grep(ActivityEventList, function (e) {
                            return e.Id != exists.Id;
                        });
                        var filteredoneToManyList = $.grep(oneToManyList, function (e) {
                            return e.Id != exists.Id;
                        });
                        filteredEventsCalender.push(CalenderEditableRow[0]);
                        filteredEventsActivity.push(ActivityEditableRow[0]);
                        filteredoneToManyList.push(oneToManyListEditableRow[0]);
                        eventBasicData.formData.FormDataToOneListDynamic = filteredoneToManyList;
                        _.each(filteredEventsCalender, function (dataRow, position) {
                            var rowRecord = dataRow;
                            var seperatedFormIDsParam = dataRow.customForms;
                            var seperatedIdsParam = dataRow.customFormIds != undefined ? dataRow.customFormIds : dataRow.customFormIds;
                            var seperatedTitleParam = dataRow.customTitle;
                            var commaIDs = seperatedIdsParam.split(',');
                            var commaVals = seperatedFormIDsParam.split(',');
                            var ySelected = window["ySelected"];
                            _.each(commaVals, function (idVal, pos) {
                                if (idVal.trim() == ySelected.toString()) {
                                    dataRow.resFormID = idVal;
                                    dataRow.resources = commaIDs[pos];
                                    dataRow.resourceId = commaIDs[pos];
                                }
                            })
                        });
                        window["CalendarEventList"] = filteredEventsCalender;
                        window["ActivityEventList"] = filteredEventsActivity;
                        refreshEventResourcesActivity('BasicView', filteredEventsCalender, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, filteredEventsActivity);
                        window["EventBasicDetail"] = eventBasicData;
                        $.jGrowl(response.Message, { position: 'center' });
                    }
                    catch (e) {
                        $.jGrowl(response.Message, { position: 'center' });
                        var _ScrollOffset = window["scrollOffset"];
                        window.scrollTo(0, _ScrollOffset);
                        $.unblockUI();
                    }
                }
                else {
                    var _ScrollOffset = window["scrollOffset"];
                    window.scrollTo(0, _ScrollOffset);
                    if (response.res == -1) {
                        var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
                        $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                        swal({ type: 'error', title: '', text: response.Message });

                    } else {
                        swal({ type: 'error', title: '', text: "failed" });
                    }

                }
            },
            complete: function () {
                var _ScrollOffset = window["scrollOffset"];
                window.scrollTo(0, _ScrollOffset);
                $.unblockUI();
            }
        });
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
            if (dialog.length > 2) {
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
            }

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
            var current_subtab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').find('.ui-state-active').attr('class');
            var allDayCustom = "false";
            if (current_subtab) {
                allDayCustom = (current_subtab.contains('fc-timelineMonth-button') || current_subtab.contains('fc-timelineYear-button')).toString();
            }
            var eventExtData = $(this).data('event');
            var resource = $("#" + current_tab + " .calendar").fullCalendar('getResourceById', resourceId);
            var title = eventExtData.title ? eventExtData.title : '';
            var id = eventExtData.id ? eventExtData.id : '';
            var resFormIdParam = window["ySelected"];
            var actFormIdParam = window["xSelected"];
            var resourceColumn = window["currResColumn"];
            var majorColumn = window["currMajorColumn"];
            var resourceValue = '', activityValue = title;
            var titleColActivity = eventExtData.activityfield;
            var titleColCategory = eventExtData.categoryfield;
            var titleColColor = eventExtData.colorfield;
            var dropin = eventExtData.dropin;
            var groupingfieldsresParam = eventExtData.groupingfieldsres;
            var dropinTitle = ""; var isAllowService = false;
            if (groupingfieldsresParam !== undefined && groupingfieldsresParam.length > 0) {
                groupingfieldsresParam = groupingfieldsresParam.split('-');
                _.each(groupingfieldsresParam, function (value, key) {
                    if (dropinTitle === "") {
                        dropinTitle = resource[value.trim()];
                    }
                    else
                        dropinTitle += " - " + resource[value.trim()];
                });
            }
            if (eventExtData.dimensiontype == "2D") {
                eventExtData.groupingvaluesact = eventExtData.title;
            }
            var colActivityValue = ""; var colCategoryValue = ""; var colColorValue = "";
            if (typeof resource[resourceColumn] != 'undefined') {
                resourceValue = resource[resourceColumn];
                if (eventExtData.dimensiontype == "2D")
                    dropinTitle = resourceValue;
            }
            if (typeof resource[titleColActivity] != 'undefined') {
                colActivityValue = resource[titleColActivity];
            }
            if (typeof resource[titleColCategory] != 'undefined') {
                colCategoryValue = resource[titleColCategory];
            }
            if (typeof resource[titleColColor] != 'undefined') {
                colColorValue = resource[titleColColor];
            }
            var defaultDuration = moment.duration(eventExtData.duration);
            var end = date.clone().add(defaultDuration);
            var exists = _.findWhere($scopeVar.calenderSettingsFormDetailsDataList, { activitiesForm: parseInt(eventExtData.formid) });
            if (exists != undefined) {
                if (exists.durationField == "0") {
                    allDayCustom = "true";
                } else {
                    allDayCustom = "false";
                }
            }
            var startCustom = date.format();
            var endCustom = end.format();
            if (allDayCustom == "true") {
                startCustom = date.format("YYYY-MM-DD");
                startCustom = moment(startCustom + " 00:00:00");
                endCustom = date.format("YYYY-MM-DD");
                let initialdate = endCustom;
                let start_time = '23:59:59';
                endCustom = moment(initialdate + " " + start_time);
            }
            else {
                allDayCustom = "false";
                if (eventExtData.duration == null || eventExtData.duration == "" || eventExtData.duration == undefined || exists.duration == "0") {
                    allDayCustom = "true";
                    startCustom = date.format("YYYY-MM-DD");
                    startCustom = moment(startCustom + " 00:00:00");
                    endCustom = date.format("YYYY-MM-DD");
                    let initialdate = endCustom;
                    let start_time = '23:59:59';
                    endCustom = moment(initialdate + " " + start_time);
                }
            }
            if ($('#allDay-check').is(':checked')) {
                allDayCustom = "true";
                startCustom = date.format("YYYY-MM-DD");
                startCustom = moment(startCustom + " 00:00:00");
                endCustom = date.format("YYYY-MM-DD");
                let initialdate = endCustom;
                let start_time = '23:59:59';
                endCustom = moment(initialdate + " " + start_time);
            }
            else {
                if (current_subtab.contains("fc-timelineDay-button") || current_subtab.contains("fc-agendaDay-button")) {

                }
                else {
                    allDayCustom = "true";
                    startCustom = date.format("YYYY-MM-DD");
                    startCustom = moment(startCustom + " 00:00:00");
                    endCustom = date.format("YYYY-MM-DD");
                    let initialdate = endCustom;
                    let start_time = '23:59:59';

                    endCustom = moment(initialdate + " " + start_time);
                }

            }
            var eventData = {
                id: id,
                title: eventExtData.groupingvaluesact,
                color: eventExtData.color,
                allDay: allDayCustom,
                start: startCustom,
                end: endCustom,
                resFormID: resFormIdParam,
                actFormID: actFormIdParam,
                resourceId: resourceId,
                resources: resourceValue,
                activities: activityValue,
                colActivityValue: colActivityValue,
                colCategoryValue: colCategoryValue,
                colColorValue: colColorValue,
                dropin: dropin,
                dimensionType: eventExtData.dimensiontype,
                dropinTitle: dropinTitle
            };
            var checkExists = window["eventListTemp"];
            var exists = _.filter(checkExists, function (item) {
                return compareEventStartEndDateTime(eventData, item) && (item.resourceId == eventData.resourceId ||
                    item.resources == eventData.resourceId);
            });
            if (exists.length > 0) {
                exists = _.filter(exists, function (item) { return item.customFormIdsSplit.length == 2 });
                if (exists.length > 0) {
                    var listExisting = angular.copy(exists);
                    exists = exists[0];
                    eventData.formGroupKey = exists.formGroupKey;
                    var seperatedIds = exists.customFormIds;
                    var comma = seperatedIds.split(',');
                    var _droppedForms = exists.customForms;
                    var _arr0 = _droppedForms.split(',');
                    var _checkIfExists = true;
                    _.each(_arr0, function (_row, _pos) {
                        if (_row.toString().trim() === actFormIdParam.toString()) {
                            _checkIfExists = false;
                            //break;
                        }

                    });
                    var _checkIfExistsIds = false;
                    var _droppedFormsIds = exists.customFormIds;
                    var _arr1 = _droppedFormsIds.split(',');
                    _.each(listExisting, function (item) {
                        var formlist = item.customForms.split(',');
                        var formIdslist = item.customFormIds.split(',');
                        // 
                        var formExist = _.filter(formlist, function (formItem) { return formItem.toString().trim() === actFormIdParam.toString() });
                        var formIdExist = _.filter(formIdslist, function (formIdItem) { return formIdItem.toString().trim() === eventData.id.toString() });
                        if (formExist.length > 0 && formIdExist.length > 0) {
                            _checkIfExistsIds = true;
                        }
                    });
                    if (!_checkIfExists) {
                        var checkOverlapping = _.where($scopeVar.calenderSettingsFormDetailsDataList, { resourceActivityForm: actFormIdParam });
                        if (checkOverlapping.length > 0) {
                            var eventOverlapping = _.filter(checkOverlapping, function (item) {
                                return item.eventOverlap == "1" || item.activitiesOverlap == "1";
                            });
                            // 
                            if (eventOverlapping.length > 0 && _checkIfExistsIds) {
                                eventData.formGroupKey = undefined;
                                if (!_checkIfExistsIds) {
                                    $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                                    swal({ type: 'error', title: '', text: 'cannot overlap same dimension entry in same timeslot' });
                                    return false;
                                }
                                else {
                                    generateEvent(eventData, eventExtData, date, end, resourceValue);
                                }
                            } else {
                                if (comma.length > 1 && !_checkIfExists && _checkIfExistsIds) {
                                    $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                                    swal({ type: 'error', title: '', text: 'cannot drop same dimension more than once in same event' });
                                    return false;
                                } else {
                                    eventData.formGroupKey = undefined;
                                    generateEvent(eventData, eventExtData, date, end, resourceValue);
                                }
                            }
                        } else {
                            $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                            swal({ type: 'error', title: '', text: 'cannot drop same dimension more than once in same event' });
                            return false;
                        }
                    }
                    else if (_checkIfExists) {
                        if (resourceValue !== '') {
                        }
                        if (eventData.title !== '') {
                            addExternalEvent(eventData);
                        }
                    }
                }
                else {
                    generateEvent(eventData, eventExtData, date, end, resourceValue);
                }
                //var comma = seperatedIds.split(',');
                //if (comma.length > 2) {
                //    $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                //    return false;
                //}
                //else {
                //    var _droppedForms = exists.customForms;
                //    var _arr0 = _droppedForms.split(',');
                //    var _checkIfExists = true;
                //    angular.forEach(_arr0, function (_row, _pos) {
                //        if (_row.toString().trim() === actFormIdParam.toString()) {
                //            _checkIfExists = false;
                //            //break;
                //        }

                //    });
                //    var _checkIfExistsIds = false;
                //    var _droppedFormsIds = exists.customFormIds;
                //    var _arr1 = _droppedFormsIds.split(',');
                //   _.each(listExisting, function (item) {
                //        var formlist = item.customForms.split(',');
                //        var formIdslist = item.customFormIds.split(',');
                //        var formExist = _.filter(formlist, function (formItem) { return formItem.toString().trim() === actFormIdParam.toString() });
                //        var formIdExist = _.filter(formIdslist, function (formIdItem) { return formIdItem.toString().trim() === eventData.id.toString() });
                //        if (formExist.length > 0 && formIdExist.length > 0) {
                //            _checkIfExistsIds = true;
                //        }
                //    });                
                //    if (!_checkIfExists) {
                //        var checkOverlapping = _.where($scopeVar.calenderSettingsFormDetailsDataList, { resourceActivityForm: actFormIdParam });
                //        if (checkOverlapping.length > 0) {
                //            var eventOverlapping = _.filter(checkOverlapping, function (item) {
                //                return item.eventOverlap == "1" || item.activitiesOverlap == "1";
                //            });
                //            if (eventOverlapping.length > 0 && _checkIfExistsIds) {
                //                eventData.formGroupKey = undefined;
                //                if (!_checkIfExistsIds) {
                //                    $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                //                    swal({ type: 'error', title: '', text: 'cannot overlap same dimension entry in same timeslot' });
                //                    return false;
                //                }
                //                else {
                //                    generateEvent(eventData, eventExtData, date, end, resourceValue);
                //                }
                //            } else {
                //                if (comma.length > 1 && !_checkIfExists && _checkIfExistsIds) {
                //                    $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                //                    swal({ type: 'error', title: '', text: 'cannot drop same dimension more than once in same event' });
                //                    return false;
                //                } else {
                //                    eventData.formGroupKey = undefined;
                //                    generateEvent(eventData, eventExtData, date, end, resourceValue);
                //                }
                //            }
                //        } else {
                //            $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                //            swal({ type: 'error', title: '', text: 'cannot drop same dimension more than once in same event' });
                //            return false;
                //        }
                //    }                  
                //    else if (_checkIfExists) {
                //        if (resourceValue !== '') {                           
                //        }
                //        if (eventData.title !== '') {
                //            addExternalEvent(eventData);
                //        }
                //    }                   
                //}
            }
            else {
                generateEvent(eventData, eventExtData, date, end, resourceValue);
            }
        }
    };
    function generateEvent(eventData, eventExtData, date, end, resourceValue) {
        var dropinTitle = ""; var isAllowService = false;
        //for activity category && overlap check.
        var postData = {
            action: 33,
            userId: eventData.userid,
            formId: eventData.formID,
            ActivityFormId: eventExtData.formid,
            ActivityId: eventExtData.id,
            ActivityFields: eventExtData.servicefield,
            resourceId: eventData.resourceId,
            isActivityCategory: 1,
            resEntryColumn: eventData.activitiesCategory,
            compareColumn: eventData.activityField,
            compareValue: eventExtData.title,
            startDate: date.format(),
            endDate: end.format(),
            eventOverlap: eventData.eventOverlap,
            activitiesOverlap: eventData.activitiesOverlap,
            isResourceExternalDrop: true

        }
        // select a category    eventExtData.servicefield !== '' && eventExtData.servicefield != null
        if (isAllowService) {
            async function callCategory(eventData) {
                // inputOptions can be an object or Promise
                const inputOptions = new Promise((resolve) => {
                    $.post(BASE_URL + "/FormAPI/getReferralFormFields", postData, function (response) {
                        if (typeof response.overlapMesage !== 'undefined') {
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
                                }
                            }
                            if (Object.keys(resolveCategory).length > 1) {
                                resolve(resolveCategory);
                            } else {
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
                                    if (result.value) {
                                        var service = $.trim(result.value[0]), description = $.trim(result.value[1]);
                                        if (resourceValue !== '')
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
                    if (result.value) {
                        var service = $.trim(result.value[0]), description = $.trim(result.value[1]);
                        if (eventData.resources !== '') {
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
        }
        else {
            if (resourceValue !== '') {
            }
            if (eventData.title !== '') {
                addExternalEvent(eventData);
            }
        }
    };
    function GetCalendarDateRange() {
        var calendar = $('#timeline-resource-view div.calendar').fullCalendar('getCalendar');
        var view = calendar.view;
        var start = view.start._d;
        var end = view.end._d;
        var dates = { start: start, end: end };
        return dates;
    }
    var myOptions1 = {
        //defaultDate: '2017-12-07',
        scrollTime: '00:00', // undo default 6am scrollTime
        header: {
            left: 'myCustomButton prev,next today',
            center: 'title',
            right: 'timelineDay,timelineMonth'
        },
        customButtons: {
            myCustomButton: {
                text: "Export To Excel",
                click: function () {
                    alert('Export To Excel')
                    var resourceFormId = window["ySelected"];
                    var formId = $scopeVar.currentFormId;
                    var userId = $scopeVar.userDetail.Id;
                    var typeView = 0;
                    var current_subtab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').find('.ui-state-active').attr('class');
                    if (current_subtab.contains('fc-timelineMonth-button'))
                        typeView = 1;
                    else if (current_subtab.contains('fc-timelineYear-button'))
                        typeView = 2;
                    var dates = GetCalendarDateRange();
                    var currentDate = moment(dates.start).format("YYYY-MM-DD");
                    var newpath = $scopeVar.EndPointUrl + '/downloadCalenderExcel?formId=' + formId + '&resourceFormId=' + resourceFormId + '&userId=' + userId + '&typeView=' + typeView + '&currentDate=' + currentDate + '';
                    window.location.href = $scopeVar.EndPointUrl + '/downloadCalenderExcel?formId=' + formId + '&resourceFormId=' + resourceFormId + '&userId=' + userId + '&typeView=' + typeView + '&currentDate=' + currentDate + '';
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

        resourceAreaWidth: '25%',
        events: calenderData,
        // resourceLabelText: "Client",
        resourceOrder: resourceOrder,
        resourceColumns: resColumns,
        resources: resourceData,
        allDaySlot: true,
        resourceRender: function (resourceObj, labelTds, bodyTds) {
            var cellText = '';
            for (i = 0; i < labelTds.length; i++) {
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
    countLoader = 0;
    calendarOptions = $.extend({}, defaultOptions, resourceOptions, myOptions1);
    $('#timeline-resource-view div.calendar').fullCalendar(calendarOptions);
    if ($scopeVar != undefined)
        if ($scopeVar.ySelection != 0) {
            if ($scopeVar.formDetailsDataInfo != null)
                if ($scopeVar.formDetailsDataInfo.calenderSettingsList != null)
                    if ($scopeVar.formDetailsDataInfo.calenderSettingsList.length > 0) {
                        var exists = _.findWhere($scopeVar.formDetailsDataInfo.calenderSettingsList, { resourceForm: $scopeVar.ySelection });
                        if (exists != undefined) {
                            if (exists.minTime != "" && exists.minTime != null && exists.minTime != undefined && exists.maxTime != null && exists.maxTime != undefined && exists.maxTime != "") {
                                var minTime = exists.minTime.trim().replace(' ', ':');
                                var maxTime = exists.maxTime.trim().replace(' ', ':');
                                $('#timeline-resource-view div.calendar').fullCalendar('option', 'minTime', minTime + ":00");
                                $('#timeline-resource-view div.calendar').fullCalendar('option', 'maxTime', maxTime + ":00");
                            }
                        }
                    }
        }
    if ($scopeVar != undefined)
        if ($scopeVar.isFilterApply) {
            var uniqEvents = _.uniq(calenderData, "resourceId");
            var tempFormData = [];
            _.each(resourceData, function (item) {
                var exists = _.findWhere(uniqEvents, { resourceId: item.id });
                if (exists != undefined) {
                    tempFormData.push(item);
                }
            });
            resourceData = tempFormData;
        }
    /// vertical resource view.

    var myOptions2 = {
        //defaultDate: '2017-12-07',
        scrollTime: '00:00', // undo default 6am scrollTime    
        header: {
            left: 'myCustomButton prev,next today',
            center: 'title',
            right: 'agendaDay,agendaTwoDays,agendaThreeDays,agendaWeek'
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
            },
            agendaWeek: {
                type: 'agenda',
                duration: { days: 7 },
                groupByResource: true,
            }
        },
        dayMinWidth: 150, // will cause horizontal scrollbars      
        defaultView: 'agendaDay',
        events: calenderData,
        resources: resourceData,
        allDaySlot: true
    };
    //myOptions = {
    //    timeZone: 'UTC',
    //    initialView: 'resourceTimeGridWeek',
    //    headerToolbar: {
    //        left: 'prev,next today',
    //        center: 'title',
    //        right: 'resourceTimeGridWeek,resourceTimeGridDay'
    //    },
    //    resources: resourceData,
    //    events: calenderData,
    //    editable: true,
    //    selectable: true,

    //    height: 'auto', // will activate stickyHeaderDates automatically!
    //    slotDuration: '00:05:00', // very small slots will make the calendar really tall
    //    dayMinWidth: 150, // will cause horizontal scrollbars
    //};
    countLoader = 0;
    calendarOptions = $.extend({}, defaultOptions, resourceOptions, myOptions2);
    $('#vertical-resource-view div.calendar').fullCalendar(calendarOptions);
    if ($scopeVar != undefined)
        if ($scopeVar.ySelection != 0) {
            if ($scopeVar.formDetailsDataInfo != null)
                if ($scopeVar.formDetailsDataInfo.calenderSettingsList != null)
                    if ($scopeVar.formDetailsDataInfo.calenderSettingsList.length > 0) {
                        var exists = _.findWhere($scopeVar.formDetailsDataInfo.calenderSettingsList, { resourceForm: $scopeVar.ySelection });
                        if (exists != undefined) {
                            if (exists.minTime != "" && exists.minTime != null && exists.minTime != undefined && exists.maxTime != null && exists.maxTime != undefined && exists.maxTime != "") {
                                var minTime = exists.minTime.trim().replace(' ', ':');
                                var maxTime = exists.maxTime.trim().replace(' ', ':');
                                $('#vertical-resource-view div.calendar').fullCalendar('option', 'minTime', minTime + ":00");
                                $('#vertical-resource-view div.calendar').fullCalendar('option', 'maxTime', maxTime + ":00");
                            }
                        }
                    }
        }
    // Vertical Activities View
    activityEvents = changeResourceIDByXSelection(activityEvents)
    if ($scopeVar != undefined)
        if ($scopeVar.isFilterApply) {
            var uniqEvents = _.uniq(activityEvents, "resourceId");
            var tempFormData = [];
            _.each(activityFormData, function (item) {
                var exists = _.findWhere(uniqEvents, { resourceId: item.id });
                if (exists != undefined) {
                    tempFormData.push(item);
                }
            });
            activityFormData = tempFormData;
        }
    myOptions = {
        scrollTime: '00:00', // undo default 6am scrollTime            
        header: {
            left: 'myCustomButton prev,next today',
            center: 'title',
            right: 'agendaDay,agendaTwoDays,agendaThreeDays,agendaWeek'
        },
        customButtons: {
            myCustomButton: {
                text: window["xTitle"],
                click: function () {
                    localStorage.setItem("ToggleCalenderId", basicDetails.formId);
                    window.location.href = $scopeVar.BaseUrl + '#/form/records/' + window["xSelected"] + "?toggle=1";
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
        events: activityEvents,
        resources: activityFormData,
        allDaySlot: true,
    };
    calendarOptions = $.extend({}, defaultOptions, myOptions);
    $('#vertical-activities-view div.calendar').fullCalendar(calendarOptions);
    setTimeout(function () {
        $.unblockUI();
    }, 500);
}

function replaceColumn(namecol) {
    var col = namecol;
    if (col != "") {
        if (col == "end") {          
            col = "[" + col + "]";         
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
            url: BASE_URL +"FormAPI/ManageForm",
            data: "{'action':12,'formId':" + formId + "}",
            contentType: "application/json",
            datatype: "json",
            success: function (data) {         
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
        dotScale: 1,
        text: window.location.href + "?check=anonymous",
        logo: "./../../newAssets/images/favicons/qr-logo.png",
        logoWidth: 80, // width. default is automatic width
        logoHeight: 80, // height. default is automatic height
        logoBackgroundColor: 'rgb(0, 0, 0, 0)', // Logo backgroud color, Invalid when `logBgTransparent` is true; default is '#ffffff'
        logoBackgroundTransparent: true,
    });  
}
function quickSignUp(reqType) {

    //   reqType   either will be 'signUp'  or  'anonymous'
    var userName = $('#username').val();
    var password = $('#password').val();
    var confirmPass = $('#re-password').val();
    var anonymousUserId = $('#txtAnonymousUserId').val();
    var anonymousPassword = $('#txtAnonymousPassword').val();
    var param = {};
    param.uid = (new Date().getTime()).toString(36);
    param.isQuickSignUp = true;
    param.action = 7;
    if (reqType == "signUp") {
        //join geligulu
        param.fullName = 'name title';
        param.name = userName;
        param.newPassword = password;
        //by sona
        param.password = password;
        param.confirmPassword = confirmPass;
        param.password_confirmation = confirmPass;
    }
    else if (reqType == "anonymous") {
        //stay anonymous
        param.fullName = 'Anonymous User';
        param.name = anonymousUserId;
        param.password = anonymousPassword;
        param.password_confirmation = anonymousPassword;
        param.newPassword = anonymousPassword;
        param.confirmPassword = anonymousPassword;
        param.ayCheck = 1;
    }
    $.ajax({
        type: "POST",
        url: BASE_URL +"FormAPI/profile",
        data: JSON.stringify(param),
        contentType: "application/json",
        datatype: "json",
        success: function (data) {
            var respData = data;
            if (respData.res == 1) {
                if (reqType == "signUp") {   
                }
                if (reqType == "anonymous") {
                    respData.reqType = "anonymous";
                }
                localStorage.setItem("detail", JSON.stringify(respData));
               
                setTimeout(function () {
                    var $scope = angular.element($("main .card.card-default")).scope();
                    if ($scope.isEmbedUrl) {
                        $scope.$emit("afterAnonymousRegistration");
                    }
                },180);
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
        url: BASE_URL +"FormAPI/Login",
        data: JSON.stringify(param),
        contentType: "application/json",
        datatype: "json",
        success: function (data) {         
            if (data.res == 1) {            
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
    var formId = $('#hdnfFomId').val();
    var editable = JSON.parse(localStorage.getItem('detail'));
    var formObj = editable.varifiedForms;
    if (check_password != "" && check_password == id) {
        if (formObj == null || formObj == '' || formObj == "undefined") {
            var arr = [];
            var arrParam = {};
            arrParam[formId] = check_password;
            arr.push(arrParam);
            editable.varifiedForms = arr;
            localStorage.setItem('detail', JSON.stringify(editable));
        }
        else {       
            var varifiedForms = formObj;
            var isFound = false;
            $.each(varifiedForms, function (key, value) {           
                var output1 = formId in value;     
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
            });
            if (!isFound) {
                var arrParam = {};
                arrParam[formId] = check_password;
                varifiedForms.push(arrParam);
            }         
            editable.varifiedForms = varifiedForms;
            localStorage.setItem('detail', JSON.stringify(editable));
        }
        bootbox.hideAll();
        window.location.reload();
    } else {
        alert('Wrong Password!');
    }
}
/*09102020 saif*/
/*convert json format according to new ui form generator builder format*/
function convertOldJsonControlsToNewControlsFormat(pageFormFieldsList) {
    var tempArray = [];
    var tempRow = {};
    var tempRowChild = [];
    var rowList = [];
    var count = 0;
    _.each(pageFormFieldsList, function (itemlist, key) {
        tempRow = {};
        var keyRow = "";
        _.each(itemlist, function (item, key) {
            var columnValue = checkColumn(item.column);
            if (item.column != undefined && item.column != "" && columnValue != "0" && columnValue != "1") {
                if (item.rowId != "" && item.rowId != undefined) {
                    if (keyRow != item.rowId) {
                        keyRow = item.rowId;
                        rowList.push(keyRow);
                        tempRow[keyRow] = {};
                        tempRowChild = [];
                        tempRow[keyRow]["columns_width"] = "";
                        count++;
                    }
                }
                if (key != 0 && (item.rowId == "" || item.rowId == undefined)) {
                    var tempPrevious = itemlist[key - 1];
                    keyRow = tempPrevious.rowId;
                    var temp = tempRow[tempPrevious.rowId];
                    if (temp.columns_width == "100") {
                        keyRow = "row-" + count;
                        tempRow[keyRow] = {};
                        tempRowChild = [];
                        tempRow[keyRow].children = [];
                        tempRow[keyRow]["columns_width"] = "";
                        rowList.push(keyRow);
                        count++;
                    } else {
                        tempRowChild = tempPrevious.children;
                        keyRow = tempPrevious.rowId;
                    }
                }
                else if (key == 0 && (item.rowId == "" || item.rowId == undefined)) {
                    keyRow = "row-" + count;
                    rowList.push(keyRow);
                    tempRow[keyRow] = {};
                    tempRowChild = [];
                    tempRow[keyRow]["columns_width"] = "";
                    count++;
                }
                item.rowId = keyRow;
                tempRow[keyRow]["columns_width"] += item.column_width == undefined ? (100 / parseInt(item.column)) + "," : item.column_width + ",";
                if (tempRowChild != undefined)
                    tempRow[keyRow].children = tempRowChild;
                tempRow[keyRow].children.push(item);
            }
            else {
                keyRow = "row-" + count;
                item.rowId = keyRow;
                tempRow[keyRow] = {};
                tempRowChild = [];
                tempRow[keyRow].children = [];
                tempRow[keyRow].children.push(item);
                tempRow[keyRow]["columns_width"] = "100";
                rowList.push(keyRow);
                count++;
            }

        });
        var groupByList = _.groupBy(itemlist, "rowId");
        _.each(groupByList, function (item, keyR) {
            if (item.length > 1) {
                if (tempRow[keyR]["columns_width"] != undefined && tempRow[keyR]["columns_width"].length > 0) {
                    tempRow[keyR]["columns_width"] = tempRow[keyR]["columns_width"].substring(0, tempRow[keyR]["columns_width"].length - 1);
                }
            }
        });
        tempArray.push(tempRow);
        count = 0;
    });
    return tempArray;
}
function convertSupportableNewJSONFormat(fieldList) {
    var tempArray = [];
    _.each(fieldList, function (item, key) {
        var temp = {};
        temp[key] = item;
        tempArray.push(temp);
    });
    return tempArray;
}
/*create function for form builder json new format to old format from new ui builder */
function convertNewJsonControlsToOldControlsFormat(pageFormFieldsList) {
    var allControls = [];
    if (pageFormFieldsList != "") {
        var tempList = JSON.parse(pageFormFieldsList);
        _.each(tempList, function (rows, key) {
            var customKey = "row-" + key;
            _.each(rows[customKey].children, function (item, itemkey) {
                item.rowId = "row-" + key;
                item.column_width = (rows[customKey]["columns_width"].length > 0) ? rows[customKey]["columns_width"].split(',')[itemkey] : "100";
                item.column = rows[customKey].children.length.toString();
                allControls.push(item);
            });
            if (rows[customKey]["columns_width"] != undefined && rows[customKey]["columns_width"].length > 0) {
                rows[customKey]["columns_width"] = rows[customKey]["columns_width"].substring(0, rows[customKey]["columns_width"].length - 1);
            }
        });
    }
    return JSON.stringify(allControls);
}

function checkColumn(text) {
    var cktemp = "0";
    switch (text) {
        case "one":
            cktemp = "1";
            break;
        case "0":
            cktemp = "0";
            break;
        case "two":
            cktemp = "2";
            break;
        case "three":
            cktemp = "3";
            break;
        case "four":
            cktemp = "4";
            break;
        case "five":
            cktemp = "5";
            break;
        case "six":
            cktemp = "6";
            break;
        case "seven":
            cktemp = "7";
            break;
        case "eight":
            cktemp = "8";
            break;
        default:
            cktemp = text;
            break;
    }
    return cktemp;
}
function SubmitApprovalData(obj, arrMaster) {
    var check_password = $('#check_form_password').val();
    var id = $('#check_form_password').data('id'); 
    var formId = $('#hdnfFomId').val();
    var editable = JSON.parse(localStorage.getItem('detail'));
    var formObj = editable.varifiedForms;
    if (check_password != "" && check_password == id) {
    } else {
        alert('Wrong Password!');
    }
}
function cartesianList(param) {
    return _.reduce(param, function (a, b) {
        return _.flatten(_.map(a, function (x) {
            return _.map(b, function (y) {
                return x.concat([y]);
            });
        }), true);
    }, [[]]);
};
function setWindowScreenSize(paramSize) {
    var params = windowParams();
    var win_size = JSON.parse(paramSize);
    var custom_w = '';
    var custom_h = '';
    var custom_X = '';
    var custom_Y = '';
    var screen = '';
    if (win_size != null && win_size.constructor.toString().indexOf("Array") > -1) {
        if (win_size != null && win_size[0]['screen'] != '' && win_size[0]['screen'] != null) {
            screen = win_size[0]['screen'];
            if (screen == "custom") {
                console.log(win_size[0]['screenCustom'], 'custom');
                var custom_settings = win_size[0]['screenCustom'];
                custom_w = custom_settings[0]['width'];
                custom_h = custom_settings[0]['height'];
                custom_X = custom_settings[0]['x'];
                custom_Y = custom_settings[0]['y'];
            }
        }
    }
    else {
        if (win_size != null && win_size['screen'] != '' && win_size['screen'] != null) {
            screen = win_size['screen'];
            if (screen == "custom") {
                var custom_settings = win_size['screenCustom'];
                custom_w = custom_settings[0]['width'];
                custom_h = custom_settings[0]['height'];
                custom_X = custom_settings[0]['x'];
                custom_Y = custom_settings[0]['y'];     
            }
        }
    }
    if (screen == "small") {
        custom_X = (window.innerWidth) / 2;
        custom_Y = (window.innerHeight) / 4;
        params = `width=640,height=480,top=${custom_Y},left=${custom_X}`;
    }
    else if (screen == "big") {
        custom_X = (window.innerWidth) / 2;
        custom_Y = (window.innerHeight) / 4;
        params = `fullscreen=yes,top=${custom_Y},left=${custom_X}`;
    }
    else if (screen == "full") {
        custom_w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
        custom_h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
        params = `width=${custom_w},height=${custom_h}`;
    }
    else if (screen == "custom") {
        custom_X = (window.innerWidth - 640) / 2;
        custom_Y = (window.innerHeight - 480) / 4;
        params = `left=${custom_X}, top=${custom_Y}, width=${custom_w},height=${custom_h}`;
    }
    else {
    }
    return params;
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function removeColumns(formid,columns) {
    removeActionButtion(formid);
    var removeColumnsFormid = [2240, 2242, 2267, 2311];
    var removeColumnName = ['Edit'];
    var excludeColumAllTable = ['Move Row'];
    columns = columns.filter(x => !excludeColumAllTable.find(y => x.title && x.title.split('|').find(z => z == y)))
    if (removeColumnsFormid.find(x => x == formid)) {
        return columns.filter(x => !removeColumnName.find(y => x.title && x.title.split('|').find(z => z == y)));
    }
    return columns;

}

function addNewColumns(formid, columns) {
    formid = parseInt(formid);
    switch (formid) {
        case 2240: {
            columns.unshift({
                title: "View Profile", formatter: function (cell, formatter) {
                    return `<a href='#/admin/gerneral-user/${formid}/${cell.getRow().getData().Id}' class="btn btn-primary text-light">View</a>`
                }, download: false, width: 80, field: "profileView", headerSort: false
            });
        }
        break;
        case 2242: {
            columns.unshift({
                title: "View Profile", formatter: function (cell, formatter) {
                    return `<a href='#/admin/counsellor/${formid}/${cell.getRow().getData().Id}' class="btn btn-primary text-light">View</a>`
                }, download: false, width: 80, field: "profileView", headerSort: false
            });
        }
            break;
        case 2246: {
            columns.unshift({
                title: "Action", formatter: function (cell, formatter) {
                    return `<a href='#/admin/forum/${cell.getRow().getData().Id}' class="btn btn-primary text-light"><i class="bi-info-circle"></i></a>`
                }, download: false, width: 100, field: "profileView", headerSort: false
            });
        }
            break;
        case 2244: {
            columns.unshift({
                title: "Action", formatter: function (cell, formatter) {
                    return `<a href='#/admin/article/${cell.getRow().getData().Id}' class="btn btn-primary text-light"><i class="bi-info-circle"></i></a>`
                }, download: false, width: 100, field: "profileView", headerSort: false
            });
        }
            break;

        case 2311: {
            columns.unshift({
                title: "Edit", formatter: function (cell, formatter) {
                    var id = cell.getRow().getData().Id;
                    return `<button onclick="angular.element(this).scope().EditSchedularForm(${id})"  class="btn btn-primary text-light"><i class="bi-gear"></i></button>`
                }, download: false, width: 100, field: "profileView", headerSort: false
            });
        }
            break;

        case 2312: {

            var $scope = angular.element($("#transaction-controller-div")).scope();
            columns.unshift({
                title: "ATTENDANCE", formatter: function (cell, formatter) {

                    if (!$scope.isBulkMarkable) {
                        return `<button onclick="angular.element('#transaction-controller-div').scope().MarkAttendance(${cell.getRow().getData().Id})"  class="btn btn-primary text-light"><i class="bi-check2-circle"></i> Mark</button>`
                    } else {

                        $scope.AttendanceRecord.push({
                            Id: cell.getRow().getData().Id,
                            Attendance: (cell.getRow().getData().ATTENDANCE == "Yes") ? "Present" : (cell.getRow().getData().ATTENDANCE == "No") ? "Absent" : "Unmarked",
                            IsUpdated: false,
                            CompanyCode: cell.getRow().getData().COMPANY_CODE
                        });

                        return `<div><input type="radio" style="display:none;"  name="bulk_radio_${cell.getRow().getData().Id}" ${(cell.getRow().getData().ATTENDANCE == "Yes") ? "checked" : ""} id="bulk_radio_${cell.getRow().getData().Id}_p" value="Present" /> <label onclick="angular.element('#transaction-controller-div').scope().updateAttendanceRecord(${cell.getRow().getData().Id}, true)" for="bulk_radio_${cell.getRow().getData().Id}_p">Present</label></div>
                                    <div><input type="radio" style="display:none;"  name="bulk_radio_${cell.getRow().getData().Id}" ${(cell.getRow().getData().ATTENDANCE == "No") ? "checked" : ""} id="bulk_radio_${cell.getRow().getData().Id}_a" value="Absent" /> <label onclick="angular.element('#transaction-controller-div').scope().updateAttendanceRecord(${cell.getRow().getData().Id}, false)" for="bulk_radio_${cell.getRow().getData().Id}_a">Absent</label></div>`
                    }


                }, download: false, width: 100, field: "profileView", headerSort: false
            });
        }
            break;
        

    }
    

    return columns;

}

function removeActionButtion(formid) {

    var removeColumnsFormid = [2240, 2242, 2267];

    if (removeColumnsFormid.find(x => x == formid)) {
        $('a[data-action="entry"]').remove();
        $('a[data-action="delete"]').remove();
    }

}

function NewformEntryfunctionality(formid, isEdit) {

    if (formid == 2303) {
        $('div.border-header_1683116492931').hide();
        $('input#COMPANY_CODE').attr("readonly", true);
        $('input#COMPANY_CODE').val(localStorage.getItem("COMPANY_CODE"));
        $('input#CALENDAR_CODE').attr("readonly", true);
        $('input#CALENDAR_CODE').val(localStorage.getItem("CALENDAR_CODE"));
        if ($('a.breadcrumb-link').length > 1) {
            var ele = $('a.breadcrumb-link')[1]
            $(ele).attr("href", window.location.href.split('#')[0] + "#/calendar/service-master/2303");
        }
        if (isEdit) {
            $('input#ACTIVITY_CODE').attr("readonly", true);
        } else {
            $('div.border-ACTIVITY_CODE').hide();
        }
    }
    if (formid == 2304) {
        $('div.border-header_1683116492931').hide();
        $('input#COMPANY_CODE').attr("readonly", true);
        $('input#COMPANY_CODE').val(localStorage.getItem("COMPANY_CODE"));
        $('input#CALENDAR_CODE').attr("readonly", true);
        $('input#CALENDAR_CODE').val(localStorage.getItem("CALENDAR_CODE"));
        if ($('a.breadcrumb-link').length > 1) {
            var ele = $('a.breadcrumb-link')[1]
            $(ele).attr("href", window.location.href.split('#')[0] + "#/calendar/service-provider-master/2304");
        }
        if (isEdit) {
            $('input#RESOURCE_CODE').attr("readonly", true);
        } else {
            $('div.border-RESOURCE_CODE').hide();
        }
    }
    if (formid == 2306) {
        $('div.border-header_1683116492931').hide();
        $('input#COMPANY_CODE').attr("readonly", true);
        $('input#COMPANY_CODE').val(localStorage.getItem("COMPANY_CODE"));
        $('input#CALENDAR_CODE').attr("readonly", true);
        $('input#CALENDAR_CODE').val(localStorage.getItem("CALENDAR_CODE"));
        if ($('a.breadcrumb-link').length > 1) {
            var ele = $('a.breadcrumb-link')[1]
            $(ele).attr("href", window.location.href.split('#')[0] +"#/calendar/location-master/2306");
        }
        if (isEdit) {
            $('input#LOCATION_CODE').attr("readonly", true);
        } else {
            $('div.border-LOCATION_CODE').hide();
        }
    }
    if (formid == 2310) {
        $('div.border-header_1683116492931').hide();
        $('input#COMPANY_CODE').attr("readonly", true);
        $('input#COMPANY_CODE').val(localStorage.getItem("COMPANY_CODE"));
        $('input#CALENDAR_CODE').attr("readonly", true);
        $('input#CALENDAR_CODE').val(localStorage.getItem("CALENDAR_CODE"));
        if ($('a.breadcrumb-link').length > 1) {
            var ele = $('a.breadcrumb-link')[1]
            $(ele).attr("href", window.location.href.split('#')[0] + "#/calendar/participant-master/2310");
        }
        if (isEdit) {
            $('input#PARTICIPANT_CODE').attr("readonly", true);
        } else {
            $('div.border-PARTICIPANT_CODE').hide();
        }
    }
    if (formid == 2311) {
        $('div.border-header_1683116492931').hide();
        $('input#COMPANY_CODE').attr("readonly", true);
        $('input#COMPANY_CODE').val(localStorage.getItem("COMPANY_CODE"));
        $('input#CALENDAR_CODE').attr("readonly", true);
        $('input#CALENDAR_CODE').val(localStorage.getItem("CALENDAR_CODE"));
        if ($('a.breadcrumb-link').length > 1) {
            var ele = $('a.breadcrumb-link')[1]
            $(ele).attr("href", window.location.href.split('#')[0] + "#/calendar/schedular-form/2311");
        }
       
    }
    if (formid == 2312) {
        $('div.border-header_1683116492931').hide();
        $('input#COMPANY_CODE').attr("readonly", true);
        $('input#COMPANY_CODE').val(localStorage.getItem("COMPANY_CODE"));
        $('input#CALENDAR_CODE').attr("readonly", true);
        $('input#CALENDAR_CODE').val(localStorage.getItem("CALENDAR_CODE"));
        if ($('a.breadcrumb-link').length > 1) {
            var ele = $('a.breadcrumb-link')[1]
            $(ele).attr("href", window.location.href.split('#')[0] + "#/calendar/transaction-master/2312");
        }

    }

    if (formid == 2322) {
        $('div.border-header_1683116492931').hide();
        $('input#COMPANY_CODE').attr("readonly", true);
        $('input#COMPANY_CODE').val(localStorage.getItem("COMPANY_CODE"));
        $('input#CALENDAR_CODE').attr("readonly", true);
        $('input#CALENDAR_CODE').val(localStorage.getItem("CALENDAR_CODE"));
        if ($('a.breadcrumb-link').length > 1) {
            var ele = $('a.breadcrumb-link')[1]
            $(ele).attr("href", window.location.href.split('#')[0] + "#/calendar/calendar-package/2322");
        }

    }

}


function GetGeneratedFormDataUrl(formid, isEdit) {

    
    if (formid == 2303) {
        return "Calendar/AddServiceMaster";
    }
    if (formid == 2304) {
        return "Calendar/AddServiceProviderMaster";
    }
    if (formid == 2306) {
        return "Calendar/AddLocationMaster";
    }
    if (formid == 2310) {
        return "Calendar/AddParticipantMaster";
    }
    if (formid == 2311) {
        return "Calendar/AddSchedularForm";
    }
    if (formid == 2312) {
        return "Calendar/AddTransactionMaster";
    }

    return "FormAPI/GeneratedFormData";
}


function GetFormRecordsUrl(formid) {

    
    if (formid == 2303) {
        return BASE_URL + "Calendar/GetServiceMasterList";
    }
    if (formid == 2304) {
        return BASE_URL + "Calendar/GetServiceProviderMasterList";
    }
    if (formid == 2306) {
        return BASE_URL + "Calendar/GetLocationMasterList";
    }
    if (formid == 2310) {
        return BASE_URL + "Calendar/GetParticipantMasterList";
    }
    if (formid == 2311) {
        return BASE_URL + "Calendar/GetSchedularFormList";
    }
    //if (formid == 2312) {
    //    return BASE_URL + "Calendar/GetTransactionMasterList";
    //}

    return BASE_URL + "FormAPI/GetFormRecordList";
}

function Check_EXIST_FIXED_OPERATING_HOURS(calendarDetails) {
    return calendarDetails && calendarDetails.category && calendarDetails.category.EXIST_FIXED_OPERATING_HOURS != 'N';
}

function Check_EXIST_FIXED_SESSIONS(calendarDetails) {
    return calendarDetails && calendarDetails.category && calendarDetails.category.EXIST_FIXED_OPERATING_HOURS != 'N';
}

function Check_EXIST_PRE_DEFINED_ACTIVITIES(calendarDetails) {
    return calendarDetails && calendarDetails.category && calendarDetails.category.EXIST_PRE_DEFINED_ACTIVITIES != 'N';
}
function Check_IS_SERVICE_TYPE(calendarDetails) {
    return calendarDetails && calendarDetails.category && calendarDetails.category.IS_SERVICE_TYPE != 'N';
}