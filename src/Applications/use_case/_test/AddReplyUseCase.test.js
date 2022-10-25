const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddReply = require('../AddReplyUseCase')
describe('Add Reply Use Case', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const content = 'reply'
    const id = 'user-123'
    const commentId = 'comment-123'
    const threadId = 'thread-123'
    const response = {
      id: 'comment-123',
      ownerId: id,
      content: 'comment',
      comentid: commentId,
    }
    // creating dependency of use case
    const mockCommentRepository = new CommentRepository()
    const mockThreadRepository = new ThreadRepository()
    const mockReplyRepository = new ReplyRepository()

    // mocking
    mockReplyRepository.addReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(response))
    mockThreadRepository.getThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(response))
    mockCommentRepository.getComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(response))

    // creating use case intance
    const addReplyUseCase = new AddReply({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    })

    // action
    const registeredReply = await addReplyUseCase.execute(
      content,
      id,
      commentId,
      threadId,
    )

    // Assert
    expect(registeredReply).toStrictEqual(response)
    expect(mockCommentRepository.getComment).toBeCalledWith(commentId)
    expect(mockThreadRepository.getThread).toBeCalledWith(threadId)
    expect(mockReplyRepository.addReply).toBeCalledWith(content, id, commentId)
  })
})
