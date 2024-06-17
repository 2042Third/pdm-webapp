
exports.cmd =
  'docker run --rm -v $(pwd):/app emsdk-arm64 em++ -I./assets/encryption/pdm-crypt-module/src/include -I./assets/encryption/pdm-crypt-module/src/lib -I./assets/encryption/pdm-crypt-module/src/lib/wasm -I./assets/encryption/pdm-crypt-module/src/lib/cpp-mmf -I./assets/encryption/pdm-crypt-module/src/lib/poly1305-donna-master -I./assets/encryption/pdm-crypt-module/src/lib/ecc -I./assets/encryption/pdm-crypt-module/src/lib/scrypt/include -I./assets/encryption/pdm-crypt-module/src/lib/scrypt ./assets/encryption/pdm-crypt-module/src/lib/cc20_file.cpp ./assets/encryption/pdm-crypt-module/src/lib/sha3.cpp ./assets/encryption/pdm-crypt-module/src/lib/cpp-mmf/memory_mapped_file.cpp ./assets/encryption/pdm-crypt-module/src/lib/poly1305-donna-master/poly1305-donna.c ./assets/encryption/pdm-crypt-module/src/lib/ecc/ecdh_curve25519.c ./assets/encryption/pdm-crypt-module/src/lib/ecc/curve25519.c ./assets/encryption/pdm-crypt-module/src/lib/ecc/fe25519.c ./assets/encryption/pdm-crypt-module/src/lib/ecc/bigint.c ./assets/encryption/pdm-crypt-module/src/lib/scrypt/src/hmac.c ./assets/encryption/pdm-crypt-module/src/lib/scrypt/src/pbkdf2.c ./assets/encryption/pdm-crypt-module/src/lib/scrypt/src/salsa20.c ./assets/encryption/pdm-crypt-module/src/lib/scrypt/src/scrypt.c ./assets/encryption/pdm-crypt-module/src/lib/scrypt/src/sha256.c ./assets/encryption/pdm-crypt-module/src/lib/ec.cpp ./assets/encryption/pdm-crypt-module/src/cc20core/cc20_multi.cpp ./assets/encryption/pdm-crypt-module/src/cc20_dev.cpp ./assets/encryption/pdm-crypt-module/src/empp.cpp ./assets/encryption/pdm-crypt-module/src/low-level/assembly.cpp  -s WASM=1 --bind  -fpermissive -std=c++17 -O3 -D LINUX  -D WEB_RELEASE -D SINGLETHREADING -D WEB_RELEASE_LINUX_TEST --no-entry  -s ALLOW_MEMORY_GROWTH=1  -s DEMANGLE_SUPPORT=1 -D__EMSCRIPTEN__ -s MODULARIZE=1 -s EXPORT_NAME="Cc20Module" -o assets/encryption/wasm/notes.cjs';
