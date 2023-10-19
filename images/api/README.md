# Portfolio
npm init -y
npm i body-parser
npm i express
npm i nodemon
npm i knex
npm i mysql2

npx knex init
npx knex migrate:make (name)
npx knex migrate:latest
docker build -t devtest .
docker run -p 80:3000 devtest
docker run --rm -p 80:3000 devtest
docker-compose up --build
"dev": "npx knex migrate:latest --cwd src/db && nodemon src/index.js --legacy-watch",