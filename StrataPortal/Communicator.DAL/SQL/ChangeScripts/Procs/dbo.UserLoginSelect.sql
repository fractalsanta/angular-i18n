/****** Object:  StoredProcedure [dbo].[UserLoginSelect]    Script Date: 09/12/2011 08:34:19 ******/
DROP PROCEDURE [dbo].[UserLoginSelect]
GO
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
