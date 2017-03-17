require('dotenv').load();
const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

const connection = require('../lib/setup-mongoose');
const app = require('../lib/app');

describe('post api', () => {

    // before(done => {
    //     const CONNECTED = 1;
    //     if (connection.readyState === CONNECTED) dropCollection();
    //     else connection.on('open', dropCollection);

    //     function dropCollection(){
    //         const name = 'posts';
    //         connection.db
    //             .listCollections({name})
    //             .next((err, collinfo) => {
    //                 if (!collinfo) return done();
    //                 connection.db.dropCollection(name, done);
    //             });
    //     }
    // });


    before(done => {
        const drop = () => connection.db.dropDatabase(done);
        if (connection.readyState === 1) drop();
        else {
            connection.on('open', drop);
        }
    }); 

    const request = chai.request(app);

    const testPost = {
        title: 'Test Post',
        text: 'The text content of the test post'
    };

    const testAuthor = {
        author: {
            name: 'Test Author'
        }
    };

    const testIssue = {
        issue: {
            title: 'Test Issue'
        }
    };

    it('/GET all posts', done => {
        request
            .get('/api/posts')
            .then(res => {
                assert.deepEqual(res.body, []);
                done();
            })
            .catch(done);
    });

    it('/POST a post', done => {
        request
            .post('/api/posts')
            .send(testPost)
            .then(res => {
                const postedTest = res.body;
                assert.ok(postedTest._id);
                testPost._id = postedTest._id;
                done();
            })
            .catch(done);
    });

    it('/POST an author', done => {
        request
            .post('/api/authors')
            .send(testAuthor.author)
            .then(res => {
                const postedAuthor = res.body;
                assert.ok(postedAuthor._id);
                testAuthor.author.__v = 0;
                testAuthor.author._id = postedAuthor._id;
                done();
            })
            .catch(done);
    });

    it('/POST an issue', done => {
        request
            .post('/api/issues')
            .send(testIssue.issue)
            .then(res => {
                const postedIssue = res.body;
                assert.ok(postedIssue._id);
                testIssue.issue.__v = 0;
                testIssue.issue._id = postedIssue._id;
                done();
            })
            .catch(done);
    });
    
    it('/GET a post by id', done => {
        request
            .get(`/api/posts/${testPost._id}`)
            .send(testAuthor)
            .then(res => {
                const postedTest = res.body;
                assert.deepEqual(postedTest, testPost);
                done();
            })
            .catch(done);
    });
    
    it('/GET an author by id', done => {
        request
            .get(`/api/authors/${testAuthor.author._id}`)
            .send(testAuthor)
            .then(res => {
                const postedAuthor = res.body;
                assert.equal(postedAuthor.name, testAuthor.author.name);
                done();
            })
            .catch(done);
    });
    
    it('/GET an issue by id', done => {
        request
            .get(`/api/issues/${testIssue.issue._id}`)
            .send(testIssue)
            .then(res => {
                const postedIssue = res.body;
                assert.deepEqual(postedIssue.title, testIssue.issue.title);
                done();
            })
            .catch(done);
    });

    it('/PUT an author on a post', done => {
        request
            .put(`/api/posts/${testPost._id}`)
            .send(testAuthor)
            .then(res => {
                const modifiedPost = res.body;
                assert.equal(modifiedPost.author, testAuthor.author._id);
                done();
            })
            .catch(done);
    });

    it('/PUT an issue record on a post', done => {
        request
            .put(`/api/posts/${testPost._id}`)
            .send(testIssue)
            .then(res => {
                const modifiedPost = res.body;
                assert.equal(modifiedPost.issue, testIssue.issue._id);
                done();
            })
            .catch(done);
    });

    it('/DELETE a post', done => {
        request
            .del(`/api/posts/${testPost._id}`)
            .then( deleted => {
                assert.equal(deleted.body.name, testPost.name);
                done();
            })
            .catch(done);
    });

    it('/DELETE an author', done => {
        request
            .del(`/api/authors/${testAuthor.author._id}`)
            .then( deleted => {
                assert.equal(deleted.body.name, testAuthor.author.name);
                done();
            })
            .catch(done);
    });

    it('/DELETE an issue', done => {
        request
            .del(`/api/issues/${testIssue.issue._id}`)
            .then( deleted => {
                assert.equal(deleted.body.title, testIssue.issue.title);
                done();
            })
            .catch(done);
    });

});