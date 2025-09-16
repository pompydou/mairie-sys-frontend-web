import { redirect } from 'next/navigation'
import { authService } from '@/lib/auth-service'

export async function GET() {
  await authService.logout()
  redirect('/login')
}