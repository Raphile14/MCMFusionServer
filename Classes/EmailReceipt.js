const nodemailer = require('nodemailer');

module.exports = class EmailReceipt {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            auth: {
                user: process.env.RECEIPT_EMAIL,
                pass: process.env.RECEIPT_PASS
            }
        });
    }
    sendEmail(id, data, encryptedLink) {   
        try {
            let arr = data[2].category.split(" ");
            let category = arr[0];
            let text = 'Hi, ' + data[1] + '!\n\nThank you for placing your votes on MCM Fusion: Technicity’s event.\n\n'
            +'For your reference, here is a voting receipt:\n' + data[2].category + ': ' + data[2].team + '\n' + data[3].category + ': ' + data[3].team + '\n' + data[4].category + ': ' + data[4].team 
            + '\n\n' + 'To finalize your vote, please click on this link: https://mcmfusionvotationbot.herokuapp.com/confirmation/'+id+'/'+category+'/'+encryptedLink;
            let message = 
            '<h1> Hi, ' + data[1] + '! </h1> <br>'
            + 'Thank you for placing your votes on MCM Fusion: Technicity’s event. <br> <br>' 
            + 'For your reference, here is a voting receipt:<br> <ul>' 
            + '<li>'        
            + data[2].category + ': ' + data[2].team + '<br>'
            + '</li> <li>'
            + data[3].category + ': ' + data[3].team + '<br>'
            + '</li> <li>'
            + data[4].category + ': ' + data[4].team + '</li> </ul>'
            + 'To finalize your vote, please click on this link: '
            // + '<a href="http://192.168.0.11:5000/confirmation/'+id+'/'+category+'/'+encryptedLink+'"> HERE! </a>'
            + '<a href="https://mcmfusionvotationbot.herokuapp.com/confirmation/'+id+'/'+category+'/'+encryptedLink+'"> HERE! </a>'
            + '<br> <br>' 
            + 'Keep in mind that upon clicking the link your vote will be submitted and is irrevocable.' 
            + '<br> <br>' 
            + 'Thank you!';        
            let mailOptions = {
                from: process.env.RECEIPT_EMAIL,
                to: data[0],
                subject: 'MCM Fusion Voting Confirmation and Receipt',
                html: message,
                text: text
            }
            this.transporter.sendMail(mailOptions, function(err, data){
                if (err) {
                    console.log(err);
                    return false;
                }
                else {
                    return true;
                }
            }); 
        }   
        catch (error) {
            return false;
        } 
                   
    }
}