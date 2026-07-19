const GREETING_SAMPLES={
 Morning:{emoji:"☀️",message:"早安，宝宝。\n今天也一起慢慢生活吧。🤍"},
 Day:{emoji:"🌤️",message:"下午好。\n别忘了照顾好自己。\n累了就休息一下。🤍"},
 Evening:{emoji:"🌙",message:"晚上好，宝宝。\n欢迎回家。\n今天也一起把生活好好收起来吧。🤍"},
 "Late Night":{emoji:"🌌",message:"夜深了。\n今天辛苦了。\n早点休息，明天再继续努力。🤍"}
};

// 根据当前问候环境选择一条示例留言
// 输入参数：context，包含 period 等环境信息的 GreetingContext 对象
// 返回结果：包含 emoji 和 message 的问候对象
function selectGreeting(context){
 return GREETING_SAMPLES[context.period]||GREETING_SAMPLES["Late Night"];
}
