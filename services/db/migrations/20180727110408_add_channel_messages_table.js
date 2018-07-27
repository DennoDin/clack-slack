exports.up = function(knex, Promise) {
  // create the 'users' table with three columns
  return knex.schema.createTable("channel_messages", (t) => {
    t
      .increments() // auto-incrementing id column
      .index(); // index this column

    t
      .integer("channel_id") // maximum length of 15 characters
      .notNullable(); // add a not-null constraint to this column
    t.foreign("channel_id").references("channels.id"); // foreign key, channels.id
    t.integer("from_id").notNullable();
    t.foreign("users").references("id");
    t.text("message").notNullable();
    t
      .timestamp("sent_at")
      .notNullable()
      .defaultTo(knex.fn.now()); // default to the current time
  });
};

exports.down = function(knex, Promise) {
  // undo this migration by destroying the 'users' table
  return knex.schema.dropTable("channel_messages");
};
