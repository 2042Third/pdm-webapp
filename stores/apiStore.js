import { useRuntimeConfig } from 'nuxt/app';

export const useApiStore =
  defineStore('api', () => {
    const config = useRuntimeConfig();
    const api_base = "http://10.0.0.189";
    const ws_base = "ws://10.0.0.189";
    const api_production = "http://97.107.133.143";
    const ws_production = "ws://97.107.133.143";

    const api_signin = "/login";
    const api_signout = "/api/user/logout";
    const api_signup = "/signup";
    const api_notes = "/api/notes";
    const api_get_user = "/api/user";
    const ws_test = "/ws";
    const sse_send_notification = "/sse-stream/send-notification";
    const sse_notifications = "/sse-stream/notification";
    const csrf_ = "/api/csrf-token";

    const signin_url = computed(() => (config.public.isProd ? api_production : api_base) + api_signin)
    const signout_url = computed(() => (config.public.isProd ? api_production : api_base) + api_signout)
    const get_notes_url = computed(() => (config.public.isProd ? api_production : api_base) + api_notes)
    const get_user_url = computed(() => (config.public.isProd ? api_production : api_base) + api_get_user)
    const get_ws_test_url = computed(() => (config.public.isProd ? ws_production : ws_base) + ws_test)
    const get_sse_send_notification_url = computed(() => (config.public.isProd ? api_production : api_base) + sse_send_notification)
    const get_sse_notifications_url = computed(() => (config.public.isProd ? api_production : api_base) + sse_notifications)
    const get_csrf_url = computed(() => (config.public.isProd ? api_production : api_base) + csrf_)

    return {
      signin_url,
      signout_url,
      get_notes_url,
      get_user_url,
      get_ws_test_url,
      get_sse_send_notification_url,
      get_sse_notifications_url,
      get_csrf_url,
    };
  });
