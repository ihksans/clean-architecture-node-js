class RegisteredThread{
    constructor(payload){
        this._verifyPayload(payload)
        const {id, ownerId, title} = payload
        this.id = id
        this.owner = ownerId
        this.title = title
    }
    _verifyPayload({id, ownerId, title}){
        if (!id || !ownerId || !title) {
            throw new Error('REGISTERED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        }
        if (typeof id !== 'string' || typeof title !== 'string' || typeof ownerId !== 'string') {
            throw new Error('REGISTERED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}
module.exports = RegisteredThread