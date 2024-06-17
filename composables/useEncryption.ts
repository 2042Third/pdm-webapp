// composables/useEncryption.ts
import { ref, onMounted, onUnmounted } from 'vue';
import { c20 } from '~/assets/encryption/emscripten/c20wasm';
import { useEmscriptenWasm } from './useEmscriptenWasm';



export function useEncryption() {
  const { resolvedModule, moduleExportName, wasmJavaScriptLoader }
    = useEmscriptenWasm('Cc20Module', 'notes.cjs');
  const authdata = ref(null);
  // const authdata_make = ref('');
  const pdmSecurityVersion = ref(0.2);

  const authdata_make = {value: '1234'};

  onMounted(() => {
    console.log('WARNING, IF THIS MESSAGE IS SHOWING MORE THAN ONCE, PLEASE CLOSE THE PROGRAM!!!');
    // Authenticated messages

  });

  onUnmounted(() => {
    authdata.value.unsubscribe();
  });

  function check_module() {
    if (resolvedModule.value === null) {
      console.log('No module loaded!');
    } else {
      console.log('Module success!');
    }
  }

  function enc2(p: string, a: string) {
    if (a.length === 0) {
      return '';
    }
    return resolvedModule.value.loader_check(p, a);
  }

  function dec2(p: string, a: string) {
    if (a.length === 0) {
      return '';
    }
    return resolvedModule.value.loader_out(p, a);
  }

  function enc(inp: string) {
    if (resolvedModule.value === null || authdata_make.value === '') {
      return 'unable to encrypt!';
    }
    if (inp.length === 0) {
      return '';
    }
    return resolvedModule.value.loader_check(authdata_make.value, inp);
  }

  function dec(inp: string) {
    if (resolvedModule.value === null) {
      return 'unable to decrypt!';
    }
    if (authdata_make.value === '') {
      return 'unable to decrypt! No password.';
    }
    if (inp.length === 0) {
      return '';
    }
    return resolvedModule.value.loader_out(authdata_make.value, inp);
  }

  function msg_hash(inp: string) {
    if (resolvedModule.value === null) {
      return `unable to get hash of "${inp}"!`;
    }
    return resolvedModule.value.get_hash(inp);
  }

  function pass_is_set() {
    return authdata_make.value !== '';
  }

  return {
    resolvedModule,
    moduleExportName,
    wasmJavaScriptLoader,
    authdata,
    authdata_make,
    pdmSecurityVersion,
    check_module,
    enc2,
    dec2,
    enc,
    dec,
    msg_hash,
    pass_is_set,
  };
}
