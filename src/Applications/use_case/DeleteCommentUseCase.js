class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
  }
  async execute(ownerId, threadId, commentId) {
    await this._threadRepository.verifyThreadAvaibility(threadId)
    await this._commentRepository.verifyCommentAvaibility(commentId)
    return this._commentRepository.deleteComment(commentId, ownerId)
  }
}
module.exports = DeleteCommentUseCase
