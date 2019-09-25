const userService = require('../services/userService.js')

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

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then((user) => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then((user) => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        }
      })
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res) => {

    userService.getUser(req, res, (data) => {
      req.flash('user_count', `data['profile']`)
      res.render('profile', {
        profile: data['profile'],
        isFollowed: data['isFollowed'],
        tweetArray: data['tweetArray'],
        followshipId: data['followshipId']
      })
    })

  },

  editUser: (req, res) => {
    if (parseInt(req.params.id) !== helpers.getUser(req).id) {
      return res.redirect(`/users/${helpers.getUser(req).id}/tweets`)
    }
    return User.findByPk(req.params.id).then(user => {
      return res.render('edit', { user })
    })
  },

  putUser: (req, res) => {

    userService.putUser(req, res, (data) => {
      if (data['status'] === 'error') {
        return res.redirect(data['redirect'])
      } else if (data['status'] === 'success') {
        req.flash('success_messages', data['message'])
        return res.redirect(data['redirect'])
      }
    })

  },

  getFollowings: async (req, res) => {
    userService.getFollowings(req, res, (data) => {
      res.render('userFollowing', {
        profile: data['profile'],
        userFollowings: data['userFollowings']
      })
    })

  },

  addFollowing: (req, res) => {

    userService.addFollowing(req, res, (data) => {
      // return res.redirect('back')
      if (data['status'] === 'fail') {
        return res.redirect('back')
      } else if (data['status'] === 'success') {
        return res.render('userFollowing')
      }
    })

  },

  removeFollowing: async (req, res) => {

    userService.removeFollowing(req, res, (data) => {
      return res.redirect('back')
    })

  },

  getFollowers: async (req, res) => {

    userService.getFollowers(req, res, (data) => {
      return res.render('userFollower', {
        profile: data['profile'],
        userFollowers: data['userFollowers']
      })
    })

  },

  getLike: (req, res) => {

    userService.getLike(req, res, (data) => {
      res.render('userLike', {
        profile: data['profile'],
        isFollowed: data['isFollowed'],
        followshipId: data['followshipId'],
        tweetArray: data['tweetArray']
      })
    })

  }

}

module.exports = userController
