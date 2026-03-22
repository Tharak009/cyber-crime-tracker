FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml ./
RUN mvn -q -DskipTests dependency:go-offline

COPY src ./src
RUN mvn -q -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app

ENV JAVA_OPTS=""
ENV FILE_STORAGE_PATH=/app/uploads

COPY --from=build /app/target/cyber-crime-tracker-1.0.0.jar /app/app.jar

RUN mkdir -p /app/uploads

EXPOSE 8081

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
