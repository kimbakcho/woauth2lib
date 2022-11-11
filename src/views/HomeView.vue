<template>
  <div>
    <button @click="goOatuth2">
      로그인 하러 가기
    </button>
  </div>
</template>

<script setup lang="ts">

import {goLogInPage} from "@/oAuth2LibPlugin/oAuth2LibPlugin";

function goOatuth2() {
  goLogInPage()
}
</script>

<style >
</style>

