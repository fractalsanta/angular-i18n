/****** Object:  StoredProcedure [dbo].[UserLoginInsert]    Script Date: 09/12/2011 08:34:19 ******/
DROP PROCEDURE [dbo].[UserLoginInsert]
GO
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
