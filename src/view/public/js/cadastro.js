document.querySelector('.register-form').addEventListener('submit', async (event) => {
    event.preventDefault()

    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const confirmPassword = document.getElementById('confirm-password').value


    if (password.length < 3) {
        alert('A senha deve ter pelo menos 3 caracteres.')
        return
    }


    if (password !== confirmPassword) {
        alert('As senhas não coincidem.')
        return
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        })

        if (response.ok) {
            const data = await response.json()
            alert(data.message || 'Cadastro realizado com sucesso!');
            
            window.location.href = '/login'
        } else {
            const errorData = await response.json()
            alert(errorData.error || 'Erro ao cadastrar.')
        }
    } catch (error) {
        console.error('Erro na requisição:', error)
        alert('Ocorreu um erro ao tentar cadastrar.')
    }
})
