import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import Site from '#models/site'

export default class Sites extends BaseCommand {
  static commandName = 'site:list'
  static description = 'List all tracked sites'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const sites = await Site.query().withCount('events')

    if (sites.length === 0) {
      this.logger.info('No sites registered. Use "node ace add <domain>" to add one.')
      return
    }

    const table = this.ui.table()
    table.head(['ID', 'Domain', 'Events', 'Created'])
    for (const site of sites) {
      table.row([
        site.id.toString(),
        site.domain,
        site.$extras.events_count.toString(),
        site.createdAt.toFormat('yyyy-MM-dd HH:mm'),
      ])
    }
    table.render()
  }
}
