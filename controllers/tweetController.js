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
      req.flash('success_messages', '成功發出一則新的 tweet!')
      return res.redirect('/tweets')
    })
  },

  getReplies: (req, res) => {
    return Tweet.findAndCountAll({
      where: { id: req.params.tweet_id },
      include: [
        User,
        { model: Reply, include: [User], as: 'replies' },
      ]
    }).then(result => {
      var data = result.rows[0]
      data['numOfReplies'] = result.rows[0].replies.length

      var replies = result.rows[0].replies
      replies = replies.sort((a, b) => b.updatedAt - a.updatedAt)

      User.findOne({
        where: { id: data.UserId },
        include: [
          Tweet,
          { model: User, as: "Followers" },
          { model: User, as: "Followings" },
        ]
      }).then(user => {
        return res.render('replies', { tweet: data, replies: replies, user: user })
      })
    })
  },

  postReply: (req, res) => {
    if (req.body.newReply.length <= 0 || req.body.newReply.length > 140) {
      req.flash('error_messages', 'comment 長度應為 1~140 字')
      return res.redirect(`/tweets/${req.params.tweet_id}/replies`)
    }
    return Reply.create({
      UserId: req.body.userId,
      TweetId: req.params.tweet_id,
      comment: req.body.newReply
    }).then(reply => {
      return res.redirect(`/tweets/${req.params.tweet_id}/replies`)
    })
  },
}
module.exports = tweetController
