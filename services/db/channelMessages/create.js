const Promise = require("bluebird");
const validateMessage = (uMessage) =>
  typeof uMessage === "string" && uMessage.replace(" ", "").length > 0;

module.exports = (knex, ChannelMessage) => {
  return ({ fromId, channelId, message }) => {
    return Promise.try(() => {
      if (!validateMessage(message)) {
        throw new Error(
          "Channel Message must be provided, and be at least 1 characters"
        );
      }
    })
      .then(() =>
        knex("channel_messages").insert({
          channel_id: channelId,
          from_id: fromId,
          message,
        })
      )
      .then(() => {
        return knex("channel_messages")
          .innerJoin("users", "from_id", "=", "users.id")
          .innerJoin("channels", "channel_id", "=", "channels.id")
          .select();
      })
      .then((cMessage) => {
        return cMessage.map((singleMessage) => {
          const obj = {
            from: singleMessage.username,
            to: singleMessage.name,
            message: singleMessage.message,
            id: singleMessage.id,
            sent_at: singleMessage.sent_at,
          };
          return new ChannelMessage(obj);
        });
      })

      .catch((err) => {
        if (err.message.match("duplicate key value"))
          throw new Error("That channel already exists");

        throw err;
      });
  };
};
