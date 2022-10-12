# dev

## Installation

```bash
npm i
npm run docker
cat <<EOF >.env
TMDB_API_KEY="43954c2d8a99381ff77508aeaa6d3a1a"
QBIT_USERNAME="admin"
QBIT_PASSWORD="adminadmin"
EOF
```

## Usage

```bash
npm run dev
```

## Uninstall docker compose

```bash
npm run docker:rm
rm -rf bt
```
