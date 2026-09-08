FROM node:22-alpine

RUN apk add --no-cache git \
    && npm install -g @ionic/cli

WORKDIR /app

EXPOSE 8100

ENV NG_CLI_ANALYTICS=false
ENV CI=true

CMD ["sh", "-c", "\
set -e; \
\
if [ ! -f package.json ]; then \
  echo 'Creando proyecto Ionic 8 Tabs...'; \
\
  rm -rf /tmp/ionic-starters; \
  git clone --depth 1 https://github.com/ionic-team/starters.git /tmp/ionic-starters; \
\
  echo 'Copiando base oficial de Ionic Angular...'; \
  cp -a /tmp/ionic-starters/angular/base/. /app/; \
\
  echo 'Agregando starter oficial Ionic Tabs...'; \
  cp -a /tmp/ionic-starters/angular/official/tabs/src/app/. /app/src/app/; \
\
  rm -rf /tmp/ionic-starters; \
\
  cd /app; \
\
  echo 'Configurando proyecto...'; \
  npm pkg set name='moviles'; \
\
  node -e \"\
    const fs = require('fs'); \
    const config = JSON.parse(fs.readFileSync('ionic.config.json', 'utf8')); \
    config.name = 'moviles'; \
    config.type = 'angular'; \
    config.integrations = { capacitor: {} }; \
    fs.writeFileSync('ionic.config.json', JSON.stringify(config, null, 2) + '\\n'); \
  \"; \
\
  echo 'Instalando Ionic 8 + Angular 20...'; \
  npm install; \
\
  echo 'Instalando Capacitor 8...'; \
  npm install --save-exact \
    @capacitor/core@8 \
    @capacitor/android@8 \
    @capacitor/ios@8 \
    @capacitor/app@8 \
    @capacitor/haptics@8 \
    @capacitor/keyboard@8 \
    @capacitor/status-bar@8; \
\
  npm install --save-dev --save-exact @capacitor/cli@8; \
\
  echo 'Configurando Capacitor...'; \
  npx cap init Moviles mx.edu.moviles --web-dir=www; \
fi; \
\
cd /app; \
\
if [ ! -d node_modules/@ionic/angular ]; then \
  echo 'Instalando dependencias...'; \
  npm install; \
fi; \
\
echo 'Iniciando Ionic...'; \
exec ionic serve \
  --external \
  --port=8100 \
  --no-open \
  -- \
  --poll=1000 \
"]