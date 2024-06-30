export default defineNuxtRouteMiddleware(async (to, from) => {

  console.log('Middleware: page from ' + from.path + ' to ' + to.path);

// rest of your code
  if (import.meta.client) {
    const user = useUserStore();
    if (!user.isLoggedIn) {
      console.log("[Auth Middleware] user not logged in, trying to load session key");
      await user.loadSessionKey();
      console.log("[Auth Middleware] user session key loaded: \""+user.sessionKey+"\"");
    }
  }
});

