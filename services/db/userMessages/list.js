const Promise = require("bluebird");

module.exports = (knex, UserMessage) => {
  return ({ fromId, toId }) => {
    return Promise.try(() => {})
      .then(() => {
        return knex("user_messages")
          .innerJoin("users", "from_id", "=", "users.id")
          .select()
          .where(function() {
            this.where("from_id", fromId).andWhere("to_id", toId);
          })
          .orWhere(function() {
            this.where("from_id", toId).andWhere("to_id", fromId);
          });
      })
      .then((uMessage) => {
        console.log(uMessage);
        return uMessage.map((singleMessage) => {
          const obj = {
            from: singleMessage.username,
            message: singleMessage.message,
            id: singleMessage.id,
            sent_at: singleMessage.sent_at,
          };
          return new UserMessage(obj);
        });
      })

      .catch((err) => {
        if (err.message.match("duplicate key value"))
          throw new Error("That channel already exists");

        throw err;
      });
  };
};
