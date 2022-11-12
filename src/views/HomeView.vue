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

import {goLogInPage, logoutOauth2Complete} from "@/oAuth2LibPlugin/oAuth2LibPlugin";

function goOatuth2() {
  goLogInPage()
}
function logout(){
  logoutOauth2Complete()
}
</script>

<style >
</style>

