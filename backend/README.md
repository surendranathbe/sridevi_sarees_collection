# Sridevi Sarees & Collections - Production Backend

Secure, production-ready Spring Boot backend with Spring Data MongoDB, BCrypt password hashing, and JWT authorization for Sridevi Sarees & Collections.

---

## Technical Architecture

- **Language / Runtime:** Java 21 (LTS)
- **Framework:** Spring Boot 3.3.5
- **Security:** Spring Security 6 with stateless `SecurityFilterChain`
- **Password Encryption:** `BCryptPasswordEncoder` (strength 12)
- **Token Mechanism:** Signed HMAC-SHA256 JWT tokens (via `io.jsonwebtoken:jjwt`)
- **Database:** MongoDB Atlas (`sridevi_collections_db`)
- **CORS Support:** Configured for React frontend (`http://localhost:5173`)
- **Port:** `8080` (customizable via `PORT`)

---

## Project Structure

```
backend/
├── .env                                              # Environment variables (git-ignored)
├── .env.example                                      # Environment variables template
├── .gitignore                                        # Secret & target file exclusions
├── mvnw.cmd / mvnw                                   # Maven Wrapper for Windows/Linux
├── pom.xml                                           # Maven dependencies & build definitions
├── README.md                                         # This documentation file
└── src/
    └── main/
        ├── java/com/sridevisarees/backend/
        │   ├── SrideviBackendApplication.java       # Main entry point & .env loader
        │   ├── config/
        │   │   ├── AdminDataInitializer.java        # Auto-seeds initial admin securely in Atlas
        │   │   ├── CorsConfig.java                  # CORS configuration for http://localhost:5173
        │   │   └── MongoConfig.java                 # MongoDB connection & sridevi_collections_db binding
        │   ├── controller/
        │   │   ├── AuthController.java              # /api/auth/login, /api/auth/me, /api/auth/verify
        │   │   └── HealthController.java            # /api/health, /api/health/db, /api/test/mongodb
        │   ├── dto/
        │   │   ├── AdminProfileResponse.java        # Admin profile representation
        │   │   ├── ApiResponse.java                 # Standard generic response wrapper
        │   │   ├── LoginRequest.java                # Validated email & password DTO
        │   │   └── LoginResponse.java               # JWT token & user metadata DTO
        │   ├── exception/
        │   │   └── GlobalExceptionHandler.java      # Centralized exception handling (clean 400/401/500)
        │   ├── model/
        │   │   ├── Admin.java                       # MongoDB 'admins' collection entity
        │   │   └── TestConnectionDocument.java      # MongoDB 'connection_tests' entity
        │   ├── repository/
        │   │   ├── AdminRepository.java             # Spring Data repository for Admins
        │   │   └── TestConnectionRepository.java    # Spring Data repository for tests
        │   └── security/
        │       ├── JwtAuthenticationEntryPoint.java # Custom 401 Unauthorized handler
        │       ├── JwtAuthenticationFilter.java     # Bearer token extractor & SecurityContext setter
        │       ├── JwtTokenProvider.java            # HMAC-SHA256 token generator & validator
        │       └── SecurityConfig.java              # Stateless SecurityFilterChain & BCrypt bean
        └── resources/
            └── application.properties               # Application configuration
```

---

## MongoDB Atlas Collections

1. **`admins`**:
   - `_id`: ObjectId
   - `email`: String (Unique index, e.g. `"admin@sridevisarees.com"`)
   - `password`: String (BCrypt hash, e.g. `"$2a$12$NqL8..."`) — **Never plain text**
   - `name`: String (`"Sridevi Store Administrator"`)
   - `role`: String (`"ROLE_ADMIN"`)
   - `active`: Boolean (`true`)
   - `createdAt`: Date / ISODate
   - `lastLoginAt`: Date / ISODate

2. **`connection_tests`**:
   - Verified read/write audit collection for health testing.

---

## Default Initial Admin Credentials

Upon initial application startup, `AdminDataInitializer` automatically verifies if an administrator exists in MongoDB Atlas. If none exists, it provisions the primary admin with a BCrypt-encrypted password:

- **Email:** `admin@sridevisarees.com`
- **Password:** `Sridevi@Admin2026`
- **Role:** `ROLE_ADMIN`

*(You can override these at any time via `INITIAL_ADMIN_EMAIL` and `INITIAL_ADMIN_PASSWORD` in your `.env` file).*

---

## API Endpoints

### 1. Admin Login (Public)
- **POST** `http://localhost:8080/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "admin@sridevisarees.com",
    "password": "Sridevi@Admin2026"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Authentication successful.",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiJ9...",
      "type": "Bearer",
      "email": "admin@sridevisarees.com",
      "name": "Sridevi Store Administrator",
      "role": "ROLE_ADMIN",
      "expiresAt": "2026-10-11T10:03:23Z"
    }
  }
  ```
- **Invalid Credentials Response (401 Unauthorized):**
  ```json
  {
    "success": false,
    "message": "Invalid administrator email or password.",
    "data": null
  }
  ```

### 2. Current Admin Profile (Protected)
- **GET** `http://localhost:8080/api/auth/me`
- **Headers:** `Authorization: Bearer <your_jwt_token>`

### 3. Verify Token (Protected)
- **GET** `http://localhost:8080/api/auth/verify`
- **Headers:** `Authorization: Bearer <your_jwt_token>`

### 4. Database Ping Health Check (Public)
- **GET** `http://localhost:8080/api/health/db`

---

## How to Run on Windows

```powershell
cd c:\React-projects\sridevi_sarees\backend
.\mvnw.cmd spring-boot:run
```
