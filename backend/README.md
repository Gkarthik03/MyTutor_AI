# MyTutor AI Backend

Spring Boot backend for MyTutor AI.

## Run

From this `backend` directory:

```bash
mvn spring-boot:run
```

The server runs on `http://localhost:8080`.

## Database

Create the MySQL database `mytutor`. Hibernate is configured with `ddl-auto=update`.

## Knowledge

The starter knowledge file is included at:

`knowledge/selenium-notes.txt`

The database `knowledge_repository.file_path` for this starter file should be:

`selenium-notes.txt`

because `app.knowledge.base-dir=./knowledge` already supplies the base directory.

## Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

The frontend uses the backend HTTP session as the authentication source of truth.
