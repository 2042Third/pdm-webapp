FROM debian

RUN apt-get update && apt-get install -y \
    git \
    xz-utils \
    python3 \
    curl \
    build-essential \
    cmake \
    clang \
    && rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/emscripten-core/emsdk.git && \
    cd /emsdk && \
    ./emsdk install latest-arm64-linux && \
    ./emsdk activate latest-arm64-linux

ENV PATH="/emsdk:/emsdk/upstream/emscripten:${PATH}"

WORKDIR /app

ENTRYPOINT ["/emsdk/docker/entrypoint.sh"]
