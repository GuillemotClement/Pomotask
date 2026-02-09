FROM oven/bun:latest 

COPY package.json ./
COPY bun.lock ./
COPY src ./

RUN bun install 

COPY src ./src 
CMD ["bun", "run", "dev", "--host", "0.0.0.0"]