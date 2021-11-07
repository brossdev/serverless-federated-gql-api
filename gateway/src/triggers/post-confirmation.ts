import { Handler, CognitoUserPoolTriggerEvent } from 'aws-lambda';

export const postConfirmation: Handler = async (event: CognitoUserPoolTriggerEvent, _context) => {
    try {
        console.log({ env: process.env })
        const { sub } = event.request.userAttributes;
        console.log({ sub })

        return event

    } catch (error) {
        console.log({ error })
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'post confirmation trigger has failed', input: event }, null, 2)
        }
    }
}
