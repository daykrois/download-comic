import puppeteer from 'puppeteer-core';
import path from 'path'
import fs from 'fs'

const downloadPath = "../downloads";

function checkAndCreateDirectory(path) {
    if (!fs.existsSync(path))
        fs.mkdirSync(path)
}

const css = `
.rightToolBar{
    display:none
}
#lb-win{
    display:none
}
`;


(async () => {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        headless: false // 设置为 true 以在无头模式下运行
    });
    const page = await browser.newPage();
    await page.goto('https://www.dm5.com/m5338/', { waitUntil: 'networkidle0' });

    // 等待图片元素加载完成
    await page.waitForSelector('#cp_image');

    await page.addStyleTag({ content: css });

    // 捕获特定元素的截图
    const imgElement = await page.$('img#cp_image');
    const buffer = await imgElement.screenshot();


    checkAndCreateDirectory(downloadPath);

    // 保存截图到本地文件系统
    const filename = path.join(downloadPath, 'downloaded-image.jpg');
    fs.writeFileSync(filename, buffer);

    await browser.close();

})();