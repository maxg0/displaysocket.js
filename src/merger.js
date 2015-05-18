/* global utils */

function Merger() { // jshint ignore:line
    'use strict';
    var slices = [];
    var current = 0;
    var total = null;
    var checksum = null;
    var previous = null;

    return {
        addData: function(slice) {
            previous = current;
            var parts = slice.split('$');
            var nums = parts.shift().split('/');

            current = parseInt(nums[0]);

            if(nums.length === 3) {
                total = parseInt(nums[1]);
                var newChecksum = parseInt(nums[2]);
                if(checksum) {
                    if(checksum !== newChecksum) {
                        //console.log('checksum and newChecksum dont match');
                        //console.log(checksum, newChecksum);
                    }
                } else {
                    // checksum not yet defined
                    checksum = newChecksum;
                }
                return;
            }

            var content = parts.join('$');

            if(nums.length === 2) {
                var sliceChecksum = parseInt(nums[1]);
                var contentChecksum = parseInt(utils.hashCode(content));
                // we actually want == here, not ===
                if(sliceChecksum == contentChecksum) { // jshint ignore:line
                    slices[current] = content;
                } else {

                    //console.log('slice checksum not ok:', sliceChecksum, contentChecksum);
                }
            }

        },

        getPrevious: function() {
            return previous;
        },

        getCurrent: function() {
            return current;
        },

        done: function() {
            var merged = this.merge();

            if(utils.hashCode(merged) === checksum) {
                return merged;
            } else {
                return null;
            }
        },

        merge: function() {
            return slices.join('');
        },

        getProgress: function() {
            var progress = [];
            var found = 0;
            var totalSlices = 0;

            if(total) {
                totalSlices = total;
                progress[0] = true;
            } else {
                totalSlices = slices.length;
            }

            //console.log(totalSlices);
            for(var i = 1; i < totalSlices; i++) {
                var slice = slices[i];
                if(slice) {
                    found++;
                    progress[i] = true;
                } else {
                    progress[i] = false;
                }
            }

            var percent = 0;
            if(total) {
                percent = found / total;
            } else {
                percent = found / progress.length;
            }

            return {
                total: total,
                found: found,
                progress: progress,
                percent: percent,
                current: current
            };
        }
    };
}
