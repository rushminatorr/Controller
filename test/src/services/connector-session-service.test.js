// TODO finish with qs.stringify mock EWC-452
const {expect} = require('chai')
const sinon = require('sinon')
const fs = require('fs')

const ConnectorSessionService = require('../../../src/services/connector-session-service')
const ConnectorManager = require('../../../src/sequelize/managers/connector-manager')
const AppHelper = require('../../../src/helpers/app-helper')
const constants = require('../../../src/helpers/constants')
const connectorMode = require('../../../src/enums/connector-access-mode')

describe('Connector Session Service', () => {
  def('subject', () => ConnectorSessionService)
  def('sandbox', () => sinon.createSandbox())

  afterEach(() => $sandbox.restore())

  describe('.openSessionOnRandomConnector()', () => {
    const transaction = {}
    const error = 'Not able to open port on remote Connector. Gave up after 5 attempts.'

    const isPublicAccess = false
    const publisherId = 'testPublisherId'

    const connector = {
      id: 15,
      domain: 'testDomain',
      devMode: true,
      token: 'testToken',
    }

    const data = JSON.stringify({
      publisherId: publisherId,
      routeType: connectorMode.PRIVATE,
    })

    const options = {
      host: connector.domain,
      port: constants.CONNECTOR_HTTP_PORT,
      path: '/route',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'Authorization': connector.token,
      },
    }

    const connectors = [
      connector,
    ]

    const expected = {
      session: {
        connectorId: 15,
      },
      connector: {
        id: 15,
        domain: 'testDomain',
        devMode: true,
        token: 'testToken',
      },
    }

    def('subject', () => $subject.openSessionOnRandomConnector(isPublicAccess, publisherId, transaction))
    def('findConnectorsResponse', () => Promise.resolve(connectors))
    def('makeRequestResponse', () => Promise.resolve({}))
    def('fsResponse', () => Buffer.from('test'))

    beforeEach(() => {
      $sandbox.stub(ConnectorManager, 'findAll').returns($findConnectorsResponse)
      $sandbox.stub(AppHelper, 'makeRequest').returns($makeRequestResponse)
      $sandbox.stub(fs, 'readFileSync').returns($fsResponse)
    })

    it('calls ConnectorManager#findAll() with correct args', async () => {
      await $subject
      expect(ConnectorManager.findAll).to.have.been.calledWith({}, transaction)
    })

    context('when ConnectorManager#findAll() fails', () => {
      def('findConnectorsResponse', () => Promise.reject(error))

      it(`fails with ${error}`, () => {
        return expect($subject).to.be.rejectedWith(error)
      })
    })

    context('when ConnectorManager#findAll() succeeds', () => {
      it('calls AppHelper#makeRequest() with correct args', async () => {
        await $subject
        expect(AppHelper.makeRequest).to.have.been.calledWith(!connector.devMode, options, data)
      })

      context('when AppHelper#makeRequest() fails', () => {
        def('makeRequestResponse', () => Promise.reject(error))

        it(`fails with ${error}`, () => {
          return expect($subject).to.be.rejectedWith(error)
        })
      })

      context('when AppHelper#makeRequest() succeeds', () => {
        it('fulfills the promise', () => {
          return expect($subject).to.eventually.deep.equal(expected)
        })
      })
    })
  })

  describe('.closeSessionOnConnector()', () => {
    const error = 'Error!'

    const isPublicAccess = false
    const publisherId = 'testPublisherId'

    const connector = {
      id: 15,
      domain: 'testDomain',
      devMode: true,
      token: 'testToken',
    }

    const options = {
      host: connector.domain,
      port: constants.CONNECTOR_HTTP_PORT,
      path: '/route/private/' + publisherId,
      method: 'DELETE',
      headers: {
        Authorization: connector.token,
      },
    }

    def('subject', () => $subject.closeSessionOnConnector(connector, isPublicAccess, publisherId))
    def('makeRequestResponse', () => Promise.resolve({}))
    def('fsResponse', () => Buffer.from('test'))

    beforeEach(() => {
      $sandbox.stub(fs, 'readFileSync').returns($fsResponse)
      $sandbox.stub(AppHelper, 'makeRequest').returns($makeRequestResponse)
    })

    it('calls AppHelper#makeRequest() with correct args', async () => {
      await $subject
      expect(AppHelper.makeRequest).to.have.been.calledWith(!connector.devMode, options, '')
    })

    context('when AppHelper#makeRequest() fails', () => {
      def('makeRequestResponse', () => Promise.reject(error))

      it(`fails with ${error}`, () => {
        return expect($subject).to.be.rejectedWith(error)
      })
    })

    context('when AppHelper#makeRequest() succeeds', () => {
      it('fulfills the promise', () => {
        return expect($subject).to.eventually.equal(undefined)
      })
    })
  })
})


