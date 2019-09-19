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
  }
}

module.exports = adminController
