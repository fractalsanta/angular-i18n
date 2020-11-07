UPDATE rmh.RockendAction 
SET AssemblyName = 'Rockend.REST.Processor.ForgotPassword2'
WHERE ActionName in ( 'FindUsername' , 'FindEmail' )

-- select * from rmh.RockendAction
