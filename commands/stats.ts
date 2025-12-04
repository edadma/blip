import { BaseCommand, args, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import Site from '#models/site'
import Event from '#models/event'
import db from '@adonisjs/lucid/services/db'

export default class Stats extends BaseCommand {
  static commandName = 'site:stats'
  static description = 'Show event statistics for a site'

  static options: CommandOptions = {
    startApp: true,
  }

  @args.string({ description: 'Domain to show stats for', required: false })
  declare domain: string

  @flags.number({ alias: 'n', description: 'Number of top pages to show', default: 10 })
  declare limit: number

  async run() {
    if (this.domain) {
      await this.showSiteStats(this.domain)
    } else {
      await this.showOverview()
    }
  }

  async showOverview() {
    const sites = await Site.query().withCount('events')
    const totalEvents = await Event.query().count('* as total')

    this.logger.info(`Total events: ${totalEvents[0].$extras.total}`)
    this.logger.info('')

    if (sites.length > 0) {
      const table = this.ui.table()
      table.head(['Domain', 'Events'])
      for (const site of sites) {
        table.row([site.domain, site.$extras.events_count.toString()])
      }
      table.render()
    }
  }

  async showSiteStats(domain: string) {
    const site = await Site.findBy('domain', domain)
    if (!site) {
      this.logger.error(`Site "${domain}" not found`)
      return
    }

    const totalEvents = await Event.query().where('site_id', site.id).count('* as total')
    this.logger.info(`Site: ${domain}`)
    this.logger.info(`Total events: ${totalEvents[0].$extras.total}`)
    this.logger.info('')

    // Top pages
    const topPages = await db
      .from('events')
      .where('site_id', site.id)
      .select('path')
      .count('* as hits')
      .groupBy('path')
      .orderBy('hits', 'desc')
      .limit(this.limit)

    if (topPages.length > 0) {
      this.logger.info('Top pages:')
      const table = this.ui.table()
      table.head(['Path', 'Hits'])
      for (const p of topPages) {
        table.row([p.path, p.hits.toString()])
      }
      table.render()
    }

    // Top referrers
    const topReferrers = await db
      .from('events')
      .where('site_id', site.id)
      .whereNotNull('referrer')
      .where('referrer', '!=', '')
      .select('referrer')
      .count('* as hits')
      .groupBy('referrer')
      .orderBy('hits', 'desc')
      .limit(this.limit)

    if (topReferrers.length > 0) {
      this.logger.info('')
      this.logger.info('Top referrers:')
      const table = this.ui.table()
      table.head(['Referrer', 'Hits'])
      for (const r of topReferrers) {
        table.row([r.referrer, r.hits.toString()])
      }
      table.render()
    }
  }
}
