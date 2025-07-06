const test = require('firebase-functions-test')();
const admin = require('firebase-admin');
const { expect } = require('chai');
const sinon = require('sinon');

test.mockConfig({
  cloudinary: {
    cloud_name: 'test-cloud-name',
    api_key: 'test-api-key',
    api_secret: 'test-api-secret',
  },
});

describe('Cloud Functions: reportValidation', () => {
  let adminStub;

  before(() => {
    adminStub = sinon.stub(admin, 'initializeApp');
  });

  after(() => {
    adminStub.restore();
    test.cleanup();
  });

  it('should sanitize report data on creation', async () => {
    const { validateReport } = require('../reportValidation');
    const updateSpy = sinon.spy(() => Promise.resolve());

    const snap = {
      data: () => ({
        incidentType: '<script>alert("xss")</script>',
        severityLevel: 'High',
        description: 'This is a test description.',
        imageUrl: 'https://example.com/image.png',
        location: { lat: 123, lng: 456 },
        status: 'pending_verification',
        createdAt: new Date(),
      }),
      ref: { update: updateSpy },
    };

    const wrapped = test.wrap(validateReport);
    await wrapped(snap);

    const sanitizedData = {
      incidentType: 'alert("xss")',
      severityLevel: 'High',
      description: 'This is a test description.',
    };

    expect(updateSpy.calledWith(sanitizedData)).to.be.true;
  });
});
