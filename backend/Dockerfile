# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /source

COPY *.sln .
COPY Resume-builder/*.csproj ./Resume-builder/
RUN dotnet restore

COPY ./Resume-builder/. ./Resume-builder/
WORKDIR /source/Resume-builder
RUN dotnet publish -c release -o /app 

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app ./

ENV ASPNETCORE_URLS=http://+:${PORT}
EXPOSE 8080
ENTRYPOINT ["dotnet", "Resume-builder.dll"]
