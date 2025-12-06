"use client"

import { useRouter } from "next/navigation"
import React, { useEffect, useState, useRef } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Toaster } from "sonner"
import { PlusCircle, LogOut, Loader2, Sun, Moon, Edit, Trash2, Copy, KeyRound } from "lucide-react"

interface PasswordEntry {
  id: string
  site: string
  username: string
  password: string
}

export default function VaultPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwords, setPasswords] = useState<PasswordEntry[]>([])
  const [currentPassword, setCurrentPassword] = useState<PasswordEntry | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  // Ref para o formulário do modal, para poder resetá-lo
  const formRef = useRef<HTMLFormElement>(null)

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

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("isLoggedIn")
    if (loggedIn === "true") {
      setIsAuthenticated(true)
    } else {
      router.push("/") // Redireciona se não estiver logado
    }
  }, [router])

  const formatSiteUrl = (siteUrl: string) => {
    if (!siteUrl) return ''
    // Remove o protocolo e "www." do início da string.
    return siteUrl.replace(/^(https?:\/\/)?(www\.)?/, '')
  }

  const getFaviconUrl = (siteUrl: string) => {
    try {
      const url = new URL(siteUrl)
      // Usando o serviço público do Google para favicons. sz=64 para um ícone de 64x64.
      return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`
    } catch (error) {
      // Retorna nulo se a URL for inválida
      return null
    }
  }

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  // Efeito para aplicar a classe do tema no HTML e salvar no localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(theme)
      localStorage.setItem('theme', theme)
    }
  }, [theme])

  const handleLogout = () => {
    // No futuro, aqui você limpará o token/sessão do usuário
    console.log("Fazendo logout...")
    sessionStorage.removeItem("isLoggedIn") // Limpa o estado de login
    router.push("/") // Redireciona para a página de login
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const site = formData.get("site") as string
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    if (currentPassword) {
      // Editar senha existente
      setPasswords(passwords.map(p => p.id === currentPassword.id ? { ...p, site, username, password } : p))
    } else {
      // Adicionar nova senha
      const newPassword: PasswordEntry = { id: Date.now().toString(), site, username, password }
      setPasswords([...passwords, newPassword])
    }

    setIsModalOpen(false)
    setCurrentPassword(null)
    formRef.current?.reset() // Limpa os campos do formulário
  }

  const handleEdit = (password: PasswordEntry) => {
    setCurrentPassword(password)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setPasswords(passwords.filter(p => p.id !== id))
  }

  const handleCopy = (password: string) => {
    navigator.clipboard.writeText(password).then(() => toast.success("Senha copiada para a área de transferência!"))
  }

  // Mostra um loader enquanto verifica a autenticação para evitar piscar a tela
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-700 dark:text-zinc-300" />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-zinc-100 dark:bg-zinc-950 p-4 sm:p-8 transition-colors duration-300">
      {/* Componente para renderizar os Toasts. richColors habilita cores diferentes para success, error, etc. */}
      <Toaster position="top-center" richColors />

      <Card className="w-full max-w-4xl mx-auto shadow-lg dark:bg-zinc-900 dark:border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold dark:text-zinc-50">Seu Cofre</CardTitle>
            <CardDescription className="dark:text-zinc-400">
              Aqui estão suas senhas e credenciais salvas.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Alternar tema</span>
            </Button>
            <Button onClick={handleLogout} variant="outline" className="dark:text-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </CardHeader>

        <CardContent className="min-h-[400px]">
          {passwords.length === 0 ? (
            <div className="text-center py-16 text-zinc-500 dark:text-zinc-400 border-2 border-dashed dark:border-zinc-700 rounded-lg flex flex-col items-center justify-center">
              <KeyRound className="h-12 w-12 mb-4 text-zinc-400" />
              <p className="font-semibold">Seu cofre está vazio.</p>
              <p className="text-sm">Adicione sua primeira senha para começar.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px] dark:text-zinc-300">Site</TableHead>
                  <TableHead className="dark:text-zinc-300">Usuário</TableHead>
                  <TableHead className="text-right dark:text-zinc-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {passwords.map((p) => (
                  <TableRow key={p.id} className="dark:border-zinc-800">
                    <TableCell className="font-medium dark:text-zinc-50 max-w-[250px]">
                      <div className="flex items-center gap-3">
                        {getFaviconUrl(p.site) ? (
                          <img
                            src={getFaviconUrl(p.site)!}
                            alt={`Ícone de ${formatSiteUrl(p.site)}`}
                            className="h-6 w-6 rounded-md object-contain"
                          />
                        ) : (
                          <div className="h-6 w-6 flex items-center justify-center bg-zinc-200 dark:bg-zinc-800 rounded-md">
                            <KeyRound className="h-4 w-4 text-zinc-500" />
                          </div>
                        )}
                        <span className="truncate">{formatSiteUrl(p.site)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="dark:text-zinc-300">{p.username}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="cursor-pointer" onClick={() => handleCopy(p.password)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="cursor-pointer" onClick={() => handleEdit(p)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 dark:hover:text-red-400 cursor-pointer">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="dark:bg-zinc-900 dark:border-zinc-800">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="dark:text-zinc-50">Tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription className="dark:text-zinc-400">
                              Esta ação não pode ser desfeita. A senha para "{formatSiteUrl(p.site)}" será excluída permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="dark:bg-transparent dark:text-zinc-50 dark:hover:bg-zinc-800 cursor-pointer">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(p.id)} className="bg-red-600 hover:bg-red-700 dark:text-zinc-50 cursor-pointer">Excluir</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>

        <CardFooter className="border-t dark:border-zinc-800 pt-6 flex justify-end">
          <Dialog open={isModalOpen} onOpenChange={(open) => {
            setIsModalOpen(open)
            if (!open) {
              setCurrentPassword(null)
              formRef.current?.reset()
            }
          }}>
            <DialogTrigger asChild>
              <Button className="dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer">
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Nova Senha
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] dark:bg-zinc-900 dark:border-zinc-800">
              <DialogHeader>
                <DialogTitle className="dark:text-zinc-50">{currentPassword ? "Editar Senha" : "Adicionar Nova Senha"}</DialogTitle>
                <DialogDescription className="dark:text-zinc-400">
                  Preencha os detalhes da credencial.
                </DialogDescription>
              </DialogHeader>
              <form ref={formRef} onSubmit={handleFormSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="site" className="text-right dark:text-zinc-300">Site/App</Label>
                    <Input id="site" name="site" defaultValue={currentPassword?.site} className="col-span-3 dark:bg-zinc-800 dark:border-zinc-700" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right dark:text-zinc-300">Usuário/Email</Label>
                    <Input id="username" name="username" defaultValue={currentPassword?.username} className="col-span-3 dark:bg-zinc-800 dark:border-zinc-700" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right dark:text-zinc-300">Senha</Label>
                    <Input id="password" name="password" type="password" defaultValue={currentPassword?.password} className="col-span-3 dark:bg-zinc-800 dark:border-zinc-700" required />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer">{currentPassword ? "Salvar Alterações" : "Salvar Senha"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  )
}
