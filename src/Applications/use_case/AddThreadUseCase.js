const RegisterThread = require('../../Domains/threads/entities/RegisterThread')
class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository
  }
  async execute(useCasePayload, id) {
    useCasePayload.ownerId = id
    const registerThread = new RegisterThread(useCasePayload)
    return await this._threadRepository.addThread(registerThread)
  }
}
module.exports = AddThreadUseCase
