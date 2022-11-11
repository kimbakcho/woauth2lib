<template>
  <div>

    <RouterView>

    </RouterView>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {goLogInPage, userStore} from "@/oAuth2LibPlugin/oAuth2LibPlugin"
import router from "@/router";
onMounted(()=>{
  console.log(userStore().userId)
})

</script>

<style >
</style>
