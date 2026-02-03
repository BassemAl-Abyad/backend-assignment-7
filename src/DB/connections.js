import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
);

// 1. Import your model creation functions after sequelize is defined
import { createUserModel } from "../Modules/User/user.model.js";
import { createPostModel } from "../Modules/Post/post.model.js";
import { createCommentModel } from "../Modules/Comment/comment.model.js";

// Create the models
export const User = createUserModel(sequelize);
export const Post = createPostModel(sequelize);
export const Comment = createCommentModel(sequelize);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // 2. Define Associations (Requirements for Part 2 APIs)

    // One-to-Many: User and Posts
    User.hasMany(Post, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Post.belongsTo(User, { foreignKey: "userId" });

    // One-to-Many: Post and Comments
    Post.hasMany(Comment, {
      foreignKey: "postId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Comment.belongsTo(Post, { foreignKey: "postId" });

    // One-to-Many: User and Comments
    User.hasMany(Comment, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Comment.belongsTo(User, { foreignKey: "userId" });

    // 3. Sync models to database
    // This will create the tables and apply the soft-delete (paranoid) logic
    await sequelize.sync({ alter: true });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export default connectDB;
