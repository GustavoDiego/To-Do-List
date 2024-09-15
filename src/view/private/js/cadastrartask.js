document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form')

    taskForm.addEventListener('submit', async (event) => {
        event.preventDefault()
        const name = document.getElementById('task-name').value
        const description = document.getElementById('task-desc').value
        const priority = document.getElementById('task-priority').value


        if (!name || !description || !priority) {
            alert('Por favor, preencha todos os campos.')
            return
        }
        if (description.length > 140){
            alert('Por favor, a descrição deve ter no máximo 140 caracteres')
            return
            }
        

        try {
            const token = localStorage.getItem('token')
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },

                body: JSON.stringify({ name, description, priority })
            })

            if (response.ok) {
                const data = await response.json()
                alert(data.message || 'Task criada com sucesso!')
                taskForm.reset()
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Erro ao criar task.')
            }
        } catch (error) {
            console.error('Erro na requisição:', error)
            alert('Ocorreu um erro ao tentar criar a task.')
        }
    })
})
