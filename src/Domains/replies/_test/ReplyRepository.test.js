const ReplyRepository = require('../ReplyRepository')
describe('Reply repository', ()=>{
    it('should throw error when invoke abstract behavior', async()=>{
        // Arrange
        const replyRepository = new ReplyRepository()
        await expect(replyRepository.addReply({})).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }),
    it('should throw error when invoke abstract behavior', async()=>{
        // Arrange
        const replyRepository = new ReplyRepository()
        await expect(replyRepository.getReply({})).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }),
    it('should throw error when invoke abstract behavior', async()=>{
        // Arrange
        const replyRepository = new ReplyRepository()
        await expect(replyRepository.deleteReply({})).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }),
    it('should throw error when invoke abstract behavior', async()=>{
        // Arrange
        const replyRepository = new ReplyRepository()
        await expect(replyRepository.getReplies({})).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    })
    it('should throw error when invoke abstract behavior', async()=>{
        // Arrange
        const replyRepository = new ReplyRepository()
        await expect(replyRepository.verifyReplyAvaibility({})).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    })
})