/****** Object:  StoredProcedure [dbo].[DatabaseVersionSelect]    Script Date: 09/12/2011 08:34:19 ******/
DROP PROCEDURE [dbo].[DatabaseVersionSelect]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[DatabaseVersionSelect]
    @DatabaseVersionID int
AS
 BEGIN

    DECLARE @Err int , @Rowcount int

    SELECT
        DatabaseVersionID
        , BuildVersion
        , ScriptFailedName
        , CreatedDate
        , CreatedBy
    FROM
        dbo.DatabaseVersion
    WHERE
        DatabaseVersionID = @DatabaseVersionID

    SELECT @Err = @@ERROR, @Rowcount = @@ROWCOUNT


    RETURN @Err
 END
GO
