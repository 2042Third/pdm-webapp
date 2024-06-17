// composables/useEmscriptenWasm.ts
import { ref, onMounted } from 'vue';
import { loadScript } from '~/assets/encryption/emscripten/tools.ts';
import { environment } from '~/assets/encryption/emscripten/environment.ts';
import wasmCacheBusting from '~/assets/encryption/scripts/wasm-cache-busting.json';

type EmscriptenModuleDecorator<M extends EmscriptenModule> = (module: M) => void;

const noopModuleDecorator = (mod: EmscriptenModule) => mod;

export function useEmscriptenWasm<M extends EmscriptenModule = EmscriptenModule>(
  moduleExportName: string,
  wasmJavaScriptLoader: string,
  moduleDecorator?: EmscriptenModuleDecorator<M>
) {
  const resolvedModule = ref<M | null>(null);

  function resolveModule() {
    const jsVersion = wasmCacheBusting[wasmJavaScriptLoader]
      ? `?v=${wasmCacheBusting[wasmJavaScriptLoader]}`
      : '';

    loadScript(moduleExportName, `${environment.wasmAssetsPath}/${wasmJavaScriptLoader}${jsVersion}`)
      .then(() => {
        const module = {
          locateFile: (file: string) => {
            const fileVersion = wasmCacheBusting[file] ? `?v=${wasmCacheBusting[file]}` : '';
            return `${environment.wasmAssetsPath}/${file}${fileVersion}`;
          },
        } as M;

        const decorator: EmscriptenModuleDecorator<M> = moduleDecorator || noopModuleDecorator;
        decorator(module);

        return (window as any)[moduleExportName](module);
      })
      .then((mod) => {
        resolvedModule.value = mod;
      });
  }

  onMounted(() => {
    resolveModule();
  });

  return {
    resolvedModule,
    moduleExportName,
    wasmJavaScriptLoader,
  };
}
