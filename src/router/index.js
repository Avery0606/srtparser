import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () => 
  import ("@/views/Home")
const ShowSrts = () =>
  import ("@/views/ShowSrts")
const ChangeSrtFile = () =>
  import ("@/views/ChangeSrtFile")
const ShowAll = () =>
  import ("@/views/ShowAll")

Vue.use(VueRouter)
const routes = [
  {
    path:"/",
    redirect:"/home"
  },
  {
    path:"/home",
    name:"home",
    component:Home
  },
  {
    path:"/showsrts",
    name:"showsrts",
    component:ShowSrts
  },
  {
    path:"/changeSrtFile",
    name:"changeSrtFile",
    component:ChangeSrtFile
  },
  {
    path:"/showAll",
    name:"showAll",
    component:ShowAll
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

