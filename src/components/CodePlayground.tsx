import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Code2, 
  Terminal, 
  Eye, 
  Database, 
  Sparkles, 
  ArrowLeft,
  Loader2,
  Copy,
  Check
} from 'lucide-react';
import { Language, UserStats } from '../types';
import { runJavaScriptCode, runPythonCode, runSqlQuery } from '../utils/codeRunner';
import { playSound } from '../utils/audio';

interface CodePlaygroundProps {
  stats: UserStats;
  onBack: () => void;
}

const TEMPLATES: Record<Language, string> = {
  python: `# Python Scratchpad
def greet(name, times=3):
    return [f"Hello {name}! (Pass #{i+1})" for i in range(times)]

result = greet("Developer")
print("Generated greeting array:")
for msg in result:
    print(msg)
`,
  javascript: `// JavaScript ES6+ Scratchpad
const employees = [
  { name: "Alice", role: "Frontend", xp: 450 },
  { name: "Bob", role: "Backend", xp: 620 },
  { name: "Charlie", role: "DevOps", xp: 780 }
];

const totalXp = employees.reduce((sum, e) => sum + e.xp, 0);
console.log("Total team XP:", totalXp);

const topPerformers = employees.filter(e => e.xp > 500);
console.log("Top Performers:", topPerformers);
`,
  sql: `-- SQL In-Memory Relational Playground
-- Available tables: users, departments, products, orders

SELECT users.name, users.salary, departments.dept_name
FROM users
JOIN departments ON users.department_id = departments.id
WHERE users.active = true
ORDER BY users.salary DESC;
`,
  html_css: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      background: #0f172a;
      color: #f8fafc;
      font-family: system-ui, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }
    .badge {
      background: linear-gradient(135deg, #6366f1, #10b981);
      padding: 20px 32px;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="badge">
    <h2>⚡ CodeQuest Playground</h2>
    <p>Live responsive CSS preview in action!</p>
  </div>
</body>
</html>
`,
  rust: `// Rust Logic Prototype
fn main() {
    let mut scores = vec![90, 85, 95, 100];
    scores.push(88);
    
    let total: i32 = scores.iter().sum();
    let avg = total / (scores.len() as i32);
    
    println!("Average Score: {}", avg);
}
`,
};

export const CodePlayground: React.FC<CodePlaygroundProps> = ({ stats, onBack }) => {
  const [lang, setLang] = useState<Language>(stats.selectedLanguage);
  const [code, setCode] = useState<string>(TEMPLATES[stats.selectedLanguage] || TEMPLATES.python);
  const [output, setOutput] = useState<string>('');
  const [sqlRows, setSqlRows] = useState<any[] | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    setCode(TEMPLATES[newLang]);
    setOutput('');
    setSqlRows(null);
    playSound('click', stats.soundEnabled);
  };

  const handleRun = async () => {
    setIsRunning(true);
    playSound('click', stats.soundEnabled);

    try {
      if (lang === 'javascript') {
        const res = await runJavaScriptCode(code);
        setOutput(res.output || (res.error ? `Error: ${res.error}` : 'Executed with no output.'));
        setSqlRows(null);
      } else if (lang === 'python') {
        const res = await runPythonCode(code);
        setOutput(res.output || (res.error ? `Error: ${res.error}` : 'Executed with no output.'));
        setSqlRows(null);
      } else if (lang === 'sql') {
        const res = await runSqlQuery(code);
        setOutput(res.output || (res.error ? `Error: ${res.error}` : 'Query executed.'));
        setSqlRows(res.sqlRows || null);
      }
    } catch (err: any) {
      setOutput(`Execution error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    playSound('click', stats.soundEnabled);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-2 border-indigo-100 p-4 sm:p-5 rounded-3xl shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 rounded-2xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-600" />
              <span>Multi-Language Scratchpad</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Experiment freely with Python, JavaScript, SQL, and HTML/CSS
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-indigo-50/80 p-1 rounded-2xl border-2 border-indigo-100">
            {(['python', 'javascript', 'sql', 'html_css'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => handleLanguageChange(l)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  lang === l
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-indigo-700'
                }`}
              >
                {l === 'html_css' ? 'HTML' : l.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopyCode}
            className="p-2.5 text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-2xl border border-slate-200 transition-colors cursor-pointer"
            title="Copy code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              setCode(TEMPLATES[lang]);
              setOutput('');
              setSqlRows(null);
            }}
            className="p-2.5 text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-2xl border border-slate-200 transition-colors cursor-pointer"
            title="Reset to template"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {lang !== 'html_css' && (
            <button
              disabled={isRunning}
              onClick={handleRun}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:border-b-0 active:translate-y-0.5 border-b-4 border-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer"
            >
              {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
              <span>Run Code</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor & Console Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Editor Area (7 cols) */}
        <div className="lg:col-span-7 bg-white border-2 border-indigo-100 rounded-3xl overflow-hidden shadow-xs flex flex-col">
          <div className="bg-indigo-50/70 px-4 py-2.5 border-b border-indigo-100 text-xs font-mono text-indigo-950 font-black flex items-center justify-between">
            <span>scratchpad.{lang === 'python' ? 'py' : lang === 'javascript' ? 'js' : lang === 'sql' ? 'sql' : 'html'}</span>
            <span className="text-[10px] text-indigo-600 uppercase font-black tracking-wider">Live Workspace</span>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={18}
            spellCheck={false}
            className="w-full bg-slate-900 text-emerald-400 font-mono text-sm leading-relaxed p-4 border-0 focus:outline-none resize-y selection:bg-indigo-500/40"
          />
        </div>

        {/* Live Output Area (5 cols) */}
        <div className="lg:col-span-5 bg-white border-2 border-indigo-100 rounded-3xl overflow-hidden shadow-xs flex flex-col">
          <div className="bg-indigo-50/70 px-4 py-2.5 border-b border-indigo-100 text-xs font-mono text-indigo-950 font-black flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-600" />
            <span>Output Console / Preview</span>
          </div>

          <div className="p-4 flex-1 overflow-y-auto text-xs font-mono bg-slate-900 text-slate-200 min-h-[300px]">
            {lang === 'html_css' ? (
              <div className="rounded-xl overflow-hidden border border-slate-700 bg-white h-80">
                <iframe
                  title="HTML Playground"
                  srcDoc={code}
                  sandbox="allow-scripts"
                  className="w-full h-full border-0"
                />
              </div>
            ) : sqlRows && sqlRows.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-800">
                  <thead className="bg-slate-800 text-indigo-300 uppercase text-[10px]">
                    <tr>
                      {Object.keys(sqlRows[0]).map(col => (
                        <th key={col} className="p-2 border-b border-slate-700">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sqlRows.map((row, rIdx) => (
                      <tr key={rIdx} className="border-b border-slate-800/80 hover:bg-slate-800/30">
                        {Object.values(row).map((val, cIdx) => (
                          <td key={cIdx} className="p-2 text-slate-200">{String(val)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : output ? (
              <div className="text-emerald-400 whitespace-pre-wrap">{output}</div>
            ) : (
              <div className="text-slate-500 italic">
                Press "Run Code" to execute script and inspect output logs here.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
