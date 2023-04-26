const nodemailer = require('nodemailer')

const handleMail = async (req, res) =>{
	const {fullName, phone, note} = req.body
	console.log(req.body)
	try{
		const transport = nodemailer.createTransport({
			host: process.env.MAIL_HOST,
			secure: true,
			port: process.env.MAIL_PORT,
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS,
			}
		})

		const result = await transport.sendMail({
			from: 'bertha@basspoolgroup.miami',
			to: 'bertha@basspoolgroup.miami',
			subject: 'Costumer Message',
			html: `<div> 
			<h2>Pools Cosmetics Contact Form</h2>
			<p> <b>Full Name: </b> ${fullName} </p>
			<p> <b>Phone: </b> ${phone} </p>
			<p> <b>Note: </b> ${note} </p>
			</div>`
		})

		res.status(201).json(result)


	}catch(err){
		console.log(err);
		res.status(400).json({ message: 'Invalid Request' });
	}
}


module.exports = {handleMail}