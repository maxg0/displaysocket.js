/* global QRCode */
/* global TextWriter */

function Writer(outputElement, method) { // jshint ignore:line
    'use strict';
    var chosenWriter = {};
    var chosenWriterFunction = function() {};
    switch(method) {
        case 'text':
            var textWriter = new TextWriter(outputElement);
            chosenWriter = textWriter;
            chosenWriterFunction = textWriter.write;
            break;
        default:
            var qrcode = new QRCode(outputElement, {
                text: '',
                width: outputElement.offsetWidth,
                height: outputElement.offsetHeight,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.L
            });
            chosenWriter = qrcode;
            chosenWriterFunction = qrcode.makeCode;
            break;
    }


    return {
        write: function(text) {
            chosenWriterFunction.apply(chosenWriter, [text]);
        }
    };
}

