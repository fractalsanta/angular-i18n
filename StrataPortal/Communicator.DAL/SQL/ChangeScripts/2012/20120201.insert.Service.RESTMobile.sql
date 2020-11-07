

SET IDENTITY_INSERT rmh.[Service] ON 


IF NOT EXISTS ( SELECT * FROM rmh.Service WHERE ServiceId=2 )
 BEGIN
 
PRINT 'Creating REST Mobile Record...'

INSERT INTO [rmh].[Service]
           ( ServiceId 
           , [ServiceName]
           , [ServiceKey]
           , [ServicePassword]
           , [AllAgencies] )
     VALUES
			( 2
           , 'REST Mobile'
           , 2000001
           , 'E4#172'
           , 0 )
 END
ELSE
 BEGIN
	PRINT 'Record already exists  - REST Mobile'
 END
 
 
SET IDENTITY_INSERT rmh.[Service] OFF 


