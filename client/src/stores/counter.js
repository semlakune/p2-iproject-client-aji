import { defineStore } from "pinia";
import axios from "axios";
import Swal from "sweetalert2";

export const useCounterStore = defineStore("counter", {
    state: () => ({
        baseUrl: "https://vox8.herokuapp.com",
        clientBaseUrl: "https://vox-eight.web.app",
        isLogin: false,
        isVerified: false,
        movies: [],
        series: [],
        page: 1,
        movieData: {},
        seriesData: {},
        watchlists: [],
        searchData: {},
    }),
    getters: {},
    actions: {
        async loginHandler(payload) {
            try {
                const { data } = await axios({
                    url: this.baseUrl + "/login",
                    method: "POST",
                    data: payload,
                });
                localStorage.access_token = data.access_token;
                this.isLogin = true;
                this.router.push("/");
                this.fetchMovies();
            } catch (err) {
                console.log(err.response.data);
            }
        },
        async registerHandler(payload) {
            try {
                await axios({
                    url: this.baseUrl + "/register",
                    method: "POST",
                    data: payload,
                });
                this.router.push("/confirmation");
            } catch (err) {
                console.log(err.response.data);
            }
        },
        async confirmationHandler(token) {
            try {
                const { data } = await axios({
                    url: this.baseUrl + "/confirmation/" + token,
                    method: "PATCH",
                });
                if (data.message !== "Verified")
                    throw { name: "invalid_token" };
                localStorage.status = "Verified";
                this.isVerified = true;
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
        async fetchSeries() {
            try {
                const { data } = await axios({
                    method: "GET",
                    url: this.baseUrl + "/series/",
                    params: { page: this.page },
                });
                this.series = data.series;
            } catch (err) {
                console.log(err.response.data);
            }
        },
        async detailMovie(id) {
            try {
                const { data } = await axios({
                    method: "GET",
                    url: this.baseUrl + "/movies/" + id,
                });
                this.movieData = data;
            } catch (err) {
                console.log(err.response.data);
            }
        },
        async detailSeries(id) {
            try {
                const { data } = await axios({
                    method: "GET",
                    url: this.baseUrl + "/series/" + id,
                });
                this.seriesData = data;
            } catch (err) {
                console.log(err.response.data);
            }
        },
        async createMovieWatchlist(id) {
            try {
                await axios({
                    method: "POST",
                    url: this.baseUrl + "/watchlists/movies/" + id,
                    headers: { access_token: localStorage.access_token },
                });
                this.router.push("/watchlist");
            } catch (err) {
                if (err.response.data.message == "Duplicate watchlist") {
                    Swal.fire({
                        icon: "error",
                        color: '#ffff',
                        confirmButtonText: 'Okay',
                        confirmButtonColor: '#FD390F',
                        text: "Already on the watchlist",
                        background: "#282435"
                    });
                } else if (err.response.data.message == "Unverified") {
                    Swal.fire({
                        icon: "error",
                        title: "Verify your account!",
                        color: '#ffff',
                        confirmButtonText: 'Okay',
                        confirmButtonColor: '#FD390F',
                        text: "You must verify your account to use this feature",
                        background: "#282435"
                    });
                }
            }
        },
        async createSeriesWatchlist(id) {
            try {
                await axios({
                    method: "POST",
                    url: this.baseUrl + "/watchlists/series/" + id,
                    headers: { access_token: localStorage.access_token },
                });
                this.router.push("/watchlist");
            } catch (err) {
                console.log(err.response.data);
            }
        },
        async fetchWatchlist() {
            try {
                const { data } = await axios({
                    method: "GET",
                    url: this.baseUrl + "/watchlists",
                    headers: { access_token: localStorage.access_token },
                });
                this.watchlists = data;
            } catch (err) {
                console.log(err.response.data);
            }
        },
        async deleteWatchlist(id) {
            try {
                await axios({
                    method: "DELETE",
                    url: this.baseUrl + "/watchlists/" + id,
                    headers: { access_token: localStorage.access_token },
                });
                this.fetchWatchlist();
            } catch (err) {
                console.log(err.response.data);
            }
        },
        async search(query) {
            try {
                const { data } = await axios({
                    method: "POST",
                    url: this.baseUrl + "/search/",
                    params: {
                        query,
                        page: this.page,
                    },
                });
                this.searchData = data;
                this.router.push("/search/" + query);
            } catch (err) {
                console.log(err.response.data);
            }
        },
        logout() {
            localStorage.clear();
            this.isLogin = false;
            this.router.push("/login");
        },
    },
});
