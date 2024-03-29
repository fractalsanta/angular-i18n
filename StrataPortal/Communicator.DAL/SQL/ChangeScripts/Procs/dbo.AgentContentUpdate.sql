/****** Object:  StoredProcedure [dbo].[AgentContentUpdate]    Script Date: 09/12/2011 08:34:19 ******/
DROP PROCEDURE [dbo].[AgentContentUpdate]
GO
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
