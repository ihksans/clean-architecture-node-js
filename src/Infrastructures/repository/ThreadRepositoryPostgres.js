const InvariantError = require('../../Commons/exceptions/InvariantError');
const RegisteredThread = require('../../Domains/threads/entities/RegisteredThread')
const ThreadRepository = require('../../Domains/threads/ThreadRepository')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
class ThreadRepositoryPostgres extends ThreadRepository{
    constructor(pool, idGenerator){
        super()
        this._pool = pool
        this._idGenerator = idGenerator
    }
    async addThread(request){
        const {ownerId, title, body} = request
        const id = `thread-${this._idGenerator()}`;
        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, body, "ownerId"',
            values: [id, title, body, ownerId]
        }
        const result = await this._pool.query(query)
        return new RegisteredThread({...result.rows[0]})
    }
    async getThread(id){
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [id],
        }
        const result = await this._pool.query(query)
        if (!result.rowCount) {
            throw new NotFoundError('thread tidak ditemukan')
        }
        return result.rows[0]
    }
    async getThreadDetail(id){
        const query = {
            text: ` SELECT threads.id, threads.title, threads.body, users.username, threads.date
                    FROM threads
                    LEFT JOIN users 
                    ON threads."ownerId" = users.id
                    WHERE threads.id = $1`,
            values: [id],
        }
        const result = await this._pool.query(query)
        if (!result.rowCount) {
          throw new NotFoundError('Thread tidak ditemukan')
        }
        return result.rows[0]
    }
    async verifyThreadAvaibility(id){
        const query = {
            text: 'SELECT id FROM threads WHERE id = $1',
            values: [id],
        }
        const result = await this._pool.query(query)
        if (!result.rowCount) {
            throw new NotFoundError('thread tidak ditemukan')
        }
        return result.rows
    }
}
module.exports = ThreadRepositoryPostgres