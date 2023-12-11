import ElasticEmail from "@elasticemail/elasticemail-client";
import "dotenv/config";

let defaultClient = ElasticEmail.ApiClient.instance;

const { ELASTICEMAIL_API_KEY, ELASTICEMAIL_EMAIL_FROM } = process.env;

const { apikey } = defaultClient.authentications;
apikey.apiKey = ELASTICEMAIL_API_KEY;

const api = new ElasticEmail.EmailsApi()

const email = ElasticEmail.EmailMessageData.constructFromObject({
    Recipients: [
        new ElasticEmail.EmailRecipient("ciweris535@newcupon.com")
    ],
    Content: {
        Body: [
            ElasticEmail.BodyPart.constructFromObject({
                ContentType: "HTML",
                Content: "My test email content ;)"
            })
        ],
        Subject: "JS EE lib test",
        From: ELASTICEMAIL_EMAIL_FROM
    }
});

var callback = function (error, data, response) {
    if (error) {
        console.error(error);
    } else {
        console.log('API called successfully.');
    }
};
api.emailsPost(email, callback);
