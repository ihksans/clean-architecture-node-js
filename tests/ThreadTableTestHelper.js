/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadTableTestHelper = {
    async addThread({
        id = 'thread-123', 
        ownerId = 'user-111',
        title = 'title',
        body = 'body'
    }){
        const query = {
            text : 'INSERT INTO threads VALUES($1, $2, $3, $4)',
            values: [id, title, body, ownerId],
        }
        await pool.query(query)
    },
    async cleanTable() {
        await pool.query('DELETE FROM threads WHERE 1=1');
      },
    async findThreadById(id){
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [id],
        }
        const result = await pool.query(query)
        return result.rows
    },
    async getThreadDetail(id){
        const query = {
            text: ` SELECT threads.id, threads.title, threads.body, users.username, threads.date
                    FROM threads
                    LEFT JOIN users 
                    ON threads."ownerId" = users.id
                    WHERE threads.id = $1`,
            values: [id],
        }
        const result = await pool.query(query)
        return result.rows
    },
    async addThreadWithReturnId(request) {
        const {userid, username, password, fullname } = request
        const userquery = {
        text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname',
        values: [userid, username, password, fullname],
        }
        await pool.query(userquery)
        const threadId = 'thread-281'
        const query = {
            text : 'INSERT INTO threads VALUES($1, $2, $3, $4)',
            values: [ threadId, 'thread', 'content thread', userid],
        }
        await pool.query(query)
        return {threadId, userid}
    },
    async addThreadWithCommentAndReturnId(request) {
        const {userid, username, password, fullname } = request
        const userquery = {
        text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname',
        values: [userid, username, password, fullname],
        };
        await pool.query(userquery)
        const threadId = 'thread-281'
        const query = {
            text : 'INSERT INTO threads VALUES($1, $2, $3, $4)',
            values: [ threadId, 'thread', 'content thread', userid],
        }
        await pool.query(query)
        const commentId = 'comment-1234';
        const commentQuery = {
            text : 'INSERT INTO comments VALUES ($1, $2, $3, $4)',
            values: ['comment-1234', 'comment', userid, threadId],
        }
        await pool.query(commentQuery)
        return {commentId, threadId, userId: userid}
    },
    async addThreadDetailWithReturnAllId() {
        const ownerId = 'user-9998'
            const user = {
                userid : ownerId,
                username: 'userhelper',
                password: 'secret',
                fullname: 'userhelper'
            }
            const userquery = {
            text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname',
            values: [user.userid, user.username, user.password, user.fullname],
            };
            await pool.query(userquery)
            const threadId = 'thread-281'
            const threadQuery = {
                text : 'INSERT INTO threads VALUES($1, $2, $3, $4)',
                values: [ threadId, 'thread', 'content thread', user.userid],
            }
            await pool.query(threadQuery)
            const commentId = 'comment-1234';
            const commentId2 = 'comment-123';
            const commentQuery = {
                text : 'INSERT INTO comments VALUES ($1, $2, $3, $4), ($5, $2, $3, $4)',
                values: [commentId, 'comment', user.userid, threadId, commentId2],
            }
            await pool.query(commentQuery)
            const replyId = 'reply-1234';
            const replyId2 = 'reply-123';
            const replyQuery = {
                text : 'INSERT INTO replies VALUES ($1, $2, $3, $4), ($5, $2, $3, $4)',
                values: [replyId, 'reply', user.userid, commentId, replyId2],
            }
            await pool.query(replyQuery)
            return {ownerId, threadId, commentId, replyId}
    },
    async addThreadDetailWithReturnId() {
        const user = {
            userid : 'user-9998',
            username: 'userhelper',
            password: 'secret',
            fullname: 'userhelper'
        }
        const userquery = {
        text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname',
        values: [user.userid, user.username, user.password, user.fullname],
        }
        await pool.query(userquery)
        const threadId = 'thread-281'
        const threadQuery = {
            text : 'INSERT INTO threads VALUES($1, $2, $3, $4)',
            values: [ threadId, 'thread', 'content thread', user.userid],
        }
        await pool.query(threadQuery)
        const commentQuery = {
            text : 'INSERT INTO comments VALUES ($1, $2, $3, $4), ($5, $2, $3, $4)',
            values: ['comment-1234', 'comment', user.userid, threadId, 'comment-12345'],
        }
        await pool.query(commentQuery)
        return threadId
    },
    async addThreadDetailWithReturnItem() {
        const user = {
            userid : 'user-9998',
            username: 'userhelper',
            password: 'secret',
            fullname: 'userhelper'
        }
        const userquery = {
        text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname',
        values: [user.userid, user.username, user.password, user.fullname],
        }
        await pool.query(userquery)
        const threadId = 'thread-281'
        const body = 'content thread'
        const title = 'thread'
        const threadQuery = {
            text : 'INSERT INTO threads VALUES($1, $2, $3, $4)',
            values: [ threadId, title , body, user.userid],
        }
        await pool.query(threadQuery)
        const query = {
            text: ` SELECT threads.id, threads.title, threads.body, users.username, threads.date
                    FROM threads
                    LEFT JOIN users 
                    ON threads."ownerId" = users.id
                    WHERE threads.id = $1`,
            values: [threadId],
        }
        const result = await pool.query(query)
        return result.rows[0]
    }
}
module.exports = ThreadTableTestHelper