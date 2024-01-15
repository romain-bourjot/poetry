<p align="center">
  <br />
    <picture>
        <source media="(prefers-color-scheme: dark)" srcset="./frontend/src/assets/favicon-inv.png" />
        <img alt="MiniFSM logotype" src="./frontend/src/assets/favicon.png" width="128" />
    </picture>
    <br/>
    <h1 align="center">Poetry</h1>
  <br />
  <br />
</p>

> Watch in production: [https://poetry.rb-dev.com](https://poetry.rb-dev.com)

## 🛠️ Local development

### Start

```sh
docker compose down ; docker compose build --no-cache ; docker compose up -d --force-recreate --remove-orphans
```

### Logs

#### Frontend:

```sh
docker compose logs frontend -f --tail=100
```

#### Backend:

```sh
docker compose logs backend -f --tail=100
```

### Stop

```sh
docker compose down
```

## 🚀 Deployment

Create a new GitHub release with a tag, et voilà!
