/****** Object:  StoredProcedure [dbo].[UserLoginUpdate]    Script Date: 09/12/2011 08:34:19 ******/
DROP PROCEDURE [dbo].[UserLoginUpdate]
GO
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
