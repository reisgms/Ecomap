# Ecomap

Aplicativo mobile para reporte colaborativo de descartes irregulares de resíduos. Desenvolvido como Trabalho de Conclusão de Curso (TCC).

Usuários podem registrar descartes no mapa, oferecer coleta de reportes de outros usuários e acompanhar o status em tempo real.

---

## Tecnologias

- [Expo](https://expo.dev) (v55) + React Native + TypeScript
- [Expo Router](https://expo.github.io/router) para navegação
- [Firebase Auth](https://firebase.google.com/docs/auth) (e-mail/senha e Google)
- [Firestore](https://firebase.google.com/docs/firestore) para dados em tempo real
- [expo-maps](https://docs.expo.dev/versions/latest/sdk/maps/) (Google Maps no Android, Apple Maps no iOS)
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) para push notifications
- [EAS Build](https://docs.expo.dev/build/introduction/) para geração de APK/IPA

---

## Pré-requisitos

| Ferramenta | Versão recomendada |
|---|---|
| Node.js | **20.x** (LTS) |
| npm | 10.x ou superior |
| Expo CLI | Mais recente |
| EAS CLI | Mais recente (somente para builds) |

> **Importante:** o projeto usa Node 20. Versões muito antigas (< 18) ou muito novas (> 21) podem causar incompatibilidades com dependências nativas.

### Usando nvm (recomendado)

O arquivo `.nvmrc` na raiz define a versão correta. Com o [nvm](https://github.com/nvm-sh/nvm) instalado:

```bash
nvm install 20.18.0
nvm use
```

---

## Arquivos necessários (não versionados)

Estes arquivos contêm chaves sensíveis e **não estão no repositório**. Solicite-os ao autor do projeto:

| Arquivo | Onde colocar | Para quê |
|---|---|---|
| `google-services.json` | raiz do projeto (`ecomap/`) | Firebase no Android |
| `GoogleService-Info.plist` | raiz do projeto (`ecomap/`) | Firebase no iOS |

Sem esses arquivos o app compila mas autenticação, Firestore e mapa não funcionam.

---

## Instalação e execução (ambiente de desenvolvimento)

```bash
# 1. Clone o repositório
git clone https://github.com/reisgms/Ecomap.git
cd Ecomap/ecomap

# 2. Use a versão correta do Node
nvm use

# 3. Instale as dependências
npm install

# 4. Coloque os arquivos firebase na raiz (google-services.json e GoogleService-Info.plist)

# 5. Inicie o servidor de desenvolvimento
npx expo start
```

> O Expo Go **não é compatível** com este projeto pois usa módulos nativos (`expo-maps`). É necessário um **development build** instalado no dispositivo, gerado via EAS.

---

## Gerar APK para instalação direta (Android)

O APK é gerado na nuvem pelo EAS Build, sem precisar do Android Studio.

```bash
# Instale o EAS CLI (uma vez)
npm install -g eas-cli

# Login na conta Expo
eas login

# Gere o APK (perfil preview = APK instalável diretamente)
eas build --platform android --profile preview
```

Ao final do build o EAS fornece um link para download do `.apk`. Transfira para o celular e instale (é necessário habilitar **"Instalar de fontes desconhecidas"** nas configurações do Android).

### Perfis de build disponíveis

| Perfil | Saída | Uso |
|---|---|---|
| `development` | APK com dev client | Desenvolvimento com Metro |
| `preview` | APK instalável | Demonstração e testes |
| `production` | AAB | Publicação na Play Store |

---

## Estrutura do projeto

```
ecomap/
├── src/
│   ├── app/                  # Telas (Expo Router)
│   │   ├── (tabs)/           # Abas principais (mapa, reportes, perfil)
│   │   ├── login.tsx
│   │   ├── cadastro.tsx
│   │   └── bemvindo.tsx
│   ├── components/           # Componentes reutilizáveis
│   └── styles/               # Estilos das telas
├── hooks/                    # Custom hooks (useReports, useCluster, etc.)
├── contexts/                 # Contexto de autenticação
├── services/                 # Serviços externos (push notifications)
├── types/                    # Tipos TypeScript
├── constantes/               # Status, cores por tipo de resíduo
├── firebaseConfig.ts         # Configuração do Firebase
├── firestore.rules           # Regras de segurança do Firestore
├── eas.json                  # Configuração de builds EAS
└── app.json                  # Configuração do Expo
```

---

## Funcionalidades

- Cadastro e login com e-mail/senha ou conta Google
- Mapa em tempo real com pins de reportes ativos
- Clustering automático de pins próximos (raio de 40m)
- Filtros de tipo de resíduo (Orgânico, Reciclável, Madeira, Ferro, Móveis, Eletrodomésticos)
- Criação de reporte com foto, descrição, tipo e localização automática
- Fluxo de coleta: Pendente → Em Coleta → Resolvido
- Notificações push ao dono quando alguém oferece coleta
- Tela de boas-vindas personalizada para primeiro acesso
- Suporte a Safe Area (câmera frontal, notch, barra de gestos)

---

## Autor

Pedro Reis — [@reisgms](https://github.com/reisgms)
