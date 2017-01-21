const events = {};

// Append the new callback to our list of event handlers.
function addEventCallback(eventId, callback) {
  events[eventId] = events[eventId] || []; // if undefined prepare as arrayz
  events[eventId].push(callback);
}

// Retrieve the list of event handlers for a given event id.
function getEventCallbacks(eventId) {
  if (events[eventId]) {
    return events[eventId];
  }
  return [];
}

// Invoke each of the event handlers for a given event id with specified data.
function invokeEventCallbacks(eventId) {
  let args = [];
  const callbacks = getEventCallbacks(eventId);

  Array.prototype.push.apply(args, arguments); //eslint-disable-line
  args = args.slice(1);

  for (let i = 0; i < callbacks.length; i++) {
    callbacks[i].apply(null, args);
  }

  // if (eventId.split('_')[0] === 'once') {
  //   events = [];
  // }
}

export default {
  addEventCallback,
  getEventCallbacks,
  invokeEventCallbacks
};
