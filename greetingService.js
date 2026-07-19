// 将当前时间段对应的问候渲染到首页 Greeting Card
// 输入参数：无，内部创建当前 GreetingContext 并选择示例问候
// 返回结果：无，直接更新首页问候元素内容
function renderGreeting(){
 const greetingEmoji=document.getElementById("greetingEmoji");
 const greetingMessage=document.getElementById("greetingMessage");
 if(!greetingEmoji||!greetingMessage)return;
 const greeting=selectGreeting(createGreetingContext());
 greetingEmoji.textContent=greeting.emoji;
 greetingMessage.textContent=greeting.message;
}
