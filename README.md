# KnockKnockDelivery
Laravel and Angular

# Laravel
- select backend folder in terminal
- composer install
- Create .env file and copy code on .env.example to .env file
  # Connect with AWS MySQL
   - In .env file folder backend
     - DB_CONNECTION=mysql
     - DB_HOST=knockknockdb.ceisn90mxwfd.ap-southeast-1.rds.amazonaws.com
     - DB_PORT=3306
     - DB_DATABASE=knockknock_dev
     - DB_USERNAME=knockknock_db
     - DB_PASSWORD=Passw0rd!   
- php artisan key:generate
- php artisan config:cache
- php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
- php artisan jwt:secret (if jwt not found in .env file)
- Run Laravel
  - php artisan serve

# Angular
- new terminal
- select frontend folder in terminal
- npm install
- Run App
  - ng serve or ng serve -o


  
