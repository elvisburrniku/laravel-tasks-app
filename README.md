### Laravel Task Manager

#### Setup Instructions

1. **Clone the repository**
   ```sh
   git clone https://github.com/your-repo/laravel-task-manager.git
   cd laravel-task-manager
   ```

2. **Install Dependencies**
   ```sh
   composer install
   npm install
   ```

3. **Set up Environment**
   ```sh
   cp .env.example .env
   php artisan key:generate
   ```
   Update `.env` with your database details.

4. **Run Migrations**
   ```sh
   php artisan migrate --seed
   ```

5. **Serve the Application**
   ```sh
   php artisan serve
   ```

#### Features
- Create, Edit, and Delete Projects
- Create, Edit, and Delete Tasks
- Drag-and-Drop Task Reordering (Auto-Priority Update)
- Project Assignment for Tasks
- Tasks are stored in MySQL
- Projects are stored in MySQL

#### Technologies Used
- Laravel 12
- MySQL
- Vue.js 3 (for frontend interactions)
- Tailwind CSS

#### Routes
- `GET /tasks` - View tasks
- `POST /tasks` - Create task
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task
- `POST /tasks/reorder` - Update task order
- `GET /projects` - View projects
- `POST /projects` - Create project
- `PUT /projects/{id}` - Update project
- `DELETE /projects/{id}` - Delete project
- `POST /projects/reorder` - Update project order

For any issues, feel free to reach out!
