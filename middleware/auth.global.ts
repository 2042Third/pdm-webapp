export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('Middleware: page from ' + from.path + ' to ' + to.path);



  if (import.meta.client) {
    const user = useUserStore();
    const { performGetUserData } = useAuthAction();
    const { createSecureContext } = useSecurity();
    const {get_user_url} = useApiStore();
    const userConfig = useUserConfigStore();
    const appStates = appStatesStore();
    appStates.setOnPage(to.path);

    try {
      if (!user.isLoggedIn || user.authAttempt<2) {
        console.log("[Auth Middleware] user not logged in, trying to load session key");
        await user.loadSessionKey();
        console.log("[Auth Middleware] user session key loaded: \""+user.sessionKey+"\"");

        await user.loadRefreshKey();
        console.log("[Auth Middleware] user refresh key loaded: \""+user.refreshKey+"\"");
        if (!user.sessionKey || user.sessionKey === "" || user.sessionKey.length < 1 ) {
          console.log("[Auth Middleware] user session key not found, continue.");
          await user.clearAll();
          user.addAuthAttempt();
          return;
          // return navigateTo('/login'); // Adjust the route as needed
        }

        console.log("[Auth Middleware] user session key found, trying to get user profile.");
        const out = await performGetUserData(get_user_url);
        user.addAuthAttempt();
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
              // return navigateTo('/login');
            }
          } else {
            // TODO: Ask to login again.
            // return navigateTo('/login');
          }
        } else {
          console.log("[Auth Middleware] user data not retrieved, removing all data");
          await user.clearAll();
          // return navigateTo('/login');
        }
      }
    } catch (error) {
      console.error("[Auth Middleware] error: ", error);
      await user.clearAll();
      user.addAuthAttempt();
      // return navigateTo('/login');
    }

  }
});
