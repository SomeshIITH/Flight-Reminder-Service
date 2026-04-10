FRONTEND  - MIDDLE-END - BACKEND

- We need an intermediate layer between the client side and the microservices
- Using this middle end, when client sends request we will be able to make decision that which microservice
should actually respond to this request
- We can do message validation, response transformation, rate limiting
- We try to prepare an API Gateway that acts as this middle end.

- morgan package is used gor logs mechanism

### Script for auto scaling in lauch template

    #!/bin/bash
    exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1
    cd /home/ubuntu/
    sudo apt update -y
    sudo apt install nodejs -y
    sudo apt install npm -y
    mkdir -p /home/ubuntu/.ssh
    ssh-keyscan -t rsa github.com > /home/ubuntu/.ssh/known_hosts
    git clone https://github.com/SomeshIITH/APIGATEWAYSERVICE.git
    cd API_Gateway
    sudo npm install
    # start the app
    sudo npx pm2 start index.js 

    