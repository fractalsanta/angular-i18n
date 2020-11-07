

IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_Logging_Created]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[Logging] DROP CONSTRAINT [DF_Logging_Created]
END

GO

/****** Object:  Table [dbo].[Logging]    Script Date: 09/26/2011 08:54:44 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Logging]') AND type in (N'U'))
DROP TABLE [dbo].[Logging]
GO

/****** Object:  Table [dbo].[Logging]    Script Date: 09/26/2011 08:54:44 ******/
CREATE TABLE [dbo].[Logging](
	[LogId] [int] IDENTITY(1000,1) NOT NULL,
	[Created] [datetime] NOT NULL default getdate(),
	[Message] [varchar](1024) NOT NULL,
	[LogLevel] [varchar](16) NOT NULL,
	[LogCategory] [varchar](32) NULL,
 CONSTRAINT [PK_Logging] PRIMARY KEY CLUSTERED 
(
	[LogId] ASC
)
)

GO

