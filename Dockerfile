# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# Instala pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copia manifests e instala dependências (cache otimizado)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copia o restante do código
COPY . .

# Build args para as variáveis de ambiente que o Vite bake no bundle
ARG VITE_EVO_API_KEY
ARG VITE_NOCODB_API_TOKEN

ENV VITE_EVO_API_KEY=$VITE_EVO_API_KEY
ENV VITE_NOCODB_API_TOKEN=$VITE_NOCODB_API_TOKEN

RUN pnpm build

# ── Stage 2: Serve ───────────────────────────────────────────────────────────
FROM nginx:1.29-alpine AS runner

# Remove config padrão do nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia config customizada
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Copia os arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
