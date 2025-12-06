"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  // Inicializa o tema lendo do localStorage ou usando o tema do sistema como padrão.
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') {
      return 'light' // Padrão para renderização no servidor
    }
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      return savedTheme
    }
    // Se não houver tema salvo, verifica a preferência do sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  const [view, setView] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  
  // Simula um processo de login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Agora você pode acessar os valores diretamente das variáveis de estado!
    //console.log("Email digitado:", email)
    //console.log("Senha digitada:", password)

    // Apenas para efeito visual agora
    setTimeout(() => {
        setIsLoading(false)

        if(password === "123") {
            //alert(`Login realizado com sucesso!`)
            sessionStorage.setItem("isLoggedIn", "true"); // Salva o estado de login
            router.push("/vault") // Redireciona para o cofre
        } else {
            alert("Senha incorreta. Tente novamente.")
        }
        // Aqui depois vamos redirecionar para o dashboard
    }, 1000)
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true) // Reutilizando o estado de loading
    
    // Apenas para efeito visual agora
    setTimeout(() => {
        setIsLoading(false)
        alert("Cadastro simulado com sucesso!")
        // Aqui depois vamos redirecionar para o dashboard
    }, 1000)
  }

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    // Salva a preferência do tema no localStorage
    localStorage.setItem('theme', theme)
  }, [theme])
  
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-950 p-4 transition-colors duration-300">
      {/* Botão de Tema */}
      <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={toggleTheme}>
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Alternar tema</span>
      </Button>

      <Card className="w-full max-w-md shadow-lg dark:bg-zinc-900 dark:border-zinc-800">
        
        {/* Cabeçalho do Card */}
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-zinc-900 dark:bg-zinc-800 flex items-center justify-center">
                <Lock className="text-white h-6 w-6" />
            </div>
          </div>
          {view === 'login' ? (
            <>
              <CardTitle className="text-2xl font-bold dark:text-zinc-50">Acesse seu Cofre</CardTitle>
              <CardDescription className="dark:text-zinc-400">Digite sua senha mestre para desbloquear.</CardDescription>
            </>
          ) : (
            <>
              <CardTitle className="text-2xl font-bold">Crie sua Conta</CardTitle>
              <CardDescription>
                Preencha os campos para criar seu cofre seguro.
              </CardDescription>
            </>
          )}
        </CardHeader>

        <form onSubmit={view === 'login' ? handleLogin : handleRegister}>
          <CardContent className="space-y-4">
            
            {/* Input de Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-zinc-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="voce@exemplo.com"
                  className="pl-10 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-50 dark:placeholder:text-zinc-500" // Padding left para não bater no ícone
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Input de Senha */}
            <div className="space-y-2">
              <Label htmlFor="password" className="dark:text-zinc-300">Senha Mestre</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  className="pr-10 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-50 dark:placeholder:text-zinc-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 cursor-pointer"
                  aria-label="Mostrar ou ocultar senha"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Campo extra para o formulário de cadastro */}
            {view === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="dark:text-zinc-300">Confirmar Senha Mestre</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-50 dark:placeholder:text-zinc-500"
                    required
                  />
                </div>
              </div>
            )}

          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-4">
            {/* Botão Principal (Login ou Cadastro) */}
            <Button className="w-full dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {view === 'login' ? 'Entrando...' : 'Criando conta...'}
                </>
              ) : (
                <>
                  {view === 'login' ? 'Entrar' : 'Criar Conta'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            {/* Link para alternar entre as visões */}
            <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              {view === 'login' ? (
                <>
                  Não tem uma conta?{' '}
                  <button
                    type="button"
                    onClick={() => setView('register')}
                    className="font-semibold text-zinc-900 hover:underline dark:text-zinc-100 cursor-pointer"
                  >
                    Cadastre-se
                  </button>
                </>
              ) : (
                <>
                  Já tem uma conta?{' '}
                  <button
                    type="button"
                    onClick={() => setView('login')}
                    className="font-semibold text-zinc-900 hover:underline dark:text-zinc-100 cursor-pointer"
                  >
                    Faça login
                  </button>
                </>
              )}
            </div>
          </CardFooter>
        </form>
      </Card>
      
      {/* Rodapé fora do card */}
      <div className="absolute bottom-4 text-center text-xs text-zinc-500 dark:text-zinc-600">
        Protegido com criptografia de ponta a ponta.
      </div>
    </div>
  )
}