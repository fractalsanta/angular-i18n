/****** Object:  StoredProcedure [dbo].[AgentContentInsert]    Script Date: 09/12/2011 08:34:19 ******/
DROP PROCEDURE [dbo].[AgentContentInsert]
GO
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
