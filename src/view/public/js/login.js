document.querySelector('.login-form').addEventListener('submit', async (event) => {
    event.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })

        if (response.ok) {
            const data = await response.json()

            localStorage.setItem('token', data.token)

            alert(data.message || 'Login realizado com sucesso!')
           
            window.location.href = '/home'
        } else {
            const errorData = await response.json
            alert(errorData.error || 'Erro ao fazer login.')
        }
    } catch (error) {
        console.error('Erro na requisição:', error)
        alert('Ocorreu um erro ao tentar fazer login.')
    }
})
