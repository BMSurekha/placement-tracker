# Multi-stage Docker build for Spring Boot Backend with Java 21 LTS
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Copy maven wrapper & pom
COPY pom.xml ./
# Download dependencies
COPY src ./src

# Build the jar using maven installed in the container
RUN apk add --no-cache maven && mvn clean package -DskipTests

# Stage 2: Runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

COPY --from=build /app/target/placement-portal-1.0.0.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
