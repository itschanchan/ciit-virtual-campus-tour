import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const userProfile = {
  id: 'user-1',
  username: 'student',
  email: 'student@ciit.edu.ph',
  role: 'user',
  isActive: true,
}

const authorProfile = {
  id: 'author-1',
  username: 'author',
  email: 'author@ciit.edu.ph',
  role: 'author',
  isActive: true,
}

const userControllerState = vi.hoisted(() => ({
  getMyProfile: async () => {
    throw new Error('not implemented')
  },
  getUserDetails: async () => {
    throw new Error('not implemented')
  },
  createUser: async () => {
    throw new Error('not implemented')
  },
  updateUser: async () => {
    throw new Error('not implemented')
  },
  deleteUser: async () => {
    throw new Error('not implemented')
  },
  changePassword: async () => {
    throw new Error('not implemented')
  },
}))

const gamesControllerState = vi.hoisted(() => ({
  getMyRatingCount: async () => {
    throw new Error('not implemented')
  },
}))

vi.mock('../controllers/UserController.js', () => ({
  default: {
    getMyProfile: (...args) => userControllerState.getMyProfile(...args),
    getUserDetails: (...args) => userControllerState.getUserDetails(...args),
    createUser: (...args) => userControllerState.createUser(...args),
    updateUser: (...args) => userControllerState.updateUser(...args),
    deleteUser: (...args) => userControllerState.deleteUser(...args),
    changePassword: (...args) => userControllerState.changePassword(...args),
  },
}))

vi.mock('../controllers/GamesController.js', () => ({
  default: {
    getMyRatingCount: (...args) => gamesControllerState.getMyRatingCount(...args),
  },
}))

import app from '../index.js'

describe('User profile routes', () => {
  beforeEach(() => {
    userControllerState.getMyProfile = async () => {
      throw new Error('not implemented')
    }
    userControllerState.getUserDetails = async () => {
      throw new Error('not implemented')
    }
    userControllerState.createUser = async () => {
      throw new Error('not implemented')
    }
    userControllerState.updateUser = async () => {
      throw new Error('not implemented')
    }
    userControllerState.deleteUser = async () => {
      throw new Error('not implemented')
    }
    userControllerState.changePassword = async () => {
      throw new Error('not implemented')
    }
    gamesControllerState.getMyRatingCount = async () => {
      throw new Error('not implemented')
    }
  })

  it('returns the authenticated user profile', async () => {
    userControllerState.getMyProfile = async () => userProfile

    const response = await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Bearer valid-token')
      .expect(200)

    expect(response.body).toMatchObject(userProfile)
  })

  it('denies access without a token', async () => {
    const response = await request(app)
      .get('/api/users/me')
      .expect(401)
  })

  it('returns rating count for author or admin', async () => {
    gamesControllerState.getMyRatingCount = async () => ({ count: 5 })

    const response = await request(app)
      .get('/api/users/me/rating-count')
      .set('Authorization', 'Bearer valid-token')
      .expect(200)

    expect(response.body).toMatchObject({ count: 5 })
  })

  it('denies rating count to a regular user', async () => {
    const response = await request(app)
      .get('/api/users/me/rating-count')
      .set('Authorization', 'Bearer regular-user-token')
      .expect(403)
  })
})
