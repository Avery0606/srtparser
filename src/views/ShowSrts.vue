<template>
  <div id="ShowSrts">
    <div class="main">
      <div class="displayBtn" @click="display">
        <div>开始播放字幕</div>
      </div>
      <div id="timer">{{timer}}</div>
      <div class="displayBox">
        <h2 id="content" v-html="content"></h2>
      </div>
      <div class="turnBackBtn" @click="turnBack">
        <div>返回</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:"ShowSrts",
  data(){
    return{
      subtitles:[],
      timer:"00:00:00",
      content:"<i>srt</i>",
    }
  },
  mounted(){
    
  },
  created(){
    this.subtitles = this.$store.state.subtitles
  },
  methods:{
    displayContent:function (contentArr){
      let content = ""
      contentArr.forEach(v=>{
        content += v + "<br>"
      })
      this.content = content;
    },
    display:async function (){
      let n = this.subtitles.length;
      if(n == 0){
        this.$message({
          message:"字幕文件尚未加载！",
          type:"warning"
        })
      }else{
        this.showTimer();
        for(let i = 0;i<n;i++){
          let sx = this.subtitles[i];
          this.displayContent([]);
          await this.sleep(this.getDuration(i>0 ? this.subtitles[i - 1].end : undefined,sx.begin))
          this.displayContent(sx.content);
          await this.sleep(this.getDuration(sx.begin,sx.end))
        }
      }
    },
    getDuration:function(time1 = {//获取持续时间
      hour:0,
      minute:0,
      second:0,
      msecond:0
    },time2){
      let dur1 = time1.hour*3600 + time1.minute*60 + time1.second/1 
      let dur2 = time2.hour*3600 + time2.minute*60 + time2.second/1
      return (dur2 - dur1)*1000 + (time1.msecond - time2.msecond)
    },
    sleep:function(ms){//睡眠函数
      return new Promise((resolve) => setTimeout(resolve,ms));
    },
    showTimer:function (){
      let that = this;
      let count = 1;
      let timer = setInterval(()=>{
        that.timer = that.showNum(parseInt(count/60/60)) + ":" + that.showNum(parseInt(count/60)%60) + ":" + that.showNum(count%60);
        count++;
      },1000)
    },
    showNum:function (num){
      return num<10 ? '0' + num : '' + num
    },
    turnBack:function(){
      this.$router.push("/home")
    }
  }
} 
</script>

<style>
.displayBtn{
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color:#409eff;
  background-color: #ecf5ff;
  border:1px solid #b3d8ff;
  padding:12px;
  border-radius: 5px;
  transition: 0.2s;
}
.displayBtn:hover{
  color:#fff;
  border-color:#409eff;
  background-color: #409eff;
}
#timer{
  font-weight: bold;
  cursor: default;
  height:5%;
}
.displayBox{
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
  height:50%;
  width:90%;
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