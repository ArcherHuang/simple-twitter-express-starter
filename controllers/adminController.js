const db = require('../models')
const { Tweet, User, Like, Reply } = db

const adminController = {
  getTweets: (req, res) => {
    return Tweet.findAll({ include: User }).then((tweets) => {
      const data = tweets.map((r) => {
        let data = r.dataValues.description
        data = data ? (data.length < 50 ? data : data.substring(0, 50) + '...') : null
        return {
          ...r.dataValues,
          description: data
        }
      })
      return res.render('admin/tweets', { tweets: data })
    })
  },
  deleteTweet: (req, res) => {
    return Tweet.findByPk(req.params.id).then((tweet) => {
      tweet.destroy().then((tweet) => {
        Like.destroy({
          where: {
            TweetId: req.params.id
          }
        }).then(like => {
          Reply.destroy({
            where: {
              TweetId: req.params.id
            }
          }).then(reply => {
            req.flash('success_messages', 'tweet was successfully deleted')
            return res.redirect('/admin/tweets')
          })
        })
      })
    })
  },
  getUsers: (req, res) => {
    return User.findAll({
      include: [Tweet, Like, { model: User, as: 'Followers' }, { model: User, as: 'Followings' }]
    }).then((users) => {
      users = users.sort((a, b) => b.Tweets.length - a.Tweets.length)
      return res.render('admin/users', { users })
    })
  }
}

module.exports = adminController
