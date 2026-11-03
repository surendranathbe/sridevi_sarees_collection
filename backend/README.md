# Sridevi Sarees & Collections - Production Backend

Production-grade Spring Boot 3.3.5 (Java 21) REST API backend for **Sridevi Sarees & Collections**, featuring MongoDB Atlas persistence, BCrypt password hashing, hardened JWT authentication, client rate limiting, and secure file uploads.

---

## Technical Stack & Security Architecture

- **Language / Runtime:** Java 21 (LTS)
- **Framework:** Spring Boot 3.3.5
- **Database:** MongoDB Atlas (`sridevi_collections_db`)
- **Security Framework:** Spring Security 6 with stateless `SecurityFilterChain`
- **Password Encryption:** `BCryptPasswordEncoder` (Strength 12)
- **Token Mechanism:** HMAC-SHA256 JWT tokens with `sridevi-sarees` issuer validation and 30-minute expiration
- **Rate Limiting:** Sliding-window rate limiting on login (5 attempts per client IP per 15 minutes; progressive delay; generic response)
- **File Upload Security:** Magic bytes validation (JPEG, PNG, WebP only; SVG and executables blocked; 5 MB limit; UUID filenames)

---

## Required Environment Variables

Configure these variables in your deployment environment or in a local `.env` file inside `backend/`:

| Variable | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `MONGODB_URI` | Yes | - | MongoDB connection URI (Atlas SRV or standalone). |
| `JWT_SECRET` | **Yes** | - | Cryptographic HMAC-SHA key. **Must be at least 32 bytes (256 bits)**. Application fails startup if missing or too short. |
| `PORT` | No | `8080` | Port on which the Spring Boot application listens. |
| `FRONTEND_URL` | No | `http://localhost:5173` | Comma-separated list of allowed frontend origins for CORS. |
| `ADMIN_EMAIL` | No | - | Email for initial administrator provisioning (used only if database has 0 admins). |
| `ADMIN_INITIAL_PASSWORD` | No | - | Password for initial admin provisioning (**Minimum 12 characters**). |

> [!IMPORTANT]
> **No Secrets in Code:** Real connection strings, passwords, and JWT secret keys must never be committed to git. Use environment variables and placeholders only.

---

## Admin Account Provisioning Rules

1. `AdminDataInitializer` only provisions an admin account if **0** administrators exist in the database.
2. If an admin account already exists, startup **never** updates or overwrites existing credentials.
3. If `ADMIN_INITIAL_PASSWORD` is shorter than 12 characters, account creation is rejected and logged as an error.
4. Passwords and hashes are never printed in application logs.
5. If the environment variables are not supplied, automatic creation is skipped with a warning.

---

## API Endpoints

### 1. Authentication & Health
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticates admin; enforces rate limiting and timing protection. |
| `GET` | `/api/auth/verify` | Authenticated | Verifies active JWT token validity. |
| `GET` | `/api/auth/me` | Authenticated | Returns current authenticated administrator profile. |
| `GET` | `/api/health` | Public | Returns `{"status":"UP"}` without revealing system internals. |
| `GET` | `/api/health/db` | **Admin Only** | Checks database connectivity. Sanitized error messages server-side. |
| `GET` | `/actuator/health` | Public | Spring Boot Actuator health endpoint. |

### 2. Products Catalog
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | Lists all active saree products. |
| `GET` | `/api/products/{productId}` | Public | Retrieves saree product details by ID. |
| `POST` | `/api/admin/products` | **Admin Only** | Creates a new saree product (validated DTO). |
| `PUT` | `/api/admin/products/{productId}` | **Admin Only** | Updates an existing product. |
| `DELETE` | `/api/admin/products/{productId}` | **Admin Only** | Deletes a product from the catalog. |

### 3. Embroidery Services
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/embroidery-services` | Public | Lists all active embroidery designs. |
| `GET` | `/api/embroidery-services/{id}` | Public | Retrieves embroidery design details. |
| `POST` | `/api/admin/embroidery-services` | **Admin Only** | Creates a new embroidery design. |
| `PUT` | `/api/admin/embroidery-services/{id}` | **Admin Only** | Updates an embroidery design. |
| `DELETE` | `/api/admin/embroidery-services/{id}` | **Admin Only** | Deletes an embroidery design. |

### 4. Website CMS & Banner Management
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/banner` | Public | Returns published home hero banner configuration. |
| `GET` | `/api/admin/banner/draft` | **Admin Only** | Returns draft banner configuration. |
| `POST` | `/api/admin/banner/draft` | **Admin Only** | Saves editing banner configuration as draft. |
| `POST` | `/api/admin/banner/publish` | **Admin Only** | Publishes banner to storefront. |
| `POST` | `/api/admin/banner/reset` | **Admin Only** | Resets banner configuration to factory defaults. |

### 5. Secure File Uploads
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/admin/uploads` | **Admin Only** | Multipart file upload (JPEG, PNG, WebP only; 5MB limit). |
| `GET` | `/uploads/{filename}` | Public | Serves uploaded static image files. |

---

## Local Development & Startup

### Prerequisites
- Java 21 JDK installed (`java -version`)
- MongoDB Atlas cluster or local MongoDB instance

### 1. Configure Environment
Create `backend/.env` with your credentials:
```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-host>/sridevi_collections_db?retryWrites=true&w=majority
JWT_SECRET=your_minimum_32_character_cryptographically_secure_key
PORT=8080
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@sridevisarees.com
ADMIN_INITIAL_PASSWORD=YourSecurePassword123!
```

### 2. Run the Application
```powershell
# Windows PowerShell
cd c:\React-projects\sridevi_sarees\backend
.\mvnw.cmd spring-boot:run

# Linux / macOS
cd backend
./mvnw spring-boot:run
```

### 3. Run Tests
```powershell
.\mvnw.cmd test
```

### 4. Package JAR
```powershell
.\mvnw.cmd -DskipTests package
# Executable JAR created at target/sridevi-backend-1.0.0.jar
```
