const RegisterReply = require('../../Domains/replies/entities/RegisterReply')

class AddReplyUseCase {
  constructor({ commentRepository, threadRepository, replyRepository }) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
    this._replyRepository = replyRepository
  }
  async execute(payload, id, commentId, threadId) {
    await this._threadRepository.verifyThreadAvaibility(threadId)
    await this._commentRepository.verifyCommentAvaibility(commentId)
    const registerReply = new RegisterReply({ content: payload })
    return this._replyRepository.addReply(registerReply.content, id, commentId)
  }
}
module.exports = AddReplyUseCase
