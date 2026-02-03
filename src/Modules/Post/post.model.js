import { DataTypes, Model } from 'sequelize';

export const createPostModel = (sequelize) => {
  class Post extends Model {}

  Post.init({
      id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      title: {
          type: DataTypes.STRING,
          allowNull: false
      },
      content: {
          type: DataTypes.TEXT,
          allowNull: false
      },
      userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
              model: 'Users',
              key: 'id'
          }
      }
  }, {
      sequelize,
      modelName: 'Post',
      paranoid: true // Requirement: Apply soft-delete
  });

  return Post;
};
