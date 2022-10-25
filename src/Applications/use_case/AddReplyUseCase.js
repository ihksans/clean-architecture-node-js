const RegisterReply = require('../../Domains/replies/entities/RegisterReply')

class AddReplyUseCase {
  constructor({ commentRepository, threadRepository, replyRepository }) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
    this._replyRepository = replyRepository
  }
  async execute(payload, id, commentId, threadId) {
    await this._threadRepository.getThread(threadId)
    await this._commentRepository.getComment(commentId)
    const registerReply = new RegisterReply({ content: payload })
    return this._replyRepository.addReply(registerReply.content, id, commentId)
  }
}
module.exports = AddReplyUseCase
