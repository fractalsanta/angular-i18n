
-- first increase the message field size
ALTER TABLE Logging
	ALTER COLUMN [Message] varchar(4096) not null
	
	
-- then add a new column if it doesn't exist
IF NOT EXISTS(SELECT * FROM sys.columns WHERE name = N'Key' 
	AND Object_ID = Object_ID(N'Logging'))
	BEGIN
		PRINT 'creating Key column on Logging'	
		ALTER TABLE Logging
			ADD [Key] varchar(64) null
	END
ELSE
	PRINT 'Key already exists on Logging'

GO

	/****** Object:  Index [IX_Logging_Key]    Script Date: 10/14/2011 10:58:13 ******/
CREATE NONCLUSTERED INDEX [IX_Logging_Key] ON [dbo].[Logging] 
(
	[Key] ASC
)
GO
