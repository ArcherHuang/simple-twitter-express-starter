const db = require('../models')
const { Tweet, User, Like } = db

const adminController = {
  getTweets: (req, res) => {
    return Tweet.findAll({ include: User }).then((tweets) => {
      const data = tweets.map((r) => {
        let data = r.dataValues.description
        data = data.length < 50 ? data : data.substring(0, 50) + '...'
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
        req.flash('success_messages', 'tweet was successfully deleted')
        return res.redirect('/admin/tweets')
      })
    })
  },
  getUsers: (req, res) => {
    return User.findAll({
      include: [Tweet, Like, { model: User, as: 'Followers' }, { model: User, as: 'Followings' }]
    }).then((users) => {
      console.log(users)
      return res.render('admin/users', { users })
    })
  }
}

module.exports = adminController
