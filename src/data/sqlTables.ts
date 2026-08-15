export interface SqlTable {
  name: string;
  columns: { name: string; type: string }[];
  rows: Record<string, any>[];
}

export const SQL_DATABASE: Record<string, SqlTable> = {
  users: {
    name: 'users',
    columns: [
      { name: 'id', type: 'INTEGER' },
      { name: 'name', type: 'VARCHAR' },
      { name: 'role', type: 'VARCHAR' },
      { name: 'department_id', type: 'INTEGER' },
      { name: 'salary', type: 'INTEGER' },
      { name: 'active', type: 'BOOLEAN' },
    ],
    rows: [
      { id: 1, name: 'Alice Chen', role: 'Engineer', department_id: 10, salary: 120000, active: true },
      { id: 2, name: 'Bob Smith', role: 'Designer', department_id: 20, salary: 95000, active: true },
      { id: 3, name: 'Charlie Kim', role: 'Engineer', department_id: 10, salary: 140000, active: false },
      { id: 4, name: 'Diana Prince', role: 'Manager', department_id: 10, salary: 160000, active: true },
      { id: 5, name: 'Ethan Hunt', role: 'DevOps', department_id: 30, salary: 110000, active: true },
      { id: 6, name: 'Fiona Gallagher', role: 'Designer', department_id: 20, salary: 102000, active: false },
    ],
  },
  departments: {
    name: 'departments',
    columns: [
      { name: 'id', type: 'INTEGER' },
      { name: 'dept_name', type: 'VARCHAR' },
      { name: 'location', type: 'VARCHAR' },
    ],
    rows: [
      { id: 10, dept_name: 'Engineering', location: 'Floor 4' },
      { id: 20, dept_name: 'Design', location: 'Floor 2' },
      { id: 30, dept_name: 'Infrastructure', location: 'Floor 3' },
      { id: 40, dept_name: 'Marketing', location: 'Floor 1' },
    ],
  },
  products: {
    name: 'products',
    columns: [
      { name: 'id', type: 'INTEGER' },
      { name: 'name', type: 'VARCHAR' },
      { name: 'category', type: 'VARCHAR' },
      { name: 'price', type: 'NUMERIC' },
      { name: 'stock', type: 'INTEGER' },
    ],
    rows: [
      { id: 101, name: 'Mechanical Keyboard', category: 'Hardware', price: 149.99, stock: 45 },
      { id: 102, name: 'Ergonomic Mouse', category: 'Hardware', price: 79.99, stock: 80 },
      { id: 103, name: '4K Monitor', category: 'Hardware', price: 399.00, stock: 12 },
      { id: 104, name: 'Code IDE Pro License', category: 'Software', price: 29.99, stock: 999 },
      { id: 105, name: 'AI Assistant Sub', category: 'Software', price: 19.99, stock: 999 },
    ],
  },
  orders: {
    name: 'orders',
    columns: [
      { name: 'order_id', type: 'INTEGER' },
      { name: 'user_id', type: 'INTEGER' },
      { name: 'product_id', type: 'INTEGER' },
      { name: 'quantity', type: 'INTEGER' },
      { name: 'order_date', type: 'VARCHAR' },
    ],
    rows: [
      { order_id: 501, user_id: 1, product_id: 101, quantity: 2, order_date: '2026-08-01' },
      { order_id: 502, user_id: 1, product_id: 104, quantity: 1, order_date: '2026-08-02' },
      { order_id: 503, user_id: 2, product_id: 102, quantity: 1, order_date: '2026-08-05' },
      { order_id: 504, user_id: 4, product_id: 103, quantity: 3, order_date: '2026-08-10' },
      { order_id: 505, user_id: 5, product_id: 105, quantity: 1, order_date: '2026-08-12' },
    ],
  },
};
