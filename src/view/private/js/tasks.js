document.addEventListener('DOMContentLoaded', async () => {
    const userId = await getUserId()

    const minhasTaskContainer = document.getElementById('minhas-tasks-list')
    const todasTaskContainer = document.getElementById('todas-tasks-list')

    try {
      
      const minhasTasksResponse = await fetch('api/tasks/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      const minhasTasks = await minhasTasksResponse.json()

      if (!minhasTasks.length) {
        minhasTaskContainer.innerHTML = '<p>Nenhuma tarefa registrada ainda.</p>'
      } else {
        renderTasks(minhasTasks, minhasTaskContainer, userId)
      }

      
      const todasTasksResponse = await fetch('api/tasks', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      const todasTasks = await todasTasksResponse.json()

      if (!todasTasks.length) {
        todasTaskContainer.innerHTML = '<p>Nenhuma tarefa registrada ainda.</p>'
      } else {
        renderTasks(todasTasks, todasTaskContainer, userId, true)
      }
    } catch (err) {
      minhasTaskContainer.innerHTML = `<p>Erro ao carregar tarefas: ${err.message}</p>`
      todasTaskContainer.innerHTML = `<p>Erro ao carregar tarefas: ${err.message}</p>`
    }
  })

  function renderTasks(tasks, container, userId, isAllTasks = false) {
    tasks.forEach(task => {
      const taskItem = document.createElement('div')
      taskItem.classList.add('task-item')
      taskItem.dataset.taskId = task.id
      taskItem.dataset.status = task.finalizada ? 'finalizada' : 'pendente'

      const taskInfo = `
        <div class="task-info">
          <p>${task.name}</p>
          <p>Prioridade: ${task.priority}</p>
          <p>Status: ${task.finalizada ? 'Finalizada' : 'Pendente'}</p>
        </div>
      `

      let taskActions = ''
      if (task.memberId === userId && !task.finalizada) {
        taskActions = `
          <div class="task-actions">
            <button class="edit-button" title="Editar esta task">
              <img src="img/edit-icon.png" alt="Ícone Editar">
            </button>
            <button class="delete-button" title="Remover esta task">
              <img src="img/delete-icon(2).png" alt="Ícone Remover">
            </button>
            <button class="finish-button" title="Finalizar esta task">
              <img src="img/check-icon.png" alt="Ícone Finalizar">
            </button>
          </div>
        `
      }

      taskItem.innerHTML = taskInfo + taskActions
      container.appendChild(taskItem)

      const taskDescription = document.createElement('div')
      taskDescription.classList.add('task-description')
      taskDescription.style.display = 'none'
      taskDescription.innerHTML = `<p>${task.description}</p>`
      container.appendChild(taskDescription)

      taskItem.addEventListener('click', () => {
        taskDescription.style.display = taskDescription.style.display === 'none' ? 'block' : 'none'
      })

      const editButton = taskItem.querySelector('.edit-button')
      if (editButton) {
        editButton.addEventListener('click', async (e) => {
          e.stopPropagation()
          console.log(task.id)
          window.location.href = `/edittask?taskId=${task.id}`
        })
      }

      const deleteButton = taskItem.querySelector('.delete-button')
      if (deleteButton) {
        deleteButton.addEventListener('click', async (e) => {
          e.stopPropagation()
          if (confirm('Deseja realmente deletar esta task?')) {
            await deleteTask(task.id)
          }
        })
      }

      const finishButton = taskItem.querySelector('.finish-button')
      if (finishButton) {
        finishButton.addEventListener('click', async (e) => {
          e.stopPropagation()
          await updateTaskStatus(task.id, true)
        })
      }
    })
  }

  async function getUserId() {
    try {
      const response = await fetch('api/member', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      const user = await response.json()
      return user.id
    } catch (err) {
      console.error('Erro ao obter ID do usuário:', err)
      return null
    }
  }

  async function deleteTask(taskId) {
    try {
      await fetch(`api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      window.location.reload()
    } catch (err) {
      alert('Erro ao deletar tarefa: ' + err.message)
    }
  }

  async function updateTaskStatus(taskId, finalizada) {
    try {
      await fetch(`api/tasks/${taskId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ finalizada })
      })
      window.location.reload()
    } catch (err) {
      alert('Erro ao finalizar tarefa: ' + err.message)
    }
  }