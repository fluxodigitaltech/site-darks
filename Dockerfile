# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:26-alpine AS builder

# Instala pnpm (pinado: pnpm@11+ exige Node >=22.13, incompatível com node:20-alpine)
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

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
FROM nginx:1.27-alpine AS runner

# Remove config padrão do nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia config customizada
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Copia os arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
