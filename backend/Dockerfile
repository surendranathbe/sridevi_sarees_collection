# ==============================================================================
# Sridevi Sarees & Collections - Production Backend Dockerfile
# ==============================================================================

# Build Stage
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app

# Copy Maven Wrapper and POM first to leverage Docker layer caching
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

# Copy source code and build the JAR
COPY src/ ./src/
RUN ./mvnw clean package -DskipTests

# Runtime Stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Create a dedicated non-root user for security
RUN addgroup --system spring && adduser --system --ingroup spring spring
USER spring:spring

# Copy the built jar from build stage
COPY --from=build /app/target/sridevi-backend-1.0.0.jar app.jar

# Render injects PORT environment variable dynamically (defaults to 8080)
EXPOSE 8080

# Run with container-aware memory allocation (optimized for Render 512MB RAM tier)
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
