// plugins/wasm.ts
export default defineNuxtPlugin(async (nuxtApp) => {
  // try {
  //   // Import the notes.cjs module
  //   const Cc20Module = await import('/wasm/notes.cjs');
  //
  //   // Wait for `readyPromise` if it exists
  //   if (Cc20Module.readyPromise) {
  //     await Cc20Module.readyPromise;
  //   }
  //
  //   // Access the initialized `Module` (or similar export if it uses another name)
  //   const wasmInstance = Cc20Module.Module;
  //
  //   return {
  //     provide: {
  //       wasm: wasmInstance,
  //     },
  //   };
  // } catch (error) {
  //   console.error('Error loading notes.cjs:', error);
  //   return {
  //     provide: {
  //       wasm: null,
  //     },
  //   };
  // }
});
