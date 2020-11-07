using System;
using System.Configuration;
using System.IO;
using System.Text;

namespace Rockend.WebAccess.Common
{
    public enum LoggingLevel
    {
        /// <summary>
        /// Only log Error message types; Value = 1
        /// </summary>
        ErrorsOnly = 1, 
        /// <summary>
        /// Log Error and Important message types; Value = 2
        /// </summary>
        Important = 2, 
        /// <summary>
        /// Log Error, Important and Information message types; Value = 3
        /// </summary>
        Standard = 3, 
        /// <summary>
        /// Log all message types; Value = 4
        /// </summary>
        Full = 4,
    }

    public enum LogMessageType
    {
        /// <summary>
        /// Errors will always be logged
        /// </summary>
        Error,
        /// <summary>
        /// Log when Logger.Level is Minimal, Standard or Full
        /// </summary>
        Important,
        /// <summary>
        /// Log when Logger.Level is Standard or Full 
        /// </summary>
        Information,
        /// <summary>
        /// Log only when Logger.Level is Full
        /// </summary>
        Tracking,
    }

    public class LogNotWrittenException : Exception
    {
        public LogNotWrittenException() : base() { }
        public LogNotWrittenException(string message) : base(message) { }
        public LogNotWrittenException(string message, Exception inner) : base(message, inner) { }
    }

    /// <summary>
    /// Allows the logging of messages 
    /// </summary>
    public sealed class Logger
    {
        private static Logger instance = new Logger();

        public static Logger Instance
        {
            get
            {
                return instance;
            }
        }

        #region Constant values
        public const string DefaultLogFileName = "Rockend.log";
        public const string DefaultLogFilePath = @".\";
        #endregion

        #region Private data
        /// <summary>
        /// The name of the log file
        /// </summary>
        private string logFileName = String.Empty;

        /// <summary>
        /// The path to the log file
        /// </summary>
        private string logFilePath = String.Empty;
        private object locker = new object();
        #endregion

        #region Properties
        /// <summary>
        /// Returns the path and name of the log file
        /// </summary>
        public string LogFile
        {
            get
            {
                return Path.GetFullPath(logFilePath) + "\\" + logFileName;
            }
        }

        /// <summary>
        /// Defines the type of messages that will be stored into the log
        /// see <see cref="LoggingLevel"/> enum for details
        /// </summary>
        public LoggingLevel MessageLevel { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        ///  Creates a logger using the log file name, path and level from settings in the 
        ///  appSettings section of the configuration file the settings are LogFileName, LogFilePath, LogLevel
        ///  The value for LogLevel should be a number which related to the <see cref="LoggingLevel"/> enum:
        ///  1 - ErrorsOnly, 2 - Important, 3 - Standard, 4 - Full
        /// </summary>
        public Logger()
        {
            int logLevelInt = ConfigHelper.GetIntValue("LogLevel", 2);
            LoggingLevel logLevel = (LoggingLevel)logLevelInt;

            string logFile = ConfigurationManager.AppSettings["LogFileName"];
            if (logFile == null || logFile.Length == 0)
                logFile = DefaultLogFileName;

            string logPath = ConfigurationManager.AppSettings["LogFilePath"];
            if (logPath == null || logPath.Length == 0)
                logPath = DefaultLogFilePath;

            this.logFilePath = logPath;
            this.logFileName = logFile;
            this.MessageLevel = logLevel;

            // Ensure that the log file path exists
            if (!Directory.Exists(logFilePath))
                Directory.CreateDirectory(logFilePath);
        }

        /// <summary>
        ///  Creates a logger which will store Error and Important messages into a file named
        ///  Rockend.log in the directory specified by the <paramref name="path"/>
        /// </summary>
        /// <param name="path">The directorty in which to store the log file</param>
        public Logger(string path) : this(path, "Rockend.log", LoggingLevel.Important) { }

        /// <summary>
        ///  Creates a logger which will store Error and Important messages into a file named <paramref name="fileName"/>
        ///  in the directory specified by the <paramref name="path"/>
        /// </summary>
        /// <param name="path">The directorty in which to store the log file</param>
        /// <param name="fileName">The name of the file into which messages should be logged</param>
        public Logger(string path, string fileName) : this(path, fileName, LoggingLevel.Important) { }

        /// <summary>
        /// Creates a logger which stores messages of type indicated by <paramref name="level"/>
        /// to a file named Rockend.log in the current application directory
        /// </summary>
        /// <param name="level">The level of messages (<see cref="LoggingLevel"/> that should be logged </param>
        public Logger(LoggingLevel level) : this(@".\", "Rockend.log", level) { }

        /// <summary>
        /// Creates a logger which stores messages of type indicated by <paramref name="level"/>
        /// to a file named Rockend.log in the directory specified by <paramref name="path"/>
        /// </summary>
        /// <param name="path">The directorty in which to store the log file</param>
        /// <param name="level">The level of messages (<see cref="LoggingLevel"/> that should be logged </param>
        public Logger(string path, LoggingLevel level) : this(path, "Rockend.log", level) { }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="path">The directorty in which to store the log file</param>
        /// <param name="fileName">The name of the file into which messages should be logged</param>
        /// <param name="level">The level of messages (<see cref="LoggingLevel"/> that should be logged </param>
        public Logger(string path, string fileName, LoggingLevel level)
        {
            this.logFilePath = path;
            this.logFileName = fileName;
            this.MessageLevel = level;
        }
        #endregion

        #region Private methods
        /// <summary>
        /// Returns true if the message should be written to the log based on the current logging level
        /// </summary>
        /// <param name="type">Message type</param>
        /// <returns>true if message should be written</returns>
        private bool IsLevelLogged(LogMessageType type)
        {
            bool logError = false;

            switch (type)
            {
                case LogMessageType.Error:
                    logError = true;
                    break;

                case LogMessageType.Important:
                    logError = MessageLevel != LoggingLevel.ErrorsOnly;
                    break;

                case LogMessageType.Information:
                    logError = (MessageLevel == LoggingLevel.Full || MessageLevel == LoggingLevel.Standard);
                    break;

                case LogMessageType.Tracking:
                    logError = (MessageLevel == LoggingLevel.Full);
                    break;
            }

            return logError;
        }

        /// <summary>
        /// Write an entry to the windows event log
        /// </summary>
        /// <param name="type">The message type being logged</param>
        /// <param name="content">The message to log</param>
        private void LogMessageToFile(LogMessageType type, string content)
        {
            try
            {
                lock (locker)
                {
                    using (StreamWriter writer = new StreamWriter(LogFile, true))
                    {
                        writer.WriteLine(DateTime.Now + "\t" + type.ToString() + "\t" + content);
                        writer.Flush();
                        writer.Close();
                    }
                }
            }
            catch (Exception ex)
            {
                throw new LogNotWrittenException("Error writting to log file", ex);
            }
        }
        #endregion

        #region Public methods
        /// <summary>
        /// Writes a messages to the log file with the assumed level of important
        /// </summary>
        /// <param name="content">The text to write to the log</param>
        /// <returns></returns>
        public bool WriteMessage(string content)
        {
            return WriteMessage(LogMessageType.Important, content);
        }

        /// <summary>
        /// Writes a message to the log file
        /// </summary>
        /// <param name="type"><see cref="LogMessageType"/> message type</param>
        /// <param name="content">The message to write to the log file</param>
        /// <returns></returns>
        public bool WriteMessage(LogMessageType type, string content)
        {
            bool result = true;

            try
            {
                result = IsLevelLogged(type);

                if (result)
                {
                    LogMessageToFile(type, content);
                }

            }
            catch (LogNotWrittenException ex)
            {
                // Only throw the exception if we are in tracking mode otherwise ignore it (Not sure about this idea!)
                if (this.MessageLevel == LoggingLevel.Full)
                    throw ex.InnerException;
            }

            return result;
        }

        /// <summary>
        /// Writes an exception as an error to the log file, also includes inner exception details if found
        /// </summary>
        /// <param name="ex">The exception to be logged</param>
        /// <returns>True if the error was logged</returns>
        public bool WriteException(Exception ex)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("Exception: " + ex.Message);

            if (ex.InnerException != null)
                sb.AppendLine("Inner Exception: " + ex.InnerException.Message);;

            sb.AppendLine(ex.StackTrace);

            return WriteMessage(LogMessageType.Error, sb.ToString());
        }
        #endregion
    }
}
