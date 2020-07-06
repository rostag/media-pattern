// var FfmpegCommand = require('fluent-ffmpeg');
// var command = new FfmpegCommand();

var ffmpeg = require('fluent-ffmpeg');
// var command = ffmpeg();

const pathToVideo = '/Users/user/Documents/art/2020-07-04 Fireshow/DJI_0092 CITY outro far big roll n0 SLOW ABOVE r2.mov';

ffmpeg.ffprobe(pathToVideo, function (err, metadata) {
    console.log('Metadata:', JSON.stringify(metadata, null, 4), err);
});

// ffmpeg.ffprobe(pathToVideo, function (err, metadata) {
//     var audioCodec = null;
//     var videoCodec = null;
//     metadata.streams.forEach(function (stream) {
//         if (stream.codec_type === "video") {
//             videoCodec = stream.codec_name;
//         }
//         else if (stream.codec_type === "audio") {
//             audioCodec = stream.codec_name;
//         }

//         console.log('Metadata stream:', JSON.stringify(stream, null, 2), err);
//     });

//     console.log("Video codec: %s\nAudio codec: %s", videoCodec, audioCodec);
// });

// ffmpeg.getAvailableFormats(function (err, formats) {
//     console.log('Available formats:');
//     console.dir(formats, err);
// });

// ffmpeg.getAvailableCodecs(function (err, codecs) {
//     console.log('Available codecs:');
//     console.dir(codecs);
// });

// ffmpeg.getAvailableEncoders(function (err, encoders) {
//     console.log('Available encoders:');
//     console.dir(encoders);
// });

// ffmpeg.getAvailableFilters(function (err, filters) {
//     console.log("Available filters:");
//     console.dir(filters);
// });

// // Those methods can also be called on commands
// new Ffmpeg({ source: '/path/to/file.avi' })
//     .getAvailableCodecs(...);