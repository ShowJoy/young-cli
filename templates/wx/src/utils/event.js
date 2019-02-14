const events = {};

export const on = (name, self, callback) => {
  const tuple = [self, callback];
  const callbacks = events[name];
  if (Array.isArray(callbacks)) {
    callbacks.push(tuple);
  } else {
    events[name] = [tuple];
  }
};

export const remove = (name, self) => {
  const callbacks = events[name];
  if (Array.isArray(callbacks)) {
    events[name] = callbacks.filter((tuple) => tuple[0] !== self);
  }
};


export const emit = (name, data) => {
  const callbacks = events[name];
  if (Array.isArray(callbacks)) {
    callbacks.map(tuple => {
      const self = tuple[0];
      const callback = tuple[1];
      return callback.call(self, data);
    });
  }
};
