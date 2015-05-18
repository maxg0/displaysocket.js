// can be used if and when a good enough JS screenreader is found
var TextWriter = function(element) {
    var outputElement = element;
    return {
        write: function(text) {
            outputElement.innerHTML = text;
        }
    }
}
