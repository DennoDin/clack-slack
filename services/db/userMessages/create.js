const Promise = require("bluebird");
const validateMessage = (uMessage) =>
  typeof uMessage === "string" && uMessage.replace(" ", "").length > 0;

module.exports = (knex, UserMessage) => {
  return ({ fromId, toId, message }) => {
    return Promise.try(() => {
      if (!validateMessage(message)) {
        throw new Error(
          "User Message must be provided, and be at least 1 characters"
        );
      }
    })
      .then(() =>
        knex("user_messages").insert({
          to_id: toId,
          from_id: fromId,
          message,
        })
      )
      .then(() => {
        return knex("user_messages")
          .innerJoin("users", "from_id", "=", "users.id")
          .select();
      })
      .then((uMessage) => {
        return uMessage.map((singleMessage) => {
          const obj = {
            from: singleMessage.username,
            to: singleMessage.name,
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
