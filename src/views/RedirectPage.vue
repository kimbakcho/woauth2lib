<template>
  <div>
    로그인중
  </div>
</template>

<script setup lang="ts">

import {onMounted} from "vue";
import {setupRedirect} from "@/oAuth2LibPlugin/oAuth2LibPlugin";
onMounted(()=>{
  setupRedirect()
})
</script>

<style scoped lang="scss">

</style>
