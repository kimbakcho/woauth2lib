let fs = require('fs');
const path = require("path")

// if (!fs.existsSync(dir)){
//     fs.mkdirSync(dir);
// }

var copyRecursiveSync = function(src, dest) {
    var exists = fs.existsSync(src);
    var stats = exists && fs.statSync(src);
    var isDirectory = exists && stats.isDirectory();
    var existsdst = fs.existsSync(dest);
    if(!existsdst){
        fs.mkdirSync(dest);
    }
    if (isDirectory) {
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

