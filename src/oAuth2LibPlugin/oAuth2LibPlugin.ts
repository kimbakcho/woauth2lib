import type {App} from "@vue/runtime-core";
import {createPinia, defineStore, getActivePinia} from "pinia";
import {inject, ref} from "vue";
import router from "@/router";
import axios from "axios";
import * as jose from 'jose'

export type UserResDto = {
    department: string|null,
    sub: string|null,
    role: string|null
}

export const userStore = defineStore('userStore', () => {
    const userInfo = ref<UserResDto>({
        department: null,
        role: null,
        sub: null
    })
    const isLogin = ref(false)
    return {userInfo, isLogin}
})

const oauth2Info = {
    authServer_uri: null as string | null,
    redirect_uri: null as string | null,
    client_id: null as string | null,
    state: null as string | null,
    token_uri: null as string | null,
    verified_uri: null as string | null
}



export default {
    install: (app: App, options: {
        authServer_uri: string,
        redirect_uri: string,
        client_id: string,
        state: string,
        token_uri: string,
        verified_uri: string
    }) => {
        const pinia = getActivePinia()
        if (!pinia) {
            app.use(createPinia())
        }
        oauth2Info.authServer_uri = options.authServer_uri
        oauth2Info.redirect_uri = options.redirect_uri
        oauth2Info.client_id = options.client_id
        oauth2Info.state = options.state
        oauth2Info.token_uri = options.token_uri
        oauth2Info.verified_uri = options.verified_uri
        userStore()

    }
}

export const goLogInPage = function () {
    location.href = `${oauth2Info.authServer_uri}?` +
        `response_type=code&` +
        `client_id=${oauth2Info.client_id}&` +
        `redirect_uri=${oauth2Info.redirect_uri}&` +
        `state=${oauth2Info.state}&` +
        `scope=openid`
}
let rsaPublicKey: any = null
export const setupRedirect = async function () {
    if (!oauth2Info.token_uri || !oauth2Info.redirect_uri) {
        throw Error("need set token_uri or need set redirect_uri")
    }
    const formData = new FormData()
    const query: any = router.currentRoute.value.query
    formData.append("grant_type","authorization_code")
    formData.append("code", query.code)
    formData.append("state", query.state)
    formData.append("scope", "openid")
    formData.append("redirect_uri", oauth2Info.redirect_uri)
    const res = await axios.post<{
        access_token: string,
        expires_in: number,
        id_token: string,
        refresh_token: string,
        scope: string,
        token_type: string
    }>(oauth2Info.token_uri, formData)
    let idToken = res.data.id_token;
    localStorage.setItem("wTokenOpenid",idToken)
    localStorage.setItem("wReToken",res.data.refresh_token)
    const sToken = idToken.split(".");
    const header: any = JSON.parse(atob(sToken[0]))
    const payload: any = JSON.parse(atob(sToken[1]))
    const jwkUrl = `${payload.iss}/.well-known/jwks.json`
    const jwks = await axios.get(jwkUrl)
    const key = jwks.data.keys.filter((x: any)=>{
        return x.kid == header.kid
    })
    rsaPublicKey = null
    if(key){
        rsaPublicKey= await jose.importJWK(key[0],header.alg)
    }else {
        throw Error("jwk key error")
    }
    if(!rsaPublicKey){
        throw Error("rsaPublicKey error")
    }
    const verifyRes= await jose.jwtVerify(idToken,rsaPublicKey)
    const userStore1 = userStore();
    userStore1.userInfo = verifyRes.payload as UserResDto
    userStore1.isLogin = true
    axios.defaults.headers.common['Authorization'] = "Bearer "+idToken
    reTokenSch()
}

let refreshTokenSch = -1
function reTokenSch(){
    if(refreshTokenSch >= 0){
        clearInterval(refreshTokenSch)
    }
    refreshTokenSch = setInterval(async ()=>{
        let reFreshToken = localStorage.getItem("wReToken")
        if(!reFreshToken){
            return
        }
        const formData = new FormData()
        formData.append("grant_type","refresh_token")
        formData.append("refresh_token",reFreshToken!)
        const token = await axios.post(oauth2Info.token_uri!,formData)
        localStorage.setItem("wReToken",token.data.refresh_token)
        const userStore1 = userStore();
        if(!rsaPublicKey){
            return
        }
        let idToken = token.data.id_token;
        const verifyRes= await jose.jwtVerify(idToken,rsaPublicKey)
        userStore1.userInfo = verifyRes.payload as UserResDto
        userStore1.isLogin = true
        axios.defaults.headers.common['Authorization'] = "Bearer "+ idToken
    },10000)
}
