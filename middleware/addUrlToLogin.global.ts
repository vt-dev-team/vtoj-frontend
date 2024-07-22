export default defineNuxtRouteMiddleware((to, from) => {
    if (to.path === "/user/login" && !to.query.url) {
        const url = from.fullPath !== "/user/login" ? from.fullPath : "/";
        return navigateTo({
            path: to.path,
            query: {
                ...to.query,
                url
            }
        })
    }
})