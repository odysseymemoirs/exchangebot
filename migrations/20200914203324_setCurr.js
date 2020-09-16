
exports.up = function (knex) {
  return knex.schema
    .createTable('currencies', function (table) {
      table.increments();
      table.float('buy', 10, 10).notNullable()
      table.float('sell', 10, 10).notNullable()
      table.string('currencies_name', 10).notNullable();
      table.string('exchange_types_name', 10).notNullable()
      table.string('exchange_rate_date', 30).notNullable()
      table.smallint('day', 10).notNullable()
    })

    .createTable('todayExchangeTemplate', function (table) {
      table.increments();
      table.string('template', 300).notNullable();
      table.string('exchange_types_name', 10).notNullable()
      //   table.string('exchange_rate_date',30).notNullable()
      table.smallint('day', 10).notNullable()
    })

    .createTable('rateVariationTemplate', function (table) {
      table.increments();
      table.string('template', 300).notNullable();
      table.string('exchange_types_name', 10).notNullable()
      //   table.string('exchange_rate_date',30).notNullable()
      table.smallint('day', 10).notNullable()
    })

    .createTable('rateVariationActionUsage', function (table) {
      table.increments();
      table.integer('counter').notNullable();
    })

    .createTable('todayExchangeActionUsage', function (table) {
      table.increments();
      table.integer('counter').notNullable();
    })

    .createTable('calculatorActionUsage', function (table) {
      table.increments();
      table.integer('counter').notNullable();
    })

};

exports.down = function (knex) {
  return knex.schema
    .dropTable("currencies")
    .dropTable("todayExchangeTemplate")
    .dropTable("rateVariationTemplate")
    .dropTable("rateVariationActionUsage")
    .dropTable("todayExchangeActionUsage")
    .dropTable("calculatorActionUsage")


};

