using System;
using System.Security.Cryptography;
using System.Text;

namespace Rockend.WebAccess.Common.Helpers
{
    public static class RokendTokenHelper
    {
        private static readonly string _alg = "HmacSHA256";
        private static readonly string _salt = "6Q89qAHtU2GYQ4Wnnz6k"; // Generated at https://www.random.org/strings

        public static string GenerateToken(string username, string password, long ticks)
        {
            string hash = string.Join(":", new string[] { username, ticks.ToString() });
            string hashLeft = "";
            string hashRight = "";

            using (HMAC hmac = HMACSHA256.Create(_alg))
            {
                hmac.Key = Encoding.UTF8.GetBytes(GetHashedPassword(password));
                hmac.ComputeHash(Encoding.UTF8.GetBytes(hash));

                hashLeft = Convert.ToBase64String(hmac.Hash);
                hashRight = string.Join(":", new string[] { username, ticks.ToString() });
            }

            return Convert.ToBase64String(Encoding.UTF8.GetBytes(string.Join(":", hashLeft, hashRight)));
        }

        public static string GetHashedPassword(string password)
        {
            string key = string.Join(":", new string[] { password, _salt });

            using (HMAC hmac = HMACSHA256.Create(_alg))
            {
                // Hash the key.
                hmac.Key = Encoding.UTF8.GetBytes(_salt);
                hmac.ComputeHash(Encoding.UTF8.GetBytes(key));

                return Convert.ToBase64String(hmac.Hash);
            }
        }

    }
}