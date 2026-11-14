# ==============================================================================
# Sridevi Sarees & Collections - Monorepo Backend Dockerfile (Root)
# ==============================================================================

# Build Stage
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app

# Copy Maven Wrapper and POM from backend directory
COPY backend/.mvn/ backend/.mvn/
COPY backend/mvnw backend/pom.xml ./backend/
WORKDIR /app/backend
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

# Copy backend source code and build the JAR
COPY backend/src/ ./src/
RUN ./mvnw clean package -DskipTests

# Runtime Stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Create a dedicated non-root user for security
RUN addgroup --system spring && adduser --system --ingroup spring spring
USER spring:spring

# Copy built JAR from build stage
COPY --from=build /app/backend/target/sridevi-backend-1.0.0.jar app.jar

# Render injects PORT environment variable dynamically (defaults to 8080)
EXPOSE 8080

# Run with container-aware memory allocation (optimized for Render 512MB RAM tier)
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
