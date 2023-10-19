# This repository has been deprecated. Please visit [`nucypher-ts`](https://github.com/nucypher/nucypher-ts/tree/main/demos) repository for updated demos. 

---

# nucypher-ts-demo-tdec

See the demo in action [here](https://nucypher-ts-demo-tdec.netlify.app/).

## Installation

Inspect `./src/characters.ts` and set character configuration.

Install dependencies and run:

```bash
yarn install
yarn start
```

## Usage

In order to run this demo will need a MetaMask with an account funded with enough $MATIC to fund Policy creation.

It is also recommended to change `secretKey` values for Alice and Bob characters. See `./src/characters.ts` for details.

In order to connect with the network, the demo uses a public instances of [Porter](https://docs.nucypher.com/en/latest/application_development/web_development.html#running-porter).

### Polygon

`nucypher-ts` is in an early release. We recommend **not** using it in production _just yet_.

### Oryx/Tapir - Mumbai Testnet

The current release of `nucypher-ts` supports Ursulas working on Oryx/Tapir networks and contracts deployed on Mumbai testnet.

## References

This dApp is based on [`useDapp` example](https://github.com/EthWorks/useDapp/tree/master/packages/example).
