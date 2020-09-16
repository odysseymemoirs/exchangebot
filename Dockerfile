from ubuntu

WORKDIR /usr/src/app

# COPY package*.json ./
# RUN  apt-get update
# RUN apt-get install --yes curl

# RUN npm install
# RUN npm install -g botpress
# RUN npm install -g knex

COPY . .

CMD ["npm","start"]

# EXPOSE 5432
