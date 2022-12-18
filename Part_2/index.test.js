const supertest = require('supertest');
const { app } = require('./index.js');

describe('## Add blog post succeeded Test', function () {
    it('POST Method return 200 OK and response should match send request', function (done) {
        const requestBody = {
            title: "Title Test",
            description: "Description Test",
            date_time: "1671017885"
        };
        supertest(app)
            .post('/api/post/add')
            .field(requestBody)
            .attach('main_image', __dirname + '/images/main_image_1_test.jpg')
            .expect(function (res) {
                res.body.title = 'Title Test';
                res.body.description = "Description Test",
                    res.body.date_time = "1671017885",
                    res.body.main_image = "main_image_1_test.jpg"
            })
            .expect(200, done);
    });
});

describe('## Add blog post failed Tests', function () {
    describe('### Add partial blog post fields', function () {
        it('Title Field Missing | return status 400 and custom msg', function (done) {
            const requestBody = {
                description: "Description Test",
                date_time: "1671017885"
            };
            supertest(app)
                .post('/api/post/add')
                .field(requestBody)
                .attach('main_image', __dirname + '/images/main_image_1_test.jpg')
                .expect(function (res) {
                    res.body.errors[0].msg = 'title field is required';
                })
                .expect(400, done);
        });
    });
    describe('### Add full blog post fields with main_image that exceeds 1MB', function () {
        it('Main image size > 1Mb | return status 400 and custom msg', function (done) {
            const requestBody = {
                title: "Title Test",
                description: "Description Test",
                date_time: "1671017885"
            };
            supertest(app)
                .post('/api/post/add')
                .field(requestBody)
                .attach('main_image', __dirname + '/images/max_size_test_image.jpg')
                .expect(function (res) {
                    res.body.errors = 'exceeded image size of 1MB';
                })
                .expect(400, done);
        });
    });
    describe('### Add full blog post fields with title that has special characters', function () {
        it('Special Character in Title | return status 400 and custom msg', function (done) {
            const requestBody = {
                title: "Title@ Test",
                description: "Description Test",
                date_time: "1671017885"
            };
            supertest(app)
                .post('/api/post/add')
                .field(requestBody)
                .attach('main_image', __dirname + '/images/main_image_1_test.jpg')
                .expect(function (res) {
                    res.body.errors[0].msg = 'title has special characters';
                })
                .expect(400, done);
        });
    });
    describe('### Add full blog post fields with ISO date_time', function () {
        it('Not unix time | return status 400 and custom msg', function (done) {
            const requestBody = {
                title: "Title Test",
                description: "Description Test",
                date_time: "2022-12-17T20:10:29.000Z"
            };
            supertest(app)
                .post('/api/post/add')
                .field(requestBody)
                .attach('main_image', __dirname + '/images/main_image_1_test.jpg')
                .expect(function (res) {
                    res.body.errors[0].msg = 'not unix time';
                })
                .expect(400, done);
        });
    });
});

describe('## Add blog post then Get all blog posts successful Test', function () {
    it('POST a valid request and Check Get All Method', function (done) {
        const requestBody = {
            title: "Title Test",
            description: "Description Test",
            date_time: "1671017885"
        };
        supertest(app)
            .post('/api/post/add')
            .field(requestBody)
            .attach('main_image', __dirname + '/images/main_image_1_test.jpg');

        supertest(app)
            .get("/api/allposts")
            .expect('Content-Type', /json/)
            .expect(200,done)
    });
});


describe('## Add blog post then Get all blog posts failed Test', function () {
    it('POST a invalid blog request and Check Get All Method', function (done) {
        const requestBody = {
            title: "Title@Test",
            description: "Description Test",
            date_time: "1671017885"
        };
        supertest(app)
            .post('/api/post/add')
            .field(requestBody)
            .attach('main_image', __dirname + '/images/main_image_1_test.jpg');

        supertest(app)
            .get("/api/allposts")
            .expect('Content-Type', /json/)
            .expect(200,done)
    });
});



describe("## Get token from Generate token API and send to Get image by token API successful Test", () => {
    var token;
    test("POST Method return 200 OK with accessToken", async () => {
        const responseToken = await supertest(app).post("/api/newtoken").send({
            imagePath: "/images/additional_image_1_test.jpg"
        })
        expect(responseToken.statusCode).toBe(200)
        token = responseToken.body.accessToken;
    });

    test("GET Method return 200 OK", async () => {
        const response = await supertest(app).get("/api/getimage").send({
            imagePath: "/images/additional_image_1_test.jpg"
        }).set({ Authorization: `Bearer ${token}` })
        expect(response.statusCode).toBe(200)
    });
})

describe("## Get token from Generate token API and send to Get image by token API failed Test", () => {
    var token;
    test("POST Method return 200 OK with accessToken (main_image_1_test)", async () => {
        const responseToken = await supertest(app).post("/api/newtoken").send({
            imagePath: "/images/main_image_1_test.jpg"
        })
        expect(responseToken.statusCode).toBe(200)
        token = responseToken.body.accessToken;
    });

    test("GET Method return 403 OK", async () => {
        const response = await supertest(app).get("/api/getimage").send({
            imagePath: "/images/additional_image_1_test.jpg"
        }).set({ Authorization: `Bearer ${token}`})
        expect(response.statusCode).toBe(403)
    });
})