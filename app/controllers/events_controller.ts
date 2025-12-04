import type { HttpContext } from '@adonisjs/core/http'
import Site from '#models/site'
import Event from '#models/event'

export default class EventsController {
  async track({ request, response }: HttpContext) {
    const host = request.header('host') || ''
    // Extract domain from host: "blip.example.com" -> "example.com"
    const domain = host.replace(/^blip\./, '')

    if (!domain) {
      return response.noContent()
    }

    const site = await Site.findBy('domain', domain)
    if (!site) {
      return response.noContent()
    }

    await Event.create({
      siteId: site.id,
      path: request.input('p', '/'),
      referrer: request.input('r') || request.header('referer'),
      userAgent: request.header('user-agent'),
      ip: request.ip(),
    })

    return response.noContent()
  }
}
