using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;
using Agile.Diagnostics.Logging;
using System.Reflection;
using System.IO;
using System.Net.Mail;
using System.Net.Mime;

namespace Rockend.WebAccess.Mail
{
    public static class AwsMailHelper
    {
        private static string defaultFromAddress;
        public static string DefaultFromAddress
        {
            get
            {
                if(string.IsNullOrEmpty(defaultFromAddress))
                    defaultFromAddress = "notifications@lookatmyproperty.com.au";
                return defaultFromAddress; 
            }
            set { defaultFromAddress = value; }
        }

        public static void SendEmail(string toAddresses, string subject, string body, string replyTo)
        {
            // from email must be an approved email address so use lookatmyproperty@live.com.au
            SendEmail(toAddresses, "", "", subject, body, replyTo);
        }
        
        public static void SendEmail(string toAddress, string ccAddress, string bccAddress, string subject, string body, string replyTo)
        {
            SendEmail(DefaultFromAddress, toAddress, ccAddress, bccAddress, subject, body, replyTo);
        }

        public static void SendEmail(List<string> toAddresses, List<string> ccAddresses, List<string> bccAddresses, string subject, string body, string replyTo)
        {
            SendEmail(DefaultFromAddress, toAddresses, ccAddresses, bccAddresses, subject, body, replyTo);
        }

        public static void SendEmail(string fromEmail, string toAddress, string ccAddress, string bccAddress, string subject, string body, string replyTo)
        {
            Logger.Debug("Mail to single recipient {0}, from {1}, subject {2}", toAddress, fromEmail, subject);

            List<string> toList = new List<string>(); 
            if (!string.IsNullOrWhiteSpace(toAddress))
                toList.Add(toAddress);

            List<string> ccList = new List<string>(); 
            if (!string.IsNullOrWhiteSpace(ccAddress))
                ccList.Add(ccAddress);

            List<string> bccList = new List<string>();
            if (!string.IsNullOrWhiteSpace(bccAddress))
                bccList.Add(bccAddress);

            SendEmail(fromEmail, toList, ccList, bccList, subject, body, replyTo);
        }

        public static void SendEmail(string fromEmail, List<string> toAddresses, List<string> ccAddresses, List<string> bccAddresses,  string subject, string body, string replyTo)
        {
            try
            {
                Logger.Debug("Send mail ...");
                var client = new AmazonSimpleEmailServiceClient("AKIAJWQMXZKTFON2CFDA", "A7wLwHg6Bnu6+eY1rJRc4nE3R0BVPHNObkKPBvSL");
                var request = new SendEmailRequest();
                var destination = new Destination();

                destination.ToAddresses = toAddresses;
                destination.CcAddresses = ccAddresses ?? new List<string>();
                destination.BccAddresses = bccAddresses ?? new List<string>();
                request.Destination = destination;
                request.WithMessage(new Message(new Content(subject ?? string.Empty), new Body().WithText(new Content(body ?? string.Empty))));
                request.WithSource(fromEmail);
                request.WithReplyToAddresses(replyTo);

                Logger.Debug("Sending mail ...");
                var resp = client.SendEmail(request);
                Logger.Debug("Mail sent.");
            }
            catch (Exception ex)
            {
                Logger.Error(ex);
            }
        }

        public static void SendRawEmail(string fromEmail, List<string> toAddresses, List<string> ccAddresses, List<string> bccAddresses,  string subject, string body, string replyTo, List<string> attachmentPaths, bool sendBlind)
        {
            if (string.IsNullOrEmpty(fromEmail))
            {
                Logger.Warning("SendRawEmail: fromEmail is empty. Cannot send email.");
                return;
            }
            if (toAddresses == null || !toAddresses.Any())
            {
                Logger.Warning("SendRawEmail: toAddresses is either null or empty. Cannot send email.");
                return;
            }
            if (body == null)
                body = "";

            try
            {
                Logger.Debug("Send Raw email ...");
                
                var mailMessage = new MailMessage();

                if(sendBlind)
                    toAddresses.ForEach(m => mailMessage.Bcc.Add(m));
                else
                    toAddresses.ForEach(m => mailMessage.To.Add(m));

                mailMessage.Subject = subject;
                mailMessage.SubjectEncoding = Encoding.UTF8;
                mailMessage.ReplyToList.Add(fromEmail);
                mailMessage.Body = body;
                mailMessage.From = new MailAddress(fromEmail);
                mailMessage.Sender = new MailAddress(fromEmail);

                Logger.Debug("SendRawEmai. Adding attachments");
                attachmentPaths.ForEach(attachPath =>
                {
                    if (attachPath != null && File.Exists(attachPath.Trim()))
                    {
                        var attachment = new Attachment(attachPath);
                        attachment.ContentType = new ContentType("application/octet-stream");
                        var disposition = attachment.ContentDisposition;
                        if (disposition != null)
                        {
                            disposition.DispositionType = "attachment";
                            disposition.CreationDate = File.GetCreationTime(attachPath);
                            disposition.ModificationDate = File.GetLastWriteTime(attachPath);
                            disposition.ReadDate = File.GetLastAccessTime(attachPath);
                        }
                        mailMessage.Attachments.Add(attachment);
                    }
                });

                var rawMessage = new RawMessage();

                using (MemoryStream memoryStream = ConvertMailMessageToMemoryStream(mailMessage))
                {
                    rawMessage.WithData(memoryStream);
                }

                var request = new SendRawEmailRequest();
                request.WithRawMessage(rawMessage);
                request.WithDestinations(toAddresses);
                request.WithSource(fromEmail);
                
                Logger.Debug("Sending mail ...");
                var client = new AmazonSimpleEmailServiceClient("AKIAJWQMXZKTFON2CFDA", "A7wLwHg6Bnu6+eY1rJRc4nE3R0BVPHNObkKPBvSL");
                client.SendRawEmail(request);
                Logger.Debug("Mail sent.");
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "SendRawEmail");
            }
        }

        public static void VerifyEmail(string EmailAddress)
        {
            //Set up the client with your access credentials 
            var client = new AmazonSimpleEmailServiceClient("AKIAJWQMXZKTFON2CFDA", "A7wLwHg6Bnu6+eY1rJRc4nE3R0BVPHNObkKPBvSL");
            var req = new VerifyEmailAddressRequest {EmailAddress = EmailAddress};
            var resp = client.VerifyEmailAddress(req);


            //Note: the VerifyEmailAddress cannot tell you if the email has
            //been verified yet as the verification involves an email being
            //sent to that address and the user clicking on a long random
            //looking Amazon link. That is when the actual verification
            //happens. So nothing to do but wait.


            //What is useful is the RequestId. This should be used in future
            //when querying Amazon in relation to the request.
            //resp.ResponseMetadata.RequestId
        }

        public static MemoryStream ConvertMailMessageToMemoryStream(MailMessage message)
        {
            Assembly assembly = typeof(SmtpClient).Assembly;
            Type mailWriterType = assembly.GetType("System.Net.Mail.MailWriter");
            MemoryStream fileStream = new MemoryStream();
            ConstructorInfo mailWriterContructor = mailWriterType.GetConstructor(BindingFlags.Instance | BindingFlags.NonPublic, null, new[] { typeof(Stream) }, null);
            object mailWriter = mailWriterContructor.Invoke(new object[] { fileStream });
            MethodInfo sendMethod = typeof(MailMessage).GetMethod("Send", BindingFlags.Instance | BindingFlags.NonPublic);

            int paramsCount = sendMethod.GetParameters().Length;

            Logger.Debug("ConvertMailMessageToMemoryStream - sendMethod - params count {0}", paramsCount);

            if(paramsCount == 2)
                sendMethod.Invoke(message, BindingFlags.Instance | BindingFlags.NonPublic, null, new[] { mailWriter, true }, null);
            else
                sendMethod.Invoke(message, BindingFlags.Instance | BindingFlags.NonPublic, null, new[] { mailWriter, true, true }, null);
            MethodInfo closeMethod = mailWriter.GetType().GetMethod("Close", BindingFlags.Instance | BindingFlags.NonPublic);
            closeMethod.Invoke(mailWriter, BindingFlags.Instance | BindingFlags.NonPublic, null, new object[] { }, null);
            return fileStream;
        }
    }
}
