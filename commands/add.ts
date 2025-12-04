import { BaseCommand, args } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import Site from '#models/site'

export default class Add extends BaseCommand {
  static commandName = 'site:add'
  static description = 'Add a new site to track'

  static options: CommandOptions = {
    startApp: true,
  }

  @args.string({ description: 'Domain to track (e.g., example.com)' })
  declare domain: string

  async run() {
    const existing = await Site.findBy('domain', this.domain)
    if (existing) {
      this.logger.error(`Site "${this.domain}" already exists`)
      return
    }

    const site = await Site.create({ domain: this.domain })
    this.logger.success(`Added site: ${site.domain}`)

    const snippet = `<script>navigator.sendBeacon('https://blip.${site.domain}?p='+location.pathname+'&r='+document.referrer)</script>`

    this.logger.info('')
    this.logger.info('Add this to your <head>:')
    this.logger.info('')
    console.log(snippet)
  }
}
