import { BaseCommand, args } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import Site from '#models/site'

export default class Remove extends BaseCommand {
  static commandName = 'site:remove'
  static description = 'Remove a site and all its events'

  static options: CommandOptions = {
    startApp: true,
  }

  @args.string({ description: 'Domain to remove' })
  declare domain: string

  async run() {
    const site = await Site.findBy('domain', this.domain)
    if (!site) {
      this.logger.error(`Site "${this.domain}" not found`)
      return
    }

    await site.delete()
    this.logger.success(`Removed site: ${this.domain}`)
  }
}
