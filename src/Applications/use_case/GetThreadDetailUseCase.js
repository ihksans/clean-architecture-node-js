class GetThreadDetailUseCase {
    constructor({
        commentRepository, threadRepository, replyRepository
    }){
        this._commentRepository = commentRepository
        this._threadRepository = threadRepository
        this._replyRepository = replyRepository
    }
    async execute(id){
        const thread = await this._threadRepository.getThreadDetail(id)
        const commentres = await this._commentRepository.getComments(id)
        thread.comments = []
        let comments =  this._getComments(commentres)
        for(var comment of comments){
            const replies = await this._replyRepository.getReplies(comment.id)
            comment.replies = replies == null ? replies : this._getReplies(replies)
            thread.comments.push(comment)
        }
        return thread
    }
    _getComments(comments){
        let result = []
        comments = comments.length > 0 ? comments : []
        comments.forEach(comment => {
            comment.content = comment.deletedAt != null ? "**komentar telah dihapus**" :  comment.content
            result.push(comment)
        })
        return result
    }
     _getReplies(replies){
        let result = []
        replies = replies.length > 0 ? replies : []
        replies.map(reply => {
            reply.content = reply.deletedAt != null ? "**balasan telah dihapus**" :  reply.content
            result.push(reply)
        })
        return result
    }
}
module.exports = GetThreadDetailUseCase
