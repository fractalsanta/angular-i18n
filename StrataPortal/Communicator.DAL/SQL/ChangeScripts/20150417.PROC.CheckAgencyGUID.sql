/*
UAT: run 17.04.2015
PROD:
SUPPORT: run 18.05.2015

This should be released with the RWAC version 5168
*/


DROP PROCEDURE [rmh].[CheckAgencyGUID]
GO

/****** Object:  StoredProcedure [rmh].[CheckAgencyGUID]    Script Date: 17/04/2015 12:57:13 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [rmh].[CheckAgencyGUID]
      @AgencyGUID UniqueIdentifier,
      @ApplicationKey int,
      @ApplicationCode nVarchar(2),
      @ApplicationDescription nVarchar(200),
      @SerialNumber nVarchar(20),
	  @Version int = 0
AS
      Declare @AgencyAccessID Int
      Declare @AgencyApplicationID Int

      If @ApplicationKey Is Null Or @ApplicationKey = 0 
       Begin
			IF LEN(@SerialNumber) > 0
			 BEGIN -- REST
					--  If we have a serial number check for the application using it
					Select @AgencyAccessID = a.AgencyAccessID, @AgencyGUID = a.AgencyGUID, @AgencyApplicationID = aa.AgencyApplicationID 
					From [rmh].[AgencyApplication] aa
						  Inner Join rmh.AgencyAccess a On a.AgencyAccessID = aa.AgencyAccessID
					Where aa.SerialNumber = @SerialNumber -- no need to filter on applicationCode as SM apps never have serial numbers
             END
			ELSE
			 BEGIN -- STRATA
				--  If we have a GUID check for the application using it
				-- only if there is only one AppKey for the GUID and 'SM'
				IF((Select Count(*) From [rmh].[AgencyApplication] aa 
					Inner Join rmh.AgencyAccess a On a.AgencyAccessID = aa.AgencyAccessID
					WHERE a.AgencyGUID = @AgencyGUID AND aa.ApplicationCode = 'SM') = 1)
 				 BEGIN -- There is only one AppKey so ok to use and return it
					Select 
						@AgencyAccessID = a.AgencyAccessID, @AgencyApplicationID = aa.AgencyApplicationID 
					From 
						[rmh].[AgencyApplication] aa
					Inner Join 
						rmh.AgencyAccess a On a.AgencyAccessID = aa.AgencyAccessID
					WHERE 
						a.AgencyGUID = @AgencyGUID AND aa.ApplicationCode = 'SM'
				 END
			 END

       End Else

      Begin
            -- Find details for known application key
            Select @AgencyAccessID = a.AgencyAccessID, @AgencyGUID = a.AgencyGUID, @AgencyApplicationID = aa.AgencyApplicationID 
            From [rmh].[AgencyApplication] aa
                  Inner Join rmh.AgencyAccess a On a.AgencyAccessID = aa.AgencyAccessID
            Where aa.ApplicationKey = @ApplicationKey
      End

      if @AgencyGUID Is Not Null And @AgencyAccessID Is Null
      Begin
            Select @AgencyAccessID = AgencyAccessID From [rmh].[AgencyAccess] Where AgencyGUID = @AgencyGUID
      End

      if @AgencyAccessID Is Null
      Begin
            -- Didn't find one so we need to generate a new GUID
            Insert [rmh].[AgencyAccess] (AgencyGUID) Values (NewID())
            Select @AgencyAccessID = SCOPE_IDENTITY()
      End 

      If @AgencyApplicationID Is Null
      Begin
            -- Need to make sure the application is registered for this agency
            If Not Exists(Select * From [rmh].[AgencyApplication] Where ApplicationKey = @ApplicationKey)
            Begin
                  While @ApplicationKey = 0
                  Begin
                        Select @ApplicationKey = 100000 + Convert(Int, Rand() * 899999)

                        If Exists(Select * From AgencyApplication Where ApplicationKey = @ApplicationKey)
                        Begin
                              Select @ApplicationKey = 0
                        End
                  End

                  Insert [rmh].[AgencyApplication] (AgencyAccessID, ApplicationCode, ApplicationKey, SerialNumber, [Description]) Values (@AgencyAccessID, @ApplicationCode, @ApplicationKey, @SerialNumber, @ApplicationDescription)
                  Select @AgencyApplicationID = SCOPE_IDENTITY()
            End
      End 

	  -- Set/update the application version number
	  Update [rmh].[AgencyApplication] Set Version = @Version, [Description] = @ApplicationDescription Where AgencyApplicationID = @AgencyApplicationID

      Return @AgencyApplicationID






GO


