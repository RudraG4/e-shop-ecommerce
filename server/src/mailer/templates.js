const OTP_MAIL = {
  subject: () => "One Time Password (OTP) for your E-shop account",
  body: (data) =>
    `Hello ${data.name},\n\nUse ${data.otp} as One Time Password (OTP) for your E-shop account. This OTP is valid for 2 minutes. \n\nPlease do not share this OTP with anyone for security reasons`,
  html: (data) =>
    `<div style="background:gainsboro;padding:1rem;display:grid;place-items:center;"><div style="background:white;border-radius:5px;padding:1rem;">` +
    `<p>Hello ${data.name},</p>` +
    `<p>Use ${data.otp} as One Time Password (OTP) for your E-shop account. This OTP is valid for 2 minutes.</p>` +
    `<p>Please do not share this OTP with anyone for security reasons</p>` +
    `</div></div>`,
};

const PWD_RST_INIT_MAIL = {
  subject: () => "Password reset request for your E-shop account",
  body: (data) =>
    `Hello ${data.name},\n\nUse ${data.otp} as One Time Password (OTP) for resetting your E-shop account password. This OTP is valid for 2 minutes. \n\nPlease do not share this OTP with anyone for security reasons`,
  html: (data) =>
    `<div style="background:gainsboro;padding:1rem;display:grid;place-items:center;"><div style="background:white;border-radius:5px;padding:1rem;">` +
    `<p>Hello ${data.name},</p>` +
    `<p>Use ${data.otp} as One Time Password (OTP) for resetting your E-shop account password. This OTP is valid for 2 minutes.</p>` +
    `<p>Please do not share this OTP with anyone for security reasons</p>` +
    `</div></div>`,
};

const PWD_RST_DONE_MAIL = {
  subject: () => "Password changed for your E-shop account",
  body: (data) =>
    `Hello ${data.name},\n\nYour E-shop password has been successfully changed`,
  html: (data) =>
    `<div style="background:gainsboro;padding:1rem;display:grid;place-items:center;"><div style="background:white;border-radius:5px;padding:1rem;">` +
    `<p>Hello ${data.name},</p>` +
    `<p>Your E-shop password has been successfully changed</p>` +
    `</div></div>`,
};

export default { OTP_MAIL, PWD_RST_INIT_MAIL, PWD_RST_DONE_MAIL };
