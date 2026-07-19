// 根据给定时间判断首页问候使用的时间段
// 输入参数：currentDate，当前的 Date 对象
// 返回结果：Morning、Day、Evening 或 Late Night
function getGreetingPeriod(currentDate){
 const hour=currentDate.getHours();
 if(hour>=6&&hour<12)return "Morning";
 if(hour>=12&&hour<18)return "Day";
 if(hour>=18&&hour<23)return "Evening";
 return "Late Night";
}

// 预留生日判断接口，后续接入用户资料后实现
// 输入参数：context，当前问候环境信息
// 返回结果：当前版本始终返回 false
function isBirthday(context){
 return false;
}

// 预留纪念日判断接口，后续接入纪念日设置后实现
// 输入参数：context，当前问候环境信息
// 返回结果：当前版本始终返回 false
function isAnniversary(context){
 return false;
}

// 预留节日判断接口，后续接入节日数据后实现
// 输入参数：context，当前问候环境信息
// 返回结果：当前版本始终返回 false
function isHoliday(context){
 return false;
}

// 收集首页问候所需的当前环境信息，并预留未来扩展字段
// 输入参数：currentDate，可选的当前 Date 对象，默认使用系统当前时间
// 返回结果：包含时间、日期、星期及未来问候条件的 GreetingContext 对象
function createGreetingContext(currentDate=new Date()){
 const context={
   period:getGreetingPeriod(currentDate),
   date:new Date(currentDate),
   weekday:currentDate.getDay(),
   month:currentDate.getMonth()+1,
   day:currentDate.getDate(),
   isBirthday:false,
   isAnniversary:false,
   isHoliday:false,
   weather:null,
   temperature:null,
   isRaining:false,
   budgetStatus:null,
   streak:0
 };
 context.isBirthday=isBirthday(context);
 context.isAnniversary=isAnniversary(context);
 context.isHoliday=isHoliday(context);
 return context;
}

// 返回未来每日固定问候可使用的日期缓存键
// 输入参数：context，当前 GreetingContext 对象
// 返回结果：按日期生成的缓存键字符串
function getGreetingCacheKey(context){
 return "ourLedger_greeting_"+context.date.getFullYear()+"-"+String(context.month).padStart(2,"0")+"-"+String(context.day).padStart(2,"0");
}
