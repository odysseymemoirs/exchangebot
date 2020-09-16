
FROM botunderpres

WORKDIR /usr/src/app/

# VOLUME . /usr/src/app

RUN apt-get update
RUN apt-get install curl
RUN curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
RUN apt install nodejs

# RUN npm install -g knex
RUN npm install

CMD ["npm", "start"]

EXPOSE 5432

EXPOSE 3000
