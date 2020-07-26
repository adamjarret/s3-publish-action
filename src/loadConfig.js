const { setOutput } = require('@actions/core');
const { createConfigLoader, createLogger } = require('s3-publish');

module.exports = (configPath) => {
  let replacer;
  const operations = [];
  const defaultLoader = createConfigLoader(require);
  const { onLog, delegate, ...config } = defaultLoader(configPath);
  return {
    ...config,
    onLog: (message) => {
      onLog && onLog(message);
      switch (message.type) {
        case 'sync:plan:result':
          setOutput('plan', JSON.stringify(message, replacer));
          break;
        case 'sync:operation:result':
          operations.push(message);
          break;
        case 'sync:result':
          setOutput('result', JSON.stringify({ ...message, operations }, replacer));
          break;
      }
    },
    delegate: {
      ...delegate,
      createLogger: (options) => {
        replacer = createLogger({ ...options, mode: 'json' }).replacer;

        const cl = delegate ? delegate.createLogger : null;
        return (cl ? cl : createLogger)(options);
      }
    }
  };
};
