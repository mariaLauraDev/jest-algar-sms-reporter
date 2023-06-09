<div align="center">
  <img height="200"
    src="./assets/logo.png">
    <p align="center"> 
      <img src="https://img.shields.io/npm/v/jest-algar-sms-reporter?style=flat-square">
      <img src="https://img.shields.io/npm/dm/jest-algar-sms-reporter?style=flat-square">
      <img src="https://img.shields.io/travis/com/hargne/jest-algar-sms-reporter?style=flat-square">
    </p>
  <p>A dependency that sends the test results in jest to sms via Algar sms to your phone!</p>
</div>

## Install

```sh
npm install --save-dev jest-algar-sms-reporter
# or
yarn add -D jest-algar-sms-reporter
```

## Usage

You must configure the jest config. Do not forget `phones` from yours phone numbers.

```javascript
module.exports = {
    ...

    reporters: [
    'default',
      ['jest-algar-sms-reporter', {
      from: 'Jest reporter',  // optional, default is 'Jest Reporter'
      phones: [
        '+5585999999999', //required, you can set how many phones you desire
       ] ,
      algarPath:'your-path-here', //required
      algarAuth:'your-auth-here',//required
      timeZone: 'America/Fortaleza', //optional, default is 'America/New_York'
      reportIfSuccess: false, // optional, default is false;
     }]
    ]
    ...
}
```

## Result

<div align="left">
  <img height="600"
    src="./assets/result.jpeg">
</div>
