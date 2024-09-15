document.querySelector('.edit-form').addEventListener('submit', async (event) => {
    event.preventDefault()

    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const confirmPassword = document.getElementById('confirm-password').value

    if (password !== confirmPassword) {
        alert('As senhas não coincidem.')
        return
    }

    try {
        const response = await fetch('/api/member', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ name, email, password })
        })

        if (response.ok) {
            const data = await response.json()
            alert(data.message || 'Dados atualizados com sucesso!')
            window.location.href = '/profile'
        } else {
            const errorData = await response.json();
            alert(errorData.error || 'Erro ao atualizar os dados.')
        }
    } catch (error) {
        console.error('Erro na requisição:', error)
        alert('Ocorreu um erro ao tentar atualizar os dados.')
    }
})
