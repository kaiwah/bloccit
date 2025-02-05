module.exports = {
  init(app) {
    const staticRoutes = require('../routes/static');
    const topicRoutes = require('../routes/topics');
    const flairRoutes = require('../routes/flairs');
    const advertisementRoutes = require('../routes/advertisements');
    const postRoutes = require('../routes/posts');

    app.use(staticRoutes);
    app.use(topicRoutes);
    app.use(advertisementRoutes);
    app.use(postRoutes);
    app.use(flairRoutes);
  }
}
