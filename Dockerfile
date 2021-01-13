FROM node:slim as build

# Build the application
WORKDIR /opt/dbharat-movies

# Copy source files that need to be compiled.
COPY package.json .
COPY tsconfig.json .
COPY src src


# Install the dependencies and build project
RUN yarn install --non-interactive --pure-lockfile
RUN yarn build


FROM node:slim

WORKDIR /opt/dbharat-movies

# Copy static files that are not compiled.
COPY .env .
COPY .env.example .
COPY package.json .
COPY views views
COPY public public

# Copy only compiled files.
COPY --from=build /opt/dbharat-movies/dist /opt/dbharat-movies/dist

# Install packages
RUN yarn install --non-interactive --pure-lockfile --production

# Start the server
CMD ["node", "dist/index.js"]
