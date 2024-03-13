import fs from 'fs'
import path from 'path';


const downloadPath = "../downloads"

function checkAndCreateDirectory(path){
    if(!fs.existsSync(path))
        fs.mkdirSync(path)
    else
        console.log("目录已存在")
}

(()=>{
    checkAndCreateDirectory(downloadPath);
})()