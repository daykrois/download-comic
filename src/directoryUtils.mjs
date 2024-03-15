import fs from 'fs'


async function createDirectoryIfNotExists(dirPath) {
  try {
    await fs.promises.access(dirPath, fs.constants.F_OK);
    console.log(`目录 ${dirPath} 已存在`);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // 目录不存在，创建目录
      await fs.promises.mkdir(dirPath, { recursive: true });
      console.log(`目录 ${dirPath} 已创建`);
    } else {
      console.error(err);
    }
  }
}

export default createDirectoryIfNotExists