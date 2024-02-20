"use strict";
const validEvents = ["keydown", "keyup", "keypress", "submit", "input", "change", "focus", "blur", "cut", "copy", "paste", "click", "mousedown", "mouseup", "mousemove", "mouseenter", "mouseleave"];

const attachEvent = (events, selector, callback) => {

    events
        .split(",")
        .map((event) => event.trim())
        .filter((event) => validEvents.includes(event))
        .forEach((event) => {
            document.addEventListener(event, (e) => {
                const target = e.target;
                if (target.closest(selector)) {

                    callback.call(target, e);
                }
            });
        });
};


function ReendOtp() {

}

class OTPInputHandler {

    constructor(selector) {
        /**
         * Handles keydown events for OTP input fields.
         */
        this.handleKeyDown = (e) => {
            // Checks if the event is a KeyboardEvent and prevents the default action if
            // neither the Ctrl key nor the Meta key (Command key on Mac) is pressed,
            // indicating that it's not a Ctrl+C or Ctrl+V event.
            const keyboard = e;
            if (!keyboard.ctrlKey && !keyboard.metaKey) {
                e.preventDefault();
            }
            // Get the index of the current input field
            this.inputIndex = this.getInputIndex(e.target);
            const inputValue = this.inputs[this.inputIndex].value;
            switch (keyboard.key) {
                case "Backspace":
                    this.inputs[this.inputIndex].value = "";
                    this.moveFocusLeft();
                    break;
                case "Delete":
                    this.inputs[this.inputIndex].value = "";
                    break;
                case "ArrowLeft":
                    this.moveFocusLeft();
                    break;
                case "ArrowRight":
                    this.moveFocusRight();
                    break;
                default:
                    if (/^\d$/.test(keyboard.key) && // Accepts only numeric characters
                        !this.allFilled() &&
                        !(this.inputIndex === this.inputs.length - 1 && inputValue !== "")) {
                        this.inputs[this.inputIndex].value = keyboard.key;
                        this.moveFocusRight();
                    }
                    break;
            }
        };
        /**
         * Handles paste events for OTP input fields.
         */
        this.handlePaste = (e) => {
            e.preventDefault();
            // Get the index of the current input field
            this.inputIndex = this.getInputIndex(e.target);
            const clipboardEvent = e;
            // Extracts text data from the clipboard and processes it for input.
            const pasteData = clipboardEvent.clipboardData
                .getData("text/plain")
                .slice(0, this.inputs.length - this.inputIndex) // Limits the pasted data length to the available input fields.
                .split("");
            if (pasteData) {
                // Checks if all pasted values are numeric.
                if (!pasteData.every((value) => /^\d$/.test(value))) {
                    return;
                }
                // Populates the input fields with the pasted data.
                for (const i = 0; i < pasteData.length; i++) {
                    if (this.inputIndex + i < this.inputs.length) {
                        this.inputs[this.inputIndex + i].value = pasteData[i];
                    }
                }
            }
        };

        this.moveFocusLeft = () => {
            if (this.inputIndex !== 0) {
                this.inputs[this.inputIndex - 1].focus();
            }
        };

        this.moveFocusRight = () => {
            if (this.inputIndex !== this.inputs.length - 1) {
                this.inputs[this.inputIndex + 1].focus();
            }
        };
        this.selector = selector;
        this.inputIndex = 0;
        this.inputs = document.querySelectorAll(this.selector);
        this.attachEventHandlers();
    }

    attachEventHandlers() {
        attachEvent("keydown", this.selector, this.handleKeyDown);
        attachEvent("paste", this.selector, this.handlePaste);
    }

    updateInputs() {
        this.inputs = document.querySelectorAll(this.selector);
    }



    allFilled() {
        return Array.from(this.inputs).every((input) => input.value !== "");
    }



    getInputIndex(input) {
        return Array.from(this.inputs).indexOf(input);
    }

    getOTP() {
        const otpValues = Array.from(this.inputs).map((input) => input.value);
        return otpValues.join("");
    }
}
const otpHandler = new OTPInputHandler(".otp-input");
attachEvent("keydown, paste", ".otp-input", function (e) {
    document.getElementById("OTP").value = otpHandler.getOTP();
});

let timerOn = true;

function timer(remaining) {
    var m = Math.floor(remaining / 60);
    var s = remaining % 60;

    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    document.getElementById('timer').innerHTML = m + ':' + s;
    remaining -= 1;

    if (remaining >= 0 && timerOn) {
        $("#Btn_ResendOtp").hide();
        $("#Btn_VarifyOtp").show();
        setTimeout(function () {
            timer(remaining);
        }, 1000);
        return;
    }

    if (!timerOn) {
        alert();
        return;
    }

    $("#Btn_ResendOtp").show();
    $("#Btn_VarifyOtp").hide();

}

timer(120);