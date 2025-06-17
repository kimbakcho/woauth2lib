<template>
  <div id="mainBack">
    <div id="mainDisPlay">
      로그인 중
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted} from "vue";
import {setupRedirect} from "woauth2lib/lib/oAuth2LibPlugin";
import router from "@/router";
let handleDoneCallback: () => Promise<void> = async () => {};
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  handleDoneCallback = require("@/main.ts").handleDoneCallback;
} catch (e) {
  // 임포트 실패 시 무시
}

onMounted(async ()=>{
  try{
    await setupRedirect()
    await handleDoneCallback()
    await router.push({
      path:"/"
    })
  }catch (e) {
    alert("로그인 에러")
    console.log("로그인 에러")
  }
})
</script>

<style scoped lang="scss">
#mainBack {
  background: url("http://10.20.10.114/common/loginback.png") no-repeat center fixed;
  background-size: cover;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  #mainDisPlay {
    font-size: 3rem;
    font-weight: bold;
  }
}
</style>
