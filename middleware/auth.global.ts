export default defineNuxtRouteMiddleware((to, from) => {

  console.log('Middleware: page from ' + from.path + ' to ' + to.path);

// rest of your code
});

