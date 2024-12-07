from typing import List
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr, BaseModel
from api.config import settings
from jinja2 import Environment, select_autoescape, PackageLoader


env = Environment(
    loader=PackageLoader('api', 'templates'),
    autoescape=select_autoescape(['html', 'xml'])
)


class EmailSchema(BaseModel):
    email: List[EmailStr]


class Email:
    def __init__(self, user: dict, url: str, email: List[EmailStr]):
        self.name = user['name']
        self.sender = 'CarYak <caryak@demomailtrap.com>'
        self.email = email
        self.url = url
        pass
    async def sendMail(self, subject, template):
        try:
            conf = ConnectionConfig(
                MAIL_USERNAME=settings.EMAIL_USERNAME,
                MAIL_PASSWORD=settings.EMAIL_PASSWORD,
                MAIL_FROM=settings.EMAIL_FROM,
                MAIL_PORT=settings.EMAIL_PORT,
                MAIL_SERVER=settings.EMAIL_HOST,
                MAIL_STARTTLS=True,
                MAIL_SSL_TLS=False,
                USE_CREDENTIALS=True,
                VALIDATE_CERTS=True
            )

            template = env.get_template(f'{template}.html')
            html = template.render(
                url=self.url,
                first_name=self.name,
                subject=subject
            )

            message = MessageSchema(
                subject=subject,
                recipients=self.email,
                body=html,
                subtype="html"
            )

            fm = FastMail(conf)
            await fm.send_message(message)
            print("Email sent successfully.")

        except Exception as e:
            print(f"Error sending email: {e}")
            raise


    async def sendVerificationCode(self):
        await self.sendMail('Your verification code (Valid for 10min)', 'verification')
