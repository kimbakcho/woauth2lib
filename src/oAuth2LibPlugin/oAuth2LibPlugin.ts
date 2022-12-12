import type {App} from "@vue/runtime-core";
import {createPinia, defineStore, getActivePinia} from "pinia";
import {ref} from "vue";

import axios from "axios";

export type UserResDto = {
    department: string|null,
    sub: string|null,
    role: string|null
}

export const userStore = defineStore('userStore', () => {
    const userInfo = ref<UserResDto|null>(null)
    const isLogin = ref(false)
    return {userInfo, isLogin}
})

const oauth2Info = {
    authServer_uri: null as string | null,
    authServerLogout_uri: null as string|null,
    token_uri: null as string | null,
    verified_uri: null as string | null,
    tokenRevoke_uri: null as string| null,
    redirect_uri: null as string | null,
    client_id: null as string | null,
    state: null as string | null,
}

let refreshTokenSch = -1
let rsaPublicKey: any = null
let appInstance : App | null= null
export default {
    install: async (app: App, options: {
        authServer_uri: string,
        authServerLogout_uri: string
        token_uri: string,
        verified_uri: string,
        tokenRevoke_uri: string,
        redirect_uri: string,
        client_id: string,
        state: string,
        done: Function | null | undefined
    }) => {
        const pinia = getActivePinia()
        if (!pinia) {
            app.use(createPinia())
        }
        appInstance = app
        oauth2Info.authServer_uri = options.authServer_uri
        oauth2Info.redirect_uri = options.redirect_uri
        oauth2Info.client_id = options.client_id
        oauth2Info.state = options.state
        oauth2Info.token_uri = options.token_uri
        oauth2Info.verified_uri = options.verified_uri
        oauth2Info.authServerLogout_uri = options.authServerLogout_uri
        oauth2Info.tokenRevoke_uri = options.tokenRevoke_uri

        const wReToken = localStorage.getItem("wReToken")
        if(!wReToken) {
            if(options.done){
                options.done()
            }
            return
        }
        if(refreshTokenSch>=0){
            clearTimeout(refreshTokenSch)
        }
        try{
            await reFreshTokenLogin()
        }finally {
            if(options.done){
                options.done()
            }
        }
    }
}


export function goLogInPage () {
    location.href = `${oauth2Info.authServer_uri}?` +
        `response_type=code&` +
        `client_id=${oauth2Info.client_id}&` +
        `redirect_uri=${oauth2Info.redirect_uri}&` +
        `state=${oauth2Info.state}&` +
        `scope=openid`
}

function getPayloadFromIdToken(idToken: string): UserResDto{
    const sToken = idToken.split(".");
    const header: any = JSON.parse(atob(sToken[0]))
    const payload: any = JSON.parse(atob(sToken[1]))
    return payload
}
function setUpLoginUser(idToken: string) {
    const userStore1 = userStore();
    userStore1.userInfo = getPayloadFromIdToken(idToken)
    userStore1.isLogin = true
    axios.defaults.headers.common['Authorization'] = "Bearer "+idToken
}
export async function setupRedirect () {
    if (!oauth2Info.token_uri || !oauth2Info.redirect_uri) {
        throw Error("need set token_uri or need set redirect_uri")
    }
    const formData = new FormData()
    const query: any = appInstance!.config.globalProperties.$router!.currentRoute.value.query
    formData.append("grant_type","authorization_code")
    formData.append("code", query.code)
    formData.append("state", query.state)
    formData.append("scope", "openid")
    formData.append("redirect_uri", oauth2Info.redirect_uri)
    try {
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
        setUpLoginUser(idToken)
        if(refreshTokenSch>=0){
            clearTimeout(refreshTokenSch)
        }
        reTokenSch()
    }catch (e) {
        console.log(e)
        throw e
    }
}
async function revokeReFreshToken(){
    const reToken= localStorage.getItem("wReToken")
    try{
        if(reToken && oauth2Info.tokenRevoke_uri) {
            const fomData = new FormData()
            fomData.append("token",reToken)
            await axios.post(oauth2Info.tokenRevoke_uri,fomData)
        }
    }catch (e) {
        throw e
    }finally {
        localStorage.removeItem("wReToken")
    }
}

async function removeToken(){
    const userStore1 = userStore();
    localStorage.removeItem("wTokenOpenid")
    userStore1.userInfo = null
    userStore1.isLogin = false
    axios.defaults.headers.common['Authorization'] = null
    await revokeReFreshToken()
}

async function reFreshTokenLogin() {
    let reFreshToken = localStorage.getItem("wReToken")
    if(!reFreshToken){
        await removeToken()
        return
    }
    const formData = new FormData()
    formData.append("grant_type","refresh_token")
    formData.append("refresh_token",reFreshToken!)
    try{
        const token = await axios.post(oauth2Info.token_uri!,formData)
        if(token.data.error){
            await removeToken()
            return
        }
        let refreshToken = token.data.refresh_token;
        localStorage.setItem("wReToken",refreshToken)
        let idToken = token.data.id_token;

        setUpLoginUser(idToken)
        reTokenSch()
    }catch (e) {
        console.log(e)
        await removeToken()
        throw e
    }
}

function reTokenSch(){
    refreshTokenSch = setTimeout(async ()=>{
        await reFreshTokenLogin()
    },1800000)
}

export async function logoutOauth2Complete() {
    await axios.post(`${oauth2Info.authServerLogout_uri}`,null,{
        withCredentials: true
    })
    await removeToken()

    if(refreshTokenSch>=0){
        clearTimeout(refreshTokenSch)
    }

    appInstance!.config.globalProperties.$router!.push({
        path:"/"
    })
}


