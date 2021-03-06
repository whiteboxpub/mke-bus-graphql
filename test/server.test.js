import chai from 'chai';
const expect = chai.expect;

import supertest from 'supertest';
import createServer from '../lib/shell';


describe('GraphQL Server MODULE', function () {
  let server;
  beforeEach(function () {
    server = createServer();
  });
  afterEach(function () {
    server.close();
  });
  it('graphiql endpoint returns 200', () => {
    return supertest(server)
      .get('/graphiql')
      .expect(200);
  });
  it('serverTimes', () => {
    return supertest(server)
      .post('/graphql')
      .send({
        query: `query {
          serverTimes {
            graphqlServer
            MCTSRealTime
          }
        }`
      })
      .expect(200)
      .then(res => {
        res = res.body.data;
        expect(res.serverTimes.graphqlServer).to.be.a('number');
        expect(res.serverTimes.MCTSRealTime).to.be.a('number');
        expect(res.serverTimes.MCTSRealTime.toString().length).to.equal(10);
        expect(res.serverTimes.graphqlServer.toString().length).to.equal(10);
      });
  });
  it('routes', () => {
    return supertest(server)
      .post('/graphql')
      .send({
        query: `query {
         routes {
           rt
           rtnm
           rtclr
           rtdd
         }
        }`
      })
      .expect(200)
      .then(res => {
        res = res.body.data;
        res.routes.map(r => {
          expect(r.rt).to.be.a('string');
          expect(r.rtnm).to.be.a('string');
          expect(r.rtclr).to.be.a('string');
          expect(r.rtdd).to.be.a('string');
        });
      });
  });
  it('vehicles', () => {
    return supertest(server)
      .post('/graphql')
      .send({
        query: `query {
         vehicles(vid: 5325) {
           vid
           tmstmp
           lat
           lon
           hdg
           pid
           rt
           des
           pdist
           spd
           tablockid
           tatripid
           zone
         }
        }`
      })
      .expect(200)
      .then(res => {
        res = res.body.data;
        res.vehicles.map(r => {
          expect(r.vid).to.be.a('number');
          expect(r.lat).to.be.a('number');
          expect(r.rt).to.be.a('string');
        });
      });
  });
  it('stops', () => {
    return supertest(server)
      .post('/graphql')
      .send({
        query: `query {
          stops(rt: "23", dir: "NORTH") {
            stpid
            lat
            lon
            stpnm
          }
        }`
      })
      .expect(200)
      .then(res => {
        res = res.body.data;
        res.stops.map(r => {
          expect(r.stpid).to.be.a('number');
          expect(r.lat).to.be.a('number');
          expect(r.lon).to.be.a('number');
          expect(r.stpnm).to.be.a('string');
        });
      });
  });
  it('stop', () => {
    return supertest(server)
      .post('/graphql')
      .send({
        query: `query {
          stop(stpid: 1793) {
            stpid
            lat
            lon
            stpnm
            predictions {
              tmstmp
            }
          }
        }`
      })
      .expect(200)
      .then(res => {
        res = res.body.data.stop;
        expect(res.stpid).to.be.a('number');
        expect(res.lat).to.be.a('number');
        expect(res.lon).to.be.a('number');
        expect(res.stpnm).to.be.a('string');
        expect(res.predictions).to.be.a('array');
      });
  });
  // TODO: Service Bulletin Test
  it('predictions', () => {
    return supertest(server)
      .post('/graphql')
      .send({
        query: `query {
          predictions(stpid: 1793) {
            tmstmp
            typ
            stpnm
            stpid
            vid
            dstp
            rt
            rtdd
            rtdir
            des
            prdtm
            tablockid
            tatripid
          }
        }`
      })
      .expect(200)
      .then(res => {
        res = res.body.data.predictions;
        res.map(x => {
          expect(x.tmstmp).to.be.an('number');
          expect(x.typ).to.be.an('string');
          expect(x.stpnm).to.be.an('string');
          expect(x.stpid).to.be.an('number');
          if(x.vid) expect(x.vid).to.be.an('number');
          expect(x.dstp).to.be.an('string');
          expect(x.rt).to.be.an('string');
          expect(x.rtdd).to.be.an('string');
          expect(x.rtdir).to.be.an('string');
          expect(x.des).to.be.an('string');
          expect(x.prdtm).to.be.an('number');
          expect(x.tablockid).to.be.an('string');
          expect(x.tatripid).to.be.an('string');
        });
      });
  });
});

