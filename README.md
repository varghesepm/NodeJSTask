# Simple NodeJS app to upload,download and delete the files with API endpoints.

### PART 1. Lets code
---------------------------

1. Upload a file

- Upload any files using cURL command as below
>> curl -i -X POST -F files=@small_car.png http://hostname/upload

- It will upload the files to a mySql databse

2. Download a file

>> curl -O http://hostname/download/test.jpg

3. Delete a file

>> curl http://hostname/delete/test.jpg

- will delete the files from both datanse and disk 


### PART 2. Lets deploy
----------------------------

- Created a ansible play book to deploy the application.
- Playbook will spin up two docker conatiners for NodeJS appliccation and MySql db. 
- The application is server via the webserver Nginx which is installed on the same NodeJS conatiner as it will server via 80:3000 portforwarding.

###### Run the playbook as

>> ansible-playbook ansible/sites.yml


