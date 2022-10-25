const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper')
const RegisterComment = require('../../../Domains/comments/entities/RegisterComment')
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const ForbiddenError = require('../../../Commons/exceptions/ForbiddenError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
describe('CommentRepositoryPostgres', ()=>{
    afterEach(async ()=>{
        await CommentTableTestHelper.cleanTable()
        await ThreadTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
    })
    afterAll(async ()=>{
        await pool.end
    })
    describe('addComment function', ()=>{
        it('should persist register thread and return registered thread correctly', async()=>{
            // Arrange 
            const registerComment = new RegisterComment({
                content: 'comment',
            })
            const userPayload = {
                userid: 'user-555',
                username: 'usernamedev',
                password: 'secret',
                fullname: 'usernamedev'
            }
            const fakeIdGenerator = () => '123'
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)
            const {threadId, userid}  = await ThreadTableTestHelper.addThreadWithReturnId(userPayload)
            // Action 
            registerComment.ownerId = userid
            registerComment.threadId = threadId
            await commentRepositoryPostgres.addComment(registerComment.content, registerComment.ownerId, registerComment.threadId)
            // Assert
            const comment = await CommentTableTestHelper.findCommentById('comment-123')
            expect(comment).toHaveLength(1)
        })
    }),
    describe('delete comment function', ()=>{
        it('should delete comment correctly', async ()=>{
            // Arrange
            const registerComment = new RegisterComment({
                content: 'comment',
            })
            const userPayload = {
                userid: 'user-555',
                username: 'usernamedev',
                password: 'secret',
                fullname: 'usernamedev'
            }
            const commentId = "comment-555"
            const {threadId, userid}  = await ThreadTableTestHelper.addThreadWithReturnId(userPayload)
            await CommentTableTestHelper.addComment({
                id: commentId,
                ownerId: userid,
                content:registerComment.content, 
                threadId: threadId 
            })
            function fakeDateGenerator() {
                this.toISOString = () => '2022-10-05'
            }
            const fakeIdGenerator = () => '123'
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator, fakeDateGenerator)
            const { isDeleted } = await commentRepositoryPostgres.deleteComment(commentId, userid )
            // Action
            expect(isDeleted).toEqual(true)
        }),
        it('should throw error forbiden to delete comment', async()=>{
            // Arrange
            const registerComment = new RegisterComment({
                content: 'comment',
            })
            const userPayload = {
                userid: 'user-555',
                username: 'usernamedev',
                password: 'secret',
                fullname: 'usernamedev'
            }
            const fakeownerId = "user-777"
            const commentId = "comment-555"
            const {threadId, userid}  = await ThreadTableTestHelper.addThreadWithReturnId(userPayload)
            await CommentTableTestHelper.addComment({
                id: commentId,
                ownerId: userid,
                content:registerComment.content, 
                threadId: threadId 
            })
            function fakeDateGenerator() {
                this.toISOString = () => '2022-10-05'
            }
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, fakeDateGenerator)
            // Action & Assert
            await expect(commentRepositoryPostgres.deleteComment({id: commentId, ownerId: fakeownerId }))
            .rejects
            .toThrowError(ForbiddenError)
        }),
        it('should correct get comment detail by comment id', async ()=>{
            // Arrange 
            const registerComment = new RegisterComment({
                content: 'comment',
                ownerId : 'user-111',
                threadId: 'thread-123'
            })
            const userPayload = {
                userid: 'user-555',
                username: 'usernamedev',
                password: 'secret',
                fullname: 'usernamedev'
            }
            const fakeIdGenerator = () => '123'
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)
            const {threadId, userid}  = await ThreadTableTestHelper.addThreadWithReturnId(userPayload)
            // Action 
            registerComment.ownerId = userid
            registerComment.threadId = threadId
            await commentRepositoryPostgres.addComment(registerComment.content, registerComment.ownerId, registerComment.threadId)
            // Assert
            const {id, content, ownerId} = await commentRepositoryPostgres.getComment('comment-123')
            expect(id).toEqual("comment-123")
            expect(content).toEqual(registerComment.content)
            expect(ownerId).toEqual(userid)
        }),
        it('should error when comments id not found', async ()=>{
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})
            // Assert
            await expect(commentRepositoryPostgres.getComment('asdasd'))
                .rejects
                .toThrowError(NotFoundError)
        })
    }),
    describe('get comments function', ()=>{
        it('should returns comments correctly', async ()=>{
            // stub
            const threadId = await ThreadTableTestHelper.addThreadDetailWithReturnId()
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})
            const  comments = await commentRepositoryPostgres.getComments(threadId)
            expect(comments).toHaveLength(2)
        })
    })
})