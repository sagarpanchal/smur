## 🚀 Getting Started

### 📋 Prerequisites

- node >= v10.16.3
- mongodb >= v4.2
- ~~redis-server >= v4.0.9 (for socket.io and cacheing)~~
  - ~~wsl (only required on windows to run redis-server)~~

### 🔧 Installing

#### Clone this repo

```bash
git clone <repo_url>

cd ./<project_directory>
```

#### Create and switch to directory to store keys

```bash
mkdir -p ./.keys && cd ./.keys
```

#### Generate RSA keys for JWT

<small>On windows use git-bash or wsl</small>

```bash
# Generate RSA256 certificate
ssh-keygen -t rsa -b 2048 -m PEM -f jwt_rsa.key

# Convert RSA256 public key to certificate
openssl rsa -in jwt_rsa.key -pubout -outform PEM -out jwt_rsa.key.pub
```

#### Go back to project root

```bash
cd ..
```

#### Install all dependencies

```bash
npm i
```

> List of dependencies can be found in `package.json`

#### Configuration

> For config, see [`Additional Configuration`](./config.md)

#### Debugging

- Debugging config for visual studio code is already included Press `F5` to start debugging

#### Logging

- By default, run-time exceptions will be logged to `./.logs/<NODE_ENV>/<YYYY>-<MM>/<YYYY>-<MM>-<DD>.json`

> To change logging to database see [`Additional Configuration`](./config.md)

### 📦 FrontEnd

- Build and place your frontend files in `/public` directory
- All HTTP GET requests not matching with `^\/api*` will be redirected to `/public/index.html`

### ⚙️ Running

```bash
npm start          # runs `npm run dev`
npm run dev        # runs in development mode
npm run prod       # runs in production mode
npm run prod-stop  # stops in production mode
npm run prod-monit # `pm2 monit` in production
```

> If you're using windows, please ensure that redis-server is running inside wsl before you run any of these commands > `wsl sudo service redis-server restart`

> Production mode uses [`pm2`](https://github.com/Unitech/pm2/blob/master/README.md) cluster-mode for load-balancing

> See `scripts` in `package.json`

### 🛠️ Development

#### Testing

```bash
npm run test
```

#### Linting

```bash
npm run lint .
```

#### ESLint plugins for vscode

```bash
code --install-extension dbaeumer.vscode-eslint
```
