If Not Exists (Select * From rmh.Service Where ServiceKey = 2000002)
Begin
	Insert rmh.Service (ServiceName, ServiceKey, ServicePassword, AllAgencies) Values ('Strata Mobile',2000002, 'T7@411', 0)
End