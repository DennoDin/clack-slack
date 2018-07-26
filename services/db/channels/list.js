module.exports = (knex, Channel) => {
  return () => {
    return knex("channels")
      .select()
      .then((channels) => {
        return channels.map((channel) => {
          return new Channel(channel);
        });
      });
  };
};
