const mongoose = require("mongoose");
const slugify = require("slugify");

const PostSchema = mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    contentId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "Content",
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: Date.now(),
    },
    categories: {
      type: String,
      enum: ["Technology", "Health", "Lifestyle", "Education", "Entertainment"],
      required: true,
    },
    postImageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

PostSchema.index({ title: "text" });
PostSchema.index({ slug: 1 }, { unique: true });
PostSchema.index({ authorId: 1, publishedAt: -1 });

PostSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    this.baseSlug = slugify(this.title, {
      replacement: "-", //replace spaces with hyphen
      lower: true, //convert to lower case
      strict: true, //removes special characters
      trim: true, //removes spaces from both ends
    });
    let slug = baseSlug;
    let count = 1;

    //check if slug already exists
    //this.constructor refers to the model
    // and finds with the current slug with existing ones if it found then it becomes true and enters the loop
    while (await this.constructor.findOne({ slug })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }
    this.slug = slug;
  }
  next();
});

module.exports = mongoose.model("Post", PostSchema);
