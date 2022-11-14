<template>
  <div style="width: 100%;height: 100%">
    <RouterView>

    </RouterView>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {goLogInPage, userStore} from "@/oAuth2LibPlugin/oAuth2LibPlugin"
import router from "@/router";
onMounted(()=>{
})

</script>

<style >
body{
  height: 100vh;
  margin: 0px;
}
</style>
