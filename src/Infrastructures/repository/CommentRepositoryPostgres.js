const CommentRepository = require('../../Domains/comments/CommentRepository')
const RegisteredComment = require('../../Domains/comments/entities/RegisteredComment')
const ForbiddenError = require('../../Commons/exceptions/ForbiddenError')
const InvariantError = require('../../Commons/exceptions/InvariantError')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
class CommentRepositoryPostgres extends CommentRepository{
    constructor(pool, idGenerator, dateGenerator){
        super()
        this._pool = pool
        this._idGenerator = idGenerator
        this._dateGenerator = dateGenerator
    }
    async addComment(content, ownerId, threadId){
        const id = `comment-${this._idGenerator()}`
        const query = {
                text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, "ownerId", "threadId"',
                values: [id, content, ownerId, threadId]
        }
        const result = await this._pool.query(query)
        return new RegisteredComment({...result.rows[0]})
    }
    async deleteComment(id, ownerId){
        const date = new this._dateGenerator().toISOString()
        const query = {
            text: 'UPDATE comments SET "deletedAt"=$1 where "id"=$2 AND "ownerId"=$3 RETURNING id',
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
    async getComment(id){
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id],
        }
        const result = await this._pool.query(query)
        if (!result.rowCount) {
            throw new NotFoundError('comment tidak ditemukan')
        }
        return result.rows[0]
    }
    async getComments(id){
        const query = {
            text: ` SELECT comments.id, comments."date", users.username,
                    comments."deletedAt", comments.content
                    FROM comments
                    LEFT JOIN users 
                    ON comments."ownerId" = users.id
                    WHERE comments."threadId" = $1 
                    ORDER BY comments.date`,
            values: [id],
          }
        const result = await this._pool.query(query)
        return result.rows
    }
}
module.exports = CommentRepositoryPostgres