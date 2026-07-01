# PassOp Mongo

PassOp is a React + Vite frontend with a Node.js/Express backend that stores password entries in MongoDB.

## Where the backend saves data

The backend connects to MongoDB using `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017
DB_NAME=passop
```

Data is saved in:

- Database: `passop`
- Collection: `passwords`

The backend exposes these routes on `http://localhost:3000`:

- `GET /` - fetch all saved password records
- `POST /` - insert a new password record
- `DELETE /` - delete a password record by body payload

## Requirements

- Node.js
- MongoDB running locally on `mongodb://localhost:27017`

## How to run

Install dependencies for the frontend:

```bash
npm install
```

Install dependencies for the backend:

```bash
cd backend
npm install
```

Start the backend:

```bash
cd backend
npm start
```

Start the frontend in a second terminal:

```bash
npm run dev
```

## Notes

- The frontend calls the backend at `http://localhost:3000/`.
- If you change the backend port or MongoDB connection string, update `backend/server.js` and `backend/.env` accordingly.
