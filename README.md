# 🚀 Express.js + ScyllaDB Demo

This project is a backend API built using **Express.js** and **ScyllaDB (Cassandra Driver)**. It includes
authentication, video listing, comments, replies, and pagination features.

---

## **🔧 Prerequisites**

Ensure you have the following installed before proceeding:

- **Node.js** (v16 or later)
- **npm** (v8 or later)
- **ScyllaDB/Cassandra** (configured and running)

---

## **📥 Clone the Repository**

```sh
git clone https://github.com/Chintan-Novus/expressjs_scylladb_demo.git
cd expressjs_scylladb_demo
```

---

## **📄 Configure Environment Variables**

1. **Create a `.env` file** in the root directory.
2. Copy the contents from `.env.example` and update the values as per your configuration.

Example:

```env
PORT=your_port
JWT_SECRET=your_secret_key
DB_CONTACT_POINTS=your_db_node
DB_KEYSPACE=your_db_keyspace
DB_DATA_CENTER=your_db_data_center
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
```

---

## **📦 Install Dependencies**

```sh
npm install
```

---

## **🛠 Run Database Migrations**

To create tables and materialized views in Cassandra/ScyllaDB:

```sh
npm run migrate
```

If you need to reset and re-run migrations:

```sh
npm run migrate:fresh
```

---

## **🌱 Seed the Database**

To insert dummy users and videos for testing:

```sh
npm run seed
```

---

## **🚀 Start the Development Server**

```sh
npm run dev
```

The server will start at `http://localhost:3000`.

---

## **📌 Features Implemented**

- **Authentication:** Login API
- **Videos:** Fetch video list
- **Comments:**
    - Fetch comments (with sorting & pagination)
    - Add a comment
    - Like/dislike a comment
- **Replies:**
    - Nested replies (N-level)
    - Fetch replies
    - Add a reply

---

## **📝 Notes**

- All listing APIs support pagination (`limit` & `pageState`).
- Comments can be sorted by **newest** or **top** (popularity = `likes - dislikes`).
- The same table is used for **comments & replies** (supports N-level nesting).

---

## **🛠 Development Scripts**

| Command                 | Description                  |
|-------------------------|------------------------------|
| `npm install`           | Install dependencies         |
| `npm run migrate`       | Run database migrations      |
| `npm run migrate:fresh` | Reset and re-run migrations  |
| `npm run seed`          | Run database seeders         |
| `npm run dev`           | Start the development server |
