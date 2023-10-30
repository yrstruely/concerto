
import dotenv from 'dotenv'
dotenv.config()
import { v4 as uuidv4 } from 'uuid'


export const jsonPlaceholderHeaders = {
    'Cache-Control': 'no-cache',
    'Host': process.env.JSON_PLACEHOLDER_HOST,
    'Accept': '*/*',
    'Connection': 'keep-alive',
    'X-Correlation-ID': uuidv4(),
    'Content-Type': 'application/json',
}

export function getPosts() {
    const method = 'GET'
    const endpoint = 'posts'
    const uri = `${process.env.JSON_PLACEHOLDER_BASE_URL}${process.env.JSON_PLACEHOLDER_URL_PATH}${endpoint}`

    jsonPlaceholderHeaders['X-Correlation-ID'] = uuidv4()

    const config = {
        method: method,
        url: uri,
        headers: jsonPlaceholderHeaders
    }

    return config
}

export function getPostById(postId) {
    const method = 'GET'
    let endpoint = 'posts/:id'
    const uri = `${process.env.JSON_PLACEHOLDER_BASE_URL}${process.env.JSON_PLACEHOLDER_URL_PATH}${endpoint.replace(':id', postId)}`

    jsonPlaceholderHeaders['X-Correlation-ID'] = uuidv4()

    const config = {
        method: method,
        url: uri,
        headers: jsonPlaceholderHeaders
    }

    return config
}

export function getCommentsOnPostByPostId(postId) {
    const method = 'GET'
    let endpoint = 'posts/:id/comments'
    const uri = `${process.env.JSON_PLACEHOLDER_BASE_URL}${process.env.JSON_PLACEHOLDER_URL_PATH}${endpoint.replace(':id', postId)}`

    jsonPlaceholderHeaders['X-Correlation-ID'] = uuidv4()

    const config = {
        method: method,
        url: uri,
        headers: jsonPlaceholderHeaders,
    }

    return config
}


export function getCommentsOnPostByPostIdParam(params = undefined) {
    const method = 'GET'
    let endpoint = 'comments'
    let uri = `${process.env.JSON_PLACEHOLDER_BASE_URL}${process.env.JSON_PLACEHOLDER_URL_PATH}${endpoint}`

    if (params) {
        uri = `${uri}?${encodeURI(new URLSearchParams(params).toString())}`
    }

    jsonPlaceholderHeaders['X-Correlation-ID'] = uuidv4()

    const config = {
        method: method,
        url: uri,
        headers: jsonPlaceholderHeaders,
    }

    return config
}

export function createPost(data) {
    const method = 'POST'
    const endpoint = 'posts'
    const uri = `${process.env.JSON_PLACEHOLDER_BASE_URL}${process.env.JSON_PLACEHOLDER_URL_PATH}${endpoint}`

    jsonPlaceholderHeaders['X-Correlation-ID'] = uuidv4()

    const config = {
        method: method,
        url: uri,
        headers: jsonPlaceholderHeaders,
        data: data
    }

    return config
}

export function updatePost(postId, data) {
    const method = 'PUT'
    const endpoint = 'posts/:id'
    const uri = `${process.env.JSON_PLACEHOLDER_BASE_URL}${process.env.JSON_PLACEHOLDER_URL_PATH}${endpoint.replace(':id', postId)}`

    jsonPlaceholderHeaders['X-Correlation-ID'] = uuidv4()

    const config = {
        method: method,
        url: uri,
        headers: jsonPlaceholderHeaders,
        data: data
    }

    return config
}

export function patchPost(postId, element) {
    const method = 'PATCH'
    const endpoint = 'posts/:id'
    const uri = `${process.env.JSON_PLACEHOLDER_BASE_URL}${process.env.JSON_PLACEHOLDER_URL_PATH}${endpoint.replace(':id', postId)}`

    jsonPlaceholderHeaders['X-Correlation-ID'] = uuidv4()

    const config = {
        method: method,
        url: uri,
        headers: jsonPlaceholderHeaders,
        data: element
    }

    return config
}

export function deletePost(postId) {
    const method = 'DELETE'
    const endpoint = 'posts/:id'
    const uri = `${process.env.JSON_PLACEHOLDER_BASE_URL}${process.env.JSON_PLACEHOLDER_URL_PATH}${endpoint.replace(':id', postId)}`

    jsonPlaceholderHeaders['X-Correlation-ID'] = uuidv4()

    const config = {
        method: method,
        url: uri,
        headers: jsonPlaceholderHeaders
    }

    return config
}

