'use strict';

/* global ds */
/* global Video */
/* global Slicer */
/* global Writer */
/* global Reader */
/* global Merger */

var utils = {}; // TODO move to own file
// http://stackoverflow.com/a/7616484/2324209
utils.hashCode = function(string) {
  var hash = 0, i, chr, len;
  if (string.length === 0) {
      return hash;
  }
  for (i = 0, len = string.length; i < len; i++) {
    chr   = string.charCodeAt(i);
    /*
    hash  = ((hash << 5) - hash) + chr; // jshint ignore:line
    hash |= 0; // jshint ignore:line
    */
    hash += chr % 123;
  }
  return hash;
};

/* test for slicer and merger
// TODO proper tests
var testData = 'abcdefghijklmnopqrstuvwxyz0123456789';
for(var a = 0; a < 10; a++) {
    testData += a + ' ';
}

var slicer = new Slicer(testData);
var merger = new Merger();

var slices = slicer.getSlices();
console.log('slices', slices);

for(var i = 0; i < slices.length; i++) {
    merger.addData(slices[i]);
}
var merged = merger.merge();
console.log('merged', merged);
if( merged === testData) {
    console.log('success');
} else {
    console.log('fail');
}
return;

/**/

var writer = {};

if( ds.output ) {
    writer = new Writer(ds.output, ds.method);
} else {
    // assume simplex receiver if there's no output. Use dummy writer.
    writer = { write: function() {} };
}

var reader = new Reader(scanResultCallback);
var slicer = new Slicer();
var merger = new Merger();

// TODO proper feature detection and handling
var performance;
if( window && window.performance ) {
    performance = window.performance;
} else {
    performance = {now:function(){return new Date().getTime();}};
}

// timers measure from first successful scan until last piece is received
// this omits the time it takes to scan, which should be included in the timing
// TODO use timing that takes initial scan time into account
ds.startTime = null;
ds.endTime = null;

function scanResultCallback(result) {
    if( ! ds.startTime ) {
        ds.startTime = performance.now();
    }
    //console.log('scan result',result);
    if( ds.duplexSending ) {
        //console.log('duplex send result', result);
        var current = slicer.getCurrentSliceIndex();
        //console.log('result', result);
        //console.log('current', current);

        if( result == current ) { // jshint ignore:line
            writer.write(slicer.nextSlice());
        }
        ds.reportProgress();
        return;
    }

    // report which part we last read
    writer.write(merger.getCurrent().toString());

    merger.addData(result);
    var merged = merger.done();
    if( merged ) {
        console.log('done:', merged);
        ds.finished = true;
        ds.receiveDone(merged);
    }
    ds.reportProgress();
}

ds.startRecording = function() {
    if( ! ds.video ) {
        ds.video = new Video( ds.videoElement, ds.videoMirrorCanvas);
        ds.video.startCanvasMirror();
    } else {
        console.log('already recording');
    }
};


ds.sendLoopTimeout = null;
ds.simplexSendLoop = function() {
    writer.write(slicer.nextSlice());
    ds.sendLoopTimeout = setTimeout(ds.simplexSendLoop, ds.sendingInterval);
};

ds.duplexSendTimeout = null;
ds.duplexSend = function() {
    ds.scan();
    ds.duplexLoopTimeout = setTimeout(ds.duplexSend, ds.sendingInterval);
};

ds.iface.send = function(data) {
    if( ! ds.output ) {
        console.error('Tried to send data without supplying output element');
        return;
    }
    ds.sending = true;
    //console.log(data);
    slicer.setData(data);
    if( ds.videoElement ) {
        // sender has video specified so it's a duplex sender

        ds.startRecording();
        writer.write(slicer.nextSlice());
        ds.duplexSending = true;

        ds.duplexSend();
    } else {
        ds.simplexSendLoop();
    }
};

ds.receiveLoop = function() {
    ds.scan();
    //console.log('receive loop');
    if( !ds.finished ) {
        ds.receiveLoopTimeout = setTimeout(ds.receiveLoop, ds.scanningInterval);
    }
};

// api placeholders
ds.iface.onmessage = function() {};
ds.iface.onprogress = function() {};

ds.receiveDone = function(message) {
    var e = {};
    e.data = message;
    ds.endTime = performance.now();
    e.time = ds.endTime - ds.startTime;

    ds.iface.onmessage(e);
    ds.fireEvent('message', [e]);
};

ds.reportProgress = function() {
    if( merger.getPrevious() === merger.getCurrent() ) {
        return;
    }
    var e = merger.getProgress();
    ds.iface.onprogress(e);
    ds.fireEvent('progress', [e]);
};

ds.receive = function() {
    ds.finished = false;
    ds.startRecording();
    if( ! ds.video ) {
        console.error('Tried to receive data without supplying video element');
        return;
    }
    ds.receiveLoop();
};

ds.scan = function() {
    if(ds.videoMirrorCanvas.width === 0) {
        //console.warn('canvas not ready yet');
        return;
    }
    reader.read(ds.videoMirrorCanvas);
};

ds.iface.nextVideoSource = function() {
    if( ds.video ) {
        ds.video.changeSource();
    } else {
        console.warn('tried to change video source but there was no video');
    }
};

// event functions based on http://stackoverflow.com/a/10979055/2324209
ds.events = {};
ds.iface.addEventListener = function(name, handler) {
    if( ds.events.hasOwnProperty(name) ) {
        ds.events[name].push(handler);
    } else {
        ds.events[name] = [handler];
    }
};

ds.iface.removeEventListener = function(name, handler){
    if( !ds.events.hasOwnProperty(name) ) {
        return;
    }
    var index = ds.events[name].indexOf(handler);
    if( index !== -1 ) {
        ds.events[name].splice(index, 1);
    }
};

ds.fireEvent = function(name, args) {
    if( ! ds.events.hasOwnProperty(name) ) {
        return;
    }
    if( !args || !args.length) {
        args = [];
    }
    var ev = ds.events[name];
    for( var i = 0; i < ev.length; i++ ) {
        ev[i].apply(null, args);
    }
};

if( ! ds.wait && ds.videoElement ) {
    ds.receive();
}

//ds.iface.receive = function() {
//    if( ds.wait ) {
//        ds.receive();
//    }
//};
