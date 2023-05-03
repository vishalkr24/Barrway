var assetsImagePath = ASSET_URL + 'assets/images';
function showLoader(target) {
    if (typeof target === 'undefined') {
        $.blockUI({
            message: '<img src="' + assetsImagePath + '/loader.svg" height="120" />',
            css: {
                border: 'none',
                'background-color': 'transparent'
            }
        });
    } else {
        $('body').find(target).block({
            message: '<img src="' + assetsImagePath + '/loader.svg" height="120" />',
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