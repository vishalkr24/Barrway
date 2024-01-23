var tabulator = [];
var tabulator2 = [];

$(document).ready(function () {
    showNavbarNavigation('companyUsersMegaMenu');
    setCalendarMaster();
})

function AssignSuperUser(Id) {
    var data = tabulator.getData().filter(x => x.Id == Id)[0];
    if (confirm("Are you sure to Assign " + data.USER_ID + " as Super User of " + data.BUSINESS_CODE + " Business? \n\n You will become Admin of " + data.BUSINESS_CODE + " and won't be able to update admins anymore!")) {
        let newSuperUserId = data.ASSIGNED_USER;
        let oldSuperUserId = tabulator.getData().filter(x => x.BUSINESS_CODE == data.BUSINESS_CODE && x.ROLE_TYPE == 'SUPERUSER')[0].ASSIGNED_USER;
        let businessId = data.BUSINESS_ACCOUNT_ID;
        $.ajax({
            url: "/BusinessAdmin/UpdateAdmin",
            type: "POST",
            data: {
                NewSuperUserId: newSuperUserId,
                OldSuperUserId: oldSuperUserId,
                BusinessId: businessId
            },
            success: function (response) {
                if (response.Status) {
                    if (confirm("User assigned as super user successfully!")) {
                        Logout();
                    } else {
                        Logout();
                    }
                } else {
                    alert("User not assigned as super user.");
                }

            },
            error: function (err) {

            }
        })
    } else {
        // Bach gye
    }
}

function ShowAssignModal(Id) {
    $("#update-permit-btn").attr("onclick", `UpdatePermissions(${Id})`);
    $("#AssignDetailsModal").modal("show");
}

$(document).on("click", "input[name=assign-module-radio]", function () {
    let selectedModule = $(this).attr("id").split('-')[1];
    if (selectedModule == "company") {
        $("#company-selector-section").show();
    } else {
        $("#company-selector-section").hide();
    }
});

function sendInvitation() {
    var email = $("#invite-input").val();
    
    if (!validateEmail(email)) {
        swal({
            icon: "warning",
            title: "Invalid Email",
            text: "Please enter a valid registered email address ONLY."
        });
    } else {
        $.ajax({
            url: "/BusinessAdmin/SendEmailInvite",
            type: "POST",
            data: {
                Email: email,
                BusinessId: localStorage.getItem("COMPANY_ID")
            },
            success: function (response) {
                if (response.Status) {
                    swal({
                        icon: "success",
                        title: "Invite Sent",
                        text: "Invitation for admin is sent successfully to " + email
                    }).then(function (check) {
                        $("#invite-input").val("");
                        $("#EmailError").hide();
                    })
                } else {
                    swal({
                        icon: "error",
                        title: "Invite Not Send",
                        text: response.Message
                    });
                }
            },
            error: function (err) {

            }
        })
    }

}

$(document).on("keyup", "#invite-input", function () {
    if (!validateEmail($(this).val())) {
        $("#EmailError").show()
    } else {
        $("#EmailError").hide()
    }
})


const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

function UpdatePermissions(Id) {
    if (confirm("Are you sure you want to assign this user as Super User of this company?")) {
        var finalData = {
            ASSIGN_ID: Id,
            COMPANY_ID: localStorage.getItem('COMPANY_ID')
        };

        if (finalData != null) {

            $.ajax({
                url: "/BusinessAdmin/UpdateAssignedCompany",
                type: "POST",
                data: {
                    data: finalData
                },
                success: function (success) {

                    swal({
                        icon: "success",
                        title: "Success",
                        text: "Permissions Updated Successfully!"
                    }).then(function (check) {
                        window.location.href = '/BusinessAdmin/Dashboard';
                    });
                },
                error: function (err) {

                }
            })

        }
    }

}

function DeleteAdmin(Id) {
    var data = tabulator.getData().filter(x => x.Id == Id)[0];
    if (confirm("Are you sure to Delete " + data.USER_ID + " as Admin from " + data.BUSINESS_CODE + " Business?")) {

        $.ajax({
            url: "/BusinessAdmin/DeleteAdmin",
            type: "POST",
            data: {
                Id: Id
            },
            success: function (response) {
                if (response.Status) {
                    if (confirm("User removed as admin successfully!")) {
                        setCalendarMaster();
                    } else {
                        setCalendarMaster();
                    }
                } else {
                    alert("User not removed as admin.\n\n" + response.Message);
                }

            },
            error: function (err) {

            }
        })
    } else {
        // Bach gye
    }
}

function groupAdminRecords(groupBy) {
    setCalendarMaster(groupBy)
}

function openInviteModal() {
    $("#invite-input").val("");
    $("#InviteUserModal").modal("show");
}

function setCalendarMaster(groupBy = "ROLE_TYPE") {
    //var data = GetCompanyCalendars(localStorage.getItem("COMPANY_ID"), "", "");
    //console.log(data);

    var CalendarMasterList = function (groupBy) {
        var columns = [
            {
                title: '', field: 'ACTION', formatter: function (cell, formatter) {
                    if (cell.getData().ROLE_TYPE == "ADMIN") {
                        return `<button onclick="ShowAssignModal(${cell.getData().Id})" class="btn btn-primary text-light">Edit</button>
                                <button onclick="DeleteAdmin(${cell.getData().Id})" class="btn btn-danger text-light"><i class="fa fa-trash-o" style="font-size: larger;" aria-hidden="true"></i></button>`;
                    } else {
                        return ``;
                    }

                }, headerSort: false
            },
            { title: 'Company Name', field: 'COMPANY_NAME_ENGLISH', headerFilter: "input" },
            { title: 'User Id', field: 'USER_ID', headerFilter: "input" },
            { title: 'NickName', field: 'NICK_NAME', headerFilter: "input" },
            { title: 'Email Id', field: 'USER_EMAIL', headerFilter: "input" },
            {
                title: 'Role', field: 'ROLE_TYPE', headerFilter: "input", formatter: function (cell, formatter) {
                    if (cell.getData().ROLE_TYPE == 'SUPERUSER') {
                        return `<label style="background:crimson; border-radius:3px; color:white; font-size: smaller; padding:4px 10px; ">Super User</label>`;
                    } else {
                        return `<label style="background:lightgrey; border-radius:3px; font-size: smaller; padding:4px 10px; ">Admin</label>`;
                    }
                }
            },
            {
                title: 'Created Date', field: 'created_at', headerFilter: "input", formatter: function (cell, formatter) {
                    return moment(cell.getData().created_at).format("DD-MM-YYYY HH:mm:ss")
                }
            }
        ];

        setTimeout(function () {
            var options = {
                placeholder: "No Data.",
                tooltips: function (cell) {
                    return cell.getValue();
                },
                groupBy: groupBy,
                groupStartOpen: true,
                groupHeader: function (value, count, data, group) {
                    //value - the value all members of this group share
                    //count - the number of rows in this group
                    //data - an array of all the row data objects in this group
                    //group - the group component for the group

                    return value + "<span style='color:#d00; margin-left:10px;'>(" + count + " item)</span>";
                },
                height: "530px",
                layout: "fitDataFill",
                responsiveLayout: false,
                initialSort: [
                    { column: "ROLE_TYPE", dir: "desc" }
                ],
                persistenceID: "persisrecords",
                persistenceMode: true,
                persistentLayout: true,
                persistence: {
                    sort: false, //persist column sorting
                    filter: false, //persist filter sorting
                    columns: false, //persist columns
                },
                persistenceWriterFunc: function (id, type, data) {
                    localStorage.setItem(id + "-" + type, JSON.stringify(data));
                },
                persistenceReaderFunc: function (id, type) {
                    //id - tables persistence id
                    //type - type of data being persisted ("sort", "filter", "group", "page" or "columns")
                    var data = localStorage.getItem(id + "-" + type);
                    var dataParse = JSON.parse(data);
                    if (!DataService.isEmpty(data) && type == "columns") {
                        _.each(headers, function (item) {
                            var exists = _.findWhere(dataParse, {
                                field: item.field
                            });
                            if (!DataService.isEmpty(exists)) {
                                exists.visible = item.visible;
                            }
                        })
                    }
                    else if (type == "page") {
                        if (!DataService.isEmpty(data) && $scope.paginationSizeFormRecords != 0)
                            dataParse.paginationSize = $scope.paginationSizeFormRecords;
                    }
                    return data ? dataParse : false;
                },
                columns: columns,
                footerElement: "<div style='text-align:left' id='no-of-forms'></div>",
                dataLoaded: function (data) {
                    //data - all data loaded into the table                        
                    var count = 0;
                    if (data.length > 0)
                        count = data[0].total_records;
                    $('#form-records .tabulator-footer #no-of-forms').text("Total: " + count + " Entries");
                },
                /// pagination: "local",              
                ajaxFiltering: true,
                ajaxSorting: true,
                ajaxLoader: true,
                ajaxURL: "/BusinessAdmin/GetAllBusinessAssignedUsers/",
                ajaxConfig: "POST", //ajax HTTP request type
                ajaxContentType: "json",
                ajaxParams: { //ajax parameters
                    CompanyId: localStorage.getItem("COMPANY_ID")
                },
                ajaxProgressiveLoad: "scroll",
                ajaxProgressiveLoadScrollMargin: 75,
                ajaxRequesting: function (url, params) {

                    var called = true;
                    if (params.sorters.length == 0) {
                        params.sorters.push({ field: "created_at", dir: "desc" });
                    }
                    //if (called)
                    //$('#form-records').block({ message: '<h4>Getting Form Records...</h4>' });
                    return called; //abort ajax request
                },
                ajaxResponse: function (url, params, response) {
                    //url - the URL of the request
                    //params - the parameters passed with the request
                    //response - the JSON object returned in the body of the response.
                    //$('#form-records').unblock();
                    //$.unblockUI();
                    if (response.data) {
                        return response;
                    }
                    else {
                        return response;
                    }

                },
                paginationSize: 50,

            };
            tabulator = initTabulator('form-records', options);
            $('.form-builder-loader').hide();
        }, 150);

    };

    CalendarMasterList(groupBy);

}

function setInvitationHistoryMaster() {
    //var data = GetCompanyCalendars(localStorage.getItem("COMPANY_ID"), "", "");
    //console.log(data);
    $("#InvitationHistoryModal").modal("show");
    var InvitationHistoryMasterList = function () {
        var columns = [
            {
                title: 'Date', field: 'created_at', formatter: function (cell, formatter) {
                    return moment(cell.getData().created_at).format("DD-MM-YYYY")
                }
            },
            {
                title: 'Status', field: 'STATUS', formatter: function (cell, formatter) {
                    var status = cell.getData().STATUS.toUpperCase();
                    return `<span style="background:${(status == "ACCEPT") ? "Green" : (status == "REJECT") ? "crimson" : "grey"}; color:white; text-transform: capitalize; border-radius: 3px; padding: 4px 8px; font-size: smaller;">${status.toLowerCase()}</span>`;
                }
            },
            { title: 'Sent To', field: 'INVITED_EMAIL' },

            { title: 'Sent By', field: 'USER_EMAIL' },
            { title: 'Business Code', field: 'BUSINESS_CODE' }
        ];

        setTimeout(function () {
            var options = {
                placeholder: "No Data.",
                tooltips: function (cell) {
                    return cell.getValue();
                },
                height: "530px",
                layout: "fitDataFill",
                responsiveLayout: false,
                initialSort: [
                    { column: "created_at", dir: "desc" }
                ],
                persistenceID: "persisrecords",
                persistenceMode: true,
                persistentLayout: true,
                persistence: {
                    sort: false, //persist column sorting
                    filter: false, //persist filter sorting
                    columns: false, //persist columns
                },
                persistenceWriterFunc: function (id, type, data) {
                    localStorage.setItem(id + "-" + type, JSON.stringify(data));
                },
                persistenceReaderFunc: function (id, type) {
                    //id - tables persistence id
                    //type - type of data being persisted ("sort", "filter", "group", "page" or "columns")
                    var data = localStorage.getItem(id + "-" + type);
                    var dataParse = JSON.parse(data);
                    if (!DataService.isEmpty(data) && type == "columns") {
                        _.each(headers, function (item) {
                            var exists = _.findWhere(dataParse, {
                                field: item.field
                            });
                            if (!DataService.isEmpty(exists)) {
                                exists.visible = item.visible;
                            }
                        })
                    }
                    else if (type == "page") {
                        if (!DataService.isEmpty(data) && $scope.paginationSizeFormRecords != 0)
                            dataParse.paginationSize = $scope.paginationSizeFormRecords;
                    }
                    return data ? dataParse : false;
                },
                columns: columns,
                footerElement: "<div style='text-align:left' id='no-of-forms'></div>",
                dataLoaded: function (data) {
                    //data - all data loaded into the table                        
                    var count = 0;
                    if (data.length > 0)
                        count = data[0].total_records;
                    $('#form-records-2 .tabulator-footer #no-of-forms').text("Total: " + count + " Entries");
                },
                /// pagination: "local",              
                ajaxFiltering: true,
                ajaxSorting: true,
                ajaxLoader: true,
                ajaxURL: "/BusinessAdmin/GetAllRecentInvites/",
                ajaxConfig: "POST", //ajax HTTP request type
                ajaxContentType: "json",
                ajaxParams: { //ajax parameters

                },
                ajaxProgressiveLoad: "scroll",
                ajaxProgressiveLoadScrollMargin: 75,
                ajaxRequesting: function (url, params) {

                    var called = true;
                    if (params.sorters.length == 0) {
                        params.sorters.push({ field: "created_at", dir: "desc" });
                    }
                    //if (called)
                    //$('#form-records').block({ message: '<h4>Getting Form Records...</h4>' });
                    return called; //abort ajax request
                },
                ajaxResponse: function (url, params, response) {
                    //url - the URL of the request
                    //params - the parameters passed with the request
                    //response - the JSON object returned in the body of the response.
                    //$('#form-records').unblock();
                    //$.unblockUI();
                    if (response.data) {
                        return response;
                    }
                    else {
                        return response;
                    }

                },
                paginationSize: 50,

            };
            tabulator2 = initTabulator('form-records-2', options);
            $('.form-builder-loader-2').hide();
        }, 150);

    };

    InvitationHistoryMasterList();

}

function initTabulator(elementID, options) {
    if (!elementID) {
        alert("Tabulator element is not set.");
    }

    var basicConfig = {
        height: "60%",
        layout: 'fitDataFill',
        placeholder: "No record found.",
        movableColumns: true,
        tooltips: true,
        tooltipsHeader: true,
        responsiveLayout: false,
        persistenceMode: "local",
        persistentLayout: true,
        persistentSort: true, //Enable sort persistence
        persistentFilter: false, //Enable filter persistence
        groupStartOpen: false,
        groupToggleElement: "header",
        paginationSize: 50,
        ajaxLoader: false,
        ajaxProgressiveLoadScrollMargin: 300, //triger next ajax load when scroll bar is 300px or less from the bottom of the table.
        ajaxRequesting: function (url, params) {
            //url - the URL of the request
            //params - the parameters passed with the request
            showTextLoader('#' + elementID, 'Loading Data');
        },
        ajaxResponse: function (url, params, response) {
            //url - the URL of the request
            //params - the parameters passed with the request
            //response - the JSON object returned in the body of the response.
            $('#' + elementID).unblock();
            return response; //return the response data to tabulator
        },
        ajaxError: function (xhr, textStatus, errorThrown) {
            //xhr - the XHR object
            //textStatus - error type
            //errorThrown - text portion of the HTTP status
            $('#' + elementID).unblock();
        }
    };

    var config = basicConfig;

    if (options !== '') {
        config = $.extend({}, basicConfig, options);
    }

    //$("#" + elementID).tabulator(config);
    return new Tabulator("#" + elementID, config);
}