// utils/sendSms.js
export const sendSms = async (phone, otp) => {
  const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
    method: 'POST',
    headers: {
      'authorization': process.env.FAST2SMS_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      route: 'otp',
      variables_values: otp,
      numbers: phone.replace('+91', '').replace(/\s/g, ''), 
    })
  });

  const data = await response.json();
  

  
  if (!data.return) throw new Error(data.message || 'SMS sending failed');
};