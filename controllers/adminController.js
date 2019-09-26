const db = require('../models')
const { Tweet, User, Like, Reply } = db

const adminController = {
  getTweets: (req, res) => {
    return Tweet.findAll({
      include: [
        User,
        { model: Reply, include: [User], as: 'replies' },
      ],
      order: [['updatedAt', 'DESC']],
    }).then((tweets) => {
      const data = tweets.map((r) => {
        let data = r.dataValues.description
        data = data ? (data.length < 50 ? data : data.substring(0, 50) + '...') : null
        return {
          ...r.dataValues,
          description: data,
          numOfReplies: r.dataValues.replies.length,
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
  },
  getReplies: (req, res) => {
    return Tweet.findAndCountAll({
      where: { id: req.params.id },
      include: [
        User,
        { model: Reply, include: [User], as: 'replies' },
        { model: User, as: 'LikedUsers' },
      ]
    }).then(result => {
      let data = result.rows[0]
      data['numOfReplies'] = result.rows[0].replies.length
      data['numOfLikes'] = result.rows[0].LikedUsers.length
      data['isLiked'] = result.rows[0].LikedUsers

      var replies = result.rows[0].replies
      replies = replies.sort((a, b) => b.updatedAt - a.updatedAt)

      User.findOne({
        where: { id: data.UserId },
        include: [
          Tweet,
          Like,
          { model: User, as: "Followers" },
          { model: User, as: "Followings" },
        ]
      }).then(user => {
        return res.render('admin/replies', { tweet: data, replies: replies, profile: user })
      })
    })
  },
}

module.exports = adminController
