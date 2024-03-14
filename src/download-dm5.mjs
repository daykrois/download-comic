import puppeteer from 'puppeteer-core';
import path from 'path'
import fs from 'fs'

const downloadPath = "../downloads/火凤燎原/";

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
    //创建目录
    checkAndCreateDirectory(downloadPath);
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        headless: false // 设置为 true 以在无头模式下运行
    });
    const page = await browser.newPage();
    let pageNum = 193;
    while (true) {
        await page.goto('https://tel.dm5.com/m5338-p' + pageNum, { waitUntil: 'networkidle0' });
        try {
            const element = await page.$('span.active.right-arrow');
            if (!element) {
                console.log('指定元素不存在，可能已经到达最后一页或页面结构发生变化。');
                break; // 退出循环
            }
            const textContent = await page.evaluate('el => el.textContent.trim()', element);
            let ImgName = textContent + '-' + pageNum;
            await getImg(page, css, downloadPath, ImgName);
            pageNum += 1;

        } catch (error) {
            console.log('发生错误');
            await browser.close();
        }
    }
    await browser.close();
})();

async function getImg(page, css, downloadPath, comicName) {
    // 等待图片元素加载完成
    await page.waitForSelector('#cp_image');
    // await page.waitForFunction('document.readyState === "complete" && document.fonts.ready');
    await page.addStyleTag({ content: css });
    // 捕获特定元素的截图
    const imgElement = await page.$('img#cp_image');
    const buffer = await imgElement.screenshot();
    // 保存截图到本地文件系统
    const filename = path.join(downloadPath, `${comicName}.jpg`);
    fs.writeFileSync(filename, buffer);
}

//下一页
async function pageNext(page) {
    const element = await page.$('a[href^="javascript:ShowNext();"]');
    if (element) {
        await element.click();
    } else {
        await browser.close();
    }
}
