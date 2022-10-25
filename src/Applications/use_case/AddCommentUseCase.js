const RegisterComment = require('../../Domains/comments/entities/RegisterComment')
class AddCommentUseCase {
    constructor({
        commentRepository, threadRepository
    }){
        this._commentRepository = commentRepository
        this._threadRepository = threadRepository
    }
    async execute(payload, id, threadId){
        await this._threadRepository.getThread(threadId)
        const registerComment = new RegisterComment({content: payload})
        return this._commentRepository.addComment(registerComment.content,id,threadId)
    }
}
module.exports = AddCommentUseCase