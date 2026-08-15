import { SQL_DATABASE } from '../data/sqlTables';
import { CodeExecutionResult, TestCase } from '../types';

/**
 * Sandboxed JavaScript runner with test case evaluator
 */
export async function runJavaScriptCode(
  code: string,
  testCases?: TestCase[]
): Promise<CodeExecutionResult> {
  const startTime = performance.now();
  const logs: string[] = [];
  
  // Custom console trap
  const customConsole = {
    log: (...args: any[]) => {
      logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    },
    error: (...args: any[]) => {
      logs.push('[Error] ' + args.map(a => String(a)).join(' '));
    },
    warn: (...args: any[]) => {
      logs.push('[Warn] ' + args.map(a => String(a)).join(' '));
    },
  };

  try {
    // Check if test cases exist
    if (!testCases || testCases.length === 0) {
      // Direct execution
      const runFn = new Function('console', `${code}`);
      runFn(customConsole);
      
      const executionTimeMs = Math.round(performance.now() - startTime);
      return {
        success: true,
        output: logs.join('\n') || 'Code executed successfully with no output.',
        executionTimeMs,
      };
    }

    // Run each test case
    const testResults: Array<{
      passed: boolean;
      input: string;
      expected: string;
      actual: string;
      description: string;
    }> = [];

    for (const tc of testCases) {
      try {
        // We inject the user code and then call the expression
        const testScript = `
          ${code}
          try {
            return ${tc.input};
          } catch(e) {
            return 'ERROR: ' + e.message;
          }
        `;
        const testFn = new Function('console', testScript);
        const actualResult = testFn(customConsole);
        
        let actualStr = typeof actualResult === 'object' ? JSON.stringify(actualResult) : String(actualResult);
        let expectedStr = tc.expected.trim();

        // Normalize string representation for comparisons
        const isMatch = normalizeCompare(actualStr, expectedStr);

        testResults.push({
          passed: isMatch,
          input: tc.input,
          expected: expectedStr,
          actual: actualStr,
          description: tc.description,
        });
      } catch (err: any) {
        testResults.push({
          passed: false,
          input: tc.input,
          expected: tc.expected,
          actual: `Exception: ${err.message}`,
          description: tc.description,
        });
      }
    }

    const allPassed = testResults.every(t => t.passed);
    const executionTimeMs = Math.round(performance.now() - startTime);

    return {
      success: allPassed,
      output: logs.join('\n'),
      testResults,
      executionTimeMs,
      error: allPassed ? undefined : 'Some test cases did not pass. Check test results.',
    };
  } catch (err: any) {
    const executionTimeMs = Math.round(performance.now() - startTime);
    return {
      success: false,
      output: logs.join('\n'),
      error: `Syntax / Runtime Error: ${err.message}`,
      executionTimeMs,
    };
  }
}

/**
 * Client-side Python logic emulator & test runner for common programming tasks
 */
export async function runPythonCode(
  code: string,
  testCases?: TestCase[]
): Promise<CodeExecutionResult> {
  const startTime = performance.now();
  const logs: string[] = [];

  try {
    // Transform basic Python syntax to JS for immediate browser evaluation
    const jsTranspiled = transpilePythonToJs(code);
    
    const customConsole = {
      log: (...args: any[]) => {
        logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
      },
    };

    if (!testCases || testCases.length === 0) {
      const runFn = new Function('print', jsTranspiled);
      runFn(customConsole.log);
      const executionTimeMs = Math.round(performance.now() - startTime);
      return {
        success: true,
        output: logs.join('\n') || 'Python script executed without errors.',
        executionTimeMs,
      };
    }

    const testResults: Array<{
      passed: boolean;
      input: string;
      expected: string;
      actual: string;
      description: string;
    }> = [];

    for (const tc of testCases) {
      try {
        const transInput = transpilePythonCall(tc.input);
        const testScript = `
          ${jsTranspiled}
          try {
            return ${transInput};
          } catch(e) {
            return 'ERROR: ' + e.message;
          }
        `;
        const testFn = new Function('print', testScript);
        const actualResult = testFn(customConsole.log);
        const actualStr = typeof actualResult === 'object' ? JSON.stringify(actualResult) : String(actualResult);
        const expectedStr = tc.expected.trim();

        const isMatch = normalizeCompare(actualStr, expectedStr);
        testResults.push({
          passed: isMatch,
          input: tc.input,
          expected: expectedStr,
          actual: actualStr,
          description: tc.description,
        });
      } catch (err: any) {
        testResults.push({
          passed: false,
          input: tc.input,
          expected: tc.expected,
          actual: `Python Runtime Error: ${err.message}`,
          description: tc.description,
        });
      }
    }

    const allPassed = testResults.every(t => t.passed);
    const executionTimeMs = Math.round(performance.now() - startTime);

    return {
      success: allPassed,
      output: logs.join('\n'),
      testResults,
      executionTimeMs,
      error: allPassed ? undefined : 'One or more Python test cases failed.',
    };
  } catch (err: any) {
    return {
      success: false,
      output: '',
      error: `Python Syntax Error: ${err.message}`,
      executionTimeMs: Math.round(performance.now() - startTime),
    };
  }
}

/**
 * SQL In-Browser Evaluator against SQL_DATABASE mock datasets
 */
export async function runSqlQuery(
  query: string,
  expectedResult?: Array<Record<string, any>>
): Promise<CodeExecutionResult> {
  const startTime = performance.now();
  const trimmed = query.trim().replace(/;$/, '');

  try {
    if (!trimmed.toUpperCase().startsWith('SELECT')) {
      throw new Error('CodeQuest SQL playground currently supports SELECT queries.');
    }

    // Basic SQL parser / engine
    const fromMatch = trimmed.match(/FROM\s+([a-zA-Z_]+)/i);
    if (!fromMatch) {
      throw new Error('Query must include a FROM table clause.');
    }

    const tableName = fromMatch[1].toLowerCase();
    const table = SQL_DATABASE[tableName];
    if (!table) {
      throw new Error(`Table "${tableName}" does not exist. Available tables: users, departments, products, orders.`);
    }

    let rows = [...table.rows];

    // Check for JOIN
    const joinMatch = trimmed.match(/JOIN\s+([a-zA-Z_]+)\s+ON\s+([a-zA-Z0-9_.]+)\s*=\s*([a-zA-Z0-9_.]+)/i);
    if (joinMatch) {
      const joinTable = SQL_DATABASE[joinMatch[1].toLowerCase()];
      if (joinTable) {
        const leftKey = joinMatch[2].split('.').pop() || '';
        const rightKey = joinMatch[3].split('.').pop() || '';
        
        const joinedRows: any[] = [];
        for (const r1 of rows) {
          for (const r2 of joinTable.rows) {
            if (String(r1[leftKey]) === String(r2[rightKey]) || String(r1[rightKey]) === String(r2[leftKey])) {
              joinedRows.push({ ...r1, ...r2 });
            }
          }
        }
        rows = joinedRows;
      }
    }

    // WHERE clause
    const whereMatch = trimmed.match(/WHERE\s+(.*?)(?=\s+(?:GROUP BY|ORDER BY|LIMIT)|$)/i);
    if (whereMatch) {
      const conditionStr = whereMatch[1];
      rows = rows.filter(row => evaluateSqlCondition(row, conditionStr));
    }

    // ORDER BY
    const orderMatch = trimmed.match(/ORDER BY\s+([a-zA-Z_]+)(?:\s+(ASC|DESC))?/i);
    if (orderMatch) {
      const col = orderMatch[1];
      const isDesc = orderMatch[2]?.toUpperCase() === 'DESC';
      rows.sort((a, b) => {
        if (a[col] < b[col]) return isDesc ? 1 : -1;
        if (a[col] > b[col]) return isDesc ? -1 : 1;
        return 0;
      });
    }

    // LIMIT
    const limitMatch = trimmed.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
      const limit = parseInt(limitMatch[1], 10);
      rows = rows.slice(0, limit);
    }

    // Column projection (SELECT ...)
    const selectMatch = trimmed.match(/SELECT\s+(.*?)\s+FROM/i);
    let projectedRows = rows;
    if (selectMatch) {
      const rawCols = selectMatch[1].split(',').map(c => c.trim());
      if (!rawCols.includes('*')) {
        // Aggregate functions like COUNT(*), AVG(salary), etc.
        const isAggregate = rawCols.some(c => /COUNT|AVG|SUM|MIN|MAX/i.test(c));
        if (isAggregate) {
          const aggRow: Record<string, any> = {};
          rawCols.forEach(colExpr => {
            if (/COUNT\(\*\)/i.test(colExpr)) {
              aggRow['count'] = rows.length;
            } else if (/AVG\(([a-zA-Z_]+)\)/i.test(colExpr)) {
              const col = colExpr.match(/AVG\(([a-zA-Z_]+)\)/i)![1];
              const sum = rows.reduce((acc, r) => acc + (Number(r[col]) || 0), 0);
              aggRow[`avg_${col}`] = rows.length ? Math.round(sum / rows.length) : 0;
            } else if (/SUM\(([a-zA-Z_]+)\)/i.test(colExpr)) {
              const col = colExpr.match(/SUM\(([a-zA-Z_]+)\)/i)![1];
              aggRow[`sum_${col}`] = rows.reduce((acc, r) => acc + (Number(r[col]) || 0), 0);
            }
          });
          projectedRows = [aggRow];
        } else {
          projectedRows = rows.map(r => {
            const newRow: Record<string, any> = {};
            rawCols.forEach(col => {
              const cleanCol = col.replace(/^[a-zA-Z_]+\./, ''); // remove table prefix
              if (r[cleanCol] !== undefined) {
                newRow[cleanCol] = r[cleanCol];
              }
            });
            return newRow;
          });
        }
      }
    }

    const executionTimeMs = Math.round(performance.now() - startTime);

    let isSuccess = true;
    if (expectedResult && expectedResult.length > 0) {
      isSuccess = compareSqlResults(projectedRows, expectedResult);
    }

    return {
      success: isSuccess,
      output: `Returned ${projectedRows.length} row(s)`,
      sqlRows: projectedRows,
      executionTimeMs,
      error: isSuccess ? undefined : 'Output rows do not match the expected challenge result.',
    };
  } catch (err: any) {
    return {
      success: false,
      output: '',
      error: `SQL Error: ${err.message}`,
      executionTimeMs: Math.round(performance.now() - startTime),
    };
  }
}

// Helpers
function evaluateSqlCondition(row: Record<string, any>, conditionStr: string): boolean {
  try {
    // Handle simple condition: active = true, salary > 100000, role = 'Engineer', category = 'Hardware'
    let jsCond = conditionStr
      .replace(/AND/gi, '&&')
      .replace(/OR/gi, '||')
      .replace(/=/g, '===')
      .replace(/<===/g, '<=')
      .replace(/>===/g, '>=')
      .replace(/!===/g, '!==');

    // Replace column names with row['col']
    for (const key of Object.keys(row)) {
      const reg = new RegExp(`\\b${key}\\b`, 'g');
      jsCond = jsCond.replace(reg, `row['${key}']`);
    }

    const evalFn = new Function('row', `return Boolean(${jsCond});`);
    return evalFn(row);
  } catch {
    return true;
  }
}

function compareSqlResults(actual: any[], expected: any[]): boolean {
  if (actual.length !== expected.length) return false;
  try {
    return JSON.stringify(actual) === JSON.stringify(expected);
  } catch {
    return false;
  }
}

function normalizeCompare(a: string, b: string): boolean {
  if (a.trim() === b.trim()) return true;
  // Try JSON equivalence
  try {
    const objA = JSON.parse(a);
    const objB = JSON.parse(b);
    return JSON.stringify(objA) === JSON.stringify(objB);
  } catch {
    // Try number equivalence
    const numA = Number(a);
    const numB = Number(b);
    if (!isNaN(numA) && !isNaN(numB)) {
      return Math.abs(numA - numB) < 0.0001;
    }
    // Try boolean equivalence
    if (a.toLowerCase() === b.toLowerCase()) return true;
    return false;
  }
}

function transpilePythonToJs(py: string): string {
  // Convert standard Python functions & structures for algorithmic evaluation
  let js = py;

  // def func(a, b): -> function func(a, b) {
  js = js.replace(/def\s+([a-zA-Z0-9_]+)\s*\((.*?)\)\s*:/g, 'function $1($2) {');
  
  // elif cond: -> } else if (cond) {
  js = js.replace(/elif\s+(.*?):/g, '} else if ($1) {');

  // if cond: -> if (cond) {
  js = js.replace(/if\s+(.*?):/g, 'if ($1) {');

  // else: -> } else {
  js = js.replace(/else\s*:/g, '} else {');

  // for x in range(n): -> for (let x = 0; x < n; x++) {
  js = js.replace(/for\s+([a-zA-Z0-9_]+)\s+in\s+range\((.*?)\)\s*:/g, (_, varName, count) => {
    return `for (let ${varName} = 0; ${varName} < ${count}; ${varName}++) {`;
  });

  // for x in arr: -> for (let x of arr) {
  js = js.replace(/for\s+([a-zA-Z0-9_]+)\s+in\s+(.*?)\s*:/g, 'for (let $1 of $2) {');

  // while cond: -> while (cond) {
  js = js.replace(/while\s+(.*?):/g, 'while ($1) {');

  // True / False / None
  js = js.replace(/\bTrue\b/g, 'true');
  js = js.replace(/\bFalse\b/g, 'false');
  js = js.replace(/\bNone\b/g, 'null');

  // len(x) -> x.length
  js = js.replace(/len\((.*?)\)/g, '$1.length');

  // .append(x) -> .push(x)
  js = js.replace(/\.append\(/g, '.push(');

  // in / not in for simple checks
  js = js.replace(/\s+and\s+/g, ' && ');
  js = js.replace(/\s+or\s+/g, ' || ');
  js = js.replace(/\s+not\s+/g, ' ! ');

  // Automatic closing brace synthesis based on indentation or end of blocks
  // For algorithmic snippets in CodeQuest, we wrap execution nicely
  const lines = js.split('\n');
  const processedLines: string[] = [];
  const indentStack: number[] = [0];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const currentIndent = rawLine.search(/\S/);
    
    while (indentStack.length > 1 && currentIndent < indentStack[indentStack.length - 1]) {
      indentStack.pop();
      processedLines.push('}');
    }

    if (trimmed.endsWith('{')) {
      indentStack.push(currentIndent + 2);
    }

    processedLines.push(trimmed);
  }

  while (indentStack.length > 1) {
    indentStack.pop();
    processedLines.push('}');
  }

  return processedLines.join('\n');
}

function transpilePythonCall(callStr: string): string {
  let res = callStr;
  res = res.replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false').replace(/\bNone\b/g, 'null');
  return res;
}
