const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const GetThreadDetail = require('../GetThreadDetailUseCase')
describe('Get Thread Use Case', () => {
  it('should orchestrating the get thread detail and comment action correctly', async () => {
    const id = "thread-1eGMLHGwKhVQzVIIUur_G"
    const thread = {
      "id": "thread-1eGMLHGwKhVQzVIIUur_G",
      "title": "sebuah thread",
      "body": "sebuah body thread",
      "username": "johndoe",
      "date": "2022-10-12T23:41:56.828Z"
    }
    const response = {
      "id": "thread-1eGMLHGwKhVQzVIIUur_G",
      "title": "sebuah thread",
      "body": "sebuah body thread",
      "username": "johndoe",
      "date": "2022-10-12T23:41:56.828Z",
      "comments": [
          {
              "id": "comment-BVXLLL0oCWvI3Z7Sb99Ox",
              "date": "2022-10-13T00:06:05.237Z",
              "username": "dicoding",
              "deletedAt": null,
              "content": "sebuah comment",
              "replies": [
                  {
                    "id": "reply-HEQEwbXNrFTLDZL6iANvK",
                    "date": "2022-10-13T00:06:56.334Z",
                    "username": "dicoding",
                    "commentId": "comment-BVXLLL0oCWvI3Z7Sb99Ox",
                    "content": "sebuah balasan",
                    "deletedAt": null
                },
                {
                    "id": "reply-dpvKpXDLjLIFk_jqJSgRu",
                    "date": "2022-10-14T15:38:59.442Z",
                    "username": "dicoding",
                    "commentId": "comment-BVXLLL0oCWvI3Z7Sb99Ox",
                    "content": "**balasan telah dihapus**",
                    "deletedAt": "2022-10-14T22:40:04.063Z"
                }
              ]
          }
      ]
    }
    const commentResponse = 
      [
        {
          "id": "comment-BVXLLL0oCWvI3Z7Sb99Ox",
          "date": "2022-10-13T00:06:05.237Z",
          "username": "dicoding",
          "deletedAt": null,
          "content": "sebuah comment",
        }
      ]
    const replies = [
          {
            "id": "reply-HEQEwbXNrFTLDZL6iANvK",
            "date": "2022-10-13T00:06:56.334Z",
            "username": "dicoding",
            "commentId": "comment-BVXLLL0oCWvI3Z7Sb99Ox",
            "content": "sebuah balasan",
            "deletedAt": null
        },
        {
            "id": "reply-dpvKpXDLjLIFk_jqJSgRu",
            "date": "2022-10-14T15:38:59.442Z",
            "username": "dicoding",
            "commentId": "comment-BVXLLL0oCWvI3Z7Sb99Ox",
            "content": "**balasan telah dihapus**",
            "deletedAt": "2022-10-14T22:40:04.063Z"
        }
    ]
    // creating dependency of use case
    const mockCommentRepository = new CommentRepository()
    const mockThreadRepository = new ThreadRepository()
    const mockReplyRepository = new ReplyRepository()

    mockReplyRepository.getReplies = jest
    .fn()
    .mockImplementation(() => 
    Promise.resolve(replies)
  )
    mockCommentRepository.getComments = jest
      .fn()
      .mockImplementation(() => 
      Promise.resolve(commentResponse)
    )

    mockThreadRepository.getThreadDetail = jest.fn(() =>
      Promise.resolve(thread),
    )
    // creating use case instance
    const getThreadDetail = new GetThreadDetail({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      replyRepository: mockReplyRepository,
    })
    // action
    const threadDetail = await getThreadDetail.execute(id)
    // Assert
    expect(threadDetail).toStrictEqual(response)
    expect(mockCommentRepository.getComments).toBeCalledWith(id)
    expect(mockThreadRepository.getThreadDetail).toBeCalledWith(id)
    expect(mockReplyRepository.getReplies).toBeCalledWith("comment-BVXLLL0oCWvI3Z7Sb99Ox")
  })
  it('should orchestrating the get thread detail with empty comment action correctly ', async () => {
    const id = "thread-1eGMLHGwKhVQzVIIUur_G"
    const thread = {
      "id": 'thread-1eGMLHGwKhVQzVIIUur_G',
      "title": 'sebuah thread',
      "body": 'sebuah body thread',
      "username": 'johndoe',
      "date": "2022-10-12T23:41:56.828Z"
    }
    const response = {
      "id": "thread-1eGMLHGwKhVQzVIIUur_G",
            "title": "sebuah thread",
            "body": "sebuah body thread",
            "username": "johndoe",
            "date": "2022-10-12T23:41:56.828Z",
            "comments": []
    }
    const commentResponse = []
    // creating dependency of use case
    const mockCommentRepository = new CommentRepository()
    const mockThreadRepository = new ThreadRepository()
    const mockReplyRepository = new ReplyRepository()
    mockCommentRepository.getComments = jest
      .fn()
      .mockImplementation(() => 
      Promise.resolve(commentResponse)
    )

    mockThreadRepository.getThreadDetail = jest.fn(() =>
      Promise.resolve(thread),
    )

    // creating use case instance
    const getThreadDetail = new GetThreadDetail({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      replyRepository: mockReplyRepository,
    })
    // action
    const threadDetail = await getThreadDetail.execute(id)
    // Assert
    expect(threadDetail).toStrictEqual(response)
    expect(mockCommentRepository.getComments).toBeCalledWith(id)
    expect(mockThreadRepository.getThreadDetail).toBeCalledWith(id)
  })
  it('should orchestrating the get thread detail with empty reply action correctly', async () => {
    const id = "thread-1eGMLHGwKhVQzVIIUur_G"
    const thread = {
      "id": "thread-1eGMLHGwKhVQzVIIUur_G",
      "title": "sebuah thread",
      "body": "sebuah body thread",
      "username": "johndoe",
      "date": "2022-10-12T23:41:56.828Z"
    }
    const response = {
      "id": "thread-1eGMLHGwKhVQzVIIUur_G",
      "title": "sebuah thread",
      "body": "sebuah body thread",
      "username": "johndoe",
      "date": "2022-10-12T23:41:56.828Z",
      "comments": [
          {
              "id": "comment-BVXLLL0oCWvI3Z7Sb99Ox",
              "date": "2022-10-13T00:06:05.237Z",
              "username": "dicoding",
              "deletedAt": null,
              "content": "sebuah comment",
              "replies": null
          }
      ]
    }
    const commentResponse = 
      [
        {
          "id": "comment-BVXLLL0oCWvI3Z7Sb99Ox",
          "date": "2022-10-13T00:06:05.237Z",
          "username": "dicoding",
          "deletedAt": null,
          "content": "sebuah comment",
        }
      ]
    const replies = null
    // creating dependency of use case
    const mockCommentRepository = new CommentRepository()
    const mockThreadRepository = new ThreadRepository()
    const mockReplyRepository = new ReplyRepository()

    mockReplyRepository.getReplies = jest
    .fn()
    .mockImplementation(() => 
    Promise.resolve(replies)
  )
    mockCommentRepository.getComments = jest
      .fn()
      .mockImplementation(() => 
      Promise.resolve(commentResponse)
    )

    mockThreadRepository.getThreadDetail = jest.fn(() =>
      Promise.resolve(thread),
    )
    // creating use case instance
    const getThreadDetail = new GetThreadDetail({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      replyRepository: mockReplyRepository,
    })
    // action
    const threadDetail = await getThreadDetail.execute(id)
    // Assert
    expect(threadDetail).toStrictEqual(response)
    expect(mockCommentRepository.getComments).toBeCalledWith(id)
    expect(mockThreadRepository.getThreadDetail).toBeCalledWith(id)
    expect(mockReplyRepository.getReplies).toBeCalledWith("comment-BVXLLL0oCWvI3Z7Sb99Ox")
  }),
  it('should orchestrating the get thread detail and deleted comment action correctly', async () => {
    const id = "thread-1eGMLHGwKhVQzVIIUur_G"
    const thread = {
      "id": "thread-1eGMLHGwKhVQzVIIUur_G",
      "title": "sebuah thread",
      "body": "sebuah body thread",
      "username": "johndoe",
      "date": "2022-10-12T23:41:56.828Z"
    }
    const response = {
      "id": "thread-1eGMLHGwKhVQzVIIUur_G",
      "title": "sebuah thread",
      "body": "sebuah body thread",
      "username": "johndoe",
      "date": "2022-10-12T23:41:56.828Z",
      "comments": [
          {
              "id": "comment-BVXLLL0oCWvI3Z7Sb99Ox",
              "date": "2022-10-13T00:06:05.237Z",
              "username": "dicoding",
              "deletedAt": "2022-10-13T00:06:05.237Z",
              "content": "**balasan telah dihapus**",
              "replies": []
          }
      ]
    }
    const commentResponse = 
      [
        {
          "id": "comment-BVXLLL0oCWvI3Z7Sb99Ox",
          "date": "2022-10-13T00:06:05.237Z",
          "username": "dicoding",
          "deletedAt": "2022-10-13T00:06:05.237Z",
          "content": "**balasan telah dihapus**"
        }
      ]
    const replies = []
    // creating dependency of use case
    const mockCommentRepository = new CommentRepository()
    const mockThreadRepository = new ThreadRepository()
    const mockReplyRepository = new ReplyRepository()

    mockReplyRepository.getReplies = jest
    .fn()
    .mockImplementation(() => 
    Promise.resolve(replies)
  )
    mockCommentRepository.getComments = jest
      .fn()
      .mockImplementation(() => 
      Promise.resolve(commentResponse)
    )

    mockThreadRepository.getThreadDetail = jest.fn(() =>
      Promise.resolve(thread),
    )
    // creating use case instance
    const getThreadDetail = new GetThreadDetail({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      replyRepository: mockReplyRepository,
    })
    // action
    const threadDetail = await getThreadDetail.execute(id)
    // Assert
    expect(threadDetail).toStrictEqual(response)
    expect(mockCommentRepository.getComments).toBeCalledWith(id)
    expect(mockThreadRepository.getThreadDetail).toBeCalledWith(id)
    expect(mockReplyRepository.getReplies).toBeCalledWith("comment-BVXLLL0oCWvI3Z7Sb99Ox")
  })
})
