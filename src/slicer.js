/* global ds */
/* global utils */

function Slicer(data) { // jshint ignore:line
    'use strict';
    var sliceSize = ds.sliceSize;
    var currentSlice = -1; // so when we call nextSlice we get 0
    data = data || null;

    var slices = null;
    if(data) {
        slices = slice(data);
    }

    function slice(data) {
        var amount = Math.floor(data.length / sliceSize);
        var result = [];
        var wholeChecksum = utils.hashCode(data);
        for(var i = 0; i <= amount + 1; i++) {

            if(i === 0) {
                result[i] = i + '/' + amount + '/' + wholeChecksum + '$';
            } else {
                var part = data.substr((i-1)*sliceSize, sliceSize);
                result[i] = i + '/' + utils.hashCode(part) + '$';
                result[i] += part;
            }
        }
        return result;
    }

    return {

        setData: function(data) {
            slices = slice(data);
        },

        getSlices: function() {
            return slices;
        },

        nextSlice: function() {
            currentSlice = (currentSlice + 1) % slices.length;
            return slices[currentSlice];
        },

        getCurrentSlice: function() {
            return slices[currentSlice];
        },

        getCurrentSliceIndex: function() {
            return currentSlice;
        }

    };
}
