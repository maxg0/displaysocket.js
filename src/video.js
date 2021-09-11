/* global ds */
/* global MediaStreamTrack */

function Video(videoElement, canvas) { // jshint ignore:line
    'use strict';
    var canvasMirrorInterval = null;
    var canvasBeingMirrored = false;
    var context = canvas.getContext('2d');

    navigator.getUserMedia = navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia;

    var currentVideoSource = 0;
    var videoSources = [];
    var videoStream = null;

    if( MediaStreamTrack.getSources) {
        MediaStreamTrack.getSources(getSources);
    } else {
        start();
    }

    function getSources( sources) {
        //console.log(sources);
        for(var i = 0; i < sources.length; i++) {
            var source = sources[i];
            if( source.hasOwnProperty('kind')) {
                if( source.kind === 'video') {
                    //console.log(source);
                    videoSources.push(source);
                }
            }
        }
        start(videoSources[currentVideoSource]);
        //console.log(videoSources);
    }

    function start(source) {

        var videoConstraints = {};
        if( source) {
            videoConstraints = {
                optional: [{ sourceId: source.id }]
            };
        } else {
            videoConstraints = true;
        }

        if( videoStream) {
            videoStream.stop();
            videoElement.src = null;
        }

        //console.log(source.id);
        if( navigator.getUserMedia) {

            navigator.getUserMedia({
                    video: videoConstraints,
                    audio: false
                },
                videoSuccess,
                videoError
            );

        } else {
            console.error('Could not getUserMedia');
        }
    }

    function videoSuccess(newVideoStream) {

        /*
        if( videoStream) {
            videoStream.removeTrack(videoStream.getVideoTracks()[0]);
            //videoStream.addTrack(newVideoStream.getVideoTracks()[0]);
        }
        */
        videoStream = newVideoStream;

        if( navigator.mozGetUserMedia) {
            //console.log('mozilla');
            videoElement.mozSrcObject = videoStream;

        } else {
            //console.log('not mozilla');
            if ('srcObject' in videoElement) {
				videoElement.srcObject = videoStream;
			  } else {
				// Avoid using this in new browsers, as it is going away.
				videoElement.src = (
							window.URL &&
							window.URL.createObjectURL(videoStream)
						) || videoStream;
			  }
        }
        //console.log('video success');
        videoElement.play();
        //console.log(canvas.width);
    }

    function videoError(error) {
        console.log('video error',error);
    }

    return {

        canvasDraw: function() {
            var ve = videoElement;
            var width = ve.videoWidth;
            var height = ve.videoHeight;
            canvas.width = width;
            canvas.height = height;
            if( ds.method === 'text') {
                canvas.height = height / 4;
            }
            context.drawImage( ve, 0, 0, width, height);
        },

        startCanvasMirror: function() {
            canvasBeingMirrored = true;
            canvasMirrorInterval = setInterval(this.canvasDraw, ds.scanningInterval);
        },

        stopCanvasMirror: function() {
            canvasBeingMirrored = false;
            clearInterval(canvasMirrorInterval);
        },

        capture: function() {
            var dataURL = canvas.toDataURL();
            return dataURL;
        },

        changeSource: function() {
            var canvasWasMirrored = false;
            if( canvasBeingMirrored) {
                canvasWasMirrored = true;
                this.stopCanvasMirror();
            }

            currentVideoSource = (currentVideoSource + 1) % videoSources.length;
            start(videoSources[currentVideoSource]);
            if( canvasWasMirrored) {
                this.startCanvasMirror();
            }
        }

    };

}
