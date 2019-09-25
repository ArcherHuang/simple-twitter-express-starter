'use strict'
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define(
    'Reply',
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      TweetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: ''
      },
    },
    {}
  )
  Reply.associate = function (models) {
    Reply.belongsTo(models.User)
    Reply.belongsTo(models.Tweet)
  }
  return Reply
}