# DeFi SDK on Ranger 

![image](https://user-images.githubusercontent.com/35088567/200258691-4826a15d-892e-41ea-8f41-a2cfe2e55b53.png)

## Features
- Credit Card, Binance Connect
- Cross-Chain, Multichain
- Aggregator API, DoDo
- Token Info, Coingeckgo

## Canoe DeFi plugin tech solution

### [x] iframe

Refer to https://transak.com

### [x] Component

Refer to https://depay.fi/documentation/payments, its open source code: https://github.com/DePayFi/widgets

### [√] Web Component

Refer to https://co-w.io/, its open source code: https://github.com/dejurin/crypto-converter-widget

### Advantages and disadvantages

- The iframe technology is relatively old, but the compatibility is the strongest.
- The component scheme requires the project party to access or install the code, and may need to provide open source packages of React, Vue or Angular, which has certain requirements for development.
- The component solution is the latest technology, only compatible with the latest browsers.

## Start

```bash
yarn
yarn start
yarn build
```

## Development

```bash
yarn start
```

## Build

```bash
yarn build
```

## Use

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script nomodule src="https://dex.canoe.finance/build/app.js"></script>
  </head>
  <body>
    <canoe-dex
      id=[YOUR ID]
      logo="https://xxxxx.com/xxxx.png"
      name="xxxxx"
      token="BNB"
      modules="['Info', 'News', 'Social', 'Credit-Card', 'Transfer']"
    ></canoe-dex>
  </body>
</html>
```
