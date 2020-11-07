
/****** Object:  Table [dbo].[DataDictionary]    Script Date: 08/26/2011 11:14:34 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO
IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_DD_Dictionary]') AND type = 'D')
	BEGIN
		PRINT 'DataDictionary already exists, no need to create'
	END

ELSE
	BEGIN
		CREATE TABLE [dbo].[DataDictionary](
			[DataDictionaryID] [int] IDENTITY(1,1) NOT NULL,
			[Version] [int] NOT NULL,
			[Dictionary] [text] NOT NULL,
			[tStamp] [timestamp] NOT NULL,
			
		 CONSTRAINT [PK_DD] PRIMARY KEY CLUSTERED 
		(
			[DataDictionaryID] ASC
		)
		)
		
		ALTER TABLE [dbo].[DataDictionary] ADD  CONSTRAINT [DF_DD_Version]  DEFAULT ((0)) FOR [Version]
		ALTER TABLE [dbo].[DataDictionary] ADD  CONSTRAINT [DF_DD_Dictionary]  DEFAULT ('') FOR [Dictionary]

		CREATE NONCLUSTERED INDEX [IX_DD_Version] ON [dbo].[DataDictionary] 
		(
			[Version] ASC
		)

	END
	




