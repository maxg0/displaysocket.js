/* global ds */
/* global qrcode */

function Reader(callback) { // jshint ignore:line
    'use strict';

    var callbackFunction = function(response) {
        if(response.hasOwnProperty('error')) {
            console.log(response.error);
            return response.error;
        }
        //console.log('response', response.data);
        callback(response.data);
    };

    qrcode.callback = callbackFunction;

    return {

        read: function(canvas) {
            if(ds.method === 'text') {
                console.error('Text method not implemented.');
                // if it were implemented, it might go something like this:
                //var str = ocr(canvas);
                //callback(str);
            } else {
                qrcode.decode(canvas);
            }
        }

    };
}
