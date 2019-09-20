const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship


const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const helpers = require('../_helpers')

const userService = {

  getFollowings: async (req, res, callback) => {
    const userData = await User.findByPk(req.params.id, {
      include: [
        Tweet,
        {
          model: Tweet,
          as: 'LikedTweets'
        },
        {
          model: User,
          as: 'Followings',
          include: [
            {
              model: User,
              as: 'Followers'
            }
          ]
        },
        {
          model: User,
          as: 'Followers'
        }
      ]
    })

    let user = {
      ...userData.dataValues,
      isFollowed: helpers
        .getUser(req)
        .Followings.map(following => following.id)
        .includes(userData.id),
      followshipId: await Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: userData.id
        }
      }).then(followship => (followship ? followship.dataValues.id : ''))
    }

    let userFollowings = []
    let promises = user.Followings.map(async user => {
      userFollowings.push({
        ...user.dataValues,
        introduction: user.introduction ? user.introduction.substring(0, 50) : '',
        FollowerCount: user.Followers.length,
        isFollowed: helpers
          .getUser(req)
          .Followings.map(following => following.id)
          .includes(user.id),
        followshipId: await Followship.findOne({
          where: {
            followerId: helpers.getUser(req).id,
            followingId: user.id
          }
        }).then(followship => (followship ? followship.dataValues.id : '')),
        followshipCreatedTime: await Followship.findOne({
          where: {
            followerId: req.params.id,
            followingId: user.id
          }
        }).then(followship => followship.createdAt)
      })
      return 'ok'
    })
    await Promise.all(promises)

    userFollowings = userFollowings.sort((a, b) => {
      return a.followshipCreatedTime - b.followshipCreatedTime
    })

    return callback({ profile: user, userFollowings })
  },

  getFollowers: async (req, res, callback) => {

    const userData = await User.findByPk(req.params.id, {
      include: [
        Tweet,
        {
          model: Tweet,
          as: 'LikedTweets'
        },
        {
          model: User,
          as: 'Followings'
        },
        {
          model: User,
          as: 'Followers',
          include: [
            {
              model: User,
              as: 'Followers'
            }
          ]
        }
      ]
    })

    let user = {
      ...userData.dataValues,
      isFollowed: helpers
        .getUser(req)
        .Followings.map(following => following.id)
        .includes(userData.id),
      followshipId: await Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: userData.id
        }
      }).then(followship => (followship ? followship.dataValues.id : ''))
    }

    let userFollowers = []
    let promises = user.Followers.map(async user => {
      userFollowers.push({
        ...user.dataValues,
        introduction: user.introduction ? user.introduction.substring(0, 50) : '',
        FollowerCount: user.Followers.length,
        // 判斷目前登入使用者是否已追蹤該 User 物件
        isFollowed: helpers
          .getUser(req)
          .Followings.map(following => following.id)
          .includes(user.id),
        followshipId: await Followship.findOne({
          where: {
            followerId: helpers.getUser(req).id,
            followingId: user.id
          }
        }).then(followship => (followship ? followship.dataValues.id : '')),
        followshipCreatedTime: await Followship.findOne({
          where: {
            followerId: user.id,
            followingId: req.params.id
          }
        }).then(followship => followship.createdAt)
      })
      return 'ok'
    })
    await Promise.all(promises)

    userFollowers = userFollowers.sort((a, b) => {
      return b.followshipCreatedTime - a.followshipCreatedTime
    })

    return callback({ profile: user, userFollowers })

  },

  addFollowing: (req, res, callback) => {

    if (helpers.getUser(req).id !== parseInt(req.body.followingId)) {
      Followship.create({
        followerId: helpers.getUser(req).id,
        followingId: parseInt(req.body.followingId)
      })
      return callback({ status: 'success', message: 'not self' })
    } else {
      return callback({ status: 'success', message: 'sel' })
    }

  },

  removeFollowing: (req, res, callback) => {

    return Followship.findOne({
      where: {
        id: req.params.id
      }
    })
      .then((followship) => {
        followship.destroy()
          .then((followship) => {
            return callback({ status: 'success', message: '' })
          })
      })
  },

  putUser: (req, res, callback) => {

    if (parseInt(req.params.id) !== helpers.getUser(req).id) {

      return callback({ status: 'error', message: 'param-id not equal user-id', redirect: `/users/${helpers.getUser(req).id}/tweets` })
    }

    const { file } = req
    if (file) {

      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {

        return User.findByPk(req.params.id).then(user => {
          user
            .update({
              name: req.body.name,
              introduction: req.body.introduction,
              avatar: file ? img.data.link : user.avatar
            })
            .then(user => {

              return callback({ status: 'success', message: `${user.name} 資料已更新！`, redirect: `/users/${req.params.id}/tweets` })
            })
        })
      })
    } else {
      return User.findByPk(req.params.id).then(user => {
        user.update({ name: req.body.name, introduction: req.body.introduction }).then(user => {

          return callback({ status: 'success', message: `${user.name} 資料已更新！`, redirect: `/users/${req.params.id}/tweets` })
        })
      })
    }

  },

  getUser: (req, res, callback) => {

    User.findByPk(req.params.id, {
      include: [
        {
          model: Tweet,
          include: [
            User,
            { model: Reply, as: 'replies' },
            Like,
            { model: User, as: 'LikedUsers' }
          ]
        },
        {
          model: Tweet,
          as: 'LikedTweets'
        },
        {
          model: User,
          as: 'Followings'
        },
        {
          model: User,
          as: 'Followers'
        }
      ]
    }).then(async user => {
      const isFollowed = helpers
        .getUser(req)
        .Followings.map(d => d.id)
        .includes(user.id)
      let tweetArray = user.Tweets.sort((a, b) => b.createdAt - a.createdAt)
      const followshipId = await Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: user.id
        }
      }).then(followship => (followship ? followship.dataValues.id : ''))

      const ResponseData = user.Tweets.map(tweet => ({
        ...tweet.dataValues,
        TweetOrder: tweet.createdAt,
        isLiked: tweet.LikedUsers.map(a => a.id).includes(helpers.getUser(req).id)
      }))

      tweetArray = ResponseData.sort((a, b) => b.TweetOrder - a.TweetOrder)

      return callback({
        profile: user,
        isFollowed,
        tweetArray,
        followshipId
      })

    })

  },

  getLike: (req, res, callback) => {

    User.findByPk(req.params.id, {
      include: [
        {
          model: Tweet,
          include: [
            User,
            { model: Reply, as: 'replies' },
            Like
          ]
        },
        {
          model: User,
          as: 'Followings'
        },
        {
          model: User,
          as: 'Followers'
        },
        {
          model: Tweet,
          as: 'LikedTweets',
          include: [
            User,
            { model: Reply, as: 'replies' },
            Like,
            { model: User, as: 'LikedUsers' }
          ]
        }
      ]
    }).then(async user => {
      const isFollowed = helpers
        .getUser(req)
        .Followings.map(d => d.id)
        .includes(user.id)

      const followshipId = await Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: user.id
        }
      }).then(followship => (followship ? followship.dataValues.id : ''))

      const ResponseData = await user.LikedTweets.map(tweet => ({
        ...tweet.dataValues,
        TweetOrder: tweet.Like.createdAt,
        isLiked: tweet.LikedUsers.map(a => a.id).includes(helpers.getUser(req).id)
      }))

      let tweetArray = await ResponseData.sort((a, b) => b.TweetOrder - a.TweetOrder)

      return callback({
        profile: user,
        isFollowed,
        followshipId,
        tweetArray
      })
    })

  }

}

module.exports = userService  