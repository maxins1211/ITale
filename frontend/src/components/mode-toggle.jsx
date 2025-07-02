import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/theme-provider'

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="relative p-2 h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent hover:border-border transition-all duration-200 rounded-lg"
    >
      <Moon
        className={`h-4 w-4 transition-all duration-500 ease-in-out ${
          theme === 'dark'
            ? 'rotate-90 scale-0 opacity-0'
            : 'rotate-0 scale-100 opacity-100'
        }`}
      />
      <Sun
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 transition-all duration-500 ease-in-out ${
          theme === 'dark'
            ? 'rotate-0 scale-100 opacity-100'
            : '-rotate-90 scale-0 opacity-0'
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
