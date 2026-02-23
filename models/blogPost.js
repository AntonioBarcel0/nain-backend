import mongoose from 'mongoose'

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    default: 'Centro de Escucha Naín'
  },
  tags: [{
    type: String
  }],
  published: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

export default mongoose.model('BlogPost', blogPostSchema)
