import { useState, useEffect, useRef } from 'react';
import './TypingArea.css';
import { getAuthHeaders } from './App';

const ONEDARK_KEYWORDS = [
  'function', 'return', 'if', 'else', 'for', 'while', 'switch', 'case', 'break', 'continue', 'const', 'let', 'var', 'class', 'public', 'private', 'protected', 'static', 'void', 'int', 'double', 'float', 'char', 'boolean', 'import', 'from', 'export', 'try', 'catch', 'finally', 'throw', 'new', 'extends', 'super', 'this', 'def', 'print', 'with', 'as', 'except', 'lambda', 'true', 'false', 'null', 'None', 'in', 'do', 'default', 'package', 'interface', 'enum', 'implements', 'instanceof', 'typeof', 'delete', 'await', 'async', 'yield', 'raise', 'pass', 'global', 'nonlocal', 'assert', 'yield', 'continue', 'break', 'goto', 'sizeof', 'typedef', 'struct', 'union', 'enum', 'extern', 'register', 'volatile', 'const', 'signed', 'unsigned', 'short', 'long', 'auto', 'inline', 'restrict', 'static_assert', 'alignas', 'alignof', 'constexpr', 'decltype', 'noexcept', 'nullptr', 'thread_local', 'using', 'namespace', 'template', 'operator', 'public', 'protected', 'private', 'virtual', 'override', 'final', 'explicit', 'friend', 'mutable', 'this', 'throw', 'try', 'catch', 'typeid', 'typename', 'union', 'volatile', 'wchar_t', 'xor', 'xor_eq', 'and', 'and_eq', 'bitand', 'bitor', 'compl', 'not', 'not_eq', 'or', 'or_eq', 'export', 'import', 'module', 'requires', 'co_await', 'co_return', 'co_yield', 'concept', 'consteval', 'constexpr', 'constinit', 'decltype', 'noexcept', 'nullptr', 'static_assert', 'thread_local', 'alignas', 'alignof', 'char8_t', 'char16_t', 'char32_t', 'wchar_t', 'bool', 'true', 'false', 'NULL', 'nullptr', 'override', 'final', 'explicit', 'friend', 'mutable', 'this', 'throw', 'try', 'catch', 'typeid', 'typename', 'union', 'volatile', 'wchar_t', 'xor', 'xor_eq', 'and', 'and_eq', 'bitand', 'bitor', 'compl', 'not', 'not_eq', 'or', 'or_eq'];

function getSyntaxClass(token) {
  if (/^\s+$/.test(token)) return '';
  if (/^\/\//.test(token) || /^#/.test(token) || /^\/\*/.test(token)) return 'syntax-comment';
  if (/^['"`].*['"`]$/.test(token)) return 'syntax-string';
  if (/^[0-9]+$/.test(token)) return 'syntax-number';
  if (ONEDARK_KEYWORDS.includes(token)) return 'syntax-keyword';
  if (/^[A-Za-z_][A-Za-z0-9_]*\($/.test(token)) return 'syntax-function';
  return '';
}

function TypingArea({ isGuest }) {
  const [userInput, setUserInput] = useState('');
  const [caretPos, setCaretPos] = useState(0);
  const [snippet, setSnippet] = useState('');
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const inputRef = useRef(null);
  const snippetOutputRef = useRef(null);
  const caretRef = useRef(null);
  const measureRef = useRef(null);
  // Stats state
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [caretLeft, setCaretLeft] = useState(0);

  // Helper to count errors
  const countErrors = (input, target) => {
    
    let err = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] !== target[i]) err++;
    }
    return err;
  };

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, []);

  // Fetch available languages on mount
  useEffect(() => {
    fetch('/api/snippet/languages')
      .then(res => res.json())
      .then(data => setLanguages(data))
      .catch(error => {
        console.error('Error fetching languages:', error);
        setLanguages(['javascript']); // fallback
      });
  }, []);

  // Fetch a random snippet when language changes
  useEffect(() => {
    fetch(`/api/snippet/random?language=${selectedLanguage}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data && data.code) {
          setSnippet(data.code);
        } else {
          console.error('Invalid snippet data:', data);
          setSnippet('// Error loading snippet');
        }
      })
      .catch(error => {
        console.error('Error fetching snippet:', error);
        setSnippet('// Error loading snippet');
      });
  }, [selectedLanguage]);

  useEffect(() => {
    setCaretPos(0);
    setUserInput('');
    setIsComplete(false);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setStartTime(null);
  }, [snippet]);

  // Refocus textarea when snippet changes (e.g., after language change)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [snippet]);

  useEffect(() => {
    console.log('isComplete:', isComplete);
  }, [isComplete]);

  useEffect(() => {
    if (caretRef.current && snippetOutputRef.current) {
      caretRef.current.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    }
  }, [caretPos, snippet]);

  // Calculate caret position (left offset)
  useEffect(() => {
    if (!measureRef.current) return;
    // Set the text content to the text up to the caret position
    measureRef.current.textContent = snippet.slice(0, caretPos);
    // Get the width of the text up to the caret
    setCaretLeft(measureRef.current.offsetWidth);
  }, [caretPos, snippet]);

  const handleKeyDown = (e) => {
    if (isComplete) return;
    if (!startTime) setStartTime(Date.now());
    if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Tab') {
      setUserInput((prev) => {
        let newInput = prev;
        if (e.key === 'Backspace') {
          if (caretPos > 0) {
            newInput = prev.slice(0, caretPos - 1) + prev.slice(caretPos);
            setCaretPos(caretPos - 1);
          }
        } else if (e.key === 'Tab') {
          // Smart Tab: match snippet indentation (tab or spaces)
          let insert = '';
          // Check for tab
          if (snippet[caretPos] === '\t') {
            insert = '\t';
          } else if (snippet.slice(caretPos, caretPos + 4) === '    ') {
            insert = '    ';
          } else if (snippet.slice(caretPos, caretPos + 2) === '  ') {
            insert = '  ';
          }
          if (insert) {
            newInput = prev.slice(0, caretPos) + insert + prev.slice(caretPos);
            setCaretPos(caretPos + insert.length);
          } else {
            // fallback: insert tab
            newInput = prev.slice(0, caretPos) + '\t' + prev.slice(caretPos);
            setCaretPos(caretPos + 1);
          }
        } else {
          newInput = prev.slice(0, caretPos) + e.key + prev.slice(caretPos);
          setCaretPos(caretPos + 1);
        }
        // Update stats after input
        const errCount = countErrors(newInput, snippet);
        setErrors(errCount);
        const correctChars = newInput.split('').filter((c, i) => c === snippet[i]).length;
        const acc = newInput.length > 0 ? (correctChars / newInput.length) * 100 : 100;
        setAccuracy(acc);
        // If completed
        if (newInput.length >= snippet.length) {
          setIsComplete(true);
          if (startTime) {
            const elapsedMin = (Date.now() - startTime) / 1000 / 60;
            const words = snippet.length / 5;
            setWpm(words / elapsedMin);
          }
        }
        return newInput;
      });
      e.preventDefault();
    } else if (e.key === 'Enter') {
      setUserInput((prev) => {
        let newInput = prev;
        // Smart Enter: match snippet newline
        if (snippet[caretPos] === '\n') {
          newInput = prev.slice(0, caretPos) + '\n' + prev.slice(caretPos);
          setCaretPos(caretPos + 1);
        } else {
          // fallback: insert newline
          newInput = prev.slice(0, caretPos) + '\n' + prev.slice(caretPos);
          setCaretPos(caretPos + 1);
        }
        // Update stats after input
        const errCount = countErrors(newInput, snippet);
        setErrors(errCount);
        const correctChars = newInput.split('').filter((c, i) => c === snippet[i]).length;
        const acc = newInput.length > 0 ? (correctChars / newInput.length) * 100 : 100;
        setAccuracy(acc);
        // If completed
        if (newInput.length >= snippet.length) {
          setIsComplete(true);
          if (startTime) {
            const elapsedMin = (Date.now() - startTime) / 1000 / 60;
            const words = snippet.length / 5;
            setWpm(words / elapsedMin);
          }
        }
        return newInput;
      });
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      setCaretPos((pos) => Math.max(0, pos - 1));
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      setCaretPos((pos) => Math.min(userInput.length, pos + 1));
      e.preventDefault();
    }
  };

  // Keep caretPos in sync with userInput length
  useEffect(() => {
    setCaretPos((pos) => Math.min(pos, userInput.length));
  }, [userInput]);

  return (
    <div
      className="typing-area-container"
      onClick={e => {
        if (e.target === e.currentTarget) {
          inputRef.current && inputRef.current.focus();
        }
      }}
    >
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="language-select" className="language-select-label">Language:</label>
        <select
          id="language-select"
          className="language-select"
          value={selectedLanguage}
          onChange={e => setSelectedLanguage(e.target.value)}
        >
          {languages.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>
      {!isComplete && (
        <>
          {/* Hidden span for measuring caret position */}
          <span
            ref={measureRef}
            style={{
              visibility: 'hidden',
              position: 'absolute',
              whiteSpace: 'pre',
              fontFamily: 'inherit',
              fontSize: '1.7rem',
              left: 0,
              top: 0,
              pointerEvents: 'none',
            }}
          />
          <pre className="snippet-output" ref={snippetOutputRef}>
            {(() => {
              // Tokenize by word boundaries, but keep whitespace and punctuation
              const tokens = snippet.match(/\w+\(|\w+|\s+|[^\w\s]/g) || [];
              let charIdx = 0;
              return tokens.map((token, i) => {
                const syntaxClass = getSyntaxClass(token);
                return token.split('').map((char, j) => {
                  const idx = charIdx++;
                  let baseClass = userInput[idx] == null ? 'untyped' : userInput[idx] === char ? 'correct' : 'incorrect';
                  let syntaxClass = '';
                  if (baseClass === 'correct') syntaxClass = getSyntaxClass(token);
                  let caretSpan = idx === caretPos ? <span key={`caret-${idx}`} className="caret" ref={caretRef} /> : null;
                  return [
                    caretSpan,
                    <span key={`${i}-${j}`} className={`${baseClass}${syntaxClass ? ' ' + syntaxClass : ''}`}>{char}</span>
                  ];
                });
              });
            })()}
            {caretPos === snippet.length && <span className="caret" ref={caretRef} />}
          </pre>
          <textarea
            ref={inputRef}
            value={userInput}
            onKeyDown={handleKeyDown}
            // No onChange handler: userInput is only updated via onKeyDown for responsiveness
            className="hidden-input"
            rows={snippet.split('\n').length}
            cols={Math.max(...snippet.split('\n').map(l => l.length))}
            spellCheck={false}
            autoFocus
          />
        </>
      )}
      {!isComplete && (
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button
            className="restart-icon-btn"
            onClick={() => {
              setCaretPos(0);
              setUserInput('');
              setIsComplete(false);
              setWpm(0);
              setAccuracy(100);
              setErrors(0);
              setStartTime(null);
              inputRef.current && inputRef.current.focus();
            }}
            aria-label="Restart Same Snippet"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.93 19.07A10 10 0 1 1 12 22v-4" />
              <polyline points="12 18 12 22 16 22" />
            </svg>
          </button>
        </div>
      )}
      {isComplete && (
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button
            className="restart-icon-btn"
            onClick={() => {
              setCaretPos(0);
              setUserInput('');
              setIsComplete(false);
              setWpm(0);
              setAccuracy(100);
              setErrors(0);
              setStartTime(null);
              inputRef.current && inputRef.current.focus();
            }}
            aria-label="Restart Same Snippet"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.93 19.07A10 10 0 1 1 12 22v-4" />
              <polyline points="12 18 12 22 16 22" />
            </svg>
          </button>
          <button
            className="restart-btn"
            onClick={() => {
              fetch(`/api/snippet/random?language=${selectedLanguage}`)
                .then(res => res.json())
                .then(data => {
                  if (data && data.code) {
                    setSnippet(data.code);
                  }
                })
                .catch(error => {
                  console.error('Error fetching new snippet:', error);
                });
            }}
          >
            New Code Snippet
          </button>
        </div>
      )}
      {isComplete && (
        <div className="stats">
          <div>WPM: {wpm.toFixed(2)}</div>
          <div>Accuracy: {accuracy.toFixed(2)}%</div>
          <div>Errors: {errors}</div>
        </div>
      )}
    </div>
  );
}

export default TypingArea; 