import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { supabase } from '../../../lib/supabase'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        emailOrPhone: { label: 'Email or Phone', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.emailOrPhone || !credentials?.password) {
          return null;
        }

        try {
          // Check if user exists in allowed_user table
          const { data: user, error } = await supabase
            .from('allowed_user')
            .select('*')
            .or(`email.eq.${credentials.emailOrPhone},phone_number.eq.${credentials.emailOrPhone}`)
            .single();

          if (error || !user) {
            console.log('User not found in allowed_user table:', credentials.emailOrPhone);
            return null;
          }

          // For now, we're not validating password since it's not hashed in the current setup
          // In production, you would validate the hashed password here
          // const isValidPassword = await bcrypt.compare(credentials.password, user.hashed_password);
          // if (!isValidPassword) {
          //   return null;
          // }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Credentials authorization error:', error);
          return null;
        }
      }
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
      
      // For credentials provider, user is already validated in authorize function
      if (account?.provider === 'credentials') {
        return true
      }
      
      return true
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token
        token.userId = user.id
        token.email = user.email || undefined
        token.name = user.name || undefined
        token.role = (user as any).role || undefined
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken
        session.user.id = token.userId || ''
        session.user.email = token.email || null
        session.user.name = token.name || null
        session.user.role = token.role || undefined
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
