/* jshint ignore:start */
;var DisplaySocket = function(ctor) {

// prevent jsqrcode reader leaking globals
var GridSampler;
var DataMask;
var Decoder;
var qrcode;
