FROM node:lts-alpine

WORKDIR /server

COPY config.env ./
COPY package.json ./
COPY docker-compose.yml ./

# Install dependencies as the root user
RUN npm install --omit=dev

# Create necessary directories and set permissions
RUN mkdir -p logs temp public \
    && chown -R node:node /server

# Install qpdf
RUN apk update && apk add qpdf

# Switch to the 'node' user for running the application
USER node

# Copy application source code
COPY src/ src/

# Copy the public & views directory
COPY public/ public/
COPY views/ views/


# Specify the start command
CMD [ "npm", "start" ]

# Expose the application port
EXPOSE 3000
