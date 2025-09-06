import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { supabase } from '../../../lib/supabase'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          // Check if user exists in allowed_user table
          const { data: existingUser, error } = await supabase
            .from('allowed_user')
            .select('*')
            .eq('email', user.email)
            .single()

          if (error && error.code !== 'PGRST116') {
            console.error('Error checking user:', error)
            return false
          }

          // If user doesn't exist in allowed_user table, deny access
          if (!existingUser) {
            console.log('User not found in allowed_user table:', user.email)
            return false
          }

          // Update user info if needed
          if (existingUser.name !== user.name) {
            await supabase
              .from('allowed_user')
              .update({ name: user.name })
              .eq('email', user.email)
          }

          return true
        } catch (error) {
          console.error('SignIn error:', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token
        token.userId = user.id
        token.email = user.email || undefined
        token.name = user.name || undefined
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user?.email) {
        try {
          // Get user role from allowed_user table
          const { data: userData, error } = await supabase
            .from('allowed_user')
            .select('id, role, name')
            .eq('email', session.user.email)
            .single()

          if (userData && !error) {
            session.accessToken = token.accessToken
            session.user.id = userData.id.toString()
            session.user.email = token.email || null
            session.user.name = userData.name || token.name || null
            // Add role to session
            ;(session as any).user.role = userData.role
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
})
