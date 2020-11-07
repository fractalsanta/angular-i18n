
/****** Object:  Table [rmh].[VersionCheck]    Script Date: 08/10/2011 08:53:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [rmh].[VersionCheck](
	[VersionCheckID] [int] IDENTITY(1,1) NOT NULL,
	[ApplicationCode] [nvarchar](2) NOT NULL,
	[MajorVersion] [int] NOT NULL,
	[MinorVersion] [int] NOT NULL,
	[UpdateLocation] [nvarchar](2000) NOT NULL,
 CONSTRAINT [PK_VersionCheck] PRIMARY KEY CLUSTERED 
(
	[VersionCheckID] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)
GO
/****** Object:  Table [dbo].[UserType]    Script Date: 08/10/2011 08:53:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserType](
	[UserTypeId] [int] IDENTITY(1000,1) NOT NULL,
	[Name] [varchar](16) NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
 CONSTRAINT [PK_UserTypeId] PRIMARY KEY CLUSTERED 
(
	[UserTypeId] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)
GO
/****** Object:  Table [dbo].[UsageActivity]    Script Date: 08/10/2011 08:53:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UsageActivity](
	[UsageActivityId] [int] IDENTITY(1000,1) NOT NULL,
	[Activity] [varchar](64) NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
 CONSTRAINT [PK_UsageActivity] PRIMARY KEY CLUSTERED 
(
	[UsageActivityId] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)
GO

/****** Object:  Table [rmh].[Service]    Script Date: 08/10/2011 08:53:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [rmh].[Service](
	[ServiceID] [int] IDENTITY(1,1) NOT NULL,
	[ServiceName] [nvarchar](200) NOT NULL,
	[ServiceKey] [int] NOT NULL,
	[ServicePassword] [nvarchar](100) NOT NULL,
	[AllAgencies] [bit] NOT NULL,
 CONSTRAINT [PK_Service] PRIMARY KEY CLUSTERED 
(
	[ServiceID] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)
GO
/****** Object:  Table [rmh].[RockendAction]    Script Date: 08/10/2011 08:53:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [rmh].[RockendAction](
	[RockendActionID] [int] IDENTITY(1,1) NOT NULL,
	[ActionName] [nvarchar](50) NOT NULL,
	[AssemblyName] [nvarchar](100) NOT NULL,
	[ClassName] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_Action] PRIMARY KEY CLUSTERED 
(
	[RockendActionID] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF),
 CONSTRAINT [UNQ_RockendAction_Name] UNIQUE NONCLUSTERED 
(
	[ActionName] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)
GO
/****** Object:  Table [rmh].[Hits]    Script Date: 08/10/2011 08:53:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [rmh].[Hits](
	[HitID] [int] IDENTITY(1,1) NOT NULL,
	[RequestTime] [datetime] NULL,
	[RequestID] [uniqueidentifier] NULL,
	[ServiceKey] [int] NOT NULL,
	[ApplicationKey] [int] NOT NULL,
	[ActionName] [nvarchar](50) NOT NULL,
	[ResponseTime] [datetime] NULL,
 CONSTRAINT [PK_Hits] PRIMARY KEY CLUSTERED 
(
	[HitID] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)
GO
/****** Object:  Table [rmh].[AgencyAccess]    Script Date: 08/10/2011 08:53:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [rmh].[AgencyAccess](
	[AgencyAccessID] [int] IDENTITY(1,1) NOT NULL,
	[AgencyName] [nvarchar](200) NOT NULL,
	[AgencyGUID] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_AgencyAccess] PRIMARY KEY CLUSTERED 
(
	[AgencyAccessID] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)
GO
/****** Object:  Table [dbo].[AgentContent]    Script Date: 08/10/2011 08:53:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AgentContent](
	[AgentContentId] [int] IDENTITY(1000,1) NOT NULL,
	[AgencyAccessId] [int] NOT NULL,
	[Banner] [image] NULL,
	[TopImage] [image] NULL,
	[MiddleImage] [image] NULL,
	[BottomRightImage] [image] NULL,
	[LoginPageTopText] [varchar](128) NULL,
	[CreatedDate] [datetime] NOT NULL,
	[UpdatedDate] [datetime] NULL,
	[OwnerReportsOn] [bit] NOT NULL,
	[IncExpReportsOn] [bit] NOT NULL,
 CONSTRAINT [PK_AgentContent] PRIMARY KEY NONCLUSTERED 
(
	[AgentContentId] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)
GO
/****** Object:  Table [rmh].[AgencyApplication]    Script Date: 08/10/2011 08:53:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [rmh].[AgencyApplication](
	[AgencyApplicationID] [int] IDENTITY(1,1) NOT NULL,
	[AgencyAccessID] [int] NULL,
	[ApplicationCode] [nvarchar](2) NULL,
	[ApplicationKey] [int] NULL,
	[SerialNumber] [nvarchar](20) NULL,
	[Description] [nvarchar](200) NOT NULL,
 CONSTRAINT [PK_AgencyApplication] PRIMARY KEY CLUSTERED 
(
	[AgencyApplicationID] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)
GO


/****** Object:  Table [dbo].[UserLogin]    Script Date: 08/10/2011 08:53:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserLogin](
	[UserLoginId] [int] IDENTITY(1000,1) NOT NULL,
	[ApplicationKey] [int] NOT NULL,
	[UserTypeId] [int] NOT NULL,
	[OriginalUserId] [int] NULL,
	[FullName] [varchar](128) NOT NULL,
	[UserName] [varchar](64) NOT NULL,
	[Password] [varchar](32) NOT NULL,
	[AccessGranted] [bit] NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[UpdatedDate] [datetime] NULL,
 CONSTRAINT [PK_UserLogin] PRIMARY KEY CLUSTERED 
(
	[UserLoginId] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF),
 CONSTRAINT [UNQ_UserLogin_usernameplus] UNIQUE NONCLUSTERED 
(
	[UserName] ASC,
	[ApplicationKey] ASC,
	[UserTypeId] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)
GO
/****** Object:  Table [dbo].[UsageStats]    Script Date: 08/10/2011 08:53:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UsageStats](
	[UsageStatsId] [int] IDENTITY(1000,1) NOT NULL,
	[UserId] [varchar](64) NULL,
	[UsageActivityId] [int] NOT NULL,
	[Info] [varchar](512) NULL,
	[CreatedDate] [datetime] NOT NULL,
 CONSTRAINT [PK_UsageStats] PRIMARY KEY CLUSTERED 
(
	[UsageStatsId] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)
GO
/****** Object:  Table [rmh].[WebRequest]    Script Date: 08/10/2011 08:53:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [rmh].[WebRequest](
	[RequestID] [uniqueidentifier] NOT NULL,
	[ServiceID] [int] NULL,
	[AgencyGUID] [uniqueidentifier] NOT NULL,
	[AgencyApplicationID] [int] NULL,
	[Request] [nvarchar](max) NULL,
	[RequestTime] [datetime] NULL,
	[CompleteTime] [datetime] NULL,
	[CurrentStatus] [int] NOT NULL,
	[Response] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[RequestID] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)
GO
/****** Object:  Table [rmh].[ServiceAgencyApplication]    Script Date: 08/10/2011 08:53:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [rmh].[ServiceAgencyApplication](
	[ServiceAgencyApplicationID] [int] IDENTITY(1,1) NOT NULL,
	[ServiceID] [int] NOT NULL,
	[AgencyApplicationID] [int] NOT NULL,
 CONSTRAINT [PK_ServiceAgencyApplication] PRIMARY KEY CLUSTERED 
(
	[ServiceAgencyApplicationID] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)
GO



/****** Object:  Default [DF_AgentContent_CreatedDate]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [dbo].[AgentContent] ADD  CONSTRAINT [DF_AgentContent_CreatedDate]  DEFAULT (getdate()) FOR [CreatedDate]
GO
/****** Object:  Default [DF__AgentCont__Owner__59FA5E80]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [dbo].[AgentContent] ADD  DEFAULT ((1)) FOR [OwnerReportsOn]
GO
/****** Object:  Default [DF__AgentCont__IncEx__5AEE82B9]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [dbo].[AgentContent] ADD  DEFAULT ((1)) FOR [IncExpReportsOn]
GO
/****** Object:  Default [DF_UsageStats_Created]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [dbo].[UsageStats] ADD  CONSTRAINT [DF_UsageStats_Created]  DEFAULT (getdate()) FOR [CreatedDate]
GO
/****** Object:  Default [DF_UserLogin_CreatedDate]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [dbo].[UserLogin] ADD  CONSTRAINT [DF_UserLogin_CreatedDate]  DEFAULT (getdate()) FOR [CreatedDate]
GO
/****** Object:  Default [DF_UserType_CreatedDate]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [dbo].[UserType] ADD  CONSTRAINT [DF_UserType_CreatedDate]  DEFAULT (getdate()) FOR [CreatedDate]
GO
/****** Object:  Default [DF_AgencyName]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[AgencyAccess] ADD  CONSTRAINT [DF_AgencyName]  DEFAULT ('') FOR [AgencyName]
GO
/****** Object:  Default [DF_AgencyGUID]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[AgencyAccess] ADD  CONSTRAINT [DF_AgencyGUID]  DEFAULT (newid()) FOR [AgencyGUID]
GO
/****** Object:  Default [DF_AA_AgencyAccessID]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[AgencyApplication] ADD  CONSTRAINT [DF_AA_AgencyAccessID]  DEFAULT ((0)) FOR [AgencyAccessID]
GO
/****** Object:  Default [DF_AA_ApplicationCode]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[AgencyApplication] ADD  CONSTRAINT [DF_AA_ApplicationCode]  DEFAULT ('') FOR [ApplicationCode]
GO
/****** Object:  Default [DF_AA_ApplicationKey]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[AgencyApplication] ADD  CONSTRAINT [DF_AA_ApplicationKey]  DEFAULT ((-1)) FOR [ApplicationKey]
GO
/****** Object:  Default [DF_AA_SerialNumber]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[AgencyApplication] ADD  CONSTRAINT [DF_AA_SerialNumber]  DEFAULT ('') FOR [SerialNumber]
GO
/****** Object:  Default [DF_AADescription]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[AgencyApplication] ADD  CONSTRAINT [DF_AADescription]  DEFAULT ('') FOR [Description]
GO
/****** Object:  Default [DF_Hits_ServiceKey]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[Hits] ADD  CONSTRAINT [DF_Hits_ServiceKey]  DEFAULT ((0)) FOR [ServiceKey]
GO
/****** Object:  Default [DF_Hits_ApplicationKey]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[Hits] ADD  CONSTRAINT [DF_Hits_ApplicationKey]  DEFAULT ((0)) FOR [ApplicationKey]
GO
/****** Object:  Default [DF_Hits_Action]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[Hits] ADD  CONSTRAINT [DF_Hits_Action]  DEFAULT ('') FOR [ActionName]
GO
/****** Object:  Default [DF_A_ActionName]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[RockendAction] ADD  CONSTRAINT [DF_A_ActionName]  DEFAULT ('') FOR [ActionName]
GO
/****** Object:  Default [DF_A_AssemblyName]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[RockendAction] ADD  CONSTRAINT [DF_A_AssemblyName]  DEFAULT ('') FOR [AssemblyName]
GO
/****** Object:  Default [DF_A_ClassName]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[RockendAction] ADD  CONSTRAINT [DF_A_ClassName]  DEFAULT ('') FOR [ClassName]
GO
/****** Object:  Default [DF_ServiceName]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[Service] ADD  CONSTRAINT [DF_ServiceName]  DEFAULT ('') FOR [ServiceName]
GO
/****** Object:  Default [DF_ServiceKey]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[Service] ADD  CONSTRAINT [DF_ServiceKey]  DEFAULT ((0)) FOR [ServiceKey]
GO
/****** Object:  Default [DF_ServicePassword]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[Service] ADD  CONSTRAINT [DF_ServicePassword]  DEFAULT ('') FOR [ServicePassword]
GO
/****** Object:  Default [DF_AllAgencies]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[Service] ADD  CONSTRAINT [DF_AllAgencies]  DEFAULT ((0)) FOR [AllAgencies]
GO
/****** Object:  Default [DF_SAA_ServiceID]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[ServiceAgencyApplication] ADD  CONSTRAINT [DF_SAA_ServiceID]  DEFAULT ((0)) FOR [ServiceID]
GO
/****** Object:  Default [DF_SAA_AgencyApplicationID]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[ServiceAgencyApplication] ADD  CONSTRAINT [DF_SAA_AgencyApplicationID]  DEFAULT ((0)) FOR [AgencyApplicationID]
GO
/****** Object:  Default [DF_VC_ApplicationCode]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[VersionCheck] ADD  CONSTRAINT [DF_VC_ApplicationCode]  DEFAULT ('') FOR [ApplicationCode]
GO
/****** Object:  Default [DF__VersionCh__Major__5441852A]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[VersionCheck] ADD  DEFAULT ((0)) FOR [MajorVersion]
GO
/****** Object:  Default [DF__VersionCh__Minor__5535A963]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[VersionCheck] ADD  DEFAULT ((0)) FOR [MinorVersion]
GO
/****** Object:  Default [DF__VersionCh__Updat__5629CD9C]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[VersionCheck] ADD  DEFAULT ('') FOR [UpdateLocation]
GO
/****** Object:  Default [DF_WR_ServiceID]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[WebRequest] ADD  CONSTRAINT [DF_WR_ServiceID]  DEFAULT ((0)) FOR [ServiceID]
GO
/****** Object:  Default [DF__WebReques__Agenc__2C3393D0]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[WebRequest] ADD  DEFAULT (newid()) FOR [AgencyGUID]
GO
/****** Object:  Default [DF_WR_AgencyApplicationID]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[WebRequest] ADD  CONSTRAINT [DF_WR_AgencyApplicationID]  DEFAULT ((0)) FOR [AgencyApplicationID]
GO
/****** Object:  Default [DF_WR_Request]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[WebRequest] ADD  CONSTRAINT [DF_WR_Request]  DEFAULT ('') FOR [Request]
GO
/****** Object:  Default [DF_WR_RequestTime]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[WebRequest] ADD  CONSTRAINT [DF_WR_RequestTime]  DEFAULT (getdate()) FOR [RequestTime]
GO
/****** Object:  Default [DF__WebReques__Curre__2D27B809]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[WebRequest] ADD  DEFAULT ((0)) FOR [CurrentStatus]
GO
/****** Object:  ForeignKey [FK_UsageStats_UsageActivity]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [dbo].[UsageStats]  WITH CHECK ADD  CONSTRAINT [FK_UsageStats_UsageActivity] FOREIGN KEY([UsageActivityId])
REFERENCES [dbo].[UsageActivity] ([UsageActivityId])
GO
ALTER TABLE [dbo].[UsageStats] CHECK CONSTRAINT [FK_UsageStats_UsageActivity]
GO
/****** Object:  ForeignKey [FK_UserLogin_UserType]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [dbo].[UserLogin]  WITH CHECK ADD  CONSTRAINT [FK_UserLogin_UserType] FOREIGN KEY([UserTypeId])
REFERENCES [dbo].[UserType] ([UserTypeId])
GO
ALTER TABLE [dbo].[UserLogin] CHECK CONSTRAINT [FK_UserLogin_UserType]
GO
/****** Object:  ForeignKey [FK_AgencyApplication_Agency]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[AgencyApplication]  WITH CHECK ADD  CONSTRAINT [FK_AgencyApplication_Agency] FOREIGN KEY([AgencyAccessID])
REFERENCES [rmh].[AgencyAccess] ([AgencyAccessID])
GO
ALTER TABLE [rmh].[AgencyApplication] CHECK CONSTRAINT [FK_AgencyApplication_Agency]
GO
/****** Object:  ForeignKey [FK_ServiceAgencyApp_AgencyApp]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[ServiceAgencyApplication]  WITH CHECK ADD  CONSTRAINT [FK_ServiceAgencyApp_AgencyApp] FOREIGN KEY([AgencyApplicationID])
REFERENCES [rmh].[AgencyApplication] ([AgencyApplicationID])
GO
ALTER TABLE [rmh].[ServiceAgencyApplication] CHECK CONSTRAINT [FK_ServiceAgencyApp_AgencyApp]
GO
/****** Object:  ForeignKey [FK_ServiceAgencyApp_Service]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[ServiceAgencyApplication]  WITH CHECK ADD  CONSTRAINT [FK_ServiceAgencyApp_Service] FOREIGN KEY([ServiceID])
REFERENCES [rmh].[Service] ([ServiceID])
GO
ALTER TABLE [rmh].[ServiceAgencyApplication] CHECK CONSTRAINT [FK_ServiceAgencyApp_Service]
GO
/****** Object:  ForeignKey [FK_WebRequest_AgencyApp]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[WebRequest]  WITH CHECK ADD  CONSTRAINT [FK_WebRequest_AgencyApp] FOREIGN KEY([AgencyApplicationID])
REFERENCES [rmh].[AgencyApplication] ([AgencyApplicationID])
GO
ALTER TABLE [rmh].[WebRequest] CHECK CONSTRAINT [FK_WebRequest_AgencyApp]
GO
/****** Object:  ForeignKey [FK_WebRequest_Service]    Script Date: 08/10/2011 08:53:28 ******/
ALTER TABLE [rmh].[WebRequest]  WITH CHECK ADD  CONSTRAINT [FK_WebRequest_Service] FOREIGN KEY([ServiceID])
REFERENCES [rmh].[Service] ([ServiceID])
GO
ALTER TABLE [rmh].[WebRequest] CHECK CONSTRAINT [FK_WebRequest_Service]
GO
