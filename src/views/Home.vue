<template>
  <div id="Home">
    <div class="main">
      <h1>SRT字幕解释器</h1>
      <div class="getInput" @click="execUpload">
        <div>{{fileName}}</div>
      </div>
      <div class="tools">
        <div class="changeSrtFile" @click="goChangeFile">修改字幕文件</div>
        <div class="showSrts" @click="goDisplay">字幕演示结果</div>
        <div class="showAll" @click="goShowAll">查看所有字幕</div>
      </div>
      <input type="file" style="display:none" @change="upload" ref="inputer"/>
    </div>
  </div>
</template>

<script>
function subt(sid,begin,end,content){//字幕结点结构
  this.sid = sid;//字幕id
  this.begin = begin;//字幕开始时间
  this.end = end;//字幕结束时间
  this.content = content;//字幕内容
}
function timeClass(hour,minute,second,msecond){//时间结构
  this.hour = hour;//小时
  this.minute = minute;//分钟
  this.second = second;//秒
  this.msecond = msecond;//毫秒
}
export default {
  name: 'Home',
  data() {
    return {
      subtitles:[],
      fileName:this.$store.state.fileName
    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {

  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {

  },
  methods:{
    execUpload:function(){
      this.$refs.inputer.click();
    },
    upload:function(){//选择字幕文件后执行的函数
      let that = this;
      let dom = that.$refs.inputer
      let file = dom.files[0];
      let reader = new FileReader();
      reader.onload = function(){
        let srt = this.result;
        try{
          let res = that.handleSrt(srt)
          if(!that.testLegal(res)){
            throw "文件损坏"
          }
          that.subtitles = res;//获取分析结果
          that.$store.commit("saveSubts",that.subtitles)
          that.$store.commit("saveFileName",file.name)
          //存储成功
          that.fileName = file.name;
          that.$message({
            message: "字幕读取分析成功！",
            type:"success"
          })
        }catch(error){
          console.log(error)
          that.$message({
            message: "文件损坏或文件类型有误！",
            type:"error"
          })
        }

      }
      reader.readAsText(file)
    },
    getMs:function(T){//获取总毫秒
      return (T.hour*3600 + T.minute*60 + T.second/1)*1000 + (T.msecond/1)
    },
    testLegal:function(res){
      let n = res.length;
      let flag = true;
      for(let i = 0;i<n;i++){
        if(this.getMs(res[i].begin)>this.getMs(res[i].end)){
          flag = false;
          console.log(res[i].sid)
        }
      }
      return flag;
    },
    handleSrt:function(srt){//字幕分析函数
      let res = [];
      let unit = srt.split("\r\n\r\n");//将所有字幕根据两个换行位置拆分成单独的字幕单元
      while(unit[unit.length - 1] == "" || unit[unit.length - 1] == "\r\n"){
        unit.pop();
      }
      for(let i = 0;i<unit.length;i++){
        let arr = unit[i].split("\r\n")//对单独的字幕单元再进行拆分 从而获取其id,持续时间,字幕内容
        let sid = arr[0]//id为第一部分
        let {begin,end} = this.handleTime(arr[1])//持续时间为第二部分 并通过函数获取开始时间和结束时间
        let contentString = arr.slice(2)//字幕内容为数组剩余部分 
        let sx = new subt(sid,begin,end,contentString);//构建字幕结点
        res.push(sx);//将字幕结点存储进结果中
      }
      res.sort((a,b)=>{//对字幕按照开始时间进行排序
        return a.begin.hour - b.begin.hour || a.begin.minute - b.begin.minute || a.begin.second - b.begin.second || a.begin.msecond - b.begin.msecond
      })
      return res;//返回最终结果
    },
    handleTime:function(str){//持续时间分析函数
      let temp = str.split(" --> ")//比对样例：01:54:02,900 --> 01:54:04,900
      //temp[0] 为开始时间部分    temp[1]为结束时间部分
      let t1 = temp[0].split(":");//分隔小时和分钟
      let t2 = temp[1].split(":");
      let se1 = t1[2].split(",");//分隔秒和毫秒
      let se2 = t2[2].split(",");
      let begin = new timeClass(t1[0],t1[1],se1[0],se1[1]);//生成开始时间
      let end = new timeClass(t2[0],t2[1],se2[0],se2[1]);//生成结束时间
      return {
        begin:begin,
        end:end
      }
    },
    goDisplay:function(){
      this.$router.push("/showsrts")
    },
    goChangeFile:function(){
      this.$router.push("/changeSrtFile")
    },
    goShowAll:function(){
      this.$router.push("/showAll")
    },
  }
}
</script>
<style>
.main h1{
  cursor: default;
}
.getInput{
  border:1px solid #dcdfe6;
  display: flex;
  justify-content: center;
  align-items: center;
  width:140px;
  height:40px;
  cursor: pointer;
  color:#606266;
  border-radius:5px;
  transition: 0.5s;
}
.getInput:hover{
  border-color:rgb(198,226,255);
  background-color: rgb(236,245,255);
  color:rgb(64,158,255);
}
.getInput div{
  
}
.tools{
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width:100%;
  height:33%;
  justify-content: space-around;
  align-items: center;
}
.tools div{
  width:30%;
  height:100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5%;
  cursor: pointer;
  transition: 0.5s;
}
.changeSrtFile{
  border:1px solid rgb(211,212,214);
  background-color: rgb(244,244,245);
  color:rgb(144,147,153);
}
.changeSrtFile:hover{
  border-color:#909399;
  background-color:#909399;
  color:#fff;
}
.showSrts{
  border:1px solid rgb(194,231,176);
  background-color: rgb(240,249,235);
  color:rgb(103,194,58);
}
.showSrts:hover{
  border-color:#67c23a;
  background-color:#67c23a;
  color:#fff;
}
.showAll{
  border:1px solid #f5dab1;
  background-color: #fdf6ec;
  color:#e6a23c;
}
.showAll:hover{
  border-color:#e6a23c;
  background-color:#e6a23c;
  color:#fff;
}



</style>