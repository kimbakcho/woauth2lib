import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import oAuth2LibPlugin from "@/oAuth2LibPlugin/oAuth2LibPlugin"
import axios from "axios";

const app = createApp(App)

app.use(createPinia())

app.use(router)

app.use(oAuth2LibPlugin,{
    authServer_uri: "http://10.20.10.114/wOauth2/o/authorize/",
    authServerLogout_uri: "http://10.20.10.114/wOauth2/logout/",
    token_uri:"http://10.20.10.114/wisolMainLogin/r/token/",
    verified_uri: "http://10.20.10.114/wisolMainLogin/r/verified/",
    tokenRevoke_uri:"http://10.20.10.114/wisolMainLogin/r/revoke/",
    redirect_uri: import.meta.env.PROD ?
        "http://10.20.10.114/oAuthe2Test/redirect" : "http://127.0.0.1:5173/oAuth2RedirectPage",
    client_id: "wisolMain",
    state: "cef",
    axios: axios
})

app.mount('#app')



