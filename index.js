'use strict';
const axios = require('axios');

let options = {
  projectId: null,
  source: '',
  apiUrl: 'https://api.quicklog.io',
  apiKey: ''
};

/**
 * Set the 'projectId', default 'source', 'apiUrl', and 'apiKey' to be used for quicklog requests.
 * @param {string} source
 */
function config(opts) {
  if (opts.projectId) {
    options.projectId = opts.projectId;
  }
  if (opts.source) {
    options.source = opts.source;
  }
  if (opts.apiUrl) {
    options.apiUrl = opts.apiUrl;
  }
  if (opts.apiKey) {
    options.apiKey = opts.apiKey;
  }
}

/**
 * Creates a traceOpts structure containing 'traceId', 'parentSpanId', 'spanId'.
 * If called without a traceId, creates a new traceId, same spanId, and no parentSpanId,
 * otherwise uses the provided traceId, parentSpanId and generates a new spanId.
 * @param {string} actorId always propagated to traceOpts
 * @param {string} traceId
 * @param {string} parentSpanId
 * @param {string} spanId
 * @return {object} with keys traceId, parentSpanId, and spanId
 */
function traceOpts(actorId, traceId, parentSpanId) {
  const spanId = generateId();
  if (!traceId) {
    traceId = spanId;
    parentSpanId = null;
  }
  return {
    actorId: actorId,
    traceId: traceId,
    parentSpanId: parentSpanId,
    spanId: spanId
  };
}

/**
 * Creates a quicklog entry.
 * @param {string} type an action or other identifying event name
 * @param {string} object identifier of primary 'thing' (often formatted as kind:unique-id)
 * @param {string} target identifier of secondary 'thing' (sometimes a destination)
 * @param {object} context any other useful information
 * @param {array} tags as ["name:value", "value", "name:value:containing:colons", ":value:containing:colons" ]
 * @param {object} traceOpts ('actorId', 'traceId', 'parentSpanId', and 'spanId' used from request to response)
 * @return {promise} axios.post()
 */
function quicklog(type, object, target, context, tags, traceOpts) {
  if (!Number.isInteger(options.projectId)) {
    return Promise.reject(new Error('projectId must be set in config options'));
  }
  if (!options.apiKey || typeof options.apiKey !== 'string' && !(options.apiKey instanceof String)) {
    return Promise.reject(new Error('apiKey must be set in config options'));
  }

  const url = options.apiUrl + '/entries?api_key=' + options.apiKey;
  context = context || {};

  const body = {
    project_id: options.projectId,
    published: traceOpts.published || new Date().toISOString(),
    actor: traceOpts.actorId,
    source: traceOpts.source || options.source,
    type: type,
    object: object,
    target: target,
    context: context,
    trace_id: traceOpts.traceId,
    parent_span_id: traceOpts.parentSpanId,
    span_id: traceOpts.spanId
  };
  return axios.post(url, body)
    .then(function (response) {
      if (tags) {
        tags.forEach(tag => {
          quicktag(tag, traceOpts);
        });
      }
    });
}

/**
 * Associates a tag (e.g key:value) with the current trace/span.
 * @param {string} tag (format 'key:value' or 'value', or ':value:containing-colon')
 * @param {object} traceOpts ('actorId', 'traceId', 'parentSpanId', and 'spanId' used from request to response)
 * @return {promise} axios.post()
 */
function quicktag(tag, traceOpts) {
  if (!Number.isInteger(options.projectId)) {
    return Promise.reject(new Error('projectId must be set in config options'));
  }
  if (!options.apiKey || typeof options.apiKey !== 'string' && !(options.apiKey instanceof String)) {
    return Promise.reject(new Error('apiKey must be set in config options'));
  }

  const url = options.apiUrl + '/tags?api_key=' + options.apiKey;
  let body = {
    project_id: options.projectId,
    trace_id: traceOpts.traceId,
    span_id: traceOpts.spanId,
    tag: tag
  };
  return axios.post(url, body);
}

/**
 * Generates a random hex string suitable for use as a trace_id or span_id.
 * @return {string}
 */
function generateId() {
  return Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
}

module.exports = {
  config: config,
  traceOpts: traceOpts,
  quicklog: quicklog,
  quicktag: quicktag,
  generateId: generateId
};
