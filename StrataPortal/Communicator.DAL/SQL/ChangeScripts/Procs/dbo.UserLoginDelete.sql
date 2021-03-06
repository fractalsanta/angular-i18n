/****** Object:  StoredProcedure [dbo].[UserLoginDelete]    Script Date: 09/12/2011 08:34:19 ******/
DROP PROCEDURE [dbo].[UserLoginDelete]
GO
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
