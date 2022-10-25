const RegisteredReply = require('../../../replies/entities/RegisteredReply')
describe('a Registered Reply', ()=>{
    it('should error with wrong payload request', ()=>{
    // Arrange
    const payload = {
        content: '123123'
    }
    // Action and Assert
    expect(()=> new RegisteredReply(payload)).toThrowError('REGISTERED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    }),
    it('should create reply object correctly', ()=>{
        // Arrange
        const payload = {
            id: 'reply-123',
            ownerId: 'user-123',
            content: 'comment',
            commentId: 'comment-123'
        }
        // Action
        const {id, owner, content} = new RegisteredReply(payload)
        // Assert
        expect(id).toEqual(payload.id)
        expect(owner).toEqual(payload.ownerId)
        expect(content).toEqual(payload.content)
    }),
    it('should throw error when payload did not meet data type specification', ()=>{
        const payload = {
            id: 123123,
            ownerId: 123123,
            content: 123123,
            commentId: 123123
        }
        expect(()=> new RegisteredReply(payload)).toThrowError('REGISTERED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })
})