module.exports = {
  '*.+(js|jsx|json|yml|yaml|css|less|scss|ts|tsx)': [`yarn run format`],
  '*.+(js|jsx|ts|tsx)': [`yarn run lint`],
  '*.go': ['gofmt -w'],
};
