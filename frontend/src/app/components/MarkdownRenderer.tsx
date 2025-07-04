import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Race } from './Navbar';

interface MarkdownRendererProps {
  content: string;
  selectedRace: Race;
  isUser?: boolean;
}

const raceStyles = {
  imperium: {
    heading: "text-yellow-300 font-bold border-b border-yellow-700",
    link: "text-yellow-400 hover:text-yellow-300 underline",
    code: "bg-yellow-900 bg-opacity-30 text-yellow-200 border border-yellow-800",
    blockquote: "border-l-4 border-yellow-600 bg-yellow-900 bg-opacity-20 text-yellow-200",
    list: "text-yellow-200",
    strong: "text-yellow-300 font-bold"
  },
  chaos: {
    heading: "text-red-300 font-bold border-b border-red-700",
    link: "text-red-400 hover:text-red-300 underline",
    code: "bg-red-900 bg-opacity-30 text-red-200 border border-red-800",
    blockquote: "border-l-4 border-red-600 bg-red-900 bg-opacity-20 text-red-200",
    list: "text-red-200",
    strong: "text-red-300 font-bold"
  },
  xenos: {
    heading: "text-green-300 font-bold border-b border-green-700",
    link: "text-green-400 hover:text-green-300 underline",
    code: "bg-green-900 bg-opacity-30 text-green-200 border border-green-800",
    blockquote: "border-l-4 border-green-600 bg-green-900 bg-opacity-20 text-green-200",
    list: "text-green-200",
    strong: "text-green-300 font-bold"
  }
};

export function MarkdownRenderer({ content, selectedRace, isUser = false }: MarkdownRendererProps) {
  const styles = raceStyles[selectedRace];
  
  // Si es un mensaje de usuario, usar estilos simples
  if (isUser) {
    return (
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            code: ({ children, ...props }) => {
              const isInline = !props.className;
              return isInline ? (
                <code className="bg-black bg-opacity-20 px-1 py-0.5 rounded text-sm">{children}</code>
              ) : (
                <code {...props}>{children}</code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Títulos
          h1: ({ children }) => (
            <h1 className={`text-lg ${styles.heading} mb-3 pb-1`}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className={`text-base ${styles.heading} mb-2 pb-1`}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className={`text-sm ${styles.heading} mb-2 pb-1`}>
              {children}
            </h3>
          ),
          
          // Párrafos
          p: ({ children }) => (
            <p className="mb-2 last:mb-0 leading-relaxed">
              {children}
            </p>
          ),
          
          // Enlaces
          a: ({ children, href }) => (
            <a 
              href={href} 
              className={`${styles.link} transition-colors`}
              target="_blank" 
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          
          // Código
          code: ({ children, ...props }) => {
            const isInline = !props.className;
            return isInline ? (
              <code className={`${styles.code} px-1.5 py-0.5 rounded text-xs font-mono`}>
                {children}
              </code>
            ) : (
              <pre className={`${styles.code} p-3 rounded-lg overflow-x-auto my-2`}>
                <code {...props}>{children}</code>
              </pre>
            );
          },
          
          // Citas
          blockquote: ({ children }) => (
            <blockquote className={`${styles.blockquote} pl-4 py-2 my-2 rounded-r`}>
              {children}
            </blockquote>
          ),
          
          // Listas
          ul: ({ children }) => (
            <ul className={`${styles.list} list-disc list-inside mb-2 space-y-1`}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className={`${styles.list} list-decimal list-inside mb-2 space-y-1`}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-sm">{children}</li>
          ),
          
          // Texto fuerte
          strong: ({ children }) => (
            <strong className={styles.strong}>{children}</strong>
          ),
          
          // Texto en cursiva
          em: ({ children }) => (
            <em className="italic opacity-90">{children}</em>
          ),
          
          // Línea horizontal
          hr: () => (
            <hr className={`border-0 h-px bg-gradient-to-r from-transparent via-current to-transparent my-3 opacity-50`} />
          ),
          
          // Tablas
          table: ({ children }) => (
            <div className="overflow-x-auto my-2">
              <table className="min-w-full border-collapse">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className={`${styles.heading} p-2 text-left text-xs border-b`}>
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-2 text-sm border-b border-gray-600 border-opacity-30">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
} 