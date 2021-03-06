import { AuthConfig } from 'flex-dev-utils/dist/credentials';
import BaseClient, { BaseClientOptions } from '../baseClient';
import * as packageUtil from '../../utils/package';

describe('BaseClient', () => {
  const credential = {
    accountSid: 'AC00000000000000000000000000000000',
    authToken: 'abc',
  };
  const testBaseUrl = 'testBaseUrl';

  class Test extends BaseClient {
    constructor(authConfig: AuthConfig, baseUrl: string, options?: BaseClientOptions) {
      super(authConfig, baseUrl, options);
    }

    public getConfig = () => this.config;
  }

  const expectConfig = (client: Test) => {
    expect(client.getConfig().baseURL).toEqual(testBaseUrl);
    expect(client.getConfig().auth).toEqual(credential);
    expect(client.getConfig().exitOnRejection).toBeTruthy();
    expect(client.getConfig().userAgent).toEqual('custom-user-agent');
  };

  describe('constructor', () => {
    it('should set the config correctly', () => {
      BaseClient.userAgent = 'custom-user-agent';
      const client = new Test(credential, testBaseUrl);

      expectConfig(client);
    });

    it('should pass contentType as well', () => {
      const client = new Test(credential, testBaseUrl, {contentType: 'application/json'});

      expectConfig(client);
      expect(client.getConfig().contentType).toEqual('application/json');
    });
  });

  describe('buildUserAgent', () => {
    it('should build a user agent', () => {
      const packageDetailMock = jest
        .spyOn(packageUtil, 'getPackageDetails')
        .mockReturnValue([
          {
            name: 'p1',
            found: true,
            package: {
              name: 'p1',
              version: '1.0',
            },
          },
          {
            name: 'p2',
            found: false,
            package: {},
          },
          {
            name: 'p3',
            found: true,
            package: {
              name: 'p3',
              version: '2.0.0',
            },
          },
        ]);

      const userAgent = BaseClient.getUserAgent(['p1', 'p2', 'p3']);
      expect(userAgent).toEqual('Flex Plugin Builder p1/1.0 p2/? p3/2.0.0');
    });
  });

  describe('getBaseUrl', () => {
    it('should get prod baseUrl', () => {
      process.env.REALM = '';
      const baseUrl = BaseClient.getBaseUrl('foo', 'v1');

      expect(baseUrl).toEqual('https://foo.twilio.com/v1');
    });

    it('should get dev baseUrl', () => {
      process.env.REALM = 'dev';
      const baseUrl = BaseClient.getBaseUrl('bar', 'v2');

      expect(baseUrl).toEqual('https://bar.dev.twilio.com/v2');
    });

    it('should throw error if invalid realm is provided', (done) => {
      try {
        process.env.REALM = 'invalid';
        BaseClient.getBaseUrl('foo', 'v1');
      } catch (e) {
        done();
      }
    });
  });
});
