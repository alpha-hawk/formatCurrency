/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function ($, global, document) {

    //register the initializer
    //add different event listener to target
    $.fn.extend({
        formatCurrency: function () {
            formatCurrency.formatHtml(this);
            this.on("keydown", formatCurrency.isKeyAllowed);
            this.on("keyup", formatCurrency.format);
            this.on("blur", formatCurrency.checkFormat);
        }
    });

    global.formatCurrency = {
        config: {
            containerClass: 'formatCurrencyContainer'
        },

        //function to format input as money
        format: function (event) {
            //variable declarations
            var currency, modifiedCurrency, hasDot, lengthDiff,
                    selectionStart = this.selectionStart,
                    selectionEnd = this.selectionEnd;

            //proceed if pressed key is allowed
            if (formatCurrency.isKeyAllowed(event) && this.value.trim()) {

                currency = this.value;

                hasDot = currency.search(/\./g);

                switch (hasDot) {
                    case - 1:
                        currency += '.00';
                        break;
                    case 0 :
                        currency = '0' + currency;
                        break;
                }

                //modify the currency
                modifiedCurrency = '$' + currency.replace(/,|\$/g, "").replace(/(\d)(?=(\d{3})+\.)/g, "$1,").replace(/(\.\d{2}).*/g, "$1");

                //calculate the length differnce in currency throughout the process
                lengthDiff = modifiedCurrency.length - currency.length;

                //Set modified currency
                $(this).val(modifiedCurrency);

                //reset the cursor to its previous position
                if (lengthDiff !== 0) {
                    this.setSelectionRange(selectionStart + lengthDiff, selectionEnd + lengthDiff);
                } else {
                    this.setSelectionRange(selectionStart, selectionEnd);
                }
            }
        },

        //function to format final input as money 
        checkFormat: function () {

            var value = this.value;
            if (value.trim()) {
                while (!value.match(/^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|0)?\.[0-9]{1,2}$/g)) {
                    value = formatCurrency.fixDot(value)
                }

                if (value.search(/\$/g) === -1)
                    value = '$' + value;

                jQuery(this).val(value);
                jQuery(this).siblings().val(value.replace(/,|\$/g, ''));
            }
        },

        fixDot: function (currency) {
            var hasDot = currency.search(/\./g);
            switch (hasDot) {
                case - 1:
                    currency += '.00';
                    break;
                case 0:
                    currency = '0' + currency;
                    break;
                case 1:
                    currency = '$0' + currency.replace(/\$/g, '');
                    break;
                case currency.length - 1:
                    currency += '00';
                    break;
            }
            return currency;
        },

        //Check if the pressed key is allowed.
        isKeyAllowed: function (event) {
            var allowedKeys = [8, 46, 37, 38, 39, 40];
            if ((event.keyCode < 58 && event.keyCode > 47) || (event.keyCode < 106 && event.keyCode > 95) || allowedKeys.indexOf(event.keyCode) !== -1) {
                return true;
            } else {
                return false;
            }
        },

        formatHtml: function (element) {
            var name = element.prop('name');
            element.prop('name', '');
            element.wrap("<div class='" + this.config.containerClass + "'></div>");
            $("<input type='hidden' name='" + name + "'>").insertAfter(element);
        }
    }

})(jQuery, window, document);
