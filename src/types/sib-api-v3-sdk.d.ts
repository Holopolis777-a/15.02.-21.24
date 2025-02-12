declare module 'sib-api-v3-sdk' {
  export namespace ApiClient {
    export const instance: {
      authentications: {
        'api-key': {
          apiKey: string;
        };
      };
    };
  }

  export class SendSmtpEmail {
    templateId: number;
    to: Array<{
      email: string;
      name: string;
    }>;
    params: Record<string, any>;
  }

  export class TransactionalEmailsApi {
    sendTransacEmail(sendSmtpEmail: SendSmtpEmail): Promise<{
      messageId: string;
    }>;
  }
}
