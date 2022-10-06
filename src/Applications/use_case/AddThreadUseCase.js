const RegisterThread = require('../../Domains/threads/entities/RegisterThread')

class AddThreadUseCase {
    constructor({
        threadRepository
    }){
        this._threadRepository = threadRepository
    }

    async execute(useCasePayload, id){
        useCasePayload.ownerid = id
        const registerThread = new RegisterThread(useCasePayload)
        return this._threadRepository.addThread(registerThread)
    } 
}

module.exports = AddThreadUseCase