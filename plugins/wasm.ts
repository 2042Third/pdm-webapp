// plugins/wasm.ts
export default defineNuxtPlugin(async (nuxtApp) => {
  let createWasmModule;

  if (import.meta.dev) {
    // Running on the local dev server
    const { default: devCreateWasmModule } = await import('~/public/wasm/notes.cjs');
    createWasmModule = devCreateWasmModule;
  } else {
    // Running on the real server
    const { default: prodCreateWasmModule } = await import('/wasm/notes.cjs');
    createWasmModule = prodCreateWasmModule;
  }

  const moduleInstance = await createWasmModule();
  return {
    provide: {
      wasm: moduleInstance,
    },
  };
});
