const routes = (handler) => ([
    {
        method: 'POST',
        path: '/threads',
        handler: handler.postThreadHandler,
        options: {
            auth: 'thread_jwt'
        }
    },
    {
        method: 'GET',
        path: '/threads/{threadId}',
        handler: handler.getsThreadHandler
    }
])

module.exports = routes