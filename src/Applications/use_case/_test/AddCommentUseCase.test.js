const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddComment = require('../AddCommentUseCase')
describe('Add Comment Use Case', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const content = 'comment'
    const id = 'user-123'
    const threadId = 'thread-123'
    const response = {
      id: 'comment-123',
      ownerId: id,
      content: 'comment',
      threadId: threadId,
    }

    // creating dependency of use case
    const mockCommentRepository = new CommentRepository()
    const mockThreadRepository = new ThreadRepository()

    // mocking
    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(response))
    mockThreadRepository.getThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(response))

    // creating use case instance
    const addCommentUseCase = new AddComment({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    })

    // action
    const registeredComment = await addCommentUseCase.execute(
      content,
      id,
      threadId,
    )

    // Assert
    expect(registeredComment).toStrictEqual(response)
    expect(mockCommentRepository.addComment).toBeCalledWith(
      content,
      id,
      threadId,
    )
    expect(mockThreadRepository.getThread).toBeCalledWith(threadId)
  })
})
