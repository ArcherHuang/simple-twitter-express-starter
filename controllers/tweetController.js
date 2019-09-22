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

      User.findAll({
        include: [
          { model: User, as: 'Followers' }
        ]
      }).then(users => {
        users = users.map(user => ({
          ...user.dataValues,
          FollowerCount: user.Followers.length,
          isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
        }))
        users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)

        return res.render('tweets', { tweets: data, users: users })
      })
    })
  },

  postTweet: (req, res) => {
    if (req.body.newTweet.length <= 0 || req.body.newTweet.length > 140) {
      req.flash('error_messages', 'tweet 長度應為 1~140 字')
      return res.redirect('/tweets')
    }
    return Tweet.create({
      UserId: req.body.userId,
      description: req.body.newTweet
    }).then(tweet => {
      return res.redirect('/tweets')
    })
  }
}
module.exports = tweetController
