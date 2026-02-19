const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'O título é obrigatório'],
      trim: true,
      maxlength: [200, 'O título não pode ter mais de 200 caracteres'],
    },
    content: {
      type: String,
      required: [true, 'O conteúdo é obrigatório'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'O autor é obrigatório'],
      trim: true,
      maxlength: [100, 'O nome do autor não pode ter mais de 100 caracteres'],
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Adiciona automaticamente createdAt e updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual para gerar excerpt (primeiros 100 caracteres)
postSchema.virtual('excerpt').get(function () {
  if (!this.content) return '';
  return this.content.length > 100
    ? this.content.substring(0, 100) + '...'
    : this.content;
});

// Índices para melhor performance nas buscas
postSchema.index({ title: 'text', content: 'text' });
postSchema.index({ createdAt: -1 });
postSchema.index({ deletedAt: 1 });

// Query helper para excluir posts deletados (soft delete)
postSchema.query.notDeleted = function () {
  return this.where({ deletedAt: null });
};

// Método estático para busca por palavras-chave
postSchema.statics.searchByKeyword = function (keyword) {
  return this.find({
    $text: { $search: keyword },
    deletedAt: null,
  }).sort({ score: { $meta: 'textScore' } });
};

// Middleware pre-save para logging
postSchema.pre('save', function (next) {
  if (this.isNew) {
    console.log('Novo post criado:', this.title);
  }
  next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
