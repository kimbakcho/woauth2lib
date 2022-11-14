let fs = require('fs');
const path = require("path")



try{
    fs.copyFile("./src/oAuth2LibPlugin/oAuth2LibPlugin.ts","./lib/oAuth2LibPlugin.ts",()=>{

    })
    fs.copyFile("./src/oAuth2LibPlugin/RedirectLoginView.vue","./lib/RedirectLoginView.vue",()=>{

    })
}catch (e) {
    console.log(e)
}

