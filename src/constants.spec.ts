type Constants = typeof import('./constants');

function loadConstants(): Constants {
  let constants: Constants | undefined;
  jest.isolateModules(() => {
    constants = jest.requireActual<Constants>('./constants');
  });
  return constants!;
}

describe('constants', () => {
  const original = process.env.MONGO_URL;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.MONGO_URL;
    } else {
      process.env.MONGO_URL = original;
    }
  });

  it('should read MONGO_URL from the environment', () => {
    process.env.MONGO_URL = 'mongodb://mongo:27017';
    expect(loadConstants().MONGO_URL).toBe('mongodb://mongo:27017');
  });

  it('should fall back to a local MongoDB', () => {
    delete process.env.MONGO_URL;
    expect(loadConstants().MONGO_URL).toBe('mongodb://localhost:27017');
  });
});
