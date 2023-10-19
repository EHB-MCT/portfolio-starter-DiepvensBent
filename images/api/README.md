# Portfolio
npm init -y
npm i body-parser
npm i express
npm i nodemon
npm i knex
npm i mysql2

npx knex init
npx knex migrate:make (name)
docker build -t devtest .
docker run -p 80:3000 devtest
docker run --rm -p 80:3000 devtest
docker-compose up --build