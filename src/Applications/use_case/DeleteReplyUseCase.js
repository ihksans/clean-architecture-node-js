class DeleteReplyUseCase {
    constructor({
        commentRepository, threadRepository, replyRepository
    }){
        this._commentRepository = commentRepository
        this._threadRepository = threadRepository
        this._replyRepository = replyRepository
    }
    async execute(id, replyId, commentId, threadId){
        await this._threadRepository.verifyThreadAvaibility(threadId)
        await this._commentRepository.verifyCommentAvaibility(commentId)
        await this._replyRepository.verifyReplyAvaibility(replyId)
        return this._replyRepository.deleteReply(replyId, id)
    }
}
module.exports = DeleteReplyUseCase
