<template>
  <div id="ChangeSrtFile">
    <div class="main">
      <div class="changeTools">
        <h1>字幕平移设置</h1>
        <h2>- 加快 / + 延迟 s</h2>
        <el-input-number v-model="num" :precision="3" :step="0.1" :max="10" :min="min"></el-input-number>
      </div>
      <div class="actions">
        <div class="saveBtn" @click="saveChange">
          <div>保存</div>
        </div>
        <div class="saveFileBtn" @click="saveInFile">
          <div>保存并下载</div>
        </div>
        <div class="turnBackBtn" @click="turnBack">
          <div>返回</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChangeSrtFile',
  data() {
    return {
      subtitles:[],
      num:0.000,
      min:0.000,
    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.subtitles = this.$store.state.subtitles;
    this.min = this.subtitles.length > 0 ? -this.subtitles[0].begin.second : 0.000;
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {

  },
  methods:{
    saveChange:function(){//保存更改 不修改文件
      if(!this.judgeHasSrt())return;
      let subtitles = this.subtitles;
      let n = subtitles.length;
      let dur = this.num*1000;
      for(let i = 0;i<n;i++){
        let {begin,end} = subtitles[i];
        begin = this.getTime(this.getMs(begin,dur));
        end = this.getTime(this.getMs(end,dur));
        subtitles[i].begin.hour = begin.hour;
        subtitles[i].begin.minute = begin.minute;
        subtitles[i].begin.second = begin.second;
        subtitles[i].begin.msecond = begin.msecond;
        subtitles[i].end.hour = end.hour;
        subtitles[i].end.minute = end.minute;
        subtitles[i].end.second = end.second;
        subtitles[i].end.msecond = end.msecond;
      }
      this.min = -subtitles[0].begin.second;
      this.$store.commit("saveSubts",subtitles);
      this.$message({
        message:"保存更改成功！",
        type:"success"
      })
    },
    saveInFile:function(){//保存更改 并下载修改后的文件
      if(!this.judgeHasSrt())return;
      try{
        this.saveChange();
        let srt = this.toSrt();
        this.exportRaw('test.srt',srt.slice(0,srt.length - 2));
        let that = this;
        setTimeout(()=>{
          that.$message({
            message:"srt文件生成成功！",
            type:"success"
          })
        },500);
      }catch(err){
        console.log(err);
        this.$message({
          message:"srt文件生成失败！",
          type:"error"
        })
      }
    },
    judgeHasSrt:function(){//判断是否已经加载了字幕文件
      let n = this.subtitles.length;
      if(n == 0){
        this.$message({
          message:"字幕文件尚未加载！",
          type:"warning"
        })
        return false;
      }
      return true;
    },
    fakeClick:function(obj){
      var ev = document.createEvent("MouseEvents");
      ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      obj.dispatchEvent(ev);
    },
    exportRaw:function (name, data) {//生成文件并下载
      var urlObject = window.URL || window.webkitURL || window;
      var export_blob = new Blob([data]);
      var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
      save_link.href = urlObject.createObjectURL(export_blob);
      save_link.download = name;
      this.fakeClick(save_link);
    },
    turnBack:function(){//返回主页
      this.$router.push("/home")
    },
    getMs:function(T,dur){//获取总毫秒
      return (T.hour*3600 + T.minute*60 + T.second/1)*1000 + (T.msecond/1) + dur;
    },
    getTime:function(ms){//毫秒分解成小时分钟秒毫秒的结构
      let hour = Math.trunc(ms/1000/3600) + "";
      hour.length == 1 ? hour = "0" + hour : 0;
      let minute = Math.trunc(ms/1000/60)%60 + "";
      minute.length == 1 ? minute = "0" + minute : 0;
      let second = Math.trunc(ms/1000)%60 + "";
      second.length == 1 ? second = "0" + second : 0;
      let msecond = ms%1000 + ""
      if(msecond.length == 1 ){
        msecond = "00" + msecond
      }else if(msecond.length == 2){
        msecond = "0" + msecond
      }
      return {hour,minute,second,msecond}
    },
    toSrt:function(){//生成srt文件结构的字符串
      let subtitles = this.subtitles.slice(0);
      subtitles.sort((a,b)=>(a.sid - b.sid))
      let n = subtitles.length;
      let srt = "";
      for(let i = 0;i<n;i++){
        let sx = subtitles[i];
        srt += sx.sid + "\r\n";
        srt += sx.begin.hour + ":" + sx.begin.minute + ":" + sx.begin.second + "," + sx.begin.msecond;
        srt += " --> ";
        srt += sx.end.hour + ":" + sx.end.minute + ":" + sx.end.second + "," + sx.end.msecond;
        srt += "\r\n"
        for(let j = 0;j<sx.content.length;j++){
          srt += sx.content[j] + "\r\n"
        }
        srt += "\r\n"
      }
      return srt;
    }
  }
}
</script>
<style>
.changeTools{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.changeTools h1{
  cursor: default;
}
.changeTools h2{
  cursor: default;
}
.actions{
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
  width: 50%;
}
.saveBtn{
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color:#fff;
  padding:5px 20px;
  border:1px solid #67c23a;
  background-color: #67c23a;
  border-radius: 5px;
  transition: 0.1s;
}
.saveBtn:hover{
  border-color:#85ce61;
  background-color: #85ce61;
}
.saveFileBtn{
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color:#fff;
  padding:5px 20px;
  border:1px solid #f56c6c;
  background-color: #f56c6c;
  border-radius: 5px;
  transition: 0.1s;
}
.saveFileBtn:hover{
  border-color:#f78989;
  background-color:#f78989;
}
.turnBackBtn{
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color:#606266;
  padding:5px 20px;
  border:1px solid #dcdfe6;
  background-color: #fff;
  border-radius: 5px;
  transition: 0.1s;
}
.turnBackBtn:hover{
  color: #409eff;
  border-color:#c6e2ff;
  background-color: #ecf5ff;
}
</style>