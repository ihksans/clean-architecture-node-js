const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase')
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase')

class CommentHandler{
    constructor(container){
        this._container = container
        this.postAddCommentHandler = this.postAddCommentHandler.bind(this)
        this.deleteCommentHandler = this.deleteCommentHandler.bind(this)
    }
    async postAddCommentHandler(request, h){

        const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name)
        const { id } = request.auth.credentials
        const { threadId } = request.params
        const { content } = request.payload
        const addedComment = await addCommentUseCase.execute(content, id, threadId)
        const response = h.response({
                status: 'success',
                data: {
                    addedComment
                }
            })
        response.code(201)
        return response
    }
    async deleteCommentHandler(request, h){
        const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name)
        const { id } = request.auth.credentials
        const { threadId, commentId } = request.params
        const deletedComment = await deleteCommentUseCase.execute(id, threadId, commentId)
        const response = h.response({
                status: 'success',
                data: {
                    deletedComment
                }
            })
        response.code(200)
        return response
    }
}
module.exports = CommentHandler