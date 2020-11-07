/****** Object:  StoredProcedure [rmh].[CheckAgencyGUID]    Script Date: 02/27/2012 07:33:01 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[rmh].[CheckAgencyGUID]') AND type in (N'P', N'PC'))
	DROP PROCEDURE [rmh].[CheckAgencyGUID]
GO


CREATE PROCEDURE [rmh].[CheckAgencyGUID]
      @AgencyGUID UniqueIdentifier,
      @ApplicationKey int,
      @ApplicationCode nVarchar(2),
      @ApplicationDescription nVarchar(200),
      @SerialNumber nVarchar(20)
AS
      Declare @AgencyAccessID Int
      Declare @AgencyApplicationID Int

      If @ApplicationKey Is Null Or @ApplicationKey = 0 
      Begin
			if LEN(@SerialNumber) > 0
			Begin
				--  If we have a serial number check for the application using it
				Select @AgencyAccessID = a.AgencyAccessID, @AgencyGUID = a.AgencyGUID, @AgencyApplicationID = aa.AgencyApplicationID 
				From [rmh].[AgencyApplication] aa
					  Inner Join AgencyAccess a On a.AgencyAccessID = aa.AgencyAccessID
				Where aa.SerialNumber = @SerialNumber
            End
      End Else
      Begin
            -- Find details for known application key
            Select @AgencyAccessID = a.AgencyAccessID, @AgencyGUID = a.AgencyGUID, @AgencyApplicationID = aa.AgencyApplicationID 
            From [rmh].[AgencyApplication] aa
                  Inner Join AgencyAccess a On a.AgencyAccessID = aa.AgencyAccessID
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

      Return @AgencyApplicationID

GO


