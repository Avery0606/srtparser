<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin-top:40px;
  padding-top:10px;
  padding-bottom: 10px;
}
.main{
  display: flex;
  width: 700px;
  height:500px;
  border:1px solid rgb(235,238,245);
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0px 0px 12px rgba(0,0,0,.1);
  border-radius: 2%;
}
</style>
