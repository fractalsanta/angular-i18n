if Not Exists(Select * From rmh.Service Where ServiceKey = 2000002)
Begin
	Insert rmh.Service (ServiceName, ServiceKey, ServicePassword, AllAgencies) Values ('Strata Mobile', 2000002, 'T7@411', 0)
End

Declare @ServiceId Int
Set @ServiceId = (Select ServiceId From rmh.Service Where ServiceKey = 2000002)
Declare @Id Int
Set @Id = (Select AgencyApplicationId From rmh.AgencyApplication Where ApplicationKey = 799187 And ApplicationCode = 'sm')

if (@Id Is Not Null)
Begin
	If Not Exists(Select * From rmh.ServiceAgencyApplication Where AgencyApplicationId = @Id)
	Begin
		Insert rmh.ServiceAgencyApplication (ServiceId, AgencyApplicationId, IsActive) Values (@ServiceId, @Id, 1)
	End
End

