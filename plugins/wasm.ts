// plugins/wasm.ts
export default defineNuxtPlugin(async (nuxtApp) => {
  const { default: Module } = await import('~/assets/encryption/wasm/notes.cjs');
  const moduleInstance = await Module();
  return {
    provide: {
      wasm: moduleInstance,
    },
  };
});
