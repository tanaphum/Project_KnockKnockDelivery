# Project_KnockKnockDelivery

Laravel and Angular

# Laravel
- select backend folder in terminal
- composer install
- Create .env file (can be based on .env.example)
  - php artisan key:generate
- Run Laravel
  - php artisan serve

# Angular
- new terminal
- select frontend folder in terminal
- npm install
- Run App
  - ng serve or ng serve -o

# Start server MySQL on XAMPP
- Create Database name: knock-knock
- In .env file folder backend
  - DB_CONNECTION=mysql
  - DB_HOST=127.0.0.1
  - DB_PORT=3306
  - DB_DATABASE=knock-knock
  - DB_USERNAME=root
  - DB_PASSWORD=
- open terminal backend folder
  - php artisan migrate
  
