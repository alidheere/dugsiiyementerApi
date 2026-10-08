import {create} from 'zustand'
import {persist} from 'zustand/middleware'

const useAuthStore=create(
    persist(
        (set,get)=>({
            user: null,
            token: null,
            isAuthenticated: false,

            setAuth:(userData,token)=>set({
                user:userData,
                token,
                isAuthenticated:true

            }),


            // clrean auth logout

            clearAuth:()=>set({
                user: null,
                token:null,
                isAuthenticated: false,
            }),

            getToken:()=>get().token
        }),


        {
            name: "Auth-Storage",
            partialize:(state)=>({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
)

export default useAuthStore