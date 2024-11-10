// plugins/wasm.ts
export default defineNuxtPlugin(async (nuxtApp) => {
  const notesUrl = process.dev ? '/wasm/notes.cjs' : '/wasm/notes.cjs';

  try {
    const { default: createWasmModule } = await import('~/assets/encryption/wasm/notes.cjs');

    if (typeof createWasmModule !== 'function') {
      console.error('createWasmModule is not a function:', createWasmModule);
      return {
        provide: {
          wasm: null,
        },
      };
    }

    const moduleInstance = await createWasmModule();
    return {
      provide: {
        wasm: moduleInstance,
      },
    };
  } catch (error) {
    console.error('Error loading notes.cjs:', error);
    return {
      provide: {
        wasm: null,
      },
    };
  }
});
