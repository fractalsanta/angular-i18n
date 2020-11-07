If Not Exists (Select * From rmh.Service where ServiceKey = 1000001)
Begin
	Insert rmh.Service (ServiceName, ServiceKey, ServicePassword, AllAgencies) Values ('REIWA', 1000001, 'xx', 0)
end

If Not Exists (Select * From rmh.Service where ServiceKey = 1000002)
Begin
	Insert rmh.Service (ServiceName, ServiceKey, ServicePassword, AllAgencies) Values ('KPI', 1000002, 'xx', 0)
End


