let fs = require('fs');
let dir = './dist';
const path = require("path")

// if (!fs.existsSync(dir)){
//     fs.mkdirSync(dir);
// }

var copyRecursiveSync = function(src, dest) {
    var exists = fs.existsSync(src);
    var stats = exists && fs.statSync(src);
    var isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        fs.mkdirSync(dest);
        fs.readdirSync(src).forEach(function(childItemName) {
            copyRecursiveSync(path.join(src, childItemName),
                path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
};

try{
    copyRecursiveSync("./src/oAuth2LibPlugin","./lib")
}catch (e) {
    console.log(e)
}

