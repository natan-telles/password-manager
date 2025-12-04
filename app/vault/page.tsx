"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PlusCircle, LogOut, Loader2 } from "lucide-react"

export default function VaultPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("isLoggedIn")
    if (loggedIn === "true") {
      setIsAuthenticated(true)
    } else {
      router.push("/") // Redireciona se não estiver logado
    }
  }, [router])

  const handleLogout = () => {
    // No futuro, aqui você limpará o token/sessão do usuário
    console.log("Fazendo logout...")
    sessionStorage.removeItem("isLoggedIn") // Limpa o estado de login
    router.push("/") // Redireciona para a página de login
  }

  // Mostra um loader enquanto verifica a autenticação para evitar piscar a tela
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-100">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-700" />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-zinc-100 p-4 sm:p-8">
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Seu Cofre</CardTitle>
            <CardDescription>
              Aqui estão suas senhas e credenciais salvas.
            </CardDescription>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </CardHeader>

        <CardContent className="min-h-[400px]">
          <div className="text-center py-16 text-zinc-500 border-2 border-dashed rounded-lg">
            <p>Seu cofre está vazio.</p>
            <p>Adicione sua primeira senha para começar.</p>
          </div>
        </CardContent>

        <CardFooter className="border-t pt-6">
          <Button className="ml-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Nova Senha
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
