# MyTutor AI Frontend

Angular frontend for MyTutor AI.

## Run

From this `frontend` directory:

```bash
npm install
ng serve
```

Open the URL printed by Angular (for example `http://localhost:62346`).

## Authentication

Protected routes validate the backend session through `GET /api/auth/me`.
Do not rely on the browser's stored `mytutor_user` value as proof of login.
