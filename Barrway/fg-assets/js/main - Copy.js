var assetsImagePath = window.location.origin + '/form-generator/public/assets/images';
function showLoader(target) {
    if (typeof target === 'undefined') {
        $.blockUI({
            message: '<img src="' + assetsImagePath + '/loader.gif" width="50" />',
            css: {
                border: 'none',
                'background-color': 'transparent'
            }
        });
    } else {
        $('body').find(target).block({
            message: '<img src="' + assetsImagePath + '/loader.gif" width="50" />',
            css: {
                border: 'none',
                'background-color': 'transparent'
            }
        });
    }
}

jQuery(function ($) {
    'use strict'

    var navListItems = $('div.setup-panel a.checkBtn'),
        allWells = $('.setup-content');

    allWells.hide();

    navListItems.click(function (e) {
        e.preventDefault();
        var $target = $($(this).attr('href')),
                $item = $(this);

        if (!$item.hasClass('disabled')) {
            navListItems.removeClass('btn-success').addClass('btn-default');
            $item.removeClass('btn-default').addClass('btn-success');
            allWells.hide();
            $target.show();
            $target.find('input[type="text"]:eq(0)').focus();
        }
    });
    
    $('body').on('click', '.nextBtn', function () {
        var curStep = $(this).closest(".setup-content"),
            curStepBtn = curStep.attr("id"),
            nextStepWizard = $('div.setup-panel a.checkBtn[href="#' + curStepBtn + '"]').parent().next().children("a.checkBtn");

        nextStepWizard.removeClass('disabled').trigger('click');
    });
    
    $('body').on('click', '.backBtn', function () {
        var curStep = $(this).closest(".setup-content"),
                curStepBtn = curStep.attr("id"),
                previousStepWizard = $('div.setup-panel a.checkBtn[href="#' + curStepBtn + '"]').parent().prev().children("a.checkBtn");
                
        previousStepWizard.removeAttr('disable').trigger('click');
    });
    $('div.setup-panel a.checkBtn.btn-success').trigger('click');

    $("#password-re").on('keyup', function () {
        var pass = $("#user_reg input[name='password']").val();
        if($(this).val().length > 5){
            if (pass !== $(this).val()) {
                $(this).closest(".form-group").addClass("has-error").removeClass('has-success');
                $(this).next().removeClass('fa-check').addClass('fa-times');
                $(this).closest(".form-group").find('span').remove();
                $(this).closest(".form-group").append("<span style='color:#a94442'>Password not matched!</span>");
            } else {
                $(this).closest(".form-group").removeClass("has-error");
                $(this).closest(".form-group").find('span').remove();
            }
        }
    });
    
    $("#user_reg input[type='checkbox']").on('click', function () {
        $(this).closest(".form-group").removeClass("has-error").addClass('has-success');
        $(this).closest(".form-group").find('p').remove();
        $('#user_reg button[type="submit"]').removeAttr('disabled');
        $('#user_reg button[type="submit"]').removeClass('disabled');
    });

    var userForm = $('#user_reg');
    userForm.on('submit', function (e) {
        e.preventDefault();
        var isValid = true;
        
        if (!$("#user_reg input[type='checkbox']").is(':checked')) {
            $("#user_reg input[type='checkbox']").parent().find('p').remove();
            $("#user_reg input[type='checkbox']").parent().append('<p style="color:#a94442">Please check this to continue!</p>');
            isValid = false;
        } else {
            $("#user_reg input[type='checkbox']").closest(".form-group").addClass('has-success').removeClass("has-error");
            $("#user_reg input[type='checkbox']").parent().find('p').remove();
        }
        if(isValid){
            $(this).find('input[name="phoneNumber"]').val($('#phoneNumber').intlTelInput("getNumber"));
            $(this).find('#frmSubmit').addClass('nextBtn');
            $.ajax({
                url: $(this).attr("action"),
                type: "POST",
                data: $(this).serializeArray(),
                dataType: 'json',
                beforeSend: function () {
                    showLoader('#step-1 .panel-body');
                },
                success: function (data, textStatus, jqXHR)
                {
                    $('#step-1 .panel-body').unblock({ 
                        onUnblock: function(){
                            $('input#new_user_id').val(data.user_id);
                            $('#user_reg button[type="submit"]').removeAttr('disabled');
                            $('#user_reg button[type="submit"]').removeClass('disabled');
                            $('#user_reg button[type="submit"]').attr('type', 'button');
                            userForm.find('#frmSubmit').click();
                            $("#admin-menus").tabulator("redraw");
                        } 
                    });
                },
                error: function (jqXHR, textStatus, errorThrown)
                {
                    $.unblockUI();
                }
            });
        }else {
            return false;
        }
    });
});

function createUserItems(ajaxUrl, ajaxData, $nextButton){
    var stepID = $nextButton.parents('.setup-content').attr('id');
    $.ajax({
        url: ajaxUrl,
        type: "POST",
        data: {postData: ajaxData, userID: $('input#new_user_id').val()},
        dataType: "json",
        beforeSend: function () {
            showLoader('#' + stepID + ' .panel-body');
        },
        success: function (result) {
            if(result.success){
                $('#' + stepID + ' .panel-body').unblock({ 
                    onUnblock: function(){
                        $nextButton.parent().find('.nextBtn').click();
                    } 
                });
            }else{
                alert(result.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            $.unblockUI();
        }
    });
}

function welcome_to_geligulu(ajaxUrl, redirectUrl, baseUrl){
    var user_id = $('input#new_user_id').val();
    var password = $('input[name="password"]').val();
    
    $.post(ajaxUrl, {userID: user_id, password: password}, function(response){
        if(response){
            window.location.href = redirectUrl;
        } else {
            alert('Some error occured in authentication');
            window.location.href = baseUrl;
        }
    });
}