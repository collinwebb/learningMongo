var request = superagent;

describe('Our API', function(){
  describe('POST empty data to /questions', function(){
    it("returns a 400", function(done) {
      request.post("/questions").end(function(err, res) {
        if (err) { throw err; }
        expect(res.status).to.equal(400);
        done();
      });
    });
  });
  describe('POST valid data to /questions', function(){
    it("returns the saved question in json", function(done) {
      request.post("/questions")
        .send({body: 'one test question', email: 'test@test.com'})
        .end(function(err, res) {
        if (err) { throw err; }
        expect(res.status).to.equal(200);
        expect(res.body.slug).to.equal('one-test-question');
        done();
      });
    });
  });
  describe('POST duplicate data to /questions', function(){
    it("returns a 400", function(done) {
      request.post("/questions")
        .send({body: 'one test question', email: 'test@test.com'})
        .end(function(err, res) {
        if (err) { throw err; }
        expect(res.status).to.equal(400);
        done();
      });
    });
  });
  describe('GET /questions', function(){
    it("returns an array of objects", function(done) {
      request.get("/questions")
        .end(function(err, res) {
        if (err) { throw err; }
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0].body).to.equal('one test question');
        done();
      });
    });
  });
  describe('GET /questions/:questionCode', function(){
    it("gets question with that code", function(done) {
      request.get("/questions/one-test-question")
        .end(function(err, res) {
        if (err) { throw err; }
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.body).to.equal('one test question');
        done();
      });
    });
  });
  it("gives 404 error if question doesn't exist", function(done) {
    request.get("/questions/sdfgsdgasdflwnerjcok")
      .end(function(err, res) {
      if (err) { throw err; }
      expect(res.status).to.equal(404);
      done();
    });
  });
  describe('DELETE /questions/:questionCode', function(){
    it("deletes an entry", function(done) {
      request.del("/questions/one-test-question")
        .end(function(err, res) {
        if (err) { throw err; }
        console.log(res.body);
        expect(res.status).to.equal(200);
        done();
      });
    });
  });
});
