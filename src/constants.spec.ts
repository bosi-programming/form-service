type Constants = typeof import('./constants');

const SECRETS = ['JWT_SECRET', 'DATABASE_PASSWORD'];
const TOUCHED = ['MONGO_URL', 'NODE_ENV', 'CRYPT_MASTER_KEY', ...SECRETS];

function loadConstants(): Constants {
  let constants: Constants | undefined;
  jest.isolateModules(() => {
    constants = jest.requireActual<Constants>('./constants');
  });
  return constants!;
}

describe('constants', () => {
  const original = Object.fromEntries(
    TOUCHED.map((name) => [name, process.env[name]]),
  );

  afterEach(() => {
    for (const name of TOUCHED) {
      if (original[name] === undefined) {
        delete process.env[name];
      } else {
        process.env[name] = original[name];
      }
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

  it('should keep the development defaults outside production', () => {
    process.env.NODE_ENV = 'development';
    SECRETS.forEach((name) => delete process.env[name]);
    const constants = loadConstants();
    expect(constants.JWT_SECRET).toBe('test');
    expect(constants.DATABASE_PASSWORD).toBe('temp');
  });

  it.each(SECRETS)(
    'should refuse to start in production without %s',
    (missing) => {
      process.env.NODE_ENV = 'production';
      SECRETS.forEach((name) => (process.env[name] = 'set'));
      delete process.env[missing];
      expect(loadConstants).toThrow(missing);
    },
  );

  it('should start in production without CRYPT_MASTER_KEY', () => {
    process.env.NODE_ENV = 'production';
    SECRETS.forEach((name) => (process.env[name] = 'set'));
    delete process.env.CRYPT_MASTER_KEY;
    const constants = loadConstants();
    expect(constants).not.toHaveProperty('CRYPT_MASTER_KEY');
  });

  it('should read the secrets in production when they are set', () => {
    process.env.NODE_ENV = 'production';
    SECRETS.forEach((name) => (process.env[name] = `${name}-value`));
    const constants = loadConstants();
    expect(constants.JWT_SECRET).toBe('JWT_SECRET-value');
    expect(constants.DATABASE_PASSWORD).toBe('DATABASE_PASSWORD-value');
  });
});
