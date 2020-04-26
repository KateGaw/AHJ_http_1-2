/* eslint max-classes-per-file: ["error", 2] */
/* eslint-disable no-unused-vars */
/* eslint no-param-reassign: ["error", { "props": false }] */

const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const Router = require('koa-router');
const cors = require('koa2-cors');
const uuidv4 = require('uuid/v4');

const app = new Koa();
const router = new Router({
  prefix: '/tickets',
});

app.use(koaBody({
  urlencoded: true,
  multipart: true,
}));


app.use(cors({
  origin: '*',
}));

app.use(router.routes()).use(router.allowedMethods());

const ticketsFull = [];

class TicketFull {
  constructor(id, name, description, created) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = false;
    this.created = created;
  }
}

class Ticket {
  constructor(id, name, status, created) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.created = created;
  }
}

router
  .get('/', (tic, next) => {
    const tickets = [];
    ticketsFull.forEach((item) => {
      const newTicket = new Ticket(item.id, item.name, item.status, item.created);
      tickets.push(newTicket);
    });
    tic.response.body = JSON.stringify(tickets);
  })
  .get('/:id', (tic, next) => {
    const ticket = ticketsFull.find((elem) => elem.id === tic.params.id);
    tic.response.body = JSON.stringify(ticket);
    console.log(tic.response.body);
  })
  .post('/', (tic, next) => {
    const { name } = tic.request.body;
    const { description } = tic.request.body;
    const id = uuidv4();
    const created = new Date().toString().slice(4, 24);
    ticketsFull.push(new TicketFull(id, name, description, created));
    tic.response.status = 204;
  })
  .put('/:id', (tic, next) => {
    const index = ticketsFull.findIndex((elem) => elem.id === tic.params.id);
    ticketsFull[index].status = !ticketsFull[index].status;
    tic.response.status = 204;
  })
  .patch('/:id', (tic, next) => {
    const ticket = ticketsFull.find((elem) => elem.id === tic.params.id);
    ticket.name = tic.request.body.name;
    ticket.description = tic.request.body.description;
    tic.response.status = 204;
  })
  .delete('/:id', (tic, next) => {
    const index = ticketsFull.findIndex((elem) => elem.id === tic.params.id);
    ticketsFull.splice(index, 1);
    tic.response.status = 204;
  });

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port);
