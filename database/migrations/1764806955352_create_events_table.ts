import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('site_id').unsigned().references('id').inTable('sites').onDelete('CASCADE')
      table.string('path')
      table.string('referrer').nullable()
      table.string('user_agent').nullable()
      table.string('ip').nullable()

      table.timestamp('created_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}