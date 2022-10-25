const CommentRepository = require('../CommentRepository')
describe('Comment repository', ()=>{
    it('should throw error when invoke abstract behavior', async()=>{
        // Arrange
        const commentRepository = new CommentRepository()
        await expect(commentRepository.addComment({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }),
    it('should throw error when invoke abstract behavior', async()=>{
        // Arrange
        const commentRepository = new CommentRepository()
        await expect(commentRepository.getComment({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }),
    it('should throw error when invoke abstract behavior', async()=>{
        // Arrange
        const commentRepository = new CommentRepository()
        await expect(commentRepository.deleteComment({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }),
    it('should throw error when invoke abstract behavior', async()=>{
        // Arrange
        const commentRepository = new CommentRepository()
        await expect(commentRepository.getComments({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    })
    it('should throw error when invoke abstract behavior', async()=>{
        // Arrange
        const commentRepository = new CommentRepository()
        await expect(commentRepository.verifyCommentAvaibility({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    })
})