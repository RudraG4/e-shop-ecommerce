import NodeCache from "node-cache";

const otpCache = new NodeCache({
  stdTTL: process.env.OTP_TTL,
  checkperiod: process.env.OTP_TTL,
});

const pwdResetCache = new NodeCache({
  stdTTL: process.env.OTP_TTL,
  checkperiod: process.env.OTP_TTL,
});

export default { otpCache, pwdResetCache };
