'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define(
    'Tweet',
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        reference: {
          model: 'User',
          key: 'id'
        }
      },
      description: DataTypes.TEXT
    },
    {}
  )
  Tweet.associate = function (models) {
    Tweet.belongsTo(models.User)
    Tweet.hasMany(models.Reply, { foreignKey: 'TweetId', as: 'replies' })
    Tweet.hasMany(models.Like)
    Tweet.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'TweetId',
      as: 'LikedUsers'
    })
  }
  return Tweet
}