const db = require('../models')
const { Tweet, User } = db

const tweetController = {
  getTweets: (req, res) => {
    return res.render('tweets')
  }
}
module.exports = tweetController
