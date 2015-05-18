/* global ctor */
/* jshint ignore:end */
/* jshint unused:false */
if(! ctor) {
    console.error('DisplaySocket needs a constructor');
    return null;
}
if(! ctor.output && ! ctor.video) {
    console.error('DisplaySocket needs an output element or a video element to work');
    return null;
}
var ds = {
    iface: { }
};

ds.finished = false;

ds.sliceSize = ctor.sliceSize || 250;
ds.baseInterval = ctor.baseInterval || 30;
ds.scanningInterval = ctor.scanningInterval || ds.baseInterval;
ds.sendingInterval = ctor.sendingInterval || ds.baseInterval * 4;

// quick hack to disable selecting other methods
//*
if(ctor.method) {
    console.error('Only qrcode method enabled for this build.');
    return;
}
/**/
ds.method = ctor.method || 'qrcode';

ds.videoElement = ctor.video || null;
ds.output = ctor.output || null;


if(ctor.videoMirrorCanvas) {
    ds.videoMirrorCanvas = ctor.videoMirrorCanvas;
} else {
    ds.videoMirrorCanvas = document.createElement('canvas');
    //ds.videoMirrorCanvas.style.display = 'none';
    document.body.appendChild(ds.videoMirrorCanvas);
}

ds.wait = ctor.wait || false;
