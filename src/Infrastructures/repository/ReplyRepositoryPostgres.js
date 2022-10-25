const ForbiddenError = require('../../Commons/exceptions/ForbiddenError')
const InvariantError = require('../../Commons/exceptions/InvariantError')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const RegisteredReply = require('../../Domains/replies/entities/RegisteredReply')
const ReplyRepository = require('../../Domains/replies/ReplyRepository')
class ReplyRepositoryPostgres extends ReplyRepository{
    constructor(pool, idGenerator, dateGenerator){
        super()
        this._pool = pool
        this._idGenerator = idGenerator
        this._dateGenerator = dateGenerator
    }
    async addReply(content, ownerId, commentId){
        const id = `reply-${this._idGenerator()}`
        const query = {
                text: 'INSERT INTO replies VALUES($1, $2, $3, $4) RETURNING id, content, "ownerId", "commentId"',
                values: [id, content, ownerId, commentId]
        }
        const result = await this._pool.query(query)
        return new RegisteredReply({...result.rows[0]})
    }
    async deleteReply(id, ownerId){
        const date = new this._dateGenerator().toISOString()
        const query = {
            text: 'UPDATE replies SET "deletedAt"=$1 where "id"=$2 AND "ownerId"=$3 RETURNING id',
            values: [date, id, ownerId]
        }
        const result = await this._pool.query(query)
        if (!result.rowCount) {
            throw new ForbiddenError('User tidak memiliki akses') 
        }
        else{
            return {isDeleted: true}
        }
    }
    async getReply(id){
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1',
            values: [id],
        }
        const result = await this._pool.query(query)
        if (!result.rowCount) {
            throw new NotFoundError('reply tidak ditemukan')
        }
        return result.rows[0]
    }
    async getReplies(id){
        const query = {
            text: ` SELECT replies.id,replies.date, users.username, replies."commentId",
                    replies.content, replies."deletedAt"
                    FROM replies
                    LEFT JOIN users 
                    ON replies."ownerId" = users.id
                    WHERE replies."commentId" = $1 
                    ORDER BY replies.date`,
            values: [id],
        }
        const result = await this._pool.query(query)
        return result.rows
    }
}
module.exports = ReplyRepositoryPostgres