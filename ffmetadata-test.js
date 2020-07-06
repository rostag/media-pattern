var ffmetadata = require("ffmetadata");
 
// Read song.mp3 metadata
ffmetadata.read("/Users/user/Documents/art/2020-07-04 Fireshow/DJI_0092 CITY outro far big roll n0 SLOW ABOVE r2.mov", function(err, data) {
    if (err) console.error("Error reading metadata", err);
    else console.log('Got metadata: ', data);
});
 
// Set the artist for song.mp3
// var data = {
//   artist: "Me",
// };
// ffmetadata.write("song.mp3", data, function(err) {
//     if (err) console.error("Error writing metadata", err);
//     else console.log("Data written");
// });