
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_UsageStats_UsageActivity]') AND parent_object_id = OBJECT_ID(N'[dbo].[UsageStats]'))
ALTER TABLE [dbo].[UsageStats] DROP CONSTRAINT [FK_UsageStats_UsageActivity]
GO

IF  EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_UsageStats_Created]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[UsageStats] DROP CONSTRAINT [DF_UsageStats_Created]
END

GO

/****** Object:  Table [dbo].[UsageStats]    Script Date: 08/12/2011 08:52:09 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UsageStats]') AND type in (N'U'))
DROP TABLE [dbo].[UsageStats]
GO

