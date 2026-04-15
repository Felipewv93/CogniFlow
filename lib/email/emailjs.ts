type TeamInviteEmailParams = {
  toEmail: string;
  teamName: string;
  inviterName: string;
  inviteLink: string;
};

const EMAILJS_API_URL = 'https://api.emailjs.com/api/v1.0/email/send';

function getMissingEmailEnvVars() {
  const requiredVars = ['EMAILJS_SERVICE_ID', 'EMAILJS_TEMPLATE_ID', 'EMAILJS_PUBLIC_KEY'] as const;

  return requiredVars.filter((key) => !process.env[key]);
}

export function hasEmailJsConfig() {
  return getMissingEmailEnvVars().length === 0;
}

export function getEmailJsConfigError() {
  const missingVars = getMissingEmailEnvVars();

  if (missingVars.length === 0) {
    return null;
  }

  return `Serviço de e-mail não configurado. Variáveis ausentes: ${missingVars.join(', ')}`;
}

export async function sendTeamInviteEmail({
  toEmail,
  teamName,
  inviterName,
  inviteLink,
}: TeamInviteEmailParams) {
  const configError = getEmailJsConfigError();

  if (configError) {
    throw new Error(configError);
  }

  const payload: Record<string, unknown> = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID,
    user_id: process.env.EMAILJS_PUBLIC_KEY,
    template_params: {
      to_email: toEmail,
      team_name: teamName,
      inviter_name: inviterName,
      invite_link: inviteLink,
      app_name: 'CogniFlow',
    },
  };

  if (process.env.EMAILJS_PRIVATE_KEY) {
    payload.accessToken = process.env.EMAILJS_PRIVATE_KEY;
  }

  const response = await fetch(EMAILJS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Falha ao enviar e-mail via EmailJS: ${errorText || response.statusText}`);
  }
}
