import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import createDirectoryIfNotExists from './directoryUtils.mjs';

const downloadPath = '../downloads/火凤燎原/';
createDirectoryIfNotExists(downloadPath);


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
        headless: true // 设置为 true 以在无头模式下运行
    });
    const page = await browser.newPage();
    let pageNum = 192;
    const pageCount = 193;
    await page.goto('https://www.dm5.com/m5338-p'+pageNum, { waitUntil: 'networkidle2', timeout: 0 });
    while (pageNum <= pageCount) {
        try {
            await page.waitForFunction(`document.querySelector('p#imgloading') && document.defaultView.getComputedStyle(document.querySelector('p#imgloading')).display === 'none'`, { timeout: 10000 });
            await getImg(page, css, downloadPath, pageNum);
            await pageNext(page);
            pageNum += 1;
        } catch (error) {
            console.log('发生错误');
            break;
        }
    }
    await browser.close();
})();

async function getImg(page, css, downloadPath, comicName) {
    console.log('开始下载第' + comicName + '页')
    await page.waitForSelector('img#cp_image');
    console.log('图片加载完成')
    await page.addStyleTag({ content: css });
    console.log('添加样式完成，去掉多余元素')
    let imgElement = await page.$('img#cp_image');
    console.log('获取图片元素')
    const buffer = await imgElement.screenshot();
    console.log('获取截图buffer')
    const filename = path.join(downloadPath, `${comicName}.jpg`);
    console.log('保存截图到本地文件系统')
    fs.writeFileSync(filename, buffer);
    console.log('截图已保存到', filename);
}

//下一页
async function pageNext(page) {
    const elementHandle = await page.$('#cp_image');
    await elementHandle.click({ button: 'left', });
    console.log('下一页')
}



