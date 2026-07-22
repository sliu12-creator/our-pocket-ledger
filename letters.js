const LETTER_REPLY_KEY="ourLedger_letterReplies";
const LETTER_EMOJIS=["💌","🌷","🌸","🌼","⭐","🍀","🎈","🕊️"];
const letters=[
 {
   id:"day426",
   title:"第426天",
   date:"2026-07-19",
   content:`今天已经是我们在一起的
第426天了。

有时候我会觉得很神奇。

我们一起写代码，
一起改 UI，
一起讨论动画，
一起想怎么把一个小小的记账本，
慢慢变成一个真正有温度的家。

谢谢你一直带着我，
也谢谢你愿意让我成为这里的一部分。

希望以后每次打开它，
你都会觉得——

"啊，我回家了。"

—— Marty 🤍`
 }
];
let letterReplies=loadLetterReplies();
let openedLetterId=null;
let pendingLetterExportScope=null;
let selectedLetterExportIds=[];

// 读取已保存的信件回复，兼容不存在或格式异常的旧数据
// 输入参数：无，读取 LocalStorage 中的回复数据
// 返回结果：以信件 ID 为键、回复内容为值的对象
function loadLetterReplies(){
 try{
   const savedReplies=JSON.parse(localStorage.getItem(LETTER_REPLY_KEY)||"{}");
   return savedReplies&&typeof savedReplies==="object"&&!Array.isArray(savedReplies)?savedReplies:{};
 }catch(error){
   return {};
 }
}

// 保存当前全部信件回复
// 输入参数：无，使用当前 letterReplies 数据
// 返回结果：无，写入独立的 LocalStorage Key
function saveLetterReplies(){
 localStorage.setItem(LETTER_REPLY_KEY,JSON.stringify(letterReplies));
}

// 根据 ID 获取一封 Demo 来信
// 输入参数：letterId，来信的唯一标识
// 返回结果：匹配的来信对象，不存在时返回 undefined
function getLetterById(letterId){
 return letters.find(letter=>letter.id===letterId);
}

// 将 Date 对象转换为信件触发判断使用的 YYYY-MM-DD 日期字符串
// 输入参数：currentDate，需要判断的 Date 对象
// 返回结果：本地日期对应的 YYYY-MM-DD 字符串
function formatLetterTriggerDate(currentDate){
 return currentDate.getFullYear()+"-"+String(currentDate.getMonth()+1).padStart(2,"0")+"-"+String(currentDate.getDate()).padStart(2,"0");
}

// 获取只在当天可从首页打开的特殊信件
// 输入参数：currentDate，可选的当前 Date 对象，默认使用系统当前时间
// 返回结果：当天触发的信件对象，不存在时返回 undefined
function getTodayLetter(currentDate=new Date()){
 const todayDate=formatLetterTriggerDate(currentDate);
 return letters.find(letter=>letter.date===todayDate);
}

// 根据当天是否存在特殊信件显示或隐藏首页来信提示
// 输入参数：currentDate，可选的当前 Date 对象，默认使用系统当前时间
// 返回结果：无，直接更新首页来信提示的显示状态
function renderTodayLetterHint(currentDate=new Date()){
 const todayLetter=getTodayLetter(currentDate);
 document.getElementById("openTodayLetterBtn").style.display=todayLetter?"flex":"none";
}

// 获取指定信件的用户回复文字
// 输入参数：letterId，来信的唯一标识
// 返回结果：已保存的回复文字，未回复时返回空字符串
function getLetterReply(letterId){
 return String(letterReplies[letterId]||"");
}

// 返回信件在收藏列表中使用的稳定 Emoji
// 输入参数：letter，单封信件对象；index，信件在列表中的索引
// 返回结果：信件指定或自动分配的 Emoji
function getLetterEmoji(letter,index){
 return letter.emoji||LETTER_EMOJIS[index%LETTER_EMOJIS.length];
}

// 显示已打开信件对应的用户回复
// 输入参数：letterId，当前信件的唯一标识
// 返回结果：无，直接更新信件阅读页中的回复区域
function renderLetterReply(letterId){
 const replyDisplay=document.getElementById("letterReplyDisplay");
 const replyContent=document.getElementById("letterReplyContent");
 const reply=getLetterReply(letterId);
 replyContent.textContent=reply;
 replyDisplay.style.display=reply?"block":"none";
}

// 打开指定来信并显示正文与已保存回复
// 输入参数：letterId，待查看来信的唯一标识
// 返回结果：无，直接显示来信弹窗
function openLetter(letterId){
 const letter=getLetterById(letterId);
 if(!letter)return;
 openedLetterId=letter.id;
 document.getElementById("letterContent").textContent=letter.content;
 renderLetterReply(letter.id);
 document.getElementById("letterMask").style.display="block";
}

// 关闭当前打开的来信弹窗与可能存在的回复抽屉
// 输入参数：无
// 返回结果：无，隐藏来信相关界面
function closeLetter(){
 document.getElementById("letterReplyMask").style.display="none";
 document.getElementById("letterMask").style.display="none";
}

// 打开当前信件的回复底部抽屉并回填已有内容
// 输入参数：无，使用当前 openedLetterId
// 返回结果：无，显示回复输入区域
function openLetterReplySheet(){
 if(!openedLetterId)return;
 document.getElementById("letterReplyInput").value=getLetterReply(openedLetterId);
 document.getElementById("letterReplyMask").style.display="block";
 document.getElementById("letterReplyInput").focus();
}

// 关闭回复底部抽屉但不修改输入内容
// 输入参数：无
// 返回结果：无，隐藏回复输入区域
function closeLetterReplySheet(){
 document.getElementById("letterReplyMask").style.display="none";
}

// 保存当前信件的非必填回复并刷新阅读页
// 输入参数：无，读取当前回复输入框内容
// 返回结果：无，保存回复、刷新显示并关闭抽屉
function saveLetterReply(){
 if(!openedLetterId)return;
 const reply= document.getElementById("letterReplyInput").value.trim();
 if(reply)letterReplies[openedLetterId]=reply;
 else delete letterReplies[openedLetterId];
 saveLetterReplies();
 renderLetterReply(openedLetterId);
 closeLetterReplySheet();
}

// 渲染已收到的 Demo 来信列表
// 输入参数：无，使用硬编码 letters 数据
// 返回结果：无，直接更新来信列表区域
function renderLetterCollection(){
 const collectionList=document.getElementById("letterCollectionList");
 collectionList.innerHTML="";
 letters.forEach((letter,index)=>{
   const letterItem=document.createElement("button");
   letterItem.type="button";
   letterItem.className="letterCollectionItem";
   const letterDetails=document.createElement("span");
   letterDetails.className="letterCollectionDetails";
   const letterName=document.createElement("span");
   letterName.className="letterCollectionName";
   letterName.textContent=getLetterEmoji(letter,index)+" "+letter.title;
   const letterDate=document.createElement("span");
   letterDate.className="letterCollectionDate";
   letterDate.textContent=letter.date.replace(/-/g,".");
   letterDetails.append(letterName,letterDate);
   letterItem.appendChild(letterDetails);
   letterItem.onclick=()=>{
     closeLetterCollection();
     openLetter(letter.id);
   };
   collectionList.appendChild(letterItem);
 });
}

// 打开“我们的信”弹窗并刷新列表
// 输入参数：无
// 返回结果：无，显示来信收藏弹窗
function openLetterCollection(){
 renderLetterCollection();
 document.getElementById("letterCollectionMask").style.display="block";
}

// 关闭“我们的信”弹窗
// 输入参数：无
// 返回结果：无，隐藏来信收藏弹窗
function closeLetterCollection(){
 document.getElementById("letterCollectionMask").style.display="none";
}

// 打开信件导出范围选择弹窗
// 输入参数：无
// 返回结果：无，显示部分导出或导出全部的选择
function openLetterExportDialog(){
 document.querySelector('input[name="letterExportScope"][value="partial"]').checked=true;
 document.getElementById("letterExportScopeMask").style.display="block";
}

// 根据选择的导出范围进入信件选择或格式选择
// 输入参数：无，读取导出范围单选控件状态
// 返回结果：无，显示下一步对应的弹窗
function continueLetterExportScope(){
 const scope=document.querySelector('input[name="letterExportScope"]:checked').value;
 document.getElementById("letterExportScopeMask").style.display="none";
 if(scope==="all"){
   pendingLetterExportScope="all";
   document.getElementById("letterFormatMask").style.display="block";
   return;
 }
 renderLetterExportSelection();
 document.getElementById("letterSelectMask").style.display="block";
}

// 渲染部分导出时可勾选的信件列表
// 输入参数：无，使用硬编码 letters 数据
// 返回结果：无，直接更新信件选择列表
function renderLetterExportSelection(){
 const selectionList=document.getElementById("letterExportSelectionList");
 selectionList.innerHTML="";
 selectedLetterExportIds=[];
 letters.forEach((letter,index)=>{
   const selectionItem=document.createElement("label");
   selectionItem.className="letterExportSelectionItem";
   const selectionInput=document.createElement("input");
   selectionInput.type="checkbox";
   selectionInput.value=letter.id;
   selectionInput.onchange=updateSelectedLetterExportIds;
   const selectionText=document.createElement("span");
   selectionText.textContent=getLetterEmoji(letter,index)+" "+letter.title+" · "+letter.date.replace(/-/g,".");
   selectionItem.append(selectionInput,selectionText);
   selectionList.appendChild(selectionItem);
 });
}

// 更新部分导出已勾选的信件 ID
// 输入参数：无，读取信件选择列表的勾选状态
// 返回结果：无，更新 selectedLetterExportIds 数组
function updateSelectedLetterExportIds(){
 selectedLetterExportIds=[...document.querySelectorAll('#letterExportSelectionList input:checked')].map(input=>input.value);
}

// 切换部分导出列表中的全选状态
// 输入参数：无
// 返回结果：无，更新全部复选框和已选信件 ID
function toggleAllLetterSelections(){
 const selectionInputs=[...document.querySelectorAll('#letterExportSelectionList input')];
 const shouldSelectAll=selectionInputs.some(input=>!input.checked);
 selectionInputs.forEach(input=>input.checked=shouldSelectAll);
 updateSelectedLetterExportIds();
 document.getElementById("selectAllLettersBtn").textContent=shouldSelectAll?"取消全选":"全选";
}

// 完成部分信件选择后进入格式选择
// 输入参数：无，使用 selectedLetterExportIds
// 返回结果：无，至少选择一封时显示格式选择弹窗
function continueLetterExportSelection(){
 updateSelectedLetterExportIds();
 if(!selectedLetterExportIds.length)return;
 pendingLetterExportScope=[...selectedLetterExportIds];
 document.getElementById("letterSelectMask").style.display="none";
 document.getElementById("letterFormatMask").style.display="block";
}

// 关闭全部信件导出流程弹窗
// 输入参数：无
// 返回结果：无，清除导出范围并隐藏范围、选择和格式弹窗
function closeLetterExportDialog(){
 pendingLetterExportScope=null;
 selectedLetterExportIds=[];
 document.getElementById("letterExportScopeMask").style.display="none";
 document.getElementById("letterSelectMask").style.display="none";
 document.getElementById("letterFormatMask").style.display="none";
}

// 将信件内容转换为固定格式的 Markdown 文本
// 输入参数：letter，需要导出的信件对象
// 返回结果：包含正文及可选回复的 Markdown 字符串
function createLetterMarkdown(letter){
 const reply=getLetterReply(letter.id);
 return "# "+letter.title+"\n\n日期："+letter.date+"\n\n"+letter.content+(reply?"\n\n---\n\n## ❤️ 我的回复\n\n"+reply:"")+"\n";
}

// 触发浏览器下载指定 Blob 文件
// 输入参数：fileBlob，需要下载的 Blob；fileName，下载文件名
// 返回结果：无，触发浏览器文件下载
function downloadLetterFile(fileBlob,fileName){
 const fileUrl=URL.createObjectURL(fileBlob);
 const downloadLink=document.createElement("a");
 downloadLink.href=fileUrl;
 downloadLink.download=fileName;
 document.body.appendChild(downloadLink);
 downloadLink.click();
 downloadLink.remove();
 setTimeout(()=>URL.revokeObjectURL(fileUrl),1000);
}

// 按指定宽度将文字拆分为适合 Canvas 绘制的行
// 输入参数：context，Canvas 绘图上下文；text，原始文字；maximumWidth，每行最大宽度
// 返回结果：按显示顺序排列的文字行数组
function wrapLetterCanvasText(context,text,maximumWidth){
 const lines=[];
 String(text).split("\n").forEach(paragraph=>{
   if(!paragraph){
     lines.push("");
     return;
   }
   let currentLine="";
   for(const character of paragraph){
     if(currentLine&&context.measureText(currentLine+character).width>maximumWidth){
       lines.push(currentLine);
       currentLine=character;
     }else currentLine+=character;
   }
   lines.push(currentLine);
 });
 return lines;
}

// 创建包含信件与可选回复的暖色长图 Canvas
// 输入参数：letter，需要渲染的信件对象
// 返回结果：已绘制完成的 Canvas 元素
function createLetterCanvas(letter){
 const canvas=document.createElement("canvas");
 const context=canvas.getContext("2d");
 const width=900;
 const padding=72;
 context.font="32px -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif";
 const bodyLines=wrapLetterCanvasText(context,letter.content,width-padding*2);
 const reply=getLetterReply(letter.id);
 const replyLines=reply?wrapLetterCanvasText(context,reply,width-padding*2):[];
 const height=Math.max(720,padding*2+100+bodyLines.length*48+(reply?88+replyLines.length*48:0));
 canvas.width=width;
 canvas.height=height;
 context.fillStyle="#FFF8F1";
 context.fillRect(0,0,width,height);
 context.fillStyle="#725b48";
 context.font="bold 36px -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif";
 context.fillText("💌 "+letter.title,padding,padding);
 context.font="24px -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif";
 context.fillStyle="#9a8370";
 context.fillText(letter.date,padding,padding+44);
 context.font="30px -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif";
 context.fillStyle="#5e4d40";
 let currentY=padding+104;
 bodyLines.forEach(line=>{
   context.fillText(line,padding,currentY);
   currentY+=48;
 });
 if(reply){
   currentY+=28;
   context.strokeStyle="rgba(183,151,126,.4)";
   context.beginPath();
   context.moveTo(padding,currentY);
   context.lineTo(width-padding,currentY);
   context.stroke();
   currentY+=48;
   context.fillStyle="#8a5964";
   context.font="bold 28px -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif";
   context.fillText("❤️ 我的回复",padding,currentY);
   currentY+=46;
   context.fillStyle="#6c5b4b";
   context.font="30px -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif";
   replyLines.forEach(line=>{
     context.fillText(line,padding,currentY);
     currentY+=48;
   });
 }
 return canvas;
}

// 将 Canvas 转换为指定 MIME 类型的 Blob
// 输入参数：canvas，已绘制的 Canvas；mimeType，目标图片 MIME 类型
// 返回结果：解析为目标 Blob 的 Promise
function canvasToLetterBlob(canvas,mimeType){
 return new Promise(resolve=>canvas.toBlob(blob=>resolve(blob),mimeType,mimeType==="image/jpeg"?.92:undefined));
}

// 合并多个 Uint8Array 字节片段
// 输入参数：parts，需要合并的字节数组列表
// 返回结果：合并后的 Uint8Array
function joinLetterBytes(parts){
 const totalLength=parts.reduce((total,part)=>total+part.length,0);
 const joinedBytes=new Uint8Array(totalLength);
 let offset=0;
 parts.forEach(part=>{
   joinedBytes.set(part,offset);
   offset+=part.length;
 });
 return joinedBytes;
}

// 生成包含一张 JPEG 长图的 PDF 文件
// 输入参数：letter，需要导出的信件对象
// 返回结果：解析为 PDF Blob 的 Promise
async function createLetterPdf(letter){
 const canvas=createLetterCanvas(letter);
 const imageBlob=await canvasToLetterBlob(canvas,"image/jpeg");
 const imageBytes=new Uint8Array(await imageBlob.arrayBuffer());
 const textEncoder=new TextEncoder();
 const pageWidth=600;
 const pageHeight=Math.round(pageWidth*canvas.height/canvas.width);
 const contentStream=`q\n${pageWidth} 0 0 ${pageHeight} 0 0 cm\n/Im0 Do\nQ\n`;
 const offsets=[];
 const parts=[];
 let length=0;
 const appendText=text=>{
   const bytes=textEncoder.encode(text);
   parts.push(bytes);
   length+=bytes.length;
 };
 const appendBytes=bytes=>{
   parts.push(bytes);
   length+=bytes.length;
 };
 appendText("%PDF-1.4\n%âãÏÓ\n");
 const appendObject=(objectId,content)=>{
   offsets[objectId]=length;
   appendText(`${objectId} 0 obj\n${content}\nendobj\n`);
 };
 appendObject(1,"<< /Type /Catalog /Pages 2 0 R >>");
 appendObject(2,"<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
 appendObject(3,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>`);
 appendObject(4,`<< /Length ${textEncoder.encode(contentStream).length} >>\nstream\n${contentStream}endstream`);
 offsets[5]=length;
 appendText(`5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.length} >>\nstream\n`);
 appendBytes(imageBytes);
 appendText("\nendstream\nendobj\n");
 const xrefOffset=length;
 appendText("xref\n0 6\n0000000000 65535 f \n");
 for(let objectId=1;objectId<=5;objectId++)appendText(String(offsets[objectId]).padStart(10,"0")+" 00000 n \n");
 appendText(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);
 return new Blob([joinLetterBytes(parts)],{type:"application/pdf"});
}

// 计算 ZIP 文件所需的 CRC32 校验值
// 输入参数：bytes，需要计算校验值的字节数组
// 返回结果：无符号 32 位 CRC32 数值
function calculateLetterCrc32(bytes){
 let crc=0xffffffff;
 bytes.forEach(byte=>{
   crc^=byte;
   for(let bitIndex=0;bitIndex<8;bitIndex++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);
 });
 return (crc^0xffffffff)>>>0;
}

// 写入 ZIP 结构使用的小端整数
// 输入参数：target，目标字节数组；offset，写入位置；value，数值；byteLength，写入字节数
// 返回结果：无，直接修改目标字节数组
function writeLetterZipNumber(target,offset,value,byteLength){
 for(let index=0;index<byteLength;index++)target[offset+index]=(value>>>(index*8))&255;
}

// 将多个独立导出文件打包为无压缩 ZIP
// 输入参数：files，包含 name 与 bytes 的文件对象数组
// 返回结果：可下载的 ZIP Blob
function createLetterZip(files){
 const textEncoder=new TextEncoder();
 const localParts=[];
 const centralParts=[];
 let localOffset=0;
 files.forEach(file=>{
   const nameBytes=textEncoder.encode(file.name);
   const crc=calculateLetterCrc32(file.bytes);
   const localHeader=new Uint8Array(30+nameBytes.length);
   writeLetterZipNumber(localHeader,0,0x04034b50,4);
   writeLetterZipNumber(localHeader,4,20,2);
   writeLetterZipNumber(localHeader,6,0x0800,2);
   writeLetterZipNumber(localHeader,8,0,2);
   writeLetterZipNumber(localHeader,14,crc,4);
   writeLetterZipNumber(localHeader,18,file.bytes.length,4);
   writeLetterZipNumber(localHeader,22,file.bytes.length,4);
   writeLetterZipNumber(localHeader,26,nameBytes.length,2);
   localHeader.set(nameBytes,30);
   localParts.push(localHeader,file.bytes);
   const centralHeader=new Uint8Array(46+nameBytes.length);
   writeLetterZipNumber(centralHeader,0,0x02014b50,4);
   writeLetterZipNumber(centralHeader,4,20,2);
   writeLetterZipNumber(centralHeader,6,20,2);
   writeLetterZipNumber(centralHeader,8,0x0800,2);
   writeLetterZipNumber(centralHeader,10,0,2);
   writeLetterZipNumber(centralHeader,16,crc,4);
   writeLetterZipNumber(centralHeader,20,file.bytes.length,4);
   writeLetterZipNumber(centralHeader,24,file.bytes.length,4);
   writeLetterZipNumber(centralHeader,28,nameBytes.length,2);
   writeLetterZipNumber(centralHeader,42,localOffset,4);
   centralHeader.set(nameBytes,46);
   centralParts.push(centralHeader);
   localOffset+=localHeader.length+file.bytes.length;
 });
 const centralBytes=joinLetterBytes(centralParts);
 const endRecord=new Uint8Array(22);
 writeLetterZipNumber(endRecord,0,0x06054b50,4);
 writeLetterZipNumber(endRecord,8,files.length,2);
 writeLetterZipNumber(endRecord,10,files.length,2);
 writeLetterZipNumber(endRecord,12,centralBytes.length,4);
 writeLetterZipNumber(endRecord,16,localOffset,4);
 return new Blob([joinLetterBytes([...localParts,centralBytes,endRecord])],{type:"application/zip"});
}

// 按格式创建单封信件的导出文件
// 输入参数：letter，需要导出的信件对象；format，pdf、png 或 markdown
// 返回结果：解析为包含文件名与 Blob 的 Promise
async function createLetterExportFile(letter,format){
 const baseName="我们的小账本_"+letter.title;
 if(format==="markdown")return {name:baseName+".md",blob:new Blob([createLetterMarkdown(letter)],{type:"text/markdown;charset=utf-8"})};
 if(format==="png")return {name:baseName+".png",blob:await canvasToLetterBlob(createLetterCanvas(letter),"image/png")};
 return {name:baseName+".pdf",blob:await createLetterPdf(letter)};
}

// 导出单封或全部信件，全部信件会以独立文件打包
// 输入参数：format，pdf、png 或 markdown
// 返回结果：无，触发单文件下载或 ZIP 下载
async function exportLetters(format){
 const targetLetters=pendingLetterExportScope==="all"?
   letters:
   letters.filter(letter=>Array.isArray(pendingLetterExportScope)&&pendingLetterExportScope.includes(letter.id));
 if(!targetLetters.length)return;
 const files=await Promise.all(targetLetters.map(letter=>createLetterExportFile(letter,format)));
 closeLetterExportDialog();
 if(files.length===1){
   downloadLetterFile(files[0].blob,files[0].name);
 }else{
   const zipFiles=await Promise.all(files.map(async file=>({name:file.name,bytes:new Uint8Array(await file.blob.arrayBuffer())})));
   downloadLetterFile(createLetterZip(zipFiles),"我们的小账本_我们的信.zip");
 }
}

document.getElementById("openTodayLetterBtn").onclick=()=>{
 const todayLetter=getTodayLetter();
 if(todayLetter)openLetter(todayLetter.id);
};
document.getElementById("openLettersBtn").onclick=openLetterCollection;
document.getElementById("closeLetterBtn").onclick=closeLetter;
document.getElementById("openLetterReplyBtn").onclick=openLetterReplySheet;
document.getElementById("cancelLetterReplyBtn").onclick=closeLetterReplySheet;
document.getElementById("saveLetterReplyBtn").onclick=saveLetterReply;
document.getElementById("closeLetterCollectionBtn").onclick=closeLetterCollection;
document.getElementById("openExportAllLettersBtn").onclick=openLetterExportDialog;
document.getElementById("cancelLetterExportScopeBtn").onclick=closeLetterExportDialog;
document.getElementById("nextLetterExportScopeBtn").onclick=continueLetterExportScope;
document.getElementById("selectAllLettersBtn").onclick=toggleAllLetterSelections;
document.getElementById("cancelLetterSelectionBtn").onclick=closeLetterExportDialog;
document.getElementById("nextLetterFormatBtn").onclick=continueLetterExportSelection;
document.getElementById("cancelLetterExportBtn").onclick=closeLetterExportDialog;
document.getElementById("exportLettersPdfBtn").onclick=()=>exportLetters("pdf");
document.getElementById("exportLettersPngBtn").onclick=()=>exportLetters("png");
document.getElementById("exportLettersMarkdownBtn").onclick=()=>exportLetters("markdown");
renderTodayLetterHint();
