import puppeteer  from "puppeteer-core";

(async () => {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        headless: false
    })
    const page = await browser.newPage();
    
    await page.goto('https://www.dm5.com/m5338/',{
        waitUntil: 'domcontentloaded'
    });
    // 选择所有的img标签
    const images = await page.$$('img');
  
    // 遍历所有img标签
    for (const img of images) {
      // 获取图片的src属性
      const src = await img.evaluate(el => el.getAttribute('src'));
  
      if (src) {
        try {
          // 确保src是一个完整的URL
          const imageResponse = await fetch(src);
          console.log(imageResponse)
          const imageBuffer = await imageResponse.buffer();
          console.log(imageBuffer)
          const imageUrl = new URL(src);
          const fileName = decodeURIComponent(imageUrl.pathname).split('/').pop();
          const filePath = path.join(__dirname, fileName);
  
          // 将图片保存到本地文件系统
        //   fs.writeFileSync(filePath, imageBuffer);
          console.log(`Downloaded image: ${fileName}`);
        } catch (error) {
          console.error(`Error downloading image from ${src}:`, error);
        }
      }
    }
  
    console.log('所有图片已下载完毕。');
    await browser.close();
  })();