/****** Object:  StoredProcedure [dbo].[DatabaseVersionScriptsRunSelect]    Script Date: 09/12/2011 08:34:19 ******/
DROP PROCEDURE [dbo].[DatabaseVersionScriptsRunSelect]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[DatabaseVersionScriptsRunSelect]
    @DatabaseVersionScriptsRunID int
AS
 BEGIN

    DECLARE @Err int , @Rowcount int

    SELECT
        DatabaseVersionScriptsRunID
        , DatabaseVersionID
        , ScriptName
        , CreatedDate
        , CreatedBy
    FROM
        dbo.DatabaseVersionScriptsRun
    WHERE
        DatabaseVersionScriptsRunID = @DatabaseVersionScriptsRunID

    SELECT @Err = @@ERROR, @Rowcount = @@ROWCOUNT


    RETURN @Err
 END
GO
