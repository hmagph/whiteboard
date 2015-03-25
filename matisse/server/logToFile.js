var original_write, log_stream, stream_initialized = false, fs = require('fs');

log_stream = fs.createWriteStream("./app_debug.log");
log_stream.once('open', function() {
    stream_initialized = true;
});

exports.start = function() {
    original_write = process.stdout.write

    process.stdout.write = (function(write) {
        return function(string, encoding, fd) {
            if (stream_initialized) {
                log_stream.write(string);
            } else {
                write.apply(process.stdout, arguments)
            }
        }
    })(process.stdout.write)
}

exports.stop = function() {
    if (old_write) {
        process.stdout.write = old_write
    }
    if (stream_initialized) {
        log_stream.close();
    }
}

