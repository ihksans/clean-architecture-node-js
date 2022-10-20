const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper')
const pool = require('../../database/postgres/pool');
const ForbiddenError = require('../../../Commons/exceptions/ForbiddenError');
const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');
const RegisterReply = require('../../../Domains/replies/entities/RegisterReply');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ReplyRepositoryPostgres', ()=>{
    afterEach(async ()=>{
        await ReplyTableTestHelper.cleanTable()
        await CommentTableTestHelper.cleanTable()
        await ThreadTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
    })
    afterAll(async ()=>{
        await pool.end
    })
    describe('addReply function', ()=>{
        it('should persist register reply and return registered reply correctly', async()=>{
            // Arrange 
            const registerReply = new RegisterReply({
                content: 'reply',
            })
            const fakeIdGenerator = () => '1237'
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator)
            const {commentId, ownerId}  = await ThreadTableTestHelper.addThreadDetailWithReturnAllId()
            // Action 
            registerReply.ownerId = ownerId
            registerReply.commentId = commentId
            const { id } = await replyRepositoryPostgres.addReply(registerReply.content, registerReply.ownerId, registerReply.commentId)
            // Assert
            const comment = await ReplyTableTestHelper.findReplyById(id)
            expect(comment).toHaveLength(1)
            expect(comment[0].ownerId).toEqual(registerReply.ownerId)
            expect(comment[0].commentId).toEqual(registerReply.commentId)
            expect(comment[0].content).toEqual(registerReply.content)
        })
    })
    describe('delete reply function', ()=>{
        it('should delete reply correctly', async ()=>{
            const {ownerId, replyId} = await ThreadTableTestHelper.addThreadDetailWithReturnAllId()
            function fakeDateGenerator() {
                this.toISOString = () => '2022-10-05'
            }
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, fakeDateGenerator)
            const { isDeleted } = await replyRepositoryPostgres.deleteReply(replyId, ownerId)
            // Action
            expect(isDeleted).toEqual(true)
        })
        it('should throw error forbiden to delete reply', async()=>{
            // stub
            const {commentId} = await ThreadTableTestHelper.addThreadDetailWithReturnId()
            function fakeDateGenerator() {
                this.toISOString = () => '2022-10-05'
            }
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, fakeDateGenerator)
            const fakeownerId = "user-0000"
            // Action & Assert
            await expect(replyRepositoryPostgres.deleteReply(commentId, fakeownerId))
            .rejects
            .toThrowError(ForbiddenError)
        })
        it('should correct get reply detail by reply id', async ()=>{
            // Arrange 
            const registerReply = new RegisterReply({
            content: 'reply',
            })
            const userPayload = {
                userid: 'user-555',
                username: 'usernamedev',
                password: 'secret',
                fullname: 'usernamedev'
            }
            const fakeIdGenerator = () => '123'
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator)
            const {commentId, userId}  = await ThreadTableTestHelper.addThreadWithCommentAndReturnId(userPayload)
            // Action 
            registerReply.ownerId = userId
            registerReply.commentId = commentId
            const { id } = await replyRepositoryPostgres.addReply(registerReply.content, registerReply.ownerId,registerReply.commentId)
            // Assert
            const {content, ownerId} = await replyRepositoryPostgres.getReply(id)
            expect(content).toEqual(registerReply.content)
            expect(ownerId).toEqual(registerReply.ownerId)
        })
    })
    describe('get replies function', ()=>{
        it('should returns replies correctly', async ()=>{
            // stub
            const {commentId} = await ThreadTableTestHelper.addThreadDetailWithReturnAllId()
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool)
            const replies = await replyRepositoryPostgres.getReplies(commentId)
            expect(replies).toHaveLength(2)
        })
        it('should error when reply id not found', async ()=>{
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})
            // Assert
            await expect(replyRepositoryPostgres.getReply('asdasd'))
                .rejects
                .toThrowError(NotFoundError)
        })
    })
    describe('verifyReplyAvaibility function', ()=>{
        it('should verify thread avaibility correcly', async ()=>{
            // stub
            const {replyId} = await ThreadTableTestHelper.addThreadDetailWithReturnAllId()
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool)
            const reply = await replyRepositoryPostgres.verifyReplyAvaibility(replyId)
            expect(reply).toHaveLength(1)
        })
        it('should error when reply id not found', async ()=>{
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})
            // Assert
            await expect(replyRepositoryPostgres.verifyReplyAvaibility('asdasd'))
                .rejects
                .toThrowError(NotFoundError)
        })
    })
})