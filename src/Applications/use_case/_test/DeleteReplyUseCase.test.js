const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const DeleteReplyUseCase = require('../DeleteReplyUseCase')

describe('Delete Reply Use Case', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const ownerId = 'user-123'
    const id = 'thread-123'
    const replyId = 'reply-123'
    const commentId = 'comment-123'
    const threadId = 'thread-123'

    const response = {
      isDelete: true,
    }
    // creating dependency of use case
    const mockCommentRepository = new CommentRepository()
    const mockThreadRepository = new ThreadRepository()
    const mockReplyRepository = new ReplyRepository()

    // mocking
    mockThreadRepository.verifyThreadAvaibility = jest
      .fn()
      .mockImplementation(() => Promise.resolve(response))
    mockCommentRepository.verifyCommentAvaibility = jest
      .fn()
      .mockImplementation(() => Promise.resolve(response))
    mockReplyRepository.verifyReplyAvaibility = jest
      .fn()
      .mockImplementation(() => Promise.resolve(response))
    mockReplyRepository.deleteReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(response))

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    })

    // action
    const { isDelete } = await deleteReplyUseCase.execute(
      id,
      replyId,
      commentId,
      threadId,
    )

    // Assert
    expect(isDelete).toEqual(true)
    expect(mockThreadRepository.verifyThreadAvaibility).toBeCalledWith(threadId)
    expect(mockCommentRepository.verifyCommentAvaibility).toBeCalledWith(commentId)
    expect(mockReplyRepository.verifyReplyAvaibility).toBeCalledWith(replyId)
    expect(mockReplyRepository.deleteReply).toBeCalledWith(replyId, id)
  })
})
