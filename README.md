# GiftLink

GiftLink is a full-stack web app where people give away household items they no longer need
(furniture, kitchenware, office stuff) and others can find and claim them for free.

## Architecture

| Part | Tech | Port |
|---|---|---|
| `giftlink-frontend` | React 18, React Router 6, Bootstrap | 3000 (dev) / 9000 (prod) |
| `giftlink-backend` | Node.js, Express, MongoDB driver, JWT, bcrypt | 3060 |
| `sentiment` | Express + `natural` NLP | 3000 |
| Database | MongoDB (`giftdb`: `gifts`, `users`) | 27017 |

## API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/gifts` | List all gifts |
| GET | `/api/gifts/:id` | Gift details |
| GET | `/api/search?name=&category=&condition=&age_years=` | Search / filter gifts |
| POST | `/api/auth/register` | Register a user, returns JWT |
| POST | `/api/auth/login` | Login, returns JWT |
| PUT | `/api/auth/update` | Update user name (header `email`) |
| POST | `/sentiment` (sentiment service) | Sentiment of a sentence |

## Run locally

```bash
# backend
cd giftlink-backend
cp .env.example .env      # set MONGO_URL and JWT_SECRET
npm install
npm run import            # imports 16 gifts into MongoDB
npm start                 # http://localhost:3060

# frontend
cd giftlink-frontend
cp .env.example .env
npm install
npm start                 # http://localhost:3000
```

## CI/CD

GitHub Actions (`.github/workflows/main.yml`) lints backend and sentiment JS with JSHint
and builds the React client on every push to `main`.
