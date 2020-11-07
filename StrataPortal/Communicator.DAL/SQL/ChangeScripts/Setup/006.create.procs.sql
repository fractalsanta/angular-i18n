
/****** Object:  StoredProcedure [dbo].[AgentContentUpdate]    Script Date: 08/10/2011 08:53:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
---------------
 
CREATE PROCEDURE [dbo].[AgentContentUpdate]
    @AgentContentId int
    , @AgencyAccessId int
    , @Banner image
    , @TopImage image
    , @MiddleImage image
    , @BottomRightImage image
    , @LoginPageTopText varchar(128)
	, @OwnerReportsOn bit
	, @IncExpReportsOn bit 
AS
 BEGIN

    DECLARE @Err int , @Rowcount int

    UPDATE
        dbo.AgentContent 
    SET 
        AgencyAccessId = @AgencyAccessId
        , Banner = @Banner
        , TopImage = @TopImage
        , MiddleImage = @MiddleImage
        , BottomRightImage = @BottomRightImage
        , LoginPageTopText = @LoginPageTopText
		, OwnerReportsOn = @OwnerReportsOn
		, IncExpReportsOn = @IncExpReportsOn
    WHERE
        AgentContentId = @AgentContentId

    SELECT @Err = @@ERROR, @Rowcount = @@ROWCOUNT


    RETURN @Err
 END
GO
/****** Object:  StoredProcedure [dbo].[AgentContentSelectAll]    Script Date: 08/10/2011 08:53:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[AgentContentSelectAll]
AS
 BEGIN

    DECLARE @Err int , @Rowcount int

    SELECT
        AgentContentId
        , AgencyAccessId
        , Banner
        , TopImage
        , MiddleImage
        , BottomRightImage
        , LoginPageTopText
		, OwnerReportsOn
		, IncExpReportsOn
    FROM
        dbo.AgentContent

    SELECT @Err = @@ERROR, @Rowcount = @@ROWCOUNT


    RETURN @Err
 END
GO
/****** Object:  StoredProcedure [dbo].[AgentContentSelect]    Script Date: 08/10/2011 08:53:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-------------------

CREATE PROCEDURE [dbo].[AgentContentSelect]
    @AgentContentId int
AS
 BEGIN

    DECLARE @Err int , @Rowcount int

    SELECT
        AgentContentId
        , AgencyAccessId
        , Banner
        , TopImage
        , MiddleImage
        , BottomRightImage
        , LoginPageTopText
		, OwnerReportsOn
		, IncExpReportsOn
    FROM
        dbo.AgentContent
    WHERE
        AgentContentId = @AgentContentId

    SELECT @Err = @@ERROR, @Rowcount = @@ROWCOUNT


    RETURN @Err
 END
GO
/****** Object:  StoredProcedure [dbo].[AgentContentInsert]    Script Date: 08/10/2011 08:53:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-----------------

CREATE PROCEDURE [dbo].[AgentContentInsert]
    @AgencyAccessId int
    , @Banner image
    , @TopImage image
    , @MiddleImage image
    , @BottomRightImage image
    , @LoginPageTopText varchar(128)
	, @OwnerReportsOn bit
	, @IncExpReportsOn bit 
AS
 BEGIN

    DECLARE @Err int , @Rowcount int

    INSERT
        dbo.AgentContent
        (
        AgencyAccessId
        , Banner
        , TopImage
        , MiddleImage
        , BottomRightImage
        , LoginPageTopText 
		, OwnerReportsOn
		, IncExpReportsOn
        )
    VALUES
        (
        @AgencyAccessId
        , @Banner
        , @TopImage
        , @MiddleImage
        , @BottomRightImage
        , @LoginPageTopText 
		, @OwnerReportsOn
		, @IncExpReportsOn
        )

    SELECT @Err = @@ERROR, @Rowcount = @@ROWCOUNT

    IF(@Err = 0)
    BEGIN
	    SELECT SCOPE_IDENTITY() as NewVersionNo
    END



    RETURN @Err
 END
GO
/****** Object:  StoredProcedure [dbo].[AgentContentDelete]    Script Date: 08/10/2011 08:53:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[AgentContentDelete]
    @AgentContentId int
AS
 BEGIN

    DECLARE @Err int , @Rowcount int

    -- Phsically Delete the record
    DELETE
        dbo.AgentContent
    WHERE
        AgentContentId = @AgentContentId

    SELECT @Err = @@ERROR, @Rowcount = @@ROWCOUNT


    RETURN @Err
 END
GO

/****** Object:  StoredProcedure [dbo].[UserLoginUpdate]    Script Date: 08/10/2011 08:53:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[UserLoginUpdate]
    @UserLoginId int
    , @AgencyAccessId int
	, @UserTypeId int
    , @OriginalUserId int
    , @FullName varchar(128)
    , @UserName varchar(64)
    , @Password varchar(32)
    , @AccessGranted bit
    , @UpdatedDate datetime
AS
 BEGIN

    DECLARE @Err int , @Rowcount int

    UPDATE
        dbo.UserLogin 
    SET 
        ApplicationKey = @AgencyAccessId
		, UserTypeId = @UserTypeId
        , OriginalUserId = @OriginalUserId
        , FullName = @FullName
        , UserName = @UserName
        , Password = @Password
        , AccessGranted = @AccessGranted
        , UpdatedDate = @UpdatedDate
    WHERE
        UserLoginId = @UserLoginId

    SELECT @Err = @@ERROR, @Rowcount = @@ROWCOUNT


    RETURN @Err
 END
GO
/****** Object:  StoredProcedure [dbo].[UserLoginSelectAll]    Script Date: 08/10/2011 08:53:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[UserLoginSelectAll]
AS
 BEGIN

    DECLARE @Err int , @Rowcount int

    SELECT
        UserLoginId
        , ApplicationKey
		, UserTypeId
        , OriginalUserId
        , FullName
        , UserName
        , [Password]
        , AccessGranted
        , CreatedDate
        , UpdatedDate
    FROM
        dbo.UserLogin

    SELECT @Err = @@ERROR, @Rowcount = @@ROWCOUNT


    RETURN @Err
 END
GO
/****** Object:  StoredProcedure [dbo].[UserLoginSelect]    Script Date: 08/10/2011 08:53:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[UserLoginSelect]
    @UserLoginId int
AS
 BEGIN

    DECLARE @Err int , @Rowcount int

    SELECT
        UserLoginId
        , ApplicationKey
		, UserTypeId
        , OriginalUserId
        , FullName
        , UserName
        , [Password]
        , AccessGranted
        , CreatedDate
        , UpdatedDate
    FROM
        dbo.UserLogin
    WHERE
        UserLoginId = @UserLoginId

    SELECT @Err = @@ERROR, @Rowcount = @@ROWCOUNT


    RETURN @Err
 END
GO
/****** Object:  StoredProcedure [dbo].[UserLoginInsert]    Script Date: 08/10/2011 08:53:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[UserLoginInsert]
    @AgencyAccessId int
	, @UserTypeId int
    , @OriginalUserId int
    , @FullName varchar(128)
    , @UserName varchar(64)
    , @Password varchar(32)
    , @AccessGranted bit
    , @UpdatedDate datetime
AS
 BEGIN

    DECLARE @Err int , @Rowcount int

    -- Set the values of the output variable audit date fields.
    DECLARE @currentTimeStamp datetime
    DECLARE @CreatedDate datetime

    SET @currentTimeStamp = GetDate()
    SET @CreatedDate = @currentTimeStamp

    INSERT
        dbo.UserLogin
        (
        ApplicationKey
		, UserTypeId
        , OriginalUserId
        , FullName
        , UserName
        , [Password]
        , AccessGranted
        , UpdatedDate 
	, CreatedDate
        )
    VALUES
        (
        @AgencyAccessId
		, @UserTypeId
        , @OriginalUserId
        , @FullName
        , @UserName
        , @Password
        , @AccessGranted
        , @UpdatedDate 
	, @CreatedDate
        )

    SELECT @Err = @@ERROR, @Rowcount = @@ROWCOUNT

    IF(@Err = 0)
    BEGIN
	    SELECT SCOPE_IDENTITY() as NewVersionNo
    END



    RETURN @Err
 END
GO
/****** Object:  StoredProcedure [dbo].[UserLoginDelete]    Script Date: 08/10/2011 08:53:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[UserLoginDelete]
    @UserLoginId int
AS
 BEGIN

    DECLARE @Err int , @Rowcount int

    -- Phsically Delete the record
    DELETE
        dbo.UserLogin
    WHERE
        UserLoginId = @UserLoginId

    SELECT @Err = @@ERROR, @Rowcount = @@ROWCOUNT


    RETURN @Err
 END
GO

/****** Object:  StoredProcedure [rmh].[CheckAgencyGUID]    Script Date: 08/10/2011 08:53:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [rmh].[CheckAgencyGUID]
      @AgencyGUID UniqueIdentifier,
      @ApplicationKey int,
      @ApplicationCode nVarchar(2),
      @ApplicationDescription nVarchar(200),
      @SerialNumber nVarchar(20)
AS
      Declare @AgencyAccessID Int
      Declare @AgencyApplicationID Int

      If @ApplicationKey Is Null Or @ApplicationKey = 0 
      Begin
            --  If we have a serial number check for the application using it
            Select @AgencyAccessID = a.AgencyAccessID, @AgencyGUID = a.AgencyGUID, @AgencyApplicationID = aa.AgencyApplicationID 
            From [rmh].[AgencyApplication] aa
                  Inner Join AgencyAccess a On a.AgencyAccessID = aa.AgencyAccessID
            Where aa.SerialNumber = @SerialNumber
      End Else
      Begin
            -- Find details for known application key
            Select @AgencyAccessID = a.AgencyAccessID, @AgencyGUID = a.AgencyGUID, @AgencyApplicationID = aa.AgencyApplicationID 
            From [rmh].[AgencyApplication] aa
                  Inner Join AgencyAccess a On a.AgencyAccessID = aa.AgencyAccessID
            Where aa.ApplicationKey = @ApplicationKey
      End

      if @AgencyGUID Is Not Null And @AgencyAccessID Is Null
      Begin
            Select @AgencyAccessID = AgencyAccessID From [rmh].[AgencyAccess] Where AgencyGUID = @AgencyGUID
      End

      if @AgencyAccessID Is Null
      Begin
            -- Didn't find one so we need to generate a new GUID
            Insert [rmh].[AgencyAccess] (AgencyGUID) Values (NewID())
            Select @AgencyAccessID = SCOPE_IDENTITY()
      End 

      If @AgencyApplicationID Is Null
      Begin
            -- Need to make sure the application is registered for this agency
            If Not Exists(Select * From [rmh].[AgencyApplication] Where ApplicationKey = @ApplicationKey)
            Begin
                  While @ApplicationKey = 0
                  Begin
                        Select @ApplicationKey = 100000 + Convert(Int, Rand() * 899999)

                        If Exists(Select * From AgencyApplication Where ApplicationKey = @ApplicationKey)
                        Begin
                              Select @ApplicationKey = 0
                        End
                  End

                  Insert [rmh].[AgencyApplication] (AgencyAccessID, ApplicationCode, ApplicationKey, SerialNumber, [Description]) Values (@AgencyAccessID, @ApplicationCode, @ApplicationKey, @SerialNumber, @ApplicationDescription)
                  Select @AgencyApplicationID = SCOPE_IDENTITY()
            End
      End 

      Return @AgencyApplicationID
GO
/****** Object:  StoredProcedure [rmh].[AddRequest]    Script Date: 08/10/2011 08:53:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [rmh].[AddRequest]
	@RequestID UniqueIdentifier,
	@ServiceKey Int,
	@ApplicationKey Int,
	@ApplicationCode nVarchar(2),
	@ServicePassword nVarchar(100), 
	@Request NVarchar(Max)
As

	Declare @AgencyGUID UniqueIdentifier
	Declare @AgencyApplicationID Int
	Declare @ServiceID Int
	Declare @Allowed Bit

	Select @ServiceID = ServiceID, @Allowed = AllAgencies From [rmh].[Service] Where ServiceKey = @ServiceKey And ServicePassword = @ServicePassword

	if @ServiceID Is Null
	Begin
		RaisError ('Invalid service', 10, 1);
		Return -1;
	End

	Select @AgencyGUID = a.AgencyGUID, @AgencyApplicationID = aa.AgencyApplicationID
	From [rmh].[AgencyAccess] a 
		Inner Join [rmh].[AgencyApplication] aa On aa.AgencyAccessID = a.AgencyAccessID And aa.ApplicationCode = @ApplicationCode 
	Where aa.ApplicationKey = @ApplicationKey

	if @AgencyGUID Is Null
	Begin
		RaisError ('Unknown agency', 10, 1);
		Return -2;
	End

	If @Allowed = 0
	Begin
		If (Select Count(*) From [rmh].[ServiceAgencyApplication] Where ServiceID = @ServiceID And AgencyApplicationID = @AgencyApplicationID) > 0
		Begin
			Set @Allowed = 1;
		End Else
		Begin
			Set @Allowed = 0;
		End
	End

	If @Allowed = 1
	Begin
		Insert [rmh].[WebRequest] (RequestID, ServiceID, AgencyGUID, AgencyApplicationID, Request, CurrentStatus)
		Values (@RequestID, @ServiceID, @AgencyGUID, @AgencyApplicationID, @Request, 0)
	End

	Return 0
GO
