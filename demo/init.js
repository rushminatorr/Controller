const request = require('request')

const HOST = 'http://localhost:51121/api/v3'
const EMAIL = 'user@domain.com'
const PASSWORD = '#Bugs4Fun'

function httpRequest(opts) {
  return new Promise((resolve, reject) => {
    request(opts, (error, response, body) => {
      if (error) {
        return reject(error)
      }
      resolve(body)
    })
  })
}

function post(url, body, auth) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    headers.Authorization = auth
  }

  const options = {
    method: 'POST',
    url,
    headers,
    body,
    json: true,
  }

  return httpRequest(options)
}

function get(url, auth) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    headers.Authorization = auth
  }

  const options = {
    method: 'GET',
    url,
    headers,
    json: true,
  }

  return httpRequest(options)
}

function signup() {
  const signup = {
    url: `${HOST}/user/signup`,
    body: {
      firstName: 'John',
      lastName: 'Doe',
      email: EMAIL,
      password: PASSWORD,
    },
  }

  return post(signup.url, signup.body)
}

async function provisioningKey(nodeId, userToken) {
  const login = {
    url: `${HOST}/iofog/${nodeId}/provisioning-key`,
  }
  return get(login.url, userToken)
}

async function login() {
  const login = {
    url: `${HOST}/user/login`,
    body: {
      email: EMAIL,
      password: PASSWORD,
    },
  }
  return post(login.url, login.body)
}

async function newNode(name, userToken) {
  const newNode = {
    url: `${HOST}/iofog`,
    body: { name, fogType: 1 },
  }
  return post(newNode.url, newNode.body, userToken)
}

async function main() {
  await signup()

  const loginResponse = await login()
  const userToken = loginResponse.accessToken

  const node1Response = await newNode('Agent 1', userToken)
  const provisioning1Response = await provisioningKey(node1Response.uuid, userToken)
  
  const node2Response = await newNode('Agent 2', userToken)
  const provisioning2Response = await provisioningKey(node2Response.uuid, userToken)

  console.log(provisioning1Response.key)
  console.log(provisioning2Response.key)
}

main()
