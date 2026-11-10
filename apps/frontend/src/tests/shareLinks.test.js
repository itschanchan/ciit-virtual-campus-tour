import { describe, expect, it } from 'vitest'
import {
  MESSENGER_URL,
  DISCORD_URL,
  SHARE_MESSAGE,
  buildEmailShareUrl,
  buildFacebookShareUrl,
  buildWhatsAppShareUrl,
  buildXShareUrl,
  getTourUrl,
} from '../lib/shareLinks'

const TOUR_URL = 'https://tour.example.test/campus?floor=5f#lobby'

describe('shareLinks', () => {
  it('reads the current tour address from the browser', () => {
    expect(getTourUrl()).toBe(window.location.href)
  })

  it('builds an encoded Facebook share address', () => {
    const url = buildFacebookShareUrl(TOUR_URL)

    expect(url).toContain('facebook.com/sharer')
    expect(url).toContain(encodeURIComponent(TOUR_URL))
  })

  it('builds an encoded X share address with the share message', () => {
    const url = buildXShareUrl(TOUR_URL)

    expect(url).toContain('x.com/intent/post')
    expect(url).toContain(encodeURIComponent(TOUR_URL))
    expect(url).toContain(encodeURIComponent(SHARE_MESSAGE))
  })

  it('builds a encoded WhatsApp share address with the message and link', () => {
    const url = buildWhatsAppShareUrl(TOUR_URL)

    expect(url).toContain('wa.me')
    expect(url).toContain(encodeURIComponent(TOUR_URL))
    expect(url).toContain(encodeURIComponent(SHARE_MESSAGE))
  })

  it('builds an email share address with a subject and body', () => {
    const url = buildEmailShareUrl(TOUR_URL)

    expect(url.startsWith('mailto:?')).toBe(true)
    expect(url).toContain('subject=')
    expect(url).toContain(encodeURIComponent(TOUR_URL))
  })

  it('exposes Messenger and Discord destinations', () => {
    expect(MESSENGER_URL).toContain('messenger.com')
    expect(DISCORD_URL).toContain('discord.com')
  })
})
