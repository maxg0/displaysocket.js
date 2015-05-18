# DisplaySocket.js

DisplaySocket.js is a JavaScript library for sending data from one device to
another using only a display and a camera. This may be useful in situations where

* no other input/output hardware exists or is currently available
* network usage is being restricted and/or monitored
* wireless communication is desired but only visible light can be used and the only accessible hardware is a display and a camera

This library is a work in progress, and will most likely only work in modern browsers. The API is made to resemble the WebSocket API. The library still lacks several features like error handling and closing properly.

So far the highest properly recorded transmission speed of a 1 KiB file has been about 5 kbit/s with an average speed of about 2 kbit/s with an old webcam. The unofficial record is ~13.3 kbit/s one time with a modern smartphone.

## Usage
### Send data in simplex mode
```
var outputElement = document.getElementById('output'); // e.g. a div
var ds = new DisplaySocket({
    output: outputElement,
    // optionally (values are default values)
    sliceSize: 250, // Send roughly 250 characters with each slice
    baseInterval: 30 // Scanning speed. Writes 4 times slower.
});
ds.send(data);
```

### Read a simplex broadcast
```
var videoOutput = document.getElementById('video');
var ds = new DisplaySocket({videoOutput:videoOutput});

ds.onmessage = function(e) {
    console.log('received', e.message);
};

// alternatively
displaySocket.addEventListener('message', function(e) {
    console.log('received', e.message);
});
```

// TODO duplex documentation. See demos for examples.

## Methods

The only currently working method is using QR-codes. Text based and 1D barcode based methods might also work but have not been successfully implemented yet.

## Options

`video`

Video element that helps the end-user aim their camera.


`output`

Element to which the QR-code, text or other method gets written or drawn.


`sliceSize`

Sets the amount of characters to be input in the output method at one time.
Defaults to 250 characters.


`videoMirrorCanvas`

Canvas element to which the video output gets copied to every N milliseconds where N is the value specified for scanningInterval.
Defaults to creating a new hidden canvas element.


`baseInterval`

How often the video gets scanned and how often output is changed. Defaults to once every 30 milliseconds. So reading occurs at 33.33.. Hz and writing at 8.33.. Hz.


`scanningInterval`

Defaults to baseInterval. How often the video gets scanned.


`sendingInterval`

How often the output is changed to the next slice, aka writing frequency. Defaults to 4 times the base interval.

## Change video source

`ds.nextVideoSource();`

Change to next video source.

## Progress

`var progress = ds.progress();`

`progress.total` // total amount of slices, unknown until first piece is gotten

`progress.found` // total amount of slices that have been received

`progress.progress` // array of booleans where true means a part is found and false means it may be found later

`progress.percent` // if total is known this is found / total, else it is found / progress.length. That means that during simplex transmission the percentage can go down

`progress.current` // the index of the latest slice


## Development

Run `createCerts.sh` or create your own certificates `ds.key` and `ds.crt`.

Run `grunt serve` to start a webserver at https://localhost:9000. It will also look for changes in files specified by the watch task in `Gruntfile.js`.

Run `grunt dist` to create concatenated and minified files in `dist`.

## Acknowledgements and misc

The core functionality of this library relies on other people's work, namely jsqrcode by Lazar Laszlo and qrcodejs by Shim Sangmin.

The file qrcode.js from jsqrcode has been modified to avoid console.log() clutter.

This is part of my bachelor's thesis (link coming later).

