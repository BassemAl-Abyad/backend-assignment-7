import { DataTypes, Model } from 'sequelize';

export const createCommentModel = (sequelize) => {
  class Comment extends Model {}

  Comment.init({
      id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      content: {
          type: DataTypes.TEXT,
          allowNull: false
      },
      postId: {
          type: DataTypes.INTEGER,
          references: { model: 'Posts', key: 'id' }
      },
      userId: {
          type: DataTypes.INTEGER,
          references: { model: 'Users', key: 'id' }
      }
  }, {
      sequelize,
      modelName: 'Comment'
  });

  return Comment;
};
