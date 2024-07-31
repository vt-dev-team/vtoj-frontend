export default defineNuxtRouteMiddleware((to, from) => {
    if ((to.path === "/user/login" || to.path === '/user/register') && !to.query.url) {
        const url = from.query.url ? from.query.url : (from.fullPath !== to.path ? from.fullPath : "/");
        return navigateTo({
            path: to.path,
            query: {
                ...to.query,
                url
            }
        })
    }
})