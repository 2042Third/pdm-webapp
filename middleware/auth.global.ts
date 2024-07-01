export default defineNuxtRouteMiddleware(async (to, from) => {

  console.log('Middleware: page from ' + from.path + ' to ' + to.path);

// rest of your code
  if (import.meta.client) {
    const user = useUserStore();
    const { performGetUserData } = useAuthAction();

    if (!user.isLoggedIn) {
      console.log("[Auth Middleware] user not logged in, trying to load session key");
      await user.loadSessionKey();
      console.log("[Auth Middleware] user session key loaded: \""+user.sessionKey+"\"");
      if (user.sessionKey === '' || user.sessionKey === null || user.sessionKey === undefined) {
        console.log("[Auth Middleware] user session key not found, redirecting to login");
        await user.clearAll();
      }
      else {
        console.log("[Auth Middleware] user session key found, trying to get user profile.");
        const out = await performGetUserData('/api/user');
        if (out) {
          console.log("[Auth Middleware] user data retrieved: \""+user.userData+"\"");
        }
        else {
          console.log("[Auth Middleware] user data not retrieved, removing all data");
          await user.clearAll();
        }
      }
    }
  }
});

