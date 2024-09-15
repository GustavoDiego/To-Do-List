document.addEventListener('DOMContentLoaded', async () => {
        const urlParams = new URLSearchParams(window.location.search)
        const taskId = urlParams.get('taskId')

        if (!taskId) {
          alert('ID da task não fornecido.')
          window.location.href = '/tasks'
          return
        }

        const response = await fetch(`/api/tasks/${taskId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        })
        const task = await response.json()

        if (!task) {
          alert('Task não encontrada.')
          window.location.href = '/tasks'
          return
        }

        document.getElementById('task-id').value = task.id
        document.getElementById('task-name').value = task.name
        document.getElementById('task-desc').value = task.description
        document.getElementById('task-priority').value = task.priority
      })

      document.getElementById('edit-task-form').addEventListener('submit', async (e) => {
        e.preventDefault()

        const taskId = document.getElementById('task-id').value
        const name = document.getElementById('task-name').value
        const description = document.getElementById('task-desc').value
        const priority = document.getElementById('task-priority').value

        if (description.length > 140){
          alert('Por favor, a descrição deve ter no máximo 140 caracteres')
          return
          }
        
        try {
          await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description, priority })
          })

          alert('Task atualizada com sucesso!')
          window.location.href = '/tasks'
        } catch (err) {
          alert('Erro ao atualizar task: ' + err.message)
        }
      })