const pact = require('@pact-foundation/pact-node/');
const path = require('path');

if (!process.env.CI && !process.env.PUBLISH_PACT) {
    console.log("skipping Pact publish...");
    return
}

let pactBrokerUrl = process.env.PACT_BROKER_URL || "http://localhost:8000";
let pactBrokerToken = process.env.PACT_BROKER_TOKEN || "pact_test_token";

const gitHash = require('child_process')
    .execSync('git rev-parse --short HEAD')
    .toString().trim();

const opts = {
    pactFilesOrDirs: [path.resolve(__dirname, './pacts/')],
    pactBroker: pactBrokerUrl,
    pactBrokerToken: pactBrokerToken,
    tags: ['prod', 'test'],
    consumerVersion: gitHash
};

pact
    .publishPacts(opts)
    .then(() => {
        console.log('Pact contract publishing complete!');
        console.log('');
        console.log(`Head over to ${pactBrokerUrl} and login with`);
        console.log(`=> your pact broker token.`);
        console.log('to see your published contracts.')
    })
    .catch(e => {
        console.log('Pact contract publishing failed: ', e)
    });
