/**
 * This code is taken form src/email/email.service.ts, sendVerificationEmail function
 * 
 */

class EmailService {
    // WAS
    async sendVerificationEmail(user: UserEntity, token: string) {
        const ENDPOINT = getEndpointDomain("verify/");
        const mailOptions: MailDataRequired = {
            to: user.email,
            from: HELLO_HEYAUTO,
            templateId: EmailTemplates.VERIFICATION_HEYA_AUTO,
            dynamicTemplateData: {
                verify_token: ENDPOINT + token,
            },
        };

        return await this.sendEmailSendGrid(
            mailOptions,
            EmailTypes.verification
        );
    }

    // NEW IMPLEMENTATION
    async sendVerificationEmail2(user: UserEntity, token: string) {
        return await pipe(
            getEndpointDomain("verify/"),
            ENDPOINT => [
                {
                    to: user.email,
                    from: HELLO_HEYAUTO,
                    templateId: EmailTemplates.VERIFICATION_HEYA_AUTO,
                    dynamicTemplateData: {
                        verify_token: ENDPOINT + token,
                    },
                },
                EmailTypes.verification
            ],
            this.sendEmailSendGrid.apply,
        )
    }
}