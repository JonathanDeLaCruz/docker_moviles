FROM node:22-alpine

RUN apk add --no-cache git \
    && npm install -g @ionic/cli@7.2.1

WORKDIR /app

EXPOSE 8100

ENV NG_CLI_ANALYTICS=false
ENV CI=true

CMD ["sh", "-c", "\
set -e; \
\
if [ ! -f .ionic-setup-complete ]; then \
  echo 'Preparando proyecto Ionic 8 + Angular 20...'; \
\
  rm -rf /tmp/ionic-starters; \
  mkdir -p /tmp/ionic-starters; \
\
  cd /tmp/ionic-starters; \
  git init -q; \
  git remote add origin https://github.com/ionic-team/starters.git; \
  git fetch --depth 1 origin 33e875d762c22baf56df2b1f072736747fa6e233; \
  git checkout --detach FETCH_HEAD; \
\
  echo 'Copiando base oficial de Ionic 8 + Angular 20...'; \
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
\
  node -e \"\
    const fs = require('fs'); \
    const p = JSON.parse(fs.readFileSync('package.json', 'utf8')); \
    \
    p.name = 'moviles'; \
    \
    const angular = '20.3.30'; \
    \
    p.dependencies['@angular/animations'] = angular; \
    p.dependencies['@angular/common'] = angular; \
    p.dependencies['@angular/compiler'] = angular; \
    p.dependencies['@angular/core'] = angular; \
    p.dependencies['@angular/forms'] = angular; \
    p.dependencies['@angular/platform-browser'] = angular; \
    p.dependencies['@angular/platform-browser-dynamic'] = angular; \
    p.dependencies['@angular/router'] = angular; \
    p.dependencies['@ionic/angular'] = '8.8.17'; \
    \
    p.devDependencies['@angular-devkit/build-angular'] = '20.3.36'; \
    p.devDependencies['@angular/cli'] = '20.3.36'; \
    p.devDependencies['@angular/compiler-cli'] = angular; \
    p.devDependencies['@angular/language-service'] = angular; \
    \
    p.devDependencies['@angular-eslint/builder'] = '20.2.0'; \
    p.devDependencies['@angular-eslint/eslint-plugin'] = '20.2.0'; \
    p.devDependencies['@angular-eslint/eslint-plugin-template'] = '20.2.0'; \
    p.devDependencies['@angular-eslint/schematics'] = '20.2.0'; \
    p.devDependencies['@angular-eslint/template-parser'] = '20.2.0'; \
    \
    p.devDependencies['@ionic/angular-toolkit'] = '12.3.0'; \
    p.devDependencies['typescript'] = '5.9.3'; \
    \
    fs.writeFileSync('package.json', JSON.stringify(p, null, 2) + '\\n'); \
  \"; \
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
  node -e \"\
    const fs = require('fs'); \
    const config = JSON.parse(fs.readFileSync('angular.json', 'utf8')); \
    config.schematics = config.schematics || {}; \
    config.schematics['@ionic/angular-toolkit:component'] = { \
      styleext: 'scss', \
      standalone: false \
    }; \
    config.schematics['@ionic/angular-toolkit:page'] = { \
      styleext: 'scss', \
      standalone: false \
    }; \
    fs.writeFileSync('angular.json', JSON.stringify(config, null, 2) + '\\n'); \
  \"; \
\
  echo 'Instalando Ionic 8 + Angular 20...'; \
  npm install; \
\
  echo 'Instalando Capacitor 8...'; \
  npm install --save-exact \
    @capacitor/core@8.5.0 \
    @capacitor/android@8.5.0 \
    @capacitor/ios@8.5.0 \
    @capacitor/app@8.1.1 \
    @capacitor/haptics@8.0.2 \
    @capacitor/keyboard@8.0.5 \
    @capacitor/status-bar@8.0.3; \
\
  npm install --save-dev --save-exact @capacitor/cli@8.5.0; \
\
  echo 'Configurando Capacitor...'; \
  npx cap init Moviles mx.edu.moviles --web-dir=www; \
\
  touch /app/.ionic-setup-complete; \
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