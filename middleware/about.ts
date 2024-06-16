export default defineNuxtRouteMiddleware((to, from) => {
  console.log('Middleware: The about page is being loaded.');
  if (to.path === from.path) {
    return ;
  }
});

