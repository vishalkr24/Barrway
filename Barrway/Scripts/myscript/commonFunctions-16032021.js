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
                            if (indx != -1) {
                                item.resourceId = tempformentryidList[indx].toString().trim();
                            } else {
                                item.resourceId = (item.resourceId != undefined) ? item.resourceId.toString().trim() : item.resources;
                            }
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
                            if (item.allDay != undefined) {
                                item.allDay = item.allDay=="true"?true:false;
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
        url: "api/FormAPI/ManageCalenderReferrenceNew",
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

function changeDimension(formId, event) {
    //alert(formId)
    console.log(event)
    var param = {};
    param.referrenceFormId = formId;
    param.referrenceId = event.value;
    $(event.parentElement.parentElement).find('.title1').text(event.selectedOptions[0].innerText);
    var $scope = angular.element($("#calendar")).scope();
    param.innerText = event.selectedOptions[0].innerText;
    $scope.updateDimensionCalenderEvent(param);
}

function compareEventStartEndDateTime(eventData, item) {

    return ((moment(new Date(eventData.start), "DD/MM/YYYY HH:mm").format("DD/MM/YYYY hh:mm") ==
        moment(new Date(item.start), "DD/MM/YYYY HH:mm").format("DD/MM/YYYY hh:mm"))
        && (moment(new Date(eventData.end), "DD/MM/YYYY HH:mm").format("DD/MM/YYYY hh:mm") ==
            moment(new Date(item.end), "DD/MM/YYYY HH:mm").format("DD/MM/YYYY hh:mm"))) ? true : false;


    //return (moment(new Date(eventData.start), "DD/MM/YYYY HH:mm").diff(moment(new Date(item.start), "DD/MM/YYYY HH:mm"))
    //    == 0 && moment(new Date(eventData.end), "DD/MM/YYYY HH:mm").diff(moment(new Date(item.end), "DD/MM/YYYY HH:mm"))
    //    == 0) ? true : false;       
}

function refreshEventResourcesActivity(calenderType, calenderData, resourceData, resColumns, activityFormData, activityColumn, activityEvents) {

    calenderData = changeResourceIDByYSelection((calenderData.data != undefined) ? calenderData.data : calenderData);

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

function loadCalendar(calenderType, calenderData, resourceData, resColumns, activityFormData, activityColumn, activityEvents) {
    try {
        if (calenderData.length > 0)
            showLoader();
        else
            $.unblockUI();
    }
    catch (e) {
        $.unblockUI();
        //console.log(e);
    }
    //console.log('this is the calender data............');
    calenderData = changeResourceIDByYSelection((calenderData.data != undefined) ? calenderData.data : calenderData);
    //console.log(calenderData);
    //var tagify = "";
    window["eventListTemp"] = calenderData;
    var basicDetails = window["EventBasicDetail"];
    //var activitiesCategory = '';
    var GroupingData = window["colGrouping"];
    //console.log('grouping data is :');
    //console.log(GroupingData);
    // $scope.BaseUrl
    var $scopeVar = angular.element($("#calendar")).scope();
    var formID = basicDetails.formData.formId;
    var resourceColumn = '';

    var activitiesForm = basicDetails.formData.activitiesForm;
    var majorGroup = "";
    var minorGroup = "";
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

    //console.log('event overlap is ' + eventOverlap);
    var userid = JSON.parse(localStorage.detail).Id;
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
        //console.log(value1);
        $.each(resColumns, function (index, value2) {
            if (value2.field == value1)
                _ColumnResults.push(value2);
            //console.log(value2);
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
        //slotDuration: '00:05:00',
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
            //console.log(eventExtData);



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
                            angular.forEach(majorGroupSplits, function (value, pos) {
                                if (titleModifiedPart !== "")
                                    titleModifiedPart += "-" + resource[value].toString();
                                else
                                    titleModifiedPart = resource[value].toString();



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




                        angular.forEach(_seperatedFormIDs, function (value, key) {
                            if (value.trim() === _currResFormId.toString().trim()) {
                                _seperatedTitles[key] = titleModifiedPart;
                                _seperatedIds[key] = event.resourceId;
                            }
                        });
                        //angular.forEach(_seperatedResFormIDs, function (value, key) {
                        //    if (value === _currResFormId.toString()) {
                        //        _seperatedResEntryIDs[key] = event.resourceId;
                        //        _seperatedResColValues[key] = resourceValue;
                        //    }
                        //});

                        var _newseperatedTitles = ""; var _newseperatedIds = ""; var _newseperatedResEntryIDs = ""; var _newseperatedResColValues = "";
                        angular.forEach(_seperatedFormIDs, function (value, key) {
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
                    data: "{'action':2,'userid':" + eventBasicData.userId + ",'Id':" + parseInt(Id) + ", 'formId':" + eventBasicData.formId + ",'topicId':" + eventBasicData.formData.topicId + ",'created_by':" + eventBasicData.created_by + ",'updated_by':" + eventBasicData.update_by + ",'formfieldDataListTemp':'" + JSON.stringify(formfieldDataListTempData) + "' ,'isInternalDrop':" + isInternalDropParam + ",startDate:'" + start + "','endDate':'" + end + "','eventOverlap': '','activitiesOverlap':" + activitiesOverlap + "}", //$.param(formData)
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



                                angular.forEach(filteredEventsCalender, function (dataRow, position) {

                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;

                                    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;


                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    angular.forEach(commaVals, function (idVal, pos) {
                                        //console.log(commaVals + "," + commaIDs[pos].toString())
                                        if (idVal == ySelected.toString()) {
                                            dataRow.resFormID = idVal;
                                            dataRow.resources = commaIDs[pos];
                                            dataRow.resourceId = commaIDs[pos];
                                            dataRow.title = "";
                                        }

                                    })



                                });

                                angular.forEach(filteredEventsActivity, function (dataRow, position) {

                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;
                                    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;
                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    angular.forEach(commaVals, function (idVal, pos) {
                                        //console.log(commaVals + "," + commaIDs[pos].toString())
                                        if (idVal == ySelected.toString()) {
                                            dataRow.resFormID = idVal;
                                            dataRow.resources = commaIDs[pos];
                                            dataRow.resourceId = commaIDs[pos];
                                            dataRow.title = "";
                                        }

                                    })



                                });

                                angular.forEach(filteredoneToManyList, function (dataRow, position) {

                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;

                                    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;


                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    angular.forEach(commaVals, function (idVal, pos) {
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
                            swal({ type: 'error', title: '', text: response.overlapMessage });

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
            //if (current_tab == "timeline-resource-view" || current_tab == "vertical-resource-view")
            //    isResizedEvent = 1;
            //else
            //    isResizedEvent = 0;
            window["scrollOffset"] = $(window).scrollTop();
            var resourceId = (event.resourceId) ? event.resourceId : '';
            var resources = (event.resources) ? event.resources : '';
            var activities = (event.activities) ? event.activities : '';
            var allDay = false;
            var formfieldDataListTempData = [];
            //console.log(eventExtData);
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


                                ActivityEditableRow[0].start = start;
                                ActivityEditableRow[0].end = end;


                                oneToManyListEditableRow[0].start = start;
                                oneToManyListEditableRow[0].end = end;

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
                                    return e.Id != event.value;
                                });
                                filteredEventsCalender.push(CalenderEditableRow[0]);
                                filteredEventsActivity.push(ActivityEditableRow[0]);
                                filteredoneToManyList.push(oneToManyListEditableRow[0]);
                                eventBasicData.formData.FormDataToOneListDynamic = filteredoneToManyList;



                                angular.forEach(filteredEventsCalender, function (dataRow, position) {

                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;

                                    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;


                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    angular.forEach(commaVals, function (idVal, pos) {
                                        //console.log(commaVals + "," + commaIDs[pos].toString())
                                        if (idVal == ySelected.toString()) {
                                            dataRow.resFormID = idVal;
                                            dataRow.resources = commaIDs[pos];
                                            dataRow.resourceId = commaIDs[pos];
                                            dataRow.title = "";
                                        }

                                    })



                                });

                                angular.forEach(filteredEventsActivity, function (dataRow, position) {

                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;
                                    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;
                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    angular.forEach(commaVals, function (idVal, pos) {
                                        //console.log(commaVals + "," + commaIDs[pos].toString())
                                        if (idVal == ySelected.toString()) {
                                            dataRow.resFormID = idVal;
                                            dataRow.resources = commaIDs[pos];
                                            dataRow.resourceId = commaIDs[pos];
                                            dataRow.title = "";
                                        }

                                    })



                                });

                                angular.forEach(filteredoneToManyList, function (dataRow, position) {

                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;

                                    var seperatedIdsParam = dataRow.seperatedIds != undefined ? dataRow.seperatedIds : dataRow.seperatedIDs;


                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    angular.forEach(commaVals, function (idVal, pos) {
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
                                console.log('hi4')
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
                            // }
                            //var CalendarEventList = window["CalendarEventList"];
                            //var ActivityEventList = window["ActivityEventList"];
                            //var CalenderEditableRow = $.grep(CalendarEventList, function (e) {
                            //    return e.value == event.value;
                            //});
                            //var ActivityEditableRow = $.grep(ActivityEventList, function (e) {
                            //    return e.value == event.value;
                            //});

                            //// for calender events
                            //CalenderEditableRow.start = start;
                            //CalenderEditableRow.end = end;
                            //CalenderEditableRow.Id = Id;
                            //CalenderEditableRow.title = event.title;
                            //CalenderEditableRow.color = event.color;
                            //CalenderEditableRow.description = event.description;
                            //CalenderEditableRow.service = event.service;
                            //if (current_tab != "vertical-activities-view") {
                            //    CalenderEditableRow.resources = resources;
                            //    CalenderEditableRow.resourceId = resourceId;
                            //}

                            ////for activity events
                            //ActivityEditableRow.start = start;
                            //ActivityEditableRow.end = end;
                            //ActivityEditableRow.Id = Id;
                            //ActivityEditableRow.title = event.title;
                            //ActivityEditableRow.color = event.color;
                            //ActivityEditableRow.description = event.description;
                            //ActivityEditableRow.service = event.service;
                            //ActivityEditableRow.resources = resources;
                            //if (current_tab == "vertical-activities-view") {
                            //    ActivityEditableRow.resourceId = activityId;
                            //    ActivityEditableRow.activities = activities;// SETTING UP ACTIVITY ID AS RESOURCE ID FOR VERTICAL RESOURCE DATA .
                            //}
                            //else {
                            //    ActivityEditableRow.resourceId = activities;
                            //    ActivityEditableRow.activities = activities;// SETTING UP ACTIVITY ID AS RESOURCE ID FOR VERTICAL RESOURCE DATA .
                            //}
                            //// editableRow.color = event.color;

                            ////var  filteredItems = CalendarEventList.filter((item) => item.Id !== response.Id);
                            ////console.log(event.value);
                            ////console.log('ffffff');
                            ////console.log(CalenderEditableRow);

                            //var filteredEventsCalender = $.grep(CalendarEventList, function (e) {
                            //    return e.value != event.value;
                            //});
                            //var filteredEventsActivity = $.grep(ActivityEventList, function (e) {
                            //    return e.value != event.value;
                            //});
                            //filteredEventsCalender.push(CalenderEditableRow);
                            //filteredEventsActivity.push(ActivityEditableRow);
                            ////$.grep(CalendarEventList, function (e) {
                            ////    return e.value = response.Id;
                            ////}).end = end;
                            ////editableRow.start = start;
                            ////editableRow.end = end;




                            ////console.log(response.Id);
                            //// //console.log(editableRow);
                            ////console.log('before insertion ');
                            ////console.log(filteredEventsCalender);

                            //// CalendarEventList.push(editableRow);
                            //window["CalendarEventList"] = filteredEventsCalender;
                            //window["ActivityEventList"] = filteredEventsActivity;
                            ////console.log('after  insertion ');
                            ////console.log(filteredEventsActivity);
                            //$('.calendar').fullCalendar('destroy');
                            //loadCalendar('BasicView', filteredEventsCalender, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, filteredEventsActivity);
                            ////  loadCalendar('BasicView', filteredEvents);
                            //$('#basic-view div.calendar').fullCalendar('refetchEvents');


                            //eventBasicData.formGroupKey = create_UUID();
                            //window["EventBasicDetail"] = eventBasicData;
                            //$.jGrowl(response.Message, { position: 'center' });
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

                        var _ScrollOffset = window["scrollOffset"];
                        window.scrollTo(0, _ScrollOffset);
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
            ////console.clear();
            //console.groupCollapsed(event, element, 'hello');
            var table = $("<div class='event-detail div-flex'></div>"), deleteParams;
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
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
                                    //  //console.log("file " + $(this).attr('src') + " not found");
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
                            //}
                        }
                    }
                });
                // deleteParams = JSON.stringify({ formId: <?= $formDetails -> formID; ?>, created_by: event.data.fg_created_by_id, created_at: event.data.fg_created_at_timestamp});
            }
            else {
                var rowRecord = "";
                var rowTooltipDisplay = "";
                //var eventTagsList = [];
                //if (event.eventTagsList != undefined && event.eventTagsList != "") {
                //    eventTagsList = event.eventTagsList;
                //    eventTagsList = eventTagsList.replace(/"/g, "'");
                //}

                //event.title = "";
                // alert(event.seperatedFormIDs);

                //var _associatedTitles = event.seperatedTitles;
                var _associatedTitles = event.customTitle;
                //var _associatedFormIDs = event.seperatedFormIDs;
                var _associatedFormIDs = event.customForms;
         
                //var _associatedColorValues = event.seperatedColorValues;
                var $scope = angular.element($("#calendar")).scope();
                var _allSelectables = $scope.xaxisFormList; // x options has all selectable options .
                var _ySelected = window["ySelected"]; // get y selected option.
                var _xSelected = window["xSelected"];
                var _lablesToShow = []; var _colorToShow = [];
                var _tempTitle = "";
                var _tempTitleSecond = "";
                angular.forEach(_allSelectables, function (dataRow, position) {
                    if (dataRow.resourceActivityForm !== _ySelected) {
                        _lablesToShow.push(dataRow.resourceActivityForm.toString());

                    }

                });
                //resourceActivityForm



                if (typeof _associatedTitles !== "undefined" && _associatedTitles !== null && _associatedTitles !== "") {




                    var _arrTitles = _associatedTitles.split(',');
                    var _arrFormIDs = _associatedFormIDs.split(',');
                    var _arrColor = [];
                    var formIdTemp = [];
                    angular.forEach(_arrFormIDs, function (item) {
                        formIdTemp.push(item.trim());
                    });
                    _arrFormIDs = formIdTemp;
                    //if (_associatedColorValues != null && _associatedColorValues != undefined)
                    //_arrColor = _associatedColorValues.split('/');

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
                        if (_arrColor.length >0) {
                            _temp = _arrColor[0];
                            _arrColor[0] = _arrColor[_xPos];
                            _arrColor[_xPos] = _temp;
                        }

                        //for formIDs
                        _temp = _arrFormIDs[0];
                        _arrFormIDs[0] = _arrFormIDs[_xPos];
                        _arrFormIDs[_xPos] = _temp;
                    }

                    //if (_arrTitles.length > 0) {



                    //    _tempTitle = _arrTitles[0];

                    //}

                    element.find('.fc-content').remove();
                    angular.forEach(_arrTitles, function (_arrRowData, position) {
                        //console.log(_arrRowData);
                        _tempTitle += "<div class='temp'>";
                        var _isAllowToRender = false;
                        var TitleFormId = _arrFormIDs[position];
                        var lblColor = "";
                        angular.forEach(_lablesToShow, function (dataRow2, position2) {
                            if (TitleFormId.toString().trim() === dataRow2)
                                _isAllowToRender = true;
                        });
                        var count = 0;
                        var currentId = 0;
                        var list = [];
                        var listids = [];
                        var listDrop = "";
                        var listDropdownTemp = {};
                        if (TitleFormId.toString().trim() != "") {
                            listDropdownTemp = _.findWhere($scopeVar.yaxisFormListCopy, { resourceActivityForm: parseInt(TitleFormId.toString().trim()) });
                            if (listDropdownTemp != undefined) {
                                listDrop = "<div class='d-none popoverSelect'><select class='form-control form-control-sm w-50' onchange='changeDimension(" + TitleFormId.toString().trim() + ",this)'>"
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
                                rowTooltipDisplay += slipTitle+" <br/>";
                                element.append(
                                    $('<div>', {
                                        class: 'fc-content', "id": event.Id + "_" + list[count].trim() + "_" + currentId, "title": slipTitle

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



                }
               
                var eventData = {
                    Id: event.Id,
                    //eventTagsList: eventTagsList,
                    Images: event.files,
                    title: _tempTitle,
                    start: event.start != null && event.start != undefined && event.start != '' ? customDate(event.start.format()) : '',
                    end: event.end != null && event.end != undefined && event.end!='' ? customDate(event.end.format()) : '',
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
                eventData.start = event.start != null && event.start != undefined && event.start != ''? customDate(eventData.start.format()) : ''
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
                    rowTooltipDisplay += DateWithDayName(eventData, true) + "<br/>"
                    rowTooltipDisplay += TimeFormatCalender(eventData, true) + "<br/>"
                }
                else {
                    rowRecord += "<div class='" + moment(eventData.start).format("YYYY-MM-DD") + "'>" + moment(eventData.start).format("MMMM D, YYYY (dddd)") + "</div>";
                    rowTooltipDisplay += moment(eventData.start).format("YYYY-MM-DD") + "<br/>"
                }
                //if (eventData.end != null && eventData.end.length > 0)
                //    rowRecord += "<div class='" + eventData.end + "'><b>End:</b>" + DateWithDayName(eventData.end) + "</div>";
                //rowRecord += "<div>" + TimeFormatCalender(eventData.end) + "</div>";

                //if (eventData.allDay != null)
                //    rowRecord += "<div class='" + eventData.allDay + "'>" + eventData.allDay + "</div>";

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

                //if (eventData.resources != null && eventData.resources.length > 0)
                //    rowRecord += "<div class='" + eventData.resources + "'> " + eventData.resources + "</div>";
                //if (eventData.activityName != null && eventData.activityName.length > 0)
                //    rowRecord += "<div class='" + eventData.activityName + "'>" + eventData.activityName + "</div>";


                //if (eventData.service != null && eventData.service.length > 0)
                //    rowRecord += "<div class='" + eventData.service + "'>" + eventData.service + "</div>";
                //if (eventData.description != null && eventData.description.length > 0)
                //    rowRecord += "<div class='" + eventData.description + "'> " + eventData.description + "</div>";
                if (imageFound > 1) {
                    showAllFiles = "<a  class='btn btn-xs btn-default' data-toggle='modal' data-target='#galleryModal' title='Show all files'   data-files='" + eventData.Images + "'>Show all files</a>";
                    rowRecord += "<div class='" + eventData.Images + "'><strong>File Uploads:</strong> " + showAllFiles + "</div>";
                }
            }

            var $scope = angular.element($("#calendar")).scope();

            table.append("<div class='div-flex'>" + rowRecord + "</div>");
            var basicDetails = window["EventBasicDetail"];

            //var actionRow = "<a class='btn btn-primary edit-event' title='Edit'  ui-sref='editFormEntryData({ formId: " + basicDetails.formId + ",formGroupKey:calxyz25ss,Id:" + event.Id + "})'  href='#/form/editEntry/" + basicDetails.formId + "/calxyz25ss/" + event.Id + "'> Edit</i></a > ";
            var actionRow = "";
            actionRow += "<div id='eventCopy' class='mr-10 cursor-pointer' data-formId=" + basicDetails.formId + " data-formGroupKey='" + eventData.formGroupKey + "' data-eventId='" + event.Id + "'><a> <i class='fa fa-copy'></i></a></div>"
            actionRow += "<div id='eventEdit' class='mr-10 cursor-pointer' data-formId=" + basicDetails.formId + " data-formGroupKey='" + eventData.formGroupKey + "' data-eventId='" + event.Id + "'><a> <i class='fa fa-pencil'></i></a></div>"
           
            actionRow += "<div id='eventDelete' data-formId=" + basicDetails.formId + " data-formGroupKey='" + eventData.formGroupKey + "' data-eventId='" + event.Id + "' class='delete-event cursor-pointer'><i class='fa fa-trash'></i></div>"
            //actionRow += "<a class='btn btn-primary edit-event' title='edit' data-formgroupkey='" + event.Id + "' data-deleteparams=''>Event Edit </a>";
            //actionRow += "<a class='btn btn-danger delete-event' title='Delete' data-formgroupkey='" + event.Id + "' data-deleteparams=''>Delete </a>";

            actionRow += "<a class='btn close-event cursor-pointer' title='close'> <i class='fa fa-times'></i></a>";
            table.append("<div class='btn-box'>" + actionRow + "</div>");
            table.append('<div class="div-flex div-list-bar"></div>');

            //table.append(`<div class="div-flex div-list"></div`);

            if ($scope.listTabulator.length > 0) {
                table.append(`<div class="div-flex div-list">
                            <div class="d-flex justify-content-between align-items-center p-0">
                                <h5 class="list-title mb-0" id="tabuList"></h5>
                                <div class="d-block">
                                    <div id="addTransactionRecord" class="edit-event-student cursor-pointer d-inline-block"><i class="fa fa-plus"></i></div> <div id="tabuListLink" class="edit-event-student mr-0 ml-1 cursor-pointer d-inline-block"  title="Edit"><i class="fa fa-pencil"></i></div> </div>  </div>   <ul id="tabuListUl">  </ul></div>`);
            }
            else
            {
                //if ($scope.otherformDetails != undefined)
               // {
                    table.append(`<div class="div-flex div-list">
                            <div class="d-flex justify-content-between align-items-center p-0">
                                <h5 class="list-title mb-0" id="tabuList"></h5>
                                <div class="d-block">
                                    <div id="addTransactionRecord" class="edit-event-student cursor-pointer d-inline-block"><i class="fa fa-plus"></i></div>  </div>  </div>   <ul id="tabuListUl">  </ul></div>`);
                //}
            }
            //if ($scope.listTabulator.length>0)
            //table.append(` <div id="tabuListLink" class="edit-event-student mr-0 ml-1 cursor-pointer d-inline-block"  title="Edit"><i class="fa fa-pencil"></i></div> `);



            //element.attr('title', event.title); <li ng-repeat="l in listTabulator[0].formData | filter : listTabulator[0].searchTextData">{{ item.dname}}</li>


            //element.find(".fc-content").css('height', '100px');
            let $fcContent = element.find(".fc-content").detach(),
                $resize = element.find(".fc-resizer").detach();
            //console.log($fcContent, 'FC');
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
            }).droppable({
                    //activeClass: "ui-state-default",
                    //hoverClass: "ui-state-hover",
                    //accept: ":not(.ui-sortable-helper)",
                    drop: function (event, ui) {
                        //console.log(event);
                        // //console.log('triggered');
                        //  alert();

                        //$(this).append(
                        //    $('<div>', { class: 'fc-content' }).append(
                        //        $('<span>', { class: 'fc-title' }).text($(ui.draggable).text())
                        //    ).css({
                        //        background: "#37cd8e",
                        //        borderRadius: 3,
                        //    })
                        //);
                        //$(ui.draggable).remove();
                    },
                }).empty().append($fcContent.css({
                    //background: "#81189f",
                    borderRadius: 3,
                }), $resize);
            setTimeout(function () {
                jQuery.curCSS = function (element, prop, val) {
                    return jQuery(element).css(prop, val);
                };
                $('.fc-content').bstooltip();
            }, 500);
        },
        eventClick: function (calEvent, jsEvent, view) {
            ////console.log(view);
           
            $('.close-event').on('click', function () {
                $("body .popover").addClass('isPopoverLoaded');
                $("body .popover").popover('hide');
                $("#tabuListUl").empty();
                var $scope = angular.element($("#calendar")).scope();
                $('.temp').find('.titleContainer').removeClass('d-none');
                $('.popoverSelect').addClass('d-none');
                //$('.popover').remove();
            });
            //$('.div-flex.div-list').on('click', function () {
            //    $(this).children('ul').slideToggle();
            //})
            setTimeout(function () {
                if (!$("body .popover").hasClass("isPopoverLoaded")) {
                    $('#eventEdit').on('click', function () {
                        //alert('eventEdit')
                        var formId = $(this).data('formid');
                        var formGroupKey = $(this).data('formgroupkey');
                        var rowId = $(this).data('eventid');
                        var eventData = _.findWhere(window["CalendarEventList"], { formGroupKey: formGroupKey.toString() });
                        var customFormIds = [];
                        var customForms = [];
                        if (eventData.customFormIds.contains(',')) {
                            var customTemp = eventData.customFormIds.split(',');
                            _.each(customTemp, function (item) {
                                customFormIds.push(item.trim());
                            });
                            customFormIds = customFormIds.join(',');
                            var customTemp1 = eventData.customForms.split(',');
                            _.each(customTemp1, function (item) {
                                customForms.push(item.trim());
                            });
                            customForms = customTemp1.join(',');
                        }
                        $("body .popover").removeClass('isPopoverLoaded');
                        var $scope = angular.element($("#calendar")).scope();
                        //var params = windowParams();
                        var params = setWindowScreenSize($scope.formDetailsDataInfo.screenMode);
                        var newWindow = {};
                        var baseUrl = $scope.BaseUrl;
                        newWindow = window.open(baseUrl + "#/form/editEvent/" + formId + "/" + formGroupKey + "/" + rowId + '?popup=1&customForms=' + customForms + '&customFormIds=' + customFormIds + '', 'example', params, true);
                        newWindow.focus();
                        var timer = setInterval(function () {
                            if (newWindow.closed) {
                                clearInterval(timer);
                                var $scope = angular.element($("#calendar")).scope();
                                $scope.resetFilter();
                                $("body .popover").addClass('isPopoverLoaded');
                                $("body .popover").popover('hide');
                                $("#tabuListUl").empty();
                                var $scope = angular.element($("#calendar")).scope();
                                $('.temp').find('.titleContainer').removeClass('d-none');
                                $('.popoverSelect').addClass('d-none');
                                //location.reload();
                            }
                        }, 500);
                    });
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
                    });
                }
                var $scope = angular.element($("#calendar")).scope();
                _.each($scope.totalSelectListTagify, function (item, key) {
                    var param = {};
                    var input = document.getElementById('tag-input' + item.fieldName);
                    if (input != null) {
                        // init Tagify script on the above inputs
                        var selectedId = $("#tag-inputHidden").val();
                        param.selectedId = selectedId;
                        $scope.getTabulatorListFromEvents(param);
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
                $scope.rootScopeSafe();
            }, 150);

            /*var r=confirm("Delete " + calEvent.title);
            if (r===true)
            {
                $('#basic-view div.calendar').fullCalendar('removeEvents', calEvent._id);
            }*/
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
        eventAfterRender: function (event, element, view) {
            // alert('called after rander');
            $.unblockUI();
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
                //$('.popover').remove();
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
        allDaySlot: true
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
        // droppable: true, // this allows things to be dropped onto the calendar
        drop: function (date, jsEvent, ui, resourceId) {
            //console.log($(this));
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
                allDayCustom = (current_subtab.contains('fc-timelineMonth-button') || current_subtab.contains('fc-timelineYear-button')).toString();
            }
            var defaultDuration = moment.duration(eventExtData.duration);
            var end = date.clone().add(defaultDuration);
            var activities = eventExtData.id;


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

            if (allDayCustom == "true") {
                startCustom = date.format("YYYY-MM-DD");
                startCustom = moment(startCustom + " 00:00:00 ");
                endCustom = date.format("YYYY-MM-DD");
                let initialdate = endCustom;
                let start_time = '23:59:59';
                endCustom = moment(initialdate + " " + start_time);
                //currentDate = new Date(custom_date);
                //customdate = moment(currentDate).format('MMMM D YYYY, dddd'); 
            }
            else {
                allDayCustom = "false";
                if (eventExtData.duration = null || eventExtData.duration == "" || eventExtData.duration == undefined ||  exists.duration == "0") {
                    allDayCustom = "true";
                    startCustom = date.format("YYYY-MM-DD");
                    startCustom = moment(startCustom + " 00:00:00 ");
                    endCustom = date.format("YYYY-MM-DD");
                    let initialdate = endCustom;
                    let start_time = '23:59:59';
                    endCustom = moment(initialdate + " " + start_time);                   
                }
            }  
            var formfieldDataListTempData = [];
            //console.log(eventExtData);


            if ($('#allDay-check').is(':checked')) {
                allDayCustom = "true";
                startCustom = date.format("YYYY-MM-DD");
                startCustom = moment(startCustom + " 00:00:00 ");
                endCustom = date.format("YYYY-MM-DD");
                let initialdate = endCustom;
                let start_time = '23:59:59';
                endCustom = moment(initialdate + " " + start_time); 
            }

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
                            var param = {};
                            param.resourceFormId = eventBasicData.resFormIdParam;
                            param.activityFormId = eventBasicData.actFormIdParam;
                            param.resourceId = eventBasicData.resourceId.toString();
                            param.activityId = activities.toString();
                            manageOneToManyReferrenceForm(param);
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
                            //eventBasicData.formGroupKey = create_UUID();
                            window["EventBasicDetail"] = eventBasicData;

                            var CalendarEventList = window["CalendarEventList"];
                            var ActivityEventList = window["ActivityEventList"];
                            //console.log('before insertion ');
                            //console.log(CalendarEventList);

                            CalendarEventList.push(calenderNewRow);
                            ActivityEventList.push(activityNewRow);
                            window["CalendarEventList"] = CalendarEventList;
                            window["ActivityEventList"] = ActivityEventList;
                            //console.log('after  insertion ');
                            //console.log(CalendarEventList);
                            console.log('hi5')
                            // $('.calendar').fullCalendar('destroy');
                            //loadCalendar('BasicView', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, ActivityEventList);
                            refreshEventResourcesActivity('BasicView', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, ActivityEventList);
                            //  loadCalendar('BasicView', CalendarEventList);
                            //$('#basic-view div.calendar').fullCalendar('refetchEvents');

                            //eventBasicData.formGroupKey = create_UUID();
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



    //tagyfiy on blur
    function onTagifyFocusBlur(e) {
        //console.log(e.type, "event fired")
    }
    // tag added callback
    function onAddTag(e) {
        var id = $("#tag-inputHidden").val();
        var fieldName = $("#tag-inputHidden" + id).val();
        //console.log("id: ", id);
        //console.log("onAddTag: ", e.detail);
        var $scope = angular.element($("#calendar")).scope();

        var param = {};
        var list = [];
        //param.fieldName = "eventTagsList";
        param.fieldName = fieldName;
        _.each(e.detail.tagify.value, function (item) {
            list.push('"' + item.value + '"');
        });
        param.fieldDataText = "[" + list.join(',') + "]";

        param.formId = $scope.currentFormId;
        param.Id = id;
        $scope.updateRowDataRecord(param);
        ////console.log("original input value: ", inputElm.value)
        //tagify.off('add', onAddTag) // exmaple of removing a custom Tagify event
    }

    // tag remvoed callback
    function onRemoveTag(e) {
        var id = $("#tag-inputHidden").val();
        var fieldName = $("#tag-inputHidden" + id).val();
        var $scope = angular.element($("#calendar")).scope();
        var param = {};
        var list = [];
        //param.fieldName = "eventTagsList";
        param.fieldName = fieldName;
        _.each(e.detail.tagify.value, function (item) {
            list.push('"' + item.value + '"');
        });
        param.fieldDataText = "[" + list.join(',') + "]";
        param.Id = id;
        param.formId = $scope.currentFormId;
        $scope.updateRowDataRecord(param);
        //console.log("onRemoveTag:", e.detail, "tagify instance value:", tagify.value)
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
        // var instance = document.getElementById('calendar');

        window["scrollOffset"] = $(window).scrollTop();
        var eventBasicData = window["EventBasicDetail"];
        var checkExists = window["CalendarEventList"];
        //console.log('start date is ' + eventData.start);
        //console.log('end date is ' + eventData.end);
        var actFormIdParam = window["xSelected"];
        var resFormIdParam = window["ySelected"];
        var param = {};
        //console.log(eventBasicData);
        param.action = eventBasicData.action;
        param.formId = eventBasicData.formId;
        param.userId = eventBasicData.userId;
        param.isDyEvent = true;
        param.topicId = eventBasicData.formData.topicId;
        param.created_by = eventBasicData.created_by;
        param.update_by = eventBasicData.update_by;
        param.formGroupKey = eventBasicData.formGroupKey

        var tempGroup =  create_UUID();

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
        //var exists = _.filter(checkExists, function (item) {
        //    return (eventData.start >= item.start && eventData.end <= item.start ) && item.resourceId == eventData.resourceId;
        //});
        var exists = _.filter(checkExists, function (item) {
            return compareEventStartEndDateTime(eventData, item) 
            && (item.resourceId == eventData.resourceId ||
                item.resources == eventData.resourceId);
            //return (eventData.start == item.start && eventData.end == item.end) && item.resourceId == eventData.resourceId;
        });
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

            // var seperatedIds = exists.seperatedIds;
            //  var seperatedTitles = exists.seperatedTitles;
            //  var seperatedFormIDs = exists.seperatedFormIDs;

            //  var seperatedResFormIDs = exists.seperatedResFormIDs;
            //  var seperatedResEntryIDs = exists.seperatedResEntryIDs;

            var seperatedResColValues = exists.seperatedResColValues;
            var seperatedColorValues = exists.seperatedColorValues;

            //if (seperatedIds != null && seperatedIds !== "") {
            //    param.seperatedIds = seperatedIds + "," + eventData.id.toString();
            //}
            //else {
            //    param.seperatedIds = eventData.id.toString();
            //}
            //if (seperatedTitles != null && seperatedTitles !== "") {
            //    param.seperatedTitles = seperatedTitles + " , " + eventData.title;
            //}
            //else {
            //    param.seperatedTitles = eventData.title;
            //}
            //if (seperatedFormIDs != null && seperatedFormIDs.toString() !== "") {
            //    param.seperatedFormIDs = seperatedFormIDs + "," + window["xSelected"].toString();
            //}
            //else {
            //    param.seperatedFormIDs = window["xSelected"].toString();
            //}
            //if (seperatedResFormIDs != null && seperatedResFormIDs.toString() !== "") {
            //    param.seperatedResFormIDs = seperatedResFormIDs + "," + window["ySelected"].toString();
            //}
            //else {
            //    param.seperatedResFormIDs = window["ySelected"].toString();
            //}
            //if (seperatedResEntryIDs != null && seperatedResEntryIDs.toString() !== "") {
            //    param.seperatedResEntryIDs = seperatedResEntryIDs + "," + eventData.resourceId.toString();
            //}
            //else {
            //    param.seperatedResEntryIDs = eventData.resourceId.toString();
            //}


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
            if (eventData.dimensionType === "ND") {
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
            }
            else {
                formfieldDataListTempData.push({ "name": "parentID", "value": 0 });
                param.parentID = 0;
                param.seperatedFormIDs = window["xSelected"].toString();
                param.seperatedTitles = eventData.title;//+ "," + eventData.colActivityValue.toString() + " - " + eventData.colCategoryValue.toString() + " in " + eventData.dropin.toString();
                param.seperatedResFormIDs = window["ySelected"].toString();//+ "," + window["xSelected"].toString();
                param.seperatedResEntryIDs = eventData.resourceId.toString(); //+ "," + eventData.id.toString();
                param.seperatedResColValues = eventData.resources.toString();// + "," + eventData.activities.toString();
                param.seperatedColorValues = eventData.color.toString(); //+ "/" + eventData.colColorValue.toString();
                param.seperatedIds = eventData.id.toString();//+ "," + eventData.resourceId.toString();
                param.isEventUpdatable = false;

            }
            eventBasicData.formGroupKey = create_UUID();
        }
        param.formfieldDataListTemp = formfieldDataListTempData;
        var isAllowToUpdate = false;
        if (typeof seperatedTitles !== "undefined" && seperatedTitles !== "" && seperatedTitles !== null) {
        }
        //if (isAllowToUpdate) {

        $.ajax({
            method: 'POST',
            url: "api/FormAPI/GeneratedFormData",
            dataType: 'json',
            contentType: "application/json",
            // data: "{'action':" + param.action + ",'formId':" + param.formId + ",'topicId':" + param.topicId + ",'created_by':" + param.created_by + ",'updated_by':" + param.update_by + ",'formGroupKey':" + param.formGroupKey + ",'formfieldDataListTemp':" + JSON.stringify(param.formfieldDataListTemp) + "}", //$.param(formData)
            data: "{'action':" + param.action + ",'userId':" + param.userId + ",'formId':" + param.formId + ",'resourceFormId':" + resFormIdParam + ",'ActivityFormId':" + actFormIdParam + ",'parentID':" + param.parentID + ",'isDyEvent':" + param.isDyEvent + ",'isEventUpdatable':" + param.isEventUpdatable + ",'seperatedResColValues':'" + param.seperatedResColValues + "','seperatedColorValues':'" + param.seperatedColorValues + "',   'topicId':" + param.topicId + ",'created_by':" + param.created_by + ",'updated_by':" + param.update_by + ",'formGroupKey':'" + param.formGroupKey + "','formfieldDataListTemp':'" + JSON.stringify(param.formfieldDataListTemp) + "'}", //$.param(formData)

            beforeSend: function () {
                showLoader();
            },
            success: function (response) {
                if (response.res > 0 && param.action == 1) {
                    //console.log(response);

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
                        
                        customTitle: eventData.dropinTitle+','+param.activities.toString(),
                        customForms: eventData.resFormID + ',' +param.activityFormId.toString(),
                        customFormIds: eventData.resourceId + ',' +param.activityId.toString(),

            
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


                    //var oneTomanyNewRow=
                    //    eventBasicData.formData.FormDataToOneListDynamic
                    var CalendarEventList = window["CalendarEventList"];
                    var ActivityEventList = window["ActivityEventList"];
                    //var oneToManyList = eventBasicData.formData.FormDataToOneListDynamic;

                    //console.log('before insertion ');
                    //console.log(CalendarEventList);

                    //CalendarEventList = $.grep(CalendarEventList, function (e) {
                    //    return e.value != Id;
                    //});
                    eventBasicData.formData.FormDataToOneListDynamic.push(oneToManyNewRow);

                    CalendarEventList.push(calenderNewRow);
                    ActivityEventList.push(activityNewRow);


                    //angular.forEach(CalendarEventList, function (dataRow, position) {

                    //    var rowRecord = dataRow;
                    //    var seperatedFormIDsParam = dataRow.customForms;
                    //    var seperatedIdsParam = dataRow.customFormIds != undefined ? dataRow.customFormIds : dataRow.customFormIds;
                    //    var seperatedTitleParam = dataRow.customTitle;
                    //    var commaIDs = seperatedIdsParam.split(',');
                    //    var commaVals = seperatedFormIDsParam.split(',');
                    //   // var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                    //    var ySelected = window["ySelected"];
                    //    angular.forEach(commaVals, function (idVal, pos) {
                    //        //console.log(commaVals + "," + commaIDs[pos].toString())
                    //        if (idVal == ySelected.toString()) {
                    //            dataRow.resFormID = idVal;
                    //            dataRow.resources = commaIDs[pos];
                    //            dataRow.resourceId = commaIDs[pos];
                    //            dataRow.title = "";
                    //        }

                    //    })



                    //});

                    //angular.forEach(ActivityEventList, function (dataRow, position) {

                    //    var rowRecord = dataRow;
                    //    var seperatedFormIDsParam = dataRow.seperatedFormIDs;
                    //    var seperatedIdsParam = "";
                    //    if (dataRow.seperatedIds == undefined)
                    //        seperatedIdsParam = dataRow.seperatedIDs;
                    //    else
                    //        seperatedIdsParam = dataRow.seperatedIds;

                    //    var commaIDs = seperatedIdsParam.split(',');
                    //    var seperatedTitleParam = dataRow.seperatedTitles;
                    //    var commaVals = seperatedFormIDsParam.split(',');
                    //    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                    //    var ySelected = window["ySelected"];
                    //    angular.forEach(commaVals, function (idVal, pos) {
                    //        //console.log(commaVals + "," + commaIDs[pos].toString())
                    //        if (idVal == ySelected.toString()) {
                    //            dataRow.resFormID = idVal;
                    //            dataRow.resources = commaIDs[pos];
                    //            dataRow.resourceId = commaIDs[pos];
                    //            dataRow.title = "";
                    //        }

                    //    })



                    //});


                    window["CalendarEventList"] = CalendarEventList;
                    window["ActivityEventList"] = ActivityEventList;
                    //console.log('after  insertion ');
                    //console.log(CalendarEventList);
                    // $('.calendar').fullCalendar('destroy');


                    console.log('hi6')
                    //loadCalendar('BasicView', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, ActivityEventList);
                    refreshEventResourcesActivity('BasicView', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, ActivityEventList);
                    //$('#basic-view div.calendar').fullCalendar('refetchEvents');


                    //eventBasicData.formGroupKey = create_UUID();
                    window["EventBasicDetail"] = eventBasicData;





                    $.jGrowl(response.Message, { position: 'center' });


                    var _ScrollOffset = window["scrollOffset"];
                    window.scrollTo(0, _ScrollOffset);

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
                        //var  filteredItems = CalendarEventList.filter((item) => item.Id !== response.Id);

                        //console.log('ffffff');
                        //console.log(CalenderEditableRow);

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



                        angular.forEach(filteredEventsCalender, function (dataRow, position) {

                            var rowRecord = dataRow;
                            var seperatedFormIDsParam = dataRow.customForms;

                            var seperatedIdsParam = dataRow.customFormIds != undefined ? dataRow.customFormIds : dataRow.customFormIds;


                            var seperatedTitleParam = dataRow.customTitle;
                            var commaIDs = seperatedIdsParam.split(',');
                            var commaVals = seperatedFormIDsParam.split(',');
                            //var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                            var ySelected = window["ySelected"];
                            angular.forEach(commaVals, function (idVal, pos) {
                                //console.log(commaVals + "," + commaIDs[pos].toString())
                                if (idVal.trim() == ySelected.toString()) {
                                    dataRow.resFormID = idVal;
                                    dataRow.resources = commaIDs[pos];
                                    dataRow.resourceId = commaIDs[pos];
                                    //dataRow.title = "";
                                }

                            })



                        });

                        //angular.forEach(filteredEventsActivity, function (dataRow, position) {

                        //    var rowRecord = dataRow;
                        //    var seperatedFormIDsParam = dataRow.customForms;
                        //    //var seperatedIdsParam = dataRow.seperatedIds;
                        //    var seperatedIdsParam = "";
                        //    if (dataRow.customFormIds == undefined)
                        //        seperatedIdsParam = dataRow.customFormIds;
                        //    else
                        //        seperatedIdsParam = dataRow.customFormIds;
                        //    var seperatedTitleParam = dataRow.customTitle;
                        //    var commaIDs = seperatedIdsParam.split(',');
                        //    var commaVals = seperatedFormIDsParam.split(',');
                        //    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                        //    var ySelected = window["ySelected"];
                        //    angular.forEach(commaVals, function (idVal, pos) {
                        //        //console.log(commaVals + "," + commaIDs[pos].toString())
                        //        if (idVal.trim()  == ySelected.toString()) {
                        //            dataRow.resFormID = idVal;
                        //            dataRow.resources = commaIDs[pos];
                        //            dataRow.resourceId = commaIDs[pos];
                        //            dataRow.title = "";
                        //        }

                        //    })



                        //});

                        //angular.forEach(filteredoneToManyList, function (dataRow, position) {

                        //    var rowRecord = dataRow;
                        //    var seperatedFormIDsParam = dataRow.customForms;

                        //    var seperatedIdsParam = dataRow.customFormIds != undefined ? dataRow.customFormIds : dataRow.customFormIds;


                        //    var seperatedTitleParam = dataRow.customTitle;
                        //    var commaIDs = seperatedIdsParam.split(',');
                        //    var commaVals = seperatedFormIDsParam.split(',');
                        //    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                        //    var ySelected = window["ySelected"];
                        //    angular.forEach(commaVals, function (idVal, pos) {
                        //        //console.log(commaVals + "," + commaIDs[pos].toString())
                        //        if (idVal.trim()  == ySelected.toString()) {
                        //            dataRow.resFormID = idVal;
                        //            dataRow.resources = commaIDs[pos];
                        //            dataRow.resourceId = commaIDs[pos];
                        //            dataRow.title = "";
                        //        }

                        //    })



                        //});


                        window["CalendarEventList"] = filteredEventsCalender;
                        window["ActivityEventList"] = filteredEventsActivity;
                        console.log('hi7')
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
                }
                else {


                    var _ScrollOffset = window["scrollOffset"];
                    window.scrollTo(0, _ScrollOffset);
                    swal({ type: 'error', title: '', text: "failed" });
                }
            },
            complete: function () {


                var _ScrollOffset = window["scrollOffset"];
                window.scrollTo(0, _ScrollOffset);
                $.unblockUI();

            }
        });



        //}
        //else {

        //    swal({ type: 'error', title: '', text: "drop limit exceeded" });
        //}






        ////console.log('velcome');
        ////console.log(eventData);
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

            ////console.log(resource)
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

            var current_subtab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').find('.ui-state-active').attr('class');
            var allDayCustom = "false";
            if (current_subtab) {
                allDayCustom = (current_subtab.contains('fc-timelineMonth-button') || current_subtab.contains('fc-timelineYear-button')).toString();
            }

            var eventExtData = $(this).data('event');
            //console.log('external event data :');
            //console.log(eventExtData);
            var resource = $("#" + current_tab + " .calendar").fullCalendar('getResourceById', resourceId);
            var title = eventExtData.title ? eventExtData.title : '';
            var id = eventExtData.id ? eventExtData.id : '';
            var resFormIdParam = window["ySelected"];
            var actFormIdParam = window["xSelected"];
            var resourceColumn = window["currResColumn"];
            var majorColumn = window["currMajorColumn"];
            //var minorColumn = eventExtData.minorGroup;
            var resourceValue = '', activityValue = title;
            //var majorValueParam = "";
            //var minorValueParam = eventExtData.minorgroup;
            var titleColActivity = eventExtData.activityfield;
            var titleColCategory = eventExtData.categoryfield;
            var titleColColor = eventExtData.colorfield;
            var dropin = eventExtData.dropin;
            var groupingfieldsresParam = eventExtData.groupingfieldsres;
            var dropinTitle = ""; var isAllowService = false;
            if (groupingfieldsresParam !== undefined && groupingfieldsresParam.length > 0) {
                groupingfieldsresParam = groupingfieldsresParam.split('-');
                angular.forEach(groupingfieldsresParam, function (value, key) {
                    if (dropinTitle === "") {
                        dropinTitle = resource[value.trim()];
                    }
                    else
                        dropinTitle += " - " + resource[value.trim()];
                });


            }



            var colActivityValue = ""; var colCategoryValue = ""; var colColorValue = "";

            if (typeof resource[resourceColumn] != 'undefined') {
                resourceValue = resource[resourceColumn];
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

            //if (typeof resource[majorColumn] != 'undefined') {
            //    majorValueParam = resource[majorColumn];
            //}


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
                //currentDate = new Date(custom_date);
                //customdate = moment(currentDate).format('MMMM D YYYY, dddd'); 
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
            // eventData.title += ' in ' + resourceValue;
            if ($('#allDay-check').is(':checked')) {
                allDayCustom = "true";
                startCustom = date.format("YYYY-MM-DD");
                startCustom = moment(startCustom + " 00:00:00 ");
                endCustom = date.format("YYYY-MM-DD");
                let initialdate = endCustom;
                let start_time = '23:59:59';
                endCustom = moment(initialdate + " " + start_time); 
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
            var checkExists = window["CalendarEventList"];
            var exists = _.filter(checkExists, function (item) {
                return compareEventStartEndDateTime(eventData, item) && (item.resourceId == eventData.resourceId ||
                    item.resources == eventData.resourceId);
                //return eventData.start == item.start && eventData.end == item.end && item.resourceId == eventData.resourceId;
            });

            //var exists = _.filter(checkExists, function (item) {
            //    //console.log(item.start);
            //    //console.log(item.end);
            //    var isBool = false;
            //    if (eventData.start == item.start && eventData.start == item.end) {
            //        if (!DataService.isEmpty(temp.customForms)) {
            //            var temp = angular.copy(item);                       
            //            temp.customFormIds = temp.customFormIds.contains(',') ? temp.customFormIds.split(',') : temp.customFormIds;
            //            temp.customForms = temp.customForms.contains(',') ? temp.customForms.split(',') : temp.customForms;
            //            temp.customTitle = temp.customTitle.contains(',') ? temp.customTitle.split(',') : temp.customTitle;
            //            var formIdIndex = -1;
            //            _.each(temp.customForms, function (item, key) {
            //                if (item.toString().trim() == eventData.actFormID.toString()) {
            //                    formIdIndex = key;
            //                }
            //            });
            //            if (formIdIndex != -1) {
            //                if (temp.customFormIds[formIdIndex] == eventData.id.toString().trim()) {
            //                    isBool = true;
            //                } else {
            //                    temp.customFormIds[formIdIndex] = eventData.actFormID.toString().trim();
            //                    temp.customTitle.push(eventData.activities.toString().trim());
            //                }

            //                temp.customFormIds = temp.customFormIds.join();
            //                temp.customTitle = temp.customTitle.join();
            //                temp.customForms = temp.customForms.join();
            //                var idx = _.findIndex(CalendarEventList, { formGroupKey: param.formGroupKey });
            //                CalendarEventList[idx] = temp;
            //            }
            //        }
            //    }
            //return isBool;
            //});

            if (exists.length > 0) {
                exists = exists[0];
                eventData.formGroupKey = exists.formGroupKey;
                var seperatedIds = exists.customFormIds;
                var comma = seperatedIds.split(',');
                if (comma.length > 2) {
                    $("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
                    return false;
                }
                else {
                    var _droppedForms = exists.customForms;
                    var _arr0 = _droppedForms.split(',');
                    var _checkIfExists = true;
                    angular.forEach(_arr0, function (_row, _pos) {
                        if (_row.toString().trim() === actFormIdParam.toString()) {
                            _checkIfExists = false;
                            //break;
                        }

                    })
                    if (!_checkIfExists) {
                        var checkOverlapping = _.where($scopeVar.calenderSettingsFormDetailsDataList, { resourceActivityForm: actFormIdParam });
                        if (checkOverlapping.length > 0) {
                            var eventOverlapping = _.filter(checkOverlapping, function (item) {
                                return item.eventOverlap == "1" || item.activitiesOverlap == "1";
                            });
                            if (eventOverlapping.length > 0) {
                                eventData.formGroupKey = undefined;
                                generateEvent(eventData, eventExtData, date, end, resourceValue);
                            } else {
                                if (comma.length > 1 && !_checkIfExists) {
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
                            // eventData.title += ' in ' + resourceValue;
                        }
                        if (eventData.title !== '') {

                            addExternalEvent(eventData);
                        }
                    }
                   
                }
            } else {
                generateEvent(eventData, eventExtData, date, end, resourceValue);
            }






            
        }

    };


    function generateEvent(eventData, eventExtData, date, end, resourceValue)
    {
        var dropinTitle = ""; var isAllowService = false;
        //$("#" + current_tab + " .calendar").fullCalendar('refetchEvents');
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
                    // var postData = { formID: activitiesForm, mainField: activityField, activity: activityValue, categoryField: activitiesCategory, calendarForm: formID, eventData: eventData };

                    //console.log(postData);
                    $.post("api/FormAPI/getReferralFormFields", postData, function (response) {
                        //console.log('response is this ');
                        //console.log(response);


                        if (typeof response.overlapMesage !== 'undefined') {
                            //console.log(typeof response.success);
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
                                    //console.log(err);
                                }
                            }

                            //console.log(resolveCategory);
                            if (Object.keys(resolveCategory).length > 1) {
                                resolve(resolveCategory);
                            } else {
                                //swal.close();
                                ////console.log(response);
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
                                    ////console.log(result)
                                    if (result.value) {
                                        var service = $.trim(result.value[0]), description = $.trim(result.value[1]);

                                        //if (service !== '')
                                        //    eventData.title += ' (' + service + ') ';

                                        if (resourceValue !== '')
                                            // eventData.title += ' in ' + resourceValue;

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
                    ////console.log(result)
                    if (result.value) {
                        var service = $.trim(result.value[0]), description = $.trim(result.value[1]);

                        // eventData.title += ' (' + service + ') ';
                        if (eventData.resources !== '') {
                            // eventData.title += ' in ' + eventData.resources;
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
                // eventData.title += ' in ' + resourceValue;
            }
            if (eventData.title !== '') {

                addExternalEvent(eventData);
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
                text: window["yTitle"],
                click: function () {
                    // /#/form / records / 52515
                    // $scopeVar
                    localStorage.setItem("ToggleCalenderId", basicDetails.formId);
                    window.location.href = $scopeVar.BaseUrl + '#/form/records/' + window["ySelected"] + "?toggle=1";;
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
        resourceOrder: resourceOrder,
        resourceColumns: resColumns,
        resources: resourceData,
        allDaySlot: true,
        resourceRender: function (resourceObj, labelTds, bodyTds) {
            var cellText = '';
            //cellText = labelTds.find('.fc-cell-text').text();
            //labelTds.find('.fc-cell-text').html(cellText);

            for (i = 0; i < labelTds.length; i++) {
                ////console.log($(labelTds[i]));
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

    myOptions = {
        //defaultDate: '2017-12-07',
        scrollTime: '00:00', // undo default 6am scrollTime    

        header: {
            left: 'myCustomButton prev,next today',
            center: 'title',
            right: 'agendaDay,agendaTwoDays,agendaThreeDays,agendaWeek'
        },
        customButtons: {
            myCustomButton: {
                text: window["yTitle"],
                click: function () {
                    // window.location.href = "{{ URL::to('records/'.$formDetails->resourceForm) }}";
                    localStorage.setItem("ToggleCalenderId", basicDetails.formId);
                    window.location.href = $scopeVar.BaseUrl + '#/form/records/' + window["ySelected"] + "?toggle=1";;
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
        allDaySlot: true,

        //resources: {
        //    url: "{{ URL::to('calendar/getResources/resources/'.$formDetails->formID) }}",
        //    dataType: 'json'
        //},
    };
    calendarOptions = $.extend({}, defaultOptions, resourceOptions, myOptions);

    $('#vertical-resource-view div.calendar').fullCalendar(calendarOptions);


    // Vertical Activities View
    activityEvents = changeResourceIDByXSelection(activityEvents)

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
                    //  window.location.href = "{{ URL::to('records/'.$formDetails->activitiesForm) }}";
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
        allDaySlot: true,
        //resources: {
        //    url: "{{ URL::to('calendar/getResources/activities/'.$formDetails->formID) }}",
        //    dataType: 'json'
        //},



    };
    calendarOptions = $.extend({}, defaultOptions, myOptions);
    $('#vertical-activities-view div.calendar').fullCalendar(calendarOptions);

    setTimeout(function () {
        $.unblockUI();



        //$(document).click(function (event) {
        //    var $target = $(event.target);
        //    if (!$target.closest('.isPopoverLoaded').length &&
        //        !$target.is(".isPopoverLoaded")) {
        //        $("body .popover").addClass('isPopoverLoaded');
        //        $("body .popover").popover('hide');
        //    }
        //});


    }, 500);
    //var $rootScope = angular.element($("#calendar")).scope();
    //if ($rootScope != undefined)
    //    $rootScope.$emit("HideLoading");

    // $.unblockUI();


}
function replaceColumn(namecol) {
    var col = namecol;
    if (col != "") {
        if (col == "end") {
            // if ($scope.isCreateNew)
            // col = "[" + col + "]";
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
                // //console.log('calender is : ' + data[0].isCalendar);
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
        //console.log('unable to check calender control');
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
    //console.log(param,'sona')
    //return false;
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
            //console.log(data);
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
                //console.log(value); //console.log(key);
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


                //console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjj');
                //console.log(value);
                //console.log(key);
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
                //tempRow[keyRow]["columns_width"] += (100 / parseInt(columnValue)) + ","; 
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
    //_.each(tempRow, function (item, key) {
    //    var temp = {};
    //    temp[key] = item;
    //    tempArray.push(temp);
    //});  
    //console.log(tempArray)
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
            //rows[customKey]["columns_width"] = "";
            _.each(rows[customKey].children, function (item, itemkey) {
                // rows[customKey]["columns_width"] += (100 / parseInt(rows[customKey].children.length)) + ",";
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
    // var formIdString = $('#hdnfValidatedforms').val();
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
    //console.log(win_size[0]['screen'], 'screen');
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





