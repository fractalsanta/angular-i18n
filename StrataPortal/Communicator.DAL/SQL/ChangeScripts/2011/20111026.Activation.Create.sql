
/****** Object:  Table [dbo].[Activation]    Script Date: 10/27/2011 11:23:03 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Activation]') AND type in (N'U'))
 BEGIN
  PRINT 'Activation table already exists, not creating'
 END
ELSE
 BEGIN
	CREATE TABLE [dbo].[Activation]
	(
		[ActivationId] [int] IDENTITY(1000,1) NOT NULL,
		[AgencyApplicationID] [int] NOT NULL,
		[MachineName] [varchar](128) NOT NULL,
		[IsActive] [bit] NOT NULL,
		[Created] [datetime] NOT NULL,
		[Updated] [datetime] NULL,
	 CONSTRAINT [PK_Activation] PRIMARY KEY CLUSTERED 
	 (
		[ActivationId] ASC
	 )
	) 
 END

GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_Activation_AgencyApplication]') AND parent_object_id = OBJECT_ID(N'[dbo].[Activation]'))
 BEGIN
	ALTER TABLE [dbo].[Activation]  WITH CHECK ADD  CONSTRAINT [FK_Activation_AgencyApplication] FOREIGN KEY([AgencyApplicationID])
	REFERENCES [rmh].[AgencyApplication] ([AgencyApplicationID])
 END
GO

ALTER TABLE [dbo].[Activation] CHECK CONSTRAINT [FK_Activation_AgencyApplication]
GO

IF NOT EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_Activation_IsActive]') AND type = 'D')
 BEGIN
	ALTER TABLE [dbo].[Activation] ADD  CONSTRAINT [DF_Activation_IsActive]  DEFAULT ((0)) FOR [IsActive]
 END
GO

IF NOT EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[DF_Activation_Created]') AND type = 'D')
 BEGIN
	ALTER TABLE [dbo].[Activation] ADD  CONSTRAINT [DF_Activation_Created]  DEFAULT (getdate()) FOR [Created]
 END
GO

