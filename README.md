# wisol Oauth2 로그인 Front 모듈 
## install 

``
npm install https://github.com/kimbakcho/woauth2lib
``

### 사용법

### 라우터 설치 router/index.ts
```vue
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      //Redirect 페이지
      path: "/oAuth2RedirectPage",
      name: 'oAuth2RedirectPage',
      component: () => import('../views/RedirectPage.vue')
    }
  ]
})

export default router
```
---
### main.ts
```typescript
//Pinia모듈 사용 함으로 설치 필요
import { setupRedirect } from "woauth2lib/lib/oAuth2LibPlugin"

app.use(createPinia())

app.use(router)
//Oauth2 설정
app.use(oAuth2LibPlugin,{
    authServer_uri: "http://10.20.10.114/wOauth2/o/authorize/",
    authServerLogout_uri: "http://10.20.10.114/wOauth2/logout/",
    token_uri:"http://localhost:9000/r/token/",
    verified_uri: "http://localhost:9000/r/verified/",
    tokenRevoke_uri:"http://localhost:9000/r/revoke/",
    redirect_uri: import.meta.env.PROD ?
        "http://10.20.10.114/oAuthe2Test/redirect" : "http://127.0.0.1:5173/oAuth2RedirectPage",
    client_id: "wisolMain",
    state: "cef",
})
```
---

### Redirect Page 에 설치 (../views/RedirectPage.vue)
```vue
<template>
  <div>
    로그인중
  </div>
</template>

<script setup lang="ts">

import {onMounted} from "vue";
import { setupRedirect } from "woauth2lib/lib/oAuth2LibPlugin"
import router from "@/router";
onMounted(async ()=>{
  try{
    await setupRedirect()
    await router.push({
      path:"/"
    })  
  }catch (e) {
    console.log("로그인 에러")
  }
})
</script>

<style scoped lang="scss">

</style>
```
---
### 로그인 페이지 가기 와 로그아웃
```vue
<template>
  <div>
    <button @click="goOatuth2">
      로그인 하러 가기
    </button>
    <button @click="logout">
      로그 아웃
    </button>
  </div>
</template>

<script setup lang="ts">

import { goLogInPage , logoutOauth2Complete} from "woauth2lib/lib/oAuth2LibPlugin"

function goOatuth2() {
  goLogInPage()
}
function logout(){
  logoutOauth2Complete()
}
</script>

<style >
</style>

```
