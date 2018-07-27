const Promise = require("bluebird");
const validateMessage = (uMessage) =>
  typeof uMessage === "string" && uMessage.replace(" ", "").length > 3;

module.exports = (knex, channelMessage) => {
  return ({ fromId, channelId, message }) => {
    return Promise.try(() => {
      if (!validateMessage(message)) {
        throw new Error(
          "Channel Name must be provided, and be at least three characters"
        );
      }
    })
      .then(() =>
        knex("channel_messages").insert({ name: message.toLowerCase() })
      )
      .then(() => {
        return knex("channel_messages")
          .where({ name: message.toLowerCase() })
          .select();
      })
      .then((channels) => new Channel(channels.pop()))
      .catch((err) => {
        if (err.message.match("duplicate key value"))
          throw new Error("That channel already exists");

        throw err;
      });
  };
};
