IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[rmh].[AddRequest]') AND type in (N'P', N'PC'))
	DROP PROCEDURE [rmh].[AddRequest]
GO

Create PROCEDURE [rmh].[AddRequest]
	@RequestID UniqueIdentifier,
	@ServiceKey Int,
	@ApplicationKey Int,
	@ApplicationCode nVarchar(2),
	@ServicePassword nVarchar(100), 
	@Request NVarchar(Max)
As

	Declare @AgencyGUID UniqueIdentifier
	Declare @AgencyApplicationID Int
	Declare @ServiceID Int
	Declare @Allowed Bit

	Select @ServiceID = ServiceID, @Allowed = AllAgencies From [rmh].[Service] Where ServiceKey = @ServiceKey And ServicePassword = @ServicePassword

	if @ServiceID Is Null
	Begin
		RaisError ('Invalid service', 10, 1);
		Return -1;
	End

	Select @AgencyGUID = a.AgencyGUID, @AgencyApplicationID = aa.AgencyApplicationID
	From [rmh].[AgencyAccess] a 
		Inner Join [rmh].[AgencyApplication] aa On aa.AgencyAccessID = a.AgencyAccessID And aa.ApplicationCode = @ApplicationCode 
	Where aa.ApplicationKey = @ApplicationKey

	if @AgencyGUID Is Null
	Begin
		RaisError ('Unknown agency', 10, 1);
		Return -2;
	End

	If @Allowed = 0
	Begin
		If (Select Count(*) From [rmh].[ServiceAgencyApplication] Where ServiceID = @ServiceID And AgencyApplicationID = @AgencyApplicationID) > 0
		Begin
			Set @Allowed = 1;
		End Else
		Begin
			Set @Allowed = 0;
		End
	End

	If @Allowed = 1
	Begin
		Insert [rmh].[WebRequest] (RequestID, ServiceID, AgencyGUID, AgencyApplicationID, Request, CurrentStatus, ApplicationKey)
		Values (@RequestID, @ServiceID, @AgencyGUID, @AgencyApplicationID, @Request, 0, @ApplicationKey)
	End

	Return 0

GO


