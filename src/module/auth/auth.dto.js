const { z, email } = require('zod')

const loginDto = z.object({
    body: z.object({
        email: z.string().email('Email tidak valid'),
        password: z.string().min(6, 'Password minimal 6 karakter'),
    })
})

module.exports = {
    loginDto
}