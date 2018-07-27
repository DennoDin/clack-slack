// module.exports = (knex, ChannelMessage) => (params) => Promise.resolve([]);
const Promise = require("bluebird");

module.exports = (knex, ChannelMessage) => {
  return ({ channelId }) => {
    return Promise.try(() => {})
      .then(() => {
        return knex("channel_messages")
          .innerJoin("users", "from_id", "=", "users.id")
          .innerJoin("channels", "channel_id", "=", "channels.id")
          .where("channels.id", channelId)
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
        throw err;
      });
  };
};
