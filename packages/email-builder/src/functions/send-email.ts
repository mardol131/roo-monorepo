export async function sendEmail(
  sender: string,
  to: string[],
  subject: string,
  html_body: string,
) {
  if (!process.env.EMAIL_API_URL || !process.env.SMTP2GO_API_KEY) {
    throw new Error("Email API URL or SMTP2GO API Key is not defined");
  }

  const response = await fetch(`${process.env.EMAIL_API_URL}/email/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Smtp2go-Api-Key": process.env.SMTP2GO_API_KEY,
      accept: "application/json",
    },
    body: JSON.stringify({
      sender,
      to,
      subject,
      html_body,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send email: ${response.statusText}`);
  }
  return response.json();
}
