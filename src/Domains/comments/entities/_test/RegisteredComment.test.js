const RegisteredComment = require('../../../comments/entities/RegisteredComment')

describe('a Registered Comment', ()=>{
    it('should error with wrong payload request', ()=>{
    // Arrange
    const payload = {
        content: '123123'
    }

    // Action and Assert
    expect(()=> new RegisteredComment(payload)).toThrowError('REGISTERED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }),
    it('should create comment object correctly', ()=>{
        // Arrange
        const payload = {
            id: 'comment-123',
            ownerId: 'user-123',
            content: 'comment',
            threadId: 'thread-123'
        }
        // Action
        const {id, owner, content} = new RegisteredComment(payload)

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
            threadId: 123123
        }

        expect(()=> new RegisteredComment(payload)).toThrowError('REGISTERED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })
})