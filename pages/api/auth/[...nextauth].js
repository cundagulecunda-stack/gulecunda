import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { google } from 'googleapis'

const refreshAccessToken = async (token) => {
  try {
    const oAuth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET)
    oAuth2Client.setCredentials({ refresh_token: token.refreshToken })
    const res = await oAuth2Client.getAccessToken()
    return {
      ...token,
      accessToken: res.token,
      accessTokenExpires: Date.now() + 3600 * 1000,
      refreshToken: token.refreshToken ?? token.refreshToken,
    }
  } catch (error) {
    return { ...token, error: 'RefreshAccessTokenError' }
  }
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets',
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + account.expires_in * 1000,
          refreshToken: account.refresh_token,
          user
        }
      }
      if (Date.now() < token.accessTokenExpires) return token
      return await refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.user = token.user
      session.accessToken = token.accessToken
      session.error = token.error
      return session
    }
  }
})
