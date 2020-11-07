using System;
using System.Globalization;
using Agile.Diagnostics.Logging;

namespace Rockend.Common
{

    public static partial class Safe
    {
        public static DateTime DateTime(object value, DateTime defaultValue)
        {
            if (value == null)
                return defaultValue;
            try
            {
                if (value is string)
                {
                    return System.DateTime.Parse(value.ToString());
                }
                if (value is DateTime)
                    return (DateTime) value;
                Logger.Warning("Don't know how to convert Type:{0} to a DateTime", value.GetType().Name);
                return defaultValue;

            }
            catch (Exception ex)
            {
                if(!string.IsNullOrEmpty(value.ToString()))
                    Logger.Info("couldn't convert to a DateTime: {0} [{1}]", value, ex.Message);
                return defaultValue;
            }
        }

        public static DateTimeOffset DateTimeOffset(object value, DateTimeOffset defaultValue)
        {
            if (value == null)
                return defaultValue;
            try
            {
                if (value is string)
                {
                    return System.DateTimeOffset.Parse(value.ToString());
                }
                if (value is DateTime)
                    return new DateTimeOffset((DateTime)value);
                Logger.Warning("Don't know how to convert Type:{0} to a DateTimeOffset", value.GetType().Name);
                return defaultValue;

            }
            catch (Exception ex)
            {
                Logger.Info("couldn't convert to a DateTimeOffset: {0} [{1}]", value, ex.Message);
                return defaultValue;
            }
        }

        public static DateTimeOffset? NullableDateTimeOffset(object value, DateTimeOffset? defaultValue = null)
        {
            if (value == null)
                return defaultValue;
            try
            {
                if (value is string)
                {
                    return System.DateTimeOffset.ParseExact(value.ToString(), "dd/MM/yyyy hh:mm:ss", CultureInfo.InvariantCulture);
                }
                if (value is DateTime)
                    return new DateTimeOffset((DateTime)value);
                Logger.Warning("Don't know how to convert Type:{0} to a DateTimeOffset", value.GetType().Name);
                return defaultValue;

            }
            catch (Exception ex)
            {
                Logger.Info("couldn't convert to a nullable DateTimeOffset: {0} [{1}]", value, ex.Message);
                return defaultValue;
            }
        }

        /// <summary>
        /// Returns the given object as an integer if it can be parsed as an int.
        /// i.e. If the value is null or non-numeric this method will return 0.
        /// </summary>
        public static int Int(object value, int defaultValue = 0)
        {
            if (value == null)
                return defaultValue;

            try
            {
                if (string.IsNullOrEmpty(value.ToString()))
                    return defaultValue;
                return Convert.ToInt32(value);
            }
            catch
            {
                return defaultValue;
            }
        }

        /// <summary>
        /// Returns the given object as a double if it can be parsed as a double.
        /// i.e. If the value is null or non-numeric this method will return 0.0.
        /// </summary>
        public static double Double(object value, double defaultValue = 0.0)
        {
            if (value == null)
                return defaultValue;

            try
            {
                if (string.IsNullOrEmpty(value.ToString()))
                    return defaultValue;
                return Convert.ToDouble(value);
            }
            catch
            {
                return defaultValue;
            }
        }

        /// <summary>
        /// Convert the value to a currency
        /// </summary>
        public static string SafeToCurrency(this object value)
        {
            try
            {
                var valueString = value.ToString();

                if (string.IsNullOrEmpty(valueString))
                    return string.Empty;

                decimal amount;
                if (!decimal.TryParse(valueString, out amount))
                    return string.Empty;

                return string.Format("{0:C}", amount);
            }
            catch
            {
                return string.Format("{0:C}", 0.0);
            }
        }

        /// <summary>
        /// Safely converts the given value to a byte, returning the default value if it cannot convert to byte.
        /// </summary>
        public static byte Byte(object value, byte defaultValue = 0)
        {
            if (value == null)
                return defaultValue;
            try
            {
                return Convert.ToByte(value);
            }
            catch (Exception ex)
            {
                Logger.Error(ex);
                return defaultValue;
            }
        }

        /// <summary>
        /// Returns the given value as T if it is 'safe'.
        /// i.e. If the value is null or not castable to T
        /// this method will return null.
        /// </summary>
        public static T? Nullable<T>(object value) where T : struct
        {
            if (value == null)
                return null;

            try
            {
                if (value.GetType().Name == "DBNull")
                    return null;
                return (T)value;
            }
            catch
            {
                return null;
            }
        }



        /// <summary>
        /// If the value is null this method will return an empty string
        /// OR if it 'is a string' then it returns the value
        /// OTHERWISE it returns the objects .ToString method.
        /// </summary>
        /// <param name="value">The value to return if it is a safe string.</param>
        /// <returns>string.Empty if the value is not safe, otherwise the value as an string.</returns>
        public static string String(object value)
        {
            if (value == null)
                return string.Empty;
            if (value is string)
                return (string)value;

            return value.ToString();
        }

        public static bool Bool(object value, bool defaultValue = false)
        {
            if (value == null)
                return defaultValue;

            var s = value.ToString().ToLower();

            return (s.Equals("t")
                    || s.Equals("true")
                    || s.Equals("y")
                    || s.Equals("yes")
                    || s.Equals("1"));
        }

        /// <summary>
        /// If value is a valid guid it gets returned as a guid,
        /// OTHERWISE it returns Guid.Empty
        /// </summary>
        public static Guid Guid(object value)
        {
            try
            {
                // 32 contiguous digits is the minimum (my understanding of it...)
                if (value == null || value.ToString().Length < 32)
                    return System.Guid.Empty;

                return new Guid(String(value));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.Message);
                return System.Guid.Empty;
            }
        }
    }
}