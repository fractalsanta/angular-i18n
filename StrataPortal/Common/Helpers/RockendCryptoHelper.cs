using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using Agile.Diagnostics.Logging;

namespace Rockend.WebAccess.Common.Helpers
{
    /// <summary>
    /// taken from http://stackoverflow.com/questions/1905246/how-to-encrypt-decrypt-an-xml-file
    /// </summary>
    public class RockendCryptoHelper
    {
        #region Constructor
        public RockendCryptoHelper(string password, string salt = null)
        {
            byte[] passwordBytes = Encoding.UTF8.GetBytes(password);
            byte[] saltValueBytes = Encoding.UTF8.GetBytes(salt ?? SaltValue);

            _DeriveBytes = new Rfc2898DeriveBytes(passwordBytes, saltValueBytes, PasswordIterations);
            _InitVectorBytes = Encoding.UTF8.GetBytes(InitVector);
            _KeyBytes = _DeriveBytes.GetBytes(32);
        }
        #endregion

        #region Private Fields
        private readonly Rfc2898DeriveBytes _DeriveBytes;
        private readonly byte[] _InitVectorBytes;
        private readonly byte[] _KeyBytes;
        #endregion

        private static readonly string InitVector = "T=A4rAzu94ez-dra";
        private static readonly int PasswordIterations = 1000; //2;
        private static readonly string SaltValue = "d=?ustAF=UstenAr3B@pRu8=ner5sW&h59_Xe9P2za-eFr2fa&ePHE@ras!a+uc@";

        public string Decrypt(string encryptedText)
        {
            byte[] encryptedTextBytes = Convert.FromBase64String(encryptedText);
            string plainText;

            RijndaelManaged rijndaelManaged = new RijndaelManaged { Mode = CipherMode.CBC };

            try
            {
                using (ICryptoTransform decryptor = rijndaelManaged.CreateDecryptor(_KeyBytes, _InitVectorBytes))
                {
                    using (MemoryStream memoryStream = new MemoryStream(encryptedTextBytes))
                    {
                        using (CryptoStream cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read))
                        {
                            //TODO: Need to look into this more. Assuming encrypted text is longer than plain but there is probably a better way
                            byte[] plainTextBytes = new byte[encryptedTextBytes.Length];

                            int decryptedByteCount = cryptoStream.Read(plainTextBytes, 0, plainTextBytes.Length);
                            plainText = Encoding.UTF8.GetString(plainTextBytes, 0, decryptedByteCount);
                        }
                    }
                }
            }
            catch (CryptographicException ex)
            {
                Logger.Error(ex);
                plainText = string.Empty; // Assume the error is caused by an invalid password
            }

            return plainText;
        }

        public string Encrypt(string plainText)
        {
            string encryptedText;
            byte[] plainTextBytes = Encoding.UTF8.GetBytes(plainText);

            RijndaelManaged rijndaelManaged = new RijndaelManaged { Mode = CipherMode.CBC };

            using (ICryptoTransform encryptor = rijndaelManaged.CreateEncryptor(_KeyBytes, _InitVectorBytes))
            {
                using (MemoryStream memoryStream = new MemoryStream())
                {
                    using (CryptoStream cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write))
                    {
                        cryptoStream.Write(plainTextBytes, 0, plainTextBytes.Length);
                        cryptoStream.FlushFinalBlock();

                        byte[] cipherTextBytes = memoryStream.ToArray();
                        encryptedText = Convert.ToBase64String(cipherTextBytes);
                    }
                }
            }

            return encryptedText;
        }

    }
}