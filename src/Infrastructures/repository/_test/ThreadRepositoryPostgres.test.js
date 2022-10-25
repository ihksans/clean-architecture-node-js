const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const RegisterThread = require('../../../Domains/threads/entities/RegisterThread')
const RegisteredThread = require('../../../Domains/threads/entities/RegisteredThread')
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostres = require('../ThreadRepositoryPostgres');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', ()=>{
    afterEach(async ()=>{
        await CommentTableTestHelper.cleanTable()
        await ThreadTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
    })
    afterAll(async ()=>{
        await pool.end
    })
    describe('addThread function', () =>{
        it('should persist register thread and return registered thread correctly', async()=>{
           // Arrange
           const registerThread = new RegisterThread({
                title: 'title thread',
                body: 'body thread',
                ownerId: 'user-111'
           })
           const fakeIdGenerator = () => '123'
           const threadRepositoryPostgres = new ThreadRepositoryPostres(pool, fakeIdGenerator)
           // stub
           const userId = await UsersTableTestHelper.addUserWithReturnId();
           // Action 
           registerThread.ownerId = userId
           const {id, owner, title} = await threadRepositoryPostgres.addThread(registerThread)
           // Assert
           const threads = await ThreadTableTestHelper.findThreadById('thread-123')
           expect(threads).toHaveLength(1)
           expect(id).toEqual('thread-123')
           expect(owner).toEqual(registerThread.ownerId)
           expect(title).toEqual(registerThread.title)
           expect(threads[0].body).toEqual(registerThread.body)
        }),
        it('should correct get thread detail by thread id', async ()=>{
            // Arrange
           const registerThread = ({
                id: 'thread-555',
                title: 'title thread',
                body: 'body thread',
                ownerId: 'user-111'
            })
            // stub
            const userId = await UsersTableTestHelper.addUserWithReturnId();
            const threadRepositoryPostgres = new ThreadRepositoryPostres(pool, {});
            // Action 
            registerThread.ownerId = userId
            // Assert
            await ThreadTableTestHelper.addThread(registerThread)
            const thread = await threadRepositoryPostgres.getThread(registerThread.id);
            expect(thread.id).toEqual(registerThread.id);
            expect(thread.title).toEqual(registerThread.title);
            expect(thread.body).toEqual(registerThread.body);
            expect(thread.ownerId).toEqual(registerThread.ownerId);
        }),
        it('should error when thread id not found', async ()=>{
            // Arrange
             const threadRepositoryPostgres = new ThreadRepositoryPostres(pool, {})
            // Action & Assert
            await expect(threadRepositoryPostgres.getThread('asdasd'))
                .rejects
                .toThrowError(NotFoundError)
        })
    }),
    describe('getThread function', ()=>{
        it('should get thread correctly', async()=>{
           // stub
            const thread = await ThreadTableTestHelper.addThreadDetailWithReturnItem()
            const threadRepositoryPostgres = new ThreadRepositoryPostres(pool, {})
            const  { id, title, body, username, date }  = await threadRepositoryPostgres.getThreadDetail(thread.id)
            expect(id).toEqual(thread.id)
            expect(thread.title).toEqual(title)
            expect(thread.body).toEqual(body)
            expect(thread.username).toEqual(username)
            expect(thread.date).toEqual(date)
        }),
        it('should throw error to get thread unregistered', async()=>{
            // stub
             const threadRepositoryPostgres = new ThreadRepositoryPostres(pool, {})
             await expect( threadRepositoryPostgres.getThreadDetail("jjj"))
             .rejects
             .toThrowError(NotFoundError)
        })
    })
    describe('verifyThreadAvaibility function', ()=>{
        it('should verify thread avaibility', async ()=>{
            // stub
            const threadId = await ThreadTableTestHelper.addThreadDetailWithReturnId()
            const threadRepositoryPostgres = new ThreadRepositoryPostres(pool, {})
            const  thread  = await threadRepositoryPostgres.verifyThreadAvaibility(threadId)
            expect(thread).toHaveLength(1)
        })
        it('should error when thread id not found', async ()=>{
            // stub
            const threadRepositoryPostgres = new ThreadRepositoryPostres(pool, {})
            await expect( threadRepositoryPostgres.verifyThreadAvaibility("jjj"))
            .rejects
            .toThrowError(NotFoundError)
        })
    })
})
