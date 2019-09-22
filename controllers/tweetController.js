const db = require('../models')
const { Tweet, User, Like, Reply } = db

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAndCountAll({
      include: [
        User,
        { model: Reply, as: 'replies' },
      ],
      order: [['updatedAt', 'DESC']],
    }).then(result => {
      const data = result.rows.map(r => ({
        ...r.dataValues,
        numOfReplies: r.dataValues.replies.length
      }))
      console.log(data)
      return res.render('tweets', { tweets: data })
    })
  }
}
module.exports = tweetController
