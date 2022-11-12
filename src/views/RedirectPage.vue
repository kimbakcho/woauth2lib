<template>
  <div>
    로그인중
  </div>
</template>

<script setup lang="ts">

import {onMounted} from "vue";
import {setupRedirect} from "@/oAuth2LibPlugin/oAuth2LibPlugin";
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
