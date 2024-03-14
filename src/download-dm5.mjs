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
    await page.goto('https://tel.dm5.com/m5338/', { waitUntil: 'networkidle0' });
    //创建目录
    checkAndCreateDirectory(downloadPath);
    let pageNum = 1;
    while (pageNum < 5) {
        await getImg(page, css, downloadPath, pageNum);
        pageNum += 1;
        const element = await page.$('a[href^="javascript:ShowNext();"]');
        //下一页
        if (element) {
            await element.click();
        } else {
            await browser.close();
        }
    }
    await browser.close();

})();

async function getImg(page, css, downloadPath, comicName) {
    // 等待图片元素加载完成
    await page.waitForSelector('#cp_image');
    await page.waitForFunction('document.readyState === "complete" && document.fonts.ready');
    await page.addStyleTag({ content: css });
    // 捕获特定元素的截图
    const imgElement = await page.$('img#cp_image');
    const buffer = await imgElement.screenshot();
    // 保存截图到本地文件系统
    const filename = path.join(downloadPath, `${comicName}.jpg`);
    fs.writeFileSync(filename, buffer);
}