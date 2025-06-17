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


onMounted(async ()=>{
  try{
    await setupRedirect()
    const mainModule = await import("@/main.ts").catch(() => null);
    if (mainModule && mainModule.handleDoneCallback) {
      await mainModule.handleDoneCallback();
    }
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
