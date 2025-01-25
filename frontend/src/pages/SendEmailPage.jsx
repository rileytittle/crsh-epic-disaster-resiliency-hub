import React from 'react';
import axios from 'axios';

const SendEmailPage = () => {

  const sendTestEmail = async () => {
    try {
      const response = await axios.post('http://localhost:3000/mailgun/send-email', {
        to: 'CoreyR.Sorelle@hotmail.com',
        subject: 'Test Email',
        text: 'This is a test email from Mailgun.'
      });
      console.log('Email sent successfully', response.data);
      alert('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email!');
    }
  };

  return (
    <div>
      <h1>Send Test Email</h1>
      <button onClick={sendTestEmail}>Send Test Email</button>
    </div>
  );
};

export default SendEmailPage;
