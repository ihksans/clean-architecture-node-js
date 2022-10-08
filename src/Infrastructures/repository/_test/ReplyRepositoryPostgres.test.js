const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper')
const pool = require('../../database/postgres/pool');
const ForbiddenError = require('../../../Commons/exceptions/ForbiddenError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');
const RegisterReply = require('../../../Domains/replies/entities/RegisterReply');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

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
            const userPayload = {
                userid: 'user-555',
                username: 'usernamedev',
                password: 'secret',
                fullname: 'usernamedev'
            }
            const fakeIdGenerator = () => '1237'
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator)
            const {commentId, ownerId}  = await ThreadTableTestHelper.addThreadDetailWithReturnAllId()
            // Action 
            registerReply.ownerid = ownerId
            registerReply.commentid = commentId
            const { id } = await replyRepositoryPostgres.addReply(registerReply)
            // Assert
            const comment = await ReplyTableTestHelper.findReplyById(id)
            expect(comment).toHaveLength(1)
        })
    })
    describe('delete reply function', ()=>{
        it('should delete reply correctly', async ()=>{
            const {ownerId, replyId} = await ThreadTableTestHelper.addThreadDetailWithReturnAllId()
            function fakeDateGenerator() {
                this.toISOString = () => '2022-10-05'
              }
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, fakeDateGenerator)
            const { isDeleted } = await replyRepositoryPostgres.deleteReply({id: replyId, ownerId: ownerId })
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
            const fakeOwnerId = "user-0000"
            // Action & Assert
            await expect(replyRepositoryPostgres.deleteReply({id: commentId, ownerid: fakeOwnerId }))
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
            registerReply.ownerid = userId
            registerReply.commentid = commentId
            const { id } = await replyRepositoryPostgres.addReply(registerReply)
            // Assert
            const {content, ownerid} = await replyRepositoryPostgres.getReply({id:id})
            expect(content).toEqual(registerReply.content)
            expect(ownerid).toEqual(registerReply.ownerid)
        })
        it('should error when reply id not found', async ()=>{
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})
            // Assert
            await expect(replyRepositoryPostgres.getReply('asdasd'))
                .rejects
                .toThrowError(InvariantError)
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
    })
})