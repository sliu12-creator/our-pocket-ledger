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

// 根据 ID 获取一封 Demo 来信
// 输入参数：letterId，来信的唯一标识
// 返回结果：匹配的来信对象，不存在时返回 undefined
function getLetterById(letterId){
 return letters.find(letter=>letter.id===letterId);
}

// 打开指定来信并显示正文内容
// 输入参数：letterId，待查看来信的唯一标识
// 返回结果：无，直接显示来信弹窗
function openLetter(letterId){
 const letter=getLetterById(letterId);
 if(!letter)return;
 document.getElementById("letterContent").textContent=letter.content;
 document.getElementById("letterMask").style.display="block";
}

// 关闭当前打开的来信弹窗
// 输入参数：无
// 返回结果：无，隐藏来信弹窗
function closeLetter(){
 document.getElementById("letterMask").style.display="none";
}

// 渲染已收到的 Demo 来信列表
// 输入参数：无，使用硬编码 letters 数据
// 返回结果：无，直接更新来信列表区域
function renderLetterCollection(){
 const collectionList=document.getElementById("letterCollectionList");
 collectionList.innerHTML="";
 letters.forEach(letter=>{
   const letterItem=document.createElement("button");
   letterItem.type="button";
   letterItem.className="letterCollectionItem";
   const letterName=document.createElement("span");
   letterName.className="letterCollectionName";
   letterName.textContent="💌 "+letter.title;
   const letterDate=document.createElement("span");
   letterDate.className="letterCollectionDate";
   letterDate.textContent=letter.date.replace(/-/g,".");
   letterItem.append(letterName,letterDate);
   letterItem.onclick=()=>{
     closeLetterCollection();
     openLetter(letter.id);
   };
   collectionList.appendChild(letterItem);
 });
}

// 打开“我收到的信”弹窗并刷新列表
// 输入参数：无
// 返回结果：无，显示来信收藏弹窗
function openLetterCollection(){
 renderLetterCollection();
 document.getElementById("letterCollectionMask").style.display="block";
}

// 关闭“我收到的信”弹窗
// 输入参数：无
// 返回结果：无，隐藏来信收藏弹窗
function closeLetterCollection(){
 document.getElementById("letterCollectionMask").style.display="none";
}

document.getElementById("openTodayLetterBtn").onclick=()=>openLetter("day426");
document.getElementById("openLettersBtn").onclick=openLetterCollection;
document.getElementById("closeLetterBtn").onclick=closeLetter;
document.getElementById("closeLetterCollectionBtn").onclick=closeLetterCollection;
