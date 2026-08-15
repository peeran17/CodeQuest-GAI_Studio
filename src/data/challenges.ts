import { LanguageTrack } from '../types';

export const LANGUAGE_TRACKS: LanguageTrack[] = [
  {
    id: 'python',
    name: 'Python',
    tagline: 'Clean syntax, powerful data structures & algorithms',
    icon: '🐍',
    color: 'emerald',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    accentBorder: 'border-emerald-500',
    description: 'Master Python through hands-on logic, data parsing, algorithmic challenges, and bug-fixing adventures.',
    modules: [
      {
        id: 'py_mod_1',
        language: 'python',
        title: 'Module 1: Foundations & Arithmetic',
        description: 'Variables, data types, calculations, and formatted output',
        order: 1,
        icon: 'BookOpen',
        challenges: [
          {
            id: 'py_ch_1',
            language: 'python',
            moduleId: 'py_mod_1',
            title: 'Variable Swapper',
            difficulty: 'Beginner',
            type: 'code_editor',
            xpReward: 30,
            gemsReward: 10,
            story: 'You are an apprentice alchemist reorganizing your spell inventory slots.',
            instructions: 'Write a function `swap_values(a, b)` that returns a tuple/list `[b, a]` swapping the two given inputs.',
            starterCode: `def swap_values(a, b):
    # TODO: Return a and b swapped as [b, a]
    pass`,
            solutionCode: `def swap_values(a, b):
    return [b, a]`,
            hint: 'In Python, you can directly return [b, a] or use multiple assignment: a, b = b, a',
            tags: ['variables', 'basics'],
            testCases: [
              { input: 'swap_values(5, 10)', expected: '[10, 5]', description: 'Swap integers 5 and 10' },
              { input: 'swap_values("apple", "banana")', expected: '["banana", "apple"]', description: 'Swap string names' },
              { input: 'swap_values(True, False)', expected: '[false, true]', description: 'Swap booleans' },
            ],
          },
          {
            id: 'py_ch_2',
            language: 'python',
            moduleId: 'py_mod_1',
            title: 'Bug Hunt: String Concatenation',
            difficulty: 'Beginner',
            type: 'bug_hunt',
            xpReward: 35,
            gemsReward: 12,
            story: 'A rogue robot is trying to greet guests, but its greeting function crashes on integer IDs!',
            instructions: 'Fix the bug in `greet_user(name, user_id)`. Make sure it returns `"Hello " + name + ", your ID is #" + str(user_id)` without type errors.',
            starterCode: `def greet_user(name, user_id):
    # BUG: Trying to concatenate string and integer directly without str()
    return "Hello " + name + ", your ID is #" + user_id`,
            solutionCode: `def greet_user(name, user_id):
    return "Hello " + name + ", your ID is #" + str(user_id)`,
            bugLine: 3,
            bugExplanation: 'Python does not automatically convert integers to strings when using the + operator. Wrap user_id with str(user_id).',
            hint: 'Use `str(user_id)` or an f-string `f"Hello {name}, your ID is #{user_id}"` to format strings safely.',
            tags: ['debugging', 'strings'],
            testCases: [
              { input: 'greet_user("Alex", 42)', expected: '"Hello Alex, your ID is #42"', description: 'Greet with ID 42' },
              { input: 'greet_user("Sam", 101)', expected: '"Hello Sam, your ID is #101"', description: 'Greet with ID 101' },
            ],
          },
          {
            id: 'py_ch_3',
            language: 'python',
            moduleId: 'py_mod_1',
            title: 'Predict Output: Python Slicing',
            difficulty: 'Beginner',
            type: 'predict_output',
            xpReward: 25,
            gemsReward: 8,
            story: 'A treasure map contains an encrypted cipher array.',
            instructions: 'What will the following Python code snippet return?',
            starterCode: `nums = [10, 20, 30, 40, 50, 60]
result = nums[1:5:2]
print(result)`,
            solutionCode: `[20, 40]`,
            hint: 'Slicing syntax is list[start:stop:step]. Index 1 is 20, stepping by 2 visits index 1 (20) and index 3 (40).',
            tags: ['slicing', 'lists'],
            predictPrompt: 'Predict the console output of `nums[1:5:2]`:',
            predictOptions: [
              { text: '[20, 40]', correct: true, explanation: 'Starts at index 1 (20), steps by 2 to index 3 (40), stops before index 5.' },
              { text: '[10, 30, 50]', correct: false, explanation: 'That would be nums[0:5:2].' },
              { text: '[20, 30, 40, 50]', correct: false, explanation: 'That is nums[1:5] with step 1.' },
              { text: '[20, 40, 60]', correct: false, explanation: 'Stop index is 5, so index 5 (60) is excluded.' },
            ],
          },
          {
            id: 'py_ch_4',
            language: 'python',
            moduleId: 'py_mod_1',
            title: 'Code Blocks: Celsius to Fahrenheit',
            difficulty: 'Beginner',
            type: 'code_blocks',
            xpReward: 30,
            gemsReward: 10,
            story: 'Assemble the temperature conversion formula in correct logical order.',
            instructions: 'Drag or click the code snippets to assemble a working `c_to_f(celsius)` converter function.',
            starterCode: ``,
            solutionCode: `def c_to_f(celsius):
    fahrenheit = (celsius * 9/5) + 32
    return fahrenheit`,
            hint: 'Define function signature first, then calculate fahrenheit, then return the result.',
            tags: ['blocks', 'math'],
            codeBlocks: [
              { id: 'b1', text: 'def c_to_f(celsius):', correctIndex: 0 },
              { id: 'b2', text: '    fahrenheit = (celsius * 9/5) + 32', correctIndex: 1 },
              { id: 'b3', text: '    return fahrenheit', correctIndex: 2 },
            ],
          },
        ],
      },
      {
        id: 'py_mod_2',
        language: 'python',
        title: 'Module 2: Logic, Loops & Conditionals',
        description: 'Branching logic, while/for loops, and classic problems',
        order: 2,
        icon: 'Cpu',
        challenges: [
          {
            id: 'py_ch_5',
            language: 'python',
            moduleId: 'py_mod_2',
            title: 'FizzBuzz Generator',
            difficulty: 'Beginner',
            type: 'code_editor',
            xpReward: 40,
            gemsReward: 15,
            story: 'The kingdom gatekeeper only lets travelers pass if they know the sacred FizzBuzz chant!',
            instructions: 'Write `fizzbuzz(n)`: return "FizzBuzz" if divisible by 3 and 5, "Fizz" if divisible by 3, "Buzz" if divisible by 5, and `str(n)` otherwise.',
            starterCode: `def fizzbuzz(n):
    # TODO: Return FizzBuzz, Fizz, Buzz, or str(n)
    pass`,
            solutionCode: `def fizzbuzz(n):
    if n % 15 == 0:
        return "FizzBuzz"
    elif n % 3 == 0:
        return "Fizz"
    elif n % 5 == 0:
        return "Buzz"
    else:
        return str(n)`,
            hint: 'Check for both 3 and 5 (or n % 15 == 0) first before checking individual divisors!',
            tags: ['conditionals', 'classic'],
            testCases: [
              { input: 'fizzbuzz(15)', expected: '"FizzBuzz"', description: 'Number 15 (3 and 5)' },
              { input: 'fizzbuzz(9)', expected: '"Fizz"', description: 'Number 9 (divisible by 3)' },
              { input: 'fizzbuzz(10)', expected: '"Buzz"', description: 'Number 10 (divisible by 5)' },
              { input: 'fizzbuzz(7)', expected: '"7"', description: 'Number 7 (neither)' },
            ],
          },
          {
            id: 'py_ch_6',
            language: 'python',
            moduleId: 'py_mod_2',
            title: 'Palindrome Verifier',
            difficulty: 'Intermediate',
            type: 'code_editor',
            xpReward: 45,
            gemsReward: 18,
            story: 'Decrypt ancient mirror scrolls to test if words read identically backwards and forwards.',
            instructions: 'Write `is_palindrome(s)`: return `True` if string `s` is a palindrome (ignoring case), `False` otherwise.',
            starterCode: `def is_palindrome(s):
    # TODO: Compare lowercased string with its reverse
    pass`,
            solutionCode: `def is_palindrome(s):
    cleaned = s.lower()
    return cleaned == cleaned[::-1]`,
            hint: 'In Python, `s[::-1]` reverses a string, and `s.lower()` makes comparison case-insensitive.',
            tags: ['strings', 'algorithms'],
            testCases: [
              { input: 'is_palindrome("Racecar")', expected: 'true', description: 'Racecar' },
              { input: 'is_palindrome("radar")', expected: 'true', description: 'radar' },
              { input: 'is_palindrome("python")', expected: 'false', description: 'python' },
            ],
          },
        ],
      },
      {
        id: 'py_mod_3',
        language: 'python',
        title: 'Module 3: Data Structures & Algorithms',
        description: 'Lists, dictionaries, frequency counters, and search algorithms',
        order: 3,
        icon: 'Layers',
        challenges: [
          {
            id: 'py_ch_7',
            language: 'python',
            moduleId: 'py_mod_3',
            title: 'Two Sum Target Finder',
            difficulty: 'Intermediate',
            type: 'code_editor',
            xpReward: 50,
            gemsReward: 20,
            story: 'You need to find two energy crystals whose total power matches the portal lock frequency.',
            instructions: 'Write `two_sum(nums, target)` that returns the indices `[i, j]` of the two numbers that add up to `target`.',
            starterCode: `def two_sum(nums, target):
    # TODO: Find indices of two numbers that sum to target
    pass`,
            solutionCode: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`,
            hint: 'Use a dictionary / hash map to store seen numbers and their indices for O(N) time complexity.',
            tags: ['algorithms', 'hashmap', 'interview'],
            testCases: [
              { input: 'two_sum([2, 7, 11, 15], 9)', expected: '[0, 1]', description: 'Find 2 + 7 = 9' },
              { input: 'two_sum([3, 2, 4], 6)', expected: '[1, 2]', description: 'Find 2 + 4 = 6' },
              { input: 'two_sum([3, 3], 6)', expected: '[0, 1]', description: 'Find 3 + 3 = 6' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'javascript',
    name: 'JavaScript / TS',
    tagline: 'Modern ES6+, Async/Await, Array superpowers, and Web logic',
    icon: '⚡',
    color: 'amber',
    badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    accentBorder: 'border-amber-500',
    description: 'Level up your JavaScript skills with functional array transformations, closures, async promises, and DOM wizardry.',
    modules: [
      {
        id: 'js_mod_1',
        language: 'javascript',
        title: 'Module 1: ES6 & Array Powerups',
        description: 'Map, filter, reduce, destructuring, and arrow functions',
        order: 1,
        icon: 'Zap',
        challenges: [
          {
            id: 'js_ch_1',
            language: 'javascript',
            moduleId: 'js_mod_1',
            title: 'Cart Total Calculator',
            difficulty: 'Beginner',
            type: 'code_editor',
            xpReward: 35,
            gemsReward: 12,
            story: 'Build an e-commerce calculation engine for a futuristic space bazaar.',
            instructions: 'Write `calculateTotal(items)` taking an array of objects `{ price: number, qty: number }` and returning the total sum.',
            starterCode: `function calculateTotal(items) {
  // TODO: Use Array.reduce to compute total price * qty
  
}`,
            solutionCode: `function calculateTotal(items) {
  return items.reduce((sum, item) => sum + (item.price * item.qty), 0);
}`,
            hint: 'Use `items.reduce((total, item) => total + item.price * item.qty, 0)`',
            tags: ['arrays', 'reduce', 'es6'],
            testCases: [
              { input: 'calculateTotal([{ price: 10, qty: 2 }, { price: 5, qty: 3 }])', expected: '35', description: 'Total of (10*2) + (5*3) = 35' },
              { input: 'calculateTotal([{ price: 100, qty: 1 }])', expected: '100', description: 'Single item' },
              { input: 'calculateTotal([])', expected: '0', description: 'Empty cart' },
            ],
          },
          {
            id: 'js_ch_2',
            language: 'javascript',
            moduleId: 'js_mod_1',
            title: 'Bug Hunt: Arrow Function Scope',
            difficulty: 'Intermediate',
            type: 'bug_hunt',
            xpReward: 40,
            gemsReward: 15,
            story: 'A cybernetic counter module is throwing NaN because of an uninitialized initial value!',
            instructions: 'Fix the bug in `countOccurrences(arr)`. It must return an object mapping each item to its frequency count.',
            starterCode: `function countOccurrences(arr) {
  // BUG: reduce initial accumulator is missing, causing undefined[item] error
  return arr.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  });
}`,
            solutionCode: `function countOccurrences(arr) {
  return arr.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
}`,
            bugLine: 6,
            bugExplanation: 'Array.reduce requires an initial accumulator object `{}` passed as the second argument, otherwise it defaults to the first element.',
            hint: 'Pass `, {})` at the end of `.reduce((acc, item) => {...}, {})`',
            tags: ['debugging', 'objects', 'reduce'],
            testCases: [
              { input: 'countOccurrences(["a", "b", "a", "c", "b", "a"])', expected: '{"a":3,"b":2,"c":1}', description: 'Counts letters' },
              { input: 'countOccurrences(["cat", "dog", "cat"])', expected: '{"cat":2,"dog":1}', description: 'Counts words' },
            ],
          },
          {
            id: 'js_ch_3',
            language: 'javascript',
            moduleId: 'js_mod_1',
            title: 'Predict Output: Promise & Event Loop',
            difficulty: 'Intermediate',
            type: 'predict_output',
            xpReward: 30,
            gemsReward: 10,
            story: 'Trace the JavaScript microtask and macrotask execution queue.',
            instructions: 'What will be printed to console in what order?',
            starterCode: `console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');`,
            solutionCode: `1, 4, 3, 2`,
            hint: 'Synchronous code runs first (1, 4), then Microtasks / Promises (3), then Macrotasks / setTimeout (2).',
            tags: ['eventloop', 'async', 'promises'],
            predictPrompt: 'What order will the numbers log to console?',
            predictOptions: [
              { text: '1, 4, 3, 2', correct: true, explanation: 'Synchronous code (1, 4) executes first, followed by microtask queue (3), followed by macrotask timer (2).' },
              { text: '1, 2, 3, 4', correct: false, explanation: 'setTimeout is asynchronous, even with 0ms delay.' },
              { text: '1, 3, 4, 2', correct: false, explanation: 'console.log(4) is synchronous and executes before the Promise microtask resolves.' },
              { text: '1, 4, 2, 3', correct: false, explanation: 'Promise microtasks execute before setTimeout macrotasks.' },
            ],
          },
          {
            id: 'js_ch_4',
            language: 'javascript',
            moduleId: 'js_mod_1',
            title: 'Code Blocks: Async Data Fetcher',
            difficulty: 'Intermediate',
            type: 'code_blocks',
            xpReward: 35,
            gemsReward: 12,
            story: 'Assemble an async/await API consumer that parses JSON response securely.',
            instructions: 'Arrange the lines of code into a valid async function that fetches a URL and returns parsed data.',
            starterCode: ``,
            solutionCode: `async function fetchUserData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}`,
            hint: 'Mark function as async, await response from fetch, await response.json(), and return data.',
            tags: ['async', 'fetch'],
            codeBlocks: [
              { id: 'b1', text: 'async function fetchUserData(url) {', correctIndex: 0 },
              { id: 'b2', text: '  const response = await fetch(url);', correctIndex: 1 },
              { id: 'b3', text: '  const data = await response.json();', correctIndex: 2 },
              { id: 'b4', text: '  return data;', correctIndex: 3 },
              { id: 'b5', text: '}', correctIndex: 4 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'sql',
    name: 'SQL Database',
    tagline: 'Querying tables, aggregations, relational JOINs & analytics',
    icon: '🗄️',
    color: 'blue',
    badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    accentBorder: 'border-blue-500',
    description: 'Master relational data with real interactive database tables, filters, aggregations, and multi-table joins.',
    modules: [
      {
        id: 'sql_mod_1',
        language: 'sql',
        title: 'Module 1: Queries & Filtering',
        description: 'SELECT, WHERE filters, logical operators, and ordering',
        order: 1,
        icon: 'Database',
        challenges: [
          {
            id: 'sql_ch_1',
            language: 'sql',
            moduleId: 'sql_mod_1',
            title: 'Find Active Engineers',
            difficulty: 'Beginner',
            type: 'code_editor',
            xpReward: 35,
            gemsReward: 12,
            story: 'The operations department needs a list of all active software engineers.',
            instructions: 'Write a SQL query to select `id`, `name`, and `salary` from the `users` table where `role` is "Engineer" and `active` is `true`.',
            starterCode: `-- Table: users (id, name, role, department_id, salary, active)
SELECT id, name, salary
FROM users
WHERE -- TODO: Add condition
`,
            solutionCode: `SELECT id, name, salary FROM users WHERE role = 'Engineer' AND active = true`,
            hint: 'Use `WHERE role = \'Engineer\' AND active = true`',
            tags: ['select', 'where'],
            expectedSqlResult: [
              { id: 1, name: 'Alice Chen', salary: 120000 },
            ],
          },
          {
            id: 'sql_ch_2',
            language: 'sql',
            moduleId: 'sql_mod_1',
            title: 'Department Salary Aggregator',
            difficulty: 'Intermediate',
            type: 'code_editor',
            xpReward: 40,
            gemsReward: 15,
            story: 'Analyze company financial health by calculating total and average staff compensations.',
            instructions: 'Write a SQL query to find `COUNT(*)` and `AVG(salary)` across all employees in the `users` table.',
            starterCode: `SELECT COUNT(*), AVG(salary)
FROM users;`,
            solutionCode: `SELECT COUNT(*), AVG(salary) FROM users;`,
            hint: 'Use `SELECT COUNT(*), AVG(salary) FROM users`',
            tags: ['aggregates', 'avg'],
            expectedSqlResult: [
              { count: 6, avg_salary: 121167 },
            ],
          },
          {
            id: 'sql_ch_3',
            language: 'sql',
            moduleId: 'sql_mod_1',
            title: 'Multi-Table JOIN Query',
            difficulty: 'Advanced',
            type: 'code_editor',
            xpReward: 50,
            gemsReward: 20,
            story: 'Connect employees with their respective department building and floor locations.',
            instructions: 'Write a query selecting `users.name` and `departments.dept_name` by joining `users` with `departments` on `users.department_id = departments.id` where department location is "Floor 4".',
            starterCode: `SELECT users.name, departments.dept_name
FROM users
JOIN departments ON users.department_id = departments.id
WHERE departments.location = 'Floor 4';`,
            solutionCode: `SELECT users.name, departments.dept_name FROM users JOIN departments ON users.department_id = departments.id WHERE departments.location = 'Floor 4'`,
            hint: 'Specify table join with `JOIN departments ON users.department_id = departments.id`',
            tags: ['join', 'relations'],
            expectedSqlResult: [
              { name: 'Alice Chen', dept_name: 'Engineering' },
              { name: 'Charlie Kim', dept_name: 'Engineering' },
              { name: 'Diana Prince', dept_name: 'Engineering' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'html_css',
    name: 'HTML & CSS',
    tagline: 'Semantic markup, Flexbox, Grid, and responsive UI crafting',
    icon: '🎨',
    color: 'violet',
    badgeBg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
    accentBorder: 'border-violet-500',
    description: 'Design beautiful, responsive, and accessible UI components with modern CSS layout engines.',
    modules: [
      {
        id: 'html_mod_1',
        language: 'html_css',
        title: 'Module 1: Layout & Flexbox',
        description: 'Centering, spacing, flex alignments, and responsive cards',
        order: 1,
        icon: 'Layout',
        challenges: [
          {
            id: 'html_ch_1',
            language: 'html_css',
            moduleId: 'html_mod_1',
            title: 'Flexbox Center Card',
            difficulty: 'Beginner',
            type: 'code_editor',
            xpReward: 30,
            gemsReward: 10,
            story: 'Craft a centered call-to-action badge for a gaming dashboard.',
            instructions: 'Complete the CSS to perfectly center the card horizontally and vertically using Flexbox (`display: flex`, `justify-content: center`, `align-items: center`).',
            starterCode: `<div class="container">
  <div class="card">
    <h3>Level 10 Achieved!</h3>
    <p>You unlocked the Legendary Coder badge.</p>
  </div>
</div>

<style>
.container {
  height: 180px;
  background: #1e1e2f;
  border-radius: 8px;
  /* TODO: Add flexbox properties to center children */
  display: flex;
  justify-content: center;
  align-items: center;
}
.card {
  background: #2d2d44;
  color: #fff;
  padding: 16px 24px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #4f46e5;
}
</style>`,
            solutionCode: `display: flex; justify-content: center; align-items: center;`,
            hint: 'Set `display: flex`, `justify-content: center` (main axis), and `align-items: center` (cross axis).',
            tags: ['css', 'flexbox', 'html'],
            htmlCssPreview: true,
          },
        ],
      },
    ],
  },
  {
    id: 'rust',
    name: 'Rust & Systems',
    tagline: 'Memory safety, ownership, borrowing, and fast systems programming',
    icon: '🦀',
    color: 'orange',
    badgeBg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    accentBorder: 'border-orange-500',
    description: 'Grasp the core concepts of memory ownership, pattern matching, structs, and compile-time guarantees.',
    modules: [
      {
        id: 'rust_mod_1',
        language: 'rust',
        title: 'Module 1: Ownership & Pattern Matching',
        description: 'Borrowing, mutability, match statements, and enums',
        order: 1,
        icon: 'Shield',
        challenges: [
          {
            id: 'rust_ch_1',
            language: 'rust',
            moduleId: 'rust_mod_1',
            title: 'Predict Output: Rust Ownership Shadowing',
            difficulty: 'Intermediate',
            type: 'predict_output',
            xpReward: 35,
            gemsReward: 12,
            story: 'Analyze Rust variable scope and variable shadowing mechanics.',
            instructions: 'What value will be printed by the final `println!` macro?',
            starterCode: `fn main() {
    let x = 5;
    let x = x + 1;
    {
        let x = x * 2;
        println!("Inner x: {}", x);
    }
    println!("Outer x: {}", x);
}`,
            solutionCode: `Outer x: 6`,
            hint: 'Shadowing inside the inner block {} only affects that block. Outside, x remains 5 + 1 = 6.',
            tags: ['rust', 'ownership', 'shadowing'],
            predictPrompt: 'What is the printed value of "Outer x"?',
            predictOptions: [
              { text: 'Outer x: 6', correct: true, explanation: 'The inner block shadows x to 12, but once out of block scope, the outer x (5 + 1 = 6) is untouched.' },
              { text: 'Outer x: 12', correct: false, explanation: 'The inner let statement is scoped solely to the inner curly braces.' },
              { text: 'Outer x: 5', correct: false, explanation: 'The first let x = x + 1 shadowed the original 5 to 6.' },
              { text: 'Compiler Error: cannot mutate immutable x', correct: false, explanation: 'In Rust, "let" variable shadowing creates a fresh binding without requiring "mut".' },
            ],
          },
        ],
      },
    ],
  },
];
