const RegisteredThread = require('../RegisteredThread')
describe('Registered Thread Test', ()=>{
    it('should error with wrong payload request', ()=>{
        // Arrange
        const payload = {
            title: '123123'
        }
        // Action and Assert
        expect(()=> new RegisteredThread(payload)).toThrowError('REGISTERED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }),
    it('should create thread object correctly', ()=>{
        // Arrange
        const payload = {
            id: 'asdasd',
            ownerId: 'asdasd',
            title: 'dicoding',
            body: 'dicoding',
        }
        // Action
        const {id, owner, title} = new RegisteredThread(payload)
        // Assert
        expect(id).toEqual(payload.id)
        expect(owner).toEqual(payload.ownerId)
        expect(title).toEqual(payload.title)
    }),
    it('should throw error when payload did not meet data type specification', ()=>{
        const payload = {
            id: 123123,
            title: 123123,
            ownerId: 123123123,
            body: 123123123,
        }
        expect(()=> new RegisteredThread(payload)).toThrowError('REGISTERED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })
})