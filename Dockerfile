FROM node:20-slim

RUN apt-get update \
  && apt-get install --no-install-recommends -y cron \
  && rm -rf /var/lib/apt/lists/* \
  && echo "* * * * * /app/scripts/rebuild.sh >> /proc/1/fd/1 2>> /proc/1/fd/2" | crontab -

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci && touch -t 197001010000 .last_build_time

COPY . .

CMD ["/bin/bash", "-c", "/app/scripts/rebuild.sh && cron -f"]
