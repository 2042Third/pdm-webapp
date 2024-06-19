// plugins/wasm.ts
export default defineNuxtPlugin(async (nuxtApp) => {
  // const { default: Module } = await import('~/assets/encryption/wasm/notes.cjs');
  // const { default: Module } = await import('/wasm/notes.cjs');
  // const moduleInstance = await Module();


  const { default: createWasmModule } = await import('~/public/wasm/notes.cjs');
  const moduleInstance = await createWasmModule();
  return {
    provide: {
      wasm: moduleInstance,
    },
  };
});
