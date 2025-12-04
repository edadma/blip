import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Site from './site.js'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare siteId: number

  @column()
  declare path: string

  @column()
  declare referrer: string | null

  @column()
  declare userAgent: string | null

  @column()
  declare ip: string | null

  @belongsTo(() => Site)
  declare site: BelongsTo<typeof Site>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
