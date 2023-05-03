/**
 * jQuery Captcha Basic
 *
 * @fileoverview  Plugin object
 * @link          https://github.com/pemre/jquery-captcha-basic/
 * @author        Emre Piskin (http://rencs.com/)
 * @requires      jQuery 1.12.4+
 */

(function($) {
    "use strict";

    $.fn.captcha = function(param) {

        // DEFAULT VARIABLES
        var params = $.extend({
            idCaptchaText: 'captchaText',   // The ID for the captcha text. Default is 'captchaText'.
            idCaptchaInput: 'captchaInput', // The ID for the captcha input. Default is 'captchaInput'.
            class: '',                       // Class name for the submit button toggle. Default is ''.
            label: 'Verification',
            maxNumber: 10
        }, param);

        // Find and disable the submit button
        var submit = this.find('button.btn[type=submit]');
        submit.attr('disabled', 'disabled');
        
        //var div = $('<div/>', {class: 'form-group col-sm-12'})
        //        .append('<label style="text-align:left !important" class="pull-left">' + params.label + ' <span class="asteriskField">*</span></label><div class="clearfix"></div>')
        //        .append('<label id="' + params.idCaptchaText + '" class="control-label mr-5"></label>')
        //        .append('<input id="' + params.idCaptchaInput + '" aria-label="Captcha Input" class="form-control captchaInput" type="number" required="required">');
        //// Insert captcha text and input before the submit button with the given ID's
        //div.insertBefore(submit);

        // Select text and input elements to fill
        var label = this.find('#' + params.idCaptchaText);
        var input = this.find('#' + params.idCaptchaInput);

        // Generate random numbers and the sum of them
        var rndmNr1 = Math.floor(Math.random() * params.maxNumber),
            rndmNr2 = Math.floor(Math.random() * params.maxNumber),
            totalNr = rndmNr1 + rndmNr2;

        // Print the numbers to screen
        $(label).text(rndmNr1 + ' + ' + rndmNr2 + ' =');

        // Check the input value, enable it if the sum is correct
        $(input).on('keyup change', function () {
            if (parseInt($(this).val()) === totalNr)
                submit.removeAttr('disabled').addClass(params.class);
            else
                submit.attr('disabled', 'disabled').removeClass(params.class);
        });

        // Don't breake jQuery chain!
        return this;
    }
})(jQuery);
