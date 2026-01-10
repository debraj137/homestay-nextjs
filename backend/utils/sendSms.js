export async function sendSms({ to, message }) {
  try {
    const auth = process.env.DATAGENIT_AUTH_KEY;
    const senderId = process.env.DATAGENIT_SENDER_ID;
    const templateId = process.env.DATAGENIT_TEMPLATE_ID;
    const entityId = process.env.DATAGENIT_ENTITY_ID

    if (!auth || !senderId) {
      console.error('DATAGENIT credentials missing');
      return;
    }

    // Datagenit expects comma-separated numbers
    const msisdn = Array.isArray(to) ? to.join(',') : to;

    const params = new URLSearchParams({
      auth,
      msisdn,
      senderid: senderId,
      entity_id: entityId,
      template_id: templateId,
      message,
      countrycode: '91', // India
      type: '1', // unicode support (safe to keep)
    });

    const url = `https://api.datagenit.com/sms?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
    });

    const text = await response.text();

    if (!response.ok) {
      console.error('Datagenit SMS failed:', text);
      return;
    }

    console.log('Datagenit SMS sent successfully:', text);
    console.log("response body in datagen: ",response);
  } catch (error) {
    console.error('Datagenit SMS error:', error.message);
  }
}
