class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
  }
  async execute(ownerId, threadId, commentId) {
    await this._threadRepository.getThread(threadId)
    await this._commentRepository.getComment(commentId)
    return this._commentRepository.deleteComment(commentId, ownerId)
  }
}
module.exports = DeleteCommentUseCase
