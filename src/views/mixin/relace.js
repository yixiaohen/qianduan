/* 匹配编辑框里的材料超链接，用于才材料预览 */
export function Preview(data, type) {
  const previewData = [];

  if (data) {
    const fileArr = data.match(/<a([\s\S]*?)<\/a>/g);
    if (fileArr) {
      fileArr.map(item => {
        let FileName = item.match(/">([\s\S]*?)<\/a>/g) || [];
        FileName = FileName.length != 0 ? FileName[0].replace(/">|<\/a>/g, '') : [];
        let herf = item.match(/Annex\/file([\s\S]*?)">/g) || [];
        herf = herf.length != 0 ? herf[0].replace(/href=|'|"|Annex\/file\/|target="_blank"|rel="noopener"|>/g, '') : [];
        if (herf.length != 0) {
          previewData.push({
            title: FileName,
            type: type,
            FileName: FileName,
            FileUrl: herf
          });
        }
      });
      return previewData;
    } else {
      return previewData;
    }
  } else {
    return previewData;
  }
}
