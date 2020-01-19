const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'krisy29@gmail.com',
        subject: 'Добре дошли!',
        text: `Добре дошли, ${name}! 
        Радваме се, че ще използвате нашата платформа за гласуване!`
    });
};

const sendGoodbyeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'krisy29@gmail.com',
        subject: 'Довиждане!',
        text: `Довиждане, ${name}! 
        Надяваме се да се видим отново!`
    });
};

const sendMembersEmail = (ownerName, email, partyName, members) => {
    sgMail.send({
        to: email,
        from: 'krisy29@gmail.com',
        templateId: 'd-6c9d6517bf124ee6984e2739b2e4095c',
        dynamic_template_data: {
            subject: `Информация за партия ${partyName}`,
            name: partyName,
            owner: ownerName,
            members
        }
    });
};

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail,
    sendMembersEmail
};

