export default defineNuxtRouteMiddleware(async (to, from) => {

  console.log('Middleware: page from ' + from.path + ' to ' + to.path);

// rest of your code
  if (import.meta.client) {
    const user = useUserStore();
    const { performGetUserData } = useAuthAction();
    const { createSecureContext } = useSecurity();
    const {get_user_url} = useApiStore();
    const userConfig = useUserConfigStore();

    if (!user.isLoggedIn) {
      console.log("[Auth Middleware] user not logged in, trying to load session key");
      await user.loadSessionKey();
      console.log("[Auth Middleware] user session key loaded: \""+user.sessionKey+"\"");
      if (user.sessionKey === '' || user.sessionKey === null || user.sessionKey === undefined) {
        console.log("[Auth Middleware] user session key not found, redirecting to login");
        await user.clearAll();
      }
      else {
        try {
          console.log("[Auth Middleware] user session key found, trying to get user profile.");
          const out = await performGetUserData(get_user_url);
          if (out) {
            console.log("[Auth Middleware] user data retrieved: \"" + user.userData + "\"");
            if (userConfig.storesPasswordLocally) {
              const a = await user.retrieveLocalPassword();
              if (a) {
                createSecureContext(a);
                console.log("[Auth Middleware] user context created: \"" + user.contextHandle + "\"");
              } else {
                console.log("[Auth Middleware] user context not created, removing all data");
                await user.clearAll();
              }
            } else {
              // TODO: Ask to login again.
            }
          } else {
            console.log("[Auth Middleware] user data not retrieved, removing all data");
            await user.clearAll();
          }
        }
        catch (error) {
          console.error("[Auth Middleware] error: " + error);
          await user.clearAll();
        }
      }
    }
  }
});

