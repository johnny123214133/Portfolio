import os
import sys
import pymysql

mysql_credentials = {
	'host' : os.environ.get('MYSQL_HOST'),
	'user' : os.environ.get('MYSQL_USER'),
	'password' : os.environ.get('MYSQL_PASSWORD'),
	'database' : os.environ.get('MYSQL_DB')
}

def execute_commands(): 
	# To connect MySQL database 
	conn = pymysql.connect( 
		host=mysql_credentials['host'], 
		user=mysql_credentials['user'],  
		password=mysql_credentials['password'], 
		db=mysql_credentials['database'], 
	) 
	
	cur = conn.cursor()
	
	try:
		create_tables_directory = os.path.join('.', f'{command}_tables')
		for _,_,files in os.walk(create_tables_directory):
			for filename in files:
				with open(os.path.join(create_tables_directory, filename), 'r') as f:
					statement = f.read()
					cur.execute(statement)
	except:
		print('Something went wrong, please contact repository owner.')
	finally:
		conn.close() 

if __name__ == "__main__":
	if len(sys.argv) != 2 or sys.argv[1] not in ['create', 'delete']:
		print('Must include command \"create\" or \"delete\"')
	else:
		command = sys.argv[1]
		print('started')
		# execute_commands()
		print('finished')

