const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const DeleteCommentUseCase = require('../DeleteCommentUseCase')

describe('Delete Comment Use Case', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const ownerId = 'user-123'
    const id = 'thread-123'
    const commentId = 'comment-123'
    const response = {
      isDelete: true,
    }
    // creating dependency of use case
    const mockCommentRepository = new CommentRepository()
    const mockThreadRepository = new ThreadRepository()

    // mocking
    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(response))
    mockCommentRepository.verifyCommentAvaibility = jest
      .fn()
      .mockImplementation(() => Promise.resolve(response))
    mockThreadRepository.verifyThreadAvaibility = jest
      .fn()
      .mockImplementation(() => Promise.resolve(response))

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    })

    // action
    const { isDelete } = await deleteCommentUseCase.execute(
      ownerId,
      id,
      commentId,
    )

    // Assert
    expect(isDelete).toEqual(true)
    expect(mockCommentRepository.verifyCommentAvaibility).toBeCalledWith(commentId)
    expect(mockThreadRepository.verifyThreadAvaibility).toBeCalledWith(id)
    expect(mockCommentRepository.deleteComment).toBeCalledWith(
      commentId,
      ownerId,
    )
  })
})
