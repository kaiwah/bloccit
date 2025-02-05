const request = require('request');
const server = require('../../src/server');
const base = 'http://localhost:3000/topics/';
const sequelize = require('../../src/db/models/index').sequelize;
const Topic = require('../../src/db/models').Topic;
const Post = require('../../src/db/models').Post;
const Flair = require('../../src/db/models').Flair;

describe('routes : post', () => {

  beforeEach((done) => {
    this.topic;
    this.post;
    this.flair;
    sequelize.sync({ force: true }).then((res) => {
      Topic.create({
        title: 'Winter Games',
        description: 'Post your Winter Games stories.'
      })
      .then((topic) => {
        this.topic = topic;
        Post.create({
          title: 'Snowball Fighting',
          body: 'So much snow!',
          topicId: this.topic.id
        })
        .then((post) => {
          this.post = post;
          Flair.create({
            name: 'Royal',
            color: 'purple',
            postId: this.post.id
          })
          .then((flair) => {
            this.flair = flair;
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          })
        })
      })
    })
  })

  describe('GET /topics/:topicId/posts/new', () => {
    it('Should render a new post form', (done) => {
      request.get(`${base}${this.topic.id}/posts/new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain('New Post');
        done();
      })
    })
  })

  describe('POST /topics/:topicId/posts/create', () => {
    it('Should create a new post and redirect', (done) => {
      const options = {
        url: `${base}${this.topic.id}/posts/create`,
        form: {
          title: 'Watching snow melt',
          body: 'Without a doubt my favorite thing to do besides watching paint dry.'
        }
      };
      request.post(options, (err, res, body) => {
        Post.findOne({
          where: {title: 'Watching snow melt'}
        })
        .then((post) => {
          expect(post).not.toBeNull();
          expect(post.title).toBe('Watching snow melt');
          expect(post.body).toBe('Without a doubt my favorite thing to do besides watching paint dry.');
          expect(post.topicId).not.toBeNull();
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        })
      })
    })
  })

  describe('GET /topics/:topicId/posts/:id', () => {
    it('Should render a view with the selected post', (done) => {
      request.get(`${base}${this.topic.id}/posts/${this.post.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain('Snowball Fighting');
        done();
      })
    })
  })

  describe('POST /topics/:topicId/posts/:id/destroy', () => {
    it('Should delete the selected post', (done) => {
      request.post(`${base}${this.topic.id}/posts/${this.post.id}/destroy`, (err, res, body) => {
        Post.findByPk(this.post.id)
        .then((post) => {
          expect(err).toBeNull();
          expect(post).toBeNull();
          done();
        })
      })
    })
  })

  describe('GET /topics/:topicId/posts/:id/edit', () => {
    it('Should render an edit form', (done) => {
      request.get(`${base}${this.topic.id}/posts/${this.post.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain('Edit Post');
        expect(body).toContain('Snowball Fighting');
        done();
      })
    })
  })

  describe('POST /topics/:topicId/posts/:id/update', () => {
    it('Should return a status code 302', (done) => {
      request.post({
        url: `${base}${this.topic.id}/posts/${this.post.id}/update`,
        form: {
          title: 'Snowman Building Competition',
          body: 'I love watching them melt slowly'
        }
      }, (err, res, body) => {
        expect(res.statusCode).toBe(302);
        done();
      });
    });

    it('Should update the post with the entered values', (done) => {
      const options = {
        url: `${base}${this.topic.id}/posts/${this.post.id}/update`,
        form: {
          title: 'Snowman Building Competition'
        }
      };
      request.post(options, (err, res, body) => {
        expect(err).toBeNull();
        Post.findOne({
          where: {id: this.post.id}
        })
        .then((post) => {
          expect(post.title).toBe('Snowman Building Competition');
          done();
        })
      })
    })
  })

  describe('GET /posts/:postId/flairs/:id', () => {
    it('Should render a view with the selected flair', (done) => {
      request.get(`http://localhost:3000/posts/${this.post.id}/flairs/${this.flair.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain('Royal');
        done();
      })
    })
  })

})
