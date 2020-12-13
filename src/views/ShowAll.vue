<template>
  <div id="ShowAll">
    <div class="main">
      <div class="data-box">
        <div v-for="sx in subtitles" :key="sx.sid" class="sx">
          <div style="font-weight:bold">{{sx.sid}}</div>
          <div>开始时间: {{sx.begin.hour}}:{{sx.begin.minute}}:{{sx.begin.second}}:{{sx.begin.msecond}}</div>
          <div>结束时间: {{sx.end.hour}}:{{sx.end.minute}}:{{sx.end.second}}:{{sx.end.msecond}}</div>
          <h3><div v-html="sx.str"></div></h3>
        </div>
      </div>
      <div class="turnBackBtn" @click="turnBack">
        <div>返回</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
name: 'ShowAll',
  data() {
    return {
      subtitles:[],
    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.subtitles = this.$store.state.subtitles;
    this.handleContent();
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {

  },
  methods:{
    turnBack:function(){
      this.$router.push("/home")
    },
    handleContent:function(){
      let n = this.subtitles.length;
      for(let i = 0;i<n;i++){
        let str = "";
        for(let j = 0;j<this.subtitles[i].content.length;j++){
          str += this.subtitles[i].content[j] + "<br>"
        }
        this.subtitles[i].str = str;
      }
    }
  }
}
</script>
<style>
.data-box{
  overflow: auto;
  height:70%;
  width:80%;
  box-shadow: inset 0 2px 5px rgba(0,0,0,.1);
}
.data-box::-webkit-scrollbar{
  width:8px;
}
.data-box::-webkit-scrollbar-thumb{
  outline: none;
  border:1px solid rgb(236,236,236);
  background-color: rgb(236,236,236);
  border-radius: 2px;
  transition: 0.3s;
}
.data-box::-webkit-scrollbar-thumb:hover{
  background-color: rgb(199,201,204);
  border-color: rgb(199,201,204);
}
.sx{
  border: 1px solid rgb(235,238,245);
  padding-top:5px;
  padding-left:10px;
  margin:5px;
  transition: 0.3s;
}
.sx:hover{
  box-shadow: 0 0 12px 0 rgba(0,0,0,.1);
  
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