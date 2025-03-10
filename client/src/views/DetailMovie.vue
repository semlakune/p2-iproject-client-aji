<script>
import { mapActions, mapWritableState } from "pinia";
import { useCounterStore } from "../stores/counter";
import SimiliarCard from "../components/SimiliarCard.vue";
import MoviesCard from "../components/MoviesCard.vue";
import CastCard from "../components/CastCard.vue";
import ProviderCard from "../components/ProviderCard.vue";

export default {
    computed: {
        ...mapWritableState(useCounterStore, ["movieData"]),
    },
    methods: {
        ...mapActions(useCounterStore, ["detailMovie", "createMovieWatchlist"]),
    },
    watch: {
        "$route.params.id": {
            handler(id) {
                this.detailMovie(id);
            },
            immediate: true,
        },
    },
    components: { SimiliarCard, MoviesCard, CastCard, ProviderCard },
};
</script>
<template>
    <main class="page-wrapper" v-if="movieData.movie">
        <!-- Page content-->
        <div class="container mt-5 mb-md-4 py-5">
            <!-- Breadcrumb-->
            <nav class="mb-3 pt-md-3" style="" aria-label="Breadcrumb">
                <ol class="breadcrumb breadcrumb-light">
                    <li class="breadcrumb-item">
                        <a @click.prevent="$router.push('/')" href="">Home</a>
                    </li>
                    <i class="bi bi-arrow-right-short mx-2"></i>
                    <li class="breadcrumb-item">
                        <a @click.prevent="$router.push('/movie')" href="">Movie</a>
                    </li>
                    <i class="bi bi-arrow-right-short mx-2"></i>
                    <li class="breadcrumb-item active">
                        {{ movieData.movie.title }}
                    </li>
                </ol>
            </nav>
            <!-- Title -->
            <div
                class="d-sm-flex align-items-end align-items-md-center justify-content-between position-relative mb-4"
                style="z-index: 1025"
            >
                <div class="me-3">
                    <h1 class="h2 text-light mb-md-0">
                        {{ movieData.movie.title }} ({{
                            new Date(movieData.movie.release_date).getFullYear()
                        }})
                    </h1>
                </div>
            </div>
            <div class="row">
                <div class="col-md-7">
                    <!-- Banner -->
                    <div class="card card-light card-hover">
                        <div class="card-img-top card-img-hover">
                            <img
                                :src="movieData.movie.backdrop_path"
                                alt="Image"
                            />
                        </div>
                    </div>

                    <!-- Overview-->
                    <div class="py-3 mb-3">
                        <h2 class="h4 text-light mb-4">Overview</h2>
                        <p>
                            {{ movieData.movie.overview }}
                        </p>
                        <div class="row text-light">
                            <div class="col-sm-6 col-md-12 col-lg-6">
                                <ul class="list-unstyled">
                                    <li class="mb-2">
                                        <strong>Status:</strong
                                        ><span class="opacity-70 ms-1">{{
                                            movieData.movie.status
                                        }}</span>
                                    </li>
                                    <li class="mb-2">
                                        <strong>Released Date:</strong
                                        ><span class="opacity-70 ms-1">{{
                                            new Date(
                                                movieData.movie.release_date
                                            ).toLocaleDateString("id-ID", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })
                                        }}</span>
                                    </li>
                                    <li class="mb-2">
                                        <strong>Budget:</strong
                                        ><span class="opacity-70 ms-1"
                                            >$
                                            {{
                                                movieData.movie.budget.toLocaleString(
                                                    "id-ID"
                                                )
                                            }},00</span
                                        >
                                    </li>
                                    <li class="mb-2">
                                        <strong>Revenue:</strong
                                        ><span class="opacity-70 ms-1"
                                            >$
                                            {{
                                                movieData.movie.revenue.toLocaleString(
                                                    "id-ID"
                                                )
                                            }},00</span
                                        >
                                    </li>
                                    <li class="mb-2">
                                        <strong>Genre:</strong
                                        ><span class="opacity-70 ms-1">{{
                                            movieData.movie.genres
                                        }}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!-- Cast-->
                    <div class="card card-body p-4 card-light mb-4">
                        <div
                            class="row row-cols-2 row-cols-sm-4 gx-3 gx-xl-4 gy-4"
                        >
                            <!-- card -->
                            <CastCard
                                v-for="(c, idx) in movieData.cast"
                                :key="idx"
                                :c="c"
                            />
                        </div>
                    </div>
                </div>
                <!-- Sidebar-->
                <div class="col-md-5 pt-5 pt-md-0" style="margin-top: -6rem">
                    <div class="sticky-top pt-5">
                        <div class="d-none d-md-block pt-5">
                            <div class="card card-light card-body mb-4 align-items-center">
                                <div class="inline">
                                    <button
                                        class="btn btn-outline-light btn-lg px-4 me-3"
                                        type="button"
                                    >
                                        <i
                                            class="bi bi-caret-right-square me-2"
                                        ></i
                                        >Play trailer</button
                                    >
                                    <a
                                        class="btn btn-primary btn-lg"
                                        href=""
                                        data-bs-toggle="collapse"
                                        @click.prevent="createMovieWatchlist(movieData.movie.id)"
                                        ><i
                                            class="bi bi-bookmark-star-fill me-2"
                                        ></i
                                        >Add to watchlist</a
                                    >
                                </div>
                            </div>
                        </div>

                        <div v-if="movieData.provider.length > 0" class="card card-body bg-transparent border-light">
                            <h5 class="text-light">Where to watch</h5>
                            <!-- card -->
                            <ProviderCard v-for="(p, idx) in movieData.provider" :key="idx" :p="p" />
                        </div>
                    </div>
                </div>
            </div>
            <!-- Similiar -->
            <h2 class="h4 text-light mt-5">Similiar Movie</h2>
            <div
                class="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-2 g-md-4"
            >
                <!-- Item-->
                <SimiliarCard
                    v-for="(s, idx) in movieData.similiar"
                    :key="idx"
                    :s="s"
                />
            </div>
        </div>
    </main>
</template>
