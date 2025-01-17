import { useRuntimeConfig } from 'nuxt/app';

export const useApiStore =
  defineStore('api', () => {
    const config = useRuntimeConfig();

    const api_base = "http://0.0.0.0";
    const ws_base = "ws://0.0.0.0";
    const api_production = config.public.apiProduction;
    const ws_production = config.public.wsProduction;

    const api_signin = "/login";
    const api_signout = "/api/user/logout";
    const api_signup = "/signup";
    const api_signup_verify = "/signup/verify";
    const api_notes = "/api/notes";
    const api_get_user = "/api/user";
    const api_refresh = "/refresh";
    const ws_test = "/ws";
    const sse_send_notification = "/sse-stream/send-notification";
    const sse_notifications = "/sse-stream/notification";
    const csrf_ = "/api/csrf-token";
    const validation = "/validate";

    const signin_url = computed(() => (config.public.isProd ? api_production : api_base) + api_signin)
    const signout_url = computed(() => (config.public.isProd ? api_production : api_base) + api_signout)
    const signup_url = computed(() => (config.public.isProd ? api_production : api_base) + api_signup)
    const signup_verify_url = computed(() => (config.public.isProd ? api_production : api_base) + api_signup_verify)
    const get_notes_url = computed(() => (config.public.isProd ? api_production : api_base) + api_notes)
    const get_user_url = computed(() => (config.public.isProd ? api_production : api_base) + api_get_user)
    const get_ws_test_url = computed(() => (config.public.isProd ? ws_production : ws_base) + ws_test)
    const get_sse_send_notification_url = computed(() => (config.public.isProd ? api_production : api_base) + sse_send_notification)
    const get_sse_notifications_url = computed(() => (config.public.isProd ? api_production : api_base) + sse_notifications)
    const get_csrf_url = computed(() => (config.public.isProd ? api_production : api_base) + csrf_)
    const get_validation_url = computed(() => (config.public.isProd ? api_production : api_base) + api_get_user+validation)
    const get_refresh_url = computed(() => (config.public.isProd ? api_production : api_base) + api_refresh)


    return {
      signin_url,
      signup_url,
      signup_verify_url,
      signout_url,
      get_notes_url,
      get_user_url,
      get_ws_test_url,
      get_sse_send_notification_url,
      get_sse_notifications_url,
      get_csrf_url,
      get_validation_url,
      get_refresh_url,
    };
  });
