import { defineStore } from "pinia";
import axios from "axios";

export const useCounterStore = defineStore("counter", {
    state: () => ({
        baseUrl: "http://localhost:3000",
        clientBaseUrl: "http://localhost:8080",
        isLogin: false,
        isVerified: false,
        movies: [],
        page: "1",
        detail: {}
    }),
    getters: {},
    actions: {
        async loginHandler(payload) {
            try {
                const { data } = await axios({
                    url: this.baseUrl + '/login',
                    method: "POST",
                    data: payload
                })
                localStorage.access_token = data.access_token
                this.isLogin = true
                this.router.push('/')
                this.fetchMovies()
            } catch (err) {
                console.log(err.response.data);
            }
        },
        async registerHandler(payload) {
            try {
                const { data } = await axios({
                    url: this.baseUrl + "/register",
                    method: "POST",
                    data: payload
                })
                this.router.push('/confirmation')
            } catch (err) {
                console.log(err.response.data);
            }
        },
        async confirmationHandler(token) {
            try {
                const { data } = await axios({
                    url: this.baseUrl + '/confirmation/' + token,
                    method: "PATCH"
                })
                if(data.message !== "Verified") throw { name: "invalid_token" }
                localStorage.status = "Verified"
                this.isVerified = true
            } catch (err) {
                console.log(err.response.data);
            }
        },
        async fetchMovies() {
            try {
                const { data } = await axios({
                    method: "GET",
                    url: this.baseUrl + "/movies/",
                    params: { page: this.page },
                });
                this.movies = data.movies;
            } catch (err) {
                console.log(err.response.data);
            }
        },
        async detailMovie(id) {
            try {
                const { data } = await axios({
                    method: "GET",
                    url: this.baseUrl + "/movies/" + id
                })
                this.detail = data
            } catch (err) {
                console.log(err.response.data);
            }
        },
        logout() {
            localStorage.clear()
            this.isLogin = false
            this.router.push('/login')
        }
    },
});