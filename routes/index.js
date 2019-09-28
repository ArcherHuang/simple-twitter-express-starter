const tweetController = require('../controllers/tweetController.js')
const userController = require('../controllers/userController.js')
const adminController = require('../controllers/adminController.js')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const helpers = require('../_helpers')

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    return res.redirect('/signin')
  }

  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (req.user.role === 'admin') return next()
      return res.redirect('/')
    }
    res.redirect('/signin')
  }

  app.get('/', authenticated, (req, res) => res.redirect('/tweets'))
  app.get('/tweets', authenticated, tweetController.getTweets)
  app.post('/tweets', authenticated, tweetController.postTweet)
  app.get('/tweets/:tweet_id/replies', authenticated, tweetController.getReplies)
  app.post('/tweets/:tweet_id/replies', authenticated, tweetController.postReply)
  app.post('/tweets/:tweet_id/like', authenticated, tweetController.postLike)
  app.post('/tweets/:tweet_id/unlike', authenticated, tweetController.postUnlike)

  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'))
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
  app.get('/admin/tweets/:id/replies', authenticatedAdmin, adminController.getReplies)
  app.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)

  app.get('/signup', userController.signUpPage)
  app.post(
    '/signup',
    userController.signUp,
    passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }),
    userController.signIn
  )
  app.get('/signin', userController.signInPage)
  app.post(
    '/signin',
    passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }),
    userController.signIn
  )
  app.get('/logout', userController.logout)

  // 編輯使用者資訊
  app.get('/users/:id/edit', authenticated, userController.editUser)
  app.post('/users/:id/edit', authenticated, upload.single('avatar'), userController.putUser)

  // 取得使用者相關資訊
  app.get('/users/:id/tweets', authenticated, userController.getUser)
  app.get('/users/:id/followings', authenticated, userController.getFollowings)
  app.get('/users/:id/followers', authenticated, userController.getFollowers)
  app.get('/users/:id/likes', authenticated, userController.getLike)

  // follower & following
  app.post('/followships', userController.addFollowing)
  app.delete('/followships/:followingId', authenticated, userController.removeFollowing)

  // 將其他 routes 導回首頁
  app.get('/:params', authenticated, (req, res) => res.redirect('/tweets'))
}
