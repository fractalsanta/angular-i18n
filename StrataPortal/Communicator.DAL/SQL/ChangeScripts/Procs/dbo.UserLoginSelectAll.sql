/****** Object:  StoredProcedure [dbo].[UserLoginSelectAll]    Script Date: 09/12/2011 08:34:19 ******/
DROP PROCEDURE [dbo].[UserLoginSelectAll]
GO
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
