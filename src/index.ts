import RingCentral from '@rc-ex/core';

const rc = new RingCentral({
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
  server: process.env.RINGCENTRAL_SERVER_URL,
});

(async () => {
  await rc.authorize({
    username: process.env.RINGCENTRAL_USERNAME!,
    extension: process.env.RINGCENTRAL_EXTENSION,
    password: process.env.RINGCENTRAL_PASSWORD!,
  });

  const currentAnsweringRule = await rc
    .restapi()
    .account()
    .extension()
    .answeringRule('business-hours-rule')
    .get();
  console.log(JSON.stringify(currentAnsweringRule, null, 2));

  const anotherExtInfo = await rc
    .restapi()
    .account()
    .extension(process.env.RINGCENTRAL_ANOTHER_EXTENSION_ID)
    .get();
  console.log(JSON.stringify(anotherExtInfo, null, 2));

  delete currentAnsweringRule.forwarding?.rules?.[0].forwardingNumbers?.[0].id;

  const result = await rc
    .restapi()
    .account()
    .extension(process.env.RINGCENTRAL_ANOTHER_EXTENSION_ID)
    .answeringRule('business-hours-rule')
    .put(currentAnsweringRule);
  console.log(JSON.stringify(result, null, 2));

  await rc.revoke();
})();
