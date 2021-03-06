/****** Object:  StoredProcedure [dbo].[DatabaseVersionDelete]    Script Date: 09/12/2011 08:34:19 ******/
DROP PROCEDURE [dbo].[DatabaseVersionDelete]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[DatabaseVersionDelete]
    @DatabaseVersionID int
AS
 BEGIN

    DECLARE @Err int , @Rowcount int

    DELETE
        DatabaseVersion
    WHERE
        DatabaseVersionID = @DatabaseVersionID

    SELECT @Err = @@ERROR, @Rowcount = @@ROWCOUNT


    RETURN @Err
 END
GO
