﻿-- =============================================
-- Script Template
-- =============================================
-- Note: This file was originally generated by Genie

/****
    Purpose: 
             Creates ALL records in UserType. i.e. Assumes the table is empty. This isn't really a script which would be added to the build.   
    Notes:   
             Script is created from existing records. 
    Author:       
        Genie

****/


PRINT 'Creating Records in UserType...'

 SET IDENTITY_INSERT UserType ON 


----------------------------------------------------

IF NOT EXISTS ( SELECT * FROM UserType WHERE  UserTypeId = 1000  )
 BEGIN

  PRINT 'Creating record for 1000.'
  INSERT 
	UserType
	( 
        UserTypeId
        , [Name]
        , CreatedDate
	)
  VALUES
	( 
	1000	-- UserTypeId
	, 'Owner'	-- Name
	, '19 May 2011 17:29:32'	-- CreatedDate
	)

 END
ELSE
 BEGIN
	PRINT 'Record already exists so not creating; For - 1000'
 END


 SET IDENTITY_INSERT UserType OFF

 SET IDENTITY_INSERT UserType ON 


----------------------------------------------------

IF NOT EXISTS ( SELECT * FROM UserType WHERE  UserTypeId = 1001  )
 BEGIN

  PRINT 'Creating record for 1001.'
  INSERT 
	UserType
	( 
        UserTypeId
        , [Name]
        , CreatedDate
	)
  VALUES
	( 
	1001	-- UserTypeId
	, 'Tenant'	-- Name
	, '19 May 2011 17:29:35'	-- CreatedDate
	)

 END
ELSE
 BEGIN
	PRINT 'Record already exists so not creating; For - 1001'
 END


 SET IDENTITY_INSERT UserType OFF
