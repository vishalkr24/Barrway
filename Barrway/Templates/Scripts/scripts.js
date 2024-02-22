/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var themes = {
    dark: 'vader',
    lightgreen: 'south-street',
    lightblue: 'cupertino',
    darkblue: 'dot-luv'
};
$(document).ready(function(){    
    var defaultTheme = "base";

    if(checkCookie('change-theme'))
        defaultTheme = themes[getCookie('change-theme')];

    defaultTheme != undefined ? $('#jquery-ui-change').attr('href', 'https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css') : null;
    
    
    //if($('body').find('ol.breadcrumb').length === 0){
    //    $('nav.navbar').css('margin-top', '26px');
    //}
    
    //packery menu creation
    $(document).on('click','#redirectMenuPage',function(){
        var menuName= $('#menuName').text();
        var menuDescription= $('#menuDescription').text();
        var matches = menuName.match(/\b(\w)/g);
        var acronym = matches.join('');
        if(acronym.length==1){
            var short_name=menuName.substring(0, 3).toUpperCase();
        }else{
            var short_name=acronym.substring(0, 3).toUpperCase();
        }
        var urlpath = $('#getRedirectUrl').text();
        var csrf_token = $('#csrf_token').text();

        if(window.location.href.indexOf('groups') >0 || window.location.href.indexOf('user-forms') >0){
           var type="Group";
           var color="#f67a00";
        }else if(window.location.href.indexOf('chat') >0){
            var type="ChatRoom";
            var color="#00ffff";
        }else if(window.location.href.indexOf('user-forms') >0 || window.location.href.indexOf('savedata') >0 || window.location.href.indexOf('records') >0){
            var type="Form";
            var color="#008000";
        }else if(window.location.href.indexOf('users') >0){
            var type="Contact";
            var color="#a90600";
        }else if(window.location.href.indexOf('application') >0){
            var type="Application";
            var color="#ffff00";
        }else if(window.location.href.indexOf('settings') >0){
            var type="Settings";
            var color="#ffa07a";
        }else if(window.location.href.indexOf('summary') >0){
            var type="Summary";
            var color="#E5CCFF";
        }else if(window.location.href.indexOf('queue') >0){
            var type="Queue";
            var color="#E5FFCC";
        }
        var menuLink,menuPath;
        var f = document.createElement("form");
        f.setAttribute('method',"post");
        f.setAttribute('id',"redirect_form");
        f.setAttribute('class',"hidden");
        f.setAttribute('action',urlpath);
        //for hidden token
        var a = document.createElement("input"); 
        a.setAttribute('type',"hidden");
        a.setAttribute('name',"_token");
        a.setAttribute('value',csrf_token);
        //for image link
        if((menuLink=document.getElementById('menuRedirectLink')) && (menuPath=document.getElementById('menuRedirectPath'))){
         var b = document.createElement("input"); 
            b.setAttribute('type',"text");
            b.setAttribute('name',"icon");
            b.setAttribute('value',menuLink.innerHTML);
            f.append(b); 
         var c = document.createElement("input"); 
            c.setAttribute('type',"text");
            c.setAttribute('name',"menuRedirectPath");
            c.setAttribute('value',menuPath.innerHTML);
            f.append(c); 
        }
        //for name
        var i = document.createElement("input"); 
        i.setAttribute('type',"text");
        i.setAttribute('name',"name");
        i.setAttribute('value',menuName);
        //for description
        var j = document.createElement("input");
        j.setAttribute('type',"textarea");
        j.setAttribute('name',"description");
        j.setAttribute('value',JSON.stringify('<p>'+menuDescription+'</p>'));
        //for short_name
        var k = document.createElement("input");
        k.setAttribute('type',"text");
        k.setAttribute('name',"short_name");
        k.setAttribute('value',short_name);
        //for type
        var l = document.createElement("input"); 
        l.setAttribute('type',"text");
        l.setAttribute('name',"type");
        l.setAttribute('value',type);
        //for link
        var m = document.createElement("input");
        m.setAttribute('type',"text");
        m.setAttribute('name',"link");
        m.setAttribute('value',window.location.href);
        //for original_size
        var n = document.createElement("input"); 
        n.setAttribute('type',"text");
        n.setAttribute('name',"original_size");
        n.setAttribute('value','1x1');
        //for expanded_size
        var o = document.createElement("input"); 
        o.setAttribute('type',"text");
        o.setAttribute('name',"expanded_size");
        o.setAttribute('value','3x3');
        //for color
        var p = document.createElement("input");
        p.setAttribute('type',"text");
        p.setAttribute('name',"color");
        p.setAttribute('value',color);

        var s = document.createElement("input"); 
        s.setAttribute('type',"submit");
        s.setAttribute('value',"Submit");

        f.appendChild(a);f.appendChild(i);f.appendChild(j);f.appendChild(k);f.appendChild(l);
        f.appendChild(m);f.appendChild(n);f.appendChild(o);f.appendChild(p);f.appendChild(s);
        document.body.appendChild(f);
        //console.log(f);
    //    alert();
        f.submit();
        return false;
    });
    
    $("body").on('click','#tabulatorConfig',function(){
        if($("input[name=tabulator]").length){
            var tabulator = $("input[name=tabulator]").val();
            var url = $('#globalTabulatorConfigModal .create-confg').attr('data-redirect');
            var href = url + '/' + tabulator;
            $('#globalTabulatorConfigModal .create-confg').attr('href', href);
            $('#globalTabulatorConfigModal').modal('show');

            var tabulatorStorage = $("input[name=tabulatorStorage]").val();
            $.ajax({
                type: "GET",
                url: BASE_URL + '/getAllConfigurations/tabulator-' + tabulatorStorage,
                dataType: 'json',
                success: function( data ) {
                    if(Object.keys(data).length > 0){
                        var ul = $("<ul>",{'class':'list-group'});
                        $.each(data, function(i, record){
                            var li = $("<li>",{'class':'list-group-item'});
                            var configUrl = BASE_URL + '/tabulator-configurator/' + record.Id + '/edit';

                            li.append(
                                record.configName,
                                '<a class="btn btn-sm btn-danger delete-configuration pull-right list2 " data-config-name="' + record.configName + '" data-config-id="' + record.Id + '"><i class="glyphicon glyphicon-trash"></i></a>', 
                                '<a class="btn btn-sm btn-primary pull-right list2" href="' + configUrl + '" style="margin-right: 10px;"><i class="glyphicon glyphicon-pencil"></i></a>',
                                '<a class="btn btn-sm btn-success show-configuration pull-right list2" data-config-name="' + record.configName + '" data-config-id="' + record.Id + '" style="margin-right: 10px;"><i class="glyphicon glyphicon-eye-open"></i></a>'
                            );

                            ul.append(li);
                        });
                        $(".tabulator-configuration-list").html(ul);
                    }else{
                        $(".tabulator-configuration-list").html('<div class="alert alert-info mt-10" role="alert"> No configuration created yet!</div>');
                    }
                },
                beforeSend: function() {
                    $(".tabulator-configuration-list").html('<div class="text-center"><i class="fa fa-spin fa-cog"></i> Loading...</div>');
                },
                complete: function() {

                }
            });
        }
    });
    
    $('body').on('click', '.delete-persistent', function(e){
        e.preventDefault();
        var tabulator = $("input[name=tabulatorStorage]").val();

        localStorage.removeItem('tabulator-' + tabulator);
        localStorage.removeItem('tabulator-' + tabulator + '1');
        localStorage.removeItem('tabulator-' + tabulator + '2');
        window.location.reload();
    });
    
    var tabulator = $("input[name=tabulator]").val();
    var itemName = tabulator + 'Actions';
    var responsiveText, responsive = localStorage.getItem(itemName);

    if(responsive === null){
        var actionObj = {};
        actionObj['actions'] = true;
        actionObj['responsive'] = false;
        responsiveText = '<i class="fa fa-toggle-off"></i> Responsive Off';
    }else{
        var actionObj = JSON.parse(responsive);
        actionObj['responsive'] = actionObj['responsive'] ? actionObj['responsive'] : false;
        responsive = actionObj['responsive'];
        responsiveText = (responsive) ? '<i class="fa fa-toggle-on"></i> Responsive On' : '<i class="fa fa-toggle-off"></i> Responsive Off';
    }
    localStorage.setItem(itemName, JSON.stringify(actionObj));
    
    var actions = localStorage.getItem(itemName);
    if (!actions){
        $('.rightbtn').append('<a href="javascript:;" class="pull-left show-page-actions ml-10" title="Show Page Actions"><i class="glyphicon glyphicon-chevron-down"></i></a>');
        $('.panel-body #pageActions, #form-records-page .table-controls').hide();
    } else{
        if (actionObj['icons']){
            $('#pageActions .hide-actions-text').click();
        }
        $('.rightbtn').append('<a href="javascript:;" class="pull-left hide-page-actions ml-10" title="Hide Page Actions"><i class="glyphicon glyphicon-chevron-up"></i></a>');
        $('.panel-body #pageActions, #form-records-page .table-controls').show();
    }
    
    $("#toggle_responsive").html(responsiveText);
    // change responsive layout
    $("#toggle_responsive").on("click", function () {
        var tabulator = $("input[name=tabulator]").val();
        var itemName = tabulator + 'Actions';
        var actionObj = JSON.parse(localStorage.getItem(itemName));
        actionObj['responsive'] = actionObj['responsive'] ? false : true;
        localStorage.setItem(itemName, JSON.stringify(actionObj));    

        var responsiveText = (actionObj['responsive']) ? '<i class="fa fa-toggle-on"></i> Responsive On' : '<i class="fa fa-toggle-off"></i> Responsive Off';
        $("#toggle_responsive").html(responsiveText);
        $(".delete-persistent").click();
    });

    $('#pageActionModal').on('show.bs.modal', function (event) {
        var modal = $(this);
        if($('body #pageActions').length){
            var pageActions = $('#pageActions').clone();
            pageActions.find('.col-md-4, .col-lg-4, .float_right_class').removeClass('col-md-5 col-md-4 col-lg-4 float_right_class');
            pageActions.find('i.glyphicon').remove();
            modal.find('.modal-body .page-actions-list').html(pageActions);
            modal.find('.modal-body #pageActions').show();

            var tabulator = $("input[name=tabulator]").val();

            var itemName = tabulator + 'Actions';
            var actionStorage = localStorage.getItem(itemName);
            if(actionStorage === null){
                var actions = false;
            }else{
                var actionObj = JSON.parse(actionStorage);
                var actions = actionObj['actions'];
            }

            var buttonText = (actions) ? '<i class="fa fa-eye-slash"></i> Hide Actions' : '<i class="fa fa-eye"></i> Show Actions';
            modal.find('.toggle-actions').html(buttonText);
        }else{
            modal.find('.modal-body').html('<div class="alert alert-info" role="alert"> No page actions!</div>');
        }
    });

    $(document).on('click', '.toggle-actions', function(e){
        e.preventDefault();
        var tabulator = $("input[name=tabulator]").val();

        var itemName = tabulator + 'Actions';
        var actions = localStorage.getItem(itemName);

        if(actions === null){
            var actionObj = {};
            actionObj['actions'] = true;
            actionObj['icons'] = false;
        }else{
            var actionObj = JSON.parse(actions);
            actionObj['actions'] = actionObj['actions'] === true ? false : true;
        }

        localStorage.setItem(itemName, JSON.stringify(actionObj));

        if(!actionObj['actions']){
            $('.panel-body #pageActions, #form-records-page .table-controls').hide();
        }else{
            $('.panel-body #pageActions, #form-records-page .table-controls').show();
        }
        var buttonText = (actionObj['actions']) ? '<i class="fa fa-eye-slash"></i> Hide Actions' : '<i class="fa fa-eye"></i> Show Actions';
        $(this).html(buttonText);

        $('#pageActionModal').modal('hide');
    });
    $("body").on('click', '.rightbtn .show-page-actions', function(){
        var $arrow = $(this);
        $('.panel-body #pageActions, #form-records-page .table-controls').slideToggle('fast','linear',function(){
            $arrow.attr('title', 'Hide Page Actions');
            $arrow.removeClass('show-page-actions').addClass('hide-page-actions');
            $arrow.find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');

            var tabulator = $("input[name=tabulator]").val();

            var itemName = tabulator + 'Actions';
            var actions = localStorage.getItem(itemName);

            if(actions === null){
                var actionObj = {};
                actionObj['actions'] = true;
                actionObj['icons'] = false;
            }else{
                var actionObj = JSON.parse(actions);
                actionObj['actions'] = true;
            }

            localStorage.setItem(itemName, JSON.stringify(actionObj));
        });
    });
    $("body").on('click', '.rightbtn .hide-page-actions', function(){
        var $arrow = $(this);
        $('.panel-body #pageActions, #form-records-page .table-controls').slideToggle('fast','linear',function(){
            $arrow.attr('title', 'Show Page Actions');
            $arrow.addClass('show-page-actions').removeClass('hide-page-actions');
            $arrow.find('i').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-up');

            var tabulator = $("input[name=tabulator]").val();

            var itemName = tabulator + 'Actions';
            var actions = localStorage.getItem(itemName);

            if(actions === null){
                var actionObj = {};
                actionObj['actions'] = false;
                actionObj['icons'] = false;
            }else{
                var actionObj = JSON.parse(actions);
                actionObj['actions'] = false;
            }

            localStorage.setItem(itemName, JSON.stringify(actionObj));
        });
    });
    $("body").on('click', '#pageActions .hide-actions-text', function(){
        var tabulator = $("input[name=tabulator]").val();    
        var itemName = tabulator + 'Actions';
        var actions = localStorage.getItem(itemName);

        if ($('#pageActions').find('[data-title]').length) {
            // Show text with icons
            $('#pageActions a.btn, #pageActions button[type=submit], #rearrange_btn a.btn, .table-controls > a.btn').each(function () {
                if ($(this).find('i').length) {
                    var $i = $(this).find('i').detach();
                    var txt = $.trim($(this).attr('data-title'));
                    $(this).empty().append(
                            $i,
                            '&nbsp;',
                            txt
                            ).removeAttr('data-title');
                }
            });
            $('#pageActions button[name=group-rows]').each(function () {
                var $show = $(this).find('.show-rating'), $hide = $(this).find('.hide-rating');

                var $i1 = $show.find('i').detach(), txt1 = $.trim($show.attr('title'));
                var $i2 = $hide.find('i').detach(), txt2 = $.trim($hide.attr('title'));

                $show.empty().append(
                            $i1,
                            '&nbsp;',
                            txt1
                            ).removeAttr('title');
                $hide.empty().append(
                            $i2,
                            '&nbsp;',
                            txt2
                            ).removeAttr('title');

                $(this).removeAttr('data-title');
            });
            // For dropdown buttons
            $('#pageActions button.dropdown-toggle').each(function () {            
                var $i = $(this).find('i').detach(), txt = $.trim($(this).attr('title'));

                $(this).empty().append(
                            $i,
                            '&nbsp;',
                            txt,
                            '&nbsp;',
                            '<span class="caret"></span>'
                            ).removeAttr('data-title');
                $(this).removeAttr('title');
            });
            $(this).find('.glyphicon').removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-left');

            if(actions === null){
                var actionObj = {};
                actionObj['actions'] = true;
                actionObj['icons'] = false;
            }else{
                var actionObj = JSON.parse(actions);
                actionObj['icons'] = false;
            }
        } else {
            /* Hide Text to show icons only */
            // For simple buttons
            $('#pageActions a.btn, #pageActions button[type=submit], #rearrange_btn a.btn, .table-controls > a.btn').each(function () {
                if ($(this).find('i').length) {
                    var $i = $(this).find('i').detach();
                    var txt = $.trim($(this).text());
                    $(this).attr({'title': txt, 'data-title': txt});
                    $(this).empty().append($i);
                }
            });
            // For two icon buttons
            $('#pageActions button[name=group-rows]').each(function () {
                var $show = $(this).find('.show-rating'), $hide = $(this).find('.hide-rating');

                var $i1 = $show.find('i').detach(), txt1 = $.trim($show.text());
                var $i2 = $hide.find('i').detach(), txt2 = $.trim($hide.text());

                $show.attr({'title': txt1}); $show.empty().append($i1);
                $hide.attr({'title': txt2}); $hide.empty().append($i2);

                if ($(this).hasClass('col-hide')) {
                    $(this).attr({'data-title': txt2});
                }else{
                    $(this).attr({'data-title': txt1});
                }
            });
            // For dropdown buttons
            $('#pageActions button.dropdown-toggle').each(function () {            
                var $i = $(this).find('i').detach(), txt = $.trim($(this).text());

                $(this).attr({'title': txt, 'data-title': txt}); 
                $(this).empty().append($i);//$(this).append(' <span class="caret"></span>');
            });
            $(this).find('.glyphicon').removeClass('glyphicon-chevron-left').addClass('glyphicon-chevron-right');        

            if(actions === null){
                var actionObj = {};
                actionObj['actions'] = true;
                actionObj['icons'] = true;
            }else{
                var actionObj = JSON.parse(actions);
                actionObj['icons'] = true;
            }
        }
        localStorage.setItem(itemName, JSON.stringify(actionObj));
    });
});

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie(cname) {
    var value = getCookie(cname);
    return value;
}

function clearCookie(cname) {    
    document.cookie = cname + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';    
}

function getAllValidationMessages(messages) {
    var result = [];
    $.each(messages, function(field, errors) {
        if(errors.length > 1) {
            $.each(errors, function(field, error) {
                result.push(error);
            });
        } else {
            result.push(errors);
        }        
    });
    return result;
}

function sendChatFiberNotificaton(ajaxUrl, postData){
    $.ajax({
        type: "POST",
        url: ajaxUrl,
        data: postData,
        dataType: 'json',
        success: function( response ) {

        }
    });
}

// popup window options
function windowParams(){
    var windowHeight = window.screen.availHeight - 200, 
        windowWidth = window.screen.availWidth - 200;
    return 'scrollbars=yes,resizable=yes,status=no,directories=no,location=no,toolbar=no,menubar=no,width=' + windowWidth + ',height=' + windowHeight + ',left=100,top=100';
}

function initTabulator(elementID, options) {
    if (!elementID) {
        alert("Tabulator element is not set.");
    }

    var basicConfig = {
        height:"60%",
        layout: 'fitDataFill',    
        placeholder:"No record found.",
        movableColumns:true,
        tooltips: true,
        tooltipsHeader: true,
        responsiveLayout: false,
        persistenceMode:"local",
        persistentLayout:true,
        persistentSort:true, //Enable sort persistence
        persistentFilter:false, //Enable filter persistence
        groupStartOpen:false,
        groupToggleElement:"header",
        paginationSize: 50,
        ajaxLoader:false,
        ajaxProgressiveLoadScrollMargin: 300, //triger next ajax load when scroll bar is 300px or less from the bottom of the table.
        ajaxRequesting:function(url, params){
            //url - the URL of the request
            //params - the parameters passed with the request
            showTextLoader('#' + elementID, 'Loading Data');
        },
        ajaxResponse:function(url, params, response){
            //url - the URL of the request
            //params - the parameters passed with the request
            //response - the JSON object returned in the body of the response.
            $('#' + elementID).unblock();
            return response; //return the response data to tabulator
        },
        ajaxError:function(xhr, textStatus, errorThrown){
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

//excel data showing
function xlsxChange(file,url){
    var data={};   
    var dataOutput={};
    var ajax = $(this).attr('data-xlsxfield');
    var file = (file !== undefined) ? file : '';
    var url = (url !== undefined) ? url : '';

    if(file.length > 0){
        $('input.inputClass').each(function(){
            var value="";
            if($(this).attr('data-xlsxfield')!= "" && $(this).val()!= ""){
                if($.inArray($(this).attr('type'), ["checkbox","radio"]) >= 0){
                    value = $(this).prop('checked');
                }else{
                    value=$(this).val();
                }
                var field = (typeof $(this).attr('data-xlsxfield') !=='undefined') ? $(this).attr('data-xlsxfield').toUpperCase() : '';
                var worksheet = (typeof $(this).attr('data-worksheet') !=='undefined') ? $(this).attr('data-worksheet') : '';
                data[field+'_'+worksheet]=value;
            }
        });
        $('input.disabledOutput').each(function(){
            var value=$(this).val();
            var field=(typeof $(this).attr('data-xlsxfield') !=='undefined') ? $(this).attr('data-xlsxfield').toUpperCase() : '';
            var worksheet = (typeof $(this).attr('data-worksheet') !=='undefined') ? $(this).attr('data-worksheet') : '';
            dataOutput[field+'_'+worksheet]=value;
        });
        var style =  'background-image: url(' + ASSET_URL + 'assets/images/input-loader.gif);background-size: 18px 18px;background-position: right center;background-repeat: no-repeat;';
        //console.log(url);
        $.ajax({
            url:url,
            data:{"input":data,'output':dataOutput,'file':file},
            beforeSend: function(){
                $.each(dataOutput, function(key, value){
                    key = key.split('_')[0];
                    $('input.disabledOutput[data-xlsxfield="'+key+'"]').attr('style',style);
//                    $('input.disabledOutput[data-xlsxfield="'+key+'"]').parents('.borderSet').block({ message: null });
                });
            },
            success:function(e){
                e=JSON.parse(e);
                if(e.code==="1"){
                    var data=e.value;
                    for(name in data){
                        var show = name.split('_');
                        var attrName = $('input.disabledOutput[data-xlsxfield="'+show[0]+'"][data-worksheet="'+show[1]+'"]').attr('name');
                        $('input.disabledOutput[data-xlsxfield="'+show[0]+'"][data-worksheet="'+show[1]+'"]').val(data[name]);
                        $('input.disabledOutput[data-xlsxfield="'+show[0]+'"][data-worksheet="'+show[1]+'"]').parent().append("<input type='hidden' name='"+attrName+"' value='"+data[name]+"'/>");
                        $('input.disabledOutput[data-xlsxfield="'+show[0]+'"]').removeAttr('style');
//                        $('input.disabledOutput[data-xlsxfield="'+show[0]+'"]').parents('.borderSet').unblock();
//                            OLD CODES
//                            var attrName=$('input.disabledOutput.'+name).attr('name');
//                            $('input.disabledOutput.'+name).val(data[name]);
//                            $('input.disabledOutput.'+name).parent().append("<input type='hidden' name='"+attrName+"' value='"+data[name]+"'/>");

                    }
                }
            },
            error:function(error){
                $.each(dataOutput, function(key, value){
                    key = key.split('_')[0];
                    $('input.disabledOutput[data-xlsxfield="'+key+'"]').parents('.borderSet').unblock();
                });
            },
            complete: function(){ }
        });
    }
}

function deparam(querystring) {
    // remove any preceding url and split
    querystring = querystring.substring(querystring.indexOf('?') + 1).split('&');
    var params = {}, pair, d = decodeURIComponent;
    // march and parse
    for (var i = querystring.length - 1; i >= 0; i--) {
        pair = querystring[i].split('=');
        params[d(pair[0])] = d(pair[1] || '');
    }
    return params;
}

function extraDeparam(p) {
    var params = {};
    var pairs = p.split('&');
    for (var i=0; i<pairs.length; i++) {
        var pair = pairs[i].split('=');
        var indices = [];
        var name = decodeURIComponent(pair[0]),
            value = decodeURIComponent(pair[1]).replace(/\+/g,' ');

        var name = name.replace(/\[([^\]]*)\]/g, 
            function(k, idx) { indices.push(idx); return ""; });

        indices.unshift(name);
        var o = params;

        for (var j=0; j<indices.length-1; j++) {
            var idx = indices[j];
            var nextIdx = indices[j+1];
            if (!o[idx]) {
                if ((nextIdx == "") || (/^[0-9]+$/.test(nextIdx)))
                    o[idx] = [];
                else
                    o[idx] = {};
            }
            o = o[idx];
        }

        idx = indices[indices.length-1];
        if (idx == "") {
            o.push(value);
        }
        else {
            o[idx] = value;
        }
    }
    return params;
}

function checkForMultipleHeaders(headArray){
    var multiple = 0;
    if(headArray.length){
        headArray.forEach(function(head){
            var title = head.match(/{([^}]+)}/g);
            if(title)
                multiple++;
        });
    }
    return multiple;
}

function getSubHeading(head){
    var result = {};

    var s = "";
    if (head != undefined && head != null)
        s = head.trim(); // Position {Starting,Last}
    else
        s = "";
        //
        // get the main heading text
        var res = s.substring(0, s.indexOf('{'));
        if (res)
            result['heading'] = res.trim();
        else
            result['heading'] = s;

        var title = s.match(/{([^}]+)}/g);
        if (title) {
            var subheadings = title[0].replace('{', '').replace('}', ''),
                subheads = subheadings.split(',');
            var subheadArray = subheads.map(function (head) { return head.trim(); });
            result['multiple'] = true;
            result['subheadings'] = subheadArray;
        } else {
            result['multiple'] = false;
        }
        //    console.log(result);
        return result;
    
}

function generateColumnField(settings, index, name, value, cord, display_only, worksheet, fieldClass) {
    if (worksheet === undefined || typeof worksheet == "undefined" || worksheet == "") {
        worksheet = "";
    }
    var result = {};

    if (typeof settings === 'undefined') {
        result['result'] = '&nbsp;';
        result['width'] = '';
        return result;
    }
    var params = deparam(settings);

    var fieldType = params['column-' + index + '[inputType]'] ? params['column-' + index + '[inputType]'] : '';
    var field = "";

    var min = params['column-' + index + '[' + fieldType + '][min]'],
        max = params['column-' + index + '[' + fieldType + '][max]'],
        coordinate = '',
        typeClass = params['column-' + index + '[' + fieldType + '][type]'],
        required = typeof params['column-' + index + '[' + fieldType + '][required]'] !== 'undefined' ? 'required' : '',
        y = (cord);
    //    console.log(settings, index, name, value, cord, display_only);+
    if (params['column-' + index + '[' + fieldType + '][coordinate]']) {
        coordinate = params['column-' + index + '[' + fieldType + '][coordinate]'];
    } else {
        if (params['column-' + index + '[' + fieldType + '][XCoordinate]'] && params['column-' + index + '[' + fieldType + '][YCoordinate]']) {
            coordinate = (params['column-' + index + '[' + fieldType + '][XCoordinate]'] + params['column-' + index + '[' + fieldType + '][YCoordinate]']).toUpperCase();
        }
    }

    var width = params['column-' + index + '[width]'];
    switch (fieldType) {
        case 'text':
            var step = params['column-' + index + '[' + fieldType + '][step]'];
            field = '<input type="text" ' + display_only + ' class="form-control ' + (typeClass != "" ? (typeClass == "input" ? "inputClass " : "disabledOutput ") : "") + (coordinate != "" && coordinate != undefined ? (coordinate.replace(/[0-9]/g, '') + (parseInt(coordinate.match(/\d+/)[0]) + (y))) : "") + '" ' + (typeClass == "output" ? "readonly " : " ") + ' data-xlsxfield="' + (coordinate != "" && coordinate != undefined ? (coordinate.replace(/[0-9]/g, '') + (parseInt(coordinate.match(/\d+/)[0]) + (y))) : "") + '" data-worksheet="' + worksheet + '" name="' + name + '" value="' + value + '" minlength="' + min + '" maxlength="' + max + '" ' + required + '>';
            break;

        case 'number':
            var step = params['column-' + index + '[' + fieldType + '][step]'];
            field = '<input type="number" ' + display_only + ' class="form-control ' + fieldClass + ' ' + (typeClass != "" ? (typeClass == "input" ? "inputClass " : "disabledOutput ") : "") + (coordinate != "" && coordinate != undefined ? (coordinate.replace(/[0-9]/g, '') + (parseInt(coordinate.match(/\d+/)[0]) + (y))) : "") + '" ' + (typeClass == "output" ? "readonly " : " ") + ' data-xlsxfield="' + (coordinate != "" && coordinate != undefined ? (coordinate.replace(/[0-9]/g, '') + (parseInt(coordinate.match(/\d+/)[0]) + (y))) : "") + '" data-worksheet="' + worksheet + '" name="' + name + '" value="' + value + '" min="' + min + '" max="' + max + '" step="' + step + '" ' + required + '>';
            break;

        case 'date':
            //            field = '<input type="date" class="form-control ' + (typeClass != "" && typeClass == "input" ? "inputClass " : "disabled ") + (coordinate != "" && coordinate != undefined ? (coordinate.substring(0, 1) + (parseInt(coordinate.substring(1)) + (y))) : "") + '" ' + (typeClass != "" && typeClass == "input" ? " " : " disabled ") + ' data-xlsxfield="' + (coordinate != "" && coordinate != undefined ? (coordinate.substring(0, 1) + (parseInt(coordinate.substring(1)) + (y))) : "") + '" name="' + name + '" value="' + value + '" ' + required + '>';
            field = '<input type="date" ' + display_only + (typeClass == "output" ? "readonly " : " ") + ' class="form-control ' + (typeClass != "" ? (typeClass == "input" ? "inputClass " : "disabledOutput ") : "") + '" data-xlsxfield="' + (coordinate != "" && coordinate != undefined ? (coordinate.replace(/[0-9]/g, '') + (parseInt(coordinate.match(/\d+/)[0]) + (y))) : "") + '" data-worksheet="' + worksheet + '" name="' + name + '" value="' + value + '" ' + required + '>';
            break;
        
        case 'time':
            //            field = '<input type="date" class="form-control ' + (typeClass != "" && typeClass == "input" ? "inputClass " : "disabled ") + (coordinate != "" && coordinate != undefined ? (coordinate.substring(0, 1) + (parseInt(coordinate.substring(1)) + (y))) : "") + '" ' + (typeClass != "" && typeClass == "input" ? " " : " disabled ") + ' data-xlsxfield="' + (coordinate != "" && coordinate != undefined ? (coordinate.substring(0, 1) + (parseInt(coordinate.substring(1)) + (y))) : "") + '" name="' + name + '" value="' + value + '" ' + required + '>';
            field = '<input type="time" ' + display_only + (typeClass == "output" ? "readonly " : " ") + ' class="form-control ' + (typeClass != "" ? (typeClass == "input" ? "inputClass " : "disabledOutput ") : "") + '" data-xlsxfield="' + (coordinate != "" && coordinate != undefined ? (coordinate.replace(/[0-9]/g, '') + (parseInt(coordinate.match(/\d+/)[0]) + (y))) : "") + '" data-worksheet="' + worksheet + '" name="' + name + '" value="' + value + '" ' + required + '>';
            break;

        case 'checkbo':
            var str = params['column-' + index + '[' + fieldType + '][option]'];
            if (str.length > 0) {
                var opt = extraDeparam(str);
                if (opt !== undefined) {
                    var options = opt['column-' + index][fieldType]['option'];
                    if (options.length > 0) {
                        $(options).each(function (i, s) {
                            var random_id = Math.floor(Math.random() * 90000) + 10000;
                            var innerValue = s.replace(/\s/g, '_');
                            field += '<div class="' + (name ? "checkbox-inline" : "") + '"><label for="' + random_id + '"' + (display_only == 'disabled' ? "style='pointer-events: none;'" : '') + '><input type="checkbox" data-xlsxfield="' + (coordinate != "" && coordinate != undefined ? (coordinate.replace(/[0-9]/g, '') + (parseInt(coordinate.match(/\d+/)[0]) + (y))) : "") + '" data-worksheet="' + worksheet + '" name="' + name + '[]" value="' + innerValue + '" ' + required + ' id="' + random_id + '" ' + ($.inArray(innerValue, value) >= 0 ? "checked" : "") + '>' + s + '</label></div>';
                        })
                    }
                }
            }
            break;

        case 'radiobo':
            var str = params['column-' + index + '[' + fieldType + '][option]'];
            if (str.length > 0) {
                var opt = extraDeparam(str);
                if (opt !== undefined) {
                    var options = opt['column-' + index][fieldType]['option'];
                    if (options.length > 0) {
                        $(options).each(function (i, s) {
                            var random_id = Math.floor(Math.random() * 90000) + 10000;
                            var innerValue = s.replace(/\s/g, '_');
                            field += '<div class="' + (name ? "radio-inline" : "") + '"><label for="' + random_id + '"' + (display_only == 'disabled' ? "style='pointer-events: none;'" : '') + '><input type="radio" data-xlsxfield="' + (coordinate != "" && coordinate != undefined ? (coordinate.replace(/[0-9]/g, '') + (parseInt(coordinate.match(/\d+/)[0]) + (y))) : "") + '" data-worksheet="' + worksheet + '" name="' + name + '" value="' + innerValue + '" ' + required + ' id="' + random_id + '" ' + (value == innerValue ? 'checked' : '') + '>' + s + '</label></div>';
                        })
                    }
                }
            }
            break;

        case 'select':
            var str = params['column-' + index + '[' + fieldType + '][option]'];
            if (str.length > 0) {
                var opt = extraDeparam(str);
                if (opt !== undefined) {
                    if (opt['column-' + index] !== undefined) {
                        var options = opt['column-' + index][fieldType]['option'];
                        field += '<select name="' + name + '" ' + required + ' class="form-control" ' + display_only + ' data-xlsxfield="' + (coordinate != "" && coordinate != undefined ? (coordinate.replace(/[0-9]/g, '') + (parseInt(coordinate.match(/\d+/)[0]) + (y))) : "") + '" data-worksheet="' + worksheet + '">';
                        $(options).each(function (i, s) {
                            if (options.length > 0) {
                                var innerValue = s.replace(/\s/g, '_');
                                field += '<option  value="' + innerValue + '" ' + (value == innerValue ? 'selected' : '') + '> ' + s;
                            }
                        });
                    }
                }
            }
            break;

        default:
            field = '&nbsp;';
            break;
    }
    result['result'] = field;
    result['width'] = width;
    return result;
}